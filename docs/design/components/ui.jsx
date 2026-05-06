// Invoxa — UI primitives
// Buttons, inputs, badges, cards, lists, sheets, etc. Themed via CSS vars.

const Btn = ({ variant = 'primary', size = 'md', children, leading, trailing, full, onClick, style, type = 'button', disabled }) => {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, fontFamily: 'var(--font-ui)', fontWeight: 500,
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: 'var(--radius-pill)', transition: 'all .14s ease',
    width: full ? '100%' : 'auto', whiteSpace: 'nowrap',
    opacity: disabled ? 0.5 : 1,
  };
  const sizes = {
    sm: { height: 32, padding: '0 14px', fontSize: 13 },
    md: { height: 40, padding: '0 18px', fontSize: 14 },
    lg: { height: 48, padding: '0 22px', fontSize: 15 },
  };
  const variants = {
    primary: { background: 'var(--accent)', color: 'var(--accent-ink)' },
    ink:     { background: 'var(--ink)', color: 'var(--ink-inverse)' },
    secondary: { background: 'var(--bg-muted)', color: 'var(--ink)' },
    ghost:   { background: 'transparent', color: 'var(--ink)' },
    outline: { background: 'transparent', color: 'var(--ink)', boxShadow: 'inset 0 0 0 1px var(--line-strong)' },
    danger:  { background: 'var(--danger)', color: '#fff' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {leading}{children}{trailing}
    </button>
  );
};

const IconBtn = ({ children, onClick, size = 36, style, label }) => (
  <button onClick={onClick} aria-label={label}
    style={{
      width: size, height: size, borderRadius: 999, border: 'none',
      background: 'transparent', color: 'var(--ink-2)', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background .14s', ...style,
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
    {children}
  </button>
);

const Badge = ({ tone = 'neutral', children, dot, style }) => {
  const tones = {
    neutral: { bg: 'var(--bg-muted)', fg: 'var(--ink-2)', dot: 'var(--ink-3)' },
    accent:  { bg: 'var(--accent-soft)', fg: 'var(--accent)', dot: 'var(--accent)' },
    success: { bg: 'var(--success-soft)', fg: 'var(--success)', dot: 'var(--success)' },
    warn:    { bg: 'var(--warn-soft)', fg: 'var(--warn)', dot: 'var(--warn)' },
    danger:  { bg: 'var(--danger-soft)', fg: 'var(--danger)', dot: 'var(--danger)' },
    info:    { bg: 'var(--info-soft)', fg: 'var(--info)', dot: 'var(--info)' },
    outline: { bg: 'transparent', fg: 'var(--ink-2)', dot: 'var(--ink-3)', border: '1px solid var(--line-strong)' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 999,
      background: t.bg, color: t.fg, border: t.border,
      fontSize: 11, fontWeight: 500, letterSpacing: '0.02em',
      textTransform: 'uppercase', fontFamily: 'var(--font-ui)',
      ...style,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: t.dot }} />}
      {children}
    </span>
  );
};

const Card = ({ children, style, padded = true, elev = 1, onClick, hover }) => (
  <div onClick={onClick} style={{
    background: 'var(--bg-elev)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius-md)',
    boxShadow: elev === 0 ? 'none' : 'var(--shadow-1)',
    padding: padded ? 'var(--space-5)' : 0,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'border-color .14s, transform .14s',
    ...style,
  }}
  onMouseEnter={e => { if (hover || onClick) e.currentTarget.style.borderColor = 'var(--line-strong)'; }}
  onMouseLeave={e => { if (hover || onClick) e.currentTarget.style.borderColor = 'var(--line)'; }}
  >{children}</div>
);

const Field = ({ label, hint, error, children, style }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
    {label && <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-2)', letterSpacing: '0.01em' }}>{label}</span>}
    {children}
    {hint && !error && <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{hint}</span>}
    {error && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span>}
  </label>
);

const Input = ({ value, onChange, placeholder, type = 'text', leading, trailing, style, readOnly }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    height: 'var(--field-h)', padding: '0 14px',
    background: 'var(--bg-elev)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius-sm)',
    transition: 'border-color .14s, box-shadow .14s',
    ...style,
  }}>
    {leading && <span style={{ color: 'var(--ink-3)', display: 'flex' }}>{leading}</span>}
    <input value={value} onChange={onChange} placeholder={placeholder} type={type} readOnly={readOnly}
      style={{
        flex: 1, border: 'none', outline: 'none', background: 'transparent',
        fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)',
        height: '100%',
      }}/>
    {trailing && <span style={{ color: 'var(--ink-3)', display: 'flex' }}>{trailing}</span>}
  </div>
);

const Select = ({ value, onChange, options, style }) => (
  <div style={{
    display: 'flex', alignItems: 'center',
    height: 'var(--field-h)', padding: '0 14px',
    background: 'var(--bg-elev)', border: '1px solid var(--line)',
    borderRadius: 'var(--radius-sm)', position: 'relative',
    ...style,
  }}>
    <select value={value} onChange={onChange} style={{
      flex: 1, border: 'none', outline: 'none', background: 'transparent',
      fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)',
      appearance: 'none', cursor: 'pointer', height: '100%',
    }}>
      {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
    </select>
    <Icon name="chev-down" size={14} style={{ color: 'var(--ink-3)' }} />
  </div>
);

const Avatar = ({ name = '?', size = 36, style, src }) => {
  const initials = name.split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();
  // Deterministic warm color from name
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  const hue = 20 + (h % 60); // 20–80 (warm)
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: `oklch(0.78 0.06 ${hue})`,
      color: '#2a1f17',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 600, letterSpacing: '0.02em',
      flexShrink: 0, fontFamily: 'var(--font-ui)',
      ...style,
    }}>
      {src ? <img src={src} style={{ width: '100%', height: '100%', borderRadius: 999 }}/> : initials}
    </div>
  );
};

const Divider = ({ style }) => (
  <div style={{ height: 1, background: 'var(--line)', ...style }} />
);

const Stat = ({ label, value, hint, tone, big }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{label}</div>
    <div className="display" style={{ fontSize: big ? 40 : 32, color: tone === 'accent' ? 'var(--accent)' : 'var(--ink)' }}>
      {value}
    </div>
    {hint && <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{hint}</div>}
  </div>
);

