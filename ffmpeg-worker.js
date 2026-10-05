/* ============================================================
   Fabrik des Idées : FFmpeg Worker (placeholder V2)
   Sera complété avec ffmpeg.wasm dans une prochaine mise à jour
   ============================================================ */

self.onmessage = function (event) {
  self.postMessage({
    type: 'info',
    message: 'FFmpeg worker chargé, mais pas encore actif.'
  });
};