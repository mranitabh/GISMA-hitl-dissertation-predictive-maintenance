// Builds the PowerPoint and the offline HTML deck from one slide specification.
// Usage: NODE_PATH=<dir with pptxgenjs> node src/build.js
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));
const lib = require("./lib.js");
const { C, slides, IMG, toPptx, toHtml, esc } = lib;

const ROOT = path.join(__dirname, "..");
const A = (f) => path.join(ROOT, "assets", f);
const SHOTS = path.join(ROOT, "..", "screenshots");
const b64 = (p) => `data:image/png;base64,${fs.readFileSync(p).toString("base64")}`;

Object.assign(IMG, {
  engine: { path: A("turbofan.png"), alt: "Illustrative turbofan schematic, not a validated engine simulation" },
  engineSmall: { path: A("turbofan_small.png"), alt: "Illustrative turbofan schematic" },
  canvas: { path: path.join(SHOTS, "04_n8n_Workflow_Canvas.png"), alt: "n8n workflow canvas screenshot" },
  approve: { path: path.join(SHOTS, "APPROVE PATH.png"), alt: "APPROVE route trace screenshot" },
  reject: { path: path.join(SHOTS, "reject path.png"), alt: "REJECT route trace screenshot" },
  invalid: { path: path.join(SHOTS, "MODIFY - INVALID DECISION.png"), alt: "Invalid MODIFY route trace screenshot" },
});
for (const k of Object.keys(IMG)) if (!k.startsWith("engine")) IMG[k].data = b64(IMG[k].path);

require("./main_slides.js");
require("./backup_slides.js");

// Slides whose first build should already be visible when the slide opens.
for (const i of [1, 2, 4, 5, 7, 8]) for (const el of slides[i].els) if (el.step) el.step -= 1;

// ---------------------------------------------------------------- PowerPoint
async function buildPptx(out) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Ranitabh Mallick";
  pres.company = "GISMA University of Applied Sciences";
  pres.title = "An Uncertainty-Aware, Explainable and Human-Reviewed Framework for RUL-Based Maintenance Prioritisation";
  pres.subject = "MSc dissertation viva (M598)";
  pres.theme = { headFontFace: "Aptos Display", bodyFontFace: "Aptos" };
  pres.defineSlideMaster({ title: "BASE", background: { path: A("grid.png") } });
  slides.forEach((s, i) => toPptx(pres, s, i, slides.length));
  await pres.writeFile({ fileName: out });
  await addAnimations(out);
}

