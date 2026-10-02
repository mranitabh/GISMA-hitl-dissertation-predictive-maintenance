# Timed presenter script — MSc viva (M598)

**Ranitabh Mallick** · Student ID GH1047661 · Supervisor: Dr Hiba Khalid · GISMA University of Applied Sciences

Generated from the speaker notes in `Mallick_MSc_Viva_Presentation.pptx` (same text), so script and deck cannot drift apart.

Planned speaking time: **9:00** across slides 1–12, leaving about 1:00 of the 10:00 limit for pauses, transitions and interruptions. Slide 13 stays up during questions. `[click]` marks a presenter-controlled build.

| Slide | Section | Budget | Starts at | Words | At 150 wpm |
|---|---|---|---|---|---|
| 1 | Title | 15 s | 0:00 | 33 | 13 s |
| 2 | 1 · Introduction | 35 s | 0:15 | 75 | 30 s |
| 3 | 2 · Related work | 30 s | 0:50 | 57 | 23 s |
| 4 | 3 · Approach | 45 s | 1:20 | 90 | 36 s |
| 5 | 3 · Approach | 50 s | 2:05 | 92 | 37 s |
| 6 | 3 · Approach | 50 s | 2:55 | 100 | 40 s |
| 7 | 4 · Evaluation and results | 55 s | 3:45 | 103 | 41 s |
| 8 | 4 · Evaluation and results | 35 s | 4:40 | 78 | 31 s |
| 9 | 4 · Evaluation and results | 40 s | 5:15 | 82 | 33 s |
| 10 | 4 · Evaluation and results | 65 s | 5:55 | 144 | 58 s |
| 11 | 4 · Evaluation — separate prototype | 75 s | 7:00 | 149 | 60 s |
| 12 | 5 · Conclusion | 45 s | 8:15 | 108 | 43 s |
| 13 | Questions | 0 s | 9:00 | 0 | 0 s |
| **Total** | | **9:00** | | **1111** | **7:24** |

## Slide 1 — Title · 15 s (from 0:00)

**Say:** Good morning. My dissertation asks one question: can remaining-useful-life evidence support maintenance prioritisation without hiding uncertainty or taking authority away from the human reviewer? I answer it with NASA's simulated FD001 turbofan data.

**Point to:** The research question box.

**Evidence · denominator · unit:** Secondary, simulated data only; no real fleet.

**Main limitation:** Everything that follows is conditional on one simulated dataset.

**Likely examiner question:** Why FD001 and not real operator data?

**Answer:** FD001 has public run-to-failure labels, one operating condition and one fault mode, so the framework can be evaluated without confounding regimes. The price is external validity, which I state as the main limitation.

## Slide 2 — 1 · Introduction · 35 s (from 0:15)

**Say:** Here is why a single number is not enough. For Engine 18 the model predicted 64.5 cycles of remaining life, which falls in the MEDIUM band. [click] The observed value was 28 cycles: CRITICAL under the study's thresholds. The estimate was 36.5 cycles too optimistic. [click] A reviewer who sees only 64.5 has no error range, and a MEDIUM call does not by itself trigger a human review. These bands are research assumptions, not approved maintenance rules.

**Point to:** Cyan dot (prediction), then coral dot (observed), then the +36.5 bracket.

**Evidence · denominator · unit:** One official endpoint, Engine 18; cycles; prediction minus actual = 64.5 − 28 = +36.5.

**Main limitation:** One illustrative engine, chosen as an informative failure case — not typical error (MAE is 18.88).

**Likely examiner question:** Isn't Engine 18 cherry-picked?

**Answer:** Yes, deliberately, as a failure case — the dissertation reports it in Table 5.9 alongside Engine 41. The average picture is on slide 7: MAE 18.88 cycles with +10.90 bias, so optimism is systematic, not unique to this engine.

## Slide 3 — 2 · Related work · 30 s (from 0:50)

**Say:** Each ingredient already exists: RUL models on C-MAPSS, conformal uncertainty, SHAP explanations, condition-based prioritisation and human-oversight principles. [click] What is missing is an evaluated, governed combination. So my contribution is not a new algorithm. It is engine-safe modelling with an explicit age-only baseline, frozen selection, whole-engine uncertainty, checked SHAP, a measured review burden and a traceable human decision.

**Point to:** Left column, then the arrow into the contribution panel.

