// Shared slide model: every element is declared once in inches on a 13.333 x 7.5 canvas
// and rendered to both PowerPoint (pptxgenjs) and the offline HTML deck.
const C = {
  bg: "F7FAFC", text: "102A43", sub: "627D98", cyan: "00A6C8", teal: "0E9F8A",
  amber: "F3A712", coral: "E45756", grid: "D9E2EC", white: "FFFFFF",
  cyanT: "E3F5FA", tealT: "E2F4F1", amberT: "FEF4DE", coralT: "FCE8E8", greyT: "EEF2F6",
  amberD: "9A6700", // amber text on light backgrounds (AA contrast)
};
const F = { head: "Aptos Display", body: "Aptos" };
const CSSF = {
  head: `'Aptos Display','Aptos','Segoe UI','Liberation Sans',Arial,sans-serif`,
  body: `'Aptos','Segoe UI','Liberation Sans',Arial,sans-serif`,
};
const PX = 96; // px per inch in the HTML deck (1280 x 720)

const slides = [];
function slide(o) { const s = { els: [], notes: "", ...o }; slides.push(s); return s; }

// ---- element constructors -------------------------------------------------
const T = (s, x, y, w, h, content, o = {}) => s.els.push({ k: "text", x, y, w, h, content, ...o });
const R = (s, x, y, w, h, o = {}) => s.els.push({ k: "rect", x, y, w, h, ...o });
const E = (s, x, y, w, h, o = {}) => s.els.push({ k: "ell", x, y, w, h, ...o });
const L = (s, x1, y1, x2, y2, o = {}) => s.els.push({ k: "line", x1, y1, x2, y2, ...o });
const I = (s, img, x, y, w, h, o = {}) => s.els.push({ k: "img", img, x, y, w, h, ...o });
const TB = (s, x, y, w, rows, o = {}) => s.els.push({ k: "table", x, y, w, rows, ...o });

// runs: string | [{t, b, i, c, sz, br, link}]
function normRuns(content, o) {
  if (typeof content === "string") content = [{ t: content }];
  return content.map((r) => (typeof r === "string" ? { t: r } : r));
}

// ---- PowerPoint -----------------------------------------------------------
function toPptx(pres, s, idx, total, objCounter) {
  const ps = pres.addSlide({ masterName: "BASE" });
  let n = 0;
  const nm = (el) => `s${el.step || 0}_${el.k}_${++n}`;
  for (const el of s.els) {
    const objectName = nm(el);
    if (el.k === "text") {
      const runs = normRuns(el.content, el);
      const arr = runs.map((r, i) => ({
        text: r.t,
        options: {
          bold: r.b ?? el.b ?? false, italic: r.i ?? el.i ?? false,
          color: r.c || el.c || C.text, fontSize: r.sz || el.sz || 18,
          fontFace: (r.f || el.f) === "head" ? F.head : F.body,
          breakLine: !!r.br && i < runs.length - 1,
          ...(r.link != null ? { hyperlink: { slide: r.link + 1, tooltip: "Go to slide" } } : {}),
        },
      }));
      ps.addText(arr, {
        x: el.x, y: el.y, w: el.w, h: el.h, margin: 0, isTextBox: true, objectName,
        align: el.align || "left", valign: el.valign || "top", fit: "none",
        paraSpaceAfter: el.psa || 0, fontFace: el.f === "head" ? F.head : F.body,
      });
    } else if (el.k === "rect" || el.k === "ell") {
      const type = el.k === "ell" ? pres.ShapeType.ellipse : el.r ? pres.ShapeType.roundRect : pres.ShapeType.rect;
      const opt = {
        x: el.x, y: el.y, w: el.w, h: el.h, objectName,
        fill: el.fill ? { color: el.fill, transparency: el.ft || 0 } : { type: "none" },
        line: el.line ? { color: el.line, width: el.lw || 1, dashType: el.dash ? "dash" : "solid" } : { type: "none" },
      };
      if (el.r && el.k === "rect") opt.rectRadius = el.r;
      ps.addShape(type, opt);
    } else if (el.k === "line") {
      const x = Math.min(el.x1, el.x2), y = Math.min(el.y1, el.y2);
      ps.addShape(pres.ShapeType.line, {
        x, y, w: Math.abs(el.x2 - el.x1) || 0.0001, h: Math.abs(el.y2 - el.y1) || 0.0001, objectName,
        flipH: el.x2 < el.x1, flipV: el.y2 < el.y1,
        line: { color: el.c || C.sub, width: el.w || 1.25, dashType: el.dash ? "dash" : "solid", ...(el.arrow ? { endArrowType: "triangle" } : {}) },
      });
    } else if (el.k === "img") {
      ps.addImage({ path: el.cls === "motif" && IMG.engineSmall ? IMG.engineSmall.path : IMG[el.img].path, x: el.x, y: el.y, w: el.w, h: el.h, transparency: el.tr || 0, objectName, altText: IMG[el.img].alt });
    } else if (el.k === "table") {
      const fs = el.sz || 14;
      const rows = el.rows.map((row, ri) => row.map((cell) => {
        const c = typeof cell === "string" ? { t: cell } : cell;
        const head = ri === 0 && el.header !== false;
        return { text: c.t, options: { bold: head || !!c.b, color: c.c || (head ? C.text : C.text), fill: { color: head ? "E6EEF5" : c.fill || C.white }, fontSize: fs, fontFace: F.body } };
      }));
      ps.addTable(rows, {
        x: el.x, y: el.y, w: el.w, colW: el.colW, margin: [0.05, 0.08, 0.05, 0.08].map((v) => v * 72),
        border: { type: "solid", pt: 0.75, color: C.grid }, valign: "middle", objectName,
      });
    }
  }
  if (s.notes) ps.addNotes(s.notes);
}

