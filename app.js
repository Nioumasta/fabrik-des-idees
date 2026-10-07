"use strict";
/* ============================================================
   FABRIQUE DE SÉRIES · app.js
   Text + Video -> Agnes (cloud)
   Images -> copy-paste + manual upload
   Videos -> Agnes v2.5 / WanGP (local) / LTX (cloud)
   Editing -> FFmpeg.wasm
   All Agnes instructions in ENGLISH. French output only for
   end-user content (script, dialogues, titles, summaries).
   ============================================================ */

/* ---------- Agnes API ---------- */
var AGNES_API = "https://apihub.agnes-ai.com/v1";
var AGNES_POLL = "https://apihub.agnes-ai.com/agnesapi";
var AGNES_TEXT_MODEL = "agnes-2.5-flash";
var AGNES_VIDEO_MODEL = "agnes-video-2.5";
var AGNES_VIDEO_MODEL_FALLBACK = "agnes-video-v2.0";
var AGNES_FPS = 24;

/* ---------- Styles catalog ---------- */
var STYLES = [];
var GROUPS = [];
var GMAP = {};
if (typeof STYLES_LIBRARY !== "undefined" && STYLES_LIBRARY) {
  var _catIdx = 0;
  Object.keys(STYLES_LIBRARY).forEach(function (cat) {
    GROUPS.push(cat);
    STYLES_LIBRARY[cat].forEach(function (s) {
      STYLES.push({
        id: s.id, nom: s.nom, emoji: s.emoji, phrase: s.phrase,
        voit: "Style " + s.nom + ".",
        ideal: "up to you.",
        diff: "Medium",
        g: _catIdx
      });
      GMAP[s.id] = _catIdx;
    });
    _catIdx++;
  });
  console.log("styles.js loaded: " + STYLES.length + " styles in " + GROUPS.length + " categories");
} else {
  console.warn("styles.js not loaded.");
}

/* ---------- Skin rendering ---------- */
var SKINS = [
  { id:"K1", nom:"Smooth stylized", d:"Soft animated film skin.", p:"smooth stylized skin with soft subsurface glow, no visible pores" },
  { id:"K2", nom:"Realistic with pores", d:"Pores, fine fuzz.", p:"realistic skin with visible pores, fine natural texture, peach fuzz" },
  { id:"K4", nom:"Glowing", d:"Highlights on cheekbones.", p:"dewy glossy skin with soft specular highlights on cheekbones, healthy glow" },
  { id:"K6", nom:"Plastic doll", d:"Molded glossy skin.", p:"glossy molded plastic doll skin, flawless surface, strong soft highlights" },
  { id:"K10", nom:"Fruit or vegetable", d:"Strawberry seeds, kiwi fuzz, lemon pores.", p:"skin with fruit texture (visible seeds, fuzz or dimples matching the fruit), natural fruit colors" },
  { id:"K17", nom:"Glossy lacquered", d:"Varnish effect.", p:"lacquered high-gloss skin with circular specular highlights, clearcoat finish" },
  { id:"K18", nom:"Latex or rubber", d:"Soft glossy surface.", p:"glossy latex rubber skin, soft squishy surface" },
  { id:"K21", nom:"Plush", d:"Soft fur, stitches.", p:"plush fabric skin, soft faux fur, visible stitching" },
  { id:"K22", nom:"Glazed ceramic", d:"Dishware shine.", p:"glazed ceramic skin, glossy enamel finish" },
  { id:"K23", nom:"Anthropomorphic fruit", d:"Character SHAPED like a fruit, with face, arms and legs.", p:"anthropomorphic fruit or vegetable character in 3D cartoon Pixar style, the entire body IS the fruit (round shape, matching silhouette of the fruit or vegetable), human-like expressive face on the front with big cartoon eyes and animated mouth, thin cartoon arms and legs with small hands and feet, stem and leaf on top of the head, glossy realistic fruit skin texture with natural colors and highlights, seeds or surface details matching the fruit type, no human body parts visible" },
  { id:"K24", nom:"Anthropomorphic animal", d:"Cat, dog, rabbit standing like a human.", p:"anthropomorphic animal character in 3D cartoon Pixar style, standing upright like a human, human-like expressive face with big cartoon eyes on the animal head, thin cartoon arms and legs, wearing simple clothes, soft fur texture with natural animal colors and highlights, no human features on the body" },
  { id:"K25", nom:"Anthropomorphic object", d:"Everyday object brought to life.", p:"anthropomorphic everyday object character in 3D cartoon Pixar style, the entire body IS the object (matching silhouette and shape), human-like expressive face on the front with big cartoon eyes and animated mouth, thin cartoon arms and legs with small hands and feet, glossy realistic surface texture matching the object material, no human body parts visible" },
  { id:"K26", nom:"Anthropomorphic food", d:"Living burger, pizza, donut.", p:"anthropomorphic food character in 3D cartoon Pixar style, the entire body IS the food item (matching silhouette), human-like expressive face on the front with big cartoon eyes and animated mouth, thin cartoon arms and legs, glossy appetizing food texture with natural colors, steam or small details for realism, no human body parts visible" }
];

var TEINTS = [
  { id:"T1", nom:"Very fair", p:"very fair skin with a pink undertone" },
  { id:"T2", nom:"Light beige", p:"light beige skin with a neutral undertone" },
  { id:"T4", nom:"Golden tan", p:"golden tan skin" },
  { id:"T6", nom:"Medium brown", p:"medium brown skin with a warm undertone" },
  { id:"T7", nom:"Deep brown", p:"deep brown skin with a warm undertone" },
  { id:"T8", nom:"Ebony", p:"deep ebony skin with a cool blue undertone" }
];

var YEUX = [
  { id:"Y1", nom:"Big round glossy eyes", p:"big round glossy expressive eyes" },
  { id:"Y2", nom:"Half-lidded, bored", p:"half-lidded bored eyes, unimpressed look" },
  { id:"Y4", nom:"Wide eyes (shock)", p:"cartoonishly wide white oval eyes when shocked" },
  { id:"Y5", nom:"Almond-shaped with makeup", p:"almond-shaped eyes with bold winged eyeliner and long lashes" },
  { id:"Y6", nom:"Sparkling smiling eyes", p:"sparkling crinkled smiling eyes" },
  { id:"Y8", nom:"Very expressive eyebrows", p:"very expressive eyebrows, one eyebrow often raised" }
];

var EFFETS = [
  { id:"E1", g:"Light", nom:"Golden hour", p:"warm golden hour light" },
  { id:"E2", g:"Light", nom:"Soft window", p:"soft natural window light" },
  { id:"E5", g:"Light", nom:"Purple and pink neons", p:"purple and pink neon lighting" },
  { id:"E6", g:"Light", nom:"Magenta and orange", p:"dramatic magenta and orange split lighting" },
  { id:"E8", g:"Light", nom:"Luxury evening", p:"luxury party lighting, chandeliers, golden bokeh" },
  { id:"E11", g:"Image", nom:"Blurred background", p:"shallow depth of field, blurred background" },
  { id:"E12", g:"Image", nom:"Film grain", p:"fine film grain" },
  { id:"E16", g:"Image", nom:"Rain", p:"rain drops and wet reflections" },
  { id:"E17", g:"Image", nom:"VHS effect", p:"retro VHS look, slight scan lines" },
  { id:"E20", g:"Color", nom:"Soft pastel", p:"soft pastel color grade" },
  { id:"E34", g:"Color", nom:"Teal and orange", p:"teal and orange color grade" },
  { id:"E42", g:"Color", nom:"Deep black and white", p:"rich black and white" }
];

var CAMS = [
  { id:"C1", nom:"Static camera", p:"Static locked camera." },
  { id:"C2", nom:"Slow push in", p:"Slow push in toward the subject." },
  { id:"C3", nom:"Handheld", p:"Subtle handheld camera movement." },
  { id:"C6", nom:"Orbit around character", p:"Slow orbit around the character." },
  { id:"C8", nom:"Extreme close-up face", p:"Extreme close-up on the face, eyes and mouth fill the frame." },
  { id:"C11", nom:"Selfie at arm's length", p:"Handheld selfie shot, arm visible, slight shake." },
  { id:"C13", nom:"Pull-out reveal", p:"Slow pull-out revealing the whole scene." },
  { id:"C15", nom:"Crash zoom", p:"Sudden crash zoom on the face." },
  { id:"C16", nom:"Dolly zoom", p:"Dolly zoom, the background stretches while the subject stays the same size." }
];

var SOUS = [
  { id:"U1", g:"Captions", nom:"Word by word, big, white with black outline", p:"dialogue captions word by word, large bold white text with a thick black outline, centered in the lower third" },
  { id:"U2", g:"Captions", nom:"Rounded grey box", p:"dialogue captions as full sentences in a rounded translucent grey box, white text, lower third" },
  { id:"U4", g:"Decoration", nom:"POV sticker on top", p:"sticker style caption at the top of the screen starting with POV, kept for the first seconds" },
  { id:"U5", g:"None", nom:"No captions", p:"no subtitles" }
];

