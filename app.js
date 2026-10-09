"use strict";
/* ============================================================
   FABRIQUE DE SÉRIES · app.js v2
   Architecture : Brief → Studio → Production
   ============================================================ */

/* ═══════════════════════════════════════════════════════════
   CONFIGURATION API
   ═══════════════════════════════════════════════════════════ */
var AGNES_API = "https://apihub.agnes-ai.com/v1";
var AGNES_POLL = "https://apihub.agnes-ai.com/agnesapi";
var AGNES_TEXT_MODEL = "agnes-2.5-flash";
var AGNES_IMAGE_MODEL = "agnes-image-2.1-flash";
var AGNES_VIDEO_MODEL = "agnes-video-v2.0";
var AGNES_FPS = 24;
var AGNES_B429 = [10000, 20000, 35000, 50000, 75000, 100000, 150000];
var AGNES_B503 = [5000, 10000, 15000, 20000, 30000, 45000];

/* ═══════════════════════════════════════════════════════════
   STYLES (chargés depuis styles.js)
   ═══════════════════════════════════════════════════════════ */
var STYLES = [];
var GROUPS = [];
if (typeof STYLES_LIBRARY !== "undefined" && STYLES_LIBRARY) {
  Object.keys(STYLES_LIBRARY).forEach(function (cat) {
    GROUPS.push(cat);
    STYLES_LIBRARY[cat].forEach(function (s) {
      STYLES.push({ id: s.id, nom: s.nom, emoji: s.emoji, phrase: s.phrase });
    });
  });
  console.log("styles.js chargé : " + STYLES.length + " styles dans " + GROUPS.length + " catégories");
} else {
  console.warn("styles.js non chargé.");
}

/* ═══════════════════════════════════════════════════════════
   CONSTANTES
   ═══════════════════════════════════════════════════════════ */
var TEINTS = [
  { id:"T1", nom:"Très clair", p:"very fair skin with a pink undertone" },
  { id:"T2", nom:"Clair beige", p:"light beige skin with a neutral undertone" },
  { id:"T4", nom:"Hâlé doré", p:"golden tan skin" },
  { id:"T6", nom:"Brun moyen", p:"medium brown skin with a warm undertone" },
  { id:"T7", nom:"Brun profond", p:"deep brown skin with a warm undertone" },
  { id:"T8", nom:"Ébène", p:"deep ebony skin with a cool blue undertone" }
];

var YEUX = [
  { id:"Y1", nom:"Grands yeux ronds", p:"big round glossy expressive eyes" },
  { id:"Y2", nom:"Mi-clos blasé", p:"half-lidded bored eyes, unimpressed look" },
  { id:"Y4", nom:"Écarquillés (choc)", p:"cartoonishly wide white oval eyes when shocked" },
  { id:"Y5", nom:"Amande maquillés", p:"almond-shaped eyes with bold winged eyeliner" },
  { id:"Y6", nom:"Pétillants rieurs", p:"sparkling crinkled smiling eyes" },
  { id:"Y8", nom:"Sourcils expressifs", p:"very expressive eyebrows, one eyebrow often raised" }
];

var EFFETS = [
  { id:"E1", g:"Lumière", nom:"Heure dorée", p:"warm golden hour light" },
  { id:"E2", g:"Lumière", nom:"Fenêtre douce", p:"soft natural window light" },
  { id:"E5", g:"Lumière", nom:"Néons violet et rose", p:"purple and pink neon lighting" },
  { id:"E6", g:"Lumière", nom:"Magenta et orange", p:"dramatic magenta and orange split lighting" },
  { id:"E8", g:"Lumière", nom:"Soirée luxe", p:"luxury party lighting, chandeliers, golden bokeh" },
  { id:"E11", g:"Image", nom:"Arrière-plan flou", p:"shallow depth of field, blurred background" },
  { id:"E12", g:"Image", nom:"Grain de pellicule", p:"fine film grain" },
  { id:"E16", g:"Image", nom:"Pluie", p:"rain drops and wet reflections" },
  { id:"E20", g:"Couleur", nom:"Pastel doux", p:"soft pastel color grade" },
  { id:"E34", g:"Couleur", nom:"Orange et bleu canard", p:"teal and orange color grade" },
  { id:"E42", g:"Couleur", nom:"Noir et blanc profond", p:"rich black and white" }
];

var CAMS = [
  { id:"C1", nom:"Caméra fixe", p:"Static locked camera." },
  { id:"C2", nom:"Travelling avant", p:"Slow push in toward the subject." },
  { id:"C3", nom:"Caméra à l'épaule", p:"Subtle handheld camera movement." },
  { id:"C6", nom:"Orbite", p:"Slow orbit around the character." },
  { id:"C8", nom:"Très gros plan", p:"Extreme close-up on the face, eyes and mouth fill the frame." },
  { id:"C11", nom:"Selfie à bout de bras", p:"Handheld selfie shot, arm visible, slight shake." },
  { id:"C13", nom:"Recul qui révèle", p:"Slow pull-out revealing the whole scene." },
  { id:"C15", nom:"Zoom coup de poing", p:"Sudden crash zoom on the face." },
  { id:"C16", nom:"Effet vertige", p:"Dolly zoom, the background stretches while the subject stays the same size." }
];

var SOUS = [
  { id:"U1", nom:"Mot par mot, blanc avec contour", p:"dialogue captions word by word, large bold white text with a thick black outline, centered in the lower third" },
  { id:"U2", nom:"Boîte grise arrondie", p:"dialogue captions as full sentences in a rounded translucent grey box, white text, lower third" },
  { id:"U4", nom:"Sticker POV en haut", p:"sticker style caption at the top of the screen starting with POV, kept for the first seconds" },
  { id:"U5", nom:"Sans sous-titres", p:"no subtitles" }
];

var DUREES_PLAN = [
  { v: 5,  frames: 121 },
  { v: 6,  frames: 145 },
  { v: 7,  frames: 169 },
  { v: 8,  frames: 193 },
  { v: 10, frames: 241 }
];

var DUREES_TOTALES = [
  { v: 30,  t: "30 s" },
  { v: 45,  t: "45 s" },
  { v: 60,  t: "60 s" },
  { v: 90,  t: "90 s" },
  { v: 120, t: "2 min" }
];

var AMBS = [
  { id:"drole", nom:"Drôle" },
  { id:"triste", nom:"Triste" },
  { id:"potins", nom:"Trash et potins" },
  { id:"suspense", nom:"Suspense" },
  { id:"romance", nom:"Romantique" },
  { id:"mystere", nom:"Mystérieux" }
];

var RECS = [
  { id:"oui", t:"Casting fixe", d:"Les mêmes personnages à chaque épisode." },
  { id:"univers", t:"Même univers", d:"Style identique, personnages qui changent." },
  { id:"non", t:"Vidéos indépendantes", d:"Chaque vidéo est autonome." }
];

var SPEECH = [
  { id:"A", t:"A. Voix off + sous-titres", d:"Le plus simple." },
  { id:"B", t:"B. Voix du générateur", d:"Le personnage parle." },
  { id:"C", t:"C. Voix séparée", d:"Ajoutée en montage." }
];

var NBS = [1, 2, 3, 5, 10];
var MAX_STYLES = 2;

var NONE = ["", "personne", "aucun", "aucune", "-", "nobody", "none", "sans voix", "n/a", "x"];

/* ═══════════════════════════════════════════════════════════
   STOCKAGE
   ═══════════════════════════════════════════════════════════ */
var STORE = "fabrique-series-v4";
var STORE_BACKUP_PREFIX = "fabrique-backup-";

function fresh() {
  return {
    /* Brief */
    idee:"", titre:"", ambs:[], cible:"", duree:60, nb:3, rec:"oui",
    /* Style */
    style:[], teints:[], yeux:[], effets:[], cam:"", sous:["U1"], custom:"", skin:"",
    /* Univers généré */
    concept:"", regle:"", ton:"", arc:"", persos:[], lieux:[],
    /* Épisodes */
    eps:[],
    /* Concepts générés */
    concepts:[],
    /* Réglages */
    speech:"A",
    videoEngine:"agnes", wangpUrl:"http://192.168.1.100:7860", ltxApiKey:"",
    imageProvider:"pollinations",
    lecons:"",
    uid:1
  };
}

var P = fresh();
var R = {
  tab: "brief",
  ep: 0,
  busy: null,
  arm: "",
  refs: [],
  chain: null,
  mont: false,
  view: "list"
};
var memOnly = false;

function load() {
  try {
    var raw = localStorage.getItem(STORE);
    if (raw) {
      try { localStorage.setItem(STORE_BACKUP_PREFIX + Date.now(), raw); } catch (e) {}
      var d = JSON.parse(raw), f = fresh();
      for (var k in f) P[k] = d[k] !== undefined ? d[k] : f[k];
    }
  } catch (e) { memOnly = true; }
  fixState();
}

function save() {
  try { localStorage.setItem(STORE, JSON.stringify(P)); }
  catch (e) { memOnly = true; }
}

function fixState() {
  if (typeof P.style === "string") P.style = P.style ? [P.style] : [];
  if (!Array.isArray(P.style)) P.style = [];
  if (P.style.length > MAX_STYLES) P.style = P.style.slice(0, MAX_STYLES);
  if (typeof P.duree !== "number") P.duree = 60;
  if (typeof P.yeux === "string") P.yeux = P.yeux ? [P.yeux] : [];
  if (!P.ambs) P.ambs = [];
  if (!P.teints) P.teints = [];
  if (!P.effets) P.effets = [];
  if (!P.sous) P.sous = ["U1"];
  if (!P.concepts) P.concepts = [];
  if (!P.persos) P.persos = [];
  if (!P.lieux) P.lieux = [];
  if (!P.eps) P.eps = [];
  if (!P.imageProvider) P.imageProvider = "pollinations";

  P.eps.forEach(function (e) {
    if (!e.cast) e.cast = [];
    if (!e.stats) e.stats = { vues:"", r3:"", moy:"", part:"", comm:"" };
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
      if (p.photoStatus === undefined) p.photoStatus = null;
      if (p.photoError === undefined) p.photoError = "";
      if (p.lastFrameUri === undefined) p.lastFrameUri = null;
      if (!p.duree || isNaN(parseFloat(p.duree))) {
        p.duree = 6;
        p.frames = 145;
      }
    });
  });
  P.persos.forEach(function (p) {
    if (p.refUri === undefined) p.refUri = null;
    if (p.refStatus === undefined) p.refStatus = null;
    if (p.refError === undefined) p.refError = "";
  });
  P.lieux.forEach(function (l) {
    if (l.refUri === undefined) l.refUri = null;
    if (l.refStatus === undefined) l.refStatus = null;
    if (l.refError === undefined) l.refError = "";
  });
}

/* ═══════════════════════════════════════════════════════════
   UTILITAIRES
   ═══════════════════════════════════════════════════════════ */
function has(v) { return String(v || "").trim().length > 0; }
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function uid() { return P.uid++; }
var _tt = 0;
function toast(m, ms) {
  var t = document.getElementById("toast");
  if (!t) return;
  t.textContent = m;
  t.hidden = false;
  clearTimeout(_tt);
  _tt = setTimeout(function () { t.hidden = true; }, ms || 3000);
}
function byId(arr, id) { return arr.filter(function (x) { return x.id === id; })[0]; }
function sentence(t) {
  t = String(t || "").trim();
  return t && !/[.!?]$/.test(t) ? t + "." : t;
}
function setPath(o, path, v) {
  var a = path.split("."), i;
  for (i = 0; i < a.length - 1; i++) o = o[a[i]];
  o[a[a.length - 1]] = v;
}
function sleep(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }

function cleanForAgnes(s) {
  return String(s || "")
    .replace(/\n/g, " ").replace(/\r/g, "")
    .replace(/[«»„""]/g, "'")
    .replace(/\s+/g, " ").trim();
}

/* ═══════════════════════════════════════════════════════════
   ACCESSEURS
   ═══════════════════════════════════════════════════════════ */
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
  var a = [];
  P.teints.forEach(function (id) { var x = byId(TEINTS, id); if (x) a.push(x.p); });
  var yeux = Array.isArray(P.yeux) ? P.yeux : (P.yeux ? [P.yeux] : []);
  yeux.forEach(function (id) { var y = byId(YEUX, id); if (y) a.push(y.p); });
  return a.join(", ");
}
function sousList() {
  var s = P.sous;
  if (typeof s === "string") s = [s];
  return (s || []).filter(function (id) { return byId(SOUS, id); });
}
function sousPhrase() {
  var a = sousList();
  if (!a.length) a = ["U1"];
  return a.map(function (id) { return byId(SOUS, id).p; }).join(" + ");
}
function camPhrase() {
  var c = byId(CAMS, P.cam);
  return c ? c.p : "";
}
function perPlan() {
  return DUREES_PLAN.filter(function (x) { return x.v === P.dureePlan; })[0] || DUREES_PLAN[1];
}

function unit(n) { return P.nb === 1 ? "la vidéo" : "l'épisode " + n; }
function canScript() {
  return P.rec === "oui" ? P.persos.length > 0 : (has(P.idee) && P.style.length > 0);
}
function epBy(n) { return P.eps.filter(function (e) { return e.n === n; })[0]; }
function newEp(n) {
  return {
    n: n, titre: "", note: "", resume: "", fin: "", script: "",
    plans: [], montage: "", cast: [],
    stats: { vues:"", r3:"", moy:"", part:"", comm:"" },
    bilan: "", finalVideoUrl: null, finalVideoStatus: null, finalVideoError: ""
  };
}
function persoBy(n) {
  var k = String(n || "").trim().toLowerCase();
  if (!k) return null;
  var all = P.persos.slice();
  P.eps.forEach(function (e) { all = all.concat(e.cast || []); });
  return all.filter(function (p) {
    return p.nom && p.nom.trim().toLowerCase() === k;
  })[0];
}
function findLieu(t) {
  var k = String(t || "").toLowerCase().trim();
  if (!k) return null;
  return P.lieux.filter(function (l) {
    var n = (l.nom || "").toLowerCase().trim();
    return n && (n === k || k.indexOf(n) >= 0 || n.indexOf(k) >= 0);
  })[0];
}

/* ═══════════════════════════════════════════════════════════
   PRESSE-PAPIER
   ═══════════════════════════════════════════════════════════ */
