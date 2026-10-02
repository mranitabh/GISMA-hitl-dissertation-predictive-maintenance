# Human-in-the-Loop Predictive Maintenance Framework

**MSc Dissertation — GISMA University of Applied Sciences**

> A decision-support framework that integrates machine-learning RUL (Remaining Useful Life) prediction with human-in-the-loop oversight for turbofan engine maintenance, using the NASA C-MAPSS FD001 dataset.

---

## Overview

This repository contains the implementation artefacts for the dissertation:

**"Human-in-the-Loop Decision Support for Predictive Maintenance: Integrating Uncertainty-Aware ML with Expert Oversight"**

The system demonstrates how an ML prediction pipeline can be combined with:
- **Uncertainty quantification** (conformal prediction intervals)
- **Explainability** (SHAP-based feature attribution)
- **Policy-driven decision rules** (threshold-based prioritisation)
- **Human review gates** (approve / modify / reject workflow)
- **Immutable audit logging** (full decision traceability)

### Architecture

```
Sensor Data → Input Validation → Prediction Service (FastAPI)
    → Rule-Based Prioritisation → Human Review Form (n8n)
    → Audit Log → Final Recommendation
```

---

## Repository Structure

```
├── service/                        # Prediction microservice
│   ├── prediction_service.py       # FastAPI service wrapping the frozen model
│   └── requirements.txt            # Python dependencies
│
├── workflow/                       # n8n workflow definitions
│   ├── fd001_maintenance_prioritisation.json   # Full 12-node production workflow
│   └── THESIS_HITL_CORE_V1_FROZEN_20260909.json  # Frozen HITL core (V1)
│
├── config/
│   └── threshold_policy.json       # RUL priority thresholds (research assumptions)
│
├── schemas/
│   ├── request.schema.json         # Input validation schema (18 predictors)
│   └── response.schema.json        # Audit record output schema
│
├── docs/
│   └── THRESHOLD_POLICY.md         # Threshold rationale and limitations
│
├── docker/
│   ├── docker-compose.yml          # PostgreSQL + n8n stack
│   ├── database-init.sql           # HITL request table schema
│   └── .env.example                # Environment template (no secrets)
│
├── notebooks/
│   └── Ranitabh_Thesis_Implementation_FINAL.ipynb  # Full Colab notebook (Phases 1–7)
│
├── audit_examples/                 # Sample HITL audit log records (JSON)
│
├── screenshots/                    # Workflow and UI evidence
│   ├── 04_n8n_Workflow_Canvas.png
│   ├── APPROVE PATH.png
│   ├── HITL FORM.png
│   ├── HUMAN DECISION.png
│   ├── MODIFY - INVALID DECISION.png
│   ├── MODIFY.png
│   └── reject path.png
│
├── executed_notebook/              # Rendered notebook outputs (HTML)
│
├── LICENSE
└── README.md
```

---

## Prerequisites

- **Python** 3.10+
- **Docker** & Docker Compose (for the n8n + PostgreSQL stack)
- **n8n** (runs via Docker)
- The **Phase 4 model bundle** (frozen `.joblib` file from the training pipeline — not included in this repo due to size; see [Model Artefact](#model-artefact) below)

---

## Quick Start

### 1. Start the infrastructure

```bash
cd docker
cp .env.example .env
# Edit .env — set your own POSTGRES_PASSWORD and N8N_ENCRYPTION_KEY
docker compose up -d
```

### 2. Start the prediction service

```bash
cd service
pip install -r requirements.txt

# Set the path to your model artefacts
export FD001_PROJECT_ROOT=/path/to/Predictive_Maintenance_Thesis

uvicorn prediction_service:app --host 127.0.0.1 --port 8000
```

### 3. Verify

```bash
curl -s http://127.0.0.1:8000/health | python -m json.tool
```

`status` must be `ok` and `model_name` must match the Phase 4 frozen model.

### 4. Import the n8n workflow

Open n8n at `http://localhost:5680`, import `workflow/fd001_maintenance_prioritisation.json`, and activate it.

---

## How It Works

### Prediction Service (`service/prediction_service.py`)

A FastAPI microservice that:
1. Loads the frozen Phase 4 XGBoost model bundle
2. Validates incoming sensor readings (18 predictors, rejects target leakage)
3. Produces a point RUL prediction
4. Applies the threshold policy to classify priority
5. Generates SHAP-based explanations
6. Returns a structured response with provenance metadata

### n8n Workflow (12 nodes)

| Group | Nodes | Purpose |
|---|---|---|
| Intake & Validation | 1–3, E1, E3 | Webhook intake, schema validation, fail-closed rejection |
| Prediction | 4, E2 | Calls local FastAPI service, handles service failure |
| Routing | 5–6 | Attaches uncertainty metadata, 5-way priority routing |
| Human Review | 7a–8 | Automated path for low-risk; form-based review for escalations |
| Audit & Response | 9–12 | Builds immutable audit record, persists JSON, responds |

### Decision Rules

Priority is determined by the **lower prediction bound** (not the point estimate), following a safety-conservative design:

| Priority | Condition | Action |
|---|---|---|
| `routine_monitoring` | Lower bound ≥ 60 cycles | No intervention |
| `plan_maintenance` | Lower bound 30–60 cycles | Schedule maintenance |
| `urgent_human_review` | Lower bound < 30 cycles | Immediate human review |
| `data_quality_review` | Validation failure | Data investigation |
| `prediction_unavailable` | Service error | Escalate to human |

> ⚠️ **All thresholds are stipulated research assumptions**, not derived from operational data. See [`docs/THRESHOLD_POLICY.md`](docs/THRESHOLD_POLICY.md).

---

## Model Artefact

The trained model (`.joblib`) is not included in this repository due to file size. To reproduce:

1. Run the thesis training notebook (Phases 1–4) on the [NASA C-MAPSS FD001 dataset](https://data.nasa.gov/Aerospace/CMAPSS-Jet-Engine-Simulated-Data/ff5v-kuh6)
2. The notebook produces `phase4_final_model_registry.json` and the model bundle under `models/regression/`
3. Point `FD001_PROJECT_ROOT` at the output directory

---

## Limitations

This is a **research prototype** — not validated for operational use:

1. **Thresholds are unapproved assumptions** with no cost or safety evidence
2. **Human review is simulated** — no qualified engineer reviewed any case
3. **No authentication or encryption** — loopback-only prototype
4. **Uncertainty interval not fully calibrated** — Phase 5 conformal calibration pending
5. **Single dataset** (FD001), single operating condition, single fault mode
6. **No fleet-level logic** — each engine judged independently
7. **Audit log is mutable** — no tamper-evident guarantees
8. **Sensor readings are trusted** — no drift or calibration-fault detection

See [`docs/THRESHOLD_POLICY.md`](docs/THRESHOLD_POLICY.md) for the full rationale.

---

## Dataset

**NASA C-MAPSS (Commercial Modular Aero-Propulsion System Simulation)**
- Subset: **FD001** — single operating condition, single fault mode (HPC degradation)
- 100 training engines, run-to-failure trajectories
- 100 test engines, partial trajectories
- 21 sensor channels + 3 operational settings

Source: [NASA Open Data Portal](https://data.nasa.gov/Aerospace/CMAPSS-Jet-Engine-Simulated-Data/ff5v-kuh6)

---

## Citation

If you reference this work:

```
Mallick, R. (2026). Human-in-the-Loop Decision Support for Predictive Maintenance:
Integrating Uncertainty-Aware ML with Expert Oversight. MSc Dissertation,
GISMA University of Applied Sciences.
```

---

## License

[MIT](LICENSE)
