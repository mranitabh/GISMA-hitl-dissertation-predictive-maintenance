// One geometric turbofan schematic, reused unchanged across every slide and format.
// Side cut-away with a perspective front fan. Illustrative only.
const AX = 250; // engine axis (y)

function stages(x0, x1, n, h0, h1, cls) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = n === 1 ? x0 : x0 + ((x1 - x0) * i) / (n - 1);
    const h = h0 + ((h1 - h0) * i) / Math.max(1, n - 1);
    const w = i % 2 === 0 ? 2.4 : 1.4;
    s += `<line x1="${x}" y1="${AX - h}" x2="${x}" y2="${AX - 17}" class="${cls}" stroke-width="${w}"/>`;
    s += `<line x1="${x}" y1="${AX + 17}" x2="${x}" y2="${AX + h}" class="${cls}" stroke-width="${w}"/>`;
  }
  return s;
}

function blades() {
  let s = "";
  const n = 22;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r0 = 52, r1 = 176;
    const p = (r, da) => [(Math.cos(a + da) * r).toFixed(1), (Math.sin(a + da) * r).toFixed(1)];
    const [x0, y0] = p(r0, 0), [xm, ym] = p(118, 0.16), [x1, y1] = p(r1, 0.30), [x2, y2] = p(r1, 0.40), [xb, yb] = p(118, 0.30), [x3, y3] = p(r0, 0.14);
    s += `<path d="M${x0},${y0} Q${xm},${ym} ${x1},${y1} L${x2},${y2} Q${xb},${yb} ${x3},${y3} Z" class="blade"/>`;
  }
  return s;
}

