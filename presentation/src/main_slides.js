// Main presentation (slides 1-13). Values verified against the dissertation; table/section noted in footers.
const { C, slide, T, R, E, L, I } = require("./lib.js");
const N_MAIN = 13;
// backup slide index: B(n) -> deck index (main 0-12, index 13, B1 = 14)
const B = (n) => 13 + n;

function frame(s, n, sec, title, src, links = []) {
  T(s, 0.6, 0.3, 9, 0.3, sec, { sz: 12, b: true, c: C.cyan });
  T(s, 0.6, 0.6, 10.7, 0.62, title, { f: "head", sz: 28, b: true });
  I(s, "engine", 11.5, 0.2, 1.55, 0.646, { tr: 72, cls: "motif" });
  L(s, 0.6, 6.88, 12.73, 6.88, { c: C.grid, w: 0.75 });
  const runs = [{ t: src, c: C.sub }];
  for (const [label, idx] of links) runs.push({ t: "   " }, { t: `${label} ↗`, link: idx, c: C.cyan, b: true });
  T(s, 0.6, 6.98, 11.0, 0.32, runs, { sz: 11 });
  T(s, 11.6, 6.98, 1.13, 0.32, `${n} / ${N_MAIN}`, { sz: 11, c: C.sub, align: "right" });
}

function bar(s, x, y, w, h, fill, o = {}) { R(s, x, y, Math.max(w, 0.02), h, { fill, ...o }); }

// ===================================================================== 1
{
  const s = slide({ sec: "Title", time: 15 });
  T(s, 0.6, 0.45, 7.4, 0.3, "MSc DISSERTATION VIVA  ·  M598 MASTER DISSERTATION", { sz: 12, b: true, c: C.cyan });
  T(s, 0.6, 0.88, 7.3, 2.75, "An Uncertainty-Aware, Explainable and Human-Reviewed Framework for Remaining-Useful-Life-Based Maintenance Prioritisation", { f: "head", sz: 32, b: true });
  T(s, 0.6, 3.68, 7.3, 0.4, "Evidence from the NASA C-MAPSS FD001 Turbofan Dataset", { sz: 18, c: C.cyan, b: true });
  R(s, 0.6, 4.25, 7.3, 1.12, { fill: C.white, line: C.grid, r: 0.08 });
  T(s, 0.85, 4.36, 6.9, 0.28, "RESEARCH QUESTION", { sz: 11, b: true, c: C.sub });
  T(s, 0.85, 4.64, 6.9, 0.66, "Can RUL evidence support maintenance prioritisation without hiding uncertainty or removing human authority?", { sz: 17 });
  T(s, 0.6, 5.58, 7.3, 1.2, [
    { t: "Ranitabh Mallick", b: true, sz: 16 }, { t: "  ·  Student ID GH1047661", sz: 15, br: true },
    { t: "MSc Data Science, Artificial Intelligence and Digital Business", sz: 14, c: C.sub, br: true },
    { t: "Supervisor: Dr Hiba Khalid", sz: 14, c: C.sub, br: true },
    { t: "GISMA University of Applied Sciences  ·  Berlin, September 2026", sz: 14, c: C.sub },
  ]);
  I(s, "engine", 8.05, 1.55, 5.0, 2.083, { cls: "hero" });
  T(s, 8.05, 3.75, 5.0, 0.3, "Illustrative turbofan schematic — not a validated engine simulation", { sz: 11, i: true, c: C.sub, align: "center" });
  L(s, 0.6, 6.88, 12.73, 6.88, { c: C.grid, w: 0.75 });
  T(s, 0.6, 6.98, 10, 0.32, "Applied quantitative research on secondary, simulated NASA C-MAPSS FD001 data", { sz: 11, c: C.sub });
  T(s, 11.6, 6.98, 1.13, 0.32, `1 / ${N_MAIN}`, { sz: 11, c: C.sub, align: "right" });
  s.notes = notes({
    say: "Good morning. My dissertation asks one question: can remaining-useful-life evidence support maintenance prioritisation without hiding uncertainty or taking authority away from the human reviewer? I answer it with NASA's simulated FD001 turbofan data.",
    point: "The research question box.",
    evidence: "Secondary, simulated data only; no real fleet.",
    limit: "Everything that follows is conditional on one simulated dataset.",
    q: "Why FD001 and not real operator data?",
    a: "FD001 has public run-to-failure labels, one operating condition and one fault mode, so the framework can be evaluated without confounding regimes. The price is external validity, which I state as the main limitation.",
  });
}

// ===================================================================== 2
{
  const s = slide({ sec: "1 · Introduction", time: 35 });
  frame(s, 2, "1 · INTRODUCTION", "A point estimate can hide maintenance risk",
    "Source: Engine 18, official endpoint (Table 5.9); classes (Table 4.4)", [["Backup: triage classes", B(14)]]);
  T(s, 0.6, 1.45, 12.1, 0.32, "Class thresholds are stipulated research assumptions (Table 4.4) — not approved aircraft-maintenance rules", { sz: 14, i: true, c: C.sub });
  const x0 = 0.9, sc = 11.5 / 140, X = (v) => x0 + v * sc, yb = 1.95, hb = 1.95;
  bar(s, X(0), yb, 30 * sc, hb, C.coralT);
  bar(s, X(30), yb, 30 * sc, hb, "FDF1EC");
  bar(s, X(60), yb, 70 * sc, hb, C.greyT);
  R(s, X(130), yb, 10 * sc, hb, { fill: C.white, line: C.grid });
  T(s, X(0) + 0.1, yb + 0.08, 2.3, 0.3, "CRITICAL  ŷ ≤ 30", { sz: 14, b: true, c: C.coral });
  T(s, X(30) + 0.1, yb + 0.08, 2.3, 0.3, "HIGH  30 < ŷ ≤ 60", { sz: 14, b: true, c: "B5443F" });
  T(s, X(60) + 0.1, yb + 0.08, 4, 0.3, "MEDIUM  60 < ŷ ≤ 130", { sz: 14, b: true, c: C.sub });
  T(s, X(130) + 0.04, yb + 0.08, 0.8, 0.3, "LOW", { sz: 14, b: true, c: C.sub });
  L(s, X(0), yb + hb, X(140), yb + hb, { c: C.text, w: 1.25 });
  for (const v of [0, 30, 60, 130]) {
    L(s, X(v), yb + hb, X(v), yb + hb + 0.08, { c: C.text, w: 1 });
    T(s, X(v) - 0.4, yb + hb + 0.1, 0.8, 0.3, String(v), { sz: 14, c: C.sub, align: "center" });
  }
  T(s, X(95) - 0.8, yb + hb + 0.1, 1.6, 0.3, "RUL (cycles)", { sz: 14, c: C.sub, align: "center" });
  // step 1: prediction
  E(s, X(64.5) - 0.17, 2.62, 0.34, 0.34, { fill: C.cyan, line: C.white, lw: 2, step: 1 });
  T(s, X(64.5) + 0.3, 2.56, 5.2, 0.45, [{ t: "Predicted 64.5 cycles", b: true }, { t: "  →  MEDIUM" }], { sz: 18, c: "007E99", step: 1 });
  // step 2: observed
  E(s, X(28) - 0.17, 3.28, 0.34, 0.34, { fill: C.coral, line: C.white, lw: 2, step: 2 });
  T(s, X(28) + 0.3, 3.22, 5.6, 0.45, [{ t: "Observed 28 cycles", b: true }, { t: "  →  CRITICAL" }], { sz: 18, c: C.coral, step: 2 });
  L(s, X(28), 4.42, X(64.5), 4.42, { c: C.coral, w: 1.5, step: 2 });
  L(s, X(28), 4.32, X(28), 4.52, { c: C.coral, w: 1.5, step: 2 });
  L(s, X(64.5), 4.32, X(64.5), 4.52, { c: C.coral, w: 1.5, step: 2 });
  T(s, X(64.5) + 0.2, 4.27, 6, 0.36, "prediction − actual = +36.5 cycles (optimistic)", { sz: 16, b: true, c: C.coral, step: 2 });
  // step 3: what the reviewer lacks
  R(s, 0.6, 5.05, 5.95, 1.15, { fill: C.amberT, r: 0.08, step: 3 });
  T(s, 0.85, 5.17, 5.5, 1.35, [{ t: "No interval", b: true, c: C.amberD, sz: 18, br: true }, { t: "The reviewer cannot see how far 64.5 could be wrong.", sz: 16 }], { step: 3 });
  R(s, 6.78, 5.05, 5.95, 1.15, { fill: C.tealT, r: 0.08, step: 3 });
  T(s, 7.03, 5.17, 5.5, 1.35, [{ t: "No forced review", b: true, c: "0B7A6A", sz: 18, br: true }, { t: "A MEDIUM label alone joins the routine queue — no mandatory human check.", sz: 16 }], { step: 3 });
  s.notes = notes({
    say: "Here is why a single number is not enough. For Engine 18 the model predicted 64.5 cycles of remaining life, which falls in the MEDIUM band. [click] The observed value was 28 cycles: CRITICAL under the study's thresholds. The estimate was 36.5 cycles too optimistic. [click] A reviewer who sees only 64.5 has no error range, and a MEDIUM call does not by itself trigger a human review. These bands are research assumptions, not approved maintenance rules.",
    point: "Cyan dot (prediction), then coral dot (observed), then the +36.5 bracket.",
    evidence: "One official endpoint, Engine 18; cycles; prediction minus actual = 64.5 − 28 = +36.5.",
    limit: "One illustrative engine, chosen as an informative failure case — not typical error (MAE is 18.88).",
    q: "Isn't Engine 18 cherry-picked?",
    a: "Yes, deliberately, as a failure case — the dissertation reports it in Table 5.9 alongside Engine 41. The average picture is on slide 7: MAE 18.88 cycles with +10.90 bias, so optimism is systematic, not unique to this engine.",
  });
}

