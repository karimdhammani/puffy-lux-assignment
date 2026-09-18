// Aggregate visits only. No visitor identifier, full URL, or referrer is sent.
(() => {
  'use strict';
  const site = 'https://karimdhammani.github.io/puffy-lux-assignment/';
  const preference = 'puffy-analytics-disabled';
  const session = 'puffy-visit-counted-v1';
  const choice = new URLSearchParams(location.search).get('analytics');
  try {
    if (choice === 'off') localStorage.setItem(preference, '1');
    if (choice === 'on') localStorage.removeItem(preference);
    if (localStorage.getItem(preference) === '1') return;
    if (sessionStorage.getItem(session) === '1') return;
  } catch { /* The page still works when browser storage is unavailable. */ }
  if (choice === 'off' || navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
  if (location.origin !== 'https://karimdhammani.github.io') return;
  if (!['/puffy-lux-assignment/', '/puffy-lux-assignment/index.html'].includes(location.pathname)) return;

  let started = false;
  function recordVisit() {
    if (started || document.visibilityState !== 'visible') return;
    started = true;
    document.removeEventListener('visibilitychange', recordVisit);
    const query = new URLSearchParams({ url: site, output: 'json', tz: 'UTC' });
    fetch(`https://hitscounter.dev/api/hit?${query}`, {
      credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store', keepalive: true
    }).then(response => {
      if (response.ok) {
        try { sessionStorage.setItem(session, '1'); } catch { /* Storage is optional. */ }
      }
    }).catch(() => { /* Analytics must never interrupt the assignment. */ });
  }
  document.addEventListener('visibilitychange', recordVisit);
  recordVisit();
})();