var DUREES_PLAN = [
  { v: 5,  frames: 121, t: "5 s" },
  { v: 6,  frames: 145, t: "6 s" },
  { v: 7,  frames: 169, t: "7 s" },
  { v: 8,  frames: 193, t: "8 s" },
  { v: 10, frames: 241, t: "10 s" }
];

var DUREES_TOTALES = [
  { v: 30,  t: "30 s" },
  { v: 45,  t: "45 s" },
  { v: 60,  t: "60 s" },
  { v: 90,  t: "90 s" },
  { v: 120, t: "2 min" }
];

var NBS = [1, 2, 3, 4, 5, 6, 8, 10];
var MAX_STYLES = 3;

var RECS = [
  { id:"oui", t:"Yes, same characters every episode", d:"Fixed cast series." },
  { id:"univers", t:"Same universe and style, characters change", d:"Different stories in the same place." },
  { id:"non", t:"No, each video is independent", d:"One video, or several with no link." }
];

var SPEECH = [
  { id:"A", t:"A. Voice-over and captions", d:"Easiest, recommended for the first 3 episodes." },
  { id:"B", t:"B. Video generator voice", d:"The generator (Agnes) makes the character speak." },
  { id:"C", t:"C. Separate voice", d:"Silent clips, voice added later during editing." }
];

var AMBS = [
  { id: "drole", nom: "Funny" }, { id: "triste", nom: "Sad" }, { id: "peur", nom: "Scary" },
  { id: "tendre", nom: "Tender" }, { id: "absurde", nom: "Absurd" }, { id: "suspense", nom: "Suspense" },
  { id: "touchant", nom: "Touching" }, { id: "potins", nom: "Gossip and drama" }, { id: "mystere", nom: "Mysterious" }, { id: "romance", nom: "Romantic" }
];

var NONE = ["", "personne", "aucun", "aucune", "-", "nobody", "none", "sans voix", "n/a", "x"];

var STORE = "fabrique-series-v3";
var STORE_BACKUP_PREFIX = "fabrique-backup-";

function fresh() {
  return {
    genre:"", castNote:"", ambs:[], vus:[], cible:"",
    veille:[], tendances:"", concepts:[], lecons:"", exSkip:false,
    titre:"", idee:"",
    style:[],
    speech:"A",
    nb:3,
    rec:"oui",
    duree:60,
    dureePlan:6,
    skin:"", teints:[], yeux:[],
    effets:[], cam:"",
    sous:["U1"], custom:"",
    concept:"", regle:"", ton:"", arc:"",
    persos:[], lieux:[], eps:[],
    videoEngine:"agnes",
    wangpUrl:"http://192.168.1.100:7860",
    ltxApiKey:"",
    uid:1
  };
}
var P = fresh();
var R = { tab:"univers", ep:0, fb:null, busy:null, arm:"", refs:[], chain:null, mont:false, angle:{} };
var memOnly = false;

/* ============================================================
   LOCAL SAVE
   ============================================================ */
function load() {
  try {
    var raw = localStorage.getItem(STORE);
    if (raw) {
      try { localStorage.setItem(STORE_BACKUP_PREFIX + Date.now(), raw); } catch (e) {}
      var d = JSON.parse(raw), f = fresh();
      for (var k in f) P[k] = d[k] !== undefined ? d[k] : f[k];
    }
  } catch (e) { memOnly = true; }
  fixEps();
}
function save() {
  try { localStorage.setItem(STORE, JSON.stringify(P)); }
  catch (e) { memOnly = true; }
}

/* ============================================================
   MIGRATION
   ============================================================ */
function fixEps() {
  if (typeof P.style === "string") P.style = P.style ? [P.style] : [];
  if (!Array.isArray(P.style)) P.style = [];
  if (P.style.length > MAX_STYLES) P.style = P.style.slice(0, MAX_STYLES);

  if (typeof P.duree !== "number") P.duree = 60;
  if (typeof P.dureePlan !== "number") P.dureePlan = 6;
  if (typeof P.videoEngine !== "string") P.videoEngine = "agnes";
  if (typeof P.yeux === "string") P.yeux = P.yeux ? [P.yeux] : [];

  P.eps.forEach(function (e) {
    if (!e.cast) e.cast = [];
    if (!e.stats) e.stats = statsFresh();
    if (e.bilan === undefined) e.bilan = "";
    if (e.finalVideoUrl === undefined) e.finalVideoUrl = null;
    if (e.finalVideoStatus === undefined) e.finalVideoStatus = null;
    if (e.finalVideoError === undefined) e.finalVideoError = "";

    (e.plans || []).forEach(function (p) {
      if (p.photoUri === undefined) p.photoUri = null;
      if (p.videoUrl === undefined) p.videoUrl = null;
      if (p.videoStatus === undefined) p.videoStatus = null;
      if (p.videoError === undefined) p.videoError = "";
      if (p.videoMsg === undefined) p.videoMsg = "";
      if (!p.duree || isNaN(parseFloat(p.duree))) {
        var closest = DUREES_PLAN[1];
        p.duree = closest.v;
        p.frames = closest.frames;
      } else if (!p.frames) {
        var dv = parseFloat(String(p.duree).replace(",", ".")) || 6;
        var best = DUREES_PLAN[0], bestDiff = Math.abs(DUREES_PLAN[0].v - dv);
        DUREES_PLAN.forEach(function (dp) {
          var diff = Math.abs(dp.v - dv);
          if (diff < bestDiff) { bestDiff = diff; best = dp; }
        });
        p.duree = best.v;
        p.frames = best.frames;
      }
    });
  });

  if (!P.veille) P.veille = [];
  if (!P.concepts) P.concepts = [];
  if (!P.effets) P.effets = [];
  if (!P.sous) P.sous = ["U1"];

  P.persos.forEach(function (p) { if (p.refUri === undefined) p.refUri = null; });
  P.lieux.forEach(function (l) { if (l.refUri === undefined) l.refUri = null; });
  P.eps.forEach(function (e) {
    (e.cast || []).forEach(function (c) { if (c.refUri === undefined) c.refUri = null; });
  });
}

/* ============================================================
   BASIC HELPERS
   ============================================================ */
function has(v) { return String(v || "").trim().length > 0; }
function esc(s) { return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function uid() { return P.uid++; }
var tt = 0;
function toast(m) { var t = document.getElementById("toast"); t.textContent = m; t.hidden = false; clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 3000); }
function byId(arr, id) { return arr.filter(function (x) { return x.id === id; })[0]; }
function sentence(t) { t = String(t || "").trim(); return t && !/[.!?]$/.test(t) ? t + "." : t; }
function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function setPath(o, path, v) { var a = path.split("."), i; for (i = 0; i < a.length - 1; i++) o = o[a[i]]; o[a[a.length - 1]] = v; }