// ===================================================================== 3
{
  const s = slide({ sec: "2 · Related work", time: 30 });
  frame(s, 3, "2 · RELATED WORK", "The gap is governed integration, not a new algorithm",
    "Targeted narrative review (§3.1–3.7, Table 3.1) — not a systematic review", [["Backup: references", B(24)]]);
  T(s, 0.6, 1.45, 5.6, 0.32, "Established components", { sz: 14, b: true, c: C.sub });
  const comps = [
    ["RUL prediction", "Saxena et al. (2008a); Ramasso and Saxena (2014)"],
    ["Predictive uncertainty", "Angelopoulos and Bates (2023); Javanmardi and Hüllermeier (2023)"],
    ["Explainability", "Lundberg and Lee (2017); Vollert, Atzmueller and Theissler (2021)"],
    ["Maintenance prioritisation", "Jardine, Lin and Banjevic (2006); ISO 17359 (ISO, 2018a)"],
    ["Human oversight", "Parasuraman, Sheridan and Wickens (2000); Shneiderman (2020)"],
  ];
  comps.forEach(([h, c], i) => {
    const y = 1.85 + i * 0.95;
    R(s, 0.6, y, 5.6, 0.82, { fill: C.white, line: C.grid, r: 0.06, step: 1 });
    T(s, 0.85, y + 0.09, 5.2, 0.7, [{ t: h, b: true, sz: 17, br: true }, { t: c, sz: 12, c: C.sub }], { step: 1 });
  });
  L(s, 6.35, 4.15, 7.0, 4.15, { c: C.cyan, w: 2.5, arrow: true, step: 2 });
  R(s, 7.15, 1.45, 5.58, 5.22, { fill: C.white, line: C.cyan, lw: 1.5, r: 0.08, step: 2, cls: "glow" });
  T(s, 7.4, 1.6, 5.1, 0.62, "Contribution: evaluated integration and governance", { sz: 18, b: true, c: "007E99", step: 2 });
  ["Engine-safe modelling", "Explicit age-only baseline", "Frozen model selection", "Whole-engine uncertainty", "Checked SHAP interpretation", "Review-burden measurement", "Traceable human authority"].forEach((t, i) => {
    const y = 2.4 + i * 0.5;
    E(s, 7.45, y + 0.09, 0.13, 0.13, { fill: i < 4 ? C.cyan : C.teal, step: 2 });
    T(s, 7.72, y, 4.9, 0.34, t, { sz: 16, step: 2 });
  });
  T(s, 7.4, 5.95, 5.1, 0.62, "Claimed: a transparent, bounded combination and its measured limits — not state-of-the-art accuracy (§3.7)", { sz: 13, i: true, c: C.sub, step: 2 });
  s.notes = notes({
    say: "Each ingredient already exists: RUL models on C-MAPSS, conformal uncertainty, SHAP explanations, condition-based prioritisation and human-oversight principles. [click] What is missing is an evaluated, governed combination. So my contribution is not a new algorithm. It is engine-safe modelling with an explicit age-only baseline, frozen selection, whole-engine uncertainty, checked SHAP, a measured review burden and a traceable human decision.",
    point: "Left column, then the arrow into the contribution panel.",
    evidence: "Literature mapped in Table 3.1; contribution statement §1.4 and §3.7.",
    limit: "Targeted narrative review, not a systematic search.",
    q: "If every component exists, what is actually new?",
    a: "The evaluation of the combination under frozen rules: engine-level separation, an explicit naive baseline, whole-trajectory interval validity and width, checked SHAP, and the measured recall-versus-workload cost of human review. I claim that bounded combination, not state-of-the-art accuracy.",
  });
}

