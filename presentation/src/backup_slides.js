// Backup index (deck index 13) and backup slides B1-B25 (deck index 14-38).
const { C, slide, T, R, E, L, I, TB } = require("./lib.js");

const TOPICS = [
  "Research questions and answers", "Objectives → evidence", "Partitions and leakage controls", "Full model comparison",
  "RF and XGBoost configurations", "Equivalence band and PHM tie-break", "Conformal score and rank",
  "Bootstrap and confidence intervals", "Uncapped target vs capped sensitivity", "Feature ablation", "Conformal-score ablation",
  "Global SHAP and additivity", "Local SHAP failure cases", "Triage classes and denominators",
  "Endpoints vs validation rows", "n8n topology", "Decision-route evidence", "Audit-record fields",
  "Invalid-MODIFY limitation", "Reproducibility environment", "Provenance limitations", "Standards as design references",
  "Scope and claims boundary", "Verified references", "Repository",
];

// index slide
{
  const s = slide({ sec: "Backup index", time: 0, backup: true });
  T(s, 0.6, 0.3, 9, 0.3, "BACKUP SLIDES", { sz: 12, b: true, c: C.amberD });
  T(s, 0.6, 0.6, 10.7, 0.62, "Evidence for questions — select a topic", { f: "head", sz: 28, b: true });
  I(s, "engine", 11.5, 0.2, 1.55, 0.646, { tr: 72, cls: "motif" });
  TOPICS.forEach((t, i) => {
    const col = Math.floor(i / 9), row = i % 9, x = 0.6 + col * 4.1, y = 1.45 + row * 0.56;
    R(s, x, y, 3.95, 0.48, { fill: C.white, line: C.grid, r: 0.05 });
    T(s, x + 0.15, y + 0.08, 3.7, 0.34, [{ t: `B${i + 1}  `, b: true, c: C.amberD }, { t: t, link: 14 + i, c: C.text }], { sz: 14 });
  });
  L(s, 0.6, 6.88, 12.73, 6.88, { c: C.grid, w: 0.75 });
  T(s, 0.6, 6.98, 11, 0.32, [{ t: "↩ Conclusions (slide 12)", link: 11, b: true, c: C.cyan }, { t: "     " }, { t: "↩ Questions (slide 13)", link: 12, b: true, c: C.cyan }], { sz: 12 });
  s.notes = "Backup index. Click a topic to open it; every backup slide links back here.";
}

function bk(n, title, src) {
  const s = slide({ sec: `Backup B${n}`, time: 0, backup: true });
  T(s, 0.6, 0.3, 9, 0.3, `BACKUP B${n} · ${TOPICS[n - 1].toUpperCase()}`, { sz: 12, b: true, c: C.amberD });
  T(s, 0.6, 0.6, 10.7, 0.62, title, { f: "head", sz: 25, b: true });
  I(s, "engine", 11.5, 0.2, 1.55, 0.646, { tr: 72, cls: "motif" });
  L(s, 0.6, 6.88, 12.73, 6.88, { c: C.grid, w: 0.75 });
  T(s, 0.6, 6.98, 10.3, 0.32, [{ t: src, c: C.sub }, { t: "     " }, { t: "↩ Backup index", link: 13, b: true, c: C.cyan }], { sz: 11 });
  T(s, 11.6, 6.98, 1.13, 0.32, `B${n}`, { sz: 11, c: C.sub, align: "right" });
  s.notes = `Backup B${n}: ${TOPICS[n - 1]}. Source: ${src}`;
  return s;
}
const note = (s, y, text, o = {}) => T(s, 0.6, y, 12.13, 0.7, text, { sz: 14, c: C.sub, ...o });

