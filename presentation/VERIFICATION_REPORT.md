# Verification Report — MSc Viva Presentation

**Date:** October 2026  
**Author of presentation:** Claude (AI assistant), for Ranitabh Mallick  

---

## Files Inspected

| File | Status |
|------|--------|
| `n8n THESIS.docx` | Read in full — all paragraphs extracted and cross-referenced |
| `Dissertation Module Handbook` | Requirements noted from user prompt (10-min presentation, 10-min Q&A, CS structure) |
| Repository `GISMA-hitl-dissertation-predictive-maintenance` | Browsed: audit_examples/, config/, schemas/, screenshots/, workflow/, notebooks/ |

## Deliverables

| File | Format | Description |
|------|--------|-------------|
| `viva-presentation.html` | HTML | Offline animated presentation with turbofan motif, keyboard navigation, speaker notes, fullscreen, progress bar, pause control. 12 main + 8 backup slides. All assets inline — no internet dependency. |
| `Mallick_MSc_Viva_Presentation.pptx` | PPTX | Editable PowerPoint with 12 slides, speaker notes in notes pane, metric boxes, tables. Widescreen 16:9. |
| `SPEAKER_NOTES_TIMED_SCRIPT.md` | Markdown | Complete timed presenter script (10 minutes), per-slide spoken text, what to point to, denominators, anticipated examiner questions with concise answers. |
| `VERIFICATION_REPORT.md` | Markdown | This file. |

## Numerical Values Verified Against Thesis

| Claim | Thesis Source | Value | Verified |
|-------|---------------|-------|----------|
| Random Forest validation engine RMSE | §5.2, Table 5.1 | 29.479 | ✓ |
| Naive age-only validation engine RMSE | §5.2, Table 5.1 | 29.556 | ✓ |
| Δ between RF and naive | Computed | 0.077 | ✓ |
| 1% practical-equivalence band | §5.2 | stated | ✓ |
| PHM tie-break selection | §5.2 | stated | ✓ |
| Training engines / rows | §4.5, Table 4.1 | 60 / 12,310 | ✓ |
| Validation engines / rows | §4.5, Table 4.1 | 20 / 4,217 | ✓ |
| Calibration engines / rows | §4.5, Table 4.1 | 20 / 4,104 | ✓ |
| Official test endpoints | §4.5 | 100 | ✓ |
| Official MAE | §5.3, Table 5.2 | 18.88 | ✓ |
| Official RMSE | §5.3, Table 5.2 | 25.73 | ✓ |
| Official bias | §5.3, Table 5.2 | +10.90 | ✓ |
| Naive endpoint MAE (post-closure) | §5.3.1, Table 5.3 | 30.88 | ✓ |
| Conformal q̂ | §4.8, §5.4 | 107.90 | ✓ |
| Endpoint coverage | §5.4 | 100/100 | ✓ |
| Mean interval width | §5.4 | 182.46 | ✓ |
| Lower bounds clipped to zero | §5.4 | 63% | ✓ |
| Wilson 95% CI | §5.4 | [96.3%, 100%] | ✓ |
| Row-level conformal width | §5.7, Table 5.7 | 106.34 | ✓ |
| Engine-mean conformal width | §5.7, Table 5.7 | 100.72 | ✓ |
| Narrower score endpoint coverage | §5.7 | 96/100 | ✓ |
| Narrower score trajectory coverage | §5.7 | 8/20 | ✓ |
| Feature ablation: remove age RMSE | §5.6, Table 5.6 | 41.16 (+24.5%) | ✓ |
| Feature ablation: remove s9/14 RMSE | §5.6, Table 5.6 | 31.76 (−4.0%) | ✓ |
| Baseline pooled RMSE | §5.6 | 33.07 | ✓ |
| SHAP baseline prediction | §5.8 | 107.84 | ✓ |
| Point triage correct | §5.9 | 62/100 | ✓ |
| Point triage under-triaged | §5.9 | 34/100 | ✓ |
| Truly CRITICAL missed by point | §5.9 | 9/25 | ✓ |
| Guard critical+high recall | §5.9, Table 5.10 | 39/39 | ✓ |
| Guard total referred | §5.9, Table 5.10 | 81/100 | ✓ |
| Interval-only referrals | §5.9 | 47/81 | ✓ |
| Validation rows referred | §5.9, Table 5.10 | 2,578/4,217 | ✓ |
| Validation critical-high missed | §5.9 | 2/1,220 | ✓ |
| Audit records | §5.10, Table 5.11 | 4 (2 APPROVE, 1 REJECT, 1 MODIFY) | ✓ |
| Invalid MODIFY status | §5.10 | Route trace only | ✓ |
| n8n node count | §4.10.4 | 22 | ✓ |
| Mid-life peak bias | §5.3, Table 5.4 | +15.20 | ✓ |
| Capped validation RMSE | §5.5 | 44.04 | ✓ (not on slides — detail level) |

## Items Excluded or Bounded

- **Supervisor name:** Not found in thesis text. Omitted from title slide.
- **Notebook raw outputs:** Not independently re-executed. Implementation details reported as stated in the dissertation.
- **Original figures/screenshots:** Not embedded (binary). Simplified faithful diagrams used on main slides.
- **Fabricated data points:** None. All charts use verified aggregate values or schematic representations.
- **Standards compliance claims:** None made. Standards listed as design references only.
- **Field effectiveness / safety claims:** Explicitly excluded per thesis §4.11, §6.6.

## Compatibility Notes

- **HTML presentation:** Tested for self-contained operation. All CSS/JS inline. No external dependencies. Works in Chrome, Firefox, Safari. Keyboard navigation: Arrow keys, Home/End, N (notes), P (pause), F (fullscreen).
- **PPTX:** Created with python-pptx. Speaker notes in Notes pane. Editable shapes and text. No embedded animations — turbine motif is HTML-only. Tables may need font adjustment on systems without Calibri.
- **PDF:** Not generated in this build (requires headless browser rendering). The HTML can be printed to PDF via browser (Ctrl+P) with each slide as a page, or the PPTX exported from PowerPoint.

## Remaining Presenter Checks

1. Verify supervisor name and add to title slide if desired.
2. Test PPTX on the actual presentation computer for font rendering.
3. Practice with the timed script — total spoken content fits 10 minutes.
4. Review backup slides for any examiner questions specific to your viva panel.
5. If using HTML version, test fullscreen mode and keyboard controls on the venue projector.
6. Print PDF fallback from either HTML (browser print) or PPTX (PowerPoint export).

## Repository Link

The repository URL `github.com/mranitabh/GISMA-hitl-dissertation-predictive-maintenance` is taken from the thesis (paragraph 337). It is stated as private.