// ===================================================================== 4
{
  const s = slide({ sec: "3 · Approach", time: 45 });
  frame(s, 4, "3 · APPROACH", "Separation by engine, not by cycle row",
    "Partitions: Table 4.1 (§4.5) · data: Saxena and Goebel (2008)", [["Backup: partitions & leakage", B(3)]]);
  T(s, 0.6, 1.42, 12.1, 0.34, "Secondary, simulated NASA C-MAPSS FD001  ·  high-pressure-compressor degradation  ·  one operating condition", { sz: 15, c: C.sub });
  const p = 0.262, sq = 0.205;
  const grp = (row0, rows, y0, fill, line, step) => {
    for (let r = 0; r < rows; r++) for (let c = 0; c < 20; c++)
      R(s, 0.6 + c * p, y0 + r * p, sq, sq, { fill, line, lw: 0.75, r: 0.03, step });
  };
  grp(0, 3, 2.0, C.cyan, null, 1);
  T(s, 6.0, 2.0, 3.55, 0.75, [{ t: "60 modelling engines", b: true, sz: 17, br: true }, { t: "12,310 rows · fit + grouped 5-fold CV", sz: 14, c: C.sub }], { step: 1 });
  grp(0, 1, 2.98, "B3E5F0", C.cyan, 2);
  T(s, 6.0, 2.86, 3.55, 0.6, [{ t: "20 validation engines", b: true, sz: 17, br: true }, { t: "4,217 rows · compare and select", sz: 14, c: C.sub }], { step: 2 });
  grp(0, 1, 3.62, C.amber, null, 3);
  T(s, 6.0, 3.5, 3.55, 0.6, [{ t: "20 calibration engines", b: true, sz: 17, br: true }, { t: "4,104 rows · one conformal score each", sz: 14, c: C.sub }], { step: 3 });
  T(s, 0.6, 3.96, 5.3, 0.3, "Grouped for display; roles came from a seed-42 engine-level shuffle", { sz: 11, i: true, c: C.sub });
  // official test block
  T(s, 9.85, 1.92, 2.9, 0.34, "100 official test engines", { sz: 16, b: true, step: 4 });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++)
    R(s, 9.85 + c * 0.236, 2.32 + r * 0.2, 0.19, 0.155, { fill: C.white, line: C.text, lw: 0.75, r: 0.02, step: 4 });
  T(s, 9.85, 4.36, 2.9, 0.62, "One last-observed endpoint each · opened once, after every policy froze", { sz: 13, c: C.sub, step: 4 });
  // target card
  R(s, 0.6, 4.55, 8.95, 2.1, { fill: C.white, line: C.grid, r: 0.08 });
  T(s, 0.85, 4.7, 8.5, 0.4, "Primary target: uncapped RUL(i, t) = Tᵢ − t", { sz: 18, b: true });
  T(s, 0.85, 5.15, 8.5, 0.36, "Capped at 130 cycles: sensitivity analysis only", { sz: 16, c: C.sub });
  T(s, 0.85, 5.62, 8.5, 0.9, "No engine contributes rows to more than one role — so no trajectory leaks across fitting, selection, calibration and test", { sz: 16, b: true, c: "007E99" });
  s.notes = notes({
    say: "The data are secondary and simulated: NASA C-MAPSS FD001, one operating condition, one high-pressure-compressor fault. The key design choice is that I split by engine, not by cycle row. [click] Sixty engines, 12,310 rows, were used only for fitting and grouped cross-validation. [click] Twenty engines, 4,217 rows, only to choose the model. [click] Twenty more, 4,104 rows, only to calibrate uncertainty. [click] The 100 official test engines were opened once, one final endpoint each, after every policy was frozen. The primary target is uncapped RUL; capping at 130 cycles is only a sensitivity analysis.",
    point: "Each block as it appears; finish on the cyan sentence in the target card.",
    evidence: "Engines and rows: 60/12,310 · 20/4,217 · 20/4,104; test = 100 engines, 100 endpoints.",
    limit: "A single seed-42 split; selection may depend on it (Table 6.1).",
    q: "Why not a row-random split — you'd have more data?",
    a: "Consecutive cycles of one engine are strongly correlated; a row split puts neighbouring cycles of the same engine in train and test and inflates performance (Kaufman et al., 2012). Engine separation is what makes the held-out claim honest.",
  });
}

// ===================================================================== 5
{
  const s = slide({ sec: "3 · Approach", time: 50 });
  frame(s, 5, "3 · APPROACH", "Random Forest won a near tie through the frozen rule",
    "Validation: 20 engines, 4,217 rows · rules frozen before the test · Table 5.1, §4.7", [["Backup: full comparison", B(4)], ["selection rules", B(6)]]);
  T(s, 0.6, 1.45, 6.3, 0.34, "Mean engine RMSE · validation · cycles (lower is better)", { sz: 15, b: true, c: C.sub, step: 1 });
  const xb = 2.75, sc = 2.75 / 35;
  L(s, xb, 1.95, xb, 4.45, { c: C.text, w: 1, step: 1 });
  [["Random Forest", 29.479, C.cyan, ""], ["Naive age-only", 29.556, "9FB3C8", ""], ["XGBoost", 31.156, "D2DCE6", "outside band"], ["Ridge", 31.516, "D2DCE6", "outside band"]].forEach(([m, v, col, note], i) => {
    const y = 2.02 + i * 0.6;
    T(s, 0.6, y + 0.04, 2.05, 0.36, m, { sz: 16, b: i === 0, align: "right", step: 1 });
    bar(s, xb, y, v * sc, 0.42, col, { step: 1 });
    T(s, xb + v * sc + 0.1, y + 0.04, 1.8, 0.36, [{ t: v.toFixed(3), b: true }, { t: note ? `  ${note}` : "", sz: 12, c: C.sub }], { sz: 16, step: 1 });
  });
  R(s, 0.6, 4.7, 6.3, 1.2, { fill: C.cyanT, r: 0.08, step: 2 });
  T(s, 0.85, 4.82, 5.9, 1.0, [{ t: "Δ = 0.077 cycles", b: true, sz: 20, c: "007E99", br: true }, { t: "Both inside the predeclared 1% practical-equivalence band", sz: 16 }], { step: 2 });
  T(s, 7.35, 1.45, 5.4, 0.34, "Tie-break: mean PHM penalty (lower is better)", { sz: 15, b: true, c: C.sub, step: 3 });
  const xp = 9.2, sp = 2.6 / 170;
  L(s, xp, 1.95, xp, 3.25, { c: C.text, w: 1, step: 3 });
  [["Random Forest", 83.67, C.cyan], ["Naive age-only", 156.44, "9FB3C8"]].forEach(([m, v, col], i) => {
    const y = 2.02 + i * 0.6;
    T(s, 7.35, y + 0.04, 1.75, 0.36, m, { sz: 16, b: i === 0, align: "right", step: 3 });
    bar(s, xp, y, v * sp, 0.42, col, { step: 3 });
    T(s, xp + v * sp + 0.1, y + 0.04, 1.0, 0.36, v.toFixed(2), { sz: 16, b: true, step: 3 });
  });
  T(s, 7.35, 3.45, 5.4, 0.62, "Late (optimistic) error costs more: exp(e/10) − 1 if e ≥ 0, exp(−e/13) − 1 if e < 0", { sz: 14, c: C.sub, step: 3 });
  R(s, 7.35, 4.7, 5.38, 1.2, { fill: C.white, line: C.cyan, lw: 1.5, r: 0.08, step: 4, cls: "glow" });
  T(s, 7.6, 4.82, 4.95, 1.0, [{ t: "Selected: Random Forest", b: true, sz: 20, br: true }, { t: "by the asymmetric criterion — not by a large RMSE gain", sz: 16, c: C.sub }], { step: 4 });
  s.notes = notes({
    say: "I compared four candidates: an age-only rule, Ridge, Random Forest and XGBoost. On validation, Random Forest's mean engine RMSE was 29.479 cycles; the age-only rule's was 29.556. [click] A difference of 0.077 cycles — both inside the 1% practical-equivalence band fixed in advance. [click] The predeclared tie-break was the asymmetric PHM penalty, which punishes late predictions harder: 83.67 for Random Forest against 156.44. [click] So Random Forest was selected, but honestly: it won a near tie through the frozen rule, not through a large accuracy gain. That is exactly why the age-only baseline is there.",
    point: "The two near-identical top bars; then the PHM bars; then the selection card.",
    evidence: "Mean engine RMSE over 20 validation engines (cycles); mean PHM penalty (unitless).",
    limit: "Near tie on RMSE; the age rule's pooled RMSE was worse (41.135 vs 33.073, backup B4), but selection used the frozen criterion only.",
    q: "If age alone almost matches, do the sensors add anything?",
    a: "On mean engine RMSE, barely. The sensors matter through the asymmetric penalty and on the truncated test endpoints, where a post-closure comparison gave the age rule MAE 30.88 versus 18.88 — but that comparison reuses opened outcomes, so I report it as descriptive, not as selection evidence.",
  });
}