/* Clean any string before sending to Agnes: no newlines, no curly quotes */
function cleanForAgnes(s) {
  return String(s || "")
    .replace(/\n/g, " ")
    .replace(/\r/g, "")
    .replace(/[«»„""]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/* ============================================================
   STYLE HELPERS
   ============================================================ */
function styList() {
  var list = Array.isArray(P.style) ? P.style : (P.style ? [P.style] : []);
  return list.map(function (id) { return byId(STYLES, id); }).filter(Boolean);
}
function sty() { return styList()[0]; }
function phrase() {
  var a = [];
  styList().forEach(function (s) { a.push(s.phrase); });
  P.effets.forEach(function (id) { var e = byId(EFFETS, id); if (e) a.push(e.p); });
  if (has(P.custom)) a.push(P.custom.trim());
  var seen = {};
  return a.filter(function (x) {
    var k = String(x).toLowerCase();
    if (seen[k]) return false;
    seen[k] = 1;
    return true;
  }).join(", ");
}
function skinPhrase() {
  var k = byId(SKINS, P.skin), a = [];
  if (k) a.push(k.p);
  P.teints.forEach(function (id) { var x = byId(TEINTS, id); if (x) a.push(x.p); });
  var yeux = Array.isArray(P.yeux) ? P.yeux : (P.yeux ? [P.yeux] : []);
  yeux.forEach(function (id) { var y = byId(YEUX, id); if (y) a.push(y.p); });
  return a.join(", ");
}
function sousList() { var s = P.sous; if (typeof s === "string") s = [s]; return (s || []).filter(function (id) { return byId(SOUS, id); }); }
function sousPhrase() { var a = sousList(); if (!a.length) a = ["U1"]; return a.map(function (id) { return byId(SOUS, id).p; }).join(" + "); }
function camPhrase() { var c = byId(CAMS, P.cam); return c ? c.p : ""; }

function perEp() { return DUREES_TOTALES.filter(function (x) { return x.v === P.duree; })[0] || DUREES_TOTALES[2]; }
function perPlan() { return DUREES_PLAN.filter(function (x) { return x.v === P.dureePlan; })[0] || DUREES_PLAN[1]; }

function unit(n) { return P.nb === 1 ? "the video" : "episode " + n; }
function canScript() { return P.rec === "oui" ? P.persos.length > 0 : (has(P.idee) && P.style.length > 0); }
function epBy(n) { return P.eps.filter(function (e) { return e.n === n; })[0]; }
function statsFresh() { return { vues:"", r3:"", moy:"", part:"", comm:"" }; }
function newEp(n) {
  return { n:n, titre:"", note:"", resume:"", fin:"", script:"", plans:[], montage:"", cast:[],
    stats:statsFresh(), bilan:"", finalVideoUrl:null, finalVideoStatus:null, finalVideoError:"" };
}
function persoBy(n) {
  var k = String(n || "").trim().toLowerCase();
  if (!k) return null;
  var all = P.persos.slice();
  P.eps.forEach(function (e) { all = all.concat(e.cast || []); });
  return all.filter(function (p) { return p.nom && p.nom.trim().toLowerCase() === k; })[0];
}
function findLieu(t) {
  var k = String(t || "").toLowerCase().trim();
  if (!k) return null;
  return P.lieux.filter(function (l) {
    var n = (l.nom || "").toLowerCase().trim();
    return n && (n === k || k.indexOf(n) >= 0 || n.indexOf(k) >= 0);
  })[0];
}

/* ============================================================
   COPY HELPERS
   ============================================================ */
function copyText(text, el, msg) {
  function ok() { toast(msg || "Copied."); }
  function fb() {
    var done = false;
    try {
      if (el && el.select) { el.focus(); el.select(); el.setSelectionRange(0, text.length); }
      else {
        var r = document.createRange(); r.selectNodeContents(el);
        var s = getSelection(); s.removeAllRanges(); s.addRange(r);
      }
      done = document.execCommand("copy");
    } catch (e) {}
    toast(done ? (msg || "Copied.") : "Select the text then Copy.");
  }
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fb);
  else fb();
}
function copyAll(text, msg) {
  var ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly","");
  ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
  document.body.appendChild(ta);
  copyText(text, ta, msg);
  setTimeout(function () { if (ta.parentNode) ta.parentNode.removeChild(ta); }, 2000);
}
/* ============================================================
   AGNES KEY
   ============================================================ */
function getAgnesKey() {
  try { return (localStorage.getItem("agnes_key") || "").trim(); } catch (e) { return ""; }
}
function saveAgnesKey() {
  var inp = document.getElementById("agnes-key-input");
  if (!inp) return;
  var k = inp.value.trim();
  if (!k) {
    try { localStorage.removeItem("agnes_key"); } catch (e) {}
    toast("Agnes key removed.");
    agnesPanelRefresh();
    return;
  }
  try {
    localStorage.setItem("agnes_key", k);
    toast("Agnes key saved.");
    agnesPanelRefresh();
  } catch (e) { toast("Save failed."); }
}
function agnesPanelRefresh() {
  var s = document.getElementById("agnes-status");
  if (!s) return;
  var k = getAgnesKey();
  if (k) { s.textContent = "Key active · " + k.slice(0, 8) + "…" + k.slice(-4); s.className = "badge done"; }
  else { s.textContent = "No key"; s.className = "badge"; }
}
function agnesPanelHtml() {
  var k = getAgnesKey();
  return '<details class="glass acc" data-keep="1"><summary><div><b>Agnes Key</b><br><span>Used to write the script and generate videos</span></div><span class="badge' + (k ? ' done' : '') + '" id="agnes-status">' + (k ? "Key active · " + k.slice(0, 8) + "…" + k.slice(-4) : "No key") + '</span></summary><div class="in">' +
    '<p class="small muted">The Agnes key is used to write the script and generate videos. Without a key, you can still write the text yourself and import images.</p>' +
    '<input type="password" id="agnes-key-input" placeholder="sk-..." autocomplete="off" style="width:100%;padding:12px 14px;border-radius:14px;border:1.5px solid var(--line);background:var(--glass-strong);font-family:ui-monospace,monospace;font-size:14px" value="' + esc(k) + '">' +
    '<button type="button" class="btn big" data-act="agnes-save" style="margin-top:8px">Save key</button>' +
    '<p class="small muted" style="margin-top:8px">Free key at <a href="https://platform.agnes-ai.com" target="_blank" rel="noopener">platform.agnes-ai.com</a>.</p>' +
    '</div></details>';
}

/* ============================================================
   AGNES FETCH WITH RETRY
   ============================================================ */
async function agnesFetch(url, options, label) {
  options = options || {};
  label = label || "Agnes";
  for (var i = 0; i < 6; i++) {
    try {
      var r = await fetch(url, options);
      if (r.status === 429) { await new Promise(function (ok) { setTimeout(ok, Math.min(60000, 10000 * (i + 1))); }); continue; }
      if (r.status === 503) { await new Promise(function (ok) { setTimeout(ok, 5000 * (i + 1)); }); continue; }
      return r;
    } catch (e) {
      await new Promise(function (ok) { setTimeout(ok, 3000 * (i + 1)); });
    }
  }
  return fetch(url, options);
}

/* ============================================================
   AGNES TEXT CALL
   ============================================================ */
async function callAgnesText(system, user) {
  var res = await agnesFetch(AGNES_API + "/chat/completions", {
    method: "POST",
    headers: { "Authorization": "Bearer " + getAgnesKey(), "Content-Type": "application/json" },
    body: JSON.stringify({
      model: AGNES_TEXT_MODEL,
      messages: [
        { role: "system", content: system || "You are a helpful assistant. Always answer with valid JSON only, no commentary." },
        { role: "user", content: user }
      ],
      temperature: 0.85,
      max_tokens: 8000,
      response_format: { type: "json_object" }
    })
  }, "Text");
  if (!res.ok) { var t = await res.text(); throw new Error("Text HTTP " + res.status + " : " + t.slice(0, 200)); }
  var d = await res.json();
  var content = d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content;
  if (!content) throw new Error("No content.");
  return content;
}

/* ============================================================
   AGNES VIDEO CREATION (with v2.5 -> v2.0 fallback)
   ============================================================ */
async function agnesCreateVideoModel(prompt, imageDataUri, numFrames, model) {
  var res = await agnesFetch(AGNES_API + "/videos", {
    method: "POST",
    headers: { "Authorization": "Bearer " + getAgnesKey(), "Content-Type": "application/json" },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      image: imageDataUri,
      num_frames: numFrames,
      frame_rate: AGNES_FPS
    })
  }, "Video");
  return res;
}
async function agnesCreateVideo(prompt, imageDataUri, numFrames) {
  var res = await agnesCreateVideoModel(prompt, imageDataUri, numFrames, AGNES_VIDEO_MODEL);
  if (res.status >= 400 && res.status < 500) {
    console.warn("Agnes " + AGNES_VIDEO_MODEL + " failed (HTTP " + res.status + "), fallback to " + AGNES_VIDEO_MODEL_FALLBACK);
    try {
      res = await agnesCreateVideoModel(prompt, imageDataUri, numFrames, AGNES_VIDEO_MODEL_FALLBACK);
    } catch (e) {}
  }
  if (!res.ok) {
    var t = await res.text();
    console.error("AGNES VIDEO ERROR :", t);
    throw new Error("HTTP " + res.status + " : " + t.slice(0, 200));
  }
  var d = await res.json();
  var id = d.video_id || d.id || d.task_id;
  if (!id) throw new Error("No video_id.");
  return id;
}
async function agnesPollVideo(videoId, onProgress) {
  var wait = 80;
  while (wait > 0) { if (onProgress) onProgress("Preparing (" + wait + " s)…"); await new Promise(function (ok) { setTimeout(ok, 1000); }); wait--; }
  var intervals = [8, 8, 12, 12, 20, 20, 25];
  for (var attempt = 0; attempt < 100; attempt++) {
    if (attempt > 0) {
      var iv = intervals[Math.min(attempt - 1, intervals.length - 1)];
      while (iv > 0) { if (onProgress) onProgress("Image coming to life (" + iv + " s)…"); await new Promise(function (ok) { setTimeout(ok, 1000); }); iv--; }
    }
    var url = AGNES_POLL + "?video_id=" + encodeURIComponent(videoId) + "&model_name=" + encodeURIComponent(AGNES_VIDEO_MODEL);
    var res = await agnesFetch(url, { method: "GET", headers: { "Authorization": "Bearer " + getAgnesKey() } }, "Polling");
    var d = await res.json();
    var st = d.status || "unknown", pr = d.progress || 0;
    if (onProgress) onProgress("Creating " + pr + " %…");
    if (st === "completed" || st === "succeeded" || st === "done") {
      var vurl = (d.metadata && d.metadata.url) || d.url || (d.output && d.output.url);
      if (!vurl) throw new Error("Done without URL.");
      return vurl;
    }
    if (st === "failed" || st === "error" || st === "cancelled") throw new Error("Failed (" + st + ").");
  }
  throw new Error("Timeout.");
}

/* ============================================================
   WANGP VIDEO (local)
   ============================================================ */