function copyText(text, el, msg) {
  function ok() { toast(msg || "Copié."); }
  function fb() {
    var done = false;
    try {
      if (el && el.select) {
        el.focus(); el.select();
        el.setSelectionRange(0, text.length);
      } else {
        var r = document.createRange();
        r.selectNodeContents(el);
        var s = getSelection();
        s.removeAllRanges(); s.addRange(r);
      }
      done = document.execCommand("copy");
    } catch (e) {}
    toast(done ? (msg || "Copié.") : "Sélectionne le texte puis Copier.");
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(ok, fb);
  } else {
    fb();
  }
}
function copyAll(text, msg) {
  var ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
  document.body.appendChild(ta);
  copyText(text, ta, msg);
  setTimeout(function () {
    if (ta.parentNode) ta.parentNode.removeChild(ta);
  }, 2000);
}

/* ═══════════════════════════════════════════════════════════
   CLÉS API
   ═══════════════════════════════════════════════════════════ */
function getAgnesKey() {
  try { return (localStorage.getItem("agnes_key") || "").trim(); } catch (e) { return ""; }
}
function saveAgnesKey() {
  var inp = document.getElementById("agnes-key-input");
  if (!inp) return;
  var k = inp.value.trim();
  if (!k) {
    try { localStorage.removeItem("agnes_key"); } catch (e) {}
    toast("Clé Agnes effacée.");
    return;
  }
  try {
    localStorage.setItem("agnes_key", k);
    toast("Clé Agnes enregistrée.");
  } catch (e) { toast("Sauvegarde impossible."); }
}
function getCloudflareAccountId() {
  try { return (localStorage.getItem("cf_account_id") || "").trim(); } catch (e) { return ""; }
}
function getCloudflareApiToken() {
  try { return (localStorage.getItem("cf_api_token") || "").trim(); } catch (e) { return ""; }
}
function getPollinationsToken() {
  try { return (localStorage.getItem("pollinations_api_key") || "").trim(); } catch (e) { return ""; }
}

function savePollinationsKey() {
  var inp = document.getElementById("poll-token-input");
  if (!inp) return;
  var k = inp.value.trim();
  if (!k) {
    try { localStorage.removeItem("pollinations_api_key"); } catch (e) {}
    toast("Token Pollinations effacé.");
    return;
  }
  try {
    localStorage.setItem("pollinations_api_key", k);
    toast("Token Pollinations enregistré.");
  } catch (e) { toast("Sauvegarde impossible."); }
}
function getHuggingFaceToken() {
  try { return (localStorage.getItem("hf_token") || "").trim(); } catch (e) { return ""; }
}
function saveCloudflareKeys() {
  var acc = document.getElementById("cf-account-input");
  var tok = document.getElementById("cf-token-input");
  if (acc && acc.value.trim()) localStorage.setItem("cf_account_id", acc.value.trim());
  if (tok && tok.value.trim()) localStorage.setItem("cf_api_token", tok.value.trim());
  toast("Clés Cloudflare enregistrées.");
}
function saveHuggingFaceKeys() {
  var tok = document.getElementById("hf-token-input");
  if (tok && tok.value.trim()) localStorage.setItem("hf_token", tok.value.trim());
  toast("Token Hugging Face enregistré.");
}

/* ═══════════════════════════════════════════════════════════
   APPEL AGNES — FETCH AVEC BACKOFF
   ═══════════════════════════════════════════════════════════ */
async function agnesFetch(url, options) {
  options = options || {};
  for (var i = 0; i < 10; i++) {
    try {
      var r = await fetch(url, options);
      if (r.status === 429) {
        await sleep(AGNES_B429[Math.min(i, AGNES_B429.length - 1)]);
        continue;
      }
      if (r.status === 503) {
        await sleep(AGNES_B503[Math.min(i, AGNES_B503.length - 1)]);
        continue;
      }
      return r;
    } catch (e) {
      await sleep(5000 * (i + 1));
    }
  }
  return fetch(url, options);
}

async function callAgnesText(system, user) {
  var res = await agnesFetch(AGNES_API + "/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + getAgnesKey(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: AGNES_TEXT_MODEL,
      messages: [
        { role: "system", content: system || "You are a helpful assistant. Always answer with valid JSON only, no commentary." },
        { role: "user", content: user }
      ],
      temperature: 0.85,
      max_tokens: 16000,
      response_format: { type: "json_object" }
    })
  });
  if (!res.ok) {
    var t = await res.text();
    throw new Error("Texte HTTP " + res.status + " : " + t.slice(0, 200));
  }
  var d = await res.json();
  var content = d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content;
  if (!content) throw new Error("Pas de contenu.");
  return content;
}

/* ═══════════════════════════════════════════════════════════
   FOURNISSEURS D'IMAGES
   ═══════════════════════════════════════════════════════════ */
async function pollinationsCreateImage(prompt) {
  var seed = Math.floor(Math.random() * 1000000);
  var apiKey = "";
  try { apiKey = (localStorage.getItem("pollinations_api_key") || "").trim(); } catch (e) {}
  var url = "https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt)
    + "?width=768&height=1344&seed=" + seed
    + "&nologo=true&model=flux";
  if (apiKey) {
    url += "&token=" + encodeURIComponent(apiKey);
  }
  var res = await fetch(url);
  if (!res.ok) {
    if (res.status === 402) throw new Error("Pollinations : quota épuisé. Vérifie ton token ou attends 24h.");
    throw new Error("Pollinations HTTP " + res.status);
  }
  var blob = await res.blob();
  return await new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onloadend = function () { resolve(reader.result); };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function cloudflareCreateImage(prompt) {
  var accountId = getCloudflareAccountId();
  var apiToken = getCloudflareApiToken();
  if (!accountId || !apiToken) {
    throw new Error("Clés Cloudflare manquantes.");
  }
  var url = "https://api.cloudflare.com/client/v4/accounts/" + accountId
    + "/ai/run/@cf/black-forest-labs/flux-1-schnell";
  var res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + apiToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt: prompt, num_steps: 4 })
  });
  if (!res.ok) {
    var errTxt = await res.text();
    throw new Error("Cloudflare HTTP " + res.status + " : " + errTxt.slice(0, 100));
  }
  var d = await res.json();
  if (d.result && d.result.image) return "data:image/png;base64," + d.result.image;
  if (d.result && d.result.url) return d.result.url;
  throw new Error("Réponse Cloudflare inattendue.");
}

async function huggingfaceCreateImage(prompt) {
  var token = getHuggingFaceToken();
  if (!token) throw new Error("Token Hugging Face manquant.");
  var model = "black-forest-labs/FLUX.1-schnell";
  var url = "https://api-inference.huggingface.co/models/" + model;
  var res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: prompt })
  });
  if (!res.ok) {
    var errTxt = await res.text();
    throw new Error("Hugging Face HTTP " + res.status + " : " + errTxt.slice(0, 100));
  }
  var blob = await res.blob();
  return await new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onloadend = function () { resolve(reader.result); };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function generateImage(provider, prompt) {
  console.log("[IMAGE] Génération via " + provider);
  if (provider === "cloudflare") return await cloudflareCreateImage(prompt);
  if (provider === "huggingface") return await huggingfaceCreateImage(prompt);
  return await pollinationsCreateImage(prompt);
}

/* ═══════════════════════════════════════════════════════════
   AGNES IMAGE (fallback)
   ═══════════════════════════════════════════════════════════ */
async function agnesCreateImage(prompt, refImages) {
  var body = {
    model: AGNES_IMAGE_MODEL,
    prompt: prompt,
    size: "2K",
    ratio: "9:16",
    extra_body: { response_format: "url" }
  };
  if (refImages && refImages.length) {
    body.extra_body.image = refImages.slice(0, 5);
  }
  var res = await agnesFetch(AGNES_API + "/images/generations", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + getAgnesKey(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error("Image HTTP " + res.status);
  var d = await res.json();
  var item = d.data && d.data[0];
  if (!item) throw new Error("Pas d'image.");
  return item.url || ("data:image/png;base64," + item.b64_json);
}

/* ═══════════════════════════════════════════════════════════
   AGNES VIDÉO
   ═══════════════════════════════════════════════════════════ */
async function agnesCreateVideo(prompt, imageDataUri, lastFrameUri, numFrames) {
  var seconds = String(Math.max(4, Math.min(12, Math.round((numFrames || 145) / 24))));
  var body = {
    model: AGNES_VIDEO_MODEL,
    prompt: prompt,
    seconds: seconds,
    mode: imageDataUri ? "reference" : "text",
    size: "720P",
    aspect_ratio: "9:16"
  };
  if (imageDataUri) body.images = [imageDataUri];
  if (lastFrameUri) body.last_frame = lastFrameUri;
  var res = await agnesFetch(AGNES_API + "/videos", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + getAgnesKey(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    var t = await res.text();
    throw new Error("Vidéo HTTP " + res.status);
  }
  var d = await res.json();
  var id = d.video_id || d.id || d.task_id;
  if (!id) throw new Error("Pas de video_id.");
  return id;
}

async function agnesPollVideo(videoId, onProgress) {
  var wait = 80;
  while (wait > 0) {
    if (onProgress) onProgress("Préparation (" + wait + " s)…");
    await sleep(1000);
    wait--;
  }
  var intervals = [8, 8, 12, 12, 20, 20, 25];
  for (var attempt = 0; attempt < 100; attempt++) {
    if (attempt > 0) {
      var iv = intervals[Math.min(attempt - 1, intervals.length - 1)];
      while (iv > 0) {
        if (onProgress) onProgress("L'image prend vie (" + iv + " s)…");
        await sleep(1000);
        iv--;
      }
    }
    var url = AGNES_POLL + "?video_id=" + encodeURIComponent(videoId)
      + "&model_name=" + encodeURIComponent(AGNES_VIDEO_MODEL);
    var res = await agnesFetch(url, {
      method: "GET",
      headers: { "Authorization": "Bearer " + getAgnesKey() }
    });
    var d = await res.json();
    var st = d.status || "unknown", pr = d.progress || 0;
    if (onProgress) onProgress("Création " + pr + " %…");
    if (st === "completed" || st === "succeeded" || st === "done") {
      var vurl = (d.metadata && d.metadata.url) || d.url || (d.output && d.output.url);
      if (!vurl) throw new Error("Terminé sans URL.");
      return vurl;
    }
    if (st === "failed" || st === "error" || st === "cancelled") {
      throw new Error("Échec (" + st + ").");
    }
  }
  throw new Error("Délai dépassé.");
}
/* ═══════════════════════════════════════════════════════════
   PROMPTS FINAUX
   ═══════════════════════════════════════════════════════════ */
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

  var fruitStyle = Array.isArray(P.style) && (P.style.indexOf("F1") >= 0 || P.style.indexOf("F2") >= 0);
  if (fruitStyle) {
    parts.push("⚠️ STRICT SHAPE RULE: The character's HEAD (or ENTIRE BODY if F2) MUST keep the fruit silhouette exactly. This is NOT a human with colored skin — the fruit shape must be instantly recognizable. No human head. No realistic human anatomy. Only the face features are cartoon-human-like, everything else is the fruit.");
  }

  parts.push("No logo, no brand, no text. Hands relaxed with five fingers. Vertical 9:16.");
  var ph = phrase();
  if (ph) parts.push(ph + ".");
  return parts.filter(Boolean).join(" ");
}

function imagePromptWithCoherence(pl) {
  var base = imagePrompt(pl);
  var noms = String(pl.persos || "").split(/[,;]/).map(function (n) { return n.trim(); }).filter(Boolean);
  var note = "\n\n⚠️ COHÉRENCE OBLIGATOIRE : " +
    "The characters must match EXACTLY the reference images provided (same face, same hair, same skin tone, same clothes). " +
    "Do NOT invent new characters. " +
    (noms.length ? "Only these characters may appear: " + noms.join(", ") + ". " : "") +
    "Any character not listed must NOT appear in the image.";
  return base + note;
}

function videoPrompt(pl) {
  var who = String(pl.qui || "").trim();
  var spoke = NONE.indexOf(who.toLowerCase()) < 0;
  var rule;
  var speakerId = "";
  var replique = String(pl.replique || "").trim()
    .replace(/"/g, "'")
    .replace(/[«»„""]/g, "'")
    .replace(/\n/g, " ");

  var cleanEmotion = cleanForAgnes(pl.emotion);
  var cleanAction = cleanForAgnes(pl.action);
  var cleanPv = cleanForAgnes(pl.pv);

  if (!spoke || P.speech === "A") {
    rule = "No dialogue. No one speaks, all mouths stay closed. AUDIO: no voice.";
  } else if (P.speech === "B") {
    rule = "ONLY " + who + " speaks. Only " + who + "'s lips move. AUDIO: " + who + " says in French: '" + replique + "'. No music, no other voice.";
    var cB = persoBy(who);
    if (cB && has(cB.visuel)) {
      var wordsB = cleanForAgnes(cB.visuel).split(/\s+/).slice(0, 18).join(" ");
      speakerId = " [IMPORTANT: The character who speaks is " + who + ", visually: " + wordsB + ". Only THIS character's lips move.]";
    } else {
      speakerId = " [IMPORTANT: Only " + who + " speaks.]";
    }
  } else {
    rule = "ONLY " + who + " talks animatedly, mouth opening and closing. Every other character keeps the mouth closed and still. AUDIO: silence.";
    var cC = persoBy(who);
    if (cC && has(cC.visuel)) {
      var wordsC = cleanForAgnes(cC.visuel).split(/\s+/).slice(0, 18).join(" ");
      speakerId = " [IMPORTANT: The character who speaks is " + who + ", visually: " + wordsC + ". Only THIS character's lips move.]";
    } else {
      speakerId = " [IMPORTANT: Only " + who + " speaks.]";
    }
  }

  var emotionLine = has(cleanEmotion) ? " EMOTION: " + who + " feels " + cleanEmotion + ". " : "";
  var actionLine = has(cleanAction) ? " VISIBLE ACTION: " + cleanAction + ". " : "";

  return (cleanPv ? cleanPv + " " : "") +
    (has(pl.duree) ? "Clip length about " + pl.duree + " seconds. " : "") +
    (camPhrase() ? camPhrase() + " " : "") +
    emotionLine + actionLine + rule + speakerId + " " +
    "CRITICAL: Show ONLY the characters visible in the starting image. Do NOT add new people. Do NOT change faces, hair or clothes. " +
    "ANIMATION STYLE: If the character is anthropomorphic (fruit, animal, food), use exaggerated cartoon animation with bouncy movements, squash and stretch, big expressive eyes. " +
    "Stable face, natural motion, no text, vertical 9:16.";
}

/* ═══════════════════════════════════════════════════════════
   CONTEXTE POUR LES PROMPTS
   ═══════════════════════════════════════════════════════════ */
function bible(ep) {
  var ps = P.persos.concat(ep && ep.cast ? ep.cast : []);
  return "CHARACTERS:\n" + (ps.length
    ? ps.map(function (p) { return "- " + p.nom + (p.role ? " (" + p.role + ")" : "") + " : " + p.visuel; }).join("\n")
    : "- none") +
    "\nPLACES:\n" + (P.lieux.length
      ? P.lieux.map(function (l) { return "- " + l.nom + " : " + l.visuel; }).join("\n")
      : "- none");
}

function voicesText(ep) {
  var ps = P.persos.concat(ep && ep.cast ? ep.cast : []).filter(function (p) {
    return has(p.caractere) || has(p.secret) || has(p.voix);
  });
  return ps.length ? "PERSONALITY AND VOICE:\n" + ps.map(function (p) {
    return "- " + p.nom + " : " + [p.caractere, p.secret, p.voix].filter(has).join(" ; ");
  }).join("\n") + "\n" : "";
}

var DIALOGUE_RULES = "QUALITÉ DES DIALOGUES : écris comme des gens parlent vraiment, en français oral et vivant. Chaque réplique révèle, provoque, esquive ou fait rire. Interdits : formules toutes faites, répliques qui expliquent l'image. ";

function recapFor(n) {
  var p = epBy(n - 1);
  return p && has(p.resume) ? p.resume + (has(p.fin) ? " Question de fin : " + p.fin : "") : "";
}
function isLast(ep) { return ep.n >= P.nb; }
function arcLine(n) {
  var l = P.arc.split("\n")[n - 1];
  return l ? l.replace(/^\d+[.)]\s*/, "") : "";
}
function briefText() {
  return (has(P.genre) ? "Genre : " + P.genre + ".\n" : "") +
         (has(P.cible) ? "Public : " + P.cible + ".\n" : "");
}
function leconsText() {
  return has(P.lecons) ? "LEÇONS DES STATS PRÉCÉDENTES :\n" + P.lecons.trim() + "\n" : "";
}

/* ═══════════════════════════════════════════════════════════
   EXTRACTION JSON
   ═══════════════════════════════════════════════════════════ */
function salvageTruncatedJson(text) {
  var s = String(text || "").trim();
  var start = s.indexOf("{");
  if (start < 0) return null;
  s = s.slice(start);
  var lastObjEnd = -1, depth = 0, inString = false, escape = false;
  for (var i = 0; i < s.length; i++) {
    var c = s[i];
    if (escape) { escape = false; continue; }
    if (c === "\\") { escape = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 2) lastObjEnd = i;
    }
  }
  if (lastObjEnd < 0) return null;
  var fixed = s.slice(0, lastObjEnd + 1) + "]}";
  try { return JSON.parse(fixed); } catch (e) { return null; }
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
      var scriptLines = m[1].split(/\\n|\n/).map(function (l) {
        return l.replace(/\\"/g, '"').replace(/"/g, '\\"');
      });
      var newRaw = raw.replace(m[0], '"script":["' + scriptLines.join('","') + '"]');
      return JSON.parse(newRaw);
    }
  } catch (e4) {}
  try {
    var salv = salvageTruncatedJson(raw);
    if (salv) { console.warn("[PARSE] JSON tronqué réparé"); return salv; }
  } catch (e5) {}
  throw new Error("JSON invalide");
}

