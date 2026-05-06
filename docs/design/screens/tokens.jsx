/* Turnia design tokens, icons & primitives. Lives on window.* */

const T_LIGHT = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  subtle: '#F8FAFC',
  subtle2: '#F1F5F9',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  text: '#0F172A',
  textSec: '#334155',
  muted: '#64748B',
  primary: '#14B8A6',
  primaryDark: '#0D9488',
  primarySoft: '#CCFBF1',
  primaryTint: '#F0FDFA',
  amber: '#D97706',
  amberSoft: '#FEF3C7',
  red: '#DC2626',
  redSoft: '#FEE2E2',
  green: '#059669',
  greenSoft: '#D1FAE5',
  blue: '#2563EB',
  blueSoft: '#DBEAFE',
  violet: '#7C3AED',
  violetSoft: '#EDE9FE',
};

const T_DARK = {
  bg: '#0B1220',
  surface: '#0F172A',
  subtle: '#0F172A',
  subtle2: '#1E293B',
  border: '#1E293B',
  borderStrong: '#334155',
  text: '#F1F5F9',
  textSec: '#CBD5E1',
  muted: '#94A3B8',
  primary: '#2DD4BF',
  primaryDark: '#5EEAD4',
  primarySoft: 'rgba(45,212,191,0.16)',
  primaryTint: 'rgba(45,212,191,0.10)',
  amber: '#F59E0B',
  amberSoft: 'rgba(245,158,11,0.18)',
  red: '#F87171',
  redSoft: 'rgba(248,113,113,0.16)',
  green: '#34D399',
  greenSoft: 'rgba(52,211,153,0.16)',
  blue: '#60A5FA',
  blueSoft: 'rgba(96,165,250,0.16)',
  violet: '#A78BFA',
  violetSoft: 'rgba(167,139,250,0.16)',
};

// Inject base font + utility CSS once
if (typeof document !== 'undefined' && !document.getElementById('turnia-base')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);

  const s = document.createElement('style');
  s.id = 'turnia-base';
  s.textContent = `
    .tn { font-family: 'Inter', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
    .tn-h { font-family: 'Inter Tight', 'Inter', system-ui, sans-serif; letter-spacing: -0.02em; }
    .tn *, .tn *::before, .tn *::after { box-sizing: border-box; }
    .tn-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
    .tn-scroll::-webkit-scrollbar-thumb { background: rgba(100,116,139,.35); border-radius: 999px; }
    .tn-scroll::-webkit-scrollbar-track { background: transparent; }
    .tn-noscroll::-webkit-scrollbar { display: none; }
    .tn-noscroll { scrollbar-width: none; }
    @keyframes tn-pulse { 0%,100% { opacity: 1 } 50% { opacity: .5 } }
    @keyframes tn-blink { 0%, 100% { opacity: 1 } 50% { opacity: .25 } }
    .tn-blink { animation: tn-blink 1.6s ease-in-out infinite; }
    @keyframes tn-ping {
      0% { transform: scale(0.85); opacity: 0.85 }
      75%,100% { transform: scale(2.2); opacity: 0 }
    }
    .tn-dot-live::after {
      content: ''; position: absolute; inset: 0; border-radius: 999px;
      background: currentColor; animation: tn-ping 1.8s cubic-bezier(0,0,0.2,1) infinite;
    }
  `;
  document.head.appendChild(s);
}