**Evidence · denominator · unit:** Literature mapped in Table 3.1; contribution statement §1.4 and §3.7.

**Main limitation:** Targeted narrative review, not a systematic search.

**Likely examiner question:** If every component exists, what is actually new?

**Answer:** The evaluation of the combination under frozen rules: engine-level separation, an explicit naive baseline, whole-trajectory interval validity and width, checked SHAP, and the measured recall-versus-workload cost of human review. I claim that bounded combination, not state-of-the-art accuracy.

## Slide 4 — 3 · Approach · 45 s (from 1:20)

**Say:** The data are secondary and simulated: NASA C-MAPSS FD001, one operating condition, one high-pressure-compressor fault. The key design choice is that I split by engine, not by cycle row. [click] Sixty engines, 12,310 rows, were used only for fitting and grouped cross-validation. [click] Twenty engines, 4,217 rows, only to choose the model. [click] Twenty more, 4,104 rows, only to calibrate uncertainty. [click] The 100 official test engines were opened once, one final endpoint each, after every policy was frozen. The primary target is uncapped RUL; capping at 130 cycles is only a sensitivity analysis.

**Point to:** Each block as it appears; finish on the cyan sentence in the target card.

**Evidence · denominator · unit:** Engines and rows: 60/12,310 · 20/4,217 · 20/4,104; test = 100 engines, 100 endpoints.

**Main limitation:** A single seed-42 split; selection may depend on it (Table 6.1).

**Likely examiner question:** Why not a row-random split — you'd have more data?

**Answer:** Consecutive cycles of one engine are strongly correlated; a row split puts neighbouring cycles of the same engine in train and test and inflates performance (Kaufman et al., 2012). Engine separation is what makes the held-out claim honest.

## Slide 5 — 3 · Approach · 50 s (from 2:05)

**Say:** I compared four candidates: an age-only rule, Ridge, Random Forest and XGBoost. On validation, Random Forest's mean engine RMSE was 29.479 cycles; the age-only rule's was 29.556. [click] A difference of 0.077 cycles — both inside the 1% practical-equivalence band fixed in advance. [click] The predeclared tie-break was the asymmetric PHM penalty, which punishes late predictions harder: 83.67 for Random Forest against 156.44. [click] So Random Forest was selected, but honestly: it won a near tie through the frozen rule, not through a large accuracy gain. That is exactly why the age-only baseline is there.

**Point to:** The two near-identical top bars; then the PHM bars; then the selection card.

**Evidence · denominator · unit:** Mean engine RMSE over 20 validation engines (cycles); mean PHM penalty (unitless).

**Main limitation:** Near tie on RMSE; the age rule's pooled RMSE was worse (41.135 vs 33.073, backup B4), but selection used the frozen criterion only.

**Likely examiner question:** If age alone almost matches, do the sensors add anything?

**Answer:** On mean engine RMSE, barely. The sensors matter through the asymmetric penalty and on the truncated test endpoints, where a post-closure comparison gave the age rule MAE 30.88 versus 18.88 — but that comparison reuses opened outcomes, so I report it as descriptive, not as selection evidence.

## Slide 6 — 3 · Approach · 50 s (from 2:55)

**Say:** For uncertainty the unit is again the engine. Each of the 20 calibration engines contributes one score: its largest absolute error anywhere along its trajectory. [click] I sort those 20 scores. [click] For 90% nominal coverage the finite-sample rule picks the 19th of 20, giving a radius of 107.90 cycles. [click] Take Engine 18's prediction of 64.5. [click] The interval is plus or minus 107.90, and the lower bound clips at zero. Because it protects whole trajectories rather than single rows, it is deliberately conservative. Its validity is marginal and rests on exchangeable engines and a score fixed in advance — which it was.

**Point to:** The formula, the rank strip, the highlighted 19th slot, then the example interval.

**Evidence · denominator · unit:** n = 20 calibration engines; rank 19 of 20; q̂ = 107.90 cycles (107.8965).

**Main limitation:** Twenty engines give a coarse order statistic; q̂ is sensitive to one engine (Table 6.1).

**Likely examiner question:** Why the maximum residual instead of row residuals?

**Answer:** Rows of one engine are not independent; calibrating them as if they were inflates the effective sample size. One maximum per engine targets coverage of the complete trajectory. The cost is width — and slide 8 shows that cost explicitly.

## Slide 7 — 4 · Evaluation and results · 55 s (from 3:45)