// Native click-triggered fade builds (shapes named s<step>_...) and a fade transition on every slide.
async function addAnimations(file) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const names = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n));
  for (const n of names) {
    let xml = await zip.file(n).async("string");
    const steps = new Map();
    const re = /<p:cNvPr id="(\d+)" name="s(\d+)_(\w+)_\d+"/g;
    let m;
    while ((m = re.exec(xml))) {
      const st = +m[2];
      if (st > 0) { if (!steps.has(st)) steps.set(st, []); steps.get(st).push({ id: m[1], kind: m[3] }); }
    }
    let timing = "";
    if (steps.size) {
      let id = 3;
      const clicks = [...steps.keys()].sort((a, b) => a - b).map((st) => {
        const effects = steps.get(st).map((sh, j) => {
          const a = id++, b = id++, c = id++;
          return `<p:par><p:cTn id="${a}" presetID="10" presetClass="entr" presetSubtype="0" fill="hold" grpId="0" nodeType="${j === 0 ? "clickEffect" : "withEffect"}"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst><p:set><p:cBhvr><p:cTn id="${b}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn><p:tgtEl><p:spTgt spid="${sh.id}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set><p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="${c}" dur="400"/><p:tgtEl><p:spTgt spid="${sh.id}"/></p:tgtEl></p:cBhvr></p:animEffect></p:childTnLst></p:cTn></p:par>`;
        }).join("");
        const o = id++, inner = id++;
        return `<p:par><p:cTn id="${o}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst><p:par><p:cTn id="${inner}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>${effects}</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>`;
      }).join("");
      const bld = [...steps.values()].flat().filter((sh) => sh.kind !== "img").map((sh) => `<p:bldP spid="${sh.id}" grpId="0" animBg="1"/>`).join("");
      timing = `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst><p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>${clicks}</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst><p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq></p:childTnLst></p:cTn></p:par></p:tnLst>${bld ? `<p:bldLst>${bld}</p:bldLst>` : ""}</p:timing>`;
    }
    const transition = `<p:transition spd="med"><p:fade/></p:transition>`;
    if (!xml.includes("</p:clrMapOvr>")) throw new Error(`no clrMapOvr in ${n}`);
    xml = xml.replace("</p:clrMapOvr>", `</p:clrMapOvr>${transition}${timing}`);
    zip.file(n, xml);
  }
  fs.writeFileSync(file, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

// ---------------------------------------------------------------- HTML
function buildHtml(out) {
  const grid = b64(A("grid.png"));
  const nMain = 13;
  const body = slides.map((s, i) => {
    const steps = Math.max(0, ...s.els.map((e) => e.step || 0));
    return `<section class="slide${s.backup ? " backup" : ""}" data-i="${i}" data-steps="${steps}" data-sec="${esc(s.sec)}" data-time="${s.time || 0}">${toHtml(s, i)}<script type="text/plain" class="notes">${esc(s.notes || "")}</script></section>`;
  }).join("\n");
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Viva — RUL Maintenance Prioritisation (Ranitabh Mallick)</title>
<style>
:root{--bg:#F7FAFC;--text:#102A43;--sub:#627D98;--cyan:#00A6C8;--teal:#0E9F8A;--amber:#F3A712;--coral:#E45756;--grid:#D9E2EC}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:#0B1B2B;overflow:hidden;font-family:'Aptos','Segoe UI','Liberation Sans',Arial,sans-serif;color:var(--text)}
#stage{position:absolute;left:50%;top:50%;width:1280px;height:720px;transform-origin:0 0}
.slide{position:absolute;inset:0;width:1280px;height:720px;background:var(--bg) url(${grid}) center/cover;overflow:hidden;opacity:0;visibility:hidden;transition:opacity .45s ease,visibility .45s}
.slide.on{opacity:1;visibility:visible}
.slide>div,.slide>table,.slide>svg{position:absolute}
.slide>div[data-k="t"]{display:flex;flex-direction:column;line-height:1.2;white-space:normal;overflow-wrap:break-word}
.slide>svg.ln{pointer-events:none;overflow:visible}
.slide table{border-collapse:collapse;table-layout:fixed;line-height:1.2}
.slide td{border:1px solid var(--grid);padding:4.8px 7.7px;vertical-align:middle;background:#fff}
.lnk{color:inherit;text-decoration:none;border-bottom:1px dotted currentColor;cursor:pointer}
.frag{transition:opacity .4s ease,transform .4s ease}
.frag:not(.shown){opacity:0!important;transform:translateY(5px)}
.glow.shown{animation:glow 1.6s ease-out 1}
@keyframes glow{0%{box-shadow:0 0 0 0 rgba(0,166,200,.0)}35%{box-shadow:0 0 0 6px rgba(0,166,200,.22),0 0 26px rgba(0,166,200,.35)}100%{box-shadow:0 0 0 0 rgba(0,166,200,0)}}
line.flow{stroke-dasharray:5 4;animation:flow 1.4s linear infinite}
@keyframes flow{to{stroke-dashoffset:-18}}
.engine-svg{width:100%;height:100%;display:block}
.hero{filter:drop-shadow(0 10px 18px rgba(16,42,67,.10))}
#dust{position:absolute;inset:0;pointer-events:none}
body.paused line.flow,body.static line.flow{animation:none}
body.static .slide,body.static .frag{transition:none}
body.static .glow.shown{animation:none}
/* chrome */
#bar{position:fixed;left:0;right:0;bottom:0;height:4px;background:rgba(255,255,255,.08);z-index:20}
#prog{height:100%;width:0;background:var(--cyan);transition:width .3s}
body.inbackup #prog{background:var(--amber)}
#hud{position:fixed;top:10px;right:12px;display:flex;gap:6px;z-index:30;opacity:.25;transition:opacity .2s}
#hud:hover,body.hudon #hud{opacity:1}
#hud button,#ret{font:600 12px 'Aptos','Segoe UI',Arial,sans-serif;color:#E6EEF5;background:rgba(16,42,67,.85);border:1px solid rgba(255,255,255,.18);border-radius:6px;padding:6px 9px;cursor:pointer}
#hud button.on{background:var(--cyan);color:#06222C}
#timer{font-variant-numeric:tabular-nums;min-width:62px}
#timer.warn{background:#7A5600}#timer.over{background:#8F2423}
#ret{position:fixed;left:50%;transform:translateX(-50%);top:8px;z-index:30;display:none;background:#7A5600}
body.inbackup #ret{display:block}
#count{position:fixed;left:14px;bottom:10px;color:rgba(230,238,245,.6);font:12px 'Aptos',Arial,sans-serif;z-index:20}
#notes{position:fixed;left:0;right:0;bottom:4px;max-height:38vh;overflow:auto;background:rgba(11,27,43,.96);color:#E6EEF5;font:15px/1.5 'Aptos','Segoe UI',Arial,sans-serif;padding:14px 22px;white-space:pre-wrap;display:none;z-index:25;border-top:2px solid var(--cyan)}
body.notes #notes{display:block}
#ov{position:fixed;inset:0;background:rgba(11,27,43,.97);z-index:40;display:none;overflow:auto;padding:22px}
body.overview #ov{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;align-content:start}
.th{position:relative;width:100%;height:0;padding-top:56.25%;overflow:hidden;contain:paint;border:2px solid transparent;border-radius:6px;cursor:pointer;background:var(--bg)}
.th.cur{border-color:var(--cyan)}
.th .inner{position:absolute;left:0;top:0;width:1280px;height:720px;transform-origin:0 0;pointer-events:none}
.th .inner *{pointer-events:none!important}
.th .inner .slide{opacity:1;visibility:visible;transition:none}
.th .inner .frag{opacity:1!important;transform:none}
.th b{position:absolute;left:6px;top:4px;font:700 12px Arial;color:#fff;background:rgba(16,42,67,.8);padding:1px 6px;border-radius:4px;z-index:2}
@media print{
  @page{size:1280px 720px;margin:0}
  html,body{background:#fff;overflow:visible;height:auto}
  #stage{position:static;transform:none!important;width:1280px;height:auto}
  .slide{position:relative;opacity:1!important;visibility:visible!important;break-after:page;page-break-after:always}
  .frag{opacity:1!important;transform:none!important}
  #hud,#ret,#bar,#count,#notes,#ov,#dust{display:none!important}
}
</style></head>
<body>
<div id="stage">${body}</div>
<canvas id="dust" width="1280" height="720"></canvas>
<div id="bar"><div id="prog"></div></div>
<button id="ret" title="Return to where you left the main deck (B)">↩ Return</button>
<div id="hud">
  <button id="timer" title="Start / pause presentation timer (T); double-click to reset">00:00</button>
  <button id="bMotion" title="Pause background motion (P)">Motion</button>
  <button id="bStatic" title="Static mode: all builds shown, no motion (S)">Static</button>
  <button id="bOver" title="Slide overview (O)">Overview</button>
  <button id="bNotes" title="Presenter notes (N)">Notes</button>
  <button id="bFull" title="Fullscreen (F)">Full screen</button>
</div>
<div id="count"></div>
<div id="notes"></div>
<div id="ov"></div>
<script>
(function(){
const N_MAIN=${nMain};
const S=[...document.querySelectorAll('#stage>.slide')];
const stage=document.getElementById('stage');
let cur=0, step=0, back=[], motion=true, stat=false;
const q=(id)=>document.getElementById(id);
function fit(){const k=Math.min(innerWidth/1280,innerHeight/720);stage.style.transform='translate('+(-640*k)+'px,'+(-360*k)+'px) scale('+k+')';}
addEventListener('resize',fit);fit();
function steps(i){return +S[i].dataset.steps||0}
function paint(){
  S.forEach((s,i)=>s.classList.toggle('on',i===cur));
  S[cur].querySelectorAll('.frag').forEach(f=>f.classList.toggle('shown',stat||(+f.dataset.step)<=step));
  const bk=cur>=N_MAIN;document.body.classList.toggle('inbackup',bk);
  q('prog').style.width=(bk?100:((cur+1)/N_MAIN*100))+'%';
  q('count').textContent=(bk?(cur===N_MAIN?'Backup index':S[cur].dataset.sec):('Slide '+(cur+1)+' / '+N_MAIN))+(steps(cur)&&!stat?'  ·  build '+step+'/'+steps(cur):'');
  q('notes').textContent=S[cur].querySelector('.notes').textContent;
  location.hash='#'+(cur+1);
  dustOn=(cur===0||cur===12);
}
function go(i,atEnd){if(i<0||i>=S.length)return;cur=i;step=atEnd?steps(i):0;paint();}
function next(){if(!stat&&step<steps(cur)){step++;paint();}else if(cur<S.length-1)go(cur+1);}
function prev(){if(!stat&&step>0){step--;paint();}else if(cur>0)go(cur-1,true);}
function jump(i){if(i>=N_MAIN)back.push(cur);go(i,true);}
function ret(){go(back.length?back.pop():N_MAIN-1,true);}
document.addEventListener('click',e=>{const a=e.target.closest('[data-goto]');if(a){e.preventDefault();jump(+a.dataset.goto);}});
q('ret').onclick=ret;
// timer
let t0=null,acc=0,tid=null;
function tick(){const ms=acc+(t0?Date.now()-t0:0),s=Math.floor(ms/1000),el=q('timer');el.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');el.classList.toggle('warn',s>=545&&s<600);el.classList.toggle('over',s>=600);}
function startT(){if(!t0){t0=Date.now();tid=setInterval(tick,250);}}
function toggleT(){if(t0){acc+=Date.now()-t0;t0=null;clearInterval(tid);tick();}else startT();}
q('timer').onclick=toggleT;q('timer').ondblclick=()=>{acc=0;t0=null;clearInterval(tid);tick();};
// motion
function setMotion(on){motion=on;document.body.classList.toggle('paused',!on);q('bMotion').classList.toggle('on',!on);q('bMotion').textContent=on?'Motion':'Motion paused';document.querySelectorAll('svg.engine-svg').forEach(s=>{try{on&&!stat?s.unpauseAnimations():s.pauseAnimations()}catch(e){}});}
function setStatic(on){stat=on;document.body.classList.toggle('static',on);q('bStatic').classList.toggle('on',on);if(on){document.querySelectorAll('svg.engine-svg').forEach(s=>{try{s.pauseAnimations();s.setCurrentTime(0)}catch(e){}});}setMotion(on?false:true);paint();}
q('bMotion').onclick=()=>setMotion(!motion);q('bStatic').onclick=()=>setStatic(!stat);
q('bNotes').onclick=()=>document.body.classList.toggle('notes');
q('bFull').onclick=()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{});};
// overview
function overview(){
  const on=!document.body.classList.contains('overview');document.body.classList.toggle('overview',on);
  if(!on)return;const ov=q('ov');ov.innerHTML='';
  S.forEach((s,i)=>{const d=document.createElement('div');d.className='th'+(i===cur?' cur':'');d.innerHTML='<b>'+(i<N_MAIN?i+1:(i===N_MAIN?'Index':'B'+(i-N_MAIN)))+'</b>';const inner=document.createElement('div');inner.className='inner';const c=s.cloneNode(true);c.classList.add('on');c.querySelectorAll('svg animateTransform').forEach(a=>a.remove());inner.appendChild(c);d.appendChild(inner);d.onclick=()=>{document.body.classList.remove('overview');if(i>=N_MAIN&&cur<N_MAIN)back.push(cur);go(i);};ov.appendChild(d);requestAnimationFrame(()=>{inner.style.transform='scale('+(d.clientWidth/1280)+')';});});
}
q('bOver').onclick=overview;
// keys
document.addEventListener('keydown',e=>{
  if(e.altKey||e.ctrlKey||e.metaKey)return;const k=e.key;
  if(document.body.classList.contains('overview')&&k!=='o'&&k!=='O'&&k!=='Escape')return;
  if(k==='ArrowRight'||k===' '||k==='PageDown'||k==='Enter'){e.preventDefault();startT();next();}
  else if(k==='ArrowLeft'||k==='PageUp'||k==='Backspace'){e.preventDefault();prev();}
  else if(k==='Home')go(0);else if(k==='End')go(N_MAIN-1,true);
  else if(k==='b'||k==='B')ret();
  else if(k==='i'||k==='I')jump(N_MAIN);
  else if(k==='f'||k==='F')q('bFull').click();
  else if(k==='n'||k==='N')q('bNotes').click();
  else if(k==='p'||k==='P')setMotion(!motion);
  else if(k==='s'||k==='S')setStatic(!stat);
  else if(k==='t'||k==='T')toggleT();
  else if(k==='o'||k==='O'||k==='Escape'){if(k!=='Escape'||document.body.classList.contains('overview'))overview();}
  else if(k==='h'||k==='H')document.body.classList.toggle('hudon');
});
// touch
let tx=null,ty=null;
addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY;},{passive:true});
addEventListener('touchend',e=>{if(tx==null)return;const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)){dx<0?(startT(),next()):prev();}tx=null;},{passive:true});
// subtle parallax on hero engines
addEventListener('mousemove',e=>{if(!motion||stat)return;const dx=(e.clientX/innerWidth-.5)*8,dy=(e.clientY/innerHeight-.5)*5;S[cur].querySelectorAll('[data-par]').forEach(p=>{if(p.classList.contains('hero')||p.querySelector('.engine-svg'))p.style.transform='translate('+dx+'px,'+dy+'px)';});});
// low-opacity dust on title and closing slides only
const cv=q('dust'),cx=cv.getContext('2d');let dustOn=true;const P=Array.from({length:28},()=>({x:Math.random()*1280,y:Math.random()*720,r:.6+Math.random()*1.4,v:.04+Math.random()*.08}));
function dust(){const k=Math.min(innerWidth/1280,innerHeight/720);cv.style.cssText='position:fixed;left:50%;top:50%;width:'+1280*k+'px;height:'+720*k+'px;transform:translate(-50%,-50%);pointer-events:none;z-index:5';cx.clearRect(0,0,1280,720);if(dustOn&&motion&&!stat){P.forEach(p=>{p.x+=p.v;p.y-=p.v*.35;if(p.x>1290)p.x=-10;if(p.y<-10)p.y=730;cx.fillStyle='rgba(0,166,200,.16)';cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fill();});}requestAnimationFrame(dust);}
dust();
const h=parseInt(location.hash.slice(1));go(h>0&&h<=S.length?h-1:0);
if(matchMedia('(prefers-reduced-motion: reduce)').matches)setMotion(false);
})();
</script>
</body></html>`;
  fs.writeFileSync(out, html);
}

function writeScript(out) {
  const main = slides.slice(0, 13);
  const fmt = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
  let t = 0, words = 0;
  let md = `# Timed presenter script — MSc viva (M598)\n\n**Ranitabh Mallick** · Student ID GH1047661 · Supervisor: Dr Hiba Khalid · GISMA University of Applied Sciences\n\nGenerated from the speaker notes in \`Mallick_MSc_Viva_Presentation.pptx\` (same text), so script and deck cannot drift apart.\n\nPlanned speaking time: **${fmt(main.reduce((a, s) => a + s.time, 0))}** across slides 1–12, leaving about 1:00 of the 10:00 limit for pauses, transitions and interruptions. Slide 13 stays up during questions. \`[click]\` marks a presenter-controlled build.\n\n| Slide | Section | Budget | Starts at | Words | At 150 wpm |\n|---|---|---|---|---|---|\n`;
  const rows = [], bodies = [];
  main.forEach((s, i) => {
    const say = (s.notes.match(/SAY \(≈ timed\):\n([\s\S]*?)\n\n/) || [, ""])[1];
    const w = say.replace(/\[click[^\]]*\]/g, "").split(/\s+/).filter(Boolean).length;
    words += w;
    rows.push(`| ${i + 1} | ${s.sec} | ${s.time} s | ${fmt(t)} | ${w} | ${Math.round((w / 150) * 60)} s |`);
    bodies.push(`## Slide ${i + 1} — ${s.sec} · ${s.time} s (from ${fmt(t)})\n\n${s.notes.replace("SAY (≈ timed):\n", "**Say:** ").replace(/\n\nPOINT TO:/, "\n\n**Point to:**").replace(/\n\nEVIDENCE · DENOMINATOR · UNIT:/, "\n\n**Evidence · denominator · unit:**").replace(/\n\nMAIN LIMITATION:/, "\n\n**Main limitation:**").replace(/\n\nLIKELY EXAMINER QUESTION:/, "\n\n**Likely examiner question:**").replace(/\nANSWER:/, "\n\n**Answer:**")}\n`);
    t += s.time;
  });
  md += rows.join("\n") + `\n| **Total** | | **${fmt(t)}** | | **${words}** | **${fmt(Math.round((words / 150) * 60))}** |\n\n` + bodies.join("\n");
  md += `\n## During questions\n\nStay on slide 13. Open the backup index (link on slide 13, or press I in the HTML deck). Every backup slide links back to the index; in the HTML deck, B or the Return button walks back to the slide you came from.\n\n## HTML controls\n\n→ / Space / swipe left: next build or slide · ← / swipe right: back · T timer (double-click resets; amber after 9:05, red after 10:00) · P pause motion · S static mode · O overview · N notes · F full screen · I backup index · B return · Home / End.\n`;
  fs.writeFileSync(out, md);
}

(async () => {
  const outP = path.join(ROOT, "Mallick_MSc_Viva_Presentation.pptx");
  const outH = path.join(ROOT, "Mallick_MSc_Viva_Presentation.html");
  await buildPptx(outP);
  buildHtml(outH);
  writeScript(path.join(ROOT, "SPEAKER_NOTES_TIMED_SCRIPT.md"));
  // stats for the verification report
  const main = slides.slice(0, 13);
  console.log(JSON.stringify({ slides: slides.length, mainTime: main.reduce((a, s) => a + (s.time || 0), 0), builds: main.map((s) => Math.max(0, ...s.els.map((e) => e.step || 0))) }));
})().catch((e) => { console.error(e); process.exit(1); });