// ---- HTML -----------------------------------------------------------------
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const px = (v) => +(v * PX).toFixed(2);
let svgId = 0;
function toHtml(s, idx) {
  let h = "";
  for (const el of s.els) {
    const st = el.step ? ` data-step="${el.step}"` : "";
    const cls = [el.step ? "frag" : "", el.cls || ""].join(" ").trim();
    const ca = cls ? ` class="${cls}"` : "";
    if (el.k === "text") {
      const runs = normRuns(el.content, el);
      const inner = runs.map((r) => {
        const sty = [
          `font-size:${((r.sz || el.sz || 18) * 4) / 3}px`, `color:#${r.c || el.c || C.text}`,
          `font-weight:${(r.b ?? el.b) ? 700 : 400}`, (r.i ?? el.i) ? "font-style:italic" : "",
          (r.f || el.f) === "head" ? `font-family:${CSSF.head}` : "",
        ].filter(Boolean).join(";");
        const span = `<span style="${sty}">${esc(r.t)}</span>`;
        const linked = r.link != null ? `<a href="#" data-goto="${r.link}" class="lnk">${span}</a>` : span;
        return linked + (r.br ? (el.psa ? `<div style="height:${((el.psa * 4) / 3).toFixed(1)}px"></div>` : "<br>") : "");
      }).join("");
      const jc = el.valign === "middle" ? "center" : el.valign === "bottom" ? "flex-end" : "flex-start";
      h += `<div${ca}${st} style="left:${px(el.x)}px;top:${px(el.y)}px;width:${px(el.w)}px;height:${px(el.h)}px;justify-content:${jc};text-align:${el.align || "left"};font-family:${el.f === "head" ? CSSF.head : CSSF.body}" data-k="t"><div class="tx">${inner}</div></div>`;
    } else if (el.k === "rect" || el.k === "ell") {
      const bg = el.fill ? `background:${hexA(el.fill, 1 - (el.ft || 0) / 100)};` : "";
      const bd = el.line ? `border:${((el.lw || 1) * 4) / 3}px ${el.dash ? "dashed" : "solid"} #${el.line};` : "";
      const rad = el.k === "ell" ? "border-radius:50%;" : el.r ? `border-radius:${px(el.r)}px;` : "";
      h += `<div${ca}${st} style="left:${px(el.x)}px;top:${px(el.y)}px;width:${px(el.w)}px;height:${px(el.h)}px;${bg}${bd}${rad}box-sizing:border-box"></div>`;
    } else if (el.k === "line") {
      const id = `m${++svgId}`;
      const col = `#${el.c || C.sub}`, sw = ((el.w || 1.25) * 4) / 3;
      h += `<svg${st} class="ln ${cls}" style="left:0;top:0;width:1280px;height:720px"><defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="${sw > 2 ? 4 : 6}" markerHeight="${sw > 2 ? 4 : 6}" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${col}"/></marker></defs><line x1="${px(el.x1)}" y1="${px(el.y1)}" x2="${px(el.x2)}" y2="${px(el.y2)}" stroke="${col}" stroke-width="${sw}"${el.dash ? ' stroke-dasharray="6 5"' : ""}${el.arrow ? ` marker-end="url(#${id})"` : ""}${el.flow ? ' class="flow"' : ""}/></svg>`;
    } else if (el.k === "img") {
      const op = 1 - (el.tr || 0) / 100;
      const body = el.img.startsWith("engine")
        ? require("./engine.js").engineSVG({ id: `eng${++svgId}`, labels: true, animated: true })
        : `<img src="${IMG[el.img].data}" alt="${esc(IMG[el.img].alt)}" style="width:100%;height:100%;object-fit:contain">`;
      h += `<div${ca}${st} data-k="img" style="left:${px(el.x)}px;top:${px(el.y)}px;width:${px(el.w)}px;height:${px(el.h)}px;opacity:${op}" ${el.img.startsWith("engine") ? 'data-par="1"' : ""}>${body}</div>`;
    } else if (el.k === "table") {
      const fs = ((el.sz || 14) * 4) / 3;
      const cols = el.colW.map((w) => `<col style="width:${px(w)}px">`).join("");
      const rows = el.rows.map((row, ri) => "<tr>" + row.map((cell) => {
        const c = typeof cell === "string" ? { t: cell } : cell;
        const head = ri === 0 && el.header !== false;
        return `<td style="${head ? "background:#E6EEF5;font-weight:700;" : c.fill ? `background:#${c.fill};` : ""}${c.b ? "font-weight:700;" : ""}color:#${c.c || C.text}">${esc(c.t)}</td>`;
      }).join("") + "</tr>").join("");
      h += `<table${ca}${st} style="left:${px(el.x)}px;top:${px(el.y)}px;width:${px(el.w)}px;font-size:${fs}px"><colgroup>${cols}</colgroup>${rows}</table>`;
    }
  }
  return h;
}
function hexA(hex, a) {
  const n = parseInt(hex, 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${+a.toFixed(3)})`;
}

const IMG = {};
module.exports = { C, F, slides, slide, T, R, E, L, I, TB, toPptx, toHtml, IMG, esc };