// ===================================================================== 6
{
  const s = slide({ sec: "3 · Approach", time: 50 });
  frame(s, 6, "3 · APPROACH", "One score per engine sets a deliberately wide radius",
    "Engine-block split conformal (§4.8; Lei et al., 2018a; Angelopoulos and Bates, 2023)", [["Backup: rank and assumptions", B(7)]]);
  R(s, 0.6, 1.45, 6.0, 1.5, { fill: C.white, line: C.grid, r: 0.08, step: 1 });
  T(s, 0.85, 1.55, 5.6, 0.3, "Score for each calibration engine i", { sz: 14, b: true, c: C.sub, step: 1 });
  T(s, 0.85, 1.9, 5.6, 0.5, "sᵢ = maxₜ | ŷ(i, t) − y(i, t) |", { sz: 24, b: true, step: 1 });
  T(s, 0.85, 2.45, 5.6, 0.4, "largest absolute residual over the whole trajectory · n = 20", { sz: 14, c: C.sub, step: 1 });
  T(s, 6.95, 1.5, 5.8, 1.45, [
    { t: "Nominal coverage 90% · interval ŷ ± q̂", sz: 16, br: true },
    { t: "Lower bound clipped at 0 cycles", sz: 16, br: true },
    { t: "Validity is marginal: it assumes exchangeable engines and a prespecified score", sz: 16, c: C.amberD, b: true },
  ]);
  T(s, 0.6, 3.15, 9, 0.3, "20 engine scores, sorted ascending (rank positions only; values in Figure 4.5)", { sz: 13, c: C.sub, step: 2 });
  for (let i = 0; i < 20; i++) {
    const x = 0.6 + i * 0.608;
    R(s, x, 3.5, 0.52, 0.52, { fill: C.white, line: "9FB3C8", r: 0.05, step: 2 });
    T(s, x, 3.5, 0.52, 0.52, String(i + 1), { sz: 14, c: C.sub, align: "center", valign: "middle", step: 2 });
  }
  const x19 = 0.6 + 18 * 0.608;
  R(s, x19, 3.5, 0.52, 0.52, { fill: C.cyan, r: 0.05, step: 3, cls: "glow" });
  T(s, x19, 3.5, 0.52, 0.52, "19", { sz: 14, b: true, c: C.white, align: "center", valign: "middle", step: 3 });
  L(s, x19 + 0.26, 4.45, x19 + 0.26, 4.08, { c: C.cyan, w: 2, arrow: true, step: 3 });
  T(s, 4.6, 4.42, 7.0, 0.42, [{ t: "19th of 20  →  " }, { t: "q̂ = 107.90 cycles", b: true }], { sz: 20, c: "007E99", align: "right", step: 3 });
  // example interval
  T(s, 0.6, 5.0, 12, 0.36, "Example — Engine 18 (derived): 64.5 ± 107.90  →  [0, 172.40] cycles", { sz: 16, b: true, step: 4 });
  const ax = 0.9, as = 11.5 / 200, A = (v) => ax + v * as, ya = 6.3;
  L(s, A(0), ya, A(200), ya, { c: C.text, w: 1, step: 4 });
  for (const v of [0, 50, 100, 150, 200]) T(s, A(v) - 0.35, ya + 0.06, 0.7, 0.28, String(v), { sz: 12, c: C.sub, align: "center", step: 4 });
  E(s, A(64.5) - 0.15, 5.83, 0.3, 0.3, { fill: C.cyan, line: C.white, lw: 2, step: 4 });
  T(s, A(64.5) + 0.25, 5.5, 1.6, 0.3, "ŷ = 64.5", { sz: 14, b: true, c: "007E99", step: 4 });
  R(s, A(0), 5.92, A(172.4) - A(0), 0.13, { fill: C.amber, ft: 15, step: 5 });
  L(s, A(172.4), 5.8, A(172.4), 6.17, { c: C.amberD, w: 2, step: 5 });
  T(s, A(172.4) + 0.1, 5.8, 1.2, 0.3, "172.40", { sz: 14, b: true, c: C.amberD, step: 5 });
  L(s, A(0), 5.8, A(0), 6.17, { c: C.coral, w: 2.5, step: 5 });
  T(s, A(0) + 0.1, 5.5, 2.6, 0.3, "clipped at 0", { sz: 14, b: true, c: C.coral, step: 5 });
  s.notes = notes({
    say: "For uncertainty the unit is again the engine. Each of the 20 calibration engines contributes one score: its largest absolute error anywhere along its trajectory. [click] I sort those 20 scores. [click] For 90% nominal coverage the finite-sample rule picks the 19th of 20, giving a radius of 107.90 cycles. [click] Take Engine 18's prediction of 64.5. [click] The interval is plus or minus 107.90, and the lower bound clips at zero. Because it protects whole trajectories rather than single rows, it is deliberately conservative. Its validity is marginal and rests on exchangeable engines and a score fixed in advance — which it was.",
    point: "The formula, the rank strip, the highlighted 19th slot, then the example interval.",
    evidence: "n = 20 calibration engines; rank 19 of 20; q̂ = 107.90 cycles (107.8965).",
    limit: "Twenty engines give a coarse order statistic; q̂ is sensitive to one engine (Table 6.1).",
    q: "Why the maximum residual instead of row residuals?",
    a: "Rows of one engine are not independent; calibrating them as if they were inflates the effective sample size. One maximum per engine targets coverage of the complete trajectory. The cost is width — and slide 8 shows that cost explicitly.",
  });
}

