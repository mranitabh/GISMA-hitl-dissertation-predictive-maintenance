# Verification report — MSc viva presentation (final)

## 1. Files inspected

| File | Status |
|---|---|
| `n8n THESIS.docx` (uploaded earlier in this session) | Read in full: every paragraph and all 48 tables. **This is the source used.** |
| `n8n THESIS(2).docx` | **Not received in this session.** If it differs from `n8n THESIS.docx`, re-check the values in §2. |
| `Dissertation Module Handbook (2) (1) (2)(1).pdf` | **Not received in this session.** Duration (10 min + 10 min Q&A), the Introduction → Related Work → Approach → Evaluation and Results → Conclusion → Backup structure and the 20% / 10 + 10 mark split were taken from your brief, not from the handbook itself. |
| Repository `screenshots/` | Workflow canvas, APPROVE, REJECT and invalid-MODIFY traces used on backups B16, B17 and B19. |
| Repository `audit_examples/` | Record IDs match Table A.1 (B18). |

## 2. Claims and results checked against the dissertation

Every value below appears in the thesis at the location given. Values marked *derived* are arithmetic on thesis values and are labelled as such on the slides.

| Claim on slides | Thesis location | Status |
|---|---|---|
| Title, subtitle, author, ID GH1047661, programme, M598, supervisor Dr Hiba Khalid, Berlin, September 2026 | Cover and cover table | ✓ |
| 60 / 12,310 · 20 / 4,217 · 20 / 4,104 engines/rows; 100 official endpoints; seed 42 | Table 4.1, §4.5 | ✓ |
| Uncapped primary target; capped-130 sensitivity (44.04 vs 33.07, bias −19.85, PHM 1,440.27) | §4.4, §5.5, Table 5.5 | ✓ |
| RF 29.479 vs naive 29.556 mean engine RMSE; XGBoost 31.156; Ridge 31.516; PHM 83.67 vs 156.44 | Table 5.1 | ✓ (Δ 0.077 and ratio 1.0026 derived) |
| 1% practical-equivalence band; asymmetric PHM tie-break | §5.2, §2.4.2 | ✓ |
| RF / XGBoost frozen configurations | Table 4.3 | ✓ |
| One score per calibration engine; rank 19 of 20; q̂ = 107.8965 ≈ 107.90; clipped at 0 | §4.8 | ✓ (⌈21 × 0.9⌉ = 19 is the standard rule and gives the thesis's rank) |
| MAE 18.88 (15.56–22.48), RMSE 25.73 (21.33–30.15), bias +10.90 (6.47–15.57), R² 0.617, 69% over-estimated, 5,000 engine resamples | Table 5.2, §4.9 | ✓ |
| 100/100 coverage, Wilson 96.30–100%, mean 182.46, median 193.64, 63% clipped | Table 5.2, §5.4 | ✓ |
| Row-level 106.34 / engine-mean 100.72; 96/100 endpoints; 8/20 vs 20/20 trajectories (post-closure) | Table 5.7, §5.7 | ✓ (42–45% narrower derived) |
| Ablation 33.07 → 41.16 (no age), → 31.76 (no s9/s14, ≈ 4.0%) | Table 5.6, §5.6 | ✓ |
| TreeSHAP: 100 × 18, additivity < 10⁻¹² cycles, baseline 107.84, age first (24.76) | §4.10.1, Table 5.8 | ✓ |
| Engine 18: true 28, predicted 64.5; age −28.1, Ps30 −12.2, T50 −11.4, Nc +5.6, NRc +4.6 | Table 5.9 | ✓ (“other 13 ≈ −1.8” derived remainder) |
| Engine 18 class MEDIUM vs CRITICAL; thresholds stipulated | Table 4.4 | ✓ (prediction − actual = +36.5 derived; interval [0, 172.40] derived) |
| Point triage 62/100 correct, 34/100 under-triaged, 9/25 CRITICAL missed | §5.9 | ✓ (“4 other” derived remainder) |
| Guard: 81/100 reviewed, 39/39 caught, 47 via interval rule alone; 48.1% of reviewed truly high-risk | Table 5.10, §5.9 | ✓ (42 = 81 − 39 derived) |
| Validation rows 2,578/4,217 referred; 2/1,220 missed; repeated, not independent | §5.9, Table 5.10 | ✓ |
| 22-node n8n workflow; fixed payload; DEMO_POLICY_V1; Qwen3 1.7B, temperature 0; constraints on the model | §4.10.3–4.10.4 | ✓ |
| 2 APPROVE, 1 REJECT, 1 valid MODIFY records; invalid MODIFY trace only | Table 5.11, Table A.1 | ✓ |
| No notebook / live model / sensor feed / dynamic SHAP; guard not n8n routing | §4.10.4, §5.10 | ✓ |
| Provenance: five legacy Phase 5–6 hashes differ; Phase 8 reproduction matched | §6.6, declaration, §4.12 | ✓ |
| Standards as design references only | Table 2.3 | ✓ |
| Repository URL, private, access must be requested | Appendix A note | ✓ |

**Integrity rules applied:**

- No raw distributions, trajectories or confusion-matrix cells were invented.
- Rank slots on slide 6 show positions only, with no values.
- Engine squares on slide 4 are grouped for display, and the slide says so.
- Every post-closure result is labelled.
- Engines, endpoints and repeated rows are kept separate and never pooled.
- No safety, certification, production or causal claim is made.

## 3. Presentation duration

| Item | Value |
|---|---|
| Planned speaking time, slides 1–12 | **9:00** (your per-slide plan: 15+35+30+45+50+50+55+35+40+65+75+45 s) |
| Buffer to the 10:00 limit | 1:00 |
| Spoken words in notes | 1,111 → about 7:24 at 150 wpm, about 8:33 at 130 wpm |
| Each slide's words ≤ its time budget | Yes, for all 12 (see the table in `SPEAKER_NOTES_TIMED_SCRIPT.md`) |

Your brief mentioned about 9:05. The per-slide timings you specified add up to 9:00, and I kept them unchanged.

## 4. Animation and navigation testing

**PowerPoint (inspected in the file and schema-validated; not played in PowerPoint here):**

- 39 slides, each with speaker notes and a fade transition.
- Native click-triggered fade builds on slides 2–12 (1–8 clicks per slide).
- 70 slide-jump hyperlinks: main slides → backups, backups → index, index → topics.
- Fonts used: Aptos Display and Aptos only.
- `validate.py`: all validations passed.

**HTML (automated browser test with networking disabled): 25 of 25 checks passed.**

- Arrow keys, Space and swipe all work, and builds step forwards and backwards.
- Deep links work, and slide 11 holds for its 8 builds before advancing.
- The timer starts on the first advance. It turns amber after 9:05 and red after 10:00.
- Motion pause, and static mode (all builds shown, engine animation stopped).
- Notes panel, and an overview of 39 thumbnails with click-to-open.
- Progress bar.
- Footer backup links, the index (I), and Return (B, button), which walks back backup → index → the main slide you left.
- Fullscreen request.
- **No network requests and no JavaScript errors.**

**PDF:** 39 pages, generated from the HTML in print mode, so every build is shown in its final state.

**Visual QA:**

- All 39 slides were rendered and inspected.
- An automated text-overflow check reports zero overflowing text boxes.
- Defects found and fixed during QA:
  - tick-label collision (slide 2)
  - "outside band" labels running into the PHM formula (slide 5)
  - dot-count labels overlapping the dots (slide 8)
  - a split "DEMO_POLICY_V1" node label (slide 11)
  - cramped spacing between backup paragraphs
  - the Return button overlapping the footer
  - overlapping overview thumbnails

## 5. Compatibility limitations

1. **The PowerPoint could not be rendered here**, because LibreOffice fails on every file in this environment. The HTML is generated from the same slide specification and coordinates, so it is a close preview, but it uses Liberation Sans in place of Aptos. Aptos is somewhat narrower, so text should fit with a little more room in PowerPoint.
2. **Aptos needs Microsoft 365 or Office 2024.** On older Office, PowerPoint substitutes another font and line breaks may move.
3. **The rotating fan, parallax, dust and data-flow motion exist only in the HTML.** In the PowerPoint the turbofan is a static image, and the animations are fade-in builds plus fade transitions. I didn't use Morph or motion paths, so I'm not claiming them.
4. The PDF is the HTML print output (960 × 540 pt, 16:9), not a PowerPoint export.
5. **Backup structure:** there are 25 backup slides plus an index. Your item 1 is split into B1 (research questions) and B2 (objectives → evidence) for legibility.
6. **There is a 13th main slide**, "Thank you — Questions", with no time budget. It closes the talk with the turbofan visual.
7. **The Canva design made earlier in this session is superseded.** It doesn't contain these slides.

## 6. Final checks for the presenter

1. Open the PPTX in PowerPoint on the viva computer. Check each slide for wrapped or overflowing text, and click through every build in Slide Show.
2. Confirm against the actual handbook that 10 + 10 minutes and the section structure are correct. If `n8n THESIS(2).docx` differs from the version used here, recheck §2.
3. Rehearse with the HTML timer at least twice. Aim to finish slide 12 by about 9:00.
4. Test the HTML on the venue machine in full screen. Press S if anything moves too much on the projector.
5. Keep the PDF as a fallback that needs no software features.
6. Make sure examiners have repository access if you plan to show it.
