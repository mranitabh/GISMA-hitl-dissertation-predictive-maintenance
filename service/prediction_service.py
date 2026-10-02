"""
FD001 local prediction service for the n8n maintenance-prioritisation prototype.

RESEARCH PROTOTYPE — NOT FOR OPERATIONAL USE.

WHAT THIS IS
    A small local HTTP service that wraps the frozen Phase 4 model bundle so
    that n8n can call it. It runs entirely on your machine. No paid API, no
    cloud dependency, no Google Drive.

WHAT IT DELIBERATELY DOES NOT DO
    It does not invent a prediction interval. Until Phase 5 produces a
    calibrated engine-aware conformal quantile, every response is marked
    interval_status = "NOT_CALIBRATED" and carries no numeric bounds. The
    business-rule layer treats that as an automatic escalation to human
    review. This is the honest behaviour: an uncertainty-aware system that
    has no calibrated uncertainty must say so, not fabricate a band.

RUN
    pip install -r requirements.txt
    uvicorn prediction_service:app --host 127.0.0.1 --port 8000

ENDPOINTS
    GET  /health   service and artifact status
    POST /predict  single engine-cycle prediction + rule evaluation
"""

from __future__ import annotations

import hashlib
import json
import os
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel, Field

# --------------------------------------------------------------------------
# CONFIGURATION
# --------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = Path(
    os.environ.get("FD001_PROJECT_ROOT", BASE_DIR / "artifacts")
)
POLICY_PATH = Path(
    os.environ.get("FD001_POLICY_PATH", BASE_DIR / "config" / "threshold_policy.json")
)
AUDIT_DB = Path(
    os.environ.get("FD001_AUDIT_DB", BASE_DIR / "audit" / "review_audit.sqlite")
)

WORKFLOW_VERSION = "0.1.0-prototype"
SERVICE_VERSION = "0.1.0-prototype"

# Phase 5 has not run. When it does, set these two values from the frozen
# conformal record and flip CONFORMAL_CALIBRATED to True.
CONFORMAL_CALIBRATED = False
CONFORMAL_QUANTILE_CYCLES: float | None = None
CONFORMAL_CONFIDENCE_LEVEL: float | None = None
CONFORMAL_RECORD_SHA256: str | None = None


def sha256_of(path: Path) -> str | None:
    if not path.exists():
        return None
    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


# --------------------------------------------------------------------------
# LOAD THE FROZEN MODEL
# --------------------------------------------------------------------------

REGISTRY_PATH = PROJECT_ROOT / "logs" / "phase4_final_model_registry.json"

MODEL_BUNDLE: dict[str, Any] | None = None
MODEL_NAME = None
MODEL_SHA256 = None
FEATURE_ORDER: list[str] = []
LOAD_ERROR: str | None = None

try:
    with open(REGISTRY_PATH, encoding="utf-8") as handle:
        registry = json.load(handle)
    MODEL_NAME = registry["selected_model"]
    bundle_path = PROJECT_ROOT / "models" / "regression" / (
        Path(registry["selected_model_path"]).name
    )
    MODEL_BUNDLE = joblib.load(bundle_path)
    FEATURE_ORDER = list(MODEL_BUNDLE["feature_order"])
    MODEL_SHA256 = sha256_of(bundle_path)
except Exception as error:  # noqa: BLE001
    LOAD_ERROR = f"{type(error).__name__}: {error}"

with open(POLICY_PATH, encoding="utf-8") as handle:
    POLICY = json.load(handle)

POLICY_SHA256 = sha256_of(POLICY_PATH)


# --------------------------------------------------------------------------
# AUDIT LOG
# --------------------------------------------------------------------------

AUDIT_DB.parent.mkdir(parents=True, exist_ok=True)