async function wangpCreateVideo(prompt, imageDataUri, numFrames) {
  var url = String(P.wangpUrl || "").replace(/\/$/, "");
  if (!url) throw new Error("WanGP URL not configured.");
  var res;
  try {
    res = await fetch(url + "/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt,
        image: imageDataUri,
        num_frames: numFrames,
        frame_rate: AGNES_FPS,
        model: "wan2.2"
      })
    });
  } catch (e) {
    throw new Error("WanGP unreachable. Check that your server is running and the URL is correct.");
  }
  if (!res.ok) throw new Error("WanGP HTTP " + res.status);
  var d = await res.json();
  if (d.video_url) return d.video_url;
  if (d.url) return d.url;
  if (d.id) {
    for (var i = 0; i < 60; i++) {
      await new Promise(function (ok) { setTimeout(ok, 10000); });
      try {
        var r2 = await fetch(url + "/status/" + d.id);
        var s = await r2.json();
        if (s.status === "done" && (s.video_url || s.url)) return s.video_url || s.url;
        if (s.status === "failed") throw new Error("WanGP failed.");
      } catch (e) { /* continue */ }
    }
    throw new Error("WanGP timeout.");
  }
  throw new Error("Unknown WanGP response.");
}

/* ============================================================
   LTX VIDEO (paid, placeholder)
   ============================================================ */
async function ltxCreateVideo(prompt, imageDataUri, numFrames) {
  if (!P.ltxApiKey) throw new Error("LTX API key not configured.");
  throw new Error("LTX integration pending (endpoint not defined). Use Agnes for now.");
}

/* ============================================================
   FFMPEG.WASM
   ============================================================ */
var FF = { instance: null, loaded: false, loading: false };
async function ffmpegLoad() {
  if (FF.loaded) return FF.instance;
  if (FF.loading) { while (FF.loading) await new Promise(function (ok) { setTimeout(ok, 200); }); return FF.instance; }
  FF.loading = true;
  try {
    var FFCls = (typeof FFmpeg !== "undefined" && FFmpeg.FFmpeg) ? FFmpeg.FFmpeg
              : (typeof FFmpegWASM !== "undefined" && FFmpegWASM.FFmpeg) ? FFmpegWASM.FFmpeg
              : null;
    if (!FFCls) throw new Error("FFmpeg not loaded (CDN unreachable?)");
    var ffmpeg = new FFCls();
    var baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpeg.load({
      coreURL: baseURL + "/ffmpeg-core.js",
      wasmURL: baseURL + "/ffmpeg-core.wasm"
    });
    FF.instance = ffmpeg;
    FF.loaded = true;
    console.log("✅ FFmpeg loaded");
    return ffmpeg;
  } finally { FF.loading = false; }
}
async function ffmpegConcatenate(ep, onProgress) {
  var main = ep.plans.filter(function (p) { return !p.reserve && p.videoUrl; });
  if (!main.length) throw new Error("No clip to assemble.");
  if (onProgress) onProgress("Loading FFmpeg (30 MB first time)…");
  var ffmpeg = await ffmpegLoad();
  var names = [];
  for (var i = 0; i < main.length; i++) {
    var p = main[i];
    if (onProgress) onProgress("Downloading clip " + (i + 1) + "/" + main.length + "…");
    var res;
    try { res = await fetch(p.videoUrl, { mode: "cors" }); }
    catch (e) { throw new Error("Clip " + (i + 1) + " unreachable (CORS). Use « Copy clips list »."); }
    if (!res.ok) throw new Error("Clip " + (i + 1) + " : HTTP " + res.status);
    var buf = new Uint8Array(await res.arrayBuffer());
    if (buf.length < 1000) throw new Error("Clip " + (i + 1) + " empty or corrupted.");
    var name = "plan" + String(i).padStart(3, "0") + ".mp4";
    await ffmpeg.writeFile(name, buf);
    names.push(name);
  }
  var listTxt = names.map(function (n) { return "file '" + n + "'"; }).join("\n");
  await ffmpeg.writeFile("list.txt", new TextEncoder().encode(listTxt));
  if (onProgress) onProgress("Final assembly (1-3 min)…");
  try {
    await ffmpeg.exec(["-f", "concat", "-safe", "0", "-i", "list.txt", "-c", "copy", "output.mp4"]);
  } catch (e) {
    if (onProgress) onProgress("Fallback re-encode (longer)…");
    await ffmpeg.exec(["-f", "concat", "-safe", "0", "-i", "list.txt", "-c:v", "libx264", "-c:a", "aac", "output.mp4"]);
  }
  var data = await ffmpeg.readFile("output.mp4");
  if (!data || data.length < 1000) throw new Error("Final file empty.");
  var blob = new Blob([data.buffer], { type: "video/mp4" });
  return URL.createObjectURL(blob);
}

/* ============================================================
   PLAN PHOTO (IndexedDB)
   ============================================================ */