// ===================================================================== 7
{
  const s = slide({ sec: "4 · Evaluation and results", time: 55 });
  frame(s, 7, "4 · EVALUATION AND RESULTS", "Endpoint error is moderate, but the bias is optimistic",
    "Official test: 100 engines, one endpoint each, evaluated once · bootstrap: 5,000 engine resamples · Table 5.2", [["Backup: bootstrap", B(8)]]);
  const tiles = [
    ["MAE", "18.88", 18.88, 15.56, 22.48, C.cyan, "007E99", 1],
    ["RMSE", "25.73", 25.73, 21.33, 30.15, C.cyan, "007E99", 2],
    ["Bias (prediction − actual)", "+10.90", 10.9, 6.47, 15.57, C.coral, C.coral, 3],
  ];
  tiles.forEach(([lab, val, v, lo, hi, col, tc, st], i) => {
    const x = 0.6 + i * 4.1;
    R(s, x, 1.45, 3.9, 2.85, { fill: C.white, line: st === 3 ? C.coral : C.grid, lw: st === 3 ? 2 : 1, r: 0.08, step: st, cls: st === 3 ? "glow" : "" });
    T(s, x + 0.25, 1.58, 3.5, 0.34, lab, { sz: 16, b: true, c: C.sub, step: st });
    T(s, x + 0.25, 1.95, 3.5, 0.8, [{ t: val, sz: 44, b: true, c: tc }, { t: "  cycles", sz: 16, c: C.sub }], { step: st });
    const ax = x + 0.25, aw = 3.4, sc = aw / 35, P = (q) => ax + q * sc;
    L(s, ax, 3.45, ax + aw, 3.45, { c: C.grid, w: 1, step: st });
    for (const t of [0, 10, 20, 30]) T(s, P(t) - 0.25, 3.5, 0.5, 0.25, String(t), { sz: 11, c: C.sub, align: "center", step: st });
    R(s, P(lo), 3.38, P(hi) - P(lo), 0.14, { fill: col, ft: 55, r: 0.04, step: st });
    E(s, P(v) - 0.1, 3.35, 0.2, 0.2, { fill: col, line: C.white, lw: 1.5, step: st });
    T(s, x + 0.25, 3.82, 3.5, 0.3, `95% CI ${lo.toFixed(2)}–${hi.toFixed(2)}`, { sz: 14, c: C.sub, step: st });
  });
  T(s, 0.6, 4.6, 6.0, 1.9, [
    { t: "Positive bias = optimistic", b: true, sz: 20, br: true },
    { t: "The model usually predicts more remaining life than actually remains — 69% of endpoints were over-estimated.", sz: 16 },
  ], { step: 4 });
  R(s, 6.95, 4.6, 5.78, 1.55, { fill: C.coralT, r: 0.08, step: 4 });
  T(s, 7.2, 4.72, 5.3, 1.75, [
    { t: "Why it matters", b: true, sz: 18, c: C.coral, br: true },
    { t: "Optimistic estimates can delay review. The bias CI (6.47–15.57) lies entirely above zero, so the optimism is systematic.", sz: 16 },
  ], { step: 4 });
  s.notes = notes({
    say: "Now the once-only official test on 100 engine endpoints. [click] Mean absolute error was 18.88 cycles, bootstrap interval 15.56 to 22.48. [click] RMSE was 25.73, interval 21.33 to 30.15 — larger than MAE because a minority of errors are large. [click] The most important number is the bias: plus 10.90 cycles, interval 6.47 to 15.57. [click] Bias is prediction minus actual, so positive means the model usually predicts more life than remains; 69% of endpoints were overestimated. The whole interval sits above zero, so this is systematic, and it is the risky direction: optimism can delay review. The bootstrap reflects resampling these 100 engines, not new fleets.",
    point: "Each tile's dot and interval bar; end on the coral bias tile.",
    evidence: "n = 100 official engine endpoints; cycles; 95% bootstrap CIs from 5,000 engine resamples.",
    limit: "Single test snapshot per engine; CIs describe sampling over these engines only.",
    q: "With a +10.90 bias, why not simply subtract it?",
    a: "Because estimating the correction on the already-opened test set would leak test information. A bias correction must be prespecified and tested on new engines — that is listed as future work, and it is why the interval and the review guard exist.",
  });
}

// ===================================================================== 8
{
  const s = slide({ sec: "4 · Evaluation and results", time: 35 });
  frame(s, 8, "4 · EVALUATION AND RESULTS", "Full coverage came with intervals too wide to schedule",
    "Tables 5.2 and 5.7 (§5.4, §5.7) · coverage counts are observed, not guaranteed", [["Backup: conformal ablation", B(11)]]);
  T(s, 0.6, 1.42, 3.0, 0.6, "Conformal score", { sz: 13, b: true, c: C.sub });
  T(s, 3.75, 1.42, 4.7, 0.6, "Mean interval width · cycles · 100 endpoints", { sz: 13, b: true, c: C.sub });
  T(s, 8.75, 1.42, 1.5, 0.6, "Endpoints covered", { sz: 13, b: true, c: C.sub });
  T(s, 10.35, 1.42, 2.4, 0.6, "Validation trajectories fully covered (of 20)", { sz: 13, b: true, c: C.sub });
  const sc = 4.4 / 200;
  const row = (y, name, tag, tagc, w, cov, traj, st) => {
    T(s, 0.6, y, 3.05, 0.75, [{ t: name, b: true, sz: 17, br: true }, { t: tag, b: true, sz: 11, c: tagc }], { step: st });
    bar(s, 3.75, y + 0.08, w * sc, 0.45, C.amber, { step: st, ft: st === 1 ? 0 : 35 });
    T(s, 3.75 + w * sc + 0.1, y + 0.12, 1.0, 0.36, w.toFixed(2), { sz: 16, b: true, step: st });
    T(s, 8.75, y + 0.1, 1.5, 0.4, cov, { sz: 20, b: true, c: st === 1 ? "007E99" : C.text, step: st });
    for (let i = 0; i < 20; i++) {
      const fill = i < traj ? C.cyan : C.white;
      E(s, 10.35 + (i % 10) * 0.23, y + 0.06 + Math.floor(i / 10) * 0.25, 0.17, 0.17, { fill, line: i < traj ? null : "9FB3C8", lw: 0.75, step: st });
    }
  };
  row(2.15, "Engine maximum", "FROZEN · PRIMARY", "007E99", 182.46, "100/100", 20, 1);
  T(s, 0.6, 2.98, 12.1, 0.34, "Wilson 95% CI 96.30–100%  ·  median width 193.64  ·  63% of lower bounds clipped at 0", { sz: 14, c: C.sub, step: 1 });
  row(3.6, "Row-level score", "POST-CLOSURE · EXPLORATORY", C.amberD, 106.34, "96/100", 8, 2);
  row(4.5, "Engine-mean score", "POST-CLOSURE · EXPLORATORY", C.amberD, 100.72, "96/100", 8, 2);
  R(s, 0.6, 5.5, 12.13, 1.15, { fill: C.amberT, r: 0.08, step: 3 });
  T(s, 0.85, 5.6, 11.7, 1.0, [
    { t: "Narrower scores cut mean width by 42–45% but fully covered only 8 of 20 validation trajectories.", sz: 16, b: true, br: true },
    { t: "Exploratory comparisons — not replacements for the frozen analysis. 100/100 is observed coverage, not a guarantee.", sz: 15 },
  ], { step: 3 });
  s.notes = notes({
    say: "Coverage and width must be read together. The frozen interval covered all 100 endpoints, Wilson interval 96.3 to 100 percent — but its mean width was 182.46 cycles, and 63% of lower bounds hit zero. [click] After closure I tried narrower scores: about 101 to 106 cycles wide, still 96 of 100 endpoints covered, but only 8 of 20 validation trajectories fully covered. [click] These are exploratory comparisons, not replacements, and 100 of 100 is observed coverage, not a guarantee.",
    point: "Top amber bar and its 20 filled dots; then the two shorter bars with 8 dots.",
    evidence: "Widths over 100 endpoints (cycles); trajectories = 20 validation engines; post-closure rows labelled.",
    limit: "Selecting a narrower score now would use already-opened test knowledge.",
    q: "Why not just adopt the narrower row-level interval?",
    a: "It loses whole-trajectory protection — 8 of 20 engines were not fully covered — and choosing it after seeing these results would import test knowledge. Replacing the score needs fresh engines and a prespecified comparison.",
  });
}

