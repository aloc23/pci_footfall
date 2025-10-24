# Changelog

## 2025-10-24 - Simplified to Court Utilization Only

### Changed
- **Removed all tabs except Padel**: Removed Gym, Profit & Loss, ROI, Scenarios, Summary, Gantt, and Files tabs from the navigation
- **Simplified Padel tab to show only Court Utilization**: 
  - Kept: Utilization Inputs (peak/off-peak hours, utilization percentages, rates, days/week, weeks/year)
  - Kept: Number of Courts input
  - Removed: Investment Inputs (ground cost, structure cost, per court cost, amenities)
  - Removed: Operating Costs section
  - Removed: Staffing section
  - Removed: Calculate button (calculations now auto-update on input change)

### Removed
- All chart libraries (Chart.js, no longer needed)
- Export functionality libraries (xlsx, html2canvas, jspdf)
- Gantt chart library (frappe-gantt)
- All unused JavaScript code for removed tabs and features
- 700+ lines of JavaScript reduced to ~50 lines

### Technical Details
- Simplified `script.js` from 768 lines to 50 lines
- Removed all chart rendering, PnL calculations, ROI calculations, scenario management, and Gantt functionality
- Kept only the core court utilization calculation logic
- Application now focuses solely on calculating and displaying court utilization metrics and revenue

### What Remains
The application now displays:
- Court utilization inputs with interactive sliders and number inputs
- Real-time calculation of:
  - Peak and off-peak hours available per court
  - Peak and off-peak hours utilized (based on utilization percentages)
  - Total hours utilized across all courts
  - Peak revenue, off-peak revenue, and total annual revenue

All calculations update automatically as inputs are changed.
