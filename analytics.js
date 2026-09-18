// This endpoint records a visit; it never exposes analytics to visitors.
(() => {
  'use strict';
  const preference = 'puffy-analytics-disabled';
  const sessionKey = 'puffy-private-visit-v1';
  const choice = new URLSearchParams(location.search).get('analytics');
  let visit;
  try {
    if (choice === 'off') localStorage.setItem(preference, '1');
    if (choice === 'on') localStorage.removeItem(preference);
    if (localStorage.getItem(preference) === '1') return;
    visit = JSON.parse(sessionStorage.getItem(sessionKey) || 'null');
    if (visit?.sent) return;
  } catch { /* Storage restrictions must not affect the assignment. */ }
  if (choice === 'off' || navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
  if (location.origin !== 'https://karimdhammani.github.io') return;
  if (!['/puffy-lux-assignment/', '/puffy-lux-assignment/index.html'].includes(location.pathname)) return;
  if (!visit?.id) visit = { id: crypto.randomUUID(), sent: false };
  try { sessionStorage.setItem(sessionKey, JSON.stringify(visit)); } catch {}
  // This is the public anon key for the JWT-protected collector, not an admin key.
  const publicKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoandkbGZrZ2JpZWJ3aWJ2Y2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NDQ4MjQsImV4cCI6MjEwMzQyMDgyNH0.v8ELQEkatd_uqkGtsggkD7ZV4q9qoT1U9gmREiZVkdE';
  let started = false;
  function recordVisit() {
    if (started || document.visibilityState !== 'visible') return;
    started = true;
    document.removeEventListener('visibilitychange', recordVisit);
    fetch('https://chjwdlfkgbiebwibvcaz.supabase.co/functions/v1/puffy-visit', {
      method: 'POST',
      headers: { apikey: publicKey, Authorization: 'Bearer ' + publicKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: visit.id }),
      credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store', keepalive: true
    }).then(response => {
      if (response.ok) {
        visit.sent = true;
        try { sessionStorage.setItem(sessionKey, JSON.stringify(visit)); } catch {}
      }
    }).catch(() => { /* Analytics failures never interrupt the page. */ });
  }
  document.addEventListener('visibilitychange', recordVisit);
  recordVisit();
})();