async function planPhotoStore(i, j, dataUri) {
  if (typeof idbKeyval === "undefined") return;
  try { await idbKeyval.set("plan-photo-" + i + "-" + j, dataUri); } catch (e) {}
}
async function planPhotoLoad(i, j) {
  if (typeof idbKeyval === "undefined") return null;
  try { return await idbKeyval.get("plan-photo-" + i + "-" + j); } catch (e) { return null; }
}
async function planPhotoDelete(i, j) {
  if (typeof idbKeyval === "undefined") return;
  try { await idbKeyval.del("plan-photo-" + i + "-" + j); } catch (e) {}
}
async function planPhotosRestore() {
  if (typeof idbKeyval === "undefined") return;
  for (var i = 0; i < P.eps.length; i++) {
    for (var j = 0; j < (P.eps[i].plans || []).length; j++) {
      var uri = await planPhotoLoad(i, j);
      if (uri) P.eps[i].plans[j].photoUri = uri;
    }
  }
  if (R.tab === "eps" && R.ep) render();
}
function planFileToDataUri(file) {
  return new Promise(function (res, rej) {
    var r = new FileReader();
    r.onload = function (e) { res(e.target.result); };
    r.onerror = function () { rej(new Error("Read failed.")); };
    r.readAsDataURL(file);
  });
}
function compressImage(dataUri, maxSize, quality) {
  return new Promise(function (resolve) {
    var img = new Image();
    img.onload = function () {
      var w = img.width, h = img.height;
      var max = Math.max(w, h);
      if (max > maxSize) { var r = maxSize / max; w = Math.round(w * r); h = Math.round(h * r); }
      var canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = function () { resolve(dataUri); };
    img.src = dataUri;
  });
}
async function planUploadPhoto(i, j, file) {
  if (!file || !file.type.startsWith("image/")) { toast("This file is not an image."); return; }
  try {
    var uri = await planFileToDataUri(file);
    /* Aggressive compression: max 768px, quality 0.75 (Agnes refuses big payloads) */
    if (uri.length > 500000) uri = await compressImage(uri, 768, 0.75);
    P.eps[i].plans[j].photoUri = uri;
    P.eps[i].plans[j].videoUrl = null;
    P.eps[i].plans[j].videoStatus = null;
    await planPhotoStore(i, j, uri);
    save(); render(); toast("Photo added.");
  } catch (e) { toast("Could not read this image."); }
}
async function planClearPhoto(i, j) {
  if (!confirm("Remove this photo? The generated video will be lost.")) return;
  P.eps[i].plans[j].photoUri = null;
  P.eps[i].plans[j].videoUrl = null;
  P.eps[i].plans[j].videoStatus = null;
  await planPhotoDelete(i, j);
  save(); render();
}

/* ============================================================
   REFERENCES (IndexedDB)
   ============================================================ */
async function refStore(kind, id, dataUri) {
  if (typeof idbKeyval === "undefined") return;
  try { await idbKeyval.set("ref-" + kind + "-" + id, dataUri); } catch (e) {}
}
async function refLoad(kind, id) {
  if (typeof idbKeyval === "undefined") return null;
  try { return await idbKeyval.get("ref-" + kind + "-" + id); } catch (e) { return null; }
}
async function refDelete(kind, id) {
  if (typeof idbKeyval === "undefined") return;
  try { await idbKeyval.del("ref-" + kind + "-" + id); } catch (e) {}
}
function findRefObj(kind, id) {
  if (kind === "perso") {
    var p = P.persos.filter(function (x) { return x.id === id; })[0];
    if (p) return p;
    for (var i = 0; i < P.eps.length; i++) {
      var c = (P.eps[i].cast || []).filter(function (x) { return x.id === id; })[0];
      if (c) return c;
    }
  } else if (kind === "lieu") {
    return P.lieux.filter(function (x) { return x.id === id; })[0];
  }
  return null;
}
async function refUpload(kind, id, file) {
  if (!file || !file.type.startsWith("image/")) { toast("This file is not an image."); return; }
  try {
    var uri = await planFileToDataUri(file);
    if (uri.length > 500000) uri = await compressImage(uri, 768, 0.75);
    await refStore(kind, id, uri);
    var obj = findRefObj(kind, id);
    if (obj) { obj.refUri = uri; save(); render(); toast("Reference added."); }
  } catch (e) { toast("Could not read this image."); }
}
async function refClear(kind, id) {
  if (!confirm("Remove this reference image?")) return;
  await refDelete(kind, id);
  var obj = findRefObj(kind, id);
  if (obj) { obj.refUri = null; save(); render(); }
}
async function refsRestoreAll() {
  if (typeof idbKeyval === "undefined") return;
  for (var i = 0; i < P.persos.length; i++) {
    var u1 = await refLoad("perso", P.persos[i].id);
    if (u1) P.persos[i].refUri = u1;
  }
  for (var j = 0; j < P.lieux.length; j++) {
    var u2 = await refLoad("lieu", P.lieux[j].id);
    if (u2) P.lieux[j].refUri = u2;
  }
  for (var k = 0; k < P.eps.length; k++) {
    var cast = P.eps[k].cast || [];
    for (var l = 0; l < cast.length; l++) {
      var u3 = await refLoad("perso", cast[l].id);
      if (u3) cast[l].refUri = u3;
    }
  }
  if (R.tab === "refs" || R.tab === "eps") render();
}

/* ============================================================
   PLAN — VIDEO GENERATION (multi-engine)
   ============================================================ */
async function planGenerateVideo(i, j) {
  var ep = P.eps[i], p = ep && ep.plans[j];
  if (!p || !p.photoUri) return;
  if (P.videoEngine === "agnes" && !getAgnesKey()) { toast("Add your Agnes key in the Universe tab."); return; }
  if (P.videoEngine === "wangp" && !has(P.wangpUrl)) { toast("Set your WanGP server URL."); return; }
  if (P.videoEngine === "ltx" && !has(P.ltxApiKey)) { toast("Add your LTX API key."); return; }

  p.videoStatus = "busy"; p.videoMsg = "Creating task…"; p.videoError = "";
  save(); render();

  try {
    var frames = p.frames || perPlan().frames;
    var prompt = videoPrompt(p);
    var url;

    if (P.videoEngine === "wangp") {
      p.videoMsg = "Sending to WanGP…"; save(); render();
      url = await wangpCreateVideo(prompt, p.photoUri, frames);
    } else if (P.videoEngine === "ltx") {
      p.videoMsg = "Sending to LTX…"; save(); render();
      url = await ltxCreateVideo(prompt, p.photoUri, frames);
    } else {
      p.videoMsg = "Sending to Agnes…"; save(); render();
      var id = await agnesCreateVideo(prompt, p.photoUri, frames);
      p.videoMsg = "Preparing…"; save(); render();
      url = await agnesPollVideo(id, function (msg) {
        var el = document.querySelector('#vv-' + i + '-' + j + ' .badge');
        if (el) el.textContent = "⏳ " + msg;
      });
    }
    p.videoUrl = url;
    p.videoStatus = "done";
    p.videoMsg = "";
    save(); render();
    toast("Video of plan " + p.n + " ready.");
  } catch (e) {
    p.videoStatus = "err";
    p.videoError = (e.message || "Error").slice(0, 120);
    p.videoMsg = "";
    save(); render();
    toast("Failed: " + p.videoError);
  }
}
/* ============================================================
   FINAL PROMPTS (for image generation via ChatGPT/Gemini)
   ============================================================ */
function imagePrompt(pl) {
  var parts = [sentence(pl.pi)];
  if (pl.persos) {
    var noms = String(pl.persos).split(/[,;]/).map(function (n) { return n.trim(); }).filter(Boolean);
    var descs = noms.map(function (n) {
      var c = persoBy(n);
      return c && has(c.visuel) ? c.nom + ": " + sentence(c.visuel) : n;
    });
    if (descs.length) parts.push("Characters: " + descs.join(" "));
  }
  if (pl.lieu) {
    var l = findLieu(pl.lieu);
    if (l && has(l.visuel)) parts.push("Place: " + sentence(l.visuel));
  }
  parts.push("No logo, no brand, no text. Hands relaxed with five fingers. Vertical 9:16.");
  var ph = phrase();
  if (ph) parts.push(ph + ".");
  return parts.filter(Boolean).join(" ");
}
function imagePromptWithCoherence(pl) {
  var base = imagePrompt(pl);
  var noms = String(pl.persos || "").split(/[,;]/).map(function (n) { return n.trim(); }).filter(Boolean);
  var note = "\n\n⚠️ MANDATORY COHERENCE: " +
    "The characters must match EXACTLY the reference images provided (same face, same hair, same skin tone, same clothes). " +
    "Do NOT invent new characters. " +
    (noms.length ? "Only these characters may appear: " + noms.join(", ") + ". " : "") +
    "Any character not listed must NOT appear in the image. " +
    "Do not change the identity of any character shown.";
  return base + note;
}

/* ============================================================
   FINAL VIDEO PROMPT (for Agnes / WanGP / LTX)
   All instructions in ENGLISH, no accents, no newlines
   ============================================================ */
function videoPrompt(pl) {
  var who = String(pl.qui || "").trim();
  var spoke = NONE.indexOf(who.toLowerCase()) < 0;
  var rule;

  /* Clean dialogue: keep French words but strip problematic characters */
  var replique = String(pl.replique || "").trim()
    .replace(/"/g, "'")
    .replace(/[«»„""]/g, "'")
    .replace(/\n/g, " ");

  /* Clean every field that goes into the prompt */
  var cleanEmotion = cleanForAgnes(pl.emotion);
  var cleanAction = cleanForAgnes(pl.action);
  var cleanPv = cleanForAgnes(pl.pv);

  /* Identify the speaker visually so Agnes knows exactly who talks */
  var speakerId = "";
  if (spoke) {
    var c = persoBy(who);
    if (c && has(c.visuel)) {
      var words = cleanForAgnes(c.visuel).split(/\s+/).slice(0, 18).join(" ");
      speakerId = " [IMPORTANT: The character who speaks is " + who + ", visually: " + words + ". Only THIS character's lips move. The OTHER character(s) keep their mouth closed, stay still, and do NOT react unless explicitly described.]";
    } else {
      speakerId = " [IMPORTANT: Only " + who + " speaks. The other character(s) keep their mouth closed and stay still.]";
    }
  }

  var emotionLine = has(cleanEmotion) ? " EMOTION: " + who + " feels " + cleanEmotion + ". Show this emotion clearly on the face and body. " : "";
  var actionLine = has(cleanAction) ? " VISIBLE ACTION: " + cleanAction + ". " : "";

  if (!spoke || P.speech === "A") {
    rule = "No dialogue. No one speaks, all mouths stay closed. AUDIO: no voice.";
  } else if (P.speech === "B") {
    rule = "ONLY " + who + " speaks. Only " + who + "'s lips move. AUDIO: " + who + " says in French with the emotion of the scene: '" + replique + "'. No music, no other voice.";
  } else {
    rule = "ONLY " + who + " talks animatedly, mouth opening and closing. Every other character keeps the mouth closed and still. AUDIO: silence.";
  }

  return (cleanPv ? cleanPv + " " : "") +
    (has(pl.duree) ? "Clip length about " + pl.duree + " seconds. " : "") +
    (camPhrase() ? camPhrase() + " " : "") +
    emotionLine +
    actionLine +
    rule +
    speakerId + " " +
    "CRITICAL: Show ONLY the characters visible in the starting image. Do NOT add new people. Do NOT change faces, hair or clothes. Keep every identity exactly as in the input image. " +
    "ANIMATION STYLE: If the character is anthropomorphic (fruit, animal, food, object), use exaggerated cartoon animation with bouncy movements, squash and stretch, big expressive eyes, and lively gestures. " +
    "Stable face, natural motion, no text, vertical 9:16.";
}

/* ============================================================
   PROMPT CONTEXT HELPERS
   ============================================================ */
function bible(ep) {
  var ps = P.persos.concat(ep && ep.cast ? ep.cast : []);
  return "CHARACTERS:\n" + (ps.length ? ps.map(function (p) { return "- " + p.nom + (p.role ? " (" + p.role + ")" : "") + " : " + p.visuel; }).join("\n") : "- none") +
    "\nPLACES:\n" + (P.lieux.length ? P.lieux.map(function (l) { return "- " + l.nom + " : " + l.visuel; }).join("\n") : "- none");
}
function voicesText(ep) {
  var ps = P.persos.concat(ep && ep.cast ? ep.cast : []).filter(function (p) { return has(p.caractere) || has(p.secret) || has(p.voix); });
  return ps.length ? "PERSONALITY AND VOICE:\n" + ps.map(function (p) { return "- " + p.nom + " : " + [p.caractere, p.secret, p.voix].filter(has).join(" ; "); }).join("\n") + "\n" : "";
}
var DIALOGUE_RULES = "DIALOGUE QUALITY: write the way real people talk, in living spoken French (broken sentences, everyday expressions, interruptions). Each line must reveal, provoke, dodge, flip the situation, or make people laugh. Forbidden: formulaic lines, dialogue that explains what the image already shows. ";
function recapFor(n) { var p = epBy(n - 1); return p && has(p.resume) ? p.resume + (has(p.fin) ? " Ending question: " + p.fin : "") : ""; }
function isLast(ep) { return ep.n >= P.nb; }
function arcLine(n) { var l = P.arc.split("\n")[n - 1]; return l ? l.replace(/^\d+[.)]\s*/, "") : ""; }
function briefText() { return (has(P.genre) ? "Genre: " + P.genre + ".\n" : "") + (has(P.cible) ? "Audience: " + P.cible + ".\n" : ""); }
function leconsText() { return has(P.lecons) ? "LESSONS FROM PAST STATS:\n" + P.lecons.trim() + "\n" : ""; }

/* ============================================================
   AGNES CALL WITH JSON EXTRACTION
   ============================================================ */
function ask(label, prompt, apply) {
  var p = new Promise(function (resolve, reject) {
    if (!getAgnesKey()) { toast("Add your Agnes key in the Universe tab."); reject(new Error("no key")); return; }
    R.busy = { label: label, sub: R.chain ? R.chain.sub : "" }; overlay();
    callAgnesText("", prompt).then(function (txt) {
      R.busy = null; overlay();
      try {
        var data = extractJson(txt);
        apply(data); save(); render(); toast(label + " : done.");
        resolve(data);
      } catch (e) { toast("Unreadable response. Try again."); reject(e); }
    }).catch(function (e) {
      R.busy = null; overlay();
      toast("Failed: " + (e.message || "").slice(0, 80));
      reject(e);
    });
  });
  p.catch(function () {});
  return p;
}
function extractJson(t) {
  var s = String(t || "").trim();
  s = s.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  var a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a < 0 || b < a) throw new Error("no json");
  var raw = s.slice(a, b + 1);
  try { return JSON.parse(raw); } catch (e1) {}
  try { return JSON.parse(raw.replace(/(?<!\\)\n/g, "\\n")); } catch (e2) {}
  try {
    var fixed = raw.replace(/:(\s*)"((?:[^"\\]|\\.)*?)"/g, function (m, sp, inner) {
      return ":" + sp + '"' + inner.replace(/\n/g, "\\n").replace(/\r/g, "").replace(/(?<!\\)"/g, '\\"') + '"';
    });
    return JSON.parse(fixed);
  } catch (e3) {}
  try {
    var m = raw.match(/"script"\s*:\s*"([\s\S]*?)"\s*[,}]/);
    if (m) {
      var scriptLines = m[1].split(/\\n|\n/).map(function (l) { return l.replace(/\\"/g, '"').replace(/"/g, '\\"'); });
      var newRaw = raw.replace(m[0], '"script":["' + scriptLines.join('","') + '"]');
      return JSON.parse(newRaw);
    }
  } catch (e4) {}
  throw new Error("invalid json");
}
function overlay() {
  var o = document.getElementById("overlay");
  if (!R.busy) { o.innerHTML = ""; return; }
  o.innerHTML = '<div class="busy"><div class="glass"><div class="spin"></div><b>Agnes is preparing: ' + esc(R.busy.label) + '</b>' + (R.busy.sub ? '<p class="small"><b>' + esc(R.busy.sub) + '</b></p>' : '') + '<p class="small muted">20 to 90 seconds.</p><button type="button" class="btn ghost big" data-act="stop">Stop</button></div></div>';
}
var JSONNOTE = "\n\nAnswer ONLY with a valid JSON object, no text before or after, no code fences.";

/* ============================================================
   CONTENT GENERATORS (all instructions in ENGLISH)
   ============================================================ */

/* ---- GEN SURPRISE (title + story idea) ---- */
function genSurprise() {
  var amb = P.ambs.map(function (id) { var a = byId(AMBS, id); return a ? a.nom : ""; }).filter(has);
  var genres = ["Family drama", "Domestic thriller", "Couple comedy", "Neighborhood mystery", "Forbidden romance", "Betrayed friendship", "Family secret", "Absurd humor"];
  var contexts = [
    "a building where all neighbors know each other",
    "a wedding that goes wrong",
    "an unexpected inheritance",
    "a neighborhood laundromat",
    "a summer campsite",
    "a family reunion after 10 years",
    "a Christmas dinner",
    "a night out with friends that goes wrong",
    "a first day at a new job",
    "a chaotic flat share",
    "a medical exam that reveals everything",
    "a letter that was never opened",
    "a return to the home village",
    "a football match that changes a life"
  ];
  var seed = Math.random().toString(36).slice(2, 8);
  var prompt = "You are a professional screenwriter for short vertical series (TikTok/Shorts/Reels) in French.\n" +
    "Your mission: invent ONE COMPLETE, ORIGINAL and COHERENT story that will hold the viewer from start to finish.\n\n" +
    "CONSTRAINTS:\n" +
    "- Genre: " + randomItem(genres) + "\n" +
    (amb.length ? "- Mood: " + amb.join(", ") + "\n" : "") +
    "- Starting context (inspire yourself, do not copy verbatim): " + randomItem(contexts) + "\n" +
    "- Format: " + (P.nb === 1 ? "one video" : P.nb + " episodes") + " of " + P.duree + " seconds each\n" +
    "- Visual style: " + (sty() ? sty().nom : "not specified") + "\n" +
    "- Uniqueness seed: " + seed + " (use it to make the story different every time)\n\n" +
    "GOLDEN RULES:\n" +
    "1. The title must be SHORT (3 to 6 words), catchy, poetic or intriguing. It must make people click.\n" +
    "2. The story must have: a main character with a clear goal, a concrete obstacle, a secret that changes everything, a twist nobody sees coming.\n" +
    "3. FORBIDDEN: amnesia, hidden twin, 'it was a dream', cliché hidden inheritance, basic revenge, boring love triangle.\n" +
    "4. DRAW INSPIRATION from TikTok codes (3s hook, cliffhanger, A/B choice) but NEVER copy an existing story.\n" +
    "5. The end of the first episode must leave an unanswered question that forces the viewer to watch the next one.\n\n" +
    "Answer in JSON. Fields in French for user-facing content." + JSONNOTE +
    '\nFormat: {"titre":"","idee":"3 to 5 sentences telling the whole story, characters included","ton":"1 word","genre":"1 word","cible":"audience in 5 words"}';
  return ask("a surprise story", prompt, function (r) {
    if (!r || !r.titre) throw new Error("empty");
    P.titre = r.titre;
    P.idee = Array.isArray(r.idee) ? r.idee.join(" ") : String(r.idee || "");
    if (has(r.ton)) P.ton = r.ton;
    if (has(r.genre)) P.genre = r.genre;
    if (has(r.cible)) P.cible = r.cible;
  });
}

/* ---- GEN UNIVERSE (concept + cast + places) ---- */
function genUnivers() {
  var st = sty(), ph = phrase(), sk = skinPhrase();
  var fmt = P.nb === 1 ? "A single video of " + P.duree + " seconds." : P.nb + " videos of " + P.duree + " seconds each.";
  var persoRule = P.rec === "oui" ? "Create the season's cast: 4 to 6 characters maximum. " : "Characters change between videos: characters = empty list. ";
  var prompt = "You are a screenwriter for short vertical animated videos in French (TikTok, YouTube Shorts, Instagram, Facebook).\n" +
    "Starting idea (in French): " + P.idee.trim() + "\n" +
    (has(P.titre) ? "Desired title: " + P.titre.trim() + "\n" : "") +
    "Format: " + fmt + "\n" +
    (has(P.genre) ? "Genre: " + P.genre + ".\n" : "") +
    (has(P.cible) ? "Audience: " + P.cible + ".\n" : "") +
    "Visual style: " + (st ? st.nom + ". Style phrase: " + ph : "not specified") + "\n" +
    (sk ? "Skin/eyes rendering: " + sk + "\n" : "") + "\n" + persoRule +
    "No brand, no logo, no real person. No violence, no suggestive scene. Do not mock any body, religion, or origin. " +
    "Each visual description (visual field) is IN ENGLISH, 40 to 60 words: character type, colors, skin, complexion, face, eyes, hair, clothes without logo, accessory. Do NOT copy the style phrase. " +
    "Places: visual description IN ENGLISH with no character, describe the physical decor only (2 to 4 places). " +
    "Arc: exactly " + P.nb + " line" + (P.nb > 1 ? "s" : "") + " (one per video, in French)." + JSONNOTE +
    '\nFormat: {"titre":"","phrase_concept":"in French","regle_speciale":"in French","ton":"in French","personnages":[{"nom":"in French","role":"in French","caractere":"3 words in French","secret":"in French","voix":"in French","voix_en":"in English","visuel":"in English 40-60 words"}],"lieux":[{"nom":"in French","visuel":"in English"}],"arc":["in French","in French"]}';
  return ask(P.rec === "oui" ? "the cast and universe" : "the concept and universe", prompt, function (d2) {
    if (!d2 || (!d2.phrase_concept && !(d2.personnages && d2.personnages.length))) throw new Error("empty");
    if (has(d2.titre) && !has(P.titre)) P.titre = d2.titre;
    P.concept = d2.phrase_concept || "";
    P.regle = d2.regle_speciale || "";
    P.ton = d2.ton || "";
    P.arc = (d2.arc || []).map(function (l, i) { return /^\d+[.)]/.test(l) ? l : (i + 1) + ". " + l; }).join("\n");
    P.persos = P.rec === "oui" ? (d2.personnages || []).map(function (p) {
      return { id: uid(), nom: p.nom || "", role: p.role || "", caractere: p.caractere || "", secret: p.secret || "", voix: p.voix || "", voix_en: p.voix_en || "", visuel: p.visuel || "", ok: false };
    }) : [];
    P.lieux = (d2.lieux || []).map(function (l) { return { id: uid(), nom: l.nom || "", visuel: l.visuel || "", ok: false }; });
  });
}

