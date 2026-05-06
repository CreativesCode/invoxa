// Invoxa — Brand system page (imagotipo + isotipo + combinaciones)
// Slash is the chosen mark.

const Mark = (props) => {
  const M = window.LogoMarks.slash;
  return <M {...props}/>;
};

// ─── ISOTIPO (símbolo solo) ───
const BrandIsotipo = ({ bg, color, size = 96, label }) => (
  <div style={{
    width: '100%', height: '100%', background: bg,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: 24, boxSizing: 'border-box', position: 'relative',
  }}>
    <Mark size={size} color={color}/>
    {label && (
      <div style={{
        position: 'absolute', bottom: 14, left: 14,
        fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: color === '#fbf7f0' ? 'rgba(251,247,240,0.45)' : 'rgba(42,31,23,0.4)',
        fontFamily: 'Geist, sans-serif',
      }}>{label}</div>
    )}
  </div>
);

// ─── IMAGOTIPO (símbolo + texto, lockup) ───
const BrandImagotipo = ({ bg, color, size = 40, layout = 'horizontal', label, tagline }) => (
  <div style={{
    width: '100%', height: '100%', background: bg,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: 28, boxSizing: 'border-box', position: 'relative',
  }}>
    {layout === 'horizontal' && (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.36 }}>
        <Mark size={size} color={color}/>
        <span className="display" style={{ fontSize: size * 0.95, color, letterSpacing: '-0.03em', fontWeight: 500, lineHeight: 1 }}>invoxa</span>
      </div>
    )}
    {layout === 'vertical' && (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <Mark size={size * 1.4} color={color}/>
        <span className="display" style={{ fontSize: size * 0.95, color, letterSpacing: '-0.03em', fontWeight: 500, lineHeight: 1 }}>invoxa</span>
      </div>
    )}
    {layout === 'tagline' && (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.36 }}>
          <Mark size={size} color={color}/>
          <span className="display" style={{ fontSize: size * 0.95, color, letterSpacing: '-0.03em', fontWeight: 500, lineHeight: 1 }}>invoxa</span>
        </div>
        <div style={{
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: color === '#fbf7f0' ? 'rgba(251,247,240,0.55)' : 'rgba(42,31,23,0.5)',
          fontFamily: 'Geist, sans-serif', borderTop: `1px solid ${color === '#fbf7f0' ? 'rgba(251,247,240,0.2)' : 'rgba(42,31,23,0.15)'}`,
          paddingTop: 10, width: '100%', textAlign: 'center',
        }}>{tagline || 'Billing · Informage Studios'}</div>
      </div>
    )}
    {label && (
      <div style={{
        position: 'absolute', bottom: 14, left: 14,
        fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: color === '#fbf7f0' ? 'rgba(251,247,240,0.45)' : 'rgba(42,31,23,0.4)',
        fontFamily: 'Geist, sans-serif',
      }}>{label}</div>
    )}
  </div>
);

// ─── ESCALAS / TAMAÑOS ───
const BrandSizes = () => (
  <div style={{ width: '100%', height: '100%', background: '#fbf7f0', padding: 28, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
    <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(42,31,23,0.5)', fontFamily: 'Geist, sans-serif' }}>Escalas mínimas</div>
    {[64, 40, 24, 16].map(s => (
      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 14, borderBottom: '1px solid #e6dcc6' }}>
        <div style={{ width: 80, fontSize: 11, fontFamily: 'Geist Mono, monospace', color: '#7a6a58' }}>{s}px</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: s * 0.36 }}>
          <Mark size={s} color="#2a1f17"/>
          <span className="display" style={{ fontSize: s * 0.95, color: '#2a1f17', letterSpacing: '-0.03em', fontWeight: 500, lineHeight: 1 }}>invoxa</span>
        </div>
      </div>
    ))}
  </div>
);

