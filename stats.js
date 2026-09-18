(() => {
  'use strict';
  const ownerStatus = document.getElementById('owner-status');
  try {
    localStorage.setItem('puffy-analytics-disabled', '1');
    ownerStatus.textContent = 'Your future assignment visits in this browser are now excluded. Checking these stats never adds a visit.';
  } catch {
    ownerStatus.textContent = 'Checking these stats never adds a visit. Use the link above to exclude yourself when opening the assignment; this browser cannot save that preference.';
  }
  const button = document.getElementById('refresh');
  const status = document.getElementById('status');
  async function refresh() {
    button.disabled = true;
    status.textContent = 'Loading counts…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const query = new URLSearchParams({ url: 'https://karimdhammani.github.io/puffy-lux-assignment/' });
      const response = await fetch(`https://hitscounter.dev/api/history?${query}`, {
        credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store', signal: controller.signal
      });
      if (!response.ok) throw new Error('Counter unavailable');
      const data = await response.json();
      if (!Number.isSafeInteger(data.total_hits) || data.total_hits < 0 || !Array.isArray(data.history)) throw new Error('Invalid count');
      const today = new Date().toISOString().slice(0, 10);
      const days = data.history.map(row => {
        const date = String(row.hit_date).slice(0, 10);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isSafeInteger(row.hit_count) || row.hit_count < 0) throw new Error('Invalid history');
        return { date, count: row.hit_count };
      }).sort((a, b) => b.date.localeCompare(a.date));
      document.getElementById('total').textContent = data.total_hits.toLocaleString();
      document.getElementById('today').textContent = (days.find(day => day.date === today)?.count || 0).toLocaleString();
      const rows = days.map(day => {
        const row = document.createElement('tr');
        for (const value of [day.date, day.count.toLocaleString()]) {
          const cell = document.createElement('td'); cell.textContent = value; row.appendChild(cell);
        }
        return row;
      });
      if (!rows.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td'); cell.colSpan = 2; cell.textContent = 'No visits recorded yet.'; row.appendChild(cell); rows.push(row);
      }
      document.getElementById('history').replaceChildren(...rows);
      status.textContent = `Updated ${new Date().toLocaleTimeString()}.`;
    } catch {
      status.textContent = 'Could not refresh counts. Previously loaded values, if shown, may be out of date. Try again shortly.';
    } finally {
      clearTimeout(timeout); button.disabled = false;
    }
  }
  button.addEventListener('click', refresh);
  refresh();
})();