/* ---- GEN CAST (standalone, if user already has concept) ---- */
function genCast() {
  var st = sty(), ph = phrase(), sk = skinPhrase();
  var prompt = "You are a screenwriter for short vertical animated videos in French.\nIdea: " + P.idee.trim() + "\n" +
    (has(P.titre) ? "Title: " + P.titre.trim() + "\n" : "") +
    (has(P.concept) ? "Concept: " + P.concept.trim() + "\n" : "") +
    "Existing places: " + (P.lieux.map(function (l) { return l.nom; }).join(", ") || "none") + "\n" +
    (st ? "Visual style: " + st.nom + ". Style phrase: " + ph + "\n" : "") +
    (sk ? "Skin/eyes rendering: " + sk + "\n" : "") +
    "\nCreate the fixed cast: all already-named characters, plus the missing ones, 6 maximum. Each visual field is IN ENGLISH, 40 to 60 words, without the style phrase." + JSONNOTE +
    '\nFormat: {"personnages":[{"nom":"in French","role":"in French","caractere":"3 words in French","secret":"in French","voix":"in French","voix_en":"in English","visuel":"in English 40-60 words"}]}';
  return ask("the cast", prompt, function (d2) {
    if (!d2 || !d2.personnages || !d2.personnages.length) throw new Error("empty");
    P.rec = "oui";
    P.persos = d2.personnages.slice(0, 8).map(function (p) {
      return { id: uid(), nom: p.nom || "", role: p.role || "", caractere: p.caractere || "", secret: p.secret || "", voix: p.voix || "", voix_en: p.voix_en || "", visuel: p.visuel || "", ok: false };
    });
  });
}

