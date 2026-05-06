/* Shared icon set for Turnia. All icons use currentColor. */

const Icon = ({ children, size = 20, stroke = 1.8, fill = 'none', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>{children}</svg>
);

const Icons = {
  home: (p) => <Icon {...p}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></Icon>,
  calendar: (p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></Icon>,
  cal2: (p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 11h18" /><circle cx="8" cy="15" r="1.2" fill="currentColor" /></Icon>,
  swap: (p) => <Icon {...p}><path d="M7 7h12l-3-3M17 17H5l3 3" /></Icon>,
  swap2: (p) => <Icon {...p}><path d="M4 8h12M14 6l2 2-2 2M20 16H8M10 14l-2 2 2 2" /></Icon>,
  beach: (p) => <Icon {...p}><path d="M5 20h14" /><path d="M12 4v16" /><path d="M12 4c4 0 7 2 7 5" /><path d="M12 4c-4 0-7 2-7 5" /></Icon>,
  user: (p) => <Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></Icon>,
  users: (p) => <Icon {...p}><circle cx="9" cy="8" r="3.5" /><path d="M3 20c.5-3 3-5 6-5s5.5 2 6 5" /><path d="M16 4a3.5 3.5 0 010 7M21 20c-.3-2-1.5-3.5-3-4.3" /></Icon>,
  bell: (p) => <Icon {...p}><path d="M6 9a6 6 0 1112 0v4l2 3H4l2-3V9z" /><path d="M10 19a2 2 0 004 0" /></Icon>,
  search: (p) => <Icon {...p}><circle cx="11" cy="11" r="6" /><path d="M20 20l-3.5-3.5" /></Icon>,
  filter: (p) => <Icon {...p}><path d="M4 5h16l-6 8v6l-4 2v-8z" /></Icon>,
  more: (p) => <Icon {...p}><circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none" /></Icon>,
  burger: (p) => <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>,
  chevronL: (p) => <Icon {...p}><path d="M15 6l-6 6 6 6" /></Icon>,
  chevronR: (p) => <Icon {...p}><path d="M9 6l6 6-6 6" /></Icon>,
  chevronD: (p) => <Icon {...p}><path d="M6 9l6 6 6-6" /></Icon>,
  arrowR: (p) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>,
  plus: (p) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>,
  x: (p) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>,
  check: (p) => <Icon {...p}><path d="M5 13l4 4L19 7" /></Icon>,
  clock: (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>,
  pin: (p) => <Icon {...p}><path d="M12 21s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></Icon>,
  eye: (p) => <Icon {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></Icon>,
  mail: (p) => <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 7 9-7" /></Icon>,
  lock: (p) => <Icon {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></Icon>,
  fingerprint: (p) => <Icon {...p}><path d="M5 11a7 7 0 0114 0v3" /><path d="M9 21c-1-3-1-6-1-7a4 4 0 018 0c0 1 0 3-.5 5" /><path d="M12 13c0 3 .5 5 1 7" /></Icon>,
  zap: (p) => <Icon {...p} fill="currentColor" stroke="none"><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></Icon>,
  hospital: (p) => <Icon {...p}><rect x="4" y="7" width="16" height="14" rx="1.5" /><path d="M9 7V4h6v3" /><path d="M12 11v6M9 14h6" /></Icon>,
  cross: (p) => <Icon {...p}><path d="M9 4h6v5h5v6h-5v5H9v-5H4V9h5z" /></Icon>,
  stethoscope: (p) => <Icon {...p}><path d="M6 3v6a4 4 0 008 0V3" /><path d="M10 13c0 4 3 7 7 7a4 4 0 004-4" /><circle cx="21" cy="14" r="2" /></Icon>,
  briefcase: (p) => <Icon {...p}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" /></Icon>,
  alert: (p) => <Icon {...p}><path d="M12 4l10 17H2z" /><path d="M12 10v5M12 18v.5" /></Icon>,
  giveaway: (p) => <Icon {...p}><path d="M3 12h12l-3-3M3 12l3 3" /><circle cx="20" cy="12" r="2" /></Icon>,
  takeOpen: (p) => <Icon {...p}><path d="M21 12H9l3 3M21 12l-3-3" /><circle cx="4" cy="12" r="2" /></Icon>,
  send: (p) => <Icon {...p}><path d="M3 12L21 4l-7 17-3-7-8-2z" /></Icon>,
  edu: (p) => <Icon {...p}><path d="M3 9l9-4 9 4-9 4z" /><path d="M7 11v5c2 2 8 2 10 0v-5" /></Icon>,
  history: (p) => <Icon {...p}><path d="M3 12a9 9 0 109-9" /><path d="M3 6v6h6" /><path d="M12 8v4l3 2" /></Icon>,
  trend: (p) => <Icon {...p}><path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" /></Icon>,
  download: (p) => <Icon {...p}><path d="M12 4v12M7 11l5 5 5-5" /><path d="M4 20h16" /></Icon>,
  copy: (p) => <Icon {...p}><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2h3" /></Icon>,
  list: (p) => <Icon {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></Icon>,
  building: (p) => <Icon {...p}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01" /></Icon>,
  shield: (p) => <Icon {...p}><path d="M12 3l8 3v6c0 5-3 8-8 9-5-1-8-4-8-9V6z" /></Icon>,
  settings: (p) => <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 00-2-1.2L14 3h-4l-.6 2.6a7 7 0 00-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9a7 7 0 002 1.2L10 21h4l.6-2.6a7 7 0 002-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z" /></Icon>,
  sparkle: (p) => <Icon {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" /></Icon>,
  logout: (p) => <Icon {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></Icon>,
};

window.Icons = Icons;
window.Icon = Icon;
