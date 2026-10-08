"use strict";
/* ============================================================
   FABRIQUE DE SÉRIES · app.js
   Instructions à Agnes en ANGLAIS · Interface et contenu en FRANÇAIS
   ============================================================ */

var AGNES_API = "https://apihub.agnes-ai.com/v1";
var AGNES_POLL = "https://apihub.agnes-ai.com/agnesapi";
var AGNES_TEXT_MODEL = "agnes-2.5-flash";
var AGNES_VIDEO_MODEL = "agnes-video-2.5-flash";
var AGNES_FPS = 24;

var STYLES = [];
var GROUPS = [];
var GMAP = {};
if (typeof STYLES_LIBRARY !== "undefined" && STYLES_LIBRARY) {
  var _catIdx = 0;
  Object.keys(STYLES_LIBRARY).forEach(function (cat) {
    GROUPS.push(cat);
    STYLES_LIBRARY[cat].forEach(function (s) {
      STYLES.push({ id: s.id, nom: s.nom, emoji: s.emoji, phrase: s.phrase, voit: "Style " + s.nom + ".", ideal: "À toi de voir.", diff: "Moyenne", g: _catIdx });
      GMAP[s.id] = _catIdx;
    });
    _catIdx++;
  });
  console.log("styles.js chargé : " + STYLES.length + " styles dans " + GROUPS.length + " catégories");
} else {
  console.warn("styles.js non chargé.");
}

var SKINS = [];

var TEINTS = [
  { id:"T1", nom:"Très clair", p:"very fair skin with a pink undertone" },
  { id:"T2", nom:"Clair beige", p:"light beige skin with a neutral undertone" },
  { id:"T4", nom:"Hâlé doré", p:"golden tan skin" },
  { id:"T6", nom:"Brun moyen", p:"medium brown skin with a warm undertone" },
  { id:"T7", nom:"Brun profond", p:"deep brown skin with a warm undertone" },
  { id:"T8", nom:"Ébène", p:"deep ebony skin with a cool blue undertone" }
];

var YEUX = [
  { id:"Y1", nom:"Grands yeux ronds brillants", p:"big round glossy expressive eyes" },
  { id:"Y2", nom:"Paupières mi-closes, blasé", p:"half-lidded bored eyes, unimpressed look" },
  { id:"Y4", nom:"Yeux écarquillés (choc)", p:"cartoonishly wide white oval eyes when shocked" },
  { id:"Y5", nom:"Yeux en amande maquillés", p:"almond-shaped eyes with bold winged eyeliner and long lashes" },
  { id:"Y6", nom:"Yeux pétillants et rieurs", p:"sparkling crinkled smiling eyes" },
  { id:"Y8", nom:"Sourcils très expressifs", p:"very expressive eyebrows, one eyebrow often raised" }
];

var EFFETS = [
  { id:"E1", g:"Lumière", nom:"Heure dorée", p:"warm golden hour light" },
  { id:"E2", g:"Lumière", nom:"Fenêtre douce", p:"soft natural window light" },
  { id:"E5", g:"Lumière", nom:"Néons violet et rose", p:"purple and pink neon lighting" },
  { id:"E6", g:"Lumière", nom:"Deux couleurs magenta et orange", p:"dramatic magenta and orange split lighting" },
  { id:"E8", g:"Lumière", nom:"Soirée luxe", p:"luxury party lighting, chandeliers, golden bokeh" },
  { id:"E11", g:"Image", nom:"Arrière-plan flou", p:"shallow depth of field, blurred background" },
  { id:"E12", g:"Image", nom:"Grain de pellicule", p:"fine film grain" },
  { id:"E16", g:"Image", nom:"Pluie", p:"rain drops and wet reflections" },
  { id:"E17", g:"Image", nom:"Effet VHS", p:"retro VHS look, slight scan lines" },
  { id:"E20", g:"Couleur", nom:"Pastel doux", p:"soft pastel color grade" },
  { id:"E34", g:"Couleur", nom:"Orange et bleu canard", p:"teal and orange color grade" },
  { id:"E42", g:"Couleur", nom:"Noir et blanc profond", p:"rich black and white" }
];

var CAMS = [
  { id:"C1", nom:"Caméra fixe", p:"Static locked camera." },
  { id:"C2", nom:"Travelling avant lent", p:"Slow push in toward the subject." },
  { id:"C3", nom:"Caméra à l'épaule", p:"Subtle handheld camera movement." },
  { id:"C6", nom:"Orbite autour du personnage", p:"Slow orbit around the character." },
  { id:"C8", nom:"Très gros plan visage", p:"Extreme close-up on the face, eyes and mouth fill the frame." },
  { id:"C11", nom:"Selfie à bout de bras", p:"Handheld selfie shot, arm visible, slight shake." },
  { id:"C13", nom:"Recul qui révèle", p:"Slow pull-out revealing the whole scene." },
  { id:"C15", nom:"Zoom coup de poing", p:"Sudden crash zoom on the face." },
  { id:"C16", nom:"Effet vertige", p:"Dolly zoom, the background stretches while the subject stays the same size." }
];

var SOUS = [
  { id:"U1", g:"Répliques", nom:"Mot par mot, gros, blanc avec contour noir", p:"dialogue captions word by word, large bold white text with a thick black outline, centered in the lower third" },
  { id:"U2", g:"Répliques", nom:"Boîte grise arrondie", p:"dialogue captions as full sentences in a rounded translucent grey box, white text, lower third" },
  { id:"U4", g:"Habillage", nom:"Autocollant POV en haut", p:"sticker style caption at the top of the screen starting with POV, kept for the first seconds" },
  { id:"U5", g:"Aucun", nom:"Sans sous-titres", p:"no subtitles" }
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
  { id:"oui", t:"Oui, les mêmes personnages à chaque épisode", d:"Série avec casting fixe." },
  { id:"univers", t:"Même univers et même style, personnages qui changent", d:"Histoires différentes dans un même lieu." },
  { id:"non", t:"Non, chaque vidéo est indépendante", d:"Une vidéo, ou plusieurs sans lien." }
];

var SPEECH = [
  { id:"A", t:"A. Voix off et sous-titres", d:"Le plus simple, conseillé pour les 3 premiers épisodes." },
  { id:"B", t:"B. Voix du générateur vidéo", d:"Le générateur (Agnes) fait parler le personnage." },
  { id:"C", t:"C. Voix séparée", d:"Clips muets, voix ajoutée après en montage." }
];

var AMBS = [
  { id: "drole", nom: "Drôle" }, { id: "triste", nom: "Triste" }, { id: "peur", nom: "Qui fait peur" },
  { id: "tendre", nom: "Tendre" }, { id: "absurde", nom: "Absurde" }, { id: "suspense", nom: "Suspense" },
  { id: "touchant", nom: "Touchant" }, { id: "potins", nom: "Trash et potins" }, { id: "mystere", nom: "Mystérieux" }, { id: "romance", nom: "Romantique" }
];

var RND = {
  lieu: ["une laverie automatique", "un mariage en plein air", "un camping en bord de mer",
    "un immeuble dont l'ascenseur est en panne", "un supermarché le dimanche soir",
    "une salle de sport", "une école de danse", "une gare un jour de grève",
    "un marché du dimanche", "une maison de vacances partagée en famille",
    "la cuisine d'un restaurant", "un cabinet de dentiste", "un studio photo",
    "un bus scolaire", "une résidence étudiante", "une ferme",
    "un château loué pour un week-end", "un salon de coiffure",
    "une boulangerie de village", "un salon de thé"],
  heros: ["une mère seule débordée", "un ado discret", "une grand-mère rusée",
    "deux meilleures amies", "un nouveau voisin mystérieux", "une jeune cheffe d'entreprise",
    "un père maladroit", "un frère et une sœur", "une influenceuse en panne d'inspiration",
    "un vieux couple", "une fille timide qui devient le centre d'attention",
    "un stagiaire que personne ne remarque"],
  objet: ["une lettre jamais ouverte", "une clé qui n'ouvre rien", "un téléphone trouvé",
    "une valise échangée par erreur", "un message envoyé au mauvais numéro",
    "une vieille photo", "un cadeau anonyme", "un héritage inattendu",
    "un colis qui n'est pas pour elle", "une recette secrète",
    "une cagnotte qui disparaît", "un faire-part de mariage sans nom"],
  twist: ["celui qu'on prend pour le méchant a raison sur un point",
    "l'aide vient de la personne qu'on soupçonnait",
    "tout le monde cachait la même chose",
    "l'objet n'a aucune valeur, sauf pour une seule personne",
    "le secret est tendre et pas coupable",
    "deux histoires qu'on croyait séparées n'en font qu'une",
    "la victime a elle-même lancé l'histoire",
    "le plan parfait échoue à cause d'un détail minuscule"]
};
function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
function ambText() {
  return P.ambs.map(function (id) { var a = byId(AMBS, id); return a ? a.nom : ""; }).filter(has);
}

var NONE = ["", "personne", "aucun", "aucune", "-", "nobody", "none", "sans voix", "n/a", "x"];

var STORE = "fabrique-series-v3";
var STORE_BACKUP_PREFIX = "fabrique-backup-";

function fresh() {
  return {
    genre:"", castNote:"", ambs:[], vus:[], cible:"",
    veille:[], tendances:"", concepts:[], lecons:"", exSkip:false,
    titre:"", idee:"", style:[], speech:"A", nb:3, rec:"oui",
    duree:60, dureePlan:6, skin:"", teints:[], yeux:[],
    effets:[], cam:"", sous:["U1"], custom:"",
    concept:"", regle:"", ton:"", arc:"",
    persos:[], lieux:[], eps:[],
    videoEngine:"agnes", wangpUrl:"http://192.168.1.100:7860", ltxApiKey:"", uid:1
  };
}
var P = fresh();
var R = { tab:"univers", ep:0, fb:null, busy:null, arm:"", refs:[], chain:null, mont:false, angle:{} };
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
  fixEps();
}
function save() {
  try { localStorage.setItem(STORE, JSON.stringify(P)); }
  catch (e) { memOnly = true; }
}

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
      if (p.photoStatus === undefined) p.photoStatus = null;
      if (p.photoMsg === undefined) p.photoMsg = "";
      if (p.photoError === undefined) p.photoError = "";
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
  P.persos.forEach(function (p) {
    if (p.refUri === undefined) p.refUri = null;
    if (p.refStatus === undefined) p.refStatus = null;
    if (p.refMsg === undefined) p.refMsg = "";
    if (p.refError === undefined) p.refError = "";
  });
  P.lieux.forEach(function (l) {
    if (l.refUri === undefined) l.refUri = null;
    if (l.refStatus === undefined) l.refStatus = null;
    if (l.refMsg === undefined) l.refMsg = "";
    if (l.refError === undefined) l.refError = "";
  });
  P.eps.forEach(function (e) {
    (e.cast || []).forEach(function (c) {
      if (c.refUri === undefined) c.refUri = null;
      if (c.refStatus === undefined) c.refStatus = null;
      if (c.refMsg === undefined) c.refMsg = "";
      if (c.refError === undefined) c.refError = "";
    });
  });
}

function has(v) { return String(v || "").trim().length > 0; }
function esc(s) { return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function uid() { return P.uid++; }
var tt = 0;
function toast(m) { var t = document.getElementById("toast"); t.textContent = m; t.hidden = false; clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 3000); }
function byId(arr, id) { return arr.filter(function (x) { return x.id === id; })[0]; }
function sentence(t) { t = String(t || "").trim(); return t && !/[.!?]$/.test(t) ? t + "." : t; }
function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function setPath(o, path, v) { var a = path.split("."), i; for (i = 0; i < a.length - 1; i++) o = o[a[i]]; o[a[a.length - 1]] = v; }

function cleanForAgnes(s) {
  return String(s || "").replace(/\n/g, " ").replace(/\r/g, "").replace(/[«»„""]/g, "'").replace(/\s+/g, " ").trim();
}

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
function sousList() { var s = P.sous; if (typeof s === "string") s = [s]; return (s || []).filter(function (id) { return byId(SOUS, id); }); }
function sousPhrase() { var a = sousList(); if (!a.length) a = ["U1"]; return a.map(function (id) { return byId(SOUS, id).p; }).join(" + "); }
function camPhrase() { var c = byId(CAMS, P.cam); return c ? c.p : ""; }

function perEp() { return DUREES_TOTALES.filter(function (x) { return x.v === P.duree; })[0] || DUREES_TOTALES[2]; }
function perPlan() { return DUREES_PLAN.filter(function (x) { return x.v === P.dureePlan; })[0] || DUREES_PLAN[1]; }

function unit(n) { return P.nb === 1 ? "la vidéo" : "l'épisode " + n; }
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

function copyText(text, el, msg) {
  function ok() { toast(msg || "Copié."); }
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
    toast(done ? (msg || "Copié.") : "Sélectionne le texte puis Copier.");
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
/* ═══ PARTIE 2 ═══ */

/* ============================================================
   CLÉ AGNES
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
    toast("Clé Agnes effacée.");
    agnesPanelRefresh();
    return;
  }
  try {
    localStorage.setItem("agnes_key", k);
    toast("Clé Agnes enregistrée.");
    agnesPanelRefresh();
  } catch (e) { toast("Sauvegarde impossible."); }
}
function agnesPanelRefresh() {
  var s = document.getElementById("agnes-status");
  if (!s) return;
  var k = getAgnesKey();
  if (k) { s.textContent = "Clé active · " + k.slice(0, 8) + "…" + k.slice(-4); s.className = "badge done"; }
  else { s.textContent = "Aucune clé"; s.className = "badge"; }
}
function agnesPanelHtml() {
  var k = getAgnesKey();
  return '<details class="glass acc" data-keep="1"><summary><div><b>Clé Agnes</b><br><span>Sert à écrire le script et à générer les vidéos</span></div><span class="badge' + (k ? ' done' : '') + '" id="agnes-status">' + (k ? "Clé active · " + k.slice(0, 8) + "…" + k.slice(-4) : "Aucune clé") + '</span></summary><div class="in">' +
    '<p class="small muted">La clé Agnes sert à écrire le script et à générer les vidéos. Sans clé, tu peux toujours écrire le texte toi-même et importer les images.</p>' +
    '<input type="password" id="agnes-key-input" placeholder="sk-..." autocomplete="off" style="width:100%;padding:12px 14px;border-radius:14px;border:1.5px solid var(--line);background:var(--glass-strong);font-family:ui-monospace,monospace;font-size:14px" value="' + esc(k) + '">' +
    '<button type="button" class="btn big" data-act="agnes-save" style="margin-top:8px">Enregistrer la clé</button>' +
    '<p class="small muted" style="margin-top:8px">Clé gratuite sur <a href="https://platform.agnes-ai.com" target="_blank" rel="noopener">platform.agnes-ai.com</a>.</p>' +
    '</div></details>';
}

async function agnesFetch(url, options, label) {
  options = options || {};
  label = label || "Agnes";
  for (var i = 0; i < 10; i++) {
    try {
      var r = await fetch(url, options);
      if (r.status === 429) { await new Promise(function (ok) { setTimeout(ok, Math.min(120000, 15000 * (i + 1))); }); continue; }
      if (r.status === 503) { await new Promise(function (ok) { setTimeout(ok, Math.min(60000, 8000 * (i + 1))); }); continue; }
      return r;
    } catch (e) {
      await new Promise(function (ok) { setTimeout(ok, 5000 * (i + 1)); });
    }
  }
  return fetch(url, options);
}

async function callAgnesText(system, user) {
  console.log("[AGNES] Appel texte, prompt de " + (user || "").length + " caractères");
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
      max_tokens: 16000,
      response_format: { type: "json_object" }
    })
  }, "Texte");
  if (!res.ok) { var t = await res.text(); throw new Error("Texte HTTP " + res.status + " : " + t.slice(0, 200)); }
  var d = await res.json();
  var content = d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content;
  if (!content) throw new Error("Pas de contenu.");
  return content;
}

async function agnesCreateImage(prompt, refImages, negativePrompt) {
  var body = {
    model: "agnes-image-2.5-flash",
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
    headers: { "Authorization": "Bearer " + getAgnesKey(), "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }, "Image");
  if (!res.ok) { var t = await res.text(); console.error("[IMAGE ERR]", t.slice(0,300)); throw new Error("Image HTTP " + res.status); }
  var d = await res.json();
  var item = d.data && d.data[0];
  if (!item) throw new Error("Pas d'image.");
  return item.url || ("data:image/png;base64," + item.b64_json);
}

async function agnesCreateVideo(prompt, imageDataUri, numFrames) {
  var seconds = String(Math.max(4, Math.min(12, Math.round((numFrames || 145) / 24))));
  var body = {
    model: "agnes-video-2.5-flash",
    prompt: prompt,
    seconds: seconds,
    mode: imageDataUri ? "reference" : "text",
    size: "720P",
    aspect_ratio: "9:16"
  };
  if (imageDataUri) body.images = [imageDataUri];
  var res = await agnesFetch(AGNES_API + "/videos", {
    method: "POST",
    headers: { "Authorization": "Bearer " + getAgnesKey(), "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }, "Vidéo");
  if (!res.ok) { var t = await res.text(); console.error("[VIDEO ERR]", t.slice(0,300)); throw new Error("Vidéo HTTP " + res.status); }
  var d = await res.json();
  var id = d.video_id || d.id || d.task_id;
  if (!id) throw new Error("Pas de video_id.");
  return id;
}
async function agnesPollVideo(videoId, onProgress) {
  var wait = 80;
  while (wait > 0) { if (onProgress) onProgress("Préparation (" + wait + " s)…"); await new Promise(function (ok) { setTimeout(ok, 1000); }); wait--; }
  var intervals = [8, 8, 12, 12, 20, 20, 25];
  for (var attempt = 0; attempt < 100; attempt++) {
    if (attempt > 0) {
      var iv = intervals[Math.min(attempt - 1, intervals.length - 1)];
      while (iv > 0) { if (onProgress) onProgress("L'image prend vie (" + iv + " s)…"); await new Promise(function (ok) { setTimeout(ok, 1000); }); iv--; }
    }
    var url = AGNES_POLL + "?video_id=" + encodeURIComponent(videoId) + "&model_name=" + encodeURIComponent(AGNES_VIDEO_MODEL);
    var res = await agnesFetch(url, { method: "GET", headers: { "Authorization": "Bearer " + getAgnesKey() } }, "Polling");
    var d = await res.json();
    var st = d.status || "unknown", pr = d.progress || 0;
    if (onProgress) onProgress("Création " + pr + " %…");
    if (st === "completed" || st === "succeeded" || st === "done") {
      var vurl = (d.metadata && d.metadata.url) || d.url || (d.output && d.output.url);
      if (!vurl) throw new Error("Terminé sans URL.");
      return vurl;
    }
    if (st === "failed" || st === "error" || st === "cancelled") throw new Error("Échec (" + st + ").");
  }
  throw new Error("Délai dépassé.");
}

async function wangpCreateVideo(prompt, imageDataUri, numFrames) {
  var url = String(P.wangpUrl || "").replace(/\/$/, "");
  if (!url) throw new Error("URL WanGP non configurée.");
  var res;
  try {
    res = await fetch(url + "/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt, image: imageDataUri, num_frames: numFrames, frame_rate: AGNES_FPS, model: "wan2.2" })
    });
  } catch (e) {
    throw new Error("WanGP inaccessible. Vérifie que ton serveur tourne et que l'URL est correcte.");
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
        if (s.status === "failed") throw new Error("WanGP échec.");
      } catch (e) { /* continue */ }
    }
    throw new Error("WanGP timeout.");
  }
  throw new Error("Réponse WanGP inconnue.");
}

async function ltxCreateVideo(prompt, imageDataUri, numFrames) {
  if (!P.ltxApiKey) throw new Error("Clé API LTX non configurée.");
  throw new Error("Intégration LTX à finaliser (endpoint non défini). Utilise Agnes en attendant.");
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
    if (!FFCls) throw new Error("FFmpeg non chargé (CDN inaccessible ?)");
    var ffmpeg = new FFCls();
    var baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpeg.load({ coreURL: baseURL + "/ffmpeg-core.js", wasmURL: baseURL + "/ffmpeg-core.wasm" });
    FF.instance = ffmpeg;
    FF.loaded = true;
    console.log("✅ FFmpeg chargé");
    return ffmpeg;
  } finally { FF.loading = false; }
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
      "-pix_fmt", "yuv420p",
      "-r", "30",
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
      "-pix_fmt", "yuv420p",
      "-r", "30",
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
/* ============================================================
   PHOTO DES PLANS (IndexedDB)
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
  if (!file || !file.type.startsWith("image/")) { toast("Ce fichier n'est pas une image."); return; }
  try {
    var uri = await planFileToDataUri(file);
    if (uri.length > 500000) uri = await compressImage(uri, 768, 0.75);
    P.eps[i].plans[j].photoUri = uri;
    P.eps[i].plans[j].videoUrl = null;
    P.eps[i].plans[j].videoStatus = null;
    await planPhotoStore(i, j, uri);
    save(); render(); toast("Photo ajoutée.");
  } catch (e) { toast("Impossible de lire cette image."); }
}
async function planClearPhoto(i, j) {
  if (!confirm("Retirer cette photo ? La vidéo déjà générée sera perdue.")) return;
  P.eps[i].plans[j].photoUri = null;
  P.eps[i].plans[j].videoUrl = null;
  P.eps[i].plans[j].videoStatus = null;
  await planPhotoDelete(i, j);
  save(); render();
}

/* ============================================================
   RÉFÉRENCES (IndexedDB)
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
async function refGenerate(kind, id) {
  var obj = findRefObj(kind, id);
  if (!obj) { toast("Référence introuvable."); return; }
  if (!getAgnesKey()) { toast("Ajoute ta clé Agnes dans l'onglet Univers."); return; }

  var prompt = refPrompt(kind, obj.visuel);
  obj.refStatus = "busy";
  obj.refMsg = "Agnes dessine…";
  obj.refError = "";
  save(); render();

  try {
        var url = await agnesCreateImage(prompt, null, "person, people, human, face, figure, character, portrait, body, girl, boy, man, woman, child, crowd, silhouette, cartoon, doll");
    obj.refUri = url;
    obj.refStatus = "done";
    obj.refMsg = "";
    await refStore(kind, id, url);
    save(); render();
    toast("Image de référence prête : " + (obj.nom || "sans nom"));
  } catch (e) {
    obj.refStatus = "err";
    obj.refError = (e.message || "Erreur").slice(0, 140);
    obj.refMsg = "";
    save(); render();
    toast("Échec : " + obj.refError);
  }
}
async function refUpload(kind, id, file) {
  if (!file || !file.type.startsWith("image/")) { toast("Ce fichier n'est pas une image."); return; }
  try {
    var uri = await planFileToDataUri(file);
    if (uri.length > 500000) uri = await compressImage(uri, 768, 0.75);
    await refStore(kind, id, uri);
    var obj = findRefObj(kind, id);
    if (obj) { obj.refUri = uri; save(); render(); toast("Référence ajoutée."); }
  } catch (e) { toast("Impossible de lire cette image."); }
}
async function refClear(kind, id) {
  if (!confirm("Retirer cette image de référence ?")) return;
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
/* ═══ PARTIE 3 ═══ */

/* ============================================================
   PROMPTS FINAUX
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

    /* Renforcement anthropomorphe (F1, F2) */
  var fruitStyle = Array.isArray(P.style) && (P.style.indexOf("F1") >= 0 || P.style.indexOf("F2") >= 0);
  if (fruitStyle) {
    parts.push("⚠️ STRICT SHAPE RULE: The character's HEAD (or ENTIRE BODY if F2) MUST keep the fruit silhouette exactly. This is NOT a human with colored skin — the fruit shape must be instantly recognizable. No human head. No realistic human anatomy. Only the face features are cartoon-human-like, everything else is the fruit. The fruit shape is the ENTIRE head, not a helmet or costume. No human skull underneath.");
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
    "Any character not listed must NOT appear in the image. " +
    "Do not change the identity of any character shown.";
  return base + note;
}