/* ═══════════════════════════════════════════════════════════
   APPEL AGNES + ASK
   ═══════════════════════════════════════════════════════════ */
function ask(label, prompt, apply) {
  var p = new Promise(function (resolve, reject) {
    if (!getAgnesKey()) {
      toast("Ajoute ta clé Agnes.");
      reject(new Error("no key"));
      return;
    }
    R.busy = { label: label, sub: R.chain ? R.chain.sub : "" };
    overlay();
    console.log("[ASK] " + label + " · prompt " + prompt.length + " car.");
    callAgnesText("", prompt).then(function (txt) {
      R.busy = null;
      overlay();
      try {
        var data = extractJson(txt);
        apply(data);
        save();
        render();
        toast(label + " : terminé.");
        console.log("[ASK] " + label + " · succès");
        resolve(data);
      } catch (e) {
        console.error("[ASK] " + label + " · parse raté :", e, txt.slice(0, 500));
        toast("Réponse illisible. Réessaie.");
        reject(e);
      }
    }).catch(function (e) {
      R.busy = null;
      overlay();
      console.error("[ASK] " + label + " · échec :", e);
      toast("Échec : " + (e.message || "").slice(0, 80));
      reject(e);
    });
  });
  p.catch(function () {});
  return p;
}

function overlay() {
  var o = document.getElementById("overlay");
  if (!o) return;
  if (!R.busy) { o.innerHTML = ""; return; }
  o.innerHTML = '<div class="busy"><div class="glass">' +
    '<div class="spin"></div>' +
    '<b>Agnes prépare : ' + esc(R.busy.label) + '</b>' +
    (R.busy.sub ? '<p class="small"><b>' + esc(R.busy.sub) + '</b></p>' : '') +
    '<p class="small muted">Compte 20 à 90 secondes.</p>' +
    '<button type="button" class="btn ghost big" data-act="stop">Arrêter</button>' +
    '</div></div>';
}

var JSONNOTE = "\n\nAnswer ONLY with a valid JSON object, no text before or after, no code fences.";

function cleanStyleFromVisuel(v) {
  if (!has(v)) return "";
  var s = String(v);
  var patterns = [
    /3D cartoon Pixar-style character where the HEAD is literally[\s\S]*?clean pastel background\.?/gi,
    /3D cartoon Pixar-style character where the entire BODY is the fruit[\s\S]*?urban background\.?/gi,
    /high-end stylized 3D render of a glamorous fashion doll in the style of Rainbow High and Bratz[\s\S]*?Octane render\.?/gi,
    /high-end stylized 3D render of a glamorous fashion doll, full-body[\s\S]*?Octane render\.?/gi
  ];
  patterns.forEach(function (re) { s = s.replace(re, ""); });
  s = s.replace(/\s+/g, " ").replace(/^[.,;:\s]+/, "").trim();
  return s;
}

/* ═══════════════════════════════════════════════════════════
   GÉNÉRATEUR — UNIVERS
   ═══════════════════════════════════════════════════════════ */