// B1
{
  const s = bk(1, "Four research questions and their bounded answers", "Table 1.2 (§1.3); answers §7.2");
  TB(s, 0.6, 1.4, 12.13, [
    ["RQ", "Question", "Answer (§7.2)"],
    ["RQ1", "How accurately can lightweight ML models estimate RUL for FD001 under an engine-level, leakage-controlled design, relative to a naive age-only baseline, and which feature groups drive that accuracy?", "Test MAE 18.88, RMSE 25.73, bias +10.90 cycles; PHM tie-break selected RF despite near-equal validation RMSE vs age alone"],
    ["RQ2", "How can engine-block conformal prediction provide RUL intervals with a transparent finite-sample rule, and what coverage–precision trade-off does it create?", "q̂ 107.90 covered 100/100 endpoints, mean width 182.46; narrower scores covered only 8/20 validation trajectories"],
    ["RQ3", "What do SHAP explanations reveal about the selected model, and how can they be read against turbofan physics without being mistaken for causal evidence?", "Exact reconstruction; age dominant; local core-speed contributions — not physical causes"],
    ["RQ4", "How can prediction, uncertainty and explanation be translated into CRITICAL/HIGH/MEDIUM/LOW triage with mandatory human review, and how safe and burdensome is it?", "Point triage under-triaged 34/100; offline guard caught 39/39 with 81/100 reviews; prototype records three decision types"],
  ], { colW: [0.75, 6.4, 4.98], sz: 13 });
}
// B2
{
  const s = bk(2, "Six objectives map to specific evidence", "Table 1.1 (§1.3)");
  TB(s, 0.6, 1.4, 12.13, [
    ["ID", "Objective", "Evidence"],
    ["O1", "Leakage-controlled, engine-level partitions and an auditable RUL target", "Frozen 60/20/20 engine partitions, target checks, SHA-256 manifests (§4.3–4.5)"],
    ["O2", "Compare regression models against a clear baseline under a pre-declared policy; test feature groups", "Naive, Ridge, RF, XGBoost comparison; feature ablation (§5.2, §5.6)"],
    ["O3", "Quantify uncertainty with a transparent, engine-aware conformal rule", "Engine-block calibration, q̂ = 107.90; conformal ablation (§4.8, §5.4, §5.7)"],
    ["O4", "Evaluate the frozen model once on the official test endpoints", "Point, interval, lifecycle and bootstrap results, 100 engines (§5.3–5.5)"],
    ["O5", "Explain predictions without causal overclaiming; relate to engine physics", "100 × 18 TreeSHAP matrix; local failure cases (§5.8)"],
    ["O6", "Specify and audit a CRITICAL/HIGH/MEDIUM/LOW triage policy for an n8n review workflow", "Triage policy, classification audit, review-burden analysis (§4.10, §5.9)"],
  ], { colW: [0.6, 5.9, 5.63], sz: 14 });
}
// B3
{
  const s = bk(3, "Each engine had exactly one role", "Table 4.1 (§4.5); leakage: Kaufman et al. (2012)");
  TB(s, 0.6, 1.4, 12.13, [
    ["Partition", "Engines", "Rows", "Role", "Prohibited use"],
    ["Model training", "60", "12,310", "Fit scaler and models; grouped CV for tuning", "Any claim of held-out performance"],
    ["Validation", "20", "4,217", "Compare frozen candidates; select point model", "Calibration; retuning after selection"],
    ["Conformal calibration", "20", "4,104", "One nonconformity score per engine", "Model selection; method shopping"],
    ["Official test", "100", "13,096 (100 endpoints)", "Once-only final evaluation", "Reselection, retraining, recalibration"],
  ], { colW: [2.2, 1.0, 1.9, 3.6, 3.43], sz: 14 });
  note(s, 4.0, "Controls: fixed seed-42 engine shuffle without rerolling or stratification · scaler fitted on training engines only · Phase 6 policy froze model hash, feature order, q̂, metrics, lifecycle groups and the last-observed-row rule before the 100 official RUL values were read.");
}
// B4
{
  const s = bk(4, "Full validation comparison: a near tie on mean engine RMSE", "Table 5.1 (§5.2) · 20 validation engines, 4,217 rows");
  TB(s, 0.6, 1.4, 12.13, [
    ["Model", "Mean engine RMSE", "Median engine RMSE", "Pooled RMSE", "Pooled MAE", "Bias", "Over-estimation", "Mean PHM"],
    [{ t: "Random Forest", b: true }, "29.479", "26.458", "33.073", "25.324", "+0.96", "54.2%", "83.67"],
    ["Naive age-only", "29.556", "21.109", "41.135", "31.106", "−19.33", "33.3%", "156.44"],
    ["XGBoost", "31.156", "29.471", "34.348", "26.664", "+1.03", "53.5%", "101.15"],
    ["Ridge", "31.516", "26.076", "34.295", "26.251", "+0.44", "54.1%", "157.53"],
  ], { colW: [2.0, 1.45, 1.55, 1.35, 1.3, 1.2, 1.55, 1.73], sz: 14 });
  note(s, 3.9, "Selection used mean engine RMSE with a 1% practical-equivalence band, then the mean PHM penalty. Other columns are descriptive. The age rule's much lower median engine RMSE and strongly negative bias show it errs pessimistically.");
}
// B5
{
  const s = bk(5, "Frozen configurations from grouped cross-validation", "Table 4.3 (§4.7)");
  TB(s, 0.6, 1.4, 12.13, [
    ["Model", "Role", "Training-only selection", "Frozen configuration"],
    ["Naive age-only", "Non-sensor baseline", "Median training lifetime (195 cycles)", "ŷ = max(195 − time_in_cycles, 0)"],
    ["Ridge", "Regularised linear comparator", "11 α values, grouped 5-fold CV", "α = 0.0001 (grid boundary)"],
    [{ t: "Random Forest", b: true }, "Non-linear bagged trees", "18 candidates, grouped 5-fold CV, 150 trees per fold", "depth 8, min. leaf 10, max_features 0.5, 500 trees, seed 42"],
    ["XGBoost", "Regularised boosted trees", "18 candidates, grouped 5-fold CV", "depth 3, learning rate 0.03, min. child weight 5, 400 rounds, subsample 0.8, colsample 0.8, λ = 5"],
  ], { colW: [1.9, 2.5, 3.4, 4.33], sz: 14 });
  note(s, 4.5, "Ridge standardisation fitted on training engines only; tree models used raw inputs; outputs clipped at 0; no retuning after configurations were fixed.");
}
// B6
{
  const s = bk(6, "Selection: equivalence band first, asymmetric penalty second", "§2.4.2, §4.7, §5.2; PHM score after Saxena et al. (2008a)");
  T(s, 0.6, 1.45, 6.0, 4.9, [
    { t: "Rule 1 — practical equivalence", b: true, sz: 18, br: true },
    { t: "Candidates whose mean engine RMSE lies within 1% of the best are treated as equivalent.", sz: 16, br: true },
    { t: "RF 29.479 vs naive 29.556: ratio 1.0026 → within 1%", sz: 16, c: "007E99", b: true, br: true },
    { t: "XGBoost 31.156 and Ridge 31.516: outside the band", sz: 16, br: true },
    { t: " ", sz: 10, br: true },
    { t: "Rule 2 — tie-break", b: true, sz: 18, br: true },
    { t: "Lowest mean PHM penalty among equivalent candidates: RF 83.67 vs naive 156.44.", sz: 16 },
  ], { psa: 4 });
  R(s, 7.0, 1.45, 5.73, 2.6, { fill: C.white, line: C.grid, r: 0.08 });
  T(s, 7.25, 1.58, 5.3, 2.4, [
    { t: "PHM 2008 penalty, e = predicted − actual", b: true, sz: 16, br: true },
    { t: "e ≥ 0 (late):  exp(e / 10) − 1", sz: 18, br: true },
    { t: "e < 0 (early):  exp(−e / 13) − 1", sz: 18, br: true },
    { t: "Late, optimistic errors are penalised more steeply than early ones.", sz: 14, c: C.sub },
  ], { psa: 6 });
  T(s, 7.0, 4.3, 5.73, 1.5, "Ratio 29.556 / 29.479 is derived from Table 5.1. Both rules were fixed before validation results were read.", { sz: 14, c: C.sub });
}
// B7
{
  const s = bk(7, "Conformal score: definition, rank and assumptions", "§2.5.1, §4.8; Vovk, Gammerman and Shafer (2005); Lei et al. (2018a); Barber et al. (2023)");
  T(s, 0.6, 1.45, 6.2, 5.2, [
    { t: "Score", b: true, sz: 18, br: true },
    { t: "sᵢ = maxₜ |ŷ(i, t) − y(i, t)| for each of n = 20 calibration engines", sz: 16, br: true },
    { t: "Rank", b: true, sz: 18, br: true },
    { t: "Finite-sample rank ⌈(n + 1)(1 − α)⌉ = ⌈21 × 0.90⌉ = 19 → 19th of 20", sz: 16, br: true },
    { t: "q̂ = 107.8965 cycles (reported 107.90)", sz: 16, b: true, c: "007E99", br: true },
    { t: "Interval", b: true, sz: 18, br: true },
    { t: "[max(ŷ − q̂, 0), ŷ + q̂]; clipping changes reported width", sz: 16 },
  ], { psa: 6 });
  R(s, 7.1, 1.45, 5.63, 4.2, { fill: C.amberT, r: 0.08 });
  T(s, 7.35, 1.58, 5.2, 4.0, [
    { t: "Assumptions and caveats", b: true, sz: 17, c: C.amberD, br: true },
    { t: "Coverage is marginal under exchangeable calibration and future engines", sz: 15, br: true },
    { t: "Not guaranteed per engine, under distribution shift, or as a safety certificate", sz: 15, br: true },
    { t: "Calibration covered 19/20 engines by construction — not independent validation", sz: 15, br: true },
    { t: "20 engines → coarse order statistic; q̂ sensitive to one engine", sz: 15 },
  ], { psa: 8 });
}
// B8
{
  const s = bk(8, "Official endpoint results with bootstrap intervals", "Table 5.2 (§5.3) · 100 engines · 5,000 engine resamples of the single evaluation");
  TB(s, 0.6, 1.4, 12.13, [
    ["Measure", "Value", "Interpretation"],
    ["MAE", "18.88 (95% CI 15.56–22.48)", "Average absolute endpoint error"],
    ["RMSE", "25.73 (CI 21.33–30.15)", "Larger than MAE: a minority of large errors"],
    ["R²", "0.617 (CI 0.42–0.75)", "Meaningful but incomplete variance explained"],
    ["Bias", "+10.90 (CI 6.47–15.57)", "Systematic overestimation; interval excludes zero"],
    ["Median absolute error", "14.19", "Half of engines within about 14 cycles"],
    ["Over- / underestimation", "69% / 31%", "Overestimation dominates"],
    ["Within 10 / 20 / 30 cycles", "43% / 62% / 75%", "Descriptive accuracy bands"],
    ["PHM penalty, total / mean", "10,108.02 / 101.08", "Inflated by late predictions"],
  ], { colW: [3.3, 3.9, 4.93], sz: 14 });
  note(s, 5.85, "The bootstrap quantifies sampling uncertainty of these same 100 predictions — not performance on new engines or fleets.");
}
// B9
{
  const s = bk(9, "Capping changes the question, not just the score", "Table 5.5 (§5.5) · validation rows, actual-RUL scale");
  TB(s, 0.6, 1.4, 8.0, [
    ["Lifecycle stage", "MAE uncapped", "MAE capped", "Bias uncapped", "Bias capped"],
    ["Critical, 0–30", "7.48", "7.32", "+4.87", "+4.68"],
    ["Near-term, 31–60", "19.96", "18.91", "+13.09", "+11.95"],
    ["Mid-life, 61–130", "29.02", "17.73", "+13.72", "−0.81"],
    ["Early life, > 130", "31.03", "58.01", "−16.29", "−58.01"],
  ], { colW: [2.4, 1.4, 1.4, 1.4, 1.4], sz: 14 });
  T(s, 8.95, 1.4, 3.78, 4.0, [
    { t: "Against actual cycles", b: true, sz: 16, br: true },
    { t: "Capped-130 validation RMSE 44.04 vs 33.07 uncapped", sz: 15, br: true },
    { t: "Capped bias −19.85; mean PHM penalty 1,440.27", sz: 15, br: true },
    { t: "Uncapped RUL is primary; capped is sensitivity only.", sz: 15, b: true, c: "007E99" },
  ], { psa: 8 });
}
// B10
{
  const s = bk(10, "Age dominates; dropping s9/s14 is only a hypothesis", "Table 5.6 (§5.6) · post-closure · 60 modelling, 20 reused validation engines, no retuning");
  TB(s, 0.6, 1.4, 12.13, [
    ["Variant", "N features", "Val. MAE", "Pooled RMSE", "Bias", "Mean PHM", "Engine MAE"],
    ["A0 Full model", "18", "25.32", "33.07", "+0.96", "83.7", "24.93"],
    ["A1 Without time_in_cycles", "17", "31.03", "41.16", "+1.77", "1,436.3", "30.18"],
    ["A2 Sensors only", "15", "31.02", "41.14", "+1.72", "1,389.4", "30.17"],
    ["A3 Age only (Random Forest)", "1", "28.79", "36.72", "−1.80", "93.0", "28.28"],
    ["A4 Without operational settings", "16", "25.40", "33.14", "+0.99", "84.7", "25.00"],
    ["A5 Without sensor_9 and sensor_14", "16", "24.03", "31.76", "−1.44", "60.1", "23.79"],
    ["B0 Naive age-only rule", "1", "31.11", "41.14", "−19.33", "156.4", "28.73"],
  ], { colW: [3.8, 1.3, 1.3, 1.5, 1.3, 1.4, 1.53], sz: 14 });
  note(s, 5.25, "A5 lowered pooled RMSE about 4.0% in a single exploratory comparison on reused validation engines — it does not change the frozen model or establish general harm.");
}
// B11
{
  const s = bk(11, "Narrower conformal scores lose whole-trajectory coverage", "Table 5.7 (§5.7) · post-closure · original 20 calibration and 20 validation engines");
  TB(s, 0.6, 1.4, 12.13, [
    ["Score", "q̂", "Val. row coverage", "Val. engines fully covered", "Test endpoint coverage", "Test mean width", "Test misses below lower bound"],
    [{ t: "C0 Engine maximum (frozen)", b: true }, "107.90", "100%", "20/20", "100%", "182.46", "0"],
    ["C1 Row-level", "57.70", "89.7%", "8/20", "96%", "106.34", "4"],
    ["C2 Engine mean", "54.32", "88.2%", "8/20", "96%", "100.72", "4"],
  ], { colW: [2.9, 1.0, 1.6, 1.9, 1.7, 1.45, 1.58], sz: 14 });
  note(s, 3.55, "Selecting C1 or C2 on these already examined engines would import post-closure test knowledge. Replacement needs fresh engine groups and a prespecified comparison.");
}
// B12
{
  const s = bk(12, "Global SHAP ranks age first, then HPC pressure", "Table 5.8 (§5.8) · 100 official endpoints × 18 predictors · baseline 107.84 cycles");
  TB(s, 0.6, 1.4, 9.0, [
    ["Rank", "Feature", "Physical meaning", "Mean |SHAP|", "Mean signed"],
    ["1", "time_in_cycles", "Engine age", "24.76", "−16.57"],
    ["2", "sensor_11", "Ps30, HPC outlet static pressure", "12.87", "−1.78"],
    ["3", "sensor_4", "T50, LPT outlet temperature", "7.45", "−0.68"],
    ["4", "sensor_9", "Nc, core speed", "6.05", "+0.40"],
    ["5", "sensor_14", "NRc, corrected core speed", "5.30", "+0.55"],
    ["6", "sensor_12", "phi, fuel flow / Ps30", "4.39", "−0.45"],
    ["7", "sensor_7", "P30, HPC outlet pressure", "3.59", "−0.77"],
    ["8", "sensor_15", "BPR, bypass ratio", "2.05", "−0.61"],
    ["9", "sensor_13", "NRf, corrected fan speed", "1.03", "−0.45"],
    ["10", "sensor_8", "Nf, fan speed", "0.85", "−0.48"],
  ], { colW: [0.7, 1.8, 3.5, 1.5, 1.5], sz: 13 });
  T(s, 9.9, 1.4, 2.83, 4.6, [
    { t: "Checks", b: true, sz: 16, br: true },
    { t: "Additivity / fidelity: max discrepancy < 10⁻¹² cycles", sz: 14, br: true },
    { t: "Units: cycles of predicted RUL", sz: 14, br: true },
    { t: "Correlated channels can exchange credit; sensor names follow the literature mapping", sz: 14, br: true },
    { t: "Non-causal", sz: 14, b: true, c: C.coral },
  ], { psa: 8 });
}
// B13
{
  const s = bk(13, "Four local cases: two under-triaged, two large errors", "Table 5.9 (§5.8.2) · baseline 107.84 cycles · contributions in cycles");
  TB(s, 0.6, 1.4, 12.13, [
    ["Engine", "Age", "True RUL", "Predicted", "Largest contributions (cycles)"],
    ["41", "123", "18", "60.0", "age −29.2; T50 (s4) −11.5; phi (s12) −7.9; Nc (s9) +4.3; NRf (s13) −3.0"],
    [{ t: "18", b: true }, "133", "28", "64.5", "age −28.1; Ps30 (s11) −12.2; T50 (s4) −11.4; Nc (s9) +5.6; NRc (s14) +4.6"],
    ["15", "76", "83", "170.5", "Ps30 (s11) +18.3; NRc (s14) +9.5; T50 (s4) +8.2; Nc (s9) +7.8; phi (s12) +7.5"],
    ["1", "31", "112", "184.2", "age +34.7; Ps30 (s11) +14.3; T50 (s4) +7.0; NRc (s14) +6.0; Nc (s9) +5.2"],
  ], { colW: [1.0, 0.8, 1.1, 1.2, 8.03], sz: 14 });
  note(s, 4.05, "Engines 41 and 18 (truly CRITICAL, point class MEDIUM): core-speed inputs partly counteracted degradation-related negative contributions. Engine 15's measured sensors looked healthy with 83 cycles left. These describe model behaviour, not a diagnosed physical cause.");
}
// B14
{
  const s = bk(14, "Triage classes are stipulated; Rule 2 is offline only", "Table 4.4 (§4.10.2) · thresholds are research assumptions, not maintenance-approved limits");
  TB(s, 0.6, 1.4, 12.13, [
    ["Class", "Rule 1 on predicted ŷ", "Proposed action (for reviewer approval)", "Review requirement"],
    [{ t: "CRITICAL", b: true, c: C.coral }, "ŷ ≤ 30 cycles", "Immediate inspection planning; consider removal from service", "Mandatory human review"],
    [{ t: "HIGH", b: true, c: "B5443F" }, "30 < ŷ ≤ 60", "Schedule inspection and parts within the planning horizon", "Mandatory human review"],
    [{ t: "MEDIUM", b: true }, "60 < ŷ ≤ 130", "Increased monitoring; plan at the next maintenance opportunity", "Routine queue unless Rule 2"],
    [{ t: "LOW", b: true }, "ŷ > 130", "Continue routine monitoring", "Routine queue unless Rule 2"],
  ], { colW: [1.6, 2.2, 5.2, 3.13], sz: 14 });
  note(s, 4.15, "Rule 2 (post-closure, offline): refer when the conformal lower bound is ≤ 30 cycles. Not implemented as n8n routing. Denominators: 100 endpoints — 25 truly CRITICAL, 39 truly CRITICAL-or-HIGH; point-only CRITICAL recall 64%.");
}
// B15
{
  const s = bk(15, "Endpoints and validation rows answer different questions", "Table 5.10 (§5.9) · never pool the two columns into one safety statistic");
  TB(s, 0.6, 1.4, 12.13, [
    ["Measure", "Endpoints (n = 100 engines)", "Validation rows (n = 4,217, 20 engines)"],
    ["Point-only: CRITICAL recall", "64%", "80.5%"],
    ["Point-only: CRITICAL or HIGH recall", "82%", "77.6%"],
    ["Point-only: under-triage rate", "34%", "19.8%"],
    ["Two rules: truly CRITICAL routed to review", "100%", "100%"],
    ["Two rules: truly CRITICAL or HIGH routed", "100% (39/39)", "99.8% (1,218/1,220)"],
    ["Two rules: share of all cases reviewed", "81%", "61.1%"],
    ["Reviewed cases truly CRITICAL or HIGH", "48.1%", "47.2%"],
    ["Routed by Rule 2 only", "47%", "35.6%"],
  ], { colW: [5.0, 3.4, 3.73], sz: 14 });
  note(s, 5.6, "Validation rows are repeated cycle observations of the same 20 engines — not independent. Both columns are retrospective under simulated labels; neither is a field safety rate.", { c: C.coral, b: true });
}
// B16
{
  const s = bk(16, "Exported 22-node n8n workflow (THESIS_HITL_AGENTIC_V2)", "Figure 4.7 (§4.10.4) · author's n8n editor screenshot — topology, not a deployment");
  I(s, "canvas", 0.6, 1.4, 8.4, 3.5);
  T(s, 9.25, 1.4, 3.48, 5.2, [
    { t: "Groups", b: true, sz: 16, br: true },
    { t: "Fixed PROTOTYPE_TEST input", sz: 14, br: true },
    { t: "Evidence and provenance checks", sz: 14, br: true },
    { t: "DEMO_POLICY_V1 (STIPULATED_RESEARCH_ASSUMPTION)", sz: 14, br: true },
    { t: "Bounded local narration (Ollama, Qwen3 1.7B, temperature 0)", sz: 14, br: true },
    { t: "Human form → APPROVE / REJECT / MODIFY", sz: 14, br: true },
    { t: "PostgreSQL status + JSON audit export", sz: 14 },
  ], { psa: 6 });
  note(s, 5.2, "Connections show available routes; exported audit records show saved decisions. Neither establishes a live notebook feed, offline interval-guard routing or field reliability.");
}
// B17
{
  const s = bk(17, "Three human decision types were executed and exported", "Table 5.11 (§5.10) · Figure 5.11a");
  TB(s, 0.6, 1.4, 7.4, [
    ["Branch", "Observed result", "Evidence"],
    ["APPROVE", "Executed twice; APPROVED, override NO", "Two audit records"],
    ["REJECT", "Executed; REJECTED, override YES, final recommendation empty", "Audit record"],
    ["MODIFY (valid)", "Executed; MODIFIED, override YES, revised recommendation stored", "Audit record"],
    ["MODIFY (invalid)", "Editor trace reaches invalid response and update nodes", "Trace only; no audit JSON"],
  ], { colW: [1.7, 3.8, 1.9], sz: 13 });
  I(s, "approve", 8.25, 1.4, 4.48, 1.93);
  T(s, 8.25, 3.38, 4.48, 0.3, "APPROVE route highlighted (editor execution)", { sz: 11, i: true, c: C.sub });
  I(s, "reject", 8.25, 3.8, 4.48, 1.98);
  T(s, 8.25, 5.82, 4.48, 0.3, "REJECT route (editor execution)", { sz: 11, i: true, c: C.sub });
}
// B18
{
  const s = bk(18, "Audit records link policy, explanation and decision", "Tables A.1 and A.2 (Appendix A) · sanitised prototype records");
  TB(s, 0.6, 1.4, 6.6, [
    ["Field group", "Recorded content (MODIFY example)"],
    ["Request", "Request id; asset id; predicted RUL 18 cycles; priority CRITICAL"],
    ["Policy", "DEMO_POLICY_V1; STIPULATED_RESEARCH_ASSUMPTION; stage critical_0_to_30; flag LOWER_BOUND_CLIPPED; rule reason"],
    ["Explanation", "SHAP drivers + constrained agent summary, evidence list, limitations, ‘human review required’"],
    ["Human decision", "MODIFY; comment; revised recommendation; status MODIFIED; override YES"],
    ["Timestamps", "Creation, review and completion"],
  ], { colW: [1.6, 5.0], sz: 13 });
  TB(s, 7.45, 1.4, 5.28, [
    ["Record", "Decision", "Override"],
    ["HITL-1790096772107", "APPROVE", "NO"],
    ["HITL-1790108329010", "APPROVE", "NO"],
    ["HITL-1790097014976", "REJECT", "YES"],
    ["HITL-1790094775152", "MODIFY", "YES"],
  ], { colW: [2.68, 1.4, 1.2], sz: 13 });
  T(s, 7.45, 4.25, 5.28, 1.4, "A fifth, earlier placeholder APPROVE run (HITL-20260909-214406-369) is kept separate from these four agent-assisted records.", { sz: 13, c: C.sub });
}
// B19
{
  const s = bk(19, "Invalid MODIFY: a route trace, not a persisted-state proof", "Figure 5.11b, Table 5.11 (§5.10)");
  I(s, "invalid", 0.6, 1.4, 7.4, 3.18);
  T(s, 0.6, 4.62, 7.4, 0.3, "Invalid-MODIFY response and update nodes highlighted (editor execution)", { sz: 11, i: true, c: C.sub });
  R(s, 8.3, 1.4, 4.43, 3.5, { fill: C.amberT, r: 0.08 });
  T(s, 8.55, 1.55, 4.0, 3.3, [
    { t: "What is and is not shown", b: true, sz: 17, c: C.amberD, br: true },
    { t: "Expected: fail closed when no revised recommendation is supplied", sz: 15, br: true },
    { t: "Shown: the editor trace reaches the invalid response and update nodes", sz: 15, br: true },
    { t: "Not shown: a returned database row or exported audit JSON of the final state", sz: 15, b: true },
  ], { psa: 8 });
}
// B20
{
  const s = bk(20, "Executed environment and independent reproduction", "Table 4.6 (§4.12)");
  TB(s, 0.6, 1.4, 7.2, [
    ["Component", "Version / platform"],
    ["Python (original)", "3.13.15 (Google Colab, Linux)"],
    ["Python (Phase 8 reproduction)", "3.12"],
    ["NumPy / pandas", "2.1.3 / 2.2.3"],
    ["scikit-learn", "1.6.1"],
    ["XGBoost", "3.4.1"],
    ["SHAP", "0.52.0"],
    ["Matplotlib / seaborn", "3.10.0 / 0.13.2"],
    ["Workflow layer", "n8n + PostgreSQL + local Ollama chat model; fixed evidence payload"],
  ], { colW: [2.8, 4.4], sz: 13 });
  T(s, 8.1, 1.4, 4.63, 4.0, "The Phase 8 reproduction restored the 60/20/20 partition with the same library versions and matched the recorded validation, calibration, test and SHAP values exactly. The two Python environments are reported separately.", { sz: 15 });
}
// B21
{
  const s = bk(21, "Numbers reproduce; earlier history cannot", "§6.6, Table 6.1, declaration");
  T(s, 0.6, 1.45, 12.13, 4.9, [
    { t: "Reproduced", b: true, sz: 18, c: "007E99", br: true },
    { t: "Independent Phase 8 run restored the partition and matched q̂ and the principal validation, calibration and test metrics. The selected model hash stayed stable.", sz: 16, br: true },
    { t: "Not reconstructable", b: true, sz: 18, c: C.coral, br: true },
    { t: "Five legacy Phase 5–6 artefact hashes differ from current archive bytes. The number of historical test executions is not fully verifiable, so post-closure analyses are treated as descriptive characterisation.", sz: 16, br: true },
    { t: "Required response", b: true, sz: 18, br: true },
    { t: "Version control with signed, immutable releases from ingestion onward; fresh data for confirmation.", sz: 16 },
  ], { psa: 8 });
}
// B22
{
  const s = bk(22, "Standards informed the design — no compliance is claimed", "Table 2.3 (§2.6)");
  TB(s, 0.6, 1.4, 12.13, [
    ["Standard or framework", "Application in this dissertation"],
    ["EN 13306:2017", "Definitions of fault, failure, condition-based and predictive maintenance"],
    ["ISO 17359:2018", "Monitored parameters and alert criteria that trigger review"],
    ["ISO 13374-1:2003", "Pipeline blocks: acquisition → state detection → health → prognosis → advisory"],
    ["ISO 13381-1:2015", "RUL definition; confidence stated alongside a prognosis"],
    ["IEEE Std 1856-2017", "Sensing, health assessment, prognostics and decision support as distinct capabilities"],
    ["ISO 55000:2014; ISO 31000:2018", "Risk-based prioritisation behind the four classes"],
    ["NIST AI RMF 1.0; ISO/IEC 42001:2023", "Governance via frozen policies, documented limitations, version fingerprints"],
    ["EU AI Act, Art. 14 (2024)", "Reviewer authority to approve, reject, modify or defer; no autonomous approval"],
  ], { colW: [3.6, 8.53], sz: 14 });
}
// B23
{
  const s = bk(23, "What the framework can and cannot do", "Table 4.5 (§4.11)");
  TB(s, 0.6, 1.4, 12.13, [
    ["The framework CAN", "The framework CANNOT"],
    ["Estimate RUL for FD001-like engines from 18 cycle-level inputs", "Transfer to other conditions, fault modes (FD002–FD004), engine types or real fleets without new validation"],
    ["Attach a 90% interval calibrated on whole engine trajectories", "Guarantee coverage for an individual engine, under distribution shift, or as a safety certificate"],
    ["Show which inputs moved a prediction, and by how much", "Identify the physical cause of degradation or the failing component"],
    ["Assign stipulated classes; evaluate an offline uncertainty-based review rule", "Define an approved maintenance window, cost-optimal action or airworthiness decision"],
    ["Record proposals, reviewer decisions and versions for audit", "Provide tamper-proof logging, access control, uptime or cybersecurity guarantees"],
    ["Support a qualified human reviewer", "Replace the reviewer or approve maintenance autonomously"],
  ], { colW: [5.4, 6.73], sz: 13 });
}
// B24
{
  const s = bk(24, "Key references (Harvard)", "Full list: dissertation References");
  const refs = [
    "Angelopoulos, A.N. and Bates, S. (2023) 'Conformal prediction: a gentle introduction', Found. Trends Mach. Learn., 16(4), pp. 494–591.",
    "Breiman, L. (2001) 'Random forests', Machine Learning, 45(1), pp. 5–32.",
    "Jardine, A.K.S., Lin, D. and Banjevic, D. (2006) 'A review on machinery diagnostics and prognostics implementing CBM', MSSP, 20(7), pp. 1483–1510.",
    "Javanmardi, A. and Hüllermeier, E. (2023) 'Conformal prediction intervals for remaining useful lifetime estimation', IJPHM, 14(2).",
    "Kaufman, S. et al. (2012) 'Leakage in data mining: formulation, detection, and avoidance', ACM TKDD, 6(4), Article 15.",
    "Lei, J. et al. (2018a) 'Distribution-free predictive inference for regression', JASA, 113(523), pp. 1094–1111.",
    "Lundberg, S.M. and Lee, S.-I. (2017) 'A unified approach to interpreting model predictions', NeurIPS 30, pp. 4765–4774.",
    "Lundberg, S.M. et al. (2020) 'From local explanations to global understanding with explainable AI for trees', Nat. Mach. Intell., 2(1).",
    "Parasuraman, R., Sheridan, T.B. and Wickens, C.D. (2000) 'A model for types and levels of human interaction with automation', IEEE TSMC-A, 30(3), pp. 286–297.",
    "Ramasso, E. and Saxena, A. (2014) 'Performance benchmarking and analysis of prognostic methods for CMAPSS datasets', IJPHM, 5(2).",
    "Saxena, A. et al. (2008a) 'Damage propagation modeling for aircraft engine run-to-failure simulation', PHM 2008, pp. 1–9.",
    "Saxena, A. and Goebel, K. (2008) Turbofan Engine Degradation Simulation Data Set. NASA Ames Prognostics Data Repository.",
    "Shneiderman, B. (2020) 'Human-centered artificial intelligence: reliable, safe & trustworthy', IJHCI, 36(6), pp. 495–504.",
    "Vollert, S., Atzmueller, M. and Theissler, A. (2021) 'Interpretable machine learning: a brief survey from the predictive maintenance perspective', ETFA 2021.",
  ];
  T(s, 0.6, 1.38, 12.13, 5.45, refs.map((r, i) => ({ t: r, sz: 12, br: i < refs.length - 1 })), { psa: 3 });
}
// B25
{
  const s = bk(25, "Dissertation repository (private)", "Repository stated in the dissertation; property of GISMA University — access must be requested");
  R(s, 0.6, 1.5, 12.13, 1.2, { fill: C.white, line: C.cyan, lw: 1.5, r: 0.08 });
  T(s, 0.85, 1.62, 11.7, 1.0, [{ t: "github.com/mranitabh/GISMA-hitl-dissertation-predictive-maintenance", b: true, sz: 20, c: "007E99", br: true }, { t: "Private dissertation repository — examiners may need to request access.", sz: 15, c: C.sub }]);
  T(s, 0.6, 3.0, 12.13, 3.5, [
    { t: "Contents relevant to the viva", b: true, sz: 17, br: true },
    { t: "executed_notebook/ — executed implementation notebook (HTML export)", sz: 15, br: true },
    { t: "workflow/ — n8n workflow exports", sz: 15, br: true },
    { t: "audit_examples/ — sanitised HITL audit JSON records", sz: 15, br: true },
    { t: "screenshots/ — workflow canvas, form and route traces", sz: 15, br: true },
    { t: "schemas/, config/ — request/response schemas and threshold policy", sz: 15, br: true },
    { t: "presentation/ — this deck, its source, script and verification report", sz: 15 },
  ], { psa: 6 });
}

module.exports = { TOPICS };