// ===================================================================== 9
{
  const s = slide({ sec: "4 · Evaluation and results", time: 40 });
  frame(s, 9, "4 · EVALUATION AND RESULTS", "SHAP traces how the model overestimated Engine 18",
    "Local: Table 5.9 · global: Table 5.8 (§5.8; Lundberg and Lee, 2017) · ‘other 13’ = derived remainder", [["Backup: global SHAP", B(12)], ["failure cases", B(13)]]);
  T(s, 0.6, 1.42, 8.9, 0.34, "TreeSHAP contributions · Engine 18 · cycles", { sz: 15, b: true, c: C.sub });
  const x0 = 3.25, sc = 6.0 / 120, X = (v) => x0 + v * sc;
  const rows = [
    ["Model baseline", 0, 107.84, "BCCCDC", "107.84", 1],
    ["Age (cycles)", 79.74, 107.84, C.cyan, "−28.1", 2],
    ["Ps30 (s11)", 67.54, 79.74, C.cyan, "−12.2", 2],
    ["T50 (s4)", 56.14, 67.54, C.cyan, "−11.4", 2],
    ["Nc core speed (s9)", 56.14, 61.74, C.coral, "+5.6", 3],
    ["NRc (s14)", 61.74, 66.34, C.coral, "+4.6", 3],
    ["Other 13 features", 64.5, 66.34, "D2DCE6", "≈ −1.8", 4],
    ["Prediction", 0, 64.5, "007E99", "64.5", 4],
  ];
  rows.forEach(([lab, a, b, col, v, st], i) => {
    const y = 1.88 + i * 0.56;
    T(s, 0.6, y + 0.04, 2.55, 0.36, lab, { sz: 16, b: i === 0 || i === 7, align: "right", step: st });
    bar(s, X(a), y, X(b) - X(a), 0.42, col, { step: st });
    T(s, X(b) + 0.1, y + 0.04, 1.2, 0.36, v, { sz: 16, b: true, c: col === C.coral ? C.coral : C.text, step: st });
    if (i > 0 && i < 7) L(s, X(i <= 3 ? b : a), y - 0.14, X(i <= 3 ? b : a), y, { c: "9FB3C8", w: 0.75, dash: true, step: st });
  });
  L(s, X(28), 1.8, X(28), 6.4, { c: C.coral, w: 2, dash: true, step: 5 });
  T(s, X(28) + 0.1, 6.42, 2.6, 0.32, "true RUL 28", { sz: 15, b: true, c: C.coral, step: 5 });
  R(s, 9.75, 1.42, 2.98, 2.15, { fill: C.white, line: C.grid, r: 0.08 });
  T(s, 9.97, 1.55, 2.6, 2.7, [
    { t: "TreeSHAP checks", b: true, sz: 16, br: true },
    { t: "100 endpoints × 18 predictors", sz: 14, br: true },
    { t: "Additivity error < 10⁻¹² cycles", sz: 14, br: true },
    { t: "Baseline 107.84 cycles", sz: 14, br: true },
    { t: "Age ranked 1st globally (mean |SHAP| 24.76)", sz: 14 },
  ], { psa: 4 });
  R(s, 9.75, 3.75, 2.98, 1.45, { fill: C.coralT, r: 0.08, step: 5 });
  T(s, 9.97, 3.87, 2.6, 1.25, "Explains the fitted model's output — not mechanical or physical causation.", { sz: 16, b: true, c: C.coral, step: 5 });
  s.notes = notes({
    say: "TreeSHAP reconstructs every endpoint prediction exactly, to below 10 to the minus 12 cycles. For Engine 18, start from the model baseline of 107.84. [click] Age removes 28.1 cycles, Ps30 12.2 and T50 11.4. [click] But the two core-speed channels push it back up, by 5.6 and 4.6. [click] The rest nets about minus 1.8, giving 64.5 — [click] against a true value of 28. So SHAP shows how the fitted model reached an optimistic answer. It does not show what physically happened in the engine.",
    point: "Baseline bar, the three cyan reductions, the two coral increases, then the dashed true-RUL line.",
    evidence: "Contributions in cycles from Table 5.9 (rounded); ‘other 13’ is 64.5 minus the listed terms, derived.",
    limit: "Correlated channels can exchange credit; SHAP is non-causal.",
    q: "Does this show core-speed sensors cause the error — should you drop them?",
    a: "No causal claim. The post-closure ablation without sensors 9 and 14 lowered validation pooled RMSE from 33.07 to 31.76, about 4%, but on reused validation engines; it is a hypothesis to test on new engines, not a change to the frozen model.",
  });
}

// ===================================================================== 10
{
  const s = slide({ sec: "4 · Evaluation and results", time: 65 });
  frame(s, 10, "4 · EVALUATION AND RESULTS", "High recall came with a heavy review burden",
    "Table 5.10, Figure 5.10 (§5.9) · offline, post-closure · classes from stipulated thresholds", [["Backup: denominators", B(14)], ["row warning", B(15)]]);
  T(s, 0.6, 1.42, 5.9, 0.34, "Point-only triage · 100 official endpoints", { sz: 15, b: true, c: C.sub, step: 1 });
  const sc = 5.9 / 100;
  bar(s, 0.6, 1.9, 62 * sc, 0.55, "9FB3C8", { step: 1 });
  bar(s, 0.6 + 62 * sc, 1.9, 34 * sc, 0.55, C.coral, { step: 1 });
  bar(s, 0.6 + 96 * sc, 1.9, 4 * sc, 0.55, C.grid, { step: 1 });
  T(s, 0.6, 2.5, 3.6, 0.3, "62 correct", { sz: 14, c: C.sub, step: 1 });
  T(s, 0.6 + 62 * sc, 2.5, 2.2, 0.3, "34 under-triaged", { sz: 14, b: true, c: C.coral, step: 1 });
  T(s, 0.6, 2.95, 5.9, 0.8, [{ t: "34/100", sz: 40, b: true, c: C.coral }, { t: "  under-triaged", sz: 18 }], { step: 1 });
  T(s, 0.6, 3.75, 5.9, 0.62, "including 9 of 25 truly CRITICAL engines not labelled CRITICAL", { sz: 16, step: 1 });
  T(s, 7.0, 1.42, 5.73, 0.34, "Offline lower-bound guard · same 100 endpoints", { sz: 15, b: true, c: C.sub, step: 2 });
  R(s, 7.0, 1.85, 2.78, 1.6, { fill: C.tealT, r: 0.08, step: 2, cls: "glow" });
  T(s, 7.2, 1.95, 2.4, 1.45, [{ t: "39/39", sz: 40, b: true, c: "0B7A6A", br: true }, { t: "truly CRITICAL-or-HIGH sent to review", sz: 14 }], { step: 2 });
  R(s, 9.95, 1.85, 2.78, 1.6, { fill: C.amberT, r: 0.08, step: 2 });
  T(s, 10.15, 1.95, 2.4, 1.45, [{ t: "81/100", sz: 40, b: true, c: C.amberD, br: true }, { t: "endpoints sent to review", sz: 14 }], { step: 2 });
  const s2 = 5.73 / 100;
  bar(s, 7.0, 3.7, 39 * s2, 0.5, C.teal, { step: 3 });
  bar(s, 7.0 + 39 * s2, 3.7, 42 * s2, 0.5, C.amber, { step: 3 });
  R(s, 7.0 + 81 * s2, 3.7, 19 * s2, 0.5, { fill: C.white, line: "9FB3C8", step: 3 });
  T(s, 7.0, 4.25, 2.3, 0.3, "39 truly high-risk", { sz: 13, b: true, c: "0B7A6A", step: 3 });
  T(s, 7.0 + 39 * s2, 4.25, 2.3, 0.3, "42 other reviewed", { sz: 13, b: true, c: C.amberD, step: 3 });
  T(s, 7.0 + 81 * s2 - 0.3, 4.25, 1.4, 0.3, "19 not", { sz: 13, c: C.sub, align: "right", step: 3 });
  T(s, 7.0, 4.6, 5.73, 0.36, "47 of the 81 entered through the interval rule alone", { sz: 15, step: 3 });
  R(s, 0.6, 5.2, 12.13, 1.45, { fill: C.white, line: C.amber, lw: 1.5, r: 0.08, step: 4 });
  T(s, 0.85, 5.3, 11.7, 1.3, [
    { t: "Validation rows — repeated observations of 20 engines, not independent engines: ", b: true, sz: 15 },
    { t: "2,578/4,217 referred · 2/1,220 truly CRITICAL-or-HIGH rows missed.", sz: 15, br: true },
    { t: "Never pooled with endpoints. Offline and retrospective, not n8n routing. 39/39 is an observed count, not a measured safety rate.", sz: 15, b: true, c: C.coral },
  ], { step: 4 });
  s.notes = notes({
    say: "This is the central trade-off. [click] With point predictions alone, triage was correct for 62 of 100 endpoints and 34 were under-triaged — including 9 of the 25 truly critical engines not labelled critical. [click] After closure I tested an offline guard: review an engine if its point class is critical or high, or if its interval's lower bound is 30 cycles or less. It caught all 39 truly critical-or-high endpoints — but sent 81 of 100 engines to review. [click] Of those 81, 39 were truly high-risk, and 47 entered only through the interval rule. Recall improved; workload became heavy. [click] On validation rows it referred 2,578 of 4,217 and missed 2 of 1,220 high-risk rows — but those are repeated observations of 20 engines, so I never pool them with endpoints. And 39 of 39 is an observed count under simulated labels, not a safety rate.",
    point: "Coral segment; then the 39/39 and 81/100 tiles side by side; then the workload bar; then the warning box.",
    evidence: "Endpoints n = 100 (39 truly CRITICAL-or-HIGH, 25 truly CRITICAL); validation rows n = 4,217 (1,220 truly CRITICAL-or-HIGH).",
    limit: "Post-closure, offline; thresholds stipulated; review capacity unknown.",
    q: "Isn't 81% review just ‘review everything’? What did the guard add?",
    a: "It is close, and I say so: only 48.1% of reviewed endpoints were truly high-risk. The value is that the cost is now measured instead of hidden. Whether 81% is acceptable depends on real inspection capacity, which needs qualified users and stakeholder thresholds.",
  });
}

