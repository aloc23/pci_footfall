// --- Utility Functions ---
function getNumberInputValue(id) {
  const el = document.getElementById(id);
  const val = el ? Number(el.value) : NaN;
  return isNaN(val) ? 0 : val;
}

// --- Court Utilization Calculation ---
window.calculatePadel = function() {
  const peakHours = getNumberInputValue('padelPeakHours');
  const peakDays = getNumberInputValue('padelDays');
  const peakWeeks = getNumberInputValue('padelWeeks');
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
  
  const utilBreakdown = `
  <h4>Utilization Breakdown (per court)</h4>
  <ul>
    <li>Peak: ${peakHours}h/day × ${peakDays}d/week × ${peakWeeks}w/year = <b>${peakAvailable}</b> hours available</li>
    <li>Peak Utilized: <b>${peakUtilized.toFixed(1)}</b> hours/year (${(peakUtil*100).toFixed(1)}% utilization)</li>
    <li>Off-Peak: ${offHours}h/day × ${peakDays}d/week × ${peakWeeks}w/year = <b>${offAvailable}</b> hours available</li>
    <li>Off-Peak Utilized: <b>${offUtilized.toFixed(1)}</b> hours/year (${(offUtil*100).toFixed(1)}% utilization)</li>
    <li>Total Utilized (all ${courts} courts): <b>${((peakUtilized + offUtilized) * courts).toFixed(1)}</b> hours/year</li>
  </ul>
  <h4>Revenue Summary</h4>
  <ul>
    <li><b>Peak Revenue:</b> €${peakAnnualRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</li>
    <li><b>Off-Peak Revenue:</b> €${offAnnualRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</li>
    <li><b>Total Annual Revenue:</b> €${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</li>
  </ul>
  `;
  
  document.getElementById('padelSummary').innerHTML = utilBreakdown;
};

// --- Initialization ---
window.onload = function () {
  calculatePadel();
};
