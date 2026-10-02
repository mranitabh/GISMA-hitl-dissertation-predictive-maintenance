# Verification Report — MSc Viva Presentation (revision 2)

## Files inspected

| Source | Status |
|---|---|
| `n8n THESIS.docx` | All paragraphs **and all 48 tables** extracted and checked |
| Dissertation Module Handbook PDF | **Not attached in this session.** Requirements taken from your prompt: 10-minute talk, 10 minutes of questions, Introduction → Related Work → Approach → Evaluation → Conclusion, backup slides |
| Repository `screenshots/`, `workflow/`, `audit_examples/` | Workflow canvas screenshot used in PPTX backup slide; audit record IDs match Table A.1 |
| Executed notebook | Not re-run. Implementation details are **as reported in the dissertation** |

## Corrections made in this revision

Revision 1 contained values that were not in the thesis. They are now fixed in all formats:

| Item | Revision 1 (wrong) | Now (thesis source) |
|---|---|---|
| Supervisor | "not found" | **Dr Hiba Khalid** (cover table) |
| Ridge / XGBoost validation mean engine RMSE | 30.145 / 29.702 | **31.516 / 31.156** (Table 5.1) |
| PHM column | "higher / lowest" | **RF 83.67, naive 156.44, XGB 101.15, Ridge 157.53** |
| Research questions | 6 RQs | **4 RQs** (Table 1.2) |
| SHAP importance | invented bar lengths, wrong sensors (s15, s7 ranked 3–5) | **Table 5.8 values**: age 24.76, s11 12.87, s4 7.45, s9 6.05, s14 5.30, s12 4.39, s7 3.59 |
| Engine 41 | "actual RUL near zero" | **age 123, true RUL 18, predicted 60.0**; age −29.2, T50 −11.5, phi −7.9, Nc +4.3 (Table 5.9) |
| Triage thresholds | MEDIUM 61–90, LOW >90 | **MEDIUM 60 < ŷ ≤ 130, LOW ŷ > 130**; Rule 2 = lower bound ≤ 30 (Table 4.4, §4.10.2) |
| Conformal rank | ⌈21×0.9⌉, "19/21" | **19th of 20 scores**, q̂ = 107.8965 (§4.8) |
| Lifecycle bias | qualitative | **+8.97 / +3.95 / +15.20 / +0.53** (Table 5.4) |
| Local model | Qwen2.5:7b | **Qwen3** |
| Audit record fields | invented field names | **Table A.2 field groups** |
| Model configs (backup) | generic "tuned" | **Table 4.3 frozen configs** |
| Conformal trade-off | "45% narrower ↔ 40% coverage" | **42–45% narrower; 8/20 trajectories fully covered** |
| PDF | only first slide printed | **20 pages**, one per slide, final-state reveals |

## Key values verified (unchanged)

60/12,310 · 20/4,217 · 20/4,104 training/validation/calibration engines/rows; 100 official endpoints. RF 29.479 vs naive 29.556 (Δ 0.077). Test MAE 18.88 (CI 15.56–22.48), RMSE 25.73, bias +10.90, R² 0.617. Naive endpoint MAE 30.88 (post-closure). q̂ 107.90; 100/100 coverage (Wilson 96.30–100%); width 182.46; 63% clipped. Row/engine-mean scores: widths 106.34/100.72, 96/100 endpoints, 8/20 trajectories. Ablation 33.07 → 41.16 (no age), → 31.76 (no s9/s14). Point triage 62/100 correct, 34/100 under-triaged, 9/25 CRITICAL missed. Guard 39/39 at 81/100; 47 by Rule 2 alone; validation rows 2,578/4,217, 2/1,220 missed. Audit: 2 APPROVE, 1 REJECT, 1 valid MODIFY; invalid MODIFY trace only. 22-node workflow.

## Deliverables

| File | Notes |
|---|---|
| `viva-presentation.html` | Offline (no network needed; system fonts). 12 main + 8 backup slides, rotating turbofan schematic, staged reveals, clickable backup links, pause/static mode, notes, fullscreen, progress bar |
| `Mallick_MSc_Viva_Presentation.pptx` | Editable, themed layouts, native charts (model RMSE/PHM, lifecycle bias, SHAP), speaker notes, 20 slides. **No native PowerPoint animations** — turbine motif is static |
| `Mallick_MSc_Viva_Presentation.pdf` | Rendered from the HTML; all reveals in final state |
| `SPEAKER_NOTES_TIMED_SCRIPT.md` | Timed script, pointing cues, denominators, examiner Q&A |
| Canva design | Regenerated from the corrected outline (link in chat). AI-generated layout — check every number against this report before using it |

## Compatibility and remaining presenter checks

1. **PPTX visual check needed.** LibreOffice fails to open any file in this sandbox, so the PPTX was validated (schema, relationships, charts: all passed) and its text checked, but **not visually rendered**. Open it in PowerPoint and check for text overflow.
2. Handbook not supplied — confirm timing rules and any title-slide requirements yourself.
3. Repository link is from the thesis; the repo is private, so examiners will need access.
4. Rehearse to time; the script sums to ~9 minutes of speech plus transitions.