/* ============================================================
   SCRIPT — instructions in ENGLISH, output in FRENCH
   ============================================================ */
function scriptBody(ep) {
  var rec = P.rec, last = isLast(ep);
  var structure = "3-second hook, " + (ep.n > 1 && rec === "oui" && P.nb > 1 ? "5-second recap of the previous episode, " : "") + "setup, conflict, twist, " + (last ? "clean ending." : "ending on a question.");
  var rehook = P.duree >= 45 ? "3. MID-VIDEO RE-HOOK: Around the middle of the script (close to " + Math.round(P.duree/2) + "s), place a second strong hook (revelation, twist, shock question) tagged [RE-HOOK].\n" : "";
  var rehookEx = P.duree >= 45 ? "[00:" + String(Math.round(P.duree/2)).padStart(2,"0") + "] [RE-HOOK] CLOSE-UP - Aicha (panicked): Wait... you knew?\n" : "";
  return "Write episode " + unit(ep.n) + " of a short vertical animated production. Dialogue must be in FRENCH, all instructions are ENGLISH.\n" +
    "Title: " + (P.titre || "untitled") + ". Idea (French): " + P.idee.trim() + "\nConcept (French): " + P.concept + "\nRule (French): " + P.regle + "\nTone (French): " + P.ton + "\n" + briefText() +
    (P.nb > 1 ? "Format: " + P.nb + " videos, this is n° " + ep.n + ".\n" : "Format: single video.\n") +
    bible(ep) + "\n" + voicesText(ep) + "\n" + leconsText() +
    (P.nb > 1 ? "\nArc event (French): " + (arcLine(ep.n) || "to imagine") + "\n" : "") +
    (has(ep.note) ? "Starting note (French): " + ep.note.trim() + "\n" : "") +
    (ep.n > 1 && rec === "oui" ? "Previous recap (French): " + (recapFor(ep.n) || "not provided") + "\n" : "") +
    (rec !== "oui" ? "Invent characters (4 max), visual description IN ENGLISH 40-60 words ending with: " + phrase() + "\n" : "") +
    "\nTarget duration: " + P.duree + " s. Structure: " + structure + " Max 2 characters per scene, only one person speaks at a time. " + DIALOGUE_RULES + "\n" +
    "MANDATORY TIKTOK RULES (for maximum virality):\n" +
    "1. 3-SECOND HOOK: The very first line or action must create surprise, tension or an immediate question. Tag this line with [HOOK] at the start.\n" +
    "2. VISUAL CHANGE EVERY 2 TO 3 SECONDS: Each line must have a shot type DIFFERENT from the previous one. Use ENGLISH shot names: CLOSE-UP, MEDIUM SHOT, WIDE SHOT, OVER-THE-SHOULDER, HANDHELD, ORBIT, TIGHT SHOT, HIGH ANGLE, LOW ANGLE, etc.\n" +
    rehook +
    "4. ENDING: " + (last ? "Clean, memorable ending that closes the story." : "End on a cliffhanger or an unanswered question.") + "\n" +
    "5. RHYTHM: " + Math.round(P.duree / 2.5) + " minimum lines total (one every 2 to 3 seconds). SHORT lines: 5 to 10 words maximum.\n" +
    "6. TONE: Each line starts with a tone tag in parentheses, in ENGLISH: (angry), (whispers), (nervous laugh), (cold), (panicked), (sarcastic), etc. Alternate tones to create rhythm.\n" +
    "\nSCRIPT FORMAT (one line per dialogue, follow EXACTLY this format):\n" +
    "[00:00] [HOOK] CLOSE-UP - Mango (sarcastic): C'est ca, ton grand secret ?\n" +
    "[00:03] OVER-THE-SHOULDER - Aicha (cold): Tais-toi. Elle arrive.\n" +
    "[00:06] MEDIUM SHOT - Mango (whispers): On en reparle.\n" +
    "[00:09] WIDE SHOT - (silence) - la porte s'ouvre lentement\n" +
    rehookEx +
    "\nShot types are MANDATORY on EVERY line, in ENGLISH. If a line is the HOOK or RE-HOOK, add [HOOK] or [RE-HOOK] right after the timestamp.\n" +
    JSONNOTE +
    '\nIMPORTANT: the "script" field must be an ARRAY of lines (not a single string). Each line is a separate element, which avoids quote-escaping issues. Dialogue text is in FRENCH.' +
    '\nFormat: {"titre":"in French","resume":"3 sentences in French","question_fin":"in French' + (isLast(ep) ? " (punchline)" : "") + '","script":["[00:00] [HOOK] CLOSE-UP - Mango (sarcastic): C\'est ca, ton grand secret ?","[00:03] OVER-THE-SHOULDER - Aicha (cold): Tais-toi."]' + (P.rec !== "oui" ? ',"personnages":[{"nom":"","role":"","visuel":""}]' : '') + '}';
}

/* ============================================================
   APPLY SCRIPT
   ============================================================ */
function applyScript(ep, r) {
  if (!r || !r.script) throw new Error("empty");
  ep = epBy(ep.n) || ep;
  ep.titre = r.titre || ep.titre;
  ep.resume = Array.isArray(r.resume) ? r.resume.join(" ") : String(r.resume || "");
  ep.fin = Array.isArray(r.question_fin) ? r.question_fin.join(" ") : String(r.question_fin || "");

  if (Array.isArray(r.script)) {
    ep.script = r.script.map(function (line) {
      if (typeof line === "string") return line;
      if (line && typeof line === "object") {
        var t = line.temps || line.time || line.t || "";
        var p = line.personnage || line.qui || line.character || line.perso || "";
        var txt = line.texte || line.replique || line.text || line.dialogue || "";
        var ton = line.ton || line.tone || line.emotion || "";
        var parts = [];
        if (t) parts.push("[" + t + "]");
        if (p) parts.push(p);
        if (ton) parts.push("(" + ton + ")");
        var lineStr = parts.join(" ");
        if (lineStr) lineStr += " : ";
        return lineStr + txt;
      }
      return String(line);
    }).join("\n");
  } else if (r.script && typeof r.script === "object") {
    ep.script = JSON.stringify(r.script, null, 2);
  } else {
    ep.script = String(r.script || "");
  }

  if (P.rec !== "oui") ep.cast = (r.personnages || []).map(function (p) {
    return { id: uid(), nom: p.nom || "", role: p.role || "", visuel: p.visuel || "", ok: false };
  });
}
function genScript(ep) { return ask("the script of " + unit(ep.n), scriptBody(ep), function (r) { applyScript(ep, r); }); }

/* ============================================================
   PLANS — all technical fields in ENGLISH
   ============================================================ */