function genUnivers() {
  var st = sty(), ph = phrase();
  var fmt = P.nb === 1 ? "A single video of " + P.duree + " seconds." : P.nb + " videos of " + P.duree + " seconds each.";
  var persoRule = P.rec === "oui"
    ? "Create the season's cast: 4 to 6 characters maximum. "
    : "Characters change between videos: characters = empty list. ";
  var coherenceRule = "CULTURAL COHERENCE: if a character has dark skin, their hairstyle MUST match (braids, afro, cornrows, gradient, wig with edges). NEVER blonde hair on dark skin unless explicitly stated.\n";

  var prompt = "You are a screenwriter for short vertical animated videos (TikTok, YouTube Shorts). Output user-facing content in FRENCH, but every instruction here is for you in English. Technical fields (visual descriptions) must be IN ENGLISH.\n" +
    "Starting idea (in French): " + P.idee.trim() + "\n" +
    (has(P.titre) ? "Desired title (in French): " + P.titre.trim() + "\n" : "") +
    "Format: " + fmt + "\n" +
    (has(P.genre) ? "Genre: " + P.genre + ".\n" : "") +
    (has(P.cible) ? "Audience: " + P.cible + ".\n" : "") +
    "Visual style: " + (st ? st.nom + ". Style phrase: " + ph : "not specified") + "\n" + coherenceRule +
    "\n" + persoRule +
    "No brand, no logo, no real person. No violence, no suggestive scene.\n" +
    "Each visual description field must be IN ENGLISH, 50 to 80 words. MANDATORY FORMAT: start with 'character with', then list ONLY literal visual features: body shape, exact colors, texture, eye shape and color, hair style and color, outfit fabrics and colors, one signature accessory. FORBIDDEN: brand names, style references, metaphors, emotions, story elements.\n" +
    "Places: visual description IN ENGLISH with no character, physical decor only (2 to 4 places).\n" +
    "Arc: exactly " + P.nb + " line" + (P.nb > 1 ? "s" : "") + " (one per video, in French)." + JSONNOTE +
    '\nFormat: {"titre":"in French","phrase_concept":"in French","regle_speciale":"in French","ton":"in French","personnages":[{"nom":"in French","role":"in French","caractere":"3 mots en français","secret":"in French","voix":"in French","visuel":"in English 40-60 words"}],"lieux":[{"nom":"in French","visuel":"in English"}],"arc":["in French"]}';

  return ask(P.rec === "oui" ? "le casting et l'univers" : "le concept et l'univers", prompt, function (d2) {
    if (!d2 || (!d2.phrase_concept && !(d2.personnages && d2.personnages.length))) throw new Error("vide");
    if (has(d2.titre) && !has(P.titre)) P.titre = d2.titre;
    P.concept = d2.phrase_concept || "";
    P.regle = d2.regle_speciale || "";
    P.ton = d2.ton || "";
    P.arc = (d2.arc || []).map(function (l, i) {
      return /^\d+[.)]/.test(l) ? l : (i + 1) + ". " + l;
    }).join("\n");
    P.persos = P.rec === "oui" ? (d2.personnages || []).map(function (p) {
      return {
        id: uid(), nom: p.nom || "", role: p.role || "",
        caractere: p.caractere || "", secret: p.secret || "",
        voix: p.voix || "",
        visuel: cleanStyleFromVisuel(p.visuel) || (p.visuel || ""),
        refUri: null, refStatus: null, refError: ""
      };
    }) : [];
    P.lieux = (d2.lieux || []).map(function (l) {
      return {
        id: uid(), nom: l.nom || "",
        visuel: l.visuel || "",
        refUri: null, refStatus: null, refError: ""
      };
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   GÉNÉRATEUR — SCRIPT
   ═══════════════════════════════════════════════════════════ */
function scriptBody(ep) {
  var rec = P.rec, last = isLast(ep);
  var structure = "3-second hook, " + (ep.n > 1 && rec === "oui" && P.nb > 1 ? "5-second recap, " : "") + "setup, conflict, twist, " + (last ? "clean ending." : "ending on a question.");
  var rehook = P.duree >= 45 ? "3. MID-VIDEO RE-HOOK: Around " + Math.round(P.duree / 2) + "s, place a second strong hook tagged [RE-HOOK].\n" : "";
  var rehookEx = P.duree >= 45 ? "[00:" + String(Math.round(P.duree / 2)).padStart(2, "0") + "] [RE-HOOK] CLOSE-UP - Aicha (paniquée) : Attends... tu savais ?\n" : "";

  return "Write episode " + unit(ep.n) + " of a short vertical animated production. ALL dialogue in FRENCH. Every instruction here is in English. Shot types MUST be IN ENGLISH.\n" +
    "Title (in French): " + (P.titre || "sans titre") + ". Idea (in French): " + P.idee.trim() + "\n" +
    "Concept (in French): " + P.concept + "\nRule: " + P.regle + "\nTone: " + P.ton + "\n" + briefText() +
    (P.nb > 1 ? "Format: " + P.nb + " videos, this is n° " + ep.n + ".\n" : "Format: single video.\n") +
    bible(ep) + "\n" + voicesText(ep) + "\n" + leconsText() +
    (P.nb > 1 ? "\nArc event (in French): " + (arcLine(ep.n) || "à imaginer") + "\n" : "") +
    (has(ep.note) ? "Starting note (in French): " + ep.note.trim() + "\n" : "") +
    (ep.n > 1 && rec === "oui" ? "Previous recap (in French): " + (recapFor(ep.n) || "non fourni") + "\n" : "") +
    "\nTarget duration: " + P.duree + " s. Structure: " + structure + " Max 2 characters per scene. " + DIALOGUE_RULES + "\n" +
    "⚠️ HARD CONSTRAINT: story must fit in " + P.duree + "s. Count your lines BEFORE answering.\n" +
    "MANDATORY TIKTOK RULES:\n" +
    "1. 3-SECOND HOOK: first line tagged [HOOK].\n" +
    "2. VISUAL CHANGE EVERY 2-3s: each line has a shot type DIFFERENT from previous. ENGLISH shot names: CLOSE-UP, MEDIUM SHOT, WIDE SHOT, OVER-THE-SHOULDER, HANDHELD, ORBIT, HIGH ANGLE, LOW ANGLE.\n" +
    rehook +
    "4. ENDING: " + (last ? "Clean ending." : "Cliffhanger or question.") + "\n" +
    "5. MAXIMUM: " + Math.floor(P.duree / 3) + " lines TOTAL. Last timestamp BEFORE " + Math.floor(P.duree - 5) + "s. SHORT lines: 5-12 words.\n" +
    "6. TONE: Each line starts with a tone tag in parentheses, IN ENGLISH: (angry), (whispers), (cold), (panicked), (sarcastic).\n" +
    "\nSCRIPT FORMAT:\n" +
    "[00:00] [HOOK] CLOSE-UP - Mango (sarcastic): C'est ca, ton grand secret ?\n" +
    "[00:03] OVER-THE-SHOULDER - Aicha (cold): Tais-toi. Elle arrive.\n" +
    "[00:06] MEDIUM SHOT - Mango (whispers): On en reparle.\n" +
    "[00:09] WIDE SHOT - (silence) - la porte s'ouvre lentement\n" +
    rehookEx +
    "\nShot types MANDATORY on EVERY line, in ENGLISH. [HOOK]/[RE-HOOK] tags right after timestamp.\n" +
    JSONNOTE +
    '\nThe "script" field must be an ARRAY of lines.' +
    '\nFormat: {"titre":"in French","resume":"3 phrases en français","question_fin":"in French' + (isLast(ep) ? " (chute)" : "") + '","script":["[00:00] [HOOK] CLOSE-UP - Mango (sarcastic): C\'est ca ?","[00:03] OVER-THE-SHOULDER - Aicha (cold): Tais-toi."]}';
}

function applyScript(ep, r) {
  if (!r || !r.script) throw new Error("vide");
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
  } else {
    ep.script = String(r.script || "");
  }
  if (P.rec !== "oui") ep.cast = (r.personnages || []).map(function (p) {
    return { id: uid(), nom: p.nom || "", role: p.role || "", visuel: cleanStyleFromVisuel(p.visuel) || (p.visuel || ""), ok: false };
  });
}
function genScript(ep) {
  return ask("le script de " + unit(ep.n), scriptBody(ep), function (r) { applyScript(ep, r); });
}

/* ═══════════════════════════════════════════════════════════
   GÉNÉRATEUR — PLANS
   ═══════════════════════════════════════════════════════════ */
function plansBody(ep, scriptText) {
  var minPlans = Math.floor(P.duree / 8);
  var maxPlans = Math.floor(P.duree / 5);
  var durationsList = DUREES_PLAN.map(function (x) { return x.v + " s (" + x.frames + " frames)"; }).join(", ");
  return "Visual style: " + phrase() + "\n" + bible(ep) + "\n\nScript:\n" + scriptText + "\n\n" +
    "Break this script into shots. Total video must be " + P.duree + " seconds.\n" +
    "DURATION RULES BY EMOTION:\n" +
    "- [HOOK] / [RE-HOOK] / shock / twist -> SHORT (5-6 s)\n" +
    "- Tense dialogue -> 5-7 s\n" +
    "- Silence / strong emotion -> LONG (8-10 s)\n" +
    "- Physical action -> 6-8 s\n" +
    "- Cliffhanger -> 6-8 s, close-up or wide shot.\n" +
    "Each shot: ONE of these exact durations: " + durationsList + ". " +
    "You need between " + minPlans + " and " + maxPlans + " shots + 2 spare shots. " +
    "For each shot: place IN FRENCH, 2 characters max, action IN ENGLISH (short), shot type IN ENGLISH, line IN FRENCH (12 words max), who speaks (name or 'personne'), emotion IN ENGLISH (panicked / cold / angry / scared / happy / surprised), pace IN ENGLISH.\n" +
    "prompt_image IN ENGLISH describes ONLY the scene (shot type, positions, action, light). prompt_video IN ENGLISH: movement only.\n" +
    "⚠️ HARD CONSTRAINT: sum of durations for shots 1 to N (without spare) MUST equal " + P.duree + " s (tolerance +/-3 s)." + JSONNOTE +
    '\nFormat: {"plans":[{"n":1,"duree_s":6,"lieu":"in French","personnages":["name"],"action":"in English","cadrage":"medium shot","replique":"in French","qui_parle":"name","emotion":"panicked","rythme":"tense","prompt_image":"in English","prompt_video":"in English","reserve":false}]}';
}

function applyPlans(ep, r) {
  if (!r || !r.plans || !r.plans.length) throw new Error("vide");
  ep = epBy(ep.n) || ep;
  ep.plans = r.plans.map(function (x, i) {
    var dv = parseFloat(String(x.duree_s).replace(",", ".")) || 6;
    var closest = DUREES_PLAN[0];
    var bestDiff = Math.abs(DUREES_PLAN[0].v - dv);
    DUREES_PLAN.forEach(function (dp) {
      var diff = Math.abs(dp.v - dv);
      if (diff < bestDiff) { bestDiff = diff; closest = dp; }
    });
    return {
      id: uid(), n: x.n || i + 1, duree: closest.v, frames: closest.frames,
      lieu: x.lieu || "", persos: (x.personnages || []).join(", "),
      action: x.action || "", cadrage: x.cadrage || "",
      replique: x.replique || "", qui: x.qui_parle || "",
      emotion: x.emotion || "", rythme: x.rythme || "",
      pi: x.prompt_image || "", pv: x.prompt_video || "",
      reserve: !!x.reserve,
      st: 0, photoUri: null, videoUrl: null, videoStatus: null, videoError: "",
      videoMsg: "", photoStatus: null, photoError: "",
      lastFrameUri: null
    };
  });
}
function genPlans(ep) {
  return ask("le storyboard de " + unit(ep.n), plansBody(ep, ep.script), function (r) { applyPlans(ep, r); });
}

/* ═══════════════════════════════════════════════════════════
   GÉNÉRATEUR — MONTAGE
   ═══════════════════════════════════════════════════════════ */
function montBody(ep, list, titre, fin) {
  return "Series: " + (P.titre || "sans titre") + ". Episode " + ep.n + " : " + titre + "\nShots:\n" + list + "\nEnding question: " + fin + "\n\n" +
    "Write IN FRENCH with 4 headings:\n" +
    "1. PLAN DE MONTAGE CAPCUT (ordre, durées, coupes).\n" +
    "2. SOUS-TITRES ET TEXTES À L'ÉCRAN (styles : " + sousPhrase() + ").\n" +
    "3. SONS — Choisis la musique et les bruitages. Pour chaque son : moment, type, nom de la piste, auteur, plateforme gratuite (Pixabay Music, Freesound.org, YouTube Audio Library, Mixkit), pourquoi ce son.\n" +
    "4. PUBLICATION (description, hashtags, texte de couverture, premier commentaire).\n" +
    "Durée finale : " + (P.duree - 5) + " à " + (P.duree + 5) + " s.";
}

function montList(ep) {
  return ep.plans.filter(function (p) { return !p.reserve; }).map(function (p) {
    return "Plan " + p.n + " (" + p.duree + " s, " + p.lieu + ") : " + p.action + (has(p.replique) ? " | " + p.qui + " dit : " + p.replique : "");
  }).join("\n");
}

function genMontage(ep) {
  return new Promise(function (resolve, reject) {
    if (!getAgnesKey()) { toast("Ajoute ta clé Agnes."); reject(new Error("no key")); return; }
    R.busy = { label: "le montage et la publication" };
    overlay();
    callAgnesText("You write in French, no JSON, readable text.", montBody(ep, montList(ep), ep.titre, ep.fin))
      .then(function (txt) {
        R.busy = null;
        overlay();
        var e2 = epBy(ep.n) || ep;
        e2.montage = txt;
        save();
        render();
        toast("Montage prêt.");
        resolve(txt);
      })
      .catch(function (e) {
        R.busy = null;
        overlay();
        toast("Échec : " + (e.message || "").slice(0, 80));
        reject(e);
      });
  });
}

/* ═══════════════════════════════════════════════════════════
   GÉNÉRATEUR — BILAN
   ═══════════════════════════════════════════════════════════ */
function genBilan(ep) {
  var st = ep.stats || { vues:"", r3:"", moy:"", part:"", comm:"" };
  var prompt = "Series: " + (P.titre || "sans titre") + ". " + P.concept + "\nEpisode " + ep.n + " : " + ep.titre + ". Summary: " + ep.resume + "\nScript excerpt:\n" + String(ep.script || "").slice(0, 700) + "\n\n" +
    "Stats: " + st.vues + " views, " + st.r3 + " % watching at 3s, " + st.moy + " s average, " + st.part + " shares." + (has(st.comm) ? " Comments: " + st.comm : "") +
    (has(P.lecons) ? "\nLessons noted:\n" + P.lecons + "\n" : "") +
    "\nWrite IN FRENCH: diagnosis in 3 sentences, 3 short rules, 1 test." + JSONNOTE +
    '\nFormat: {"diagnostic":"in French","regles":["r1","r2","r3"],"test":"in French"}';
  return ask("le bilan de l'épisode " + ep.n, prompt, function (r) {
    if (!r || !r.diagnostic) throw new Error("vide");
    var e2 = epBy(ep.n) || ep;
    e2.bilan = r.diagnostic + (has(r.test) ? "\nÀ tester : " + r.test : "");
    var add = "Épisode " + ep.n + " : " + (r.regles || []).join(" ; ") + (has(r.test) ? " | Test : " + r.test : "");
    var l = (P.lecons || "").split("\n").filter(function (x) {
      return has(x) && x.indexOf("Épisode " + ep.n + " :") !== 0;
    });
    l.push(add);
    P.lecons = l.slice(-12).join("\n");
  });
}

/* ═══════════════════════════════════════════════════════════
   GÉNÉRATEUR — CONCEPTS
   ═══════════════════════════════════════════════════════════ */
function genConcepts(o) {
  o = o || {};
  var seeds = "", amb = (P.ambs || []).map(function (id) { var a = byId(AMBS, id); return a ? a.nom : ""; }).filter(has);
  if (o.surprise) {
    var picks = AMBS.slice().sort(function () { return Math.random() - .5; }).slice(0, 2);
    amb = picks.map(function (a) { return a.nom; });
  }
  var prompt = "You are a TikTok viral short-video writer. Output in FRENCH.\n" +
    "AUDIENCE: 13-30 year old TikTok users. 2-second attention span. Want EMOTION, DRAMA, SHOCK, TABOO, REVENGE.\n" +
    (P.cible ? "Target audience: " + P.cible + "\n" : "") +
    (amb.length ? "Mood: " + amb.join(" | ") + "\n" : "") + seeds +
    "\nWHAT WORKS ON TIKTOK:\n" +
    "1. TITLE = 3-6 words punchy. Examples: 'Mon mari m'a menti', 'Ma mère est ma sœur'.\n" +
    "2. STORY = ONE big dramatic reveal in 60-90 seconds.\n" +
    "3. FORBIDDEN TONES: introspective, melancholic, poetic.\n" +
    "4. REQUIRED: betrayal, revenge, forbidden love, hidden pregnancy, stolen money, fake death, jealousy.\n" +
    "5. HOOK (3 sec): a sentence that shocks.\n" +
    "6. TWIST: nobody sees it coming. Betrayal from trusted person.\n" +
    "7. If characters are fruits (anthropomorphic), the drama stays HUMAN — the fruit is just the visual.\n" +
    "\nFor each: title FR, mood, story in 3 sentences FR, hook FR, twist FR, cliffhanger FR, why it goes viral FR, main risk FR.\n" +
    "No brand, no real person." + JSONNOTE +
    '\nFormat: {"concepts":[{"titre":"in French","ambiance":"in French","idee":"in French","hook":"in French","twist":"in French","chute":"in French","pourquoi":"in French","risque":"in French"}]}';
  return ask(o.more ? "trois idées de plus" : "trois idées d'histoires", prompt, function (r) {
    if (!r || !r.concepts || !r.concepts.length) throw new Error("vide");
    var neu = r.concepts.slice(0, 6).map(function (c) {
      return {
        titre: c.titre || "", ambiance: c.ambiance || "", idee: c.idee || "",
        hook: c.hook || "", twist: c.twist || "", chute: c.chute || "",
        pourquoi: c.pourquoi || "", risque: c.risque || ""
      };
    });
    P.concepts = (o.more ? P.concepts : []).concat(neu).slice(-18);
  });
}
/* ═══════════════════════════════════════════════════════════
   INDEXEDDB — PHOTOS DES PLANS
   ═══════════════════════════════════════════════════════════ */
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
  if (R.tab === "studio" && R.ep) render();
}

/* ═══════════════════════════════════════════════════════════
   INDEXEDDB — RÉFÉRENCES (persos, lieux)
   ═══════════════════════════════════════════════════════════ */
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
  if (R.tab === "studio") render();
}

/* ═══════════════════════════════════════════════════════════
   UTILITAIRES FICHIERS
   ═══════════════════════════════════════════════════════════ */
function fileToDataUri(file) {
  return new Promise(function (res, rej) {
    var r = new FileReader();
    r.onload = function (e) { res(e.target.result); };
    r.onerror = function () { rej(new Error("Lecture impossible.")); };
    r.readAsDataURL(file);
  });
}
function compressImage(dataUri, maxSize, quality) {
  return new Promise(function (resolve) {
    var img = new Image();
    img.onload = function () {
      var w = img.width, h = img.height;
      var max = Math.max(w, h);
      if (max > maxSize) {
        var r = maxSize / max;
        w = Math.round(w * r);
        h = Math.round(h * r);
      }
      var canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = function () { resolve(dataUri); };
    img.src = dataUri;
  });
}

/* ═══════════════════════════════════════════════════════════
   GÉNÉRATION — RÉFÉRENCES (persos + lieux)
   ═══════════════════════════════════════════════════════════ */
function refPrompt(kind, visuel) {
  if (kind === "lieu") {
    return "Empty background plate. " + sentence(visuel) +
      " Wide establishing shot, eye level, no text, no logo, vertical 9:16. Deserted architectural space, no people, no human figure, photorealistic interior rendering.";
  }
  return sentence(visuel) +
    " Full body, front view, neutral expression, standing, plain light grey background, no text, vertical format. " + phrase() + ".";
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

async function generateRef(kind, id) {
  var obj = findRefObj(kind, id);
  if (!obj) { toast("Référence introuvable."); return; }
  var prompt = refPrompt(kind, obj.visuel);
  obj.refStatus = "busy";
  obj.refError = "";
  save(); render();

  try {
    var provider = P.imageProvider || "pollinations";
    var url = await generateImage(provider, prompt);
    obj.refUri = url;
    obj.refStatus = "done";
    obj.refError = "";
    await refStore(kind, id, url);
    save(); render();
    toast("Référence prête : " + (obj.nom || "sans nom"));
  } catch (e) {
    obj.refStatus = "err";
    obj.refError = (e.message || "Erreur").slice(0, 140);
    save(); render();
    toast("Échec : " + obj.refError);
  }
}

async function generateAllRefs() {
  var all = [];
  P.persos.forEach(function (p) { all.push({ kind: "perso", id: p.id, nom: p.nom }); });
  P.lieux.forEach(function (l) { all.push({ kind: "lieu", id: l.id, nom: l.nom }); });

  if (!all.length) { toast("Rien à générer. Lance d'abord le brief."); return; }
  if (!confirm("Générer " + all.length + " référence(s) avec " + (P.imageProvider || "pollinations") + " ?\n\nÀ ~15 secondes par image, compte environ " + Math.ceil(all.length * 15 / 60) + " minutes.")) return;

  var done = 0, failed = 0;
  for (var i = 0; i < all.length; i++) {
    var item = all[i];
    if (i > 0) await sleep(3400);
    toast("Référence " + (i + 1) + "/" + all.length + "…", 1500);
    try {
      await generateRef(item.kind, item.id);
      var obj = findRefObj(item.kind, item.id);
      if (obj && obj.refUri) done++; else failed++;
    } catch (e) { failed++; }
  }
  toast("Terminé : " + done + " OK, " + failed + " échec(s).", 4000);
  render();
}

async function uploadRef(kind, id, file) {
  if (!file || !file.type.startsWith("image/")) { toast("Ce fichier n'est pas une image."); return; }
  try {
    var uri = await fileToDataUri(file);
    if (uri.length > 500000) uri = await compressImage(uri, 768, 0.75);
    await refStore(kind, id, uri);
    var obj = findRefObj(kind, id);
    if (obj) {
      obj.refUri = uri;
      obj.refStatus = "done";
      save(); render();
      toast("Référence ajoutée.");
    }
  } catch (e) { toast("Impossible de lire cette image."); }
}

async function clearRef(kind, id) {
  if (!confirm("Retirer cette référence ?")) return;
  await refDelete(kind, id);
  var obj = findRefObj(kind, id);
  if (obj) {
    obj.refUri = null;
    obj.refStatus = null;
    save(); render();
  }
}

/* ═══════════════════════════════════════════════════════════
   GÉNÉRATION — PHOTO DE PLAN
   ═══════════════════════════════════════════════════════════ */
async function generatePhoto(i, j) {
  var ep = P.eps[i];
  var p = ep && ep.plans[j];
  if (!p) return;

  p.photoStatus = "busy";
  p.photoError = "";
  save(); render();

  try {
    var prompt = imagePrompt(p);
    var provider = P.imageProvider || "pollinations";
    var url = await generateImage(provider, prompt);
    p.photoUri = url;
    p.photoStatus = "done";
    p.photoError = "";
    p.videoUrl = null;
    p.videoStatus = null;
    await planPhotoStore(i, j, url);
    save(); render();
    toast("Photo plan " + p.n + " prête.");
  } catch (e) {
    p.photoStatus = "err";
    p.photoError = (e.message || "Erreur").slice(0, 140);
    save(); render();
    toast("Échec : " + p.photoError);
  }
}

async function generateAllPhotos(epNum) {
  var ep = epBy(epNum);
  if (!ep) return;
  var epIdx = P.eps.indexOf(ep);
  var todo = [];
  ep.plans.forEach(function (p, j) {
    if (!p.reserve && !p.photoUri) todo.push({ idx: j, n: p.n });
  });

  if (!todo.length) { toast("Toutes les photos sont déjà faites."); return; }
  if (!confirm("Générer " + todo.length + " photos avec " + (P.imageProvider || "pollinations") + " ?\n\nÀ ~15 secondes par photo, compte environ " + Math.ceil(todo.length * 15 / 60) + " minutes.")) return;

  var done = 0, failed = 0;
  for (var k = 0; k < todo.length; k++) {
    if (k > 0) await sleep(3400);
    toast("Photo " + (k + 1) + "/" + todo.length + "…", 1500);
    try {
      await generatePhoto(epIdx, todo[k].idx);
      var p2 = P.eps[epIdx].plans[todo[k].idx];
      if (p2.photoUri) done++; else failed++;
    } catch (e) { failed++; }
  }
  toast("Terminé : " + done + " photo(s) OK, " + failed + " échec(s).", 4000);
  render();
}

async function uploadPhoto(i, j, file) {
  if (!file || !file.type.startsWith("image/")) { toast("Ce fichier n'est pas une image."); return; }
  try {
    var uri = await fileToDataUri(file);
    if (uri.length > 500000) uri = await compressImage(uri, 768, 0.75);
    P.eps[i].plans[j].photoUri = uri;
    P.eps[i].plans[j].photoStatus = "done";
    P.eps[i].plans[j].videoUrl = null;
    P.eps[i].plans[j].videoStatus = null;
    await planPhotoStore(i, j, uri);
    save(); render();
    toast("Photo ajoutée.");
  } catch (e) { toast("Impossible de lire cette image."); }
}

async function clearPhoto(i, j) {
  if (!confirm("Retirer cette photo ? La vidéo déjà générée sera perdue.")) return;
  P.eps[i].plans[j].photoUri = null;
  P.eps[i].plans[j].photoStatus = null;
  P.eps[i].plans[j].videoUrl = null;
  P.eps[i].plans[j].videoStatus = null;
  await planPhotoDelete(i, j);
  save(); render();
}

/* ═══════════════════════════════════════════════════════════
   GÉNÉRATION — VIDÉO DE PLAN
   ═══════════════════════════════════════════════════════════ */
async function generateVideo(i, j) {
  var ep = P.eps[i];
  var p = ep && ep.plans[j];
  if (!p || !p.photoUri) { toast("Dépose d'abord une photo."); return; }
  if (!getAgnesKey()) { toast("Ajoute ta clé Agnes."); return; }

  p.videoStatus = "busy";
  p.videoMsg = "Création de la tâche…";
  p.videoError = "";
  save(); render();

  try {
    var frames = p.frames || 145;
    var prompt = videoPrompt(p);
    var id = await agnesCreateVideo(prompt, p.photoUri, p.lastFrameUri || null, frames);
    p.videoMsg = "Préparation…";
    save(); render();
    var url = await agnesPollVideo(id, function (msg) {
      var el = document.querySelector('#vv-' + i + '-' + j + ' .badge');
      if (el) el.textContent = "⏳ " + msg;
    });
    p.videoUrl = url;
    p.videoStatus = "done";
    p.videoMsg = "";
    save(); render();
    toast("Vidéo plan " + p.n + " prête.");
  } catch (e) {
    p.videoStatus = "err";
    p.videoError = /HTTP 503|HTTP 429/.test(e.message || "")
      ? "Agnes est surchargée. Attends 10-15 min puis réessaie."
      : (e.message || "Erreur").slice(0, 120);
    p.videoMsg = "";
    save(); render();
    toast("Échec : " + p.videoError);
  }
}

async function uploadLastFrame(i, j, file) {
  if (!file || !file.type.startsWith("image/")) { toast("Ce fichier n'est pas une image."); return; }
  try {
    var uri = await fileToDataUri(file);
    if (uri.length > 500000) uri = await compressImage(uri, 768, 0.75);
    P.eps[i].plans[j].lastFrameUri = uri;
    save(); render();
    toast("Image de fin ajoutée.");
  } catch (e) { toast("Impossible de lire cette image."); }
}

async function clearLastFrame(i, j) {
  P.eps[i].plans[j].lastFrameUri = null;
  save(); render();
}

/* ═══════════════════════════════════════════════════════════
   FFMPEG — ASSEMBLAGE FINAL
   ═══════════════════════════════════════════════════════════ */
var FF = { instance: null, loaded: false, loading: false };

async function ffmpegLoad() {
  if (FF.loaded) return FF.instance;
  if (FF.loading) {
    while (FF.loading) await sleep(200);
    return FF.instance;
  }
  FF.loading = true;
  try {
    var FFCls = (typeof FFmpeg !== "undefined" && FFmpeg.FFmpeg) ? FFmpeg.FFmpeg
              : (typeof FFmpegWASM !== "undefined" && FFmpegWASM.FFmpeg) ? FFmpegWASM.FFmpeg
              : null;
    if (!FFCls) throw new Error("FFmpeg non chargé (CDN inaccessible ?)");
    var ffmpeg = new FFCls();
    var baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpeg.load({
      coreURL: baseURL + "/ffmpeg-core.js",
      wasmURL: baseURL + "/ffmpeg-core.wasm"
    });
    FF.instance = ffmpeg;
    FF.loaded = true;
    console.log("✅ FFmpeg chargé");
    return ffmpeg;
  } finally {
    FF.loading = false;
  }
}

async function ffmpegConcatenate(ep, onProgress) {
  var main = ep.plans.filter(function (p) { return !p.reserve && p.videoUrl; });
  if (!main.length) throw new Error("Aucun clip à assembler.");
  if (onProgress) onProgress("Chargement de FFmpeg (30 Mo la 1ère fois)…");
  var ffmpeg = await ffmpegLoad();
  var names = [];

  for (var i = 0; i < main.length; i++) {
    var p = main[i];
    if (onProgress) onProgress("Téléchargement du clip " + (i + 1) + "/" + main.length + "…");
    var res;
    try { res = await fetch(p.videoUrl, { mode: "cors" }); }
    catch (e) { throw new Error("Clip " + (i + 1) + " inaccessible (CORS)."); }
    if (!res.ok) throw new Error("Clip " + (i + 1) + " : HTTP " + res.status);
    var buf = new Uint8Array(await res.arrayBuffer());
    if (buf.length < 1000) throw new Error("Clip " + (i + 1) + " vide.");
    var name = "plan" + String(i).padStart(3, "0") + ".mp4";
    await ffmpeg.writeFile(name, buf);
    names.push(name);
  }

  var listTxt = names.map(function (n) { return "file '" + n + "'"; }).join("\n");
  await ffmpeg.writeFile("list.txt", new TextEncoder().encode(listTxt));
  if (onProgress) onProgress("Upscale 1080×1920 et assemblage (2-5 min)…");

  var vf = "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1";

  try {
    await ffmpeg.exec([
      "-f", "concat", "-safe", "0", "-i", "list.txt",
      "-vf", vf,
      "-c:v", "libx264", "-preset", "fast", "-crf", "23",
      "-pix_fmt", "yuv420p", "-r", "30",
      "-c:a", "aac", "-b:a", "128k",
      "-movflags", "+faststart",
      "sortie.mp4"
    ]);
  } catch (e) {
    if (onProgress) onProgress("Réessai avec réencodage rapide…");
    await ffmpeg.exec([
      "-f", "concat", "-safe", "0", "-i", "list.txt",
      "-vf", vf,
      "-c:v", "libx264", "-preset", "ultrafast", "-crf", "28",
      "-pix_fmt", "yuv420p", "-r", "30",
      "-an",
      "sortie.mp4"
    ]);
  }

  var data = await ffmpeg.readFile("sortie.mp4");
  if (!data || data.length < 1000) throw new Error("Fichier final vide.");
  var blob = new Blob([data.buffer], { type: "video/mp4" });
  if (onProgress) onProgress("Terminé — 1080×1920 · " + Math.round(data.length / 1024 / 1024) + " Mo");
  return URL.createObjectURL(blob);
}

/* ═══════════════════════════════════════════════════════════
   CHAÎNE — PIPELINE AUTOMATIQUE
   ═══════════════════════════════════════════════════════════ */
function todoEps() {
  var t = [], n, e;
  for (n = 1; n <= P.nb; n++) {
    e = epBy(n);
    if (!e || !has(e.script) || !e.plans.length || !has(e.montage)) t.push(n);
  }
  return t;
}

function setSub(t) { if (R.chain) R.chain.sub = t; }
function stopCheck() {
  if (R.chain && R.chain.stop) {
    var e = new Error("stop");
    e.code = "cancelled";
    throw e;
  }
}

async function chainEpisode(n, label, options) {
  options = options || {};
  var ep = epBy(n);
  if (!ep) { P.eps.push(newEp(n)); save(); ep = epBy(n); }

  if (!has(ep.script)) {
    stopCheck();
    setSub(label + " · 1/4 script");
    await genScript(ep);
  }
  ep = epBy(n);
  if (!ep.plans.length) {
    stopCheck();
    setSub(label + " · 2/4 plans");
    await genPlans(ep);
  }
  ep = epBy(n);

  if (options.videos) {
    var epIdx = P.eps.indexOf(ep);
    var main = [];
    ep.plans.forEach(function (p, j) {
      if (!p.reserve) main.push({ idx: j, n: p.n });
    });

    for (var k = 0; k < main.length; k++) {
      stopCheck();
      ep = epBy(n);
      var j = main[k].idx;
      var p = ep.plans[j];

      if (!p.photoUri) {
        setSub(label + " · photo " + (k + 1) + "/" + main.length);
        await generatePhoto(epIdx, j);
        if (k < main.length - 1) await sleep(3400);
      }

      stopCheck();
      ep = epBy(n);
      p = ep.plans[j];
      if (!p.videoUrl) {
        setSub(label + " · vidéo " + (k + 1) + "/" + main.length + " (2 min)");
        await generateVideo(epIdx, j);
        if (k < main.length - 1) await sleep(90000);
      }
    }
  }

  ep = epBy(n);
  if (!has(ep.montage)) {
    stopCheck();
    setSub(label + " · 4/4 montage");
    await genMontage(ep);
  }
}

async function runChain(job) {
  R.chain = { sub: "", stop: false };
  try {
    await job();
    toast("Terminé. Tout est prêt.");
  } catch (e) {
    if (e && e.code === "cancelled") toast("Arrêté. Ce qui est fini est gardé.");
  }
  R.chain = null;
  R.busy = null;
  overlay();
  render();
}

async function seasonJob() {
  var todo = todoEps(), k, n;
  for (k = 0; k < todo.length; k++) {
    n = todo[k];
    stopCheck();
    if (!epBy(n)) { P.eps.push(newEp(n)); save(); }
    await chainEpisode(n, (P.nb === 1 ? "La vidéo" : "Épisode " + n + "/" + P.nb) + " (" + (k + 1) + "/" + todo.length + ")");
  }
}

function genSeason() {
  if (!todoEps().length) { toast("Tout est déjà préparé."); return; }
  runChain(seasonJob);
}
/* ═══════════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════════ */
var $view = null;

function go(tab) {
  R.tab = tab;
  R.view = "list";
  R.ep = 0;
  R.arm = "";
  render();
  window.scrollTo(0, 0);
}

function render() {
  if (!$view) $view = document.getElementById("view");
  if (!$view) return;

  var wasOpen = !!document.querySelector("#view details.acc[data-keep][open]");

  document.querySelectorAll(".dock button").forEach(function (b) {
    if (b.getAttribute("data-tab") === R.tab) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  });

  var h = "";
  if (R.tab === "brief") h = renderBrief();
  else if (R.tab === "studio") h = renderStudio();
  else if (R.tab === "production") h = renderProduction();
  else h = renderBrief();

  $view.innerHTML = h;
  if (wasOpen) {
    var dk = document.querySelector("#view details.acc[data-keep]");
    if (dk) dk.open = true;
  }
}

/* ═══════════════════════════════════════════════════════════
   HELPERS UI
   ═══════════════════════════════════════════════════════════ */
function field(path, val, rows, label, hint) {
  return '<div class="fld"><label class="q" for="b-' + path + '">' + esc(label) +
    (hint ? '<span class="q-hint">' + esc(hint) + '</span>' : '') + '</label>' +
    (rows
      ? '<textarea id="b-' + path + '" data-path="' + path + '" style="min-height:' + (rows * 24 + 30) + 'px">' + esc(val) + '</textarea>'
      : '<input type="text" id="b-' + path + '" data-path="' + path + '" value="' + esc(val) + '">') +
    '</div>';
}

function progressBar(done, total) {
  var pct = total > 0 ? Math.round(done / total * 100) : 0;
  return '<div class="progress-line"><i style="width:' + pct + '%"></i></div>';
}

/* ═══════════════════════════════════════════════════════════
   VUE BRIEF
   ═══════════════════════════════════════════════════════════ */
function renderBrief() {
  var h = '<header class="hero">' +
    '<span class="kicker">Étape 1 · Brief</span>' +
    '<h1>Nouvelle histoire</h1>' +
    '<p class="muted">Donne ton idée. Je génère le casting, les lieux et les scripts.</p>' +
    '</header>';

  /* Clé Agnes */
  var key = getAgnesKey();
  h += '<details class="glass acc" data-keep="1"><summary><div><b>🔑 Clé Agnes</b><br><span>Sert à écrire les scripts et générer les vidéos</span></div><span class="badge' + (key ? " done" : "") + '">' + (key ? "Active" : "Manquante") + '</span></summary><div class="in">' +
    '<p class="small muted">Sans clé, tu peux quand même écrire les textes toi-même et générer les images.</p>' +
    '<input type="password" id="agnes-key-input" placeholder="sk-..." value="' + esc(key) + '" autocomplete="off">' +
    '<button type="button" class="btn big" data-act="agnes-save">Enregistrer la clé</button>' +
    '<p class="small muted">Clé gratuite sur <a href="https://platform.agnes-ai.com" target="_blank" rel="noopener">platform.agnes-ai.com</a>.</p>' +
    '</div></details>';

  /* Fournisseur d'images */
    /* Info workflow images */
  h += '<details class="glass acc" data-keep="1"><summary><div><b>🎨 Comment générer les images</b><br><span>Workflow manuel : ChatGPT → app</span></div></summary><div class="in">' +
    '<p class="small">Pour chaque personnage, lieu ou plan :</p>' +
    '<ol class="small" style="margin:8px 0 8px 20px;padding:0;line-height:1.8">' +
    '<li>Clique sur <b>📋 Copier le prompt</b> dans la card</li>' +
    '<li>Colle-le dans <b>ChatGPT</b> (ou Gemini, Ideogram, Midjourney…)</li>' +
    '<li>Télécharge l\'image générée</li>' +
    '<li>Clique sur <b>📥</b> dans la card et sélectionne l\'image</li>' +
    '</ol>' +
    '<p class="small muted">L\'image est stockée dans ton navigateur. Tu ne la perds jamais.</p>' +
    '</div></details>';

  /* Format */
  h += '<section class="glass card"><h2>Format</h2>' +
    '<div class="fld"><span class="q">Nombre de vidéos</span><div class="chips">' +
    NBS.map(function (n) {
      return '<button type="button" class="chip" data-act="nb" data-v="' + n + '" aria-pressed="' + (P.nb === n) + '">' +
        (n === 1 ? "1 vidéo" : n + " épisodes") + '</button>';
    }).join("") + '</div></div>' +

    '<div class="fld"><span class="q">Durée de chaque vidéo</span><div class="chips">' +
    DUREES_TOTALES.map(function (x) {
      return '<button type="button" class="chip" data-act="duree" data-v="' + x.v + '" aria-pressed="' + (P.duree === x.v) + '">' + x.t + '</button>';
    }).join("") + '</div></div>' +
    '</section>';

  /* Idée */
  h += '<section class="glass card"><h2>Ton idée</h2>' +
    field("titre", P.titre, 0, "Titre (facultatif)") +
    field("idee", P.idee, 5, "Raconte l\'histoire en une phrase", "Ex : une laverie de quartier où chaque machine révèle un secret.") +
    '<div class="rowbtns">' +
    '<button type="button" class="btn ghost" data-act="concepts">💡 3 idées au hasard</button>' +
    '<button type="button" class="btn ghost" data-act="surprise">🎲 Surprends-moi</button>' +
    '</div>' +
    '</section>';

  /* Concepts générés */
  if (P.concepts && P.concepts.length) {
    h += renderConcepts();
  }

  /* Ambiance */
  h += '<section class="glass card"><h2>Ambiance</h2><div class="chips">' +
    AMBS.map(function (a) {
      return '<button type="button" class="chip small" data-act="amb" data-v="' + a.id + '" aria-pressed="' + ((P.ambs || []).indexOf(a.id) >= 0) + '">' + esc(a.nom) + '</button>';
    }).join("") + '</div></section>';

  /* Style visuel */
  h += '<section class="glass card"><h2>Style visuel</h2>' +
    '<div class="chips">' +
    STYLES.map(function (s) {
      var active = Array.isArray(P.style) && P.style.indexOf(s.id) >= 0;
      return '<button type="button" class="chip" data-act="style" data-v="' + s.id + '" aria-pressed="' + active + '">' +
        (s.emoji ? s.emoji + " " : "") + esc(s.nom) + '</button>';
    }).join("") + '</div>' +
    (styList().length ? '<p class="small muted">Phrase appliquée : ' + esc(phrase()) + '</p>' : '') +
    '</section>';

  /* Casting fixe */
  h += '<section class="glass card"><h2>Casting</h2><div class="opt">' +
    RECS.map(function (r) {
      return '<button type="button" class="optb" data-act="rec" data-v="' + r.id + '" aria-pressed="' + (P.rec === r.id) + '">' +
        '<b>' + esc(r.t) + '</b><span>' + esc(r.d) + '</span></button>';
    }).join("") + '</div></section>';

  /* Options avancées */
  h += '<details class="glass acc" data-keep="1"><summary><div><b>⚙️ Options avancées</b><br><span>' +
    (skinPhrase() || sousList().length > 1 || P.cam || P.effets.length || P.speech !== "A" ? "Personnalisées" : "Par défaut") +
    '</span></div></summary><div class="in">' +

    '<div class="fld"><span class="q">Teints</span><div class="chips">' +
    TEINTS.map(function (k) {
      return '<button type="button" class="chip small" data-act="teint" data-v="' + k.id + '" aria-pressed="' + ((P.teints || []).indexOf(k.id) >= 0) + '">' + esc(k.nom) + '</button>';
    }).join("") + '</div></div>' +

    '<div class="fld"><span class="q">Regard</span><div class="chips">' +
    YEUX.map(function (k) {
      var arr = Array.isArray(P.yeux) ? P.yeux : [];
      return '<button type="button" class="chip small" data-act="yeux" data-v="' + k.id + '" aria-pressed="' + (arr.indexOf(k.id) >= 0) + '">' + esc(k.nom) + '</button>';
    }).join("") + '</div></div>' +

    '<div class="fld"><span class="q">Effets visuels (max 3)</span><div class="chips">' +
    EFFETS.map(function (k) {
      return '<button type="button" class="chip small" data-act="effet" data-v="' + k.id + '" aria-pressed="' + ((P.effets || []).indexOf(k.id) >= 0) + '">' + esc(k.nom) + '</button>';
    }).join("") + '</div></div>' +

    '<div class="fld"><span class="q">Sous-titres</span><div class="chips">' +
    SOUS.map(function (k) {
      return '<button type="button" class="chip small" data-act="sous" data-v="' + k.id + '" aria-pressed="' + (sousList().indexOf(k.id) >= 0) + '">' + esc(k.nom) + '</button>';
    }).join("") + '</div></div>' +

    field("custom", P.custom, 2, "Détail de style supplémentaire") +

    '<div class="fld"><span class="q">Mode vocal</span><div class="opt">' +
    SPEECH.map(function (s) {
      return '<button type="button" class="optb" data-act="speech" data-v="' + s.id + '" aria-pressed="' + (P.speech === s.id) + '">' +
        '<b>' + esc(s.t) + '</b><span>' + esc(s.d) + '</span></button>';
    }).join("") + '</div></div>' +

    field("cible", P.cible, 2, "Public visé") +

    '</div></details>';

  /* Bouton principal */
  var ready = has(P.idee) && P.style.length > 0;
  var hasU = P.persos.length > 0 || has(P.concept);

  h += '<section class="glass card">' +
    '<button type="button" class="btn big" data-act="genuni"' + (ready ? "" : " disabled") + '>' +
    (hasU ? "🔄 Régénérer le casting et l\'univers" : "✨ Générer mon univers") +
    '</button>' +
    (ready ? '' : '<p class="small muted" style="text-align:center;margin-top:8px">Remplis ton idée et choisis un style.</p>') +
    (hasU ? '<button type="button" class="btn ghost big" data-act="tab" data-v="studio" style="margin-top:8px">Aller au Studio →</button>' : '') +
    '</section>';

  /* Sauvegarde */
  h += '<section class="glass card"><h2>Sauvegarde</h2>' +
    '<div class="rowbtns">' +
    '<button type="button" class="btn ghost" data-act="bkfile">📥 Exporter</button>' +
    '<label class="btn ghost" for="bk-file" style="cursor:pointer;display:inline-flex;align-items:center;justify-content:center">📤 Importer</label>' +
    '<input type="file" id="bk-file" accept=".json" style="position:absolute;width:1px;height:1px;opacity:0">' +
    '<button type="button" class="btn ghost" data-act="reset" style="color:var(--warn)">🗑️ Tout effacer</button>' +
    '</div></section>';

  return h;
}

function renderConcepts() {
  var h = '<section class="stack"><h2 style="font-size:1.1rem">Idées proposées</h2>';
  P.concepts.forEach(function (c, i) {
    h += '<section class="glass card"><div class="row" style="justify-content:space-between;gap:8px">' +
      '<h3 style="min-width:0">' + esc(c.titre || "Idée " + (i + 1)) + '</h3>' +
      (has(c.ambiance) ? '<span class="badge">' + esc(c.ambiance) + '</span>' : '') +
      '</div>' +
      '<p>' + esc(c.idee) + '</p>' +
      (has(c.hook) ? '<p class="small"><b>Accroche :</b> ' + esc(c.hook) + '</p>' : '') +
      (has(c.twist) ? '<p class="small"><b>Retournement :</b> ' + esc(c.twist) + '</p>' : '') +
      (has(c.chute) ? '<p class="small"><b>Fin ép. 1 :</b> ' + esc(c.chute) + '</p>' : '') +
      '<div class="rowbtns">' +
      '<button type="button" class="btn big" data-act="pickconcept" data-v="' + i + '">Choisir</button>' +
      '<button type="button" class="del" data-act="dropconcept" data-v="' + i + '">Écarter</button>' +
      '</div></section>';
  });
  h += '</section>';
  return h;
}

/* ═══════════════════════════════════════════════════════════
   VUE STUDIO
   ═══════════════════════════════════════════════════════════ */
function renderStudio() {
  if (!P.persos.length && !P.lieux.length && !has(P.concept)) {
    return '<header class="hero">' +
      '<span class="kicker">Étape 2 · Studio</span>' +
      '<h1>Studio</h1>' +
      '<p class="muted">Commence par le Brief pour générer ton univers.</p>' +
      '</header>' +
      '<section class="glass empty">' +
      '<h2>Aucun univers</h2>' +
      '<p class="muted">Retourne au Brief et génère ton univers.</p>' +
      '<button type="button" class="btn" data-act="tab" data-v="brief">← Aller au Brief</button>' +
      '</section>';
  }

  var h = '<header class="hero">' +
    '<span class="kicker">Étape 2 · Studio</span>' +
    '<h1>' + esc(P.titre || "Studio") + '</h1>' +
    '<p class="muted">Génère les références, les photos de plans, puis les vidéos.</p>' +
    '</header>';

  /* Stats globales */
  var totalRefs = P.persos.length + P.lieux.length;
  var doneRefs = P.persos.filter(function (p) { return p.refUri; }).length +
                 P.lieux.filter(function (l) { return l.refUri; }).length;
  var totalPlans = 0, donePlans = 0;
  P.eps.forEach(function (e) {
    (e.plans || []).forEach(function (p) {
      if (!p.reserve) {
        totalPlans++;
        if (p.videoUrl) donePlans++;
      }
    });
  });

  h += '<section class="glass card">' +
    '<div class="row" style="justify-content:space-between">' +
    '<b>Progression globale</b>' +
    '<span class="badge">' + (doneRefs + donePlans) + "/" + (totalRefs + totalPlans) + '</span>' +
    '</div>' +
    progressBar(doneRefs + donePlans, totalRefs + totalPlans) +
    '</section>';

  /* Section 1 — Casting */
  h += '<section class="stack"><div class="row" style="justify-content:space-between;align-items:baseline">' +
    '<h2>1. Casting et lieux</h2>' +
    '<span class="badge' + (doneRefs === totalRefs && totalRefs > 0 ? " done" : "") + '">' + doneRefs + "/" + totalRefs + '</span>' +
    '</div>' +

    '<div class="rowbtns">' +
    '<button type="button" class="btn" data-act="genall-refs"' + (totalRefs === 0 ? " disabled" : "") + '>🎨 Tout générer</button>' +
    '</div>' +

    '<div class="grid-cards">' +
    P.persos.map(function (p, i) { return cardRef("perso", p, i); }).join("") +
    P.lieux.map(function (l, i) { return cardRef("lieu", l, i); }).join("") +
    '</div>' +
    '</section>';

  /* Section 2 — Épisodes */
  h += '<section class="stack"><div class="row" style="justify-content:space-between;align-items:baseline">' +
    '<h2>2. Épisodes</h2>' +
    '<span class="badge">' + donePlans + "/" + totalPlans + ' plans</span>' +
    '</div>';

  if (!P.eps.length) {
    h += '<section class="glass empty">' +
      '<p class="muted">Aucun épisode pour l\'instant.</p>' +
      '<button type="button" class="btn big" data-act="newep">🎬 Créer le premier épisode</button>' +
      '</section>';
  } else {
    P.eps.forEach(function (e) {
      h += renderEpisodeCard(e);
    });
    if (P.eps.length < P.nb) {
      h += '<button type="button" class="btn ghost big" data-act="newep">+ Créer épisode ' + (P.eps.length + 1) + '</button>';
    }
  }
  h += '</section>';

  return h;
}

function cardRef(kind, obj, idx) {
  var hasUri = !!obj.refUri;
  var cls = "card-asset";
  if (obj.refStatus === "busy") cls += " busy";
  if (obj.refStatus === "err") cls += " err";

  var thumb = hasUri
    ? '<img class="thumb" src="' + esc(obj.refUri) + '" alt="">'
    : '<div class="thumb" style="display:grid;place-items:center;font-size:2rem">' +
      (kind === "lieu" ? "🏠" : "👤") + '</div>';

  var promptId = "ref-prompt-" + kind + "-" + idx;
  var promptText = refPrompt(kind, obj.visuel);

  var actions = "";
  if (obj.refStatus === "busy") {
    actions = '<button type="button" disabled>⏳</button>';
  } else if (hasUri) {
    actions =
      '<button type="button" data-act="copy-ref-prompt" data-kind="' + kind + '" data-id="' + esc(obj.id) + '" title="Copier le prompt">📋</button>' +
      '<button type="button" data-act="ref-upload" data-kind="' + kind + '" data-id="' + esc(obj.id) + '" title="Remplacer l\'image">📥</button>' +
      '<button type="button" data-act="ref-clear" data-kind="' + kind + '" data-id="' + esc(obj.id) + '" title="Retirer">🗑️</button>';
  } else {
    actions =
      '<button type="button" data-act="copy-ref-prompt" data-kind="' + kind + '" data-id="' + esc(obj.id) + '" title="Copier le prompt">📋</button>' +
      '<button type="button" data-act="ref-upload" data-kind="' + kind + '" data-id="' + esc(obj.id) + '" title="Uploader l\'image">📥</button>';
  }

  return '<div class="' + cls + '">' + thumb +
    '<div class="info">' +
    '<b>' + esc(obj.nom || "Sans nom") + '</b>' +
    '<span>' + (kind === "lieu" ? "Lieu" : "Personnage") + '</span>' +
    '</div>' +
    '<div class="actions">' + actions + '</div>' +
    '<div style="display:none" id="' + promptId + '">' + esc(promptText) + '</div>' +
    '</div>';
}

function renderEpisodeCard(ep) {
  var main = ep.plans.filter(function (p) { return !p.reserve; });
  var done = main.filter(function (p) { return p.videoUrl; }).length;
  var total = main.length;

  var h = '<details class="glass acc"><summary>' +
    '<div><b>Épisode ' + ep.n + (ep.titre ? " · " + esc(ep.titre) : "") + '</b><br>' +
    '<span>' + (has(ep.script) ? "Script OK" : "Script à faire") + ' · ' +
    (total ? done + "/" + total + " clips" : "plans à créer") + '</span></div>' +
    '<span class="badge' + (done === total && total > 0 ? " done" : "") + '">' +
    (done === total && total > 0 ? "Prêt" : (total ? done + "/" + total : "0/0")) +
    '</span></summary><div class="in">';

  h += '<div class="rowbtns">' +
    '<button type="button" class="btn big" data-act="genep" data-v="' + ep.n + '">🎬 Générer l\'épisode complet</button>' +
    '<button type="button" class="btn ghost" data-act="openep" data-v="' + ep.n + '">Détails</button>' +
    '</div>';

  if (has(ep.resume)) h += '<p class="small muted">' + esc(ep.resume) + '</p>';

  h += '</div></details>';
  return h;
}

/* ═══════════════════════════════════════════════════════════
   VUE PRODUCTION
   ═══════════════════════════════════════════════════════════ */
function renderProduction() {
  var totalClips = 0, doneClips = 0, finalVideos = 0;
  P.eps.forEach(function (e) {
    (e.plans || []).forEach(function (p) {
      if (!p.reserve) {
        totalClips++;
        if (p.videoUrl) doneClips++;
      }
    });
    if (e.finalVideoUrl) finalVideos++;
  });

  var h = '<header class="hero">' +
    '<span class="kicker">Étape 3 · Production</span>' +
    '<h1>Assembler et publier</h1>' +
    '<p class="muted">' + doneClips + " clips prêts sur " + totalClips + "</p>" +
    '</header>';

  if (!totalClips) {
    return h + '<section class="glass empty">' +
      '<h2>Aucun clip</h2>' +
      '<p class="muted">Génère d\'abord les vidéos dans le Studio.</p>' +
      '<button type="button" class="btn" data-act="tab" data-v="studio">← Aller au Studio</button>' +
      '</section>';
  }

  /* Épisodes avec leurs statuts */
  P.eps.forEach(function (ep) {
    var main = ep.plans.filter(function (p) { return !p.reserve; });
    var done = main.filter(function (p) { return p.videoUrl; }).length;

    h += '<section class="glass card">' +
      '<div class="row" style="justify-content:space-between">' +
      '<h2>Épisode ' + ep.n + (ep.titre ? " · " + esc(ep.titre) : "") + '</h2>' +
      '<span class="badge' + (done === main.length && main.length > 0 ? " done" : "") + '">' + done + "/" + main.length + '</span>' +
      '</div>' +
      progressBar(done, main.length);

    if (ep.finalVideoUrl) {
      h += '<div class="plan-thumb" style="margin-top:12px">' +
        '<video src="' + esc(ep.finalVideoUrl) + '" controls playsinline></video>' +
        '<div class="bar">' +
        '<a class="btn ghost" href="' + esc(ep.finalVideoUrl) + '" download="episode-' + ep.n + '.mp4" target="_blank" rel="noopener">⬇ Télécharger</a>' +
        '</div></div>';
    } else {
      h += '<div class="rowbtns" style="margin-top:12px">' +
        '<button type="button" class="btn" data-act="assemble" data-v="' + ep.n + '"' + (done >= 2 ? "" : " disabled") + '>🎬 Assembler</button>' +
        (has(ep.montage) ? '<button type="button" class="btn ghost" data-act="montview" data-v="' + ep.n + '">📄 Voir le plan de montage</button>' : '') +
        '</div>';
    }
    h += '</section>';
  });

  /* Conseils publication */
  h += '<section class="glass card"><h2>📱 Publier sur TikTok</h2>' +
    '<p class="small muted">Une fois la vidéo assemblée, tu peux la télécharger et la publier.</p>' +
    '<div class="rowbtns">' +
    '<button type="button" class="btn ghost" data-act="bkfile">📥 Sauvegarde complète</button>' +
    '<button type="button" class="btn ghost" data-act="reset" style="color:var(--warn)">🗑️ Recommencer</button>' +
    '</div></section>';

  return h;
}
function triggerFileInput(callback, accept) {
  var input = document.createElement("input");
  input.type = "file";
  input.accept = accept || "image/*";
  input.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
  input.onchange = function () {
    if (input.files && input.files[0]) callback(input.files[0]);
    setTimeout(function () { input.remove(); }, 500);
  };
  document.body.appendChild(input);
  input.click();
}
/* ═══════════════════════════════════════════════════════════
   REDÉFINITION STUDIO — Vue épisode détaillée
   ═══════════════════════════════════════════════════════════ */
function renderStudio() {
  if (!P.persos.length && !P.lieux.length && !has(P.concept)) {
    return '<header class="hero">' +
      '<span class="kicker">Étape 2 · Studio</span>' +
      '<h1>Studio</h1>' +
      '<p class="muted">Commence par le Brief pour générer ton univers.</p>' +
      '</header>' +
      '<section class="glass empty">' +
      '<h2>Aucun univers</h2>' +
      '<p class="muted">Retourne au Brief et génère ton univers.</p>' +
      '<button type="button" class="btn" data-act="tab" data-v="brief">← Aller au Brief</button>' +
      '</section>';
  }

  /* Si on a un épisode ouvert */
  if (R.ep && epBy(R.ep)) {
    return renderEpisodeDetail(epBy(R.ep));
  }

  var h = '<header class="hero">' +
    '<span class="kicker">Étape 2 · Studio</span>' +
    '<h1>' + esc(P.titre || "Studio") + '</h1>' +
    '<p class="muted">Génère les références, les photos de plans, puis les vidéos.</p>' +
    '</header>';

  /* Stats globales */
  var totalRefs = P.persos.length + P.lieux.length;
  var doneRefs = P.persos.filter(function (p) { return p.refUri; }).length +
                 P.lieux.filter(function (l) { return l.refUri; }).length;
  var totalPlans = 0, donePlans = 0;
  P.eps.forEach(function (e) {
    (e.plans || []).forEach(function (p) {
      if (!p.reserve) {
        totalPlans++;
        if (p.videoUrl) donePlans++;
      }
    });
  });

  h += '<section class="glass card">' +
    '<div class="row" style="justify-content:space-between">' +
    '<b>Progression globale</b>' +
    '<span class="badge">' + (doneRefs + donePlans) + "/" + (totalRefs + totalPlans) + '</span>' +
    '</div>' +
    progressBar(doneRefs + donePlans, totalRefs + totalPlans) +
    '</section>';

  /* Section 1 — Casting */
  h += '<section class="stack"><div class="row" style="justify-content:space-between;align-items:baseline">' +
    '<h2>1. Casting et lieux</h2>' +
    '<span class="badge' + (doneRefs === totalRefs && totalRefs > 0 ? " done" : "") + '">' + doneRefs + "/" + totalRefs + '</span>' +
    '</div>' +

    '<div class="rowbtns">' +
    '<button type="button" class="btn" data-act="genall-refs"' + (totalRefs === 0 ? " disabled" : "") + '>🎨 Tout générer</button>' +
    '</div>' +

    '<div class="grid-cards">' +
    P.persos.map(function (p) { return cardRef("perso", p); }).join("") +
    P.lieux.map(function (l) { return cardRef("lieu", l); }).join("") +
    '</div>' +
    '</section>';

  /* Section 2 — Épisodes */
  h += '<section class="stack"><div class="row" style="justify-content:space-between;align-items:baseline">' +
    '<h2>2. Épisodes</h2>' +
    '<span class="badge">' + donePlans + "/" + totalPlans + ' plans</span>' +
    '</div>';

  if (!P.eps.length) {
    h += '<section class="glass empty">' +
      '<p class="muted">Aucun épisode pour l\'instant.</p>' +
      '<button type="button" class="btn big" data-act="newep">🎬 Créer le premier épisode</button>' +
      '</section>';
  } else {
    P.eps.forEach(function (e) {
      h += renderEpisodeCard(e);
    });
    if (P.eps.length < P.nb) {
      h += '<button type="button" class="btn ghost big" data-act="newep">+ Créer épisode ' + (P.eps.length + 1) + '</button>';
    }
  }
  h += '</section>';

  return h;
}

function renderEpisodeCard(ep) {
  var main = ep.plans.filter(function (p) { return !p.reserve; });
  var done = main.filter(function (p) { return p.videoUrl; }).length;
  var total = main.length;
  var photos = main.filter(function (p) { return p.photoUri; }).length;

  var h = '<section class="glass card">' +
    '<div class="row" style="justify-content:space-between;align-items:baseline">' +
    '<h3>Épisode ' + ep.n + (ep.titre ? " · " + esc(ep.titre) : "") + '</h3>' +
    '<span class="badge' + (done === total && total > 0 ? " done" : "") + '">' +
    (done === total && total > 0 ? "✓ Prêt" : (total ? done + "/" + total : "0/0")) +
    '</span></div>' +
    progressBar(done, total || 1) +
    '<div class="row" style="gap:12px;margin-top:8px">' +
    '<span class="small muted">📝 ' + (has(ep.script) ? "Script OK" : "Script à faire") + '</span>' +
    '<span class="small muted">📷 ' + photos + " photo" + (photos > 1 ? "s" : "") + '</span>' +
    '<span class="small muted">🎬 ' + done + " clip" + (done > 1 ? "s" : "") + '</span>' +
    '</div>' +
    '<div class="rowbtns" style="margin-top:12px">' +
    '<button type="button" class="btn" data-act="openep" data-v="' + ep.n + '">📂 Ouvrir</button>' +
    (has(ep.script) && ep.plans.length ? '<button type="button" class="btn ghost" data-act="genep" data-v="' + ep.n + '">🎬 Tout générer</button>' : '') +
    '</div>' +
    '</section>';
  return h;
}

function renderEpisodeDetail(ep) {
  var i = P.eps.indexOf(ep);
  var main = ep.plans.filter(function (p) { return !p.reserve; });
  var done = main.filter(function (p) { return p.videoUrl; }).length;

  var h = '<button type="button" class="back" data-act="closeep">← Retour au Studio</button>' +
    '<header class="hero">' +
    '<span class="kicker">Épisode ' + ep.n + '</span>' +
    '<h1>' + esc(ep.titre || ("Épisode " + ep.n)) + '</h1>' +
    '<p class="muted">' + done + " clips prêts sur " + main.length + '</p>' +
    '</header>';

  /* Actions globales */
  h += '<section class="glass card"><div class="rowbtns">' +
    (has(ep.script) ? '' : '<button type="button" class="btn big" data-act="genscript" data-v="' + ep.n + '">📝 Écrire le script</button>') +
    (has(ep.script) && !ep.plans.length ? '<button type="button" class="btn big" data-act="genplans" data-v="' + ep.n + '">🎞️ Découper en plans</button>' : '') +
    (ep.plans.length ? '<button type="button" class="btn" data-act="genphotos" data-v="' + ep.n + '">🎨 Toutes les photos</button>' : '') +
    (ep.plans.length ? '<button type="button" class="btn ghost" data-act="genep" data-v="' + ep.n + '">🎬 Tout générer</button>' : '') +
    '</div>';

  /* Script aperçu */
  if (has(ep.script)) {
    h += '<details class="acc"><summary><div><b>📝 Script</b><br><span>' + ep.script.split("\n").length + ' lignes</span></div></summary><div class="in">' +
      '<pre class="fin" style="max-height:400px;overflow:auto">' + esc(ep.script) + '</pre>' +
      (has(ep.resume) ? '<p class="small"><b>Résumé :</b> ' + esc(ep.resume) + '</p>' : '') +
      '</div></details>';
  }
  h += '</section>';

  /* Grille des plans */
  if (ep.plans.length) {
    h += '<section class="stack"><h2>' + ep.plans.length + ' plans</h2>' +
      '<div class="grid-cards">' +
      ep.plans.map(function (p, j) { return cardPlan(i, j, p); }).join("") +
      '</div></section>';
  }

  return h;
}

function cardPlan(epIdx, planIdx, p) {
  var cls = "card-asset";
  if (p.videoStatus === "busy" || p.photoStatus === "busy") cls += " busy";
  if (p.videoStatus === "err" || p.photoStatus === "err") cls += " err";

  var thumb = "";
  if (p.videoUrl) {
    thumb = '<video class="thumb" src="' + esc(p.videoUrl) + '" muted playsinline preload="metadata"></video>';
  } else if (p.photoUri) {
    thumb = '<img class="thumb" src="' + esc(p.photoUri) + '" alt="">';
  } else {
    thumb = '<div class="thumb" style="display:grid;place-items:center;font-size:1.6rem">' + (p.reserve ? "🔒" : "🎬") + '</div>';
  }

  var badge = p.reserve ? "Réserve" :
    (p.videoUrl ? "✓ Clip" : (p.photoUri ? "Photo" : "À faire"));

  var actions = "";
  if (p.reserve) {
    actions = '<button type="button" disabled>Réserve</button>';
  } else if (p.videoStatus === "busy") {
    actions = '<button type="button" disabled>⏳ Vidéo…</button>';
  } else if (p.photoStatus === "busy") {
    actions = '<button type="button" disabled>⏳ Photo…</button>';
  } else if (p.videoUrl) {
    actions =
      '<button type="button" data-act="plan-video-regen" data-i="' + epIdx + '" data-j="' + planIdx + '">🔄</button>' +
      '<a href="' + esc(p.videoUrl) + '" download="plan-' + p.n + '.mp4" target="_blank" rel="noopener">⬇</a>';
  } else if (p.photoUri) {
    actions =
      '<button type="button" data-act="copy-plan-prompt" data-i="' + epIdx + '" data-j="' + planIdx + '" title="Copier le prompt">📋</button>' +
      '<button type="button" data-act="plan-video" data-i="' + epIdx + '" data-j="' + planIdx + '" title="Générer la vidéo">🎬</button>' +
      '<button type="button" data-act="plan-photo-upload" data-i="' + epIdx + '" data-j="' + planIdx + '" title="Remplacer">📥</button>';
  } else {
    actions =
      '<button type="button" data-act="copy-plan-prompt" data-i="' + epIdx + '" data-j="' + planIdx + '" title="Copier le prompt">📋</button>' +
      '<button type="button" data-act="plan-photo-upload" data-i="' + epIdx + '" data-j="' + planIdx + '" title="Uploader la photo">📥</button>';
  }

  return '<div class="' + cls + '">' + thumb +
    '<div class="info">' +
    '<b>Plan ' + p.n + ' · ' + (p.duree || 6) + 's</b>' +
    '<span>' + esc(badge) + (p.lieu ? " · " + esc(p.lieu) : "") + '</span>' +
    '</div>' +
    '<div class="actions">' + actions + '</div>' +
    '</div>';
}
/* ═══════════════════════════════════════════════════════════
   HELPER — Input de fichier dynamique
   ═══════════════════════════════════════════════════════════ */
function triggerFileInput(callback) {
  var input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
  input.onchange = function () {
    if (input.files && input.files[0]) callback(input.files[0]);
    setTimeout(function () {
      if (input.parentNode) input.parentNode.removeChild(input);
    }, 500);
  };
  document.body.appendChild(input);
  input.click();
}

/* ═══════════════════════════════════════════════════════════
   ÉVÉNEMENTS — CLIC
   ═══════════════════════════════════════════════════════════ */
function arm(key, msg) {
  if (R.arm === key) { R.arm = ""; return true; }
  R.arm = key;
  toast(msg || "Touche encore pour confirmer.");
  setTimeout(function () { if (R.arm === key) R.arm = ""; }, 4000);
  return false;
}

document.addEventListener("click", function (e) {
  var b = e.target.closest("[data-act]");
  if (!b) return;
  var a = b.getAttribute("data-act");
  var v = b.getAttribute("data-v");
  if (!a) return;

  /* Stop pipeline */
  if (a === "stop") {
    if (R.chain) R.chain.stop = true;
    R.busy = null;
    overlay();
    return;
  }

  /* Navigation */
  if (a === "tab") { go(v); return; }
  if (a === "set-provider") {
    P.imageProvider = v;
    save();
    render();
    return;
  }
     if (a === "poll-save") { savePollinationsKey(); render(); return; }

  if (a === "cf-save") { saveCloudflareKeys(); render(); return; }
  if (a === "hf-save") { saveHuggingFaceKeys(); render(); return; }

  /* Clé Agnes */
  if (a === "agnes-save") { saveAgnesKey(); render(); return; }

  /* Brief */
  if (a === "nb") { P.nb = +v; save(); render(); return; }
  if (a === "duree") { P.duree = +v; save(); render(); return; }
  if (a === "rec") { P.rec = v; save(); render(); return; }
  if (a === "speech") { P.speech = v; save(); render(); return; }
  if (a === "amb") {
    if (!P.ambs) P.ambs = [];
    var ai = P.ambs.indexOf(v);
    if (ai >= 0) P.ambs.splice(ai, 1);
    else P.ambs.push(v);
    save(); render(); return;
  }
  if (a === "style") {
    if (!Array.isArray(P.style)) P.style = [];
    var si = P.style.indexOf(v);
    if (si >= 0) P.style.splice(si, 1);
    else if (P.style.length >= MAX_STYLES) { toast("Max " + MAX_STYLES + " styles."); return; }
    else P.style.push(v);
    save(); render(); return;
  }
  if (a === "teint") {
    if (!P.teints) P.teints = [];
    var ti = P.teints.indexOf(v);
    if (ti >= 0) P.teints.splice(ti, 1);
    else P.teints.push(v);
    save(); render(); return;
  }
  if (a === "yeux") {
    if (!Array.isArray(P.yeux)) P.yeux = [];
    var yi = P.yeux.indexOf(v);
    if (yi >= 0) P.yeux.splice(yi, 1);
    else P.yeux.push(v);
    save(); render(); return;
  }
  if (a === "effet") {
    if (!P.effets) P.effets = [];
    var ei = P.effets.indexOf(v);
    if (ei >= 0) P.effets.splice(ei, 1);
    else if (P.effets.length >= 3) { toast("Max 3 effets."); return; }
    else P.effets.push(v);
    save(); render(); return;
  }
  if (a === "sous") {
    var sl = sousList();
    var ssi = sl.indexOf(v);
    if (ssi >= 0) sl.splice(ssi, 1);
    else sl.push(v);
    P.sous = sl.length ? sl : ["U1"];
    save(); render(); return;
  }

  /* Concepts */
  if (a === "concepts") { genConcepts(); return; }
  if (a === "surprise") { genConcepts({ surprise: true }); return; }
  if (a === "moreconcepts") { genConcepts({ more: true }); return; }
  if (a === "dropconcept") { P.concepts.splice(+v, 1); save(); render(); return; }
  if (a === "pickconcept") {
    var cc = P.concepts[+v];
    if (cc) {
      P.idee = cc.idee +
        (has(cc.hook) ? "\nAccroche : " + cc.hook : "") +
        (has(cc.twist) ? "\nRetournement : " + cc.twist : "") +
        (has(cc.chute) ? "\nFin ép. 1 : " + cc.chute : "");
      if (has(cc.titre)) P.titre = cc.titre;
      save();
      toast("Idée choisie. Choisis un style puis génère l'univers.");
      render();
    }
    return;
  }

  /* Générer univers */
  if (a === "genuni") {
    if (P.persos.length && !arm("uni", "Touche encore : tout sera remplacé.")) return;
    genUnivers();
    return;
  }

  /* Références */
  if (a === "genall-refs") { generateAllRefs(); return; }
  if (a === "ref-gen" || a === "ref-regen") {
    var kind = b.getAttribute("data-kind");
    var rid = b.getAttribute("data-id");
    if (kind && rid) generateRef(kind, rid);
    return;
  }
     if (a === "copy-ref-prompt") {
    var ck = b.getAttribute("data-kind");
    var cid = b.getAttribute("data-id");
    var obj = findRefObj(ck, cid);
    if (obj) {
      var p = refPrompt(ck, obj.visuel);
      copyAll(p, "Prompt copié. Colle-le dans ChatGPT.");
    }
    return;
  }

  if (a === "ref-upload") {
    var kindU = b.getAttribute("data-kind");
    var ridU = b.getAttribute("data-id");
    if (kindU && ridU) {
      triggerFileInput(function (file) { uploadRef(kindU, ridU, file); });
    }
    return;
  }
  if (a === "ref-clear") {
    var kindC = b.getAttribute("data-kind");
    var ridC = b.getAttribute("data-id");
    if (kindC && ridC) clearRef(kindC, ridC);
    return;
  }

  /* Épisodes */
  if (a === "newep") {
    var n = P.eps.length + 1;
    P.eps.push(newEp(n));
    save();
    R.ep = n;
    render();
    return;
  }
  if (a === "openep") {
    R.ep = +v;
    render();
    window.scrollTo(0, 0);
    return;
  }
  if (a === "closeep") {
    R.ep = 0;
    render();
    window.scrollTo(0, 0);
    return;
  }
  if (a === "genscript") {
    var epS = epBy(+v);
    if (epS) genScript(epS);
    return;
  }
  if (a === "genplans") {
    var epP = epBy(+v);
    if (epP) genPlans(epP);
    return;
  }
  if (a === "genphotos") {
    var epPh = epBy(+v);
    if (epPh) generateAllPhotos(epPh.n);
    return;
  }
  if (a === "genep") {
    var epG = epBy(+v);
    if (!epG) return;
    if (!confirm("Générer l'épisode complet ?\n\nScript → plans → photos → vidéos → montage.\nCela peut prendre 20 à 40 minutes.")) return;
    runChain(function () {
      return chainEpisode(epG.n, "Épisode " + epG.n, { videos: true });
    });
    return;
  }

  /* Plans */
     if (a === "copy-plan-prompt") {
    var ci = +b.getAttribute("data-i");
    var cj = +b.getAttribute("data-j");
    var ep = P.eps[ci];
    var pl = ep && ep.plans[cj];
    if (pl) {
      var prompt = imagePrompt(pl);
      copyAll(prompt, "Prompt image copié. Colle-le dans ChatGPT.");
    }
    return;
  }

  if (a === "plan-photo") { generatePhoto(+b.getAttribute("data-i"), +b.getAttribute("data-j")); return; }
  if (a === "plan-photo-regen") { generatePhoto(+b.getAttribute("data-i"), +b.getAttribute("data-j")); return; }
  if (a === "plan-photo-upload") {
    var pi = +b.getAttribute("data-i");
    var pj = +b.getAttribute("data-j");
    triggerFileInput(function (file) { uploadPhoto(pi, pj, file); });
    return;
  }
  if (a === "plan-video" || a === "plan-video-regen") {
    generateVideo(+b.getAttribute("data-i"), +b.getAttribute("data-j"));
    return;
  }

  /* Production */
  if (a === "assemble") {
    var epA = epBy(+v);
    if (!epA) return;
    epA.finalVideoStatus = "busy";
    epA.finalVideoError = "Préparation…";
    save(); render();
    (async function () {
      try {
        var url = await ffmpegConcatenate(epA, function (msg) {
          epA.finalVideoError = msg;
          save();
        });
        epA.finalVideoUrl = url;
        epA.finalVideoStatus = "done";
        epA.finalVideoError = "";
        save(); render();
        toast("Vidéo assemblée.");
      } catch (err) {
        epA.finalVideoStatus = "err";
        epA.finalVideoError = (err.message || "").slice(0, 120);
        save(); render();
        toast("Échec : " + epA.finalVideoError);
      }
    })();
    return;
  }
  if (a === "montview") {
    var epM = epBy(+v);
    if (epM && has(epM.montage)) {
      alert(epM.montage);
    }
    return;
  }

  /* Sauvegarde */
  if (a === "bkfile") {
    var data = JSON.stringify(P, null, 1);
    var blob = new Blob([data], { type: "application/json" });
    var a2 = document.createElement("a");
    a2.href = URL.createObjectURL(blob);
    a2.download = "fabrique-sauvegarde.json";
    document.body.appendChild(a2);
    a2.click();
    document.body.removeChild(a2);
    toast("Sauvegarde téléchargée.");
    return;
  }
  if (a === "reset") {
    if (arm("reset", "Touche encore : TOUT sera effacé.")) {
      (async function () {
        try {
          if (typeof idbKeyval !== "undefined") {
            var keys = await idbKeyval.keys();
            for (var i = 0; i < keys.length; i++) {
              var k = String(keys[i]);
              if (k.indexOf("plan-photo-") === 0 || k.indexOf("ref-") === 0) {
                await idbKeyval.del(k);
              }
            }
          }
        } catch (e) {}
        P = fresh();
        save();
        R.ep = 0;
        go("brief");
        toast("Tout est effacé.");
      })();
    }
    return;
  }
});

/* ═══════════════════════════════════════════════════════════
   ÉVÉNEMENTS — SAISIE
   ═══════════════════════════════════════════════════════════ */
document.addEventListener("input", function (e) {
  var el = e.target;
  if (el.hasAttribute && el.hasAttribute("data-path")) {
    setPath(P, el.getAttribute("data-path"), el.value);
    save();
  }
});

/* ═══════════════════════════════════════════════════════════
   ÉVÉNEMENTS — CHANGEMENT (fichiers)
   ═══════════════════════════════════════════════════════════ */
document.addEventListener("change", function (e) {
  var t = e.target;
  if (t.id === "bk-file") {
    var f = t.files && t.files[0];
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function (ev) {
      try {
        var d = JSON.parse(ev.target.result);
        var f2 = fresh();
        P = f2;
        for (var k in f2) P[k] = d[k] !== undefined ? d[k] : f2[k];
        fixState();
        save();
        R.ep = 0;
        render();
        toast("Sauvegarde ouverte.");
      } catch (err) { toast("Fichier invalide."); }
    };
    rd.readAsText(f);
    t.value = "";
  }
});

/* ═══════════════════════════════════════════════════════════
   DOCK
   ═══════════════════════════════════════════════════════════ */
document.querySelectorAll(".dock button").forEach(function (b) {
  b.addEventListener("click", function () {
    go(b.getAttribute("data-tab"));
  });
});

/* ============================================================
   INITIALISATION
   ============================================================ */
load();
$view = document.getElementById("view");
render();
setTimeout(planPhotosRestore, 800);
setTimeout(refsRestoreAll, 900);