// ─── ÁREA DE PROTECCIÓN / CONSTRUCCIÓN ───
const BrandClearspace = () => (
  <div style={{ width: '100%', height: '100%', background: '#fbf7f0', padding: 28, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
    <div style={{ position: 'absolute', top: 14, left: 14, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(42,31,23,0.5)', fontFamily: 'Geist, sans-serif' }}>Área de protección</div>
    {/* clearspace box */}
    <div style={{ position: 'relative', padding: 32, border: '1px dashed #c2410c' }}>
      <div style={{ position: 'absolute', top: -7, left: 14, fontSize: 9, fontFamily: 'Geist Mono, monospace', color: '#c2410c', background: '#fbf7f0', padding: '0 4px' }}>x</div>
      <div style={{ position: 'absolute', bottom: -7, right: 14, fontSize: 9, fontFamily: 'Geist Mono, monospace', color: '#c2410c', background: '#fbf7f0', padding: '0 4px' }}>x</div>
      <div style={{ position: 'absolute', top: 14, left: -7, fontSize: 9, fontFamily: 'Geist Mono, monospace', color: '#c2410c', background: '#fbf7f0', padding: '0 4px', writingMode: 'vertical-rl' }}>x</div>
      <div style={{ position: 'absolute', bottom: 14, right: -7, fontSize: 9, fontFamily: 'Geist Mono, monospace', color: '#c2410c', background: '#fbf7f0', padding: '0 4px', writingMode: 'vertical-rl' }}>x</div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
        <Mark size={48} color="#2a1f17"/>
        <span className="display" style={{ fontSize: 44, color: '#2a1f17', letterSpacing: '-0.03em', fontWeight: 500, lineHeight: 1 }}>invoxa</span>
      </div>
    </div>
  </div>
);

// ─── PALETA APLICADA AL LOGO ───
const BrandPalette = () => (
  <div style={{ width: '100%', height: '100%', background: '#fbf7f0', padding: 28, boxSizing: 'border-box' }}>
    <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(42,31,23,0.5)', fontFamily: 'Geist, sans-serif', marginBottom: 18 }}>Paleta · usos válidos</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {[
        { bg: '#2a1f17', fg: '#fbf7f0', n: 'Café · crema' },
        { bg: '#c2410c', fg: '#fbf7f0', n: 'Terracota · crema' },
        { bg: '#fbf7f0', fg: '#2a1f17', n: 'Crema · café' },
        { bg: '#f4ede0', fg: '#c2410c', n: 'Beige · terracota' },
      ].map((p, i) => (
        <div key={i} style={{ background: p.bg, padding: 18, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, height: 88 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <Mark size={22} color={p.fg}/>
            <span className="display" style={{ fontSize: 20, color: p.fg, letterSpacing: '-0.03em', fontWeight: 500, lineHeight: 1 }}>invoxa</span>
          </div>
          <div style={{ fontSize: 9.5, color: p.fg, opacity: 0.55, fontFamily: 'Geist Mono, monospace' }}>{p.n}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── DON'TS ───
const BrandDonts = () => (
  <div style={{ width: '100%', height: '100%', background: '#fbf7f0', padding: 28, boxSizing: 'border-box' }}>
    <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(161,64,64,0.7)', fontFamily: 'Geist, sans-serif', marginBottom: 18 }}>Usos incorrectos</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {[
        { label: 'No estirar', el: <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, transform: 'scaleX(1.6)' }}><Mark size={28} color="#2a1f17"/><span className="display" style={{ fontSize: 26, color: '#2a1f17', letterSpacing: '-0.03em', fontWeight: 500, lineHeight: 1 }}>invoxa</span></div> },
        { label: 'No rotar', el: <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, transform: 'rotate(-12deg)' }}><Mark size={28} color="#2a1f17"/><span className="display" style={{ fontSize: 26, color: '#2a1f17', letterSpacing: '-0.03em', fontWeight: 500, lineHeight: 1 }}>invoxa</span></div> },
        { label: 'No usar gradientes', el: <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #c2410c, #a86b1a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}><Mark size={28} color="#c2410c"/><span className="display" style={{ fontSize: 26, letterSpacing: '-0.03em', fontWeight: 500, lineHeight: 1 }}>invoxa</span></div> },
        { label: 'No invertir', el: <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: 6, background: '#a14040' }}><Mark size={28} color="#fbf7f0"/><span className="display" style={{ fontSize: 26, color: '#fbf7f0', letterSpacing: '-0.03em', fontWeight: 500, lineHeight: 1 }}>invoxa</span></div> },
      ].map((d, i) => (
        <div key={i} style={{ background: '#fff', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 110, position: 'relative', overflow: 'hidden', border: '1px solid #efd2cb' }}>
          <div style={{ position: 'absolute', top: 6, right: 8, fontSize: 14, color: '#a14040' }}>✕</div>
          {d.el}
          <div style={{ fontSize: 10, color: '#a14040', marginTop: 10, fontFamily: 'Geist, sans-serif', letterSpacing: '0.04em' }}>{d.label}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── EXPLORACIÓN DE 6 OPCIONES ───
const BrandLogoOption = ({ markKey, name, meaning, accent }) => {
  const M = window.LogoMarks[markKey];
  return (
    <div style={{
      width: '100%', height: '100%', background: '#fbf7f0',
      display: 'flex', flexDirection: 'column',
      padding: 24, boxSizing: 'border-box',
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <M size={64} color={accent ? '#c2410c' : '#2a1f17'} bg="transparent"/>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
          <M size={20} color="#2a1f17"/>
          <span className="display" style={{ fontSize: 19, color: '#2a1f17', letterSpacing: '-0.03em', fontWeight: 500, lineHeight: 1 }}>invoxa</span>
        </div>
      </div>
      <div style={{ paddingTop: 14, borderTop: '1px solid #e6dcc6' }}>
        <div style={{ fontSize: 11, color: '#7a6a58', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{name}</div>
        <div style={{ fontSize: 12, color: '#2a1f17', marginTop: 4, lineHeight: 1.4 }}>{meaning}</div>
      </div>
    </div>
  );
};

Object.assign(window, { BrandIsotipo, BrandImagotipo, BrandSizes, BrandClearspace, BrandPalette, BrandDonts, BrandLogoOption });