// ─────────── icons (lucide-style, currentColor) ───────────
const Icon = ({ d, size = 20, stroke = 2, fill = 'none', children, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden style={style}>
    {d ? <path d={d} /> : children}
  </svg>
);

const Icons = {
  bell: (p) => <Icon {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></Icon>,
  calendar: (p) => <Icon {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></Icon>,
  cal2: (p) => <Icon {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="8" cy="14" r="1" fill="currentColor"/><circle cx="12" cy="14" r="1" fill="currentColor"/><circle cx="16" cy="14" r="1" fill="currentColor"/></Icon>,
  home: (p) => <Icon {...p}><path d="M3 12 12 4l9 8"/><path d="M5 10v10h14V10"/></Icon>,
  user: (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></Icon>,
  users: (p) => <Icon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M17 3.13a4 4 0 0 1 0 7.75"/></Icon>,
  plus: (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>,
  search: (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></Icon>,
  filter: (p) => <Icon {...p}><path d="M3 5h18l-7 9v6l-4-2v-4z"/></Icon>,
  chevronR: (p) => <Icon {...p}><path d="m9 6 6 6-6 6"/></Icon>,
  chevronL: (p) => <Icon {...p}><path d="m15 6-6 6 6 6"/></Icon>,
  chevronD: (p) => <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>,
  chevronU: (p) => <Icon {...p}><path d="m18 15-6-6-6 6"/></Icon>,
  more: (p) => <Icon {...p}><circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/></Icon>,
  check: (p) => <Icon {...p}><path d="m5 12 5 5L20 7"/></Icon>,
  x: (p) => <Icon {...p}><path d="M18 6 6 18M6 6l12 12"/></Icon>,
  swap: (p) => <Icon {...p}><path d="M7 4 3 8l4 4"/><path d="M3 8h14a4 4 0 0 1 4 4"/><path d="m17 20 4-4-4-4"/><path d="M21 16H7a4 4 0 0 1-4-4"/></Icon>,
  giveaway: (p) => <Icon {...p}><path d="M5 12h14"/><path d="m12 5-7 7 7 7"/></Icon>,
  takeOpen: (p) => <Icon {...p}><path d="M19 12H5"/><path d="m12 19 7-7-7-7"/></Icon>,
  clock: (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>,
  pin: (p) => <Icon {...p}><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></Icon>,
  inbox: (p) => <Icon {...p}><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.8 1.1z"/></Icon>,
  bell2: (p) => <Icon {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></Icon>,
  settings: (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></Icon>,
  logout: (p) => <Icon {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></Icon>,
  download: (p) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></Icon>,
  doc: (p) => <Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></Icon>,
  stethoscope: (p) => <Icon {...p}><path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3a3 3 0 0 0-3 3v3a4 4 0 0 0 8 0V6a3 3 0 0 0-3-3"/><path d="M11 3a3 3 0 0 1 3 3v3a4 4 0 0 1-8 0"/><path d="M8 13v2a5 5 0 0 0 10 0v-1"/><circle cx="18" cy="14" r="2"/></Icon>,
  hospital: (p) => <Icon {...p}><path d="M12 6v4M9 8h6"/><path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M9 21v-4h6v4"/></Icon>,
  trend: (p) => <Icon {...p}><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></Icon>,
  copy: (p) => <Icon {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Icon>,
  beach: (p) => <Icon {...p}><circle cx="12" cy="6" r="3"/><path d="M12 9v13"/><path d="M3 22h18"/><path d="M5 17c2-2 5-2 7 0s5 2 7 0"/></Icon>,
  edu: (p) => <Icon {...p}><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c2 2 4 3 6 3s4-1 6-3v-5"/></Icon>,
  cross: (p) => <Icon {...p}><rect x="9" y="3" width="6" height="18" rx="1"/><rect x="3" y="9" width="18" height="6" rx="1"/></Icon>,
  arrowR: (p) => <Icon {...p}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></Icon>,
  arrowL: (p) => <Icon {...p}><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></Icon>,
  send: (p) => <Icon {...p}><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></Icon>,
  shield: (p) => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Icon>,
  sparkle: (p) => <Icon {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></Icon>,
  eye: (p) => <Icon {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></Icon>,
  list: (p) => <Icon {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></Icon>,
  grid: (p) => <Icon {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></Icon>,
  alert: (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></Icon>,
  swap2: (p) => <Icon {...p}><path d="M7 16V4M3 8l4-4 4 4"/><path d="M17 8v12M21 16l-4 4-4-4"/></Icon>,
  burger: (p) => <Icon {...p}><path d="M4 6h16M4 12h16M4 18h16"/></Icon>,
  fingerprint: (p) => <Icon {...p}><path d="M3 11a9 9 0 0 1 18 0"/><path d="M5 14a7 7 0 0 1 14 0v1"/><path d="M7 17a5 5 0 0 1 10 0"/><path d="M9 20c0-3 1-5 3-5s3 2 3 5"/></Icon>,
  briefcase: (p) => <Icon {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Icon>,
  zap: (p) => <Icon {...p}><path d="M13 2 3 14h7l-1 8 10-12h-7z"/></Icon>,
  refresh: (p) => <Icon {...p}><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/></Icon>,
  lock: (p) => <Icon {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Icon>,
  mail: (p) => <Icon {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></Icon>,
  building: (p) => <Icon {...p}><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/></Icon>,
  history: (p) => <Icon {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></Icon>,
};

window.T_LIGHT = T_LIGHT;
window.T_DARK = T_DARK;
window.Icons = Icons;
window.Icon = Icon;
