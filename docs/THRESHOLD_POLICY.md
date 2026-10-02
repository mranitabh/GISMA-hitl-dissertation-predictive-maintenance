# Threshold Policy — DRAFT v0.1.0

**Status: NOT APPROVED. Every value here is a research assumption.**

`[RANITABH INPUT REQUIRED]` — this document must be reviewed and formally
approved before any threshold appears in Chapter 5 as an operational rule.

Phase 8 of the master prompt requires a threshold-policy document to exist
*before* the rule layer is used. This is that document. It is deliberately
written so that a reader can see exactly which numbers are evidence and which
are assumptions. At present, **none of the numbers is evidence.**

---

## 1. Why thresholds cannot be derived from the data

A maintenance threshold is an economic and safety decision, not a statistical
one. To derive it properly you would need at minimum:

- the cost of an unplanned in-service failure;
- the cost of a premature engine removal;
- the lead time to procure a replacement engine or part;
- the maintenance slot availability at the operating base;
- the regulatory minimum inspection interval;
- the operator's accepted risk of failure per flight hour.

**None of these exists for C-MAPSS.** FD001 is simulated data with no attached
cost model, no operator, and no regulatory context. Any threshold stated in
this thesis is therefore a *stipulated research assumption used to demonstrate
the mechanism*, and must be labelled as such every time it appears.

Do not invent a cost ratio to make the analysis look more industrial. An
examiner who knows the dataset will recognise a fabricated cost model
immediately.

---

## 2. Proposed RUL priority boundaries

| Boundary | Proposed value | Basis |
|---|---|---|
| `urgent_below` | 30 cycles | **ASSUMED** |
| `plan_maintenance_below` | 60 cycles | **ASSUMED** |
| `routine_at_or_above` | 60 cycles | **ASSUMED** |

Rationale for the *structure* (not the numbers): three bands are the minimum
needed to distinguish "act now", "schedule it", and "do nothing", which is the
decision structure a maintenance planner actually faces.

Rationale for the *numbers*: they were chosen only so that the prototype
produces a non-degenerate distribution of engines across all three states.
That is a testing convenience, not evidence.

---

## 3. Proposed uncertainty boundary

| Boundary | Proposed value | Basis |
|---|---|---|
| `wide_interval_width_cycles` | 60 cycles | **ASSUMED — PROVISIONAL** |

**This value cannot be finalised before Phase 5.** If the empirical average
conformal interval width turns out to exceed 60 cycles, this threshold would
escalate essentially every engine to human review, which would make the
prototype useless and the result uninterpretable.

**Required action after Phase 5:** set this threshold relative to the observed
width distribution (for example at the 75th percentile of calibration interval
widths), and state that choice explicitly.

---

## 4. Safety rationale — decide on the lower bound

The rule layer takes its decision from the **lower prediction bound**, not the
point estimate.

Reason: acting on the point estimate accepts roughly a 50% chance that true
remaining life is shorter than assumed. In a maintenance context the two errors
are not symmetric. Removing an engine too early wastes remaining life and
money. Leaving an engine in service too long risks in-service failure. Your
row-level PHM diagnostic already encodes that asymmetry, and the decision rule
should be consistent with it.

This is also why the workflow **fails closed**: if the model is unavailable, the
input is malformed, or the interval is uncalibrated, the system escalates to a
human rather than defaulting to "routine monitoring".

---

## 5. Operational assumptions being made

These are assumptions, and each is a limitation for Chapter 6:

1. One prediction per engine-cycle is sufficient; no trajectory smoothing or
   trend confirmation across consecutive cycles is applied.
2. All engines are equally critical. No fleet-level prioritisation, no spare
   availability, no base capacity constraint.
3. Maintenance capacity is unlimited, so an "urgent" classification can always
   be acted upon.
4. Sensor readings arriving at the service are trusted once they pass finiteness
   and completeness checks. No drift or calibration-fault detection exists.
5. The anonymised sensors have no known physical meaning, so no failure-mode
   specific rule can be written.

---

## 6. Sensitivity-analysis plan (NOT YET EXECUTED)

| Parameter | Grid to test |
|---|---|
| `urgent_below` | 20, 30, 40 cycles |
| `plan_maintenance_below` | 45, 60, 90 cycles |
| `wide_interval_width_cycles` | 40, 60, 80 cycles |

**Report:** for each combination, the proportion of validation engine-cycles
falling into each output state, and — most importantly — **the proportion of
cases whose recommended action changes across the grid**. A rule layer whose
output flips under small threshold changes is not a decision-support system,
it is a coin toss with extra steps. Say so if that is what the data shows.

---

## 7. Human-review trigger (proposed)

Escalate when **any** of the following holds:

1. priority is `urgent_human_review`;
2. interval width exceeds the uncertainty boundary;
3. the interval is not calibrated;
4. any data-quality rule fails;
5. the prediction service errored or was unreachable.

---

## 8. Explicit statement required in the thesis

> The RUL and uncertainty thresholds applied in this framework are stipulated
> research assumptions. They are not derived from operator cost data,
> maintenance contracts, airworthiness requirements or any verified business
> evidence, none of which accompanies the simulated C-MAPSS dataset. They are
> used to demonstrate the decision mechanism and are subjected to sensitivity
> analysis. They must not be interpreted as recommended operational values.

---

## 9. Approval block

| Field | Value |
|---|---|
| Approved by | `[RANITABH INPUT REQUIRED]` |
| Approval date | `[RANITABH INPUT REQUIRED]` |
| Supervisor consulted | `[GISMA REQUIREMENT TO CONFIRM]` |
| Policy version on approval | 0.1.0 |

Once approved, update `approval_status`, `approved_by` and `approved_at_utc`
in `config/threshold_policy.json`, bump `policy_version`, and record the new
file SHA-256 in the thesis evidence ledger. The service reports the policy
hash on every response, so the audit trail will show which policy version
produced which recommendation.