**Say:** Now the once-only official test on 100 engine endpoints. [click] Mean absolute error was 18.88 cycles, bootstrap interval 15.56 to 22.48. [click] RMSE was 25.73, interval 21.33 to 30.15 — larger than MAE because a minority of errors are large. [click] The most important number is the bias: plus 10.90 cycles, interval 6.47 to 15.57. [click] Bias is prediction minus actual, so positive means the model usually predicts more life than remains; 69% of endpoints were overestimated. The whole interval sits above zero, so this is systematic, and it is the risky direction: optimism can delay review. The bootstrap reflects resampling these 100 engines, not new fleets.

**Point to:** Each tile's dot and interval bar; end on the coral bias tile.

**Evidence · denominator · unit:** n = 100 official engine endpoints; cycles; 95% bootstrap CIs from 5,000 engine resamples.

**Main limitation:** Single test snapshot per engine; CIs describe sampling over these engines only.

**Likely examiner question:** With a +10.90 bias, why not simply subtract it?

**Answer:** Because estimating the correction on the already-opened test set would leak test information. A bias correction must be prespecified and tested on new engines — that is listed as future work, and it is why the interval and the review guard exist.

## Slide 8 — 4 · Evaluation and results · 35 s (from 4:40)

**Say:** Coverage and width must be read together. The frozen interval covered all 100 endpoints, Wilson interval 96.3 to 100 percent — but its mean width was 182.46 cycles, and 63% of lower bounds hit zero. [click] After closure I tried narrower scores: about 101 to 106 cycles wide, still 96 of 100 endpoints covered, but only 8 of 20 validation trajectories fully covered. [click] These are exploratory comparisons, not replacements, and 100 of 100 is observed coverage, not a guarantee.

**Point to:** Top amber bar and its 20 filled dots; then the two shorter bars with 8 dots.

**Evidence · denominator · unit:** Widths over 100 endpoints (cycles); trajectories = 20 validation engines; post-closure rows labelled.

**Main limitation:** Selecting a narrower score now would use already-opened test knowledge.

**Likely examiner question:** Why not just adopt the narrower row-level interval?

**Answer:** It loses whole-trajectory protection — 8 of 20 engines were not fully covered — and choosing it after seeing these results would import test knowledge. Replacing the score needs fresh engines and a prespecified comparison.

## Slide 9 — 4 · Evaluation and results · 40 s (from 5:15)

**Say:** TreeSHAP reconstructs every endpoint prediction exactly, to below 10 to the minus 12 cycles. For Engine 18, start from the model baseline of 107.84. [click] Age removes 28.1 cycles, Ps30 12.2 and T50 11.4. [click] But the two core-speed channels push it back up, by 5.6 and 4.6. [click] The rest nets about minus 1.8, giving 64.5 — [click] against a true value of 28. So SHAP shows how the fitted model reached an optimistic answer. It does not show what physically happened in the engine.

**Point to:** Baseline bar, the three cyan reductions, the two coral increases, then the dashed true-RUL line.

**Evidence · denominator · unit:** Contributions in cycles from Table 5.9 (rounded); ‘other 13’ is 64.5 minus the listed terms, derived.

**Main limitation:** Correlated channels can exchange credit; SHAP is non-causal.

**Likely examiner question:** Does this show core-speed sensors cause the error — should you drop them?

**Answer:** No causal claim. The post-closure ablation without sensors 9 and 14 lowered validation pooled RMSE from 33.07 to 31.76, about 4%, but on reused validation engines; it is a hypothesis to test on new engines, not a change to the frozen model.

## Slide 10 — 4 · Evaluation and results · 65 s (from 5:55)

**Say:** This is the central trade-off. [click] With point predictions alone, triage was correct for 62 of 100 endpoints and 34 were under-triaged — including 9 of the 25 truly critical engines not labelled critical. [click] After closure I tested an offline guard: review an engine if its point class is critical or high, or if its interval's lower bound is 30 cycles or less. It caught all 39 truly critical-or-high endpoints — but sent 81 of 100 engines to review. [click] Of those 81, 39 were truly high-risk, and 47 entered only through the interval rule. Recall improved; workload became heavy. [click] On validation rows it referred 2,578 of 4,217 and missed 2 of 1,220 high-risk rows — but those are repeated observations of 20 engines, so I never pool them with endpoints. And 39 of 39 is an observed count under simulated labels, not a safety rate.

