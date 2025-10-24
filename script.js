// --- Utility Functions ---
function getNumberInputValue(id) {
  const el = document.getElementById(id);
  const val = el ? Number(el.value) : NaN;
  return isNaN(val) ? 0 : val;
}

// --- Court Utilization Calculation ---
window.calculatePadel = function() {
  const peakHours = getNumberInputValue('padelPeakHours');
  const peakDays = getNumberInputValue('padelDays') || 7;
  const peakWeeks = getNumberInputValue('padelWeeks') || 52;
  const peakUtil = getNumberInputValue('padelPeakUtil') / 100;
  const offHours = getNumberInputValue('padelOffHours');
  const offUtil = getNumberInputValue('padelOffUtil') / 100;
  const courts = getNumberInputValue('padelCourts');
  
  const peakAnnualRevenue = peakHours * getNumberInputValue('padelPeakRate') * peakDays * peakWeeks * courts * peakUtil;
  const offAnnualRevenue = offHours * getNumberInputValue('padelOffRate') * peakDays * peakWeeks * courts * offUtil;
  const totalRevenue = peakAnnualRevenue + offAnnualRevenue;
  
  const peakAvailable = peakHours * peakDays * peakWeeks;
  const peakUtilized = peakAvailable * peakUtil;
  const offAvailable = offHours * peakDays * peakWeeks;
  const offUtilized = offAvailable * offUtil;
  
  // Bookings & Footfall calculations
  const bookingLengthMinutes = getNumberInputValue('padelBookingLength') || 60;
  const bookingHours = bookingLengthMinutes / 60;
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
  
  const utilBreakdown = `
  <h4>Utilization Breakdown (per court)</h4>
  <ul>
    <li>Peak: ${peakHours}h/day × ${peakDays}d/week × ${peakWeeks}w/year = <b>${peakAvailable}</b> hours available</li>
    <li>Peak Utilized: <b>${peakUtilized.toFixed(1)}</b> hours/year (${(peakUtil*100).toFixed(1)}% utilization)</li>
    <li>Off-Peak: ${offHours}h/day × ${peakDays}d/week × ${peakWeeks}w/year = <b>${offAvailable}</b> hours available</li>
    <li>Off-Peak Utilized: <b>${offUtilized.toFixed(1)}</b> hours/year (${(offUtil*100).toFixed(1)}% utilization)</li>
    <li>Total Utilized (all ${courts} courts): <b>${totalUtilizedHoursAllCourts.toFixed(1)}</b> hours/year</li>
  </ul>
  <h4>Revenue Summary</h4>
  <ul>
    <li><b>Peak Revenue:</b> €${peakAnnualRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</li>
    <li><b>Off-Peak Revenue:</b> €${offAnnualRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</li>
    <li><b>Total Annual Revenue:</b> €${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</li>
  </ul>
  <h4>Bookings &amp; Footfall (est.)</h4>
  <ul>
    <li><b>Bookings per Day:</b> ${bookingsPerDay.toFixed(1)}</li>
    <li><b>Bookings per Week:</b> ${Math.round(bookingsPerWeek)}</li>
    <li><b>Bookings per Month:</b> ${Math.round(bookingsPerMonth)}</li>
    <li><b>Bookings per Year:</b> ${Math.round(bookingsPerYear)}</li>
  </ul>
  <h4>Footfall (people)</h4>
  <ul>
    <li><b>People per Day:</b> ${footfallPerDay.toFixed(1)}</li>
    <li><b>People per Week:</b> ${Math.round(footfallPerWeek)}</li>
    <li><b>People per Month:</b> ${Math.round(footfallPerMonth)}</li>
    <li><b>People per Year:</b> ${Math.round(footfallPerYear)}</li>
  </ul>
  `;
  
  document.getElementById('padelSummary').innerHTML = utilBreakdown;
  
  // Optional: Populate #padelFootfall if it exists
  const footfallEl = document.getElementById('padelFootfall');
  if (footfallEl) {
    footfallEl.innerHTML = `
    <h4>Footfall Summary</h4>
    <p><b>${Math.round(footfallPerYear)}</b> people per year (${footfallPerDay.toFixed(1)} per day avg)</p>
    `;
  }
};

// --- Initialization ---
window.onload = function () {
  calculatePadel();
};