function plansBody(ep, scriptText) {
  var minPlans = Math.ceil(P.duree / 10);
  var maxPlans = Math.ceil(P.duree / 3);
  var durationsList = DUREES_PLAN.map(function (x) { return x.v + " s (" + x.frames + " frames)"; }).join(", ");
  return "Visual style: " + phrase() + "\n" + bible(ep) + "\n\nScript:\n" + scriptText + "\n\n" +
    "Break this script into shots. The total video must be " + P.duree + " seconds. " +
    "IMPORTANT: YOU decide the duration of EACH shot based on EMOTION and PACE of the scene, NOT on a fixed average.\n" +
    "DURATION RULES BY EMOTION:\n" +
    "- [HOOK] / [RE-HOOK] / shock / twist / punchline -> SHORT shot (5 to 6 s)\n" +
    "- Tense dialogue / argument / confrontation -> 5 to 7 s (fast pace)\n" +
    "- Silence / contemplation / strong emotion / camera stare -> LONG shot (8 to 10 s)\n" +
    "- Physical action / movement -> 6 to 8 s\n" +
    "- Cliffhanger ending -> 6 to 8 s, end on a close-up or a striking wide shot.\n" +
    "Each shot must use ONE of the exact durations required by Agnes: " + durationsList + ". " +
    "You will need between " + minPlans + " and " + maxPlans + " shots + 2 spare shots. " +
    "For each shot: place IN FRENCH, 2 characters max, action IN ENGLISH (short, no accents, e.g. 'fast nervous hand gesture'), shot type IN ENGLISH (wide shot / medium shot / close-up), line IN FRENCH (12 words max), who speaks (name or 'personne'), emotion IN ENGLISH (panicked / cold / angry / scared / happy / surprised), pace IN ENGLISH (calm / fast / tense / shock). " +
    "prompt_image IN ENGLISH describes ONLY the scene (shot type, positions, action, light). Do NOT add appearance or style. prompt_video IN ENGLISH: movement only, IN ENGLISH. " +
    "Sum of durations for shots 1 to N (without spare shots) = " + P.duree + " seconds (tolerance +/-3 s). " + JSONNOTE +
    '\nFormat: {"plans":[{"n":1,"duree_s":6,"lieu":"in French","personnages":["name"],"action":"in English","cadrage":"medium shot","replique":"in French","qui_parle":"name","emotion":"panicked","rythme":"tense","prompt_image":"in English","prompt_video":"in English","reserve":false}]}';
}
function applyPlans(ep, r) {
  if (!r || !r.plans || !r.plans.length) throw new Error("empty");
  ep = epBy(ep.n) || ep;
  ep.plans = r.plans.map(function (x, i) {
    var dv = parseFloat(String(x.duree_s).replace(",", ".")) || P.dureePlan;
    var closest = DUREES_PLAN[0];
    var bestDiff = Math.abs(DUREES_PLAN[0].v - dv);
    DUREES_PLAN.forEach(function (dp) {
      var diff = Math.abs(dp.v - dv);
      if (diff < bestDiff) { bestDiff = diff; closest = dp; }
    });
    return {
      id: uid(), n: x.n || i + 1, duree: closest.v, frames: closest.frames,
      lieu: x.lieu || "", persos: (x.personnages || []).join(", "),
      action: x.action || "", cadrage: x.cadrage || "", replique: x.replique || "", qui: x.qui_parle || "",
      emotion: x.emotion || "", rythme: x.rythme || "", pi: x.prompt_image || "", pv: x.prompt_video || "", reserve: !!x.reserve,
      st: 0, v2: true, photoUri: null, videoUrl: null, videoStatus: null, videoError: "", videoMsg: ""
    };
  });
}
function genPlans(ep) { return ask("the storyboard of " + unit(ep.n), plansBody(ep, ep.script), function (r) { applyPlans(ep, r); }); }

/* ============================================================
   EDITING — instructions in ENGLISH, output in FRENCH
   ============================================================ */
function montBody(ep, list, titre, fin) {
  return "Series: " + (P.titre || "untitled") + ". Episode " + ep.n + " : " + titre + "\nShots:\n" + list + "\nEnding question: " + fin + "\nSpeech method: " + SPEECH.filter(function (s) { return s.id === P.speech; })[0].t + "\n\n" +
    "Write IN FRENCH, with these 4 headings:\n" +
    "1. CAPCUT EDIT PLAN (order, kept durations, precise cuts).\n" +
    "2. SUBTITLES AND ON-SCREEN TEXT (chosen styles: " + sousPhrase() + ").\n" +
    "3. SOUNDS - YOU must yourself pick the music and sound effects, do not let me search. For each sound, give EXACTLY:\n" +
    "   - Precise moment in the video (e.g. 00:00 to 00:03, or shot 4)\n" +
    "   - Type (background music / ambient sound / one-shot effect)\n" +
    "   - Name of the track or sound as it appears in the library\n" +
    "   - Author / channel\n" +
    "   - Free platform where to find it: Pixabay Music, Freesound.org, YouTube Audio Library, Free Music Archive, Mixkit\n" +
    "   - Why this sound fits this scene (1 sentence)\n" +
    "   Use ONLY royalty-free sounds available on these platforms. Pick a background music coherent with the tone (" + P.ton + ") and adjust its volume at key moments (HOOK, RE-HOOK, ending).\n" +
    "4. PUBLISHING (description, hashtags, cover text, first comment).\n" +
    "Final duration: " + (P.duree - 5) + " to " + (P.duree + 5) + " s.";
}
function montList(ep) {
  return ep.plans.filter(function (p) { return !p.reserve; }).map(function (p) {
    return "Shot " + p.n + " (" + p.duree + " s, " + p.lieu + ") : " + p.action + (has(p.replique) ? " | " + p.qui + " says: " + p.replique : "");
  }).join("\n");
}
function genMontage(ep) {
  return new Promise(function (resolve, reject) {
    if (!getAgnesKey()) { toast("Add your Agnes key."); reject(new Error("no key")); return; }
    R.busy = { label: "editing and publishing" }; overlay();
    callAgnesText("You write in French, no JSON, readable text.", montBody(ep, montList(ep), ep.titre, ep.fin)).then(function (txt) {
      R.busy = null; overlay();
      var e2 = epBy(ep.n) || ep;
      e2.montage = txt;
      save(); render(); toast("Editing ready.");
      resolve(txt);
    }).catch(function (e) {
      R.busy = null; overlay();
      toast("Failed: " + (e.message || "").slice(0, 80));
      reject(e);
    });
  });
}

/* ============================================================
   CHAIN / SEASON
   ============================================================ */
function todoEps() {
  var t = [], n, e;
  for (n = 1; n <= P.nb; n++) {
    e = epBy(n);
    if (!e || !has(e.script) || !e.plans.length || !has(e.montage)) t.push(n);
  }
  return t;
}
function setSub(t) { if (R.chain) R.chain.sub = t; }
function stopCheck() { if (R.chain && R.chain.stop) { var e = new Error("stop"); e.code = "cancelled"; throw e; } }
async function chainEpisode(n, label) {
  var ep = epBy(n);
  if (!has(ep.script)) { stopCheck(); setSub(label + " · 1/3 script"); await genScript(ep); }
  ep = epBy(n);
  if (!ep.plans.length) { stopCheck(); setSub(label + " · 2/3 shots"); await genPlans(ep); }
  ep = epBy(n);
  if (!has(ep.montage)) { stopCheck(); setSub(label + " · 3/3 editing"); await genMontage(ep); }
}
async function runChain(job) {
  R.chain = { sub: "", stop: false };
  try { await job(); toast("Done. Everything is ready."); }
  catch (e) { if (e && e.code === "cancelled") toast("Stopped. What is finished is kept."); }
  R.chain = null; R.busy = null; overlay(); render();
}
async function seasonJob() {
  var todo = todoEps(), k, n;
  for (k = 0; k < todo.length; k++) {
    n = todo[k]; stopCheck();
    if (!epBy(n)) { P.eps.push(newEp(n)); save(); }
    await chainEpisode(n, (P.nb === 1 ? "The video" : "Episode " + n + "/" + P.nb) + " (" + (k + 1) + "/" + todo.length + ")");
  }
}
function genSeason() { if (!todoEps().length) { toast("Everything is already prepared."); return; } runChain(seasonJob); }

/* ============================================================
   REVIEW — instructions in ENGLISH, output in FRENCH
   ============================================================ */
function genBilan(ep) {
  var st = ep.stats || statsFresh();
  var prompt = "Series: " + (P.titre || "untitled") + ". " + P.concept + "\nEpisode " + ep.n + " : " + ep.titre + ". Summary: " + ep.resume + "\nScript excerpt:\n" + String(ep.script || "").slice(0, 700) + "\n\n" +
    "Stats: " + st.vues + " views, " + st.r3 + " % still watching at 3 s, " + st.moy + " s average, " + st.part + " shares." + (has(st.comm) ? " Comments: " + st.comm : "") +
    (has(P.lecons) ? "\nLessons already noted:\n" + P.lecons + "\n" : "") +
    "\nDiagnosis in 3 sentences max (in French), 3 short rules (in French), 1 test for the next episode (in French)." + JSONNOTE +
    '\nFormat: {"diagnostic":"in French","regles":["in French","in French","in French"],"test":"in French"}';
  return ask("the review of episode " + ep.n, prompt, function (r) {
    if (!r || !r.diagnostic) throw new Error("empty");
    var e2 = epBy(ep.n) || ep;
    e2.bilan = r.diagnostic + (has(r.test) ? "\nTo test: " + r.test : "");
    var add = "Episode " + ep.n + " : " + (r.regles || []).join(" ; ") + (has(r.test) ? " | Test: " + r.test : "");
    var l = (P.lecons || "").split("\n").filter(function (x) { return has(x) && x.indexOf("Episode " + ep.n + " :") !== 0; });
    l.push(add);
    P.lecons = l.slice(-12).join("\n");
  });
}