**Point to:** Coral segment; then the 39/39 and 81/100 tiles side by side; then the workload bar; then the warning box.

**Evidence · denominator · unit:** Endpoints n = 100 (39 truly CRITICAL-or-HIGH, 25 truly CRITICAL); validation rows n = 4,217 (1,220 truly CRITICAL-or-HIGH).

**Main limitation:** Post-closure, offline; thresholds stipulated; review capacity unknown.

**Likely examiner question:** Isn't 81% review just ‘review everything’? What did the guard add?

**Answer:** It is close, and I say so: only 48.1% of reviewed endpoints were truly high-risk. The value is that the cost is now measured instead of hidden. Whether 81% is acceptable depends on real inspection capacity, which needs qualified users and stakeholder thresholds.

## Slide 11 — 4 · Evaluation — separate prototype · 75 s (from 7:00)

**Say:** The workflow is a separate prototype, and the boundary matters. [click ×3] Track A is the evaluated analysis: data, engine-safe split, frozen forest, conformal interval, SHAP and the offline review audit. [click] There is no live connection to Track B. [click ×2] Track B is a 22-node n8n workflow driven by a fixed illustrative payload. It validates provenance and applies a deterministic policy, DEMO_POLICY_V1, which fixes priority and proposed action. Only then does a local Qwen3 1.7B model, at temperature zero, narrate the supplied evidence. [click] A human approves, rejects or modifies. The exported records show two approvals, one rejection and one valid modification; an invalid modification has an editor trace but no exported record of its final state. [click] The model cannot change values, assign priority or decide. The prototype does not call the notebook, a live model or sensors, compute SHAP, or route the offline guard. Authority stays with the policy and the reviewer.

**Point to:** Track A left to right; the coral boundary; Track B; the four route boxes; the model-constraint card.

**Evidence · denominator · unit:** 4 exported audit records (2 APPROVE, 1 REJECT, 1 valid MODIFY); invalid MODIFY = editor trace only.

**Main limitation:** Manually seeded local runs; no user study, security, concurrency or reliability evaluation.

**Likely examiner question:** What does the language model contribute if it can't decide anything?

**Answer:** Readability: it turns supplied numbers and drivers into a short narrative for the reviewer. It is deliberately subordinate — values, priority and action are fixed upstream. I observed it preserving the policy values, though it sometimes exceeded the requested two-sentence format.

## Slide 12 — 5 · Conclusion · 45 s (from 8:15)

**Say:** Three conclusions. [click] Accuracy: Random Forest was chosen by a frozen tie-break after a near tie, with endpoint MAE of 18.88 cycles but an optimistic bias of 10.90. [click] Uncertainty: whole-engine intervals protected complete trajectories but averaged 182 cycles wide. [click] Human review: the offline guard caught all 39 observed high-risk endpoints but sent 81 of 100 to review, and the prototype kept policy deterministic and the human in charge. [click] The limits are clear — simulated FD001, one regime, stipulated thresholds, no technician study, no live connection — so no safety, production or certification claim. The next test is fresh engines with qualified reviewers. Thank you; I'm happy to take questions.

**Point to:** The three cards in turn; then the limits and next-test panels.

**Evidence · denominator · unit:** MAE 18.88 cycles (n = 100 endpoints); width 182.46 cycles; 39/39 and 81/100 endpoints.

**Main limitation:** All conclusions are conditional on simulated FD001 labels and stipulated thresholds.

**Likely examiner question:** What is the single most important finding?

**Answer:** That making uncertainty visible changes the decision problem: interval-aware review caught every observed high-risk endpoint the point estimate missed, but at a measured and heavy workload. Reporting that cost honestly, rather than a headline accuracy, is the contribution.

## Slide 13 — Questions · 0 s (from 9:00)

Stay on this slide during questions. Use the backup index (link on this slide) to open evidence slides; each backup slide links back to the index.

## During questions

Stay on slide 13. Open the backup index (link on slide 13, or press I in the HTML deck). Every backup slide links back to the index; in the HTML deck, B or the Return button walks back to the slide you came from.

## HTML controls

→ / Space / swipe left: next build or slide · ← / swipe right: back · T timer (double-click resets; amber after 9:05, red after 10:00) · P pause motion · S static mode · O overview · N notes · F full screen · I backup index · B return · Home / End.