function engineSVG({ id = "eng", labels = true, animated = false } = {}) {
  const mirror = (d) => d; // paths below are written for both halves explicitly
  const fanRot = animated ? `<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="14s" repeatCount="indefinite"/>` : "";
  const zone = (x, label, lx = x, y = 478) =>
    labels ? `<line x1="${x}" y1="${AX + 120}" x2="${x}" y2="${y - 22}" class="lead"/><text x="${lx}" y="${y}" class="zl" text-anchor="middle">${label}</text>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 500" id="${id}" class="engine-svg" role="img" aria-label="Illustrative turbofan schematic, not a validated engine simulation">
<defs>
  <linearGradient id="${id}-cas" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#E9F4F8"/><stop offset="0.5" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E2ECF2"/>
  </linearGradient>
  <linearGradient id="${id}-edge" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#00A6C8" stop-opacity="0.95"/><stop offset="0.6" stop-color="#00A6C8" stop-opacity="0.35"/><stop offset="1" stop-color="#00A6C8" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="${id}-fan" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#FFFFFF"/><stop offset="0.75" stop-color="#EEF6FA"/><stop offset="1" stop-color="#D3E6EE"/>
  </radialGradient>
  <filter id="${id}-blur" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="${id}-glow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<style>
  #${id} .c{fill:none;stroke:#102A43;stroke-width:2;stroke-linejoin:round}
  #${id} .t{fill:none;stroke:#627D98;stroke-width:1.2}
  #${id} .st{stroke:#486581;fill:none;stroke-linecap:round}
  #${id} .blade{fill:#FFFFFF;stroke:#486581;stroke-width:1.1}
  #${id} .lead{stroke:#9FB3C8;stroke-width:1;stroke-dasharray:3 4}
  #${id} .zl{font:600 17px Aptos,'Segoe UI','Liberation Sans',Arial,sans-serif;fill:#627D98;letter-spacing:1.5px}
  #${id} .cap{font:italic 16px Aptos,'Segoe UI','Liberation Sans',Arial,sans-serif;fill:#627D98}
</style>
<ellipse cx="640" cy="${AX + 196}" rx="470" ry="14" fill="#102A43" opacity="0.10" filter="url(#${id}-blur)"/>
<line x1="70" y1="${AX}" x2="1170" y2="${AX}" class="t" stroke-dasharray="14 6 3 6"/>
<!-- nacelle (outer casing), upper and lower bands -->
<path d="M226,88 Q200,80 206,64 C330,42 640,52 880,98 L985,122 L972,140 L870,124 C640,86 360,78 226,88 Z" fill="url(#${id}-cas)" class="c"/>
<path d="M226,412 Q200,420 206,436 C330,458 640,448 880,402 L985,378 L972,360 L870,376 C640,414 360,422 226,412 Z" fill="url(#${id}-cas)" class="c"/>
<path d="M206,64 C330,42 640,52 880,98 L985,122" fill="none" stroke="url(#${id}-edge)" stroke-width="4" filter="url(#${id}-glow)"/>
<!-- core cowl: filled body, open splitter at the front and open exit at the rear -->
<path d="M300,${AX - 104} C420,${AX - 118} 700,${AX - 110} 860,${AX - 84} L1030,${AX - 52} L1030,${AX + 52} L860,${AX + 84} C700,${AX + 110} 420,${AX + 118} 300,${AX + 104} Z" fill="#FFFFFF" fill-opacity="0.82" stroke="none"/>
<path d="M292,${AX - 100} Q296,${AX - 108} 304,${AX - 105} C420,${AX - 118} 700,${AX - 110} 860,${AX - 84} L1030,${AX - 52}" class="c"/>
<path d="M292,${AX + 100} Q296,${AX + 108} 304,${AX + 105} C420,${AX + 118} 700,${AX + 110} 860,${AX + 84} L1030,${AX + 52}" class="c"/>
<path d="M304,${AX - 105} C420,${AX - 118} 700,${AX - 110} 860,${AX - 84} L1030,${AX - 52}" fill="none" stroke="#00A6C8" stroke-opacity="0.45" stroke-width="2.5"/>
<!-- compressor, combustor and turbine zones -->
${stages(330, 402, 4, 92, 80, "st")}
${stages(432, 566, 7, 72, 50, "st")}
<rect x="588" y="${AX - 66}" width="78" height="34" rx="16" fill="#F2F6F9" stroke="#486581" stroke-width="1.6"/>
<rect x="588" y="${AX + 32}" width="78" height="34" rx="16" fill="#F2F6F9" stroke="#486581" stroke-width="1.6"/>
${stages(690, 726, 2, 54, 58, "st")}
${stages(752, 846, 4, 64, 82, "st")}
<!-- shafts: HP spool and LP shaft -->
<rect x="430" y="${AX - 15}" width="300" height="30" rx="4" fill="#F7FAFC" stroke="#627D98" stroke-width="1.4"/>
<rect x="232" y="${AX - 6}" width="830" height="12" rx="6" fill="#E3EEF4" stroke="#102A43" stroke-width="1.4"/>
<!-- exhaust cone -->
<path d="M860,${AX - 44} C960,${AX - 34} 1060,${AX - 12} 1110,${AX} C1060,${AX + 12} 960,${AX + 34} 860,${AX + 44} Z" fill="#FFFFFF" class="c"/>
<!-- front fan (perspective disc) -->
<ellipse cx="226" cy="${AX}" rx="50" ry="180" fill="url(#${id}-fan)" class="c"/>
<g transform="translate(226 ${AX}) scale(0.27 1)"><g class="fan-rotor">${blades()}<circle r="50" fill="#FFFFFF" stroke="#102A43" stroke-width="3"/>${fanRot}</g></g>
<ellipse cx="226" cy="${AX}" rx="50" ry="180" fill="none" stroke="#00A6C8" stroke-opacity="0.55" stroke-width="2.5"/>
<path d="M150,${AX} C158,${AX - 30} 190,${AX - 48} 226,${AX - 50} L226,${AX + 50} C190,${AX + 48} 158,${AX + 30} 150,${AX} Z" fill="#FFFFFF" class="c"/>
${zone(226, "FAN")}${zone(366, "LPC")}${zone(500, "HPC")}${zone(627, "COMBUSTOR", 604)}${zone(708, "HPT", 724)}${zone(800, "LPT")}${zone(1000, "NOZZLE")}
</svg>`;
}

module.exports = { engineSVG };
