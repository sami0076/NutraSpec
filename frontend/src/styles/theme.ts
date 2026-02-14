/**
 * Design tokens exported as JS constants.
 * Primary theming is done via CSS variables in globalStyles.css.
 * These are available for programmatic use (e.g. SVG stroke colors).
 */

export const colors = {
  primary: 'hsl(0 90% 15%)',        // oxblood #4A0404
  background: 'hsl(46 58% 93%)',    // alhambra cream #F7F2E1
  border: 'hsl(44 22% 80%)',
  riskLow: '#16a34a',
  riskMedium: '#d97706',
  riskHigh: '#dc2626',
} as const;