// ===================================================================== 11
{
  const s = slide({ sec: "4 · Evaluation — separate prototype", time: 75 });
  frame(s, 11, "4 · EVALUATION — SEPARATE PROTOTYPE", "Policy stays deterministic; the human decides",
    "§4.10, §5.10, Tables 5.11 and A.1 · fixed payload: no notebook, live model, sensor feed or dynamic SHAP", [["Backup: topology", B(16)], ["routes", B(17)], ["invalid MODIFY", B(19)]]);
  // Track A
  R(s, 0.6, 1.42, 12.13, 1.32, { fill: C.white, line: C.cyan, lw: 1.5, r: 0.08, step: 1 });
  T(s, 0.82, 1.48, 9, 0.3, "TRACK A · EVALUATED ANALYTICAL PIPELINE (offline notebook)", { sz: 13, b: true, c: "007E99", step: 1 });
  const nodesA = ["FD001 data", "Engine-safe split", "Frozen Random Forest", "Conformal interval", "SHAP explanation", "Offline review-policy audit"];
  nodesA.forEach((t, i) => {
    const x = 0.82 + i * 2.0, st = 1 + Math.floor(i / 2);
    R(s, x, 1.86, 1.78, 0.74, { fill: C.cyanT, line: C.cyan, lw: 0.75, r: 0.06, step: st });
    T(s, x + 0.05, 1.86, 1.68, 0.74, t, { sz: 14, b: true, align: "center", valign: "middle", step: st });
    if (i < 5) L(s, x + 1.8, 2.23, x + 1.99, 2.23, { c: C.cyan, w: 2, arrow: true, step: 1 + Math.floor((i + 1) / 2), flow: true });
  });
  // boundary
  L(s, 0.6, 3.0, 12.73, 3.0, { c: C.coral, w: 1.5, dash: true, step: 4 });
  R(s, 2.9, 2.82, 7.5, 0.36, { fill: C.bg, step: 4 });
  T(s, 2.9, 2.82, 7.5, 0.36, "No live connection implemented · Track B runs on a fixed illustrative payload", { sz: 14, b: true, c: C.coral, align: "center", valign: "middle", step: 4 });
  // Track B
  R(s, 0.6, 3.26, 12.13, 1.32, { fill: C.white, line: C.teal, lw: 1.5, r: 0.08, step: 5 });
  T(s, 0.82, 3.32, 10, 0.3, "TRACK B · SEPARATELY TESTED n8n PROTOTYPE (22 nodes)", { sz: 13, b: true, c: "0B7A6A", step: 5 });
  const nodesB = ["Fixed illustrative payload", "Provenance validation", "DEMO_POLICY_V1", "Qwen3 1.7B narration", "Human review form", "PostgreSQL + JSON audit"];
  nodesB.forEach((t, i) => {
    const x = 0.82 + i * 2.0, st = i < 3 ? 5 : 6;
    R(s, x, 3.7, 1.78, 0.74, { fill: i === 4 ? C.teal : C.tealT, line: C.teal, lw: 0.75, r: 0.06, step: st });
    T(s, x + 0.05, 3.7, 1.68, 0.74, i === 2 ? [{ t: "DEMO_POLICY_V1", sz: 12, br: true }, { t: "deterministic policy", sz: 13 }] : t, { sz: 14, b: true, c: i === 4 ? C.white : C.text, align: "center", valign: "middle", step: st });
    if (i < 5) L(s, x + 1.8, 4.07, x + 1.99, 4.07, { c: C.teal, w: 2, arrow: true, step: i < 2 ? 5 : 6 });
  });
  // decision routes from the human form (node 5 centre x = 0.82 + 4*2 + 0.89 = 9.71)
  const routes = [["APPROVE", "2 exported records", C.tealT, C.teal, false], ["REJECT", "1 exported record", C.tealT, C.teal, false], ["MODIFY (valid)", "1 exported record", C.tealT, C.teal, false], ["MODIFY (invalid)", "route trace only", C.amberT, C.amber, true]];
  routes.forEach(([h, sub, f, l, dash], i) => {
    const x = 4.95 + i * 1.97;
    L(s, 9.71, 4.46, x + 0.9, 4.86, { c: l, w: 1.25, dash, step: 7 });
    R(s, x, 4.88, 1.8, 0.78, { fill: f, line: l, lw: 1, dash, r: 0.06, step: 7 });
    T(s, x + 0.05, 4.92, 1.7, 0.72, [{ t: h, b: true, sz: 14, br: true }, { t: sub, sz: 12, c: C.sub }], { align: "center", valign: "middle", step: 7 });
  });
  T(s, 4.95, 5.82, 7.78, 0.8, "Deterministic policy fixes priority and proposed action before narration; the reviewer has final authority.", { sz: 15, b: true, c: "0B7A6A", step: 7 });
  R(s, 0.6, 4.84, 4.1, 1.85, { fill: C.white, line: C.grid, r: 0.08, step: 8 });
  T(s, 0.8, 4.92, 3.75, 1.72, [
    { t: "Qwen3 1.7B · temperature 0", b: true, sz: 14, br: true },
    { t: "Narrates the supplied evidence only", sz: 13, br: true },
    { t: "Cannot change values", sz: 13, c: C.coral, br: true },
    { t: "Cannot assign the priority", sz: 13, c: C.coral, br: true },
    { t: "Cannot choose the decision", sz: 13, c: C.coral },
  ], { step: 8 });
  s.notes = notes({
    say: "The workflow is a separate prototype, and the boundary matters. [click ×3] Track A is the evaluated analysis: data, engine-safe split, frozen forest, conformal interval, SHAP and the offline review audit. [click] There is no live connection to Track B. [click ×2] Track B is a 22-node n8n workflow driven by a fixed illustrative payload. It validates provenance and applies a deterministic policy, DEMO_POLICY_V1, which fixes priority and proposed action. Only then does a local Qwen3 1.7B model, at temperature zero, narrate the supplied evidence. [click] A human approves, rejects or modifies. The exported records show two approvals, one rejection and one valid modification; an invalid modification has an editor trace but no exported record of its final state. [click] The model cannot change values, assign priority or decide. The prototype does not call the notebook, a live model or sensors, compute SHAP, or route the offline guard. Authority stays with the policy and the reviewer.",
    point: "Track A left to right; the coral boundary; Track B; the four route boxes; the model-constraint card.",
    evidence: "4 exported audit records (2 APPROVE, 1 REJECT, 1 valid MODIFY); invalid MODIFY = editor trace only.",
    limit: "Manually seeded local runs; no user study, security, concurrency or reliability evaluation.",
    q: "What does the language model contribute if it can't decide anything?",
    a: "Readability: it turns supplied numbers and drivers into a short narrative for the reviewer. It is deliberately subordinate — values, priority and action are fixed upstream. I observed it preserving the policy values, though it sometimes exceeded the requested two-sentence format.",
  });
}