def init_audit() -> None:
    with sqlite3.connect(AUDIT_DB) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS prediction_audit (
                request_id TEXT PRIMARY KEY,
                created_at_utc TEXT NOT NULL,
                unit_number INTEGER,
                time_in_cycles INTEGER,
                point_rul REAL,
                lower_bound REAL,
                upper_bound REAL,
                interval_width REAL,
                interval_status TEXT,
                uncertainty_flag INTEGER,
                priority TEXT,
                proposed_action TEXT,
                requires_human_review INTEGER,
                top_drivers TEXT,
                data_quality_status TEXT,
                model_name TEXT,
                model_sha256 TEXT,
                policy_version TEXT,
                policy_sha256 TEXT,
                service_version TEXT,
                workflow_version TEXT
            )
            """
        )
        connection.commit()


init_audit()


def write_audit(record: dict[str, Any]) -> None:
    with sqlite3.connect(AUDIT_DB) as connection:
        connection.execute(
            """
            INSERT OR REPLACE INTO prediction_audit VALUES
            (:request_id,:created_at_utc,:unit_number,:time_in_cycles,
             :point_rul,:lower_bound,:upper_bound,:interval_width,
             :interval_status,:uncertainty_flag,:priority,:proposed_action,
             :requires_human_review,:top_drivers,:data_quality_status,
             :model_name,:model_sha256,:policy_version,:policy_sha256,
             :service_version,:workflow_version)
            """,
            record,
        )
        connection.commit()


# --------------------------------------------------------------------------
# REQUEST / RESPONSE MODELS
# --------------------------------------------------------------------------


class PredictionRequest(BaseModel):
    unit_number: int = Field(..., ge=1, description="Engine identifier. NEVER a predictor.")
    time_in_cycles: int = Field(..., ge=1)
    operational_setting_1: float
    operational_setting_2: float
    sensor_2: float
    sensor_3: float
    sensor_4: float
    sensor_6: float
    sensor_7: float
    sensor_8: float
    sensor_9: float
    sensor_11: float
    sensor_12: float
    sensor_13: float
    sensor_14: float
    sensor_15: float
    sensor_17: float
    sensor_20: float
    sensor_21: float


# --------------------------------------------------------------------------
# BUSINESS-RULE LAYER
# --------------------------------------------------------------------------


def evaluate_rules(
    point_rul: float | None,
    lower_bound: float | None,
    interval_width: float | None,
    interval_status: str,
    data_quality_ok: bool,
) -> dict[str, Any]:
    """Transparent, ordered rule evaluation.

    Order matters and is deliberate:
        1. data quality       — never act on bad input
        2. prediction failure — never act on no prediction
        3. uncalibrated / wide uncertainty — escalate rather than guess
        4. RUL bands          — only reached when the evidence is sound
    """
    reasons: list[str] = []
    boundaries = POLICY["rul_priority_boundaries_cycles"]
    width_limit = POLICY["uncertainty_boundary"]["wide_interval_width_cycles"]

    if not data_quality_ok:
        reasons.append("One or more data-quality rules failed.")
        return {
            "priority": "data_quality_review",
            "proposed_action": "Withhold recommendation and inspect the input record.",
            "requires_human_review": True,
            "uncertainty_flag": True,
            "reasons": reasons,
        }

    if point_rul is None:
        reasons.append("The model did not return a prediction.")
        return {
            "priority": "prediction_unavailable",
            "proposed_action": "Escalate to an engineer. Do not infer a default action.",
            "requires_human_review": True,
            "uncertainty_flag": True,
            "reasons": reasons,
        }

    if interval_status != "CALIBRATED":
        reasons.append(
            "No calibrated prediction interval is available "
            "(Phase 5 conformal calibration has not been completed). "
            "The system cannot certify its own uncertainty, so it escalates."
        )
        return {
            "priority": "urgent_human_review",
            "proposed_action": (
                f"Engineer review required. Point RUL estimate is "
                f"{point_rul:.1f} cycles with UNQUANTIFIED uncertainty."
            ),
            "requires_human_review": True,
            "uncertainty_flag": True,
            "reasons": reasons,
        }

    if interval_width is not None and interval_width > width_limit:
        reasons.append(
            f"Interval width {interval_width:.1f} exceeds the assumed "
            f"boundary of {width_limit} cycles."
        )
        return {
            "priority": "urgent_human_review",
            "proposed_action": "Engineer review required due to wide uncertainty.",
            "requires_human_review": True,
            "uncertainty_flag": True,
            "reasons": reasons,
        }

    # Safety-conscious: decide on the pessimistic bound, not the point estimate.
    decision_value = lower_bound if lower_bound is not None else point_rul
    reasons.append(
        f"Decision taken on the lower prediction bound "
        f"({decision_value:.1f} cycles), not the point estimate."
    )

    if decision_value < boundaries["urgent_below"]:
        return {
            "priority": "urgent_human_review",
            "proposed_action": "Schedule immediate inspection and confirm with an engineer.",
            "requires_human_review": True,
            "uncertainty_flag": False,
            "reasons": reasons,
        }

    if decision_value < boundaries["plan_maintenance_below"]:
        return {
            "priority": "plan_maintenance",
            "proposed_action": "Add to the forward maintenance plan.",
            "requires_human_review": False,
            "uncertainty_flag": False,
            "reasons": reasons,
        }

    return {
        "priority": "routine_monitoring",
        "proposed_action": "Continue routine monitoring. No action required.",
        "requires_human_review": False,
        "uncertainty_flag": False,
        "reasons": reasons,
    }


def top_drivers(frame: pd.DataFrame) -> list[dict[str, Any]]:
    """Provisional model-level drivers.

    NOT SHAP. These are global importances read from the fitted estimator and
    are identical for every request. They are a structural placeholder so the
    n8n explanation node can be built and tested now. Phase 7 replaces this
    with per-row SHAP values. The response labels them accordingly.
    """
    model = MODEL_BUNDLE["model"] if MODEL_BUNDLE else None
    if model is None or not hasattr(model, "feature_importances_"):
        return []
    pairs = sorted(
        zip(FEATURE_ORDER, model.feature_importances_),
        key=lambda item: item[1],
        reverse=True,
    )[:5]
    return [
        {
            "feature": name,
            "importance": float(value),
            "value_for_this_row": float(frame.iloc[0][name]),
        }
        for name, value in pairs
    ]


# --------------------------------------------------------------------------
# APP
# --------------------------------------------------------------------------

app = FastAPI(
    title="FD001 RUL Prediction Service (research prototype)",
    version=SERVICE_VERSION,
)


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok" if MODEL_BUNDLE is not None else "model_not_loaded",
        "service_version": SERVICE_VERSION,
        "workflow_version": WORKFLOW_VERSION,
        "model_name": MODEL_NAME,
        "model_sha256": MODEL_SHA256,
        "feature_count": len(FEATURE_ORDER),
        "conformal_calibrated": CONFORMAL_CALIBRATED,
        "conformal_confidence_level": CONFORMAL_CONFIDENCE_LEVEL,
        "policy_version": POLICY["policy_version"],
        "policy_approval_status": POLICY["approval_status"],
        "load_error": LOAD_ERROR,
        "disclaimer": "Research prototype. Not validated for operational use.",
    }


@app.post("/predict")
def predict(request: PredictionRequest) -> dict[str, Any]:
    request_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    payload = request.model_dump()

    # ---- data-quality evaluation ----
    quality_issues: list[str] = []
    missing = [f for f in FEATURE_ORDER if f not in payload]
    if missing:
        quality_issues.append(f"Missing predictors: {missing}")
    non_finite = [
        f for f in FEATURE_ORDER
        if f in payload and not np.isfinite(float(payload[f]))
    ]
    if non_finite:
        quality_issues.append(f"Non-finite predictors: {non_finite}")
    if payload["time_in_cycles"] < 1:
        quality_issues.append("time_in_cycles must be at least 1.")

    data_quality_ok = not quality_issues

    point_rul: float | None = None
    lower_bound: float | None = None
    upper_bound: float | None = None
    interval_width: float | None = None
    interval_status = "NOT_CALIBRATED"
    drivers: list[dict[str, Any]] = []
    error_detail: str | None = None
    frame = None

    if data_quality_ok and MODEL_BUNDLE is not None:
        try:
            frame = pd.DataFrame([{f: payload[f] for f in FEATURE_ORDER}])
            if MODEL_NAME == "ridge_uncapped" and "scaler" in MODEL_BUNDLE:
                model_input = pd.DataFrame(
                    MODEL_BUNDLE["scaler"].transform(frame),
                    columns=FEATURE_ORDER,
                )
            else:
                model_input = frame
            raw = float(MODEL_BUNDLE["model"].predict(model_input)[0])
            point_rul = float(max(raw, MODEL_BUNDLE.get("prediction_lower_bound", 0.0)))
            drivers = top_drivers(frame)

            if CONFORMAL_CALIBRATED and CONFORMAL_QUANTILE_CYCLES is not None:
                lower_bound = float(max(point_rul - CONFORMAL_QUANTILE_CYCLES, 0.0))
                upper_bound = float(point_rul + CONFORMAL_QUANTILE_CYCLES)
                interval_width = upper_bound - lower_bound
                interval_status = "CALIBRATED"
        except Exception as error:  # noqa: BLE001
            error_detail = f"{type(error).__name__}: {error}"
            point_rul = None
    elif MODEL_BUNDLE is None:
        error_detail = LOAD_ERROR or "Model bundle unavailable."

    decision = evaluate_rules(
        point_rul=point_rul,
        lower_bound=lower_bound,
        interval_width=interval_width,
        interval_status=interval_status,
        data_quality_ok=data_quality_ok,
    )

    response = {
        "request_id": request_id,
        "created_at_utc": now,
        "engine": {
            "unit_number": payload["unit_number"],
            "time_in_cycles": payload["time_in_cycles"],
        },
        "prediction": {
            "point_rul_cycles": point_rul,
            "target_definition": "rul_uncapped = failure_cycle - current_cycle",
            "lower_bound_cycles": lower_bound,
            "upper_bound_cycles": upper_bound,
            "interval_width_cycles": interval_width,
            "interval_status": interval_status,
            "confidence_level": CONFORMAL_CONFIDENCE_LEVEL,
            "interval_note": (
                "Calibrated engine-aware conformal interval."
                if interval_status == "CALIBRATED"
                else "NO CALIBRATED INTERVAL. Phase 5 has not been executed. "
                     "This response deliberately does not fabricate bounds."
            ),
        },
        "explanation": {
            "top_drivers": drivers,
            "method": "global_impurity_or_gain_importance",
            "status": "PROVISIONAL — NOT SHAP, NOT ROW-SPECIFIC, NOT CAUSAL",
            "note": "Phase 7 replaces this with per-row SHAP values.",
        },
        "decision": {
            "priority": decision["priority"],
            "proposed_action": decision["proposed_action"],
            "requires_human_review": decision["requires_human_review"],
            "uncertainty_flag": decision["uncertainty_flag"],
            "reasons": decision["reasons"],
        },
        "data_quality": {
            "status": "pass" if data_quality_ok else "fail",
            "issues": quality_issues,
        },
        "provenance": {
            "model_name": MODEL_NAME,
            "model_sha256": MODEL_SHA256,
            "policy_version": POLICY["policy_version"],
            "policy_approval_status": POLICY["approval_status"],
            "policy_sha256": POLICY_SHA256,
            "service_version": SERVICE_VERSION,
            "workflow_version": WORKFLOW_VERSION,
            "conformal_record_sha256": CONFORMAL_RECORD_SHA256,
        },
        "error": error_detail,
        "disclaimer": (
            "RESEARCH PROTOTYPE. Thresholds are unapproved research "
            "assumptions. No real engineer has reviewed this output."
        ),
    }

    write_audit({
        "request_id": request_id,
        "created_at_utc": now,
        "unit_number": payload["unit_number"],
        "time_in_cycles": payload["time_in_cycles"],
        "point_rul": point_rul,
        "lower_bound": lower_bound,
        "upper_bound": upper_bound,
        "interval_width": interval_width,
        "interval_status": interval_status,
        "uncertainty_flag": int(decision["uncertainty_flag"]),
        "priority": decision["priority"],
        "proposed_action": decision["proposed_action"],
        "requires_human_review": int(decision["requires_human_review"]),
        "top_drivers": json.dumps([d["feature"] for d in drivers]),
        "data_quality_status": "pass" if data_quality_ok else "fail",
        "model_name": MODEL_NAME,
        "model_sha256": MODEL_SHA256,
        "policy_version": POLICY["policy_version"],
        "policy_sha256": POLICY_SHA256,
        "service_version": SERVICE_VERSION,
        "workflow_version": WORKFLOW_VERSION,
    })

    return response
