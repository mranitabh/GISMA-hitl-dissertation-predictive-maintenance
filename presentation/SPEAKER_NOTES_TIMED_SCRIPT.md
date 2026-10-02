# Timed Presenter Script — MSc Viva (10 minutes)

**Ranitabh Mallick** · GISMA University of Applied Sciences  
*An Uncertainty-Aware, Explainable and Human-Reviewed Framework for RUL-Based Maintenance Prioritisation*

---

## Slide 1 — Title (0:00–0:15)

Good morning/afternoon. My name is Ranitabh Mallick and this is the viva for my MSc dissertation on uncertainty-aware, explainable and human-reviewed maintenance prioritisation using NASA C-MAPSS turbofan data. The research question in one sentence: Can we move beyond a bare RUL number to give a maintenance reviewer uncertainty, explanation and a structured decision path — and what does that actually cost?

**Point to:** Title and subtitle  
**Likely question:** Why FD001 specifically?  
**Answer:** FD001 is a controlled single-fault benchmark isolating framework behaviour without confounding operational variability.

---

## Slide 2 — Why Point RUL Is Insufficient (0:15–0:50)

Imagine a maintenance planner told "this engine has 45 cycles left". They cannot judge confidence, cannot see which sensors drove that estimate, and have no structured way to override it. That is the gap. Notably, the naive age-only baseline — just counting cycles — scored within 0.077 RMSE of Random Forest on validation. The model's value lies in what you build on top of it.

**Point to:** Three gap boxes (amber, cyan, red); comparison panel  
**Denominator:** 20 validation engines, 4,217 rows  
**Likely question:** Why not Bayesian uncertainty?  
**Answer:** Conformal prediction offers finite-sample coverage without parametric assumptions. Trade-offs discussed in Chapter 3.

---

## Slide 3 — Related Work and Gap (0:50–1:20)

The literature shows many RUL models on C-MAPSS but three persistent gaps. First, row-random splits leak future sensor values. Second, uncertainty and explanation are studied in isolation. Third, accountability is discussed but rarely implemented. My contribution integrates all six components — no single prior work combines engine-safe evaluation, a naive baseline, conformal intervals, verified SHAP, deterministic triage and a separately tested prototype with audit.

**Point to:** Three gap cards; contribution box  
**Likely question:** This is not a systematic review — how do you know the gap is real?  
**Answer:** It is a targeted narrative review. The gap is supported by Table 3.1 sources and absence of an integrated framework.

---

## Slide 4 — FD001 and Engine-Safe Split (1:20–2:05)

The dataset is 100 simulated turbofan engines under one operating condition with one HPC fault mode. I partitioned by engine — 60 for modelling, 20 validation, 20 calibration — preventing trajectory leakage. The target is uncapped RUL. The 100 official endpoints were opened only once after all policies were frozen.

**Point to:** Partition table; target formula; characteristics list  
**Denominator:** 100 training engines total, 100 test endpoints separately  
**Likely question:** Why not stratified splits?  
**Answer:** With 100 engines and one fault mode, stratification creates thin strata. Fixed-seed shuffle is reproducible.

---

## Slide 5 — Model Comparison and Selection (2:05–2:55)

Four candidates compared with engine-level grouped cross-validation. The key finding: Random Forest and the naive rule were practically equivalent — just 0.077 difference. The predeclared PHM penalty tie-break selected Random Forest because it penalises late predictions more steeply. I am not claiming a dramatic accuracy advantage — the model's value is the structure it enables.

**Point to:** Comparison table (highlight RF row); selection policy box  
**Denominator:** 20 validation engines  
**Likely question:** Why not deep learning?  
**Answer:** Tree ensembles match or outperform deep models on tabular data (Grinsztajn et al., 2022). The pipeline's interpretability was a design requirement.

---

## Slide 6 — Conformal Uncertainty (2:55–3:45)

For each calibration engine, I computed the maximum absolute residual across its entire trajectory, then took the 90th percentile rank — giving q-hat of 107.90 cycles. This is deliberately conservative: the interval covers the worst-case point in a trajectory. The result: 100 of 100 test endpoints covered, but mean width of 182.46 cycles and 63% of lower bounds clipped to zero. Coverage at a scheduling cost.

**Point to:** Construction steps; metric cards  
**Denominator:** 20 calibration engines; 100 test endpoints  
**Likely question:** Is exchangeability valid?  
**Answer:** For i.i.d. simulated units, yes. Real fleet data with varying regimes would need scrutiny.

---

## Slide 7 — Official Test Results (3:45–4:40)

The official results: MAE 18.88 cycles, RMSE 25.73, and importantly a positive bias of +10.90 cycles — the model systematically overestimates remaining life. That is the dangerous direction. The naive baseline's endpoint MAE of 30.88 is a post-closure reference. Mid-life engines showed the strongest bias at +15.20 cycles.