// ===================================================================== 12
{
  const s = slide({ sec: "5 · Conclusion", time: 45 });
  frame(s, 12, "5 · CONCLUSION", "Three conclusions, bounded by clear limits",
    "§6.6, §7.1–7.4, Table 6.1", [["Backup: provenance", B(21)], ["claims boundary", B(23)]]);
  const cards = [
    ["1 · ACCURACY", "18.88", " cycles MAE", "007E99", C.cyan, "Selected by a frozen PHM tie-break after a near tie; bias +10.90 cycles is optimistic."],
    ["2 · UNCERTAINTY", "182.46", " cycles wide", C.amberD, C.amber, "Whole-engine intervals protected trajectories but were too wide; 63% of lower bounds clipped."],
    ["3 · HUMAN REVIEW", "39/39", "  at 81/100 reviewed", "0B7A6A", C.teal, "All observed high-risk endpoints reviewed, at heavy workload; the prototype kept policy deterministic and the human in charge."],
  ];
  cards.forEach(([lab, big, unit, tc, lc, txt], i) => {
    const x = 0.6 + i * 4.1;
    R(s, x, 1.42, 3.93, 2.6, { fill: C.white, line: lc, lw: 1.5, r: 0.08, step: i + 1 });
    T(s, x + 0.22, 1.54, 3.5, 0.3, lab, { sz: 13, b: true, c: tc, step: i + 1 });
    T(s, x + 0.22, 1.86, 3.55, 0.62, [{ t: big, sz: 30, b: true, c: tc }, { t: unit, sz: 14, c: C.sub }], { step: i + 1 });
    T(s, x + 0.22, 2.55, 3.5, 1.4, txt, { sz: 15, step: i + 1 });
  });
  R(s, 0.6, 4.22, 7.55, 2.45, { fill: C.coralT, r: 0.08, step: 4 });
  T(s, 0.85, 4.32, 7.1, 2.3, [
    { t: "Limits", b: true, sz: 16, c: C.coral, br: true },
    { t: "Secondary simulated FD001 · one regime, one fault mode · 20 calibration engines · stipulated thresholds · no qualified-technician study · no live model-to-workflow link · historical provenance gaps", sz: 14, br: true },
    { t: "Not claimed: field effectiveness · validated operational safety · production readiness · aircraft-maintenance certification", sz: 14, b: true },
  ], { step: 4, psa: 4 });
  R(s, 8.35, 4.22, 4.38, 2.45, { fill: C.cyanT, r: 0.08, step: 4 });
  T(s, 8.58, 4.32, 3.95, 2.3, [
    { t: "Next test", b: true, sz: 16, c: "007E99", br: true },
    { t: "Fresh engine regimes · conditional or group-aware uncertainty · bias correction on new engines · live authenticated interface · qualified reviewers with workload and automation-bias study · immutable provenance", sz: 14 },
  ], { step: 4, psa: 4 });
  s.notes = notes({
    say: "Three conclusions. [click] Accuracy: Random Forest was chosen by a frozen tie-break after a near tie, with endpoint MAE of 18.88 cycles but an optimistic bias of 10.90. [click] Uncertainty: whole-engine intervals protected complete trajectories but averaged 182 cycles wide. [click] Human review: the offline guard caught all 39 observed high-risk endpoints but sent 81 of 100 to review, and the prototype kept policy deterministic and the human in charge. [click] The limits are clear — simulated FD001, one regime, stipulated thresholds, no technician study, no live connection — so no safety, production or certification claim. The next test is fresh engines with qualified reviewers. Thank you; I'm happy to take questions.",
    point: "The three cards in turn; then the limits and next-test panels.",
    evidence: "MAE 18.88 cycles (n = 100 endpoints); width 182.46 cycles; 39/39 and 81/100 endpoints.",
    limit: "All conclusions are conditional on simulated FD001 labels and stipulated thresholds.",
    q: "What is the single most important finding?",
    a: "That making uncertainty visible changes the decision problem: interval-aware review caught every observed high-risk endpoint the point estimate missed, but at a measured and heavy workload. Reporting that cost honestly, rather than a headline accuracy, is the contribution.",
  });
}

// ===================================================================== 13 (closing)
{
  const s = slide({ sec: "Questions", time: 0 });
  I(s, "engine", 2.4, 0.75, 8.5, 3.54, { cls: "hero" });
  T(s, 2.4, 4.3, 8.5, 0.3, "Illustrative turbofan schematic — not a validated engine simulation", { sz: 11, i: true, c: C.sub, align: "center" });
  T(s, 1.0, 4.8, 11.33, 0.8, "Thank you — Questions", { f: "head", sz: 40, b: true, align: "center" });
  T(s, 1.0, 5.65, 11.33, 0.4, "Ranitabh Mallick  ·  Supervisor: Dr Hiba Khalid  ·  GISMA University of Applied Sciences", { sz: 16, c: C.sub, align: "center" });
  T(s, 1.0, 6.15, 11.33, 0.4, [{ t: "Backup slides: index ↗", link: 13, b: true, c: C.cyan }], { sz: 16, align: "center" });
  L(s, 0.6, 6.88, 12.73, 6.88, { c: C.grid, w: 0.75 });
  T(s, 11.6, 6.98, 1.13, 0.32, `13 / ${N_MAIN}`, { sz: 11, c: C.sub, align: "right" });
  s.notes = "Stay on this slide during questions. Use the backup index (link on this slide) to open evidence slides; each backup slide links back to the index.";
}

function notes(n) {
  return `SAY (≈ timed):\n${n.say}\n\nPOINT TO: ${n.point}\n\nEVIDENCE · DENOMINATOR · UNIT: ${n.evidence}\n\nMAIN LIMITATION: ${n.limit}\n\nLIKELY EXAMINER QUESTION: ${n.q}\nANSWER: ${n.a}`;
}

module.exports = { N_MAIN, B };
