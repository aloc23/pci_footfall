// --- Utility Functions ---
function getNumberInputValue(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  const n = Number(el.value);
  return Number.isFinite(n) ? n : 0;
}

// render footfall summary card (compact + details)
function renderFootfallSummary({ footfallPerYear, footfallPerMonth, footfallPerWeek, footfallPerDay, bookingsPerYear }) {
  const compactEl = document.getElementById('padelFootfallCompact');
  const detailsEl = document.getElementById('padelFootfallDetails');
  const toggleBtn = document.getElementById('footfallToggle');

  if (!compactEl || !detailsEl || !toggleBtn) return;

  // Friendly message if there are no bookings / zero booking length
  if (!bookingsPerYear || bookingsPerYear <= 0) {
    compactEl.innerHTML = `<p class="summary-empty">No bookings detected. Adjust booking length, courts or utilizations to view estimated footfall.</p>`;
    detailsEl.innerHTML = '';
    return;
  }

  // Compact view: large yearly number + per day
  compactEl.innerHTML = `
    <div class="summary-compact-grid">
      <div class="summary-value" aria-hidden="true">${Math.round(footfallPerYear).toLocaleString()}</div>
      <div class="summary-meta">
        <div class="meta-row"><span class="meta-label">per year</span></div>
        <div class="meta-row small"><strong>${footfallPerDay.toFixed(1)}</strong> per day avg</div>
      </div>
    </div>
  `;

  // Details view: week/month/day breakdown
  detailsEl.innerHTML = `
    <ul class="footfall-breakdown" role="list">
      <li><b>People per day:</b> ${footfallPerDay.toFixed(1)}</li>
      <li><b>People per week:</b> ${Math.round(footfallPerWeek)}</li>
      <li><b>People per month:</b> ${Math.round(footfallPerMonth)}</li>
      <li><b>People per year:</b> ${Math.round(footfallPerYear)}</li>
      <li><b>Estimated bookings / year:</b> ${Math.round(bookingsPerYear)}</li>
    </ul>
  `;

  // Toggle behavior (keyboard + mouse)
  toggleBtn.onclick = () => {
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!expanded));
    toggleBtn.textContent = expanded ? 'Show details' : 'Hide details';
    if (expanded) {
      detailsEl.hidden = true;
    } else {
      detailsEl.hidden = false;
      // move focus into details for keyboard users
      detailsEl.querySelector('ul')?.focus?.();
    }
  };
}

// --- Court Utilization Calculation ---
window.calculatePadel = function() {
  const peakHours = getNumberInputValue('padelPeakHours');
  const peakDays = getNumberInputValue('padelDays') || 7;
  const peakWeeks = getNumberInputValue('padelWeeks') || 52;
  const peakUtil = (getNumberInputValue('padelPeakUtil') || 0) / 100;
  const offHours = getNumberInputValue('padelOffHours');
  const offUtil = (getNumberInputValue('padelOffUtil') || 0) / 100;
  const courts = getNumberInputValue('padelCourts');

  const peakAvailable = peakHours * peakDays * peakWeeks;
  const peakUtilized = peakAvailable * peakUtil;
  const offAvailable = offHours * peakDays * peakWeeks;
  const offUtilized = offAvailable * offUtil;

  // Bookings & Footfall calculations
  const bookingLengthMinutes = getNumberInputValue('padelBookingLength') || 60;
  const bookingHours = bookingLengthMinutes > 0 ? bookingLengthMinutes / 60 : 0;
  const avgPlayers = getNumberInputValue('padelAvgPlayers') || 4;

  const totalUtilizedHoursAllCourts = (peakUtilized + offUtilized) * courts;
  const bookingsPerYear = bookingHours > 0 ? totalUtilizedHoursAllCourts / bookingHours : 0;
  const bookingsPerWeek = peakWeeks > 0 ? bookingsPerYear / peakWeeks : 0;
  const bookingsPerDay = peakDays > 0 ? bookingsPerWeek / peakDays : 0;
  const bookingsPerMonth = bookingsPerYear / 12;

  const footfallPerDay = bookingsPerDay * avgPlayers;
  const footfallPerWeek = bookingsPerWeek * avgPlayers;
  const footfallPerMonth = bookingsPerMonth * avgPlayers;
  const footfallPerYear = bookingsPerYear * avgPlayers;

  // Build utilization summary (no finance/revenue section)
  const utilBreakdown = `
  <h4>Utilization Breakdown (per court)</h4>
  <ul>
    <li>Peak: ${peakHours}h/day × ${peakDays}d/week × ${peakWeeks}w/year = <b>${peakAvailable}</b> hours available</li>
    <li>Peak Utilized: <b>${peakUtilized.toFixed(1)}</b> hours/year (${(peakUtil*100).toFixed(1)}% utilization)</li>
    <li>Off-Peak: ${offHours}h/day × ${peakDays}d/week × ${peakWeeks}w/year = <b>${offAvailable}</b> hours available</li>
    <li>Off-Peak Utilized: <b>${offUtilized.toFixed(1)}</b> hours/year (${(offUtil*100).toFixed(1)}% utilization)</li>
    <li>Total Utilized (all ${courts} courts): <b>${totalUtilizedHoursAllCourts.toFixed(1)}</b> hours/year</li>
  </ul>
  <h4>Bookings &amp; Footfall (est.)</h4>
  <ul>
    <li><b>Bookings per Day:</b> ${bookingsPerDay.toFixed(1)}</li>
    <li><b>Bookings per Week:</b> ${Math.round(bookingsPerWeek)}</li>
    <li><b>Bookings per Month:</b> ${Math.round(bookingsPerMonth)}</li>
    <li><b>Bookings per Year:</b> ${Math.round(bookingsPerYear)}</li>
  </ul>
  `;

  document.getElementById('padelSummary').innerHTML = utilBreakdown;

  // Populate the improved footfall card
  const footfallData = {
    footfallPerYear,
    footfallPerMonth,
    footfallPerWeek,
    footfallPerDay,
    bookingsPerYear
  };
  renderFootfallSummary(footfallData);
};

// --- Initialization ---
window.onload = function () {
  const toggleBtn = document.getElementById('footfallToggle');
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-expanded', 'false');
  }
  calculatePadel();
};