function videoPrompt(pl) {
  var who = String(pl.qui || "").trim();
  var spoke = NONE.indexOf(who.toLowerCase()) < 0;
  var rule;
  var replique = String(pl.replique || "").trim()
    .replace(/"/g, "'")
    .replace(/[«»„""]/g, "'")
    .replace(/\n/g, " ");

  var cleanEmotion = cleanForAgnes(pl.emotion);
  var cleanAction = cleanForAgnes(pl.action);
  var cleanPv = cleanForAgnes(pl.pv);

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
   CONTEXTE POUR LES PROMPTS
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
var DIALOGUE_RULES = "QUALITÉ DES DIALOGUES : écris comme des gens parlent vraiment, en français oral et vivant (phrases coupées, expressions du quotidien, interruptions). Chaque réplique révèle, provoque, esquive, retourne la situation ou fait rire. Interdits : formules toutes faites, répliques qui expliquent ce que l'image montre. ";
function recapFor(n) { var p = epBy(n - 1); return p && has(p.resume) ? p.resume + (has(p.fin) ? " Question de fin : " + p.fin : "") : ""; }
function isLast(ep) { return ep.n >= P.nb; }
function arcLine(n) { var l = P.arc.split("\n")[n - 1]; return l ? l.replace(/^\d+[.)]\s*/, "") : ""; }
function briefText() { return (has(P.genre) ? "Genre : " + P.genre + ".\n" : "") + (has(P.cible) ? "Public : " + P.cible + ".\n" : ""); }
function leconsText() { return has(P.lecons) ? "LEÇONS DES STATS PRÉCÉDENTES :\n" + P.lecons.trim() + "\n" : ""; }

/* ============================================================
   EXTRACTION JSON (5 stratégies + réparation JSON tronqué)
   ============================================================ */
function salvageTruncatedJson(text) {
  var s = String(text || "").trim();
  var start = s.indexOf('{');
  if (start < 0) return null;
  s = s.slice(start);

  var lastObjEnd = -1, depth = 0, inString = false, escape = false;
  for (var i = 0; i < s.length; i++) {
    var c = s[i];
    if (escape) { escape = false; continue; }
    if (c === '\\') { escape = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === '{') depth++;
    else if (c === '}') {
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
      var scriptLines = m[1].split(/\\n|\n/).map(function (l) { return l.replace(/\\"/g, '"').replace(/"/g, '\\"'); });
      var newRaw = raw.replace(m[0], '"script":["' + scriptLines.join('","') + '"]');
      return JSON.parse(newRaw);
    }
  } catch (e4) {}

  /* Réparation JSON tronqué (AVANT le throw final) */
  try {
    var salv = salvageTruncatedJson(raw);
    if (salv) { console.warn("[PARSE] JSON tronqué réparé"); return salv; }
  } catch (e5) {}

  throw new Error("JSON invalide");
}

/* ============================================================
   APPEL AGNES + ASK
   ============================================================ */
function ask(label, prompt, apply) {
  var p = new Promise(function (resolve, reject) {
    if (!getAgnesKey()) { toast("Ajoute ta clé Agnes dans l'onglet Univers."); reject(new Error("no key")); return; }
    R.busy = { label: label, sub: R.chain ? R.chain.sub : "" }; overlay();
    console.log("[ASK] " + label + " · prompt " + prompt.length + " car.");
    callAgnesText("", prompt).then(function (txt) {
      R.busy = null; overlay();
      try {
        var data = extractJson(txt);
        apply(data); save(); render(); toast(label + " : terminé.");
        console.log("[ASK] " + label + " · succès");
        resolve(data);
      } catch (e) {
        console.error("[ASK] " + label + " · parse raté :", e, txt.slice(0, 500));
        toast("Réponse illisible. Réessaie."); reject(e);
      }
    }).catch(function (e) {
      R.busy = null; overlay();
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
  if (!R.busy) { o.innerHTML = ""; return; }
  o.innerHTML = '<div class="busy"><div class="glass"><div class="spin"></div><b>Agnes prépare : ' + esc(R.busy.label) + '</b>' + (R.busy.sub ? '<p class="small"><b>' + esc(R.busy.sub) + '</b></p>' : '') + '<p class="small muted">Compte 20 à 90 secondes.</p><button type="button" class="btn ghost big" data-act="stop">Arrêter</button></div></div>';
}
var JSONNOTE = "\n\nAnswer ONLY with a valid JSON object, no text before or after, no code fences.";

/* ============================================================
   GÉNÉRATEURS
   ============================================================ */

/* ---- GEN UNIVERS ---- */
function genUnivers() {
  var st = sty(), ph = phrase();
  var fmt = P.nb === 1 ? "A single video of " + P.duree + " seconds." : P.nb + " videos of " + P.duree + " seconds each.";
  var persoRule = P.rec === "oui" ? "Create the season's cast: 4 to 6 characters maximum. " : "Characters change between videos: characters = empty list. ";
    var coherenceRule = "CULTURAL COHERENCE: if a character has dark skin, their hairstyle MUST match (braids, afro, cornrows, gradient, wig with edges). NEVER blonde hair on dark skin unless explicitly stated. NEVER straight European hair on deep brown skin. Be specific: 'box braids with gold cuffs', 'natural 4C afro', 'long sleek cornrows', etc.\n";
   var prompt = "You are a screenwriter for short vertical animated videos (TikTok, YouTube Shorts, Instagram, Facebook). Output user-facing content in FRENCH, but every instruction here is for you in English. Technical fields (visual descriptions) must be IN ENGLISH.\n" +
    "Starting idea (in French): " + P.idee.trim() + "\n" +
    (has(P.titre) ? "Desired title (in French): " + P.titre.trim() + "\n" : "") +
    "Format: " + fmt + "\n" +
    (has(P.genre) ? "Genre: " + P.genre + ".\n" : "") +
    (has(P.cible) ? "Audience: " + P.cible + ".\n" : "") +
      "Visual style: " + (st ? st.nom + ". Style phrase: " + ph : "not specified") + "\n" + coherenceRule +
    "\n" + persoRule +
    "No brand, no logo, no real person. No violence, no suggestive scene. Do not mock any body, religion, or origin. " +
    "Each visual description field must be IN ENGLISH, 50 to 80 words. MANDATORY FORMAT: start with 'character with', then list ONLY literal visual features: body shape, exact colors using descriptive words, skin/fruit/leather texture, eye shape and color, hair style and color, outfit fabrics and colors, one signature accessory. FORBIDDEN: brand names (Bratz, Barbie, Rainbow High, Disney), style references (K-pop, Y2K, cybergoth), metaphors (mango-skin, doll-like), emotions, story elements. Write ONLY what a camera would see. " +
    "Places: visual description IN ENGLISH with no character, describe the physical decor only (2 to 4 places). " +
    "Arc: exactly " + P.nb + " line" + (P.nb > 1 ? "s" : "") + " (one per video, in French)." + JSONNOTE +
    '\nFormat: {"titre":"in French","phrase_concept":"in French","regle_speciale":"in French","ton":"in French","personnages":[{"nom":"in French","role":"in French","caractere":"3 mots en français","secret":"in French","voix":"in French","voix_en":"in English","visuel":"in English 40-60 words"}],"lieux":[{"nom":"in French","visuel":"in English"}],"arc":["in French","in French"]}';
  return ask(P.rec === "oui" ? "le casting et l'univers" : "le concept et l'univers", prompt, function (d2) {
    if (!d2 || (!d2.phrase_concept && !(d2.personnages && d2.personnages.length))) throw new Error("vide");
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

/* ---- GEN CAST ---- */
function genCast() {
  var st = sty(), ph = phrase();
  var prompt = "You are a screenwriter for short vertical animated videos. Output user-facing content in FRENCH, technical visual fields IN ENGLISH.\nIdea (in French): " + P.idee.trim() + "\n" +
    (has(P.titre) ? "Title (in French): " + P.titre.trim() + "\n" : "") +
    (has(P.concept) ? "Concept (in French): " + P.concept.trim() + "\n" : "") +
    "Existing places: " + (P.lieux.map(function (l) { return l.nom; }).join(", ") || "none") + "\n" +
    (st ? "Visual style: " + st.nom + ". Style phrase: " + ph + "\n" : "") +
    "\nCreate the fixed cast: all already-named characters, plus the missing ones, 6 maximum. Each visual field IN ENGLISH, 50 to 80 words. MANDATORY FORMAT: start with '3D rendered character with', then list ONLY literal visual features. FORBIDDEN: brand names, style references, metaphors. Write ONLY what a camera would see." + JSONNOTE +
    '\nFormat: {"personnages":[{"nom":"in French","role":"in French","caractere":"3 mots","secret":"in French","voix":"in French","voix_en":"in English","visuel":"in English 40-60 words"}]}';
  return ask("le casting", prompt, function (d2) {
    if (!d2 || !d2.personnages || !d2.personnages.length) throw new Error("vide");
    P.rec = "oui";
    P.persos = d2.personnages.slice(0, 8).map(function (p) {
      return { id: uid(), nom: p.nom || "", role: p.role || "", caractere: p.caractere || "", secret: p.secret || "", voix: p.voix || "", voix_en: p.voix_en || "", visuel: p.visuel || "", ok: false };
    });
  });
}

/* ---- GEN SCRIPT ---- */
function scriptBody(ep) {
  var rec = P.rec, last = isLast(ep);
  var structure = "3-second hook, " + (ep.n > 1 && rec === "oui" && P.nb > 1 ? "5-second recap of the previous episode, " : "") + "setup, conflict, twist, " + (last ? "clean ending." : "ending on a question.");
  var rehook = P.duree >= 45 ? "3. MID-VIDEO RE-HOOK: Around the middle (close to " + Math.round(P.duree/2) + "s), place a second strong hook (revelation, twist, shock question) tagged [RE-HOOK].\n" : "";
  var rehookEx = P.duree >= 45 ? "[00:" + String(Math.round(P.duree/2)).padStart(2,"0") + "] [RE-HOOK] CLOSE-UP - Aicha (paniquée) : Attends... tu savais ?\n" : "";
  return "Write episode " + unit(ep.n) + " of a short vertical animated production. ALL lines of dialogue must be in FRENCH. Every instruction here is for you in English. Shot types MUST be written IN ENGLISH.\n" +
    "Title (in French): " + (P.titre || "sans titre") + ". Idea (in French): " + P.idee.trim() + "\nConcept (in French): " + P.concept + "\nRule (in French): " + P.regle + "\nTone (in French): " + P.ton + "\n" + briefText() +
    (P.nb > 1 ? "Format: " + P.nb + " videos, this is n° " + ep.n + ".\n" : "Format: single video.\n") +
    bible(ep) + "\n" + voicesText(ep) + "\n" + leconsText() +
    (P.nb > 1 ? "\nArc event (in French): " + (arcLine(ep.n) || "à imaginer") + "\n" : "") +
    (has(ep.note) ? "Starting note (in French): " + ep.note.trim() + "\n" : "") +
    (ep.n > 1 && rec === "oui" ? "Previous recap (in French): " + (recapFor(ep.n) || "non fourni") + "\n" : "") +
    (rec !== "oui" ? "Invent characters (4 max), visual description IN ENGLISH 40-60 words ending with: " + phrase() + "\n" : "") +
    "\nTarget duration: " + P.duree + " s. Structure: " + structure + " Max 2 characters per scene, only one person speaks at a time. " + DIALOGUE_RULES + "\n" +
    "⚠️ HARD CONSTRAINT: The story must fit in " + P.duree + " seconds. Count your lines BEFORE answering. If you write " + Math.floor(P.duree / 3) + " lines at 3s each, you get " + (Math.floor(P.duree / 3) * 3) + "s. Do not write more. A line of 5 words takes 3s, not 1s.\n" +
    "MANDATORY TIKTOK RULES (for maximum virality):\n" +
    "1. 3-SECOND HOOK: The very first line or action must create surprise, tension or an immediate question. Tag this line with [HOOK] at the start.\n" +
    "2. VISUAL CHANGE EVERY 2 TO 3 SECONDS: Each line must have a shot type DIFFERENT from the previous one. Use ENGLISH shot names: CLOSE-UP, MEDIUM SHOT, WIDE SHOT, OVER-THE-SHOULDER, HANDHELD, ORBIT, TIGHT SHOT, HIGH ANGLE, LOW ANGLE, etc.\n" +
    rehook +
    "4. ENDING: " + (last ? "Clean, memorable ending that closes the story." : "End on a cliffhanger or an unanswered question.") + "\n" +
    "5. RHYTHM — ABSOLUTE MAXIMUM: " + Math.floor(P.duree / 3) + " lines of dialogue TOTAL (that is one line every ~3 seconds). Do NOT exceed this count. The last timestamp MUST be BEFORE " + Math.floor(P.duree - 5) + "s. SHORT lines: 5 to 12 words maximum. Each line = ~3 seconds of screen time.\n" +
    "6. TONE: Each line starts with a tone tag in parentheses, IN ENGLISH: (angry), (whispers), (nervous laugh), (cold), (panicked), (sarcastic), etc. Alternate tones to create rhythm.\n" +
    "\nSCRIPT FORMAT (one line per dialogue, follow EXACTLY this format):\n" +
    "[00:00] [HOOK] CLOSE-UP - Mango (sarcastic): C'est ca, ton grand secret ?\n" +
    "[00:03] OVER-THE-SHOULDER - Aicha (cold): Tais-toi. Elle arrive.\n" +
    "[00:06] MEDIUM SHOT - Mango (whispers): On en reparle.\n" +
    "[00:09] WIDE SHOT - (silence) - la porte s'ouvre lentement\n" +
    rehookEx +
    "\nShot types are MANDATORY on EVERY line, in ENGLISH. If a line is the HOOK or RE-HOOK, add [HOOK] or [RE-HOOK] right after the timestamp.\n" +
    JSONNOTE +
    '\nIMPORTANT: the "script" field must be an ARRAY of lines. Dialogue text is in FRENCH.' +
    '\nFormat: {"titre":"in French","resume":"3 phrases en français","question_fin":"in French' + (isLast(ep) ? " (chute)" : "") + '","script":["[00:00] [HOOK] CLOSE-UP - Mango (sarcastic): C\'est ca, ton grand secret ?","[00:03] OVER-THE-SHOULDER - Aicha (cold): Tais-toi."]' + (P.rec !== "oui" ? ',"personnages":[{"nom":"","role":"","visuel":""}]' : '') + '}';
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
  } else if (r.script && typeof r.script === "object") {
    ep.script = JSON.stringify(r.script, null, 2);
  } else {
    ep.script = String(r.script || "");
  }
  if (P.rec !== "oui") ep.cast = (r.personnages || []).map(function (p) {
    return { id: uid(), nom: p.nom || "", role: p.role || "", visuel: p.visuel || "", ok: false };
  });
}
function genScript(ep) { return ask("le script de " + unit(ep.n), scriptBody(ep), function (r) { applyScript(ep, r); }); }

/* ---- GEN PLANS ---- */
function plansBody(ep, scriptText) {
  var minPlans = Math.floor(P.duree / 8);
  var maxPlans = Math.floor(P.duree / 5);
  var durationsList = DUREES_PLAN.map(function (x) { return x.v + " s (" + x.frames + " frames)"; }).join(", ");
  return "Visual style: " + phrase() + "\n" + bible(ep) + "\n\nScript:\n" + scriptText + "\n\n" +
    "Break this script into shots. Total video must be " + P.duree + " seconds. " +
    "IMPORTANT: YOU decide the duration of EACH shot based on EMOTION and PACE of the scene, NOT on a fixed average.\n" +
    "DURATION RULES BY EMOTION:\n" +
    "- [HOOK] / [RE-HOOK] / shock / twist / punchline -> SHORT shot (5 to 6 s)\n" +
    "- Tense dialogue / argument / confrontation -> 5 to 7 s (fast pace)\n" +
    "- Silence / contemplation / strong emotion / camera stare -> LONG shot (8 to 10 s)\n" +
    "- Physical action / movement -> 6 to 8 s\n" +
    "- Cliffhanger ending -> 6 to 8 s, end on a close-up or striking wide shot.\n" +
    "Each shot must use ONE of these exact durations: " + durationsList + ". " +
    "You will need between " + minPlans + " and " + maxPlans + " shots + 2 spare shots. " +
    "For each shot: place IN FRENCH, 2 characters max, action IN ENGLISH (short, no accents, e.g. 'fast nervous hand gesture'), shot type IN ENGLISH (wide shot / medium shot / close-up), line IN FRENCH (12 words max), who speaks (name or 'personne'), emotion IN ENGLISH (panicked / cold / angry / scared / happy / surprised), pace IN ENGLISH (calm / fast / tense / shock). " +
    "prompt_image IN ENGLISH describes ONLY the scene (shot type, positions, action, light). Do NOT add appearance or style. prompt_video IN ENGLISH: movement only. " +
    "⚠️ HARD CONSTRAINT: sum of durations for shots 1 to N (without spare shots) MUST equal " + P.duree + " seconds exactly (tolerance +/-3 s). If you exceed, remove shots. " + JSONNOTE +
    '\nFormat: {"plans":[{"n":1,"duree_s":6,"lieu":"in French","personnages":["name"],"action":"in English","cadrage":"medium shot","replique":"in French","qui_parle":"name","emotion":"panicked","rythme":"tense","prompt_image":"in English","prompt_video":"in English","reserve":false}]}';
}
function applyPlans(ep, r) {
  if (!r || !r.plans || !r.plans.length) throw new Error("vide");
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
function genPlans(ep) { return ask("le storyboard de " + unit(ep.n), plansBody(ep, ep.script), function (r) { applyPlans(ep, r); }); }

/* ---- GEN MONTAGE ---- */
function montBody(ep, list, titre, fin) {
  return "Series: " + (P.titre || "sans titre") + ". Episode " + ep.n + " : " + titre + "\nShots:\n" + list + "\nEnding question: " + fin + "\nSpeech method: " + SPEECH.filter(function (s) { return s.id === P.speech; })[0].t + "\n\n" +
    "Write the output IN FRENCH, with these 4 headings:\n" +
    "1. PLAN DE MONTAGE CAPCUT (ordre, durées gardées, coupes précises).\n" +
    "2. SOUS-TITRES ET TEXTES À L'ÉCRAN (styles choisis : " + sousPhrase() + ").\n" +
    "3. SONS — Tu dois TOI-MÊME choisir la musique et les bruitages, pas me laisser chercher. Pour chaque son, donne EXACTEMENT :\n" +
    "   • Moment précis dans la vidéo (ex: 00:00 à 00:03, ou plan 4)\n" +
    "   • Type (musique de fond / bruitage d'ambiance / effet ponctuel)\n" +
    "   • Nom de la piste ou du son tel qu'il apparaît dans la banque\n" +
    "   • Auteur / chaîne\n" +
    "   • Plateforme gratuite où le trouver : Pixabay Music, Freesound.org, YouTube Audio Library, Free Music Archive, Mixkit\n" +
    "   • Pourquoi ce son colle à cette scène (1 phrase)\n" +
    "   N'utilise QUE des sons libres de droits disponibles sur ces plateformes. Choisis une musique de fond cohérente avec le ton (" + P.ton + ") et adapte son volume aux moments clés (HOOK, RE-HOOK, fin).\n" +
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
    R.busy = { label: "le montage et la publication" }; overlay();
    callAgnesText("You write in French, no JSON, readable text.", montBody(ep, montList(ep), ep.titre, ep.fin)).then(function (txt) {
      R.busy = null; overlay();
      var e2 = epBy(ep.n) || ep;
      e2.montage = txt;
      save(); render(); toast("Montage prêt.");
      resolve(txt);
    }).catch(function (e) {
      R.busy = null; overlay();
      toast("Échec : " + (e.message || "").slice(0, 80));
      reject(e);
    });
  });
}

/* ---- BILAN ---- */
function genBilan(ep) {
  var st = ep.stats || statsFresh();
  var prompt = "Series: " + (P.titre || "sans titre") + ". " + P.concept + "\nEpisode " + ep.n + " : " + ep.titre + ". Summary: " + ep.resume + "\nScript excerpt:\n" + String(ep.script || "").slice(0, 700) + "\n\n" +
    "Stats: " + st.vues + " views, " + st.r3 + " % still watching at 3 s, " + st.moy + " s average, " + st.part + " shares." + (has(st.comm) ? " Comments: " + st.comm : "") +
    (has(P.lecons) ? "\nLessons already noted:\n" + P.lecons + "\n" : "") +
    "\nWrite the output IN FRENCH: diagnosis in 3 sentences max, 3 short rules, 1 test for the next episode." + JSONNOTE +
    '\nFormat: {"diagnostic":"in French","regles":["in French","in French","in French"],"test":"in French"}';
  return ask("le bilan de l'épisode " + ep.n, prompt, function (r) {
    if (!r || !r.diagnostic) throw new Error("vide");
    var e2 = epBy(ep.n) || ep;
    e2.bilan = r.diagnostic + (has(r.test) ? "\nÀ tester : " + r.test : "");
    var add = "Épisode " + ep.n + " : " + (r.regles || []).join(" ; ") + (has(r.test) ? " | Test : " + r.test : "");
    var l = (P.lecons || "").split("\n").filter(function (x) { return has(x) && x.indexOf("Épisode " + ep.n + " :") !== 0; });
    l.push(add);
    P.lecons = l.slice(-12).join("\n");
  });
}

/* ---- CONCEPTS (idées d'histoires) ---- */
function genConcepts(o) {
  o = o || {};
  var seeds = "", amb = ambText(), n = 3;
  if (o.surprise) {
    var picks = AMBS.slice().sort(function () { return Math.random() - .5; }).slice(0, 2);
    amb = picks.map(function (a) { return a.nom; });
    seeds = "CONTRAINTES TIRÉES AU HASARD (à respecter dans au moins une idée sur deux) : un lieu, " +
      rnd(RND.lieu) + " ; un personnage, " + rnd(RND.heros) + " ; un objet ou un secret, " +
      rnd(RND.objet) + " ; un retournement du type : " + rnd(RND.twist) + ".\n";
  }
  var vus = (P.vus || []).slice(-30);
    var prompt = "You are a TikTok viral short-video writer. Output in FRENCH. Your job: create stories that make people STOP scrolling in the first 2 seconds.\n" +
    "AUDIENCE: 13-30 year old TikTok users. They have 2-second attention spans. They want EMOTION, DRAMA, SHOCK, TABOO, REVENGE.\n" +
    (P.cible ? "Target audience: " + P.cible + "\n" : "") +
    (amb.length ? "Mood: " + amb.join(" | ") + "\n" : "") + seeds +
    "\nWHAT WORKS ON TIKTOK (RULES):\n" +
    "1. TITLE = 3-6 words, like a punch. Examples: 'Mon mari m'a menti', 'Ma mère est ma sœur', 'Je suis enceinte de lui', 'Elle a tué sa rivale', 'J'ai vendu mon bébé'.\n" +
    "2. STORY = ONE big dramatic reveal in 60-90 seconds. NOT a slow literary development.\n" +
    "3. FORBIDDEN TONES: introspective, melancholic, poetic, philosophical, nostalgic, quiet life in a tea salon.\n" +
    "4. FORBIDDEN STORIES: 'une personne timide découvre sa vraie famille', 'un secret de famille doux révélé calmement'.\n" +
    "5. REQUIRED: betrayal, revenge, forbidden love, hidden pregnancy, stolen money, swapped babies, fake death, exposed lies, catastrophic revenge, seduction, jealousy, blood rivalry.\n" +
    "6. HOOK (3 sec): a sentence that shocks. Examples: 'Je viens de tuer mon mari.', 'Elle m'a pris mon bébé.', 'J'ai couché avec le mari de ma sœur.', 'Papa, tu es vivant ?'.\n" +
    "7. TWIST: nobody should see it coming. Betrayal from the person we trusted. Dead person who is alive. Fake identity. Reversal of power.\n" +
    "8. END OF EP 1: an unbearable cliffhanger that makes the viewer comment 'la suite !!!'.\n" +
    "9. If the characters are fruits or food (anthropomorphic), the drama stays HUMAN (betrayal, sex, family, money) — the fruit is just the visual.\n\n" +
    "For each idea give: short punchy title (FR), mood, the story in 3 sentences (FR), the shocking 3-sec hook (FR), the twist (FR), the cliffhanger (FR), why it can go viral (FR), the main risk (FR).\n" +
    "No brand, no real person, no resemblance to known series." + JSONNOTE +
    '\nFormat: {"concepts":[{"titre":"in French","ambiance":"in French","idee":"in French","hook":"in French","twist":"in French","chute":"in French","pourquoi":"in French","risque":"in French"}]}';
  return ask(o.more ? "trois idées de plus" : "trois idées d'histoires", prompt, function (r) {
    if (!r || !r.concepts || !r.concepts.length) throw new Error("vide");
    var neu = r.concepts.slice(0, 6).map(function (c) {
      return { titre: c.titre || "", ambiance: c.ambiance || "", idee: c.idee || "",
        hook: c.hook || "", twist: c.twist || "", chute: c.chute || "",
        pourquoi: c.pourquoi || "", risque: c.risque || "" };
    });
    P.vus = (P.vus || [])
      .concat(P.concepts.map(function (c) { return c.titre; }), neu.map(function (c) { return c.titre; }))
      .filter(has).filter(function (t, k, a) { return a.indexOf(t) === k; }).slice(-60);
    P.concepts = (o.more ? P.concepts : []).concat(neu).slice(-18);
  });
}

/* ============================================================
   CHAÎNE / SAISON
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
async function chainEpisode(n, label, options) {
  options = options || {};
  var ep = epBy(n);
  if (!has(ep.script)) { stopCheck(); setSub(label + " · 1/4 script"); await genScript(ep); }
  ep = epBy(n);
  if (!ep.plans.length) { stopCheck(); setSub(label + " · 2/4 plans"); await genPlans(ep); }
  ep = epBy(n);

  if (options.videos) {
    var epIdx = P.eps.indexOf(ep);
    var main = [];
    ep.plans.forEach(function (p, j) { if (!p.reserve) main.push({ idx: j, n: p.n }); });

    for (var k = 0; k < main.length; k++) {
      stopCheck();
      ep = epBy(n);
      var j = main[k].idx;
      var p = ep.plans[j];

      if (!p.photoUri) {
        setSub(label + " · photo " + (k+1) + "/" + main.length);
        await planGeneratePhoto(epIdx, j);
      }

      stopCheck();
      ep = epBy(n);
      p = ep.plans[j];
      if (!p.videoUrl) {
        setSub(label + " · vidéo " + (k+1) + "/" + main.length + " (peut prendre 2 min)");
        await planGenerateVideo(epIdx, j);
         await new Promise(function (ok) { setTimeout(ok, 60000); });
      }
    }
  }

  ep = epBy(n);
  if (!has(ep.montage)) { stopCheck(); setSub(label + " · 4/4 montage"); await genMontage(ep); }
}
async function runChain(job) {
  R.chain = { sub: "", stop: false };
  try { await job(); toast("Terminé. Tout est prêt."); }
  catch (e) { if (e && e.code === "cancelled") toast("Arrêté. Ce qui est fini est gardé."); }
  R.chain = null; R.busy = null; overlay(); render();
}
async function seasonJob() {
  var todo = todoEps(), k, n;
  for (k = 0; k < todo.length; k++) {
    n = todo[k]; stopCheck();
    if (!epBy(n)) { P.eps.push(newEp(n)); save(); }
    await chainEpisode(n, (P.nb === 1 ? "La vidéo" : "Épisode " + n + "/" + P.nb) + " (" + (k + 1) + "/" + todo.length + ")");
  }
}
function genSeason() { if (!todoEps().length) { toast("Tout est déjà préparé."); return; } runChain(seasonJob); }

/* ═══ PARTIE 4 ═══ */

/* ============================================================
   GÉNÉRATION PHOTO PAR PLAN (avec références)
   ============================================================ */
async function planGeneratePhoto(i, j) {
  var ep = P.eps[i], p = ep && ep.plans[j];
  if (!p) return;
  if (!getAgnesKey()) { toast("Ajoute ta clé Agnes dans l'onglet Univers."); return; }

  p.photoStatus = "busy";
  p.photoMsg = "Agnes dessine…";
  p.photoError = "";
  save(); render();

  try {
    var prompt = imagePrompt(p);

    var refImages = [];
    var noms = String(p.persos || "").split(/[,;]/).map(function (n) { return n.trim(); }).filter(Boolean);
    noms.forEach(function (nom) {
      var c = persoBy(nom);
      if (c && c.refUri) refImages.push(c.refUri);
    });
    if (p.lieu) {
      var l = findLieu(p.lieu);
      if (l && l.refUri) refImages.push(l.refUri);
    }

    p.photoMsg = "Génération (" + refImages.length + " réf.)…"; save(); render();
    var url = await agnesCreateImage(prompt, refImages);
    p.photoUri = url;
    p.photoStatus = "done";
    p.photoMsg = "";
    p.videoUrl = null;
    p.videoStatus = null;
    await planPhotoStore(i, j, url);
    save(); render();
    toast("Photo du plan " + p.n + " prête (" + refImages.length + " réf.)");
  } catch (e) {
    p.photoStatus = "err";
    p.photoError = (e.message || "Erreur").slice(0, 140);
    p.photoMsg = "";
    save(); render();
    toast("Échec : " + p.photoError);
  }
}

async function planGenerateAllPhotos(epNum) {
  var ep = epBy(epNum);
  if (!ep) return;
  if (!getAgnesKey()) { toast("Ajoute ta clé Agnes."); return; }

  var epIdx = P.eps.indexOf(ep);
  var todo = [];
  ep.plans.forEach(function (p, j) {
    if (!p.reserve && !p.photoUri) todo.push({ idx: j, n: p.n });
  });

  if (!todo.length) { toast("Toutes les photos sont déjà faites."); return; }
  if (!confirm("Générer " + todo.length + " photos avec Agnes ?\n\nÀ ~20 secondes par photo, compte environ " + Math.ceil(todo.length * 20 / 60) + " minutes. Garde l'écran ouvert.")) return;

  var done = 0, failed = 0;
  for (var k = 0; k < todo.length; k++) {
    try {
      toast("Photo " + (k+1) + "/" + todo.length + " en cours…", 1500);
      await planGeneratePhoto(epIdx, todo[k].idx);
      var p2 = P.eps[epIdx].plans[todo[k].idx];
      if (p2.photoUri) done++; else failed++;
    } catch (e) { failed++; }
  }
  toast("Terminé : " + done + " photo(s) OK, " + failed + " échec(s).", 4000);
}

/* ============================================================
   GÉNÉRATION VIDÉO PAR PLAN
   ============================================================ */
async function planGenerateVideo(i, j) {
  var ep = P.eps[i], p = ep && ep.plans[j];
  if (!p || !p.photoUri) return;
  if (P.videoEngine === "agnes" && !getAgnesKey()) { toast("Ajoute ta clé Agnes dans l'onglet Univers."); return; }
  if (P.videoEngine === "wangp" && !has(P.wangpUrl)) { toast("Renseigne l'URL de ton serveur WanGP."); return; }
  if (P.videoEngine === "ltx" && !has(P.ltxApiKey)) { toast("Ajoute ta clé API LTX."); return; }

  p.videoStatus = "busy"; p.videoMsg = "Création de la tâche…"; p.videoError = "";
  save(); render();

  try {
    var frames = p.frames || perPlan().frames;
    var prompt = videoPrompt(p);
    var url;

    if (P.videoEngine === "wangp") {
      p.videoMsg = "Envoi à WanGP…"; save(); render();
      url = await wangpCreateVideo(prompt, p.photoUri, frames);
    } else if (P.videoEngine === "ltx") {
      p.videoMsg = "Envoi à LTX…"; save(); render();
      url = await ltxCreateVideo(prompt, p.photoUri, frames);
    } else {
      p.videoMsg = "Envoi à Agnes…"; save(); render();
      var id = await agnesCreateVideo(prompt, p.photoUri, frames);
      p.videoMsg = "Préparation…"; save(); render();
      url = await agnesPollVideo(id, function (msg) {
        var el = document.querySelector('#vv-' + i + '-' + j + ' .badge');
        if (el) el.textContent = "⏳ " + msg;
      });
    }
    p.videoUrl = url;
    p.videoStatus = "done";
    p.videoMsg = "";
    save(); render();
    toast("Vidéo du plan " + p.n + " prête.");
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

/* ============================================================
   BANDEAU D'ÉTAPES
   ============================================================ */
function stageInfo() {
  var refs = P.persos.concat(P.lieux).concat(P.eps.reduce(function (a, x) { return a.concat(x.cast || []); }, []));
  var rd = refs.filter(function (r) { return r.ok; }).length;
  var ep = P.eps[P.eps.length - 1];
  var pl = ep ? ep.plans.filter(function (p) { return !p.reserve; }) : [];
  var cl = pl.filter(function (p) { return p.st === 2; }).length;
  var s = [
    { k: "Idée", v: has(P.idee) && P.style.length ? "ok" : "", tab: "univers" },
    { k: P.rec === "oui" ? "Casting" : "Concept", v: P.persos.length ? P.persos.length + " perso" : (has(P.concept) ? "fait" : ""), ok: P.persos.length > 0 || (P.rec !== "oui" && has(P.concept)), tab: "univers" },
    { k: "Univers", v: P.lieux.length ? P.lieux.length + " lieux" : "", ok: P.lieux.length > 0 && has(P.concept), tab: "univers" },
    { k: "Références", v: refs.length ? rd + "/" + refs.length : "", ok: refs.length > 0 && rd === refs.length, tab: "refs" },
    { k: "Plans", v: pl.length ? cl + "/" + pl.length + " clips" : "", ok: pl.length > 0 && cl === pl.length, tab: "eps" },
    { k: "Épisode", v: ep && has(ep.montage) ? "prêt" : "", ok: !!(ep && has(ep.montage)), tab: "eps" }
  ];
  s[0].ok = s[0].v === "ok"; s[0].v = s[0].ok ? "fait" : "";
  var found = false;
  s.forEach(function (x) { x.cur = !found && !x.ok; if (x.cur) found = true; });
  return s;
}
function stripHtml() {
  return '<div class="strip" id="strip">' + stageInfo().map(function (x) {
    return '<button type="button" class="stage' + (x.ok ? " ok" : "") + (x.cur ? " cur" : "") + '" data-act="tab" data-v="' + x.tab + '"><small>' + (x.ok ? "✓ fait" : (x.v || "à faire")) + '</small><b>' + x.k + '</b></button>';
  }).join("") + '</div>';
}
function refreshStrip() { var s = document.getElementById("strip"); if (s) s.outerHTML = stripHtml(); }

function goPrev() {
  var order = ["idees", "univers", "refs", "eps"];
  var idx = order.indexOf(R.tab);
  if (idx > 0) { go(order[idx - 1]); toast("← " + order[idx - 1]); }
  else toast("Déjà au début.");
}
function goNext() {
  var order = ["idees", "univers", "refs", "eps"];
  var idx = order.indexOf(R.tab);
  if (idx < order.length - 1) { go(order[idx + 1]); toast("→ " + order[idx + 1]); }
  else toast("Déjà à la fin.");
}

var $v = document.getElementById("view");
function go(tab, ep) { R.tab = tab; R.ep = ep || 0; R.mont = false; R.arm = ""; render(); window.scrollTo(0, 0); }
function render() {
  var wasOpen = !!document.querySelector("#view details.acc[data-keep][open]");
  document.querySelectorAll(".dock button").forEach(function (b) {
    if (b.getAttribute("data-tab") === R.tab) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  });
  var h = '<header class="proj"><div class="row" style="justify-content:space-between;align-items:center;gap:8px"><div style="display:flex;flex-direction:column;gap:2px;min-width:0"><span class="kicker">Fabrique de séries</span><b>' + esc(P.titre || "Ma série") + '</b></div><div class="row" style="gap:6px;flex:none"><button type="button" class="chip small" data-act="nav-prev" title="Étape précédente">← Préc.</button><button type="button" class="chip small" data-act="nav-next" title="Étape suivante">Suiv. →</button></div></div></header>' + stripHtml();

  if (R.tab === "idees") h += ideesHtml();
  else if (R.tab === "univers") h += universHtml();
  else if (R.tab === "refs") h += refsHtml();
  else h += R.ep ? (R.mont && has((epBy(R.ep) || {}).montage || "") ? montView(epBy(R.ep)) : epHtml(epBy(R.ep))) : epsHtml();

  h += '<div class="nav-bottom"><button type="button" class="btn ghost" data-act="nav-prev">← Précédent</button><button type="button" class="btn" data-act="nav-next">Suivant →</button></div>';
  $v.innerHTML = h;
  if (wasOpen) { var dk = document.querySelector("#view details.acc[data-keep]"); if (dk) dk.open = true; }
}
function bind(path, val, rows, label, hint) {
  return '<div class="fld"><label class="q" for="b-' + path + '">' + esc(label) + (hint ? '<span class="q-hint">' + esc(hint) + '</span>' : '') + '</label>' +
    (rows
      ? '<textarea id="b-' + path + '" data-path="' + path + '" style="min-height:' + (rows * 24 + 30) + 'px">' + esc(val) + '</textarea>'
      : '<input type="text" id="b-' + path + '" data-path="' + path + '" value="' + esc(val) + '">') + '</div>';
}

function parseScriptLine(line) {
  var s = String(line || "").trim();
  if (!s) return null;
  var out = { time:"", flag:"", cadrage:"", perso:"", ton:"", texte:"", type:"action", raw:s };
  var mT = /^\[(\d{1,2}:\d{2})\]\s*/.exec(s);
  if (mT) { out.time = mT[1]; s = s.slice(mT[0].length); }
  var mF = /^\[(HOOK|RE-HOOK)\]\s*/i.exec(s);
  if (mF) { out.flag = mF[1].toUpperCase(); s = s.slice(mF[0].length); }
  var mC = /^([A-Z][A-Z\/\s\-]{2,40}?)\s+-\s+/.exec(s);
  if (mC) { out.cadrage = mC[1].trim(); s = s.slice(mC[0].length); }
  var mP = /^([A-Za-z0-9' \-]{1,30}?)\s*\(([^)]{1,40})\)\s*:\s*(.+)$/.exec(s);
  if (mP) {
    out.perso = mP[1].trim();
    out.ton = mP[2].trim();
    out.texte = mP[3].trim();
    out.type = "dialogue";
  } else {
    out.texte = s;
    out.type = "action";
  }
  if (out.flag === "HOOK") out.type = "hook";
  else if (out.flag === "RE-HOOK") out.type = "rehook";
  return out;
}
function scriptBlocksHtml(scriptText) {
  var lines = String(scriptText || "").split("\n").map(parseScriptLine).filter(Boolean);
  if (!lines.length) return "";
  var colors = {
    hook:    { bg: "rgba(255, 90, 120, .18)",  border: "#E85A7D", label: "🎣 HOOK" },
    rehook:  { bg: "rgba(255, 150, 60, .18)",  border: "#E8913A", label: "🔄 RE-HOOK" },
    dialogue:{ bg: "rgba(109, 74, 232, .12)",  border: "#6D4AE8", label: "" },
    action:  { bg: "rgba(120, 120, 140, .12)", border: "#9E9EAF", label: "" }
  };
  return '<div class="stack" style="gap:8px">' + lines.map(function (l) {
    var c = colors[l.type] || colors.action;
    var timeTag = l.time ? '<span class="badge" style="background:' + c.border + ';color:#fff;font-size:.65rem">' + esc(l.time) + '</span>' : '';
    var flagTag = l.flag ? '<span class="badge" style="background:' + c.border + ';color:#fff;font-size:.65rem;margin-left:4px">' + esc(c.label) + '</span>' : '';
    var cadrage = l.cadrage ? '<span class="small" style="color:' + c.border + ';font-weight:700;text-transform:uppercase;font-size:.7rem;letter-spacing:.05em">' + esc(l.cadrage) + '</span>' : '';
    var persoHtml = "";
    if (l.perso) {
      persoHtml = '<b style="color:' + c.border + '">' + esc(l.perso) + '</b>';
      if (l.ton) persoHtml += ' <i class="small" style="color:var(--muted)">(' + esc(l.ton) + ')</i>';
      persoHtml += ' : ';
    }
    return '<div style="background:' + c.bg + ';border-left:4px solid ' + c.border + ';border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:4px">' +
      '<div class="row" style="gap:6px;flex-wrap:wrap">' + timeTag + flagTag + cadrage + '</div>' +
      '<div>' + persoHtml + esc(l.texte) + '</div>' +
    '</div>';
  }).join("") + '</div>';
}

function ideesHtml() {
  var h = '<header class="hero"><span class="kicker">Étape 1</span><h1>Idées</h1>' +
    '<p class="muted">Choisis une ambiance, ou laisse-toi surprendre. L\'IA te propose trois idées d\'histoires, tu en choisis une.</p></header>';
  h += '<section class="glass card"><h2>Quelle histoire ?</h2>' +
    '<div class="fld"><span class="q">Ambiance (tu peux en cocher plusieurs)</span>' +
    '<div class="chips" role="group" aria-label="Ambiance">' +
    AMBS.map(function (a) {
      return '<button type="button" class="chip small" data-act="amb" data-v="' + a.id +
        '" aria-pressed="' + (P.ambs.indexOf(a.id) >= 0) + '">' + esc(a.nom) + '</button>';
    }).join("") + '</div></div>' +
    bind("cible", P.cible, 2, "Public visé", "Exemple : filles de 9 à 16 ans, ou adultes 18-35.") +
    '<p class="small muted">Le nombre d\'épisodes, la durée et le style se règlent dans l\'onglet Univers.</p>' +
    '<div class="rowbtns">' +
    '<button type="button" class="btn big" data-act="concepts">' +
    (P.concepts.length ? "Nouvelles idées" : "Générer 3 idées") + '</button>' +
    '<button type="button" class="btn ghost big" data-act="surprise">🎲 Surprends-moi</button>' +
    '</div>' +
    '<p class="small muted">« Surprends-moi » tire au hasard deux ambiances, un lieu, un personnage, un objet et un retournement, puis écrit les idées autour.</p>' +
    '</section>';
  h += conceptsHtml();
  if (P.concepts.length) {
    h += '<section class="glass card"><button type="button" class="btn ghost big" data-act="moreconcepts">Encore 3 idées</button>' +
      '<p class="small muted">Elles s\'ajoutent à la liste, sans répéter les précédentes.</p></section>';
  }
  return h;
}

function conceptsHtml() {
  var h = "";
  P.concepts.forEach(function (c, i) {
    h += '<section class="glass card"><div class="row" style="justify-content:space-between;gap:8px">' +
      '<h3 style="min-width:0">' + esc(c.titre || "Idée " + (i + 1)) + '</h3>' +
      '<span class="badge">' + esc(has(c.ambiance) ? c.ambiance : "Idée " + (i + 1)) + '</span></div>' +
      '<p>' + esc(c.idee) + '</p>' +
      (has(c.hook) ? '<p class="small"><b>Accroche :</b> ' + esc(c.hook) + '</p>' : '') +
      (has(c.twist) ? '<p class="small"><b>Retournement :</b> ' + esc(c.twist) + '</p>' : '') +
      (has(c.chute) ? '<p class="small"><b>Fin de l\'épisode 1 :</b> ' + esc(c.chute) + '</p>' : '') +
      (has(c.pourquoi) ? '<p class="small"><b>Pourquoi ça peut marcher :</b> ' + esc(c.pourquoi) + '</p>' : '') +
      (has(c.risque) ? '<p class="small muted"><b>Risque :</b> ' + esc(c.risque) + '</p>' : '') +
      '<div class="rowbtns">' +
      '<button type="button" class="btn big" data-act="pickconcept" data-v="' + i + '">Choisir cette idée</button>' +
      '<button type="button" class="del" data-act="dropconcept" data-v="' + i + '">Écarter</button>' +
      '</div></section>';
  });
  return h;
}

function universHtml() {
  var ready = has(P.idee) && P.style.length > 0;
  var hasU = P.persos.length > 0 || has(P.concept);
  var h = '<header class="hero"><span class="kicker">Étape 2</span><h1>Univers</h1><p class="muted">Le format, l\'idée, le style visuel, la clé Agnes.</p></header>';
  h += agnesPanelHtml();
  h += '<section class="glass card"><h2>1. Mon format</h2>' +
    '<div class="fld"><span class="q">Nombre de vidéos</span><div class="chips">' +
    NBS.map(function (n) { return '<button type="button" class="chip" data-act="nb" data-v="' + n + '" aria-pressed="' + (P.nb === n) + '">' + (n === 1 ? "1 vidéo" : n + " épisodes") + '</button>'; }).join("") +
    '</div></div>' +
    '<div class="fld"><span class="q">Durée totale de la vidéo<span class="q-hint">Nombre de plans calculé automatiquement selon le script.</span></span><div class="chips">' +
    DUREES_TOTALES.map(function (x) { return '<button type="button" class="chip" data-act="duree" data-v="' + x.v + '" aria-pressed="' + (P.duree === x.v) + '">' + x.t + '</button>'; }).join("") +
    '</div></div>' +
    '<div class="fld"><span class="q">Personnages récurrents ?</span><div class="opt">' +
    RECS.map(function (r) { return '<button type="button" class="optb" data-act="rec" data-v="' + r.id + '" aria-pressed="' + (P.rec === r.id) + '"><b>' + esc(r.t) + '</b><span>' + esc(r.d) + '</span></button>'; }).join("") +
    '</div></div></section>';

  h += '<section class="glass card"><h2>2. Mon idée</h2>' +
    bind("titre", P.titre, 0, "Titre (facultatif)", "L'IA en propose un si tu laisses vide.") +
    bind("idee", P.idee, 5, "Mon idée ou mon script", "Une phrase suffit. Exemple : une laverie de quartier où chaque machine révèle un secret.") +
    '<button type="button" class="linkbtn" data-act="tab" data-v="idees">Pas d\'idée ? L\'IA en propose trois dans l\'onglet Idées</button>' +
    '</section>';

  h += '<section class="glass card"><h2>3. Mon look</h2><div class="fld"><span class="q">Styles visuels (max ' + MAX_STYLES + ')<span class="q-hint">Le style est appliqué à toutes les images et vidéos de la série.</span></span>' +
    '<input type="search" id="style-search" placeholder="🔍 Rechercher un style…" style="margin-top:8px;margin-bottom:8px">' +
    '<select id="style-add" data-act="styles-add" style="margin-bottom:8px"><option value="">+ Ajouter un style…</option>' +
    GROUPS.map(function (g, gi) {
      return '<optgroup label="' + esc(g) + '">' + STYLES.filter(function (s) { return s.g === gi; }).map(function (s) {
        return '<option value="' + s.id + '">' + (s.emoji ? s.emoji + ' ' : '') + esc(s.nom) + '</option>';
      }).join("") + '</optgroup>';
    }).join("") +
    '</select>' +
    '<div class="chips" id="style-chips">' +
    (styList().length
      ? styList().map(function (s) { return '<button type="button" class="chip small" data-act="style-remove" data-v="' + s.id + '" aria-pressed="true">✓ ' + (s.emoji ? s.emoji + ' ' : '') + esc(s.nom) + ' ✕</button>'; }).join("")
      : '<p class="small muted">Aucun style — les prompts seront génériques.</p>') +
    '</div></div>' +
    '<details class="glass acc" data-keep="1"><summary><div><b>Affiner : peau, teint, regard, sous-titres</b><br><span>' + (P.skin || P.teints.length || P.yeux.length || sousList().length > 1 ? "Réglages choisis" : "Facultatif") + '</span></div></summary><div class="in">' +
    '<div class="fld"><span class="q">Teints</span><div class="chips">' + TEINTS.map(function (k) { return '<button type="button" class="chip small" data-act="teint" data-v="' + k.id + '" aria-pressed="' + (P.teints.indexOf(k.id) >= 0) + '">' + esc(k.nom) + '</button>'; }).join("") + '</div></div>' +
    '<div class="fld"><span class="q">Regard (plusieurs possibles)</span><div class="chips">' + YEUX.map(function (k) { var arr = Array.isArray(P.yeux) ? P.yeux : []; return '<button type="button" class="chip small" data-act="yeux" data-v="' + k.id + '" aria-pressed="' + (arr.indexOf(k.id) >= 0) + '">' + esc(k.nom) + '</button>'; }).join("") + '</div></div>' +
    '<div class="fld"><span class="q">Sous-titres</span><div class="chips">' + SOUS.map(function (k) { return '<button type="button" class="chip small" data-act="sous" data-v="' + k.id + '" aria-pressed="' + (sousList().indexOf(k.id) >= 0) + '">' + esc(k.nom) + '</button>'; }).join("") + '</div></div>' +
    bind("custom", P.custom, 2, "Mon détail à moi", "Ajouté à la phrase de style.") +
    '</div></details>' +
    '<div class="fld" style="margin-top:10px"><span class="q">Phrase de style finale</span><pre class="fin">' + esc(phrase() || "Choisis un style pour la voir apparaître.") + '</pre>' + (skinPhrase() ? '<p class="small muted">Peau/teint en plus : ' + esc(skinPhrase()) + '</p>' : '') + '</div></section>';

  h += '<section class="glass card"><h2>4. Voix</h2><div class="opt">' +
    SPEECH.map(function (s) { return '<button type="button" class="optb" data-act="speech" data-v="' + s.id + '" aria-pressed="' + (P.speech === s.id) + '"><b>' + esc(s.t) + '</b><span>' + esc(s.d) + '</span></button>'; }).join("") +
    '</div></section>';

  h += '<section class="glass card"><h2>5. Générer</h2>' +
    '<div class="fld"><label class="q" for="video-engine">Moteur de génération vidéo</label><select id="video-engine">' +
    '<option value="agnes"' + (P.videoEngine === "agnes" ? " selected" : "") + '>🎬 Agnes (cloud, gratuit)</option>' +
    '<option value="wangp"' + (P.videoEngine === "wangp" ? " selected" : "") + '>🖥️ WanGP (local, PC GPU)</option>' +
    '<option value="ltx"' + (P.videoEngine === "ltx" ? " selected" : "") + '>⚡ LTX (cloud, payant)</option>' +
    '</select></div>' +
    (P.videoEngine === "wangp" ? '<div class="fld"><label class="q">URL de ton serveur WanGP</label><input type="text" id="wangp-url" data-path="wangpUrl" value="' + esc(P.wangpUrl || "") + '" placeholder="http://192.168.1.100:7860"><span class="q-hint">IP locale de ton PC + port WanGP</span></div>' : '') +
    (P.videoEngine === "ltx" ? '<div class="fld"><label class="q">Clé API LTX</label><input type="password" id="ltx-key" data-path="ltxApiKey" value="' + esc(P.ltxApiKey || "") + '" placeholder="ltx-..."></div>' : '') +
    '<button type="button" class="btn big" data-act="genuni"' + (ready ? "" : " disabled") + '>' + (hasU ? "Régénérer" : "Générer") + (P.rec === "oui" ? " le casting et l'univers" : " le concept et l'univers") + '</button>' +
    (!hasU && ready ? '<p class="small muted">Touche une fois pour générer.</p>' : '') +
    (hasU ? '<p class="small muted">Régénérer remplace tout ce qui suit.</p>' : '') +
    '</section>';

  if (hasU) {
    h += '<section class="glass card"><h2>Mon concept</h2>' +
      bind("concept", P.concept, 3, "Phrase concept") +
      bind("regle", P.regle, 2, "Règle spéciale") +
      bind("ton", P.ton, 2, "Ton") +
      bind("arc", P.arc, Math.max(3, Math.min(P.nb, 10)), P.nb === 1 ? "Déroulé" : "Arc de la série") +
      '</section>';
    if (P.rec === "oui") {
      h += '<section class="stack"><h2>Casting</h2>' + P.persos.map(function (p, i) {
        return '<details class="glass acc"><summary><div><b>' + esc(p.nom || "Sans nom") + '</b><br><span>' + esc(p.role) + '</span></div></summary><div class="in">' +
          bind("persos." + i + ".nom", p.nom, 0, "Nom") +
          bind("persos." + i + ".role", p.role, 0, "Rôle") +
          bind("persos." + i + ".caractere", p.caractere, 0, "Caractère") +
          bind("persos." + i + ".secret", p.secret, 2, "Secret") +
          bind("persos." + i + ".voix", p.voix, 2, "Voix (fr)") +
          bind("persos." + i + ".voix_en", p.voix_en, 2, "Voix (en)") +
          bind("persos." + i + ".visuel", p.visuel, 7, "Description visuelle (anglais)", "Sans le style : ajouté automatiquement.") +
          '<button type="button" class="del" data-act="delperso" data-v="' + i + '">Supprimer</button></div></details>';
      }).join("") + '<button type="button" class="btn ghost big" data-act="addperso">Ajouter un personnage</button></section>';
    }
    h += '<section class="stack"><h2>Lieux</h2>' + P.lieux.map(function (l, i) {
      return '<details class="glass acc"><summary><div><b>' + esc(l.nom || "Sans nom") + '</b></div></summary><div class="in">' +
        bind("lieux." + i + ".nom", l.nom, 0, "Nom") +
        bind("lieux." + i + ".visuel", l.visuel, 6, "Description visuelle (anglais)") +
        '<button type="button" class="del" data-act="dellieu" data-v="' + i + '">Supprimer</button></div></details>';
    }).join("") + '<button type="button" class="btn ghost big" data-act="addlieu">Ajouter un lieu</button></section>';
  }

  h += '<section class="glass card"><h2>Sauvegarde</h2>' +
    '<button type="button" class="btn ghost big" data-act="hard-reload" style="color:var(--accent-text)">🔄 Recharger l\'app (vider le cache)</button>' +
    '<button type="button" class="btn ghost big" data-act="bkfile">Télécharger ma sauvegarde</button>' +
    '<label class="btn ghost big" for="bk-file" style="display:flex;align-items:center;justify-content:center;text-align:center;cursor:pointer">Ouvrir un fichier de sauvegarde</label><input type="file" id="bk-file" accept=".json" style="position:absolute;width:1px;height:1px;opacity:0">' +
    '<textarea id="bk-in" placeholder="Colle ici une sauvegarde pour la restaurer" style="min-height:80px"></textarea>' +
    '<button type="button" class="btn ghost big" data-act="bkrestore">Restaurer</button>' +
    '<button type="button" class="btn big" data-act="reset" style="background:linear-gradient(135deg,#E85A7D,#B5348F)">🗑️ Tout effacer pour recommencer</button></section>';
  return h;
}

function refPrompt(kind, visuel) {
  if (kind === "lieu") return "Empty background plate. " + sentence(visuel) + " Wide establishing shot, eye level, no text, no logo, vertical 9:16. Deserted architectural space, photorealistic interior rendering.";
  return sentence(visuel) + " Full body, front view, neutral expression, standing, plain light grey background, no text, vertical format. " + phrase() + ".";
}
function refsHtml() {
  var all = [];
  P.persos.forEach(function (p, j) { all.push({ k: "perso", o: p, path: "persos." + j }); });
  P.lieux.forEach(function (l, j) { all.push({ k: "lieu", o: l, path: "lieux." + j }); });
  P.eps.forEach(function (ep, ei) { (ep.cast || []).forEach(function (p, j) { all.push({ k: "perso", o: p, path: "eps." + ei + ".cast." + j }); }); });
  R.refs = all;
  if (!all.length) return '<section class="glass empty"><h2>Pas encore de références</h2><p class="muted">Génère ton univers pour obtenir les prompts.</p><button type="button" class="btn" data-act="tab" data-v="univers">Aller à Univers</button></section>';
  var d = all.filter(function (x) { return x.o.ok; }).length;
  var h = '<header class="hero"><span class="kicker">Étape 3</span><h1>Références</h1><p class="muted">' + d + ' sur ' + all.length + ' faites.</p></header>';
  all.forEach(function (x, i) {
    var canGen = !!getAgnesKey();
    var alreadyHas = !!x.o.refUri;
    h += '<section class="glass card"><div class="row" style="justify-content:space-between"><h2>' + esc(x.o.nom || "Sans nom") + '</h2><span class="badge' + (x.o.ok ? " done" : "") + '">' + (x.k === "lieu" ? "Lieu" : "Personnage") + '</span></div>';

    h += '<div class="stack"><b class="small">Image de référence</b>';

    if (alreadyHas) {
      h += '<div class="plan-thumb" style="max-width:200px"><img src="' + esc(x.o.refUri) + '" alt="">' +
        '<div class="bar">' +
        '<button type="button" class="btn ghost" data-act="ref-regen-agnes" data-v="' + i + '">🎨 Régénérer avec Agnes</button>' +
        '<button type="button" class="btn ghost" data-act="ref-change" data-v="' + i + '">🔄 Remplacer</button>' +
        '<button type="button" class="btn ghost" data-act="ref-clear" data-v="' + i + '" style="color:var(--warn)">🗑️</button></div></div>';
    } else if (x.o.refStatus === "busy") {
      h += '<div class="badge" style="display:block;text-align:center;padding:12px">⏳ ' + esc(x.o.refMsg || "Agnes dessine…") + '</div>';
    } else if (x.o.refStatus === "err") {
      h += '<div class="warnbox"><h3>Échec</h3><p class="small">' + esc(x.o.refError || "") + '</p></div>' +
        '<button type="button" class="btn big" data-act="ref-regen-agnes" data-v="' + i + '">🔁 Réessayer avec Agnes</button>';
    } else {
      h += '<button type="button" class="btn big" data-act="ref-regen-agnes" data-v="' + i + '"' + (canGen ? "" : " disabled") + '>🎨 Générer avec Agnes</button>' +
        '<p class="small muted" style="text-align:center;margin:8px 0">— ou —</p>' +
        '<button type="button" class="plan-drop" data-act="ref-upload" data-v="' + i + '">📥 Télécharger une image (ChatGPT, Gemini…)</button>' +
        '<p class="small muted">' + (canGen ? "Agnes utilise le prompt ci-dessous." : "Ajoute ta clé Agnes dans l'onglet Univers pour générer ici.") + '</p>';
    }

    h += '<input type="file" class="ref-file-input" id="rf-in-' + i + '" accept="image/*" data-v="' + i + '" style="display:none">';
    h += '<p class="small muted">Cette image garantit la cohérence du ' + (x.k === "lieu" ? "décor" : "visage") + ' dans tous les plans.</p></div>';

    h += '<div class="stack"><b class="small">Prompt (anglais)</b><pre class="fin" id="rf' + i + '">' + esc(refPrompt(x.k, x.o.visuel)) + '</pre><button type="button" class="btn ghost" data-act="copypre" data-v="rf' + i + '">📋 Copier le prompt</button></div>';

    h += '<button type="button" class="chip" data-act="refok" data-v="' + i + '" aria-pressed="' + !!x.o.ok + '">' + (x.o.ok ? "✓ Référence faite" : "Marquer comme faite") + '</button>';

    h += '<details class="glass acc"><summary><div><b>Modifier</b></div></summary><div class="in">' +
      bind(x.path + ".nom", x.o.nom, 0, "Nom") +
      bind(x.path + ".visuel", x.o.visuel, 6, "Description visuelle (anglais)") +
      '</div></details></section>';
  });
  return h;
}

function epsHtml() {
  var h = '<header class="hero"><span class="kicker">Étape 4</span><h1>' + (P.nb === 1 ? "Ma vidéo" : "Épisodes") + '</h1><p class="muted">' + (P.nb === 1 ? "Un script, des plans, un montage." : P.eps.length + " sur " + P.nb + " créés.") + '</p></header>';
  if (!canScript()) h += '<div class="warnbox"><h3>Commence par l\'Univers</h3><p class="small">Écris ton idée et génère ton univers d\'abord.</p></div>';
  if (canScript() && todoEps().length) {
    h += '<section class="glass card"><h2>Tout préparer</h2><p class="small muted">Script, plans, prompts et montage pour chaque épisode manquant.</p><button type="button" class="btn big" data-act="genseason">Préparer ' + todoEps().length + (todoEps().length > 1 ? " épisodes" : " épisode") + '</button></section>';
  }
  if (!P.eps.length) h += '<section class="glass empty"><h2>Aucun épisode</h2><p class="muted">Crée le premier épisode.</p></section>';
  P.eps.forEach(function (e) {
    var pl = e.plans.filter(function (p) { return !p.reserve; });
    var cl = pl.filter(function (p) { return p.st === 2; }).length;
    h += '<button type="button" class="glass chrow" data-act="openep" data-v="' + e.n + '"><span class="n">' + e.n + '</span><span class="t"><b>' + esc(e.titre || (P.nb === 1 ? "Ma vidéo" : "Épisode " + e.n)) + '</b><span>' + (has(e.script) ? "Script fait" : "Script à écrire") + ' · ' + (pl.length ? cl + "/" + pl.length + " clips" : "plans à faire") + (has(e.montage) ? " · montage prêt" : "") + '</span></span></button>';
  });
  return h + (P.eps.length < P.nb ? '<button type="button" class="btn big" data-act="newep">' + (P.nb === 1 ? "Créer la vidéo" : "Nouvel épisode") + '</button>' : '');
}

function cinemaPanelHtml(ep) {
  if (!ep) return "";
  var i = P.eps.indexOf(ep);
  return '<details class="glass acc" data-keep="1" id="cinema-' + i + '"><summary><div><b>🎬 Réglages cinéma</b><br><span>' + (P.effets.length || P.cam ? "Personnalisés" : "Par défaut") + '</span></div></summary><div class="in">' +
    '<p class="small muted">Ces réglages s\'appliquent à tous les plans de cet épisode.</p>' +
    ["Lumière", "Image", "Couleur"].map(function (g) {
      return '<div class="fld"><span class="q">' + g + '</span><div class="chips">' + EFFETS.filter(function (x) { return x.g === g; }).map(function (k) {
        return '<button type="button" class="chip small" data-act="effet" data-v="' + k.id + '" aria-pressed="' + (P.effets.indexOf(k.id) >= 0) + '">' + esc(k.nom) + '</button>';
      }).join("") + '</div></div>';
    }).join("") +
    '<div class="fld"><label class="q" for="cam">Caméra : mouvement dominant</label><select id="cam"><option value="">Au choix</option>' + CAMS.map(function (c) { return '<option value="' + c.id + '"' + (P.cam === c.id ? " selected" : "") + '>' + esc(c.nom) + '</option>'; }).join("") + '</select></div>' +
    '<div class="fld"><span class="q">Phrase de style finale (aperçu)</span><pre class="fin">' + esc(phrase() || "Aucun style choisi.") + '</pre></div>' +
    '</div></details>';
}

var STAT = ["À faire", "Photo prête", "Clip prêt"];
function planPhotoHtml(i, j, p) {
  if (p.photoUri) {
    return '<div class="plan-thumb"><img src="' + esc(p.photoUri) + '" alt="">' +
      '<div class="bar"><button type="button" class="btn ghost" data-act="plan-photo-change" data-i="' + i + '" data-j="' + j + '">🔄 Changer</button>' +
      '<button type="button" class="btn ghost" data-act="plan-photo-clear" data-i="' + i + '" data-j="' + j + '" style="color:var(--warn)">🗑️ Retirer</button></div></div>';
  }
  if (p.photoStatus === "busy") return '<div class="badge" style="display:block;text-align:center;padding:12px">⏳ ' + esc(p.photoMsg || "Agnes dessine…") + '</div>';
  if (p.photoStatus === "err") return '<div class="warnbox"><h3>Échec</h3><p class="small">' + esc(p.photoError || "") + '</p></div><button type="button" class="btn big" data-act="plan-photo-gen" data-i="' + i + '" data-j="' + j + '">🔁 Réessayer</button>';
  var canGen = !!getAgnesKey();
  return '<button type="button" class="btn big" data-act="plan-photo-gen" data-i="' + i + '" data-j="' + j + '"' + (canGen ? "" : " disabled") + '>🎨 Générer la photo avec Agnes</button>' +
    '<p class="small muted" style="text-align:center;margin:8px 0">— ou —</p>' +
    '<button type="button" class="plan-drop" data-act="plan-photo-upload" data-i="' + i + '" data-j="' + j + '">📥 Télécharger une photo (ChatGPT, Gemini…)</button>' +
    '<input type="file" class="plan-file-input" id="pf-' + i + '-' + j + '" accept="image/*" data-i="' + i + '" data-j="' + j + '" style="display:none">' +
    '<p class="small muted">' + (canGen ? "Agnes utilise le prompt image ci-dessus." : "Ajoute ta clé Agnes dans l'onglet Univers pour générer ici.") + '</p>';
}
function planVideoHtml(i, j, p) {
  if (!p.photoUri) return '<p class="small muted">Dépose d\'abord une photo.</p>';
  if (p.videoStatus === "busy") return '<div class="badge" style="display:block;text-align:center;padding:12px">⏳ ' + esc(p.videoMsg || "En cours…") + '</div>';
  if (p.videoStatus === "err") return '<div class="warnbox"><h3>Échec</h3><p class="small">' + esc(p.videoError || "") + '</p></div><button type="button" class="btn big" data-act="plan-video-gen" data-i="' + i + '" data-j="' + j + '">🔁 Réessayer</button>';
  if (p.videoUrl) {
    return '<div class="plan-thumb"><video src="' + esc(p.videoUrl) + '" controls playsinline preload="metadata"></video>' +
      '<div class="bar"><button type="button" class="btn ghost" data-act="plan-video-gen" data-i="' + i + '" data-j="' + j + '">🔁 Régénérer</button>' +
      '<a class="btn ghost" href="' + esc(p.videoUrl) + '" download="plan-' + p.n + '.mp4" target="_blank" rel="noopener">⬇ Télécharger</a></div></div>';
  }
  var canGen = (P.videoEngine === "agnes" && getAgnesKey()) || P.videoEngine === "wangp" || (P.videoEngine === "ltx" && P.ltxApiKey);
  return '<button type="button" class="btn big" data-act="plan-video-gen" data-i="' + i + '" data-j="' + j + '"' + (canGen ? "" : " disabled") + '>🎬 Générer la vidéo (' + P.videoEngine + ')</button>' +
    '<p class="small muted">' + (canGen ? "Utilise la photo + le prompt vidéo." : "Configure le moteur dans l'onglet Univers.") + '</p>';
}
function planRefsHtml(p) {
  var noms = String(p.persos || "").split(/[,;]/).map(function (n) { return n.trim(); }).filter(Boolean);
  var thumbs = [];
  noms.forEach(function (nom) {
    var c = persoBy(nom);
    if (!c) return;
    if (c.refUri) {
      thumbs.push('<div style="text-align:center"><img src="' + esc(c.refUri) + '" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:12px;border:2px solid var(--accent-a)"><div class="small" style="font-size:.7rem;margin-top:2px">' + esc(c.nom) + '</div></div>');
    } else {
      thumbs.push('<div style="text-align:center"><div style="width:64px;height:64px;border-radius:12px;border:2px dashed var(--warn);display:grid;place-items:center;font-size:1.4rem;color:var(--warn)">?</div><div class="small" style="font-size:.7rem;margin-top:2px">' + esc(c.nom) + '</div></div>');
    }
  });
  if (p.lieu) {
    var l = findLieu(p.lieu);
    if (l && l.refUri) {
      thumbs.push('<div style="text-align:center"><img src="' + esc(l.refUri) + '" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:12px;border:2px solid var(--accent-b)"><div class="small" style="font-size:.7rem;margin-top:2px">📍 ' + esc(l.nom) + '</div></div>');
    }
  }
  if (!thumbs.length) return "";
  return '<div class="stack"><b class="small">📎 Images à joindre au prompt image</b><div class="row" style="gap:10px;flex-wrap:wrap">' + thumbs.join("") + '</div><p class="small muted">Copie le prompt, puis joins ces images dans ChatGPT / Gemini.</p></div>';
}
function epHtml(e) {
  if (!e) return '<section class="glass empty"><p>Épisode introuvable.</p><button type="button" class="btn" data-act="epback">Retour</button></section>';
  var pl = e.plans, i = P.eps.indexOf(e);
  var h = '<button type="button" class="back" data-act="epback">‹ Tous les épisodes</button>' +
    '<header class="hero"><span class="kicker">' + (P.nb === 1 ? "Vidéo" : "Épisode " + e.n + " / " + P.nb) + '</span><h1>' + esc(e.titre || (P.nb === 1 ? "Ma vidéo" : "Épisode " + e.n)) + '</h1></header>';
  h += cinemaPanelHtml(e);
  h += '<section class="glass card"><h2>Tout en un clic</h2><p class="small muted">Script → Plans → Photos → Vidéos → Montage. Cette opération peut prendre 20 à 40 minutes pour un épisode complet. Garde l\'écran ouvert.</p><button type="button" class="btn big" data-act="genall" data-v="' + e.n + '"' + (canScript() ? "" : " disabled") + '>🚀 Tout préparer pour cet épisode</button></section>';
  h += '<section class="glass card"><h2>1. Script</h2>' +
    bind("eps." + i + ".titre", e.titre, 0, "Titre") +
    bind("eps." + i + ".note", e.note, 2, "Note pour cette vidéo") +
    '<button type="button" class="btn big" data-act="genscript" data-v="' + e.n + '"' + (canScript() ? "" : " disabled") + '>' + (has(e.script) ? "Réécrire le script" : "Écrire le script") + '</button>' +
    (has(e.script)
      ? '<div class="stack"><b class="small">📜 Aperçu en blocs</b>' + scriptBlocksHtml(e.script) + '</div>' +
        '<details class="stack"><summary class="small" style="cursor:pointer;padding:6px 0"><b>✏️ Modifier le script à la main</b></summary>' +
        bind("eps." + i + ".script", e.script, 12, "") +
        '</details>' +
        bind("eps." + i + ".resume", e.resume, 3, "Résumé") +
        bind("eps." + i + ".fin", e.fin, 2, "Question de fin")
      : '') +
    '</section>';
  if (e.cast && e.cast.length) {
    h += '<section class="glass card"><h2>Personnages de cette vidéo</h2>' +
      e.cast.map(function (p) { return '<p class="small"><b>' + esc(p.nom) + '</b> ' + (p.role ? '(' + esc(p.role) + ')' : '') + '</p>'; }).join("") +
      '</section>';
  }
  h += '<section class="stack"><h2>2. Plans</h2>';
  if (!pl.length) {
    h += '<div class="glass card"><p class="muted small">Découpe le script en plans.</p><button type="button" class="btn big" data-act="genplans" data-v="' + e.n + '"' + (has(e.script) ? "" : " disabled") + '>Découper en plans</button></div>';
  } else {
    var main = pl.filter(function (p) { return !p.reserve; });
    var cl = main.filter(function (p) { return p.st === 2; }).length;
    var ph = main.filter(function (p) { return p.photoUri; }).length;
    var totalDur = main.reduce(function (t, p) { return t + (p.duree || 0); }, 0);
    h += '<div class="glass card"><b>' + cl + ' clips prêts · ' + ph + ' photos · ' + main.length + ' plans · ' + totalDur + ' s au total</b>' +
      '<div class="bar"><i style="width:' + Math.round(cl / main.length * 100) + '%"></i></div>' +
      '<div class="rowbtns" style="margin-top:10px">' +
      '<button type="button" class="btn" data-act="genallphotos" data-v="' + e.n + '"' + (getAgnesKey() ? "" : " disabled") + '>🎨 Générer toutes les photos</button>' +
      '<button type="button" class="btn ghost" data-act="copyimgs" data-v="' + e.n + '">📋 Copier tous les prompts image</button>' +
      '<button type="button" class="btn ghost" data-act="copyvids" data-v="' + e.n + '">📋 Copier tous les prompts vidéo</button>' +
      '</div></div>';
    pl.forEach(function (p, j) {
      var pre = "eps." + i + ".plans." + j + ".";
      h += '<details class="glass acc"><summary><div class="shot-h"><b>Plan ' + esc(p.n) + (p.reserve ? " (réserve)" : "") + ' · ' + esc(p.duree) + ' s · ' + esc(p.lieu) + (p.cadrage ? " · " + esc(p.cadrage) : "") + '</b><span>' + esc(p.action) + '</span></div><span class="badge' + (p.st === 2 ? " done" : "") + '">' + STAT[p.st] + '</span></summary><div class="in">' +
        '<div class="chips">' + STAT.map(function (s, k) { return '<button type="button" class="chip small" data-act="shotst" data-i="' + i + '" data-j="' + j + '" data-v="' + k + '" aria-pressed="' + (p.st === k) + '">' + s + '</button>'; }).join("") + '</div>' +
        planRefsHtml(p) +
        '<div class="stack"><b class="small">Prompt image</b><pre class="fin" id="pi-' + i + '-' + j + '">' + esc(imagePrompt(p)) + '</pre>' +
          '<div class="rowbtns">' +
            '<button type="button" class="btn ghost" data-act="copypre" data-v="pi-' + i + '-' + j + '">📋 Copier simple</button>' +
            '<button type="button" class="btn" data-act="copypre-coherent" data-i="' + i + '" data-j="' + j + '">📋 Copier + note cohérence</button>' +
          '</div>' +
        '</div>' +
        '<div class="stack"><b class="small">Photo du plan</b><div id="ph-' + i + '-' + j + '">' + planPhotoHtml(i, j, p) + '</div></div>' +
        '<div class="stack"><b class="small">Prompt vidéo</b><pre class="fin" id="pv-' + i + '-' + j + '">' + esc(videoPrompt(p)) + '</pre><button type="button" class="btn big" data-act="copypre" data-v="pv-' + i + '-' + j + '">📋 Copier le prompt vidéo</button></div>' +
        '<div class="stack"><b class="small">Vidéo (' + P.videoEngine + ')</b><div id="vv-' + i + '-' + j + '">' + planVideoHtml(i, j, p) + '</div></div>' +
        '<details><summary class="small"><b>Modifier ce plan</b></summary><div class="stack" style="margin-top:10px">' +
        bind(pre + "action", p.action, 2, "Action (anglais)") +
        bind(pre + "lieu", p.lieu, 0, "Lieu") +
        bind(pre + "cadrage", p.cadrage, 0, "Cadrage (anglais)") +
        bind(pre + "replique", p.replique, 2, "Réplique (français)") +
        bind(pre + "qui", p.qui, 0, "Qui parle") +
        bind(pre + "emotion", p.emotion, 0, "Émotion (anglais)") +
        bind(pre + "pi", p.pi, 4, "Prompt image (anglais)") +
        bind(pre + "pv", p.pv, 3, "Prompt vidéo (anglais)") +
        '</div></details></div></details>';
    });
    h += '<button type="button" class="btn ghost big" data-act="genplans" data-v="' + e.n + '">Refaire le découpage</button>';
  }
  h += '</section>';
  h += '<section class="glass card"><h2>3. Montage et publication</h2>' +
    '<button type="button" class="btn big" data-act="genmont" data-v="' + e.n + '"' + (pl.length ? "" : " disabled") + '>' + (has(e.montage) ? "Refaire le montage" : "Préparer le montage") + '</button>' +
    (has(e.montage) ? '<button type="button" class="btn ghost big" data-act="montopen" data-v="' + e.n + '">Ouvrir le montage</button>' : '') +
    '<button type="button" class="btn ghost big" data-act="ffmpeg-ep" data-v="' + e.n + '"' + (pl.filter(function (p) { return p.videoUrl; }).length >= 2 ? "" : " disabled") + '>🎬 Assembler la vidéo finale (FFmpeg)</button>' +
    '<button type="button" class="btn ghost big" data-act="copylist" data-v="' + e.n + '"' + (pl.filter(function (p) { return p.videoUrl; }).length >= 1 ? "" : " disabled") + '>📋 Copier la liste des clips (montage manuel)</button>' +
    (e.finalVideoUrl ? '<div class="plan-thumb" style="margin-top:10px"><video src="' + esc(e.finalVideoUrl) + '" controls playsinline></video><div class="bar"><a class="btn ghost" href="' + esc(e.finalVideoUrl) + '" download="' + esc(e.titre || ("episode-" + e.n)) + '.mp4" target="_blank" rel="noopener">⬇ Télécharger la vidéo finale</a></div></div>' : '') +
    (e.finalVideoStatus === "busy" ? '<div class="badge" style="display:block;text-align:center;padding:12px">⏳ ' + esc(e.finalVideoError || "Assemblage en cours…") + '</div>' : '') +
    '</section>';
  h += '<section class="glass card"><h2>4. Bilan</h2>' +
    '<div class="two">' + bind("eps." + i + ".stats.vues", e.stats.vues, 0, "Vues") + bind("eps." + i + ".stats.r3", e.stats.r3, 0, "Encore là à 3s (%)") + '</div>' +
    '<div class="two">' + bind("eps." + i + ".stats.moy", e.stats.moy, 0, "Durée moyenne (s)") + bind("eps." + i + ".stats.part", e.stats.part, 0, "Partages") + '</div>' +
    bind("eps." + i + ".stats.comm", e.stats.comm, 3, "Commentaires (facultatif)") +
    '<button type="button" class="btn big" data-act="bilan" data-v="' + e.n + '"' + (has(e.stats.vues) || has(e.stats.r3) ? "" : " disabled") + '>' + (has(e.bilan) ? "Refaire le bilan" : "Analyser") + '</button>' +
    (has(e.bilan) ? bind("eps." + i + ".bilan", e.bilan, 6, "Diagnostic") : '') +
    '</section>';
  return h;
}

function mdInline(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(?!\s)([^*]+?)\*/g, "<i>$1</i>"); }
function mdRender(text) {
  var L = String(text || "").replace(/\r/g, "").split("\n"), out = [], i = 0, m, buf;
  while (i < L.length) {
    var l = L[i];
    if (!l.trim()) { i++; continue; }
    if ((m = /^(#{1,6})\s+(.*)$/.exec(l))) { out.push(m[1].length <= 2 ? "<h3>" + mdInline(m[2]) + "</h3>" : "<h4>" + mdInline(m[2]) + "</h4>"); i++; continue; }
    if (/^\s*[-*•]\s+/.test(l)) { buf = []; while (i < L.length && /^\s*[-*•]\s+/.test(L[i])) { buf.push("<li>" + mdInline(L[i].replace(/^\s*[-*•]\s+/, "")) + "</li>"); i++; } out.push("<ul>" + buf.join("") + "</ul>"); continue; }
    if (/^\s*\d+[.)]\s+/.test(l)) { buf = []; while (i < L.length && /^\s*\d+[.)]\s+/.test(L[i])) { buf.push("<li>" + mdInline(L[i].replace(/^\s*\d+[.)]\s+/, "")) + "</li>"); i++; } out.push("<ol>" + buf.join("") + "</ol>"); continue; }
    out.push("<p>" + mdInline(l.trim()) + "</p>"); i++;
  }
  return out.join("");
}
function montView(ep) {
  var h = '<button type="button" class="back" data-act="montclose">‹ Retour à l\'épisode</button>' +
    '<header class="hero"><h1>Montage et publication</h1><p class="muted">' + esc(ep.titre || "") + '</p></header>';
  if (!has(ep.montage)) return h + '<div class="glass card"><p class="muted small">Pas encore préparé.</p><button type="button" class="btn big" data-act="genmont" data-v="' + ep.n + '">Préparer le montage</button></div>';
  h += '<section class="glass card stack"><div class="md">' + mdRender(ep.montage) + '</div><button type="button" class="btn ghost big" data-act="copymall" data-v="' + ep.n + '">📋 Copier tout</button></section>';
  return h;
}

/* ============================================================
   ÉVÉNEMENTS — CLIC
   ============================================================ */
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
  var a = b.getAttribute("data-act"), v = b.getAttribute("data-v");
  if (a === "stop") { if (R.chain) R.chain.stop = true; R.busy = null; overlay(); return; }
  if (!$v.contains(b) && a !== "stop") return;

  if (a === "nav-prev") { goPrev(); return; }
  else if (a === "nav-next") { goNext(); return; }
  else if (a === "tab") { go(v); }
  else if (a === "speech") { P.speech = v; save(); render(); }
  else if (a === "nb") { P.nb = +v; save(); render(); }
  else if (a === "duree") { P.duree = +v; save(); render(); }
  else if (a === "rec") { P.rec = v; save(); render(); }
  else if (a === "yeux") {
    var y = Array.isArray(P.yeux) ? P.yeux : (P.yeux ? [P.yeux] : []);
    var yi = y.indexOf(v);
    if (yi >= 0) y.splice(yi, 1); else y.push(v);
    P.yeux = y;
    save(); render();
  }
  else if (a === "teint") { var ti = P.teints.indexOf(v); if (ti >= 0) P.teints.splice(ti, 1); else P.teints.push(v); save(); render(); }
  else if (a === "effet") { var ei = P.effets.indexOf(v); if (ei >= 0) P.effets.splice(ei, 1); else if (P.effets.length >= 3) { toast("3 effets max."); return; } else P.effets.push(v); save(); render(); }
  else if (a === "sous") {
    var sl = sousList();
    var si = sl.indexOf(v);
    if (si >= 0) sl.splice(si, 1); else sl.push(v);
    P.sous = sl.length ? sl : ["U1"];
    save(); render();
  }
  else if (a === "amb") { var ai = P.ambs.indexOf(v); if (ai >= 0) P.ambs.splice(ai, 1); else P.ambs.push(v); save(); render(); }
  else if (a === "concepts") { genConcepts(); }
  else if (a === "surprise") { genConcepts({ surprise: true }); }
  else if (a === "moreconcepts") { genConcepts({ more: true }); }
  else if (a === "dropconcept") { P.concepts.splice(+v, 1); save(); render(); }
  else if (a === "pickconcept") {
    var cc = P.concepts[+v];
    if (cc) {
      P.idee = cc.idee +
        (has(cc.hook) ? "\nAccroche de l'épisode 1 : " + cc.hook : "") +
        (has(cc.twist) ? "\nRetournement : " + cc.twist : "") +
        (has(cc.chute) ? "\nFin de l'épisode 1 : " + cc.chute : "");
      if (has(cc.titre)) P.titre = cc.titre;
      if (has(cc.ambiance)) P.genre = cc.ambiance;
      save();
      toast("Idée choisie. Choisis un style puis génère ton univers.");
      go("univers");
    }
  }
  else if (a === "agnes-save") { saveAgnesKey(); }
  else if (a === "style-remove") {
    if (!Array.isArray(P.style)) P.style = P.style ? [P.style] : [];
    var sri = P.style.indexOf(v);
    if (sri >= 0) P.style.splice(sri, 1);
    save(); render();
  }
  else if (a === "genuni") { if (P.persos.length && !arm("uni", "Touche encore pour tout remplacer.")) return; genUnivers(); }
  else if (a === "addperso") { P.persos.push({ id: uid(), nom: "", role: "", caractere: "", secret: "", voix: "", voix_en: "", visuel: "", ok: false }); save(); render(); }
  else if (a === "addlieu") { P.lieux.push({ id: uid(), nom: "", visuel: "", ok: false }); save(); render(); }
  else if (a === "delperso") { if (arm("dp" + v)) { P.persos.splice(+v, 1); save(); render(); } }
  else if (a === "dellieu") { if (arm("dl" + v)) { P.lieux.splice(+v, 1); save(); render(); } }
  else if (a === "copypre") { var pre = document.getElementById(v); if (pre) copyText(pre.textContent, pre, "Prompt copié."); }
  else if (a === "refok") { var o = R.refs[+v].o; o.ok = !o.ok; save(); render(); }
  else if (a === "newep") { var n = P.eps.length + 1; P.eps.push(newEp(n)); save(); go("eps", n); }
  else if (a === "openep") { go("eps", +v); }
  else if (a === "epback") { go("eps"); }
  else if (a === "genscript") { var ep = epBy(+v); if (has(ep.script) && !arm("gs" + v)) return; genScript(ep); }
  else if (a === "genplans") { var ep2 = epBy(+v); if (ep2.plans.length && !arm("gp" + v)) return; genPlans(ep2); }
  else if (a === "genmont") { var ep3 = epBy(+v); if (has(ep3.montage) && !arm("gm" + v)) return; genMontage(ep3); }
  else if (a === "shotst") {
    var pls = P.eps[+b.getAttribute("data-i")].plans[+b.getAttribute("data-j")];
    pls.st = +v;
    save(); render();
  }
  else if (a === "plan-photo-upload" || a === "plan-photo-change") {
    var inp = document.getElementById("pf-" + b.getAttribute("data-i") + "-" + b.getAttribute("data-j"));
    if (inp) inp.click();
  }
  else if (a === "plan-photo-clear") { planClearPhoto(+b.getAttribute("data-i"), +b.getAttribute("data-j")); }
  else if (a === "ref-regen-agnes") {
    var rr = R.refs[+v];
    if (rr) refGenerate(rr.k, rr.o.id);
  }
  else if (a === "ref-upload" || a === "ref-change") {
    var rIn = document.getElementById("rf-in-" + v);
    if (rIn) rIn.click();
  }
  else if (a === "ref-clear") { var r = R.refs[+v]; if (r) refClear(r.k, r.o.id); }
  else if (a === "copypre-coherent") {
    var ci = +b.getAttribute("data-i"), cj = +b.getAttribute("data-j");
    var cpl = P.eps[ci] && P.eps[ci].plans[cj];
    if (cpl) copyAll(imagePromptWithCoherence(cpl), "Prompt + note cohérence copiés. Joins les images de référence.");
  }
  else if (a === "genallphotos") { planGenerateAllPhotos(+v); }
  else if (a === "plan-photo-gen") { planGeneratePhoto(+b.getAttribute("data-i"), +b.getAttribute("data-j")); }
  else if (a === "plan-video-gen") { planGenerateVideo(+b.getAttribute("data-i"), +b.getAttribute("data-j")); }
  else if (a === "genseason") { genSeason(); }
  else if (a === "genall") {
    var eg = epBy(+v);
    if (!eg) return;
    if (!confirm("Tout préparer va générer le script, les plans, PUIS toutes les photos et vidéos.\n\n⚠️ Les vidéos prennent environ 1 à 2 minutes chacune. Un épisode de 12 plans = 20 à 30 minutes.\n\nContinuer ?")) return;
    runChain(function () {
      return chainEpisode(eg.n, P.nb === 1 ? "La vidéo" : "Épisode " + eg.n, { videos: true });
    });
  }
  else if (a === "copyimgs") {
    var ei2 = epBy(+v);
    if (ei2) copyAll(ei2.plans.filter(function (p) { return !p.reserve; }).map(function (p) { return "PLAN " + p.n + " (" + p.duree + " s)\n" + imagePrompt(p); }).join("\n\n"), "Prompts image copiés.");
  }
  else if (a === "copyvids") {
    var ev2 = epBy(+v);
    if (ev2) copyAll(ev2.plans.filter(function (p) { return !p.reserve; }).map(function (p) { return "PLAN " + p.n + " (" + p.duree + " s)\n" + videoPrompt(p); }).join("\n\n"), "Prompts vidéo copiés.");
  }
  else if (a === "montopen") { R.mont = true; R.ep = +v; render(); window.scrollTo(0, 0); }
  else if (a === "montclose") { R.mont = false; render(); }
  else if (a === "copymall") { var em = epBy(+v); if (em) copyAll(em.montage, "Texte copié."); }
  else if (a === "bilan") { var eb = epBy(+v); if (eb) genBilan(eb); }
  else if (a === "copylist") {
    var el = epBy(+v);
    if (!el) return;
    var clips = el.plans.filter(function (p) { return !p.reserve && p.videoUrl; }).map(function (p, k) {
      return "Plan " + (k + 1) + " (" + p.n + ") : " + p.videoUrl;
    });
    copyAll(clips.join("\n"), clips.length + " clip" + (clips.length > 1 ? "s" : "") + " copiés. Colle cette liste quelque part, ouvre chaque lien et enregistre.");
  }
  else if (a === "hard-reload") {
    if (confirm("Recharger l'app ? Les modifications du code seront prises en compte.")) {
      if ('caches' in window) {
        caches.keys().then(function (names) {
          Promise.all(names.map(function (n) { return caches.delete(n); })).then(function () {
            location.reload(true);
          });
        });
      } else {
        location.reload(true);
      }
    }
  }
  else if (a === "ffmpeg-ep") {
    var ef = epBy(+v);
    if (!ef) return;
    ef.finalVideoStatus = "busy";
    ef.finalVideoError = "Préparation…";
    save(); render();
    (async function () {
      try {
        var url = await ffmpegConcatenate(ef, function (msg) {
          ef.finalVideoError = msg;
          var el2 = document.querySelector('#view .badge');
          if (el2 && el2.textContent.indexOf("⏳") === 0) el2.textContent = "⏳ " + msg;
        });
        ef.finalVideoUrl = url;
        ef.finalVideoStatus = "done";
        ef.finalVideoError = "";
        save(); render(); toast("Vidéo finale assemblée.");
      } catch (err) {
        ef.finalVideoStatus = "err";
        ef.finalVideoError = (err.message || "").slice(0, 120);
        save(); render();
        toast("Échec FFmpeg : " + ef.finalVideoError);
      }
    })();
  }
  else if (a === "bkfile") {
    var data = JSON.stringify(P, null, 1);
    var blob = new Blob([data], { type: "application/json" });
    var a2 = document.createElement("a");
    a2.href = URL.createObjectURL(blob);
    a2.download = "fabrique-sauvegarde.json";
    document.body.appendChild(a2);
    a2.click();
    document.body.removeChild(a2);
    toast("Sauvegarde téléchargée.");
  }
  else if (a === "bkrestore") {
    try {
      var d2 = JSON.parse(document.getElementById("bk-in").value);
      var f2 = fresh();
      P = f2;
      for (var k2 in f2) P[k2] = d2[k2] !== undefined ? d2[k2] : f2[k2];
      fixEps(); save(); render();
      toast("Sauvegarde restaurée.");
    } catch (err) { toast("Sauvegarde illisible."); }
  }
  else if (a === "reset") {
    if (arm("reset", "Touche encore : TOUT sera effacé (photos, références, scripts).")) {
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
        } catch (e) { console.warn("Reset IndexedDB :", e); }
        P = fresh();
        save();
        go("univers");
        toast("Tout est effacé. Nouvelle histoire !");
      })();
    }
  }
});

/* ============================================================
   ÉVÉNEMENTS — SAISIE
   ============================================================ */
document.addEventListener("input", function (e) {
  var el = e.target;
  if (el.id === "style-search") {
    var q = String(el.value || "").toLowerCase().trim();
    var sel = document.getElementById("style-add");
    if (!sel) return;
    Array.prototype.forEach.call(sel.querySelectorAll("optgroup"), function (grp) {
      var visible = 0;
      Array.prototype.forEach.call(grp.querySelectorAll("option"), function (opt) {
        var match = !q || opt.textContent.toLowerCase().indexOf(q) >= 0;
        opt.style.display = match ? "" : "none";
        if (match) visible++;
      });
      grp.style.display = visible ? "" : "none";
    });
    return;
  }
  if (el.hasAttribute("data-path")) {
    setPath(P, el.getAttribute("data-path"), el.value);
    save();
    var m = /^eps\.(\d+)\.plans\.(\d+)\./.exec(el.getAttribute("data-path"));
    if (m) {
      var pl = P.eps[+m[1]].plans[+m[2]];
      var a = document.getElementById("pi-" + m[1] + "-" + m[2]);
      var b = document.getElementById("pv-" + m[1] + "-" + m[2]);
      if (a) a.textContent = imagePrompt(pl);
      if (b) b.textContent = videoPrompt(pl);
    }
    refreshStrip();
  }
});

/* ============================================================
   ÉVÉNEMENTS — CHANGEMENT
   ============================================================ */
document.addEventListener("change", function (e) {
  var id = e.target.id;
  if (id === "style-add") {
    var v = e.target.value;
    if (v) {
      if (!Array.isArray(P.style)) P.style = P.style ? [P.style] : [];
      if (P.style.length >= MAX_STYLES) { toast("Max " + MAX_STYLES + " styles. Retires-en un d'abord."); e.target.value = ""; return; }
      if (P.style.indexOf(v) < 0) P.style.push(v);
      save(); render();
    }
    return;
  }
  if (id === "cam") { P.cam = e.target.value; save(); }
  else if (id === "video-engine") { P.videoEngine = e.target.value; save(); render(); }
  else if (id === "bk-file") {
    var f = e.target.files[0];
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function (ev) {
      try {
        var d3 = JSON.parse(ev.target.result);
        var f3 = fresh();
        P = f3;
        for (var k3 in f3) P[k3] = d3[k3] !== undefined ? d3[k3] : f3[k3];
        fixEps(); save(); render();
        toast("Sauvegarde ouverte.");
      } catch (err) { toast("Fichier invalide."); }
    };
    rd.readAsText(f);
    e.target.value = "";
  }
  else if (e.target.classList && e.target.classList.contains("plan-file-input")) {
    planUploadPhoto(+e.target.getAttribute("data-i"), +e.target.getAttribute("data-j"), e.target.files[0]);
    e.target.value = "";
  }
  else if (e.target.classList && e.target.classList.contains("ref-file-input")) {
    var rv = +e.target.getAttribute("data-v");
    var ro = R.refs[rv];
    if (ro) refUpload(ro.k, ro.o.id, e.target.files[0]);
    e.target.value = "";
  }
});

document.querySelectorAll(".dock button").forEach(function (b) {
  b.addEventListener("click", function () { go(b.getAttribute("data-tab")); });
});

/* ============================================================
   INITIALISATION
   ============================================================ */
load();
render();
setTimeout(planPhotosRestore, 800);
setTimeout(refsRestoreAll, 900);