// Simple icon system (line, 1.5px)
const Icon = ({ name, size = 18, color = 'currentColor', style, strokeWidth = 1.5 }) => {
  const p = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
    style,
  };
  switch (name) {
    case 'home': return <svg {...p}><path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2v-9z"/></svg>;
    case 'users': return <svg {...p}><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.8"/><path d="M15 13.5a4.5 4.5 0 0 1 6.5 4"/></svg>;
    case 'user': return <svg {...p}><circle cx="12" cy="8" r="3.8"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    case 'folder': return <svg {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>;
    case 'doc': return <svg {...p}><path d="M6 3h8l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h4"/></svg>;
    case 'invoice': return <svg {...p}><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V3z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>;
    case 'clock': return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'calendar': return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>;
    case 'plus': return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case 'minus': return <svg {...p}><path d="M5 12h14"/></svg>;
    case 'check': return <svg {...p}><path d="M4 12l5 5L20 6"/></svg>;
    case 'x': return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'arrow-right': return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'arrow-left': return <svg {...p}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>;
    case 'chev-down': return <svg {...p}><path d="M6 9l6 6 6-6"/></svg>;
    case 'chev-right': return <svg {...p}><path d="M9 6l6 6-6 6"/></svg>;
    case 'chev-up': return <svg {...p}><path d="M6 15l6-6 6 6"/></svg>;
    case 'search': return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>;
    case 'filter': return <svg {...p}><path d="M3 5h18l-7 9v6l-4-2v-4L3 5z"/></svg>;
    case 'bell': return <svg {...p}><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5L6 16z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case 'settings': return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case 'logout': return <svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
    case 'mail': return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></svg>;
    case 'mail-send': return <svg {...p}><path d="M3 11L21 3l-7 18-3-7-8-3z"/></svg>;
    case 'download': return <svg {...p}><path d="M12 4v12M6 12l6 6 6-6M4 21h16"/></svg>;
    case 'eye': return <svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'edit': return <svg {...p}><path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="M14 6l4 4"/></svg>;
    case 'trash': return <svg {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/></svg>;
    case 'sparkle': return <svg {...p}><path d="M12 4v4M12 16v4M4 12h4M16 12h4M7 7l2 2M15 15l2 2M17 7l-2 2M9 15l-2 2"/></svg>;
    case 'menu': return <svg {...p}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
    case 'globe': return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case 'sun': return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></svg>;
    case 'moon': return <svg {...p}><path d="M20 14a8 8 0 1 1-9-10 7 7 0 0 0 9 10z"/></svg>;
    case 'play': return <svg {...p}><path d="M6 4l14 8-14 8z" fill={color}/></svg>;
    case 'list': return <svg {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
    case 'building': return <svg {...p}><path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M3 21h18M8 8h2M8 12h2M8 16h2"/></svg>;
    case 'flag': return <svg {...p}><path d="M5 21V4M5 4h12l-2 4 2 4H5"/></svg>;
    case 'card': return <svg {...p}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/></svg>;
    case 'send': return <svg {...p}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>;
    case 'hash': return <svg {...p}><path d="M5 9h14M5 15h14M10 3l-2 18M16 3l-2 18"/></svg>;
    case 'sliders': return <svg {...p}><path d="M4 6h10M18 6h2M4 12h6M14 12h6M4 18h12M20 18h0"/><circle cx="14" cy="6" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>;
    case 'pdf': return <svg {...p}><path d="M6 3h8l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h4"/><path d="M8 14h8M8 17h5"/></svg>;
    case 'sort': return <svg {...p}><path d="M7 4v16M4 7l3-3 3 3M17 20V4M14 17l3 3 3-3"/></svg>;
    case 'more': return <svg {...p}><circle cx="5" cy="12" r="1.4" fill={color}/><circle cx="12" cy="12" r="1.4" fill={color}/><circle cx="19" cy="12" r="1.4" fill={color}/></svg>;
    default: return <svg {...p}><circle cx="12" cy="12" r="3"/></svg>;
  }
};

// Tab bar (mobile bottom nav)
const TabBar = ({ items, active, onChange }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`,
    background: 'var(--bg-elev)', borderTop: '1px solid var(--line)',
    padding: '8px 4px 6px',
  }}>
    {items.map(it => {
      const on = active === it.id;
      return (
        <button key={it.id} onClick={() => onChange(it.id)} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '6px 0', color: on ? 'var(--accent)' : 'var(--ink-3)',
          fontFamily: 'var(--font-ui)',
        }}>
          <div style={{
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 28, borderRadius: 999,
            background: on ? 'var(--accent-soft)' : 'transparent',
            transition: 'background .18s',
          }}>
            <Icon name={it.icon} size={20} />
          </div>
          <span style={{ fontSize: 10.5, fontWeight: on ? 600 : 500 }}>{it.label}</span>
        </button>
      );
    })}
  </div>
);

// Logo mark — slot for chosen logo
const InvoxaMark = ({ size = 28, color = 'var(--ink)', variant = 1 }) => {
  const s = size;
  const c = color;
  // Variant 1 — interlocking quarter-arcs (default)
  if (variant === 1) return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M2 16a14 14 0 0 1 14-14v14H2z" fill={c}/>
      <path d="M30 16a14 14 0 0 1-14 14V16h14z" fill={c}/>
      <circle cx="16" cy="16" r="3" fill="var(--bg)"/>
    </svg>
  );
  if (variant === 2) return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M4 4h10v10H4zM18 18h10v10H18z" fill={c}/>
      <path d="M14 14L18 18" stroke={c} strokeWidth="3"/>
    </svg>
  );
  if (variant === 3) return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M4 4l12 12L4 28V4zM28 4L16 16l12 12V4z" fill={c}/>
    </svg>
  );
  if (variant === 4) return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="10" cy="10" r="6" fill={c}/>
      <circle cx="22" cy="22" r="6" fill={c}/>
      <path d="M10 10L22 22" stroke={c} strokeWidth="2.5"/>
    </svg>
  );
  return null;
};

// Logo wrapper — uses LogoMarks from logos.jsx (aperture is the chosen mark)
const Logo = ({ size = 28, color = 'var(--ink)', wordmark = true, variant = 'slash' }) => {
  // Map old numeric variants to new keys for back-compat
  const map = { 1: 'quarter', 2: 'folded', 3: 'aperture', 4: 'orbit', leaf: 'aperture', voucher: 'folded', arch: 'aperture', sun: 'orbit' };
  const key = map[variant] || (typeof variant === 'string' ? variant : 'slash');
  const Mark = (window.LogoMarks && window.LogoMarks[key]) || (window.LogoMarks && window.LogoMarks.slash);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.32 }}>
      {Mark && <Mark size={size} color={color}/>}
      {wordmark && (
        <span className="display" style={{
          fontSize: size * 0.82, color, letterSpacing: '-0.025em', fontWeight: 500, lineHeight: 1,
        }}>invoxa</span>
      )}
    </div>
  );
};

// Empty state
const Empty = ({ icon = 'doc', title, body, action }) => (
  <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--ink-3)' }}>
    <div style={{
      width: 56, height: 56, margin: '0 auto 14px', borderRadius: 999,
      background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--ink-3)',
    }}>
      <Icon name={icon} size={24} />
    </div>
    <div className="serif" style={{ fontSize: 20, color: 'var(--ink)', marginBottom: 6 }}>{title}</div>
    {body && <div style={{ fontSize: 13, maxWidth: 320, margin: '0 auto 14px', lineHeight: 1.55 }}>{body}</div>}
    {action}
  </div>
);

// Section header — recurring title block
const SectionTitle = ({ kicker, title, action, style }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 'var(--space-4)', ...style }}>
    <div>
      {kicker && <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{kicker}</div>}
      <div className="serif" style={{ fontSize: 22, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{title}</div>
    </div>
    {action}
  </div>
);

Object.assign(window, {
  Btn, IconBtn, Badge, Card, Field, Input, Select, Avatar, Divider, Stat, Icon, TabBar,
  Logo, InvoxaMark, Empty, SectionTitle,
});