**Point to:** Metric cards (especially coral bias card); comparison table; lifecycle breakdown  
**Denominator:** 100 endpoints tested once  
**Likely question:** +10.90 bias is unsafe — how do you address it?  
**Answer:** This is precisely why the conformal interval and offline guard exist. The bias is measured and disclosed, not hidden.

---

## Slide 8 — Ablation Studies (4:40–5:15)

Two post-closure ablations. Feature: removing age increased RMSE 24.5% — age is the strongest predictor. Removing sensors 9 and 14 reduced RMSE by 4%, suggesting some channels may add noise. Conformal: row-level and engine-mean scores halved the width but covered only 8 of 20 entire trajectories. The trade-off: 45% narrower intervals for only 40% trajectory coverage.

**Point to:** Both tables side by side; trade-off highlight  
**Denominator:** 60 modelling + 20 validation engines  
**Likely question:** Why not retune after ablation?  
**Answer:** Ablation isolates the effect of removing a component. Retuning would confound the comparison.

---

## Slide 9 — SHAP Explainability (5:15–5:55)

TreeSHAP decomposed all 100 endpoint predictions. Engine age ranked first, followed by physically plausible HPC pressure and temperature channels. For Engine 41 — truly critical but triaged as MEDIUM — core-speed contributions counteracted degradation signals. This helps audit why the model erred, but I want to be clear: SHAP supports numerical reconstruction, not physical causation.

**Point to:** Importance bars; Engine 41 case; caveat box  
**Denominator:** 100 endpoints; baseline 107.84 cycles  
**Likely question:** How do you know SHAP is faithful?  
**Answer:** Additivity verified — baseline plus contributions reconstruct each prediction. TreeSHAP is exact for the model's computation.

---

## Slide 10 — Triage: Point vs Guard (5:55–7:00)

This is the central practical result. Point triage: 62 correct, 34 under-triaged, 9 of 25 truly critical missed. The offline guard uses the conformal lower bound to refer engines — it caught all 39 truly critical-or-high endpoints. But it reviewed 81 of 100. The workload trade-off is real: 100% critical recall at 81% review burden. On validation rows, 2,578 of 4,217 were referred — but these are repeated measurements, not independent engines.

**Point to:** Left panel (point results, red box); right panel (guard results, metric cards)  
**Denominator:** 100 test endpoints; 39 truly critical+high; 4,217 validation rows  
**Likely question:** 81% review rate defeats the purpose?  
**Answer:** Yes, the review burden is a measured limitation. Narrower valid intervals would reduce it — that is future work. Measuring the trade-off explicitly is itself a contribution.

---

## Slide 11 — n8n Prototype (7:00–8:15)

The prototype is a separately tested 22-node n8n workflow. It takes a fixed illustrative payload — not a live feed. It applies deterministic policy before any language model narration. The reviewer can APPROVE, REJECT or MODIFY. Four audit records demonstrate these paths. Key boundaries: the offline guard is NOT in n8n routing. The LLM narrates evidence under constraints but does not decide. No production readiness or certification claim.

**Point to:** Two-track architecture diagram; audit evidence table; boundary list  
**Denominator:** 4 audit records, manually seeded  
**Likely question:** This is just a demo — how does it contribute?  
**Answer:** The contribution is the evaluated design: deterministic policy before narration, human authority, audit trail. Field effectiveness requires future work.

---

## Slide 12 — Conclusions (8:15–9:00)

Three evidence-supported conclusions. First, rigorous evaluation design — the near-tie in RMSE is honest; the contribution is the evaluation method. Second, coverage at a scheduling cost — 100/100 coverage with 182-cycle width. Third, implementable human review — 39/39 critical recall at 81% review burden. Main limitations: single simulated fault, broad intervals, no live feed, provenance gaps. Future work: multi-regime datasets, narrower intervals, live feeds and usability studies with engineers. Thank you. I am happy to take questions.

**Point to:** Three conclusion cards; limitations and future work columns  
**Likely question:** What is your single most important finding?  
**Answer:** Uncertainty quantification, when integrated with triage, catches all critical cases that point prediction misses — at a measured and currently high review cost. The honest measurement of that cost is itself a contribution.

---

## Backup Slides Available

Press right arrow to access backup slides covering:
- B1: Research questions → Evidence mapping
- B2: Engine-level split and leakage prevention
- B3: Model configurations and frozen hyperparameters
- B4: Conformal score computation and assumptions
- B5: Triage policy definitions and metric denominators
- B6: n8n prototype topology and audit record fields
- B7: Standards and frameworks (design references)
- B8: Complete limitations table
