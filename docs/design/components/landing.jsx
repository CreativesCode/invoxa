// Invoxa landing — componentes compartidos por las dos variantes
// Variante "warm" = clara, editorial. Variante "bold" = oscura, terminal-like.

const { useState, useEffect, useRef } = React;

// ─── hook: visible al hacer scroll (animaciones sutiles) ───
const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.15, root: ref.current.closest('[data-landing-scroll]') || null }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
};

const Reveal = ({ children, delay = 0, style = {}, ...rest }) => {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{
      transition: 'opacity 700ms ease, transform 700ms cubic-bezier(0.2,0.7,0.2,1)',
      transitionDelay: `${delay}ms`,
      opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(18px)',
      ...style,
    }} {...rest}>{children}</div>
  );
};

// ─── Terminal animada ───
const TerminalBlock = ({ lines, scale = 1, theme = 'dark' }) => {
  const [shown, setShown] = useState(0);
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setShown(s => s < lines.length ? s + 1 : s), 800);
    return () => clearInterval(id);
  }, [lines.length]);
  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 500);
    return () => clearInterval(id);
  }, []);
  const dark = theme === 'dark';
  return (
    <div style={{
      background: dark ? '#1a1410' : '#fbf7f0', border: dark ? 'none' : '1px solid #e6dcc6',
      borderRadius: 12 * scale, padding: 18 * scale,
      fontFamily: 'Geist Mono, ui-monospace, monospace', fontSize: 12 * scale, lineHeight: 1.65,
      color: dark ? '#fbf7f0' : '#2a1f17', minHeight: 130 * scale,
    }}>
      {lines.slice(0, shown).map((l, i) => (
        <div key={i} style={{ color: l.startsWith('$') ? '#c2410c' : (l.startsWith('✓') ? '#7eb069' : (dark ? '#fbf7f0' : '#2a1f17')), opacity: l.startsWith('$') ? 1 : 0.85 }}>
          {l}
        </div>
      ))}
      {shown < lines.length && <div style={{ color: '#c2410c' }}>...</div>}
      {shown >= lines.length && (
        <div style={{ color: '#c2410c' }}>$ <span style={{ background: blink ? '#c2410c' : 'transparent', color: blink ? (dark ? '#1a1410' : '#fbf7f0') : '#c2410c', padding: '0 4px' }}>_</span></div>
      )}
    </div>
  );
};

// ─── Header ───
const LandingHeader = ({ s, lang, setLang, theme = 'warm', desktop = false }) => {
  const dark = theme === 'bold';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: desktop ? '20px 56px' : '18px 22px',
      borderBottom: dark ? '1px solid rgba(251,247,240,0.08)' : '1px solid #e6dcc6',
      background: dark ? '#1a1410' : '#fbf7f0',
      position: 'sticky', top: 0, zIndex: 10,
      fontFamily: 'Geist, sans-serif',
    }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
        <window.LogoMarks.slash size={desktop ? 26 : 22} color={dark ? '#fbf7f0' : '#2a1f17'}/>
        <span className="display" style={{ fontSize: desktop ? 22 : 19, color: dark ? '#fbf7f0' : '#2a1f17', letterSpacing: '-0.03em', fontWeight: 500 }}>invoxa</span>
      </div>
      {desktop && (
        <div style={{ display: 'flex', gap: 28, fontSize: 13, color: dark ? 'rgba(251,247,240,0.7)' : '#5a4636' }}>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>{s.nav.product}</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>{s.nav.how}</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>{s.nav.cases}</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>{s.nav.faq}</a>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: desktop ? 14 : 10 }}>
        <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          style={{
            background: 'transparent', border: dark ? '1px solid rgba(251,247,240,0.2)' : '1px solid #d8c8a8',
            color: dark ? '#fbf7f0' : '#2a1f17', fontFamily: 'Geist Mono, monospace',
            fontSize: 11, padding: '5px 9px', borderRadius: 6, cursor: 'pointer',
          }}>{lang.toUpperCase()}</button>
        <button style={{
          background: '#c2410c', color: '#fbf7f0', border: 'none',
          fontSize: desktop ? 13 : 12, fontWeight: 600, padding: desktop ? '9px 18px' : '7px 13px',
          borderRadius: 999, cursor: 'pointer', fontFamily: 'Geist, sans-serif',
        }}>{s.nav.login}</button>
      </div>
    </div>
  );
};

// ─── Hero (atrevido oscuro) ───
const LandingHero = ({ s, desktop = false }) => (
  <div style={{
    background: '#1a1410', color: '#fbf7f0', overflow: 'hidden',
    padding: desktop ? '90px 56px 110px' : '60px 22px 70px',
    position: 'relative',
  }}>
    {/* slash field decoration */}
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none' }}>
      {Array.from({ length: 16 }).map((_, r) =>
        Array.from({ length: 12 }).map((_, c) => (
          <line key={`${r}-${c}`} x1={c * 9 - 2} y1={r * 7 + 5} x2={c * 9 + 4} y2={r * 7 - 1} stroke="#c2410c" strokeWidth="0.6"/>
        ))
      )}
    </svg>
    <div style={{ position: 'relative', maxWidth: desktop ? 1200 : '100%', margin: '0 auto', display: desktop ? 'grid' : 'block', gridTemplateColumns: desktop ? '1.2fr 1fr' : '1fr', gap: desktop ? 56 : 40, alignItems: 'center' }}>
      <div>
        <Reveal>
          <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c2410c', marginBottom: 22, fontFamily: 'Geist Mono, monospace' }}>{s.hero.eyebrow}</div>
        </Reveal>
        <Reveal delay={120}>
          <div className="display" style={{
            fontSize: desktop ? 76 : 44, letterSpacing: '-0.04em', fontWeight: 500,
            lineHeight: 1, marginBottom: 26,
          }}>{s.hero.title}</div>
        </Reveal>
        <Reveal delay={220}>
          <div style={{ fontSize: desktop ? 18 : 15, color: 'rgba(251,247,240,0.7)', lineHeight: 1.55, maxWidth: 540, fontFamily: 'Fraunces, serif', marginBottom: 32 }}>
            {s.hero.subtitle}
          </div>
        </Reveal>
        <Reveal delay={320}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            <button style={{
              background: '#c2410c', color: '#fbf7f0', border: 'none',
              fontSize: 14, fontWeight: 600, padding: '14px 26px', borderRadius: 999,
              cursor: 'pointer', fontFamily: 'Geist, sans-serif',
              boxShadow: '0 8px 24px rgba(194,65,12,0.35)',
            }}>{s.hero.cta} →</button>
            <div style={{ fontSize: 11, color: 'rgba(251,247,240,0.5)', fontFamily: 'Geist Mono, monospace' }}>{s.hero.ctaSub}</div>
          </div>
        </Reveal>
      </div>
      <Reveal delay={400}>
        <div style={{ marginTop: desktop ? 0 : 40, position: 'relative' }}>
          <TerminalBlock lines={s.hero.terminal} scale={desktop ? 1.15 : 0.95}/>
          <div style={{ position: 'absolute', top: -14, right: 14, background: '#c2410c', color: '#fbf7f0', fontSize: 9, padding: '3px 8px', borderRadius: 999, fontFamily: 'Geist Mono, monospace', letterSpacing: '0.08em' }}>LIVE · MAY 2026</div>
        </div>
      </Reveal>
    </div>
  </div>
);

// ─── Manifiesto (warm) ───
const LandingManifest = ({ s, desktop = false }) => (
  <div style={{ background: '#fbf7f0', padding: desktop ? '110px 56px' : '70px 22px' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <Reveal>
        <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c2410c', marginBottom: 18, fontFamily: 'Geist Mono, monospace' }}>{s.manifest.tag}</div>
      </Reveal>
      <Reveal delay={120}>
        <div className="display" style={{ fontSize: desktop ? 56 : 36, color: '#2a1f17', letterSpacing: '-0.035em', fontWeight: 500, lineHeight: 1.05, maxWidth: 800, marginBottom: 28 }}>
          {s.manifest.title}
        </div>
      </Reveal>
      <Reveal delay={220}>
        <div style={{ fontSize: desktop ? 18 : 15, color: '#5a4636', lineHeight: 1.6, maxWidth: 720, fontFamily: 'Fraunces, serif', marginBottom: 48 }}>
          {s.manifest.body}
        </div>
      </Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: desktop ? 'repeat(3, 1fr)' : '1fr', gap: desktop ? 28 : 18 }}>
        {s.manifest.pillars.map((p, i) => (
          <Reveal key={i} delay={300 + i * 100}>
            <div style={{ borderTop: '1px solid #2a1f17', paddingTop: 18 }}>
              <div className="display" style={{ fontSize: 22, color: '#2a1f17', letterSpacing: '-0.02em', fontWeight: 500, marginBottom: 8 }}>{p.k}</div>
              <div style={{ fontSize: 13, color: '#5a4636', lineHeight: 1.55, fontFamily: 'Geist, sans-serif' }}>{p.v}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </div>
);

// ─── Cómo funciona (dual: admin + colaborador) ───
const LandingHow = ({ s, variant, desktop = false }) => {
  const Phone = window.Phone;
  const AdminDashboard = window.AdminDashboard;
  const UserDashboard = window.UserDashboard;
  const t = (window.I18N && window.I18N[s === window.L_STRINGS.es ? 'es' : 'en']) || window.I18N.es;
  return (
    <div style={{ background: '#f4ede0', padding: desktop ? '110px 56px' : '70px 22px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c2410c', marginBottom: 16, fontFamily: 'Geist Mono, monospace' }}>{s.how.tag}</div>
        </Reveal>
        <Reveal delay={100}>
          <div className="display" style={{ fontSize: desktop ? 50 : 32, color: '#2a1f17', letterSpacing: '-0.035em', fontWeight: 500, lineHeight: 1.05, marginBottom: 56, maxWidth: 720 }}>
            {s.how.title}
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: desktop ? '1fr 1fr' : '1fr', gap: desktop ? 48 : 56, alignItems: 'flex-start' }}>
          {[s.how.admin, s.how.user].map((role, i) => (
            <Reveal key={i} delay={i * 150}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 12px', background: i === 0 ? '#2a1f17' : '#c2410c', color: '#fbf7f0', borderRadius: 999, alignSelf: 'flex-start', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', fontFamily: 'Geist, sans-serif' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbf7f0' }}/>
                  {role.role.toUpperCase()} · {role.name}
                </div>
                <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {role.actions.map((a, j) => (
                    <li key={j} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 11, color: '#c2410c', fontFamily: 'Geist Mono, monospace', minWidth: 22, paddingTop: 2 }}>{String(j+1).padStart(2,'0')}</span>
                      <span style={{ fontSize: 15, color: '#2a1f17', fontFamily: 'Fraunces, serif', lineHeight: 1.45 }}>{a}</span>
                    </li>
                  ))}
                </ol>
                {/* mini phone mockup */}
                <div style={{ alignSelf: desktop ? 'flex-start' : 'center', marginTop: 14, transform: 'scale(0.7)', transformOrigin: 'top left', width: 400, height: 590, overflow: 'hidden' }}>
                  <Phone mode="light">
                    {i === 0 ? <AdminDashboard t={t} variant="slash"/> : <UserDashboard t={t} variant="slash"/>}
                  </Phone>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Features ───
const LandingFeatures = ({ s, desktop = false }) => (
  <div style={{ background: '#fbf7f0', padding: desktop ? '110px 56px' : '70px 22px' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Reveal>
        <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c2410c', marginBottom: 16, fontFamily: 'Geist Mono, monospace' }}>{s.features.tag}</div>
      </Reveal>
      <Reveal delay={100}>
        <div className="display" style={{ fontSize: desktop ? 50 : 32, color: '#2a1f17', letterSpacing: '-0.035em', fontWeight: 500, lineHeight: 1.05, marginBottom: 48, maxWidth: 720 }}>
          {s.features.title}
        </div>
      </Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: desktop ? 'repeat(3, 1fr)' : '1fr', gap: desktop ? 22 : 16 }}>
        {s.features.items.map((f, i) => (
          <Reveal key={i} delay={i * 80}>
            <div style={{
              background: '#fff', border: '1px solid #e6dcc6', borderRadius: 14,
              padding: 26, height: '100%', boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#1a1410', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <window.LogoMarks.slash size={22} color="#c2410c"/>
              </div>
              <div className="display" style={{ fontSize: 22, color: '#2a1f17', letterSpacing: '-0.02em', fontWeight: 500, marginTop: 6 }}>{f.t}</div>
              <div style={{ fontSize: 13, color: '#5a4636', lineHeight: 1.55, fontFamily: 'Geist, sans-serif' }}>{f.d}</div>
              <div style={{ fontSize: 10, color: '#c2410c', fontFamily: 'Geist Mono, monospace', marginTop: 'auto', paddingTop: 14, borderTop: '1px solid #f4ede0', letterSpacing: '0.08em' }}>FEATURE-{String(i+1).padStart(2,'0')}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </div>
);

// ─── Casos ───
const LandingCases = ({ s, desktop = false }) => (
  <div style={{ background: '#2a1f17', color: '#fbf7f0', padding: desktop ? '110px 56px' : '70px 22px' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <Reveal>
        <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c2410c', marginBottom: 16, fontFamily: 'Geist Mono, monospace' }}>{s.cases.tag}</div>
      </Reveal>
      <Reveal delay={100}>
        <div className="display" style={{ fontSize: desktop ? 50 : 32, letterSpacing: '-0.035em', fontWeight: 500, lineHeight: 1.05, marginBottom: 48 }}>
          {s.cases.title}
        </div>
      </Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: desktop ? 'repeat(3, 1fr)' : '1fr', gap: 18 }}>
        {s.cases.items.map((c, i) => (
          <Reveal key={i} delay={i * 100}>
            <div style={{ borderTop: '1px solid rgba(251,247,240,0.18)', paddingTop: 22, height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 11, color: '#c2410c', fontFamily: 'Geist Mono, monospace', letterSpacing: '0.08em' }}>{c.who.toUpperCase()}</div>
              <div style={{ fontSize: 13, color: 'rgba(251,247,240,0.65)', fontFamily: 'Geist, sans-serif' }}>{c.sit}</div>
              <div className="display" style={{ fontSize: 22, letterSpacing: '-0.02em', fontWeight: 500, lineHeight: 1.2, marginTop: 'auto' }}>{c.res}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </div>
);

// ─── FAQ ───
const LandingFAQ = ({ s, desktop = false }) => {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ background: '#fbf7f0', padding: desktop ? '110px 56px' : '70px 22px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Reveal>
          <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c2410c', marginBottom: 16, fontFamily: 'Geist Mono, monospace' }}>{s.faq.tag}</div>
        </Reveal>
        <Reveal delay={100}>
          <div className="display" style={{ fontSize: desktop ? 50 : 32, color: '#2a1f17', letterSpacing: '-0.035em', fontWeight: 500, lineHeight: 1.05, marginBottom: 40 }}>
            {s.faq.title}
          </div>
        </Reveal>
        <div>
          {s.faq.items.map((f, i) => (
            <Reveal key={i} delay={i * 60}>
              <div style={{ borderTop: '1px solid #e6dcc6', padding: '18px 0', cursor: 'pointer' }} onClick={() => setOpen(open === i ? -1 : i)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 18 }}>
                  <div className="display" style={{ fontSize: desktop ? 22 : 18, color: '#2a1f17', letterSpacing: '-0.02em', fontWeight: 500 }}>{f.q}</div>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #2a1f17', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#2a1f17', flexShrink: 0, transform: open === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 250ms' }}>+</div>
                </div>
                {open === i && (
                  <div style={{ fontSize: 14, color: '#5a4636', fontFamily: 'Fraunces, serif', lineHeight: 1.55, marginTop: 12, maxWidth: 700 }}>{f.a}</div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── CTA + Footer ───
const LandingCTA = ({ s, desktop = false }) => (
  <div style={{ background: '#1a1410', color: '#fbf7f0', padding: desktop ? '110px 56px' : '80px 22px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.06 }}>
      <window.LogoMarks.slash size={desktop ? 600 : 360} color="#c2410c"/>
    </div>
    <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
      <Reveal>
        <div className="display" style={{ fontSize: desktop ? 64 : 38, letterSpacing: '-0.04em', fontWeight: 500, lineHeight: 1, marginBottom: 22 }}>{s.cta.title}</div>
      </Reveal>
      <Reveal delay={120}>
        <div style={{ fontSize: desktop ? 17 : 14, color: 'rgba(251,247,240,0.65)', fontFamily: 'Fraunces, serif', marginBottom: 32, lineHeight: 1.55 }}>{s.cta.sub}</div>
      </Reveal>
      <Reveal delay={220}>
        <button style={{
          background: '#c2410c', color: '#fbf7f0', border: 'none',
          fontSize: 14, fontWeight: 600, padding: '14px 28px', borderRadius: 999,
          cursor: 'pointer', fontFamily: 'Geist, sans-serif',
          boxShadow: '0 10px 30px rgba(194,65,12,0.4)',
        }}>{s.cta.btn} →</button>
      </Reveal>
    </div>
  </div>
);

const LandingFooter = ({ s, desktop = false }) => (
  <div style={{ background: '#1a1410', color: 'rgba(251,247,240,0.6)', padding: desktop ? '40px 56px' : '32px 22px', borderTop: '1px solid rgba(251,247,240,0.08)', fontFamily: 'Geist, sans-serif' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: desktop ? 'grid' : 'flex', gridTemplateColumns: desktop ? '2fr 1fr 1fr 1fr' : '1fr', flexDirection: 'column', gap: desktop ? 36 : 24 }}>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <window.LogoMarks.slash size={20} color="#fbf7f0"/>
          <span className="display" style={{ fontSize: 18, color: '#fbf7f0', letterSpacing: '-0.03em', fontWeight: 500 }}>invoxa</span>
        </div>
        <div style={{ fontSize: 11, fontFamily: 'Geist Mono, monospace' }}>{s.footer.by}</div>
      </div>
      {s.footer.cols.map((c, i) => (
        <div key={i}>
          <div style={{ fontSize: 10, color: '#c2410c', fontFamily: 'Geist Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{c.t}</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
            {c.l.map((l, j) => <li key={j} style={{ color: 'rgba(251,247,240,0.6)' }}>{l}</li>)}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

// ─── PÁGINA COMPLETA: una variante (warm o bold mismo orden, distinto énfasis) ───
const LandingPage = ({ lang, setLang, desktop = false }) => {
  const s = window.L_STRINGS[lang];
  return (
    <div data-landing-scroll style={{ background: '#fbf7f0', height: '100%', overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
      <LandingHeader s={s} lang={lang} setLang={setLang} theme="warm" desktop={desktop}/>
      <LandingHero s={s} desktop={desktop}/>
      <LandingManifest s={s} desktop={desktop}/>
      <LandingHow s={s} desktop={desktop}/>
      <LandingFeatures s={s} desktop={desktop}/>
      <LandingCases s={s} desktop={desktop}/>
      <LandingFAQ s={s} desktop={desktop}/>
      <LandingCTA s={s} desktop={desktop}/>
      <LandingFooter s={s} desktop={desktop}/>
    </div>
  );
};

// ─── VARIANTE BOLD: hero más grande, todo más oscuro, terracota intenso, terminal protagonista ───
const LandingPageBold = ({ lang, setLang, desktop = false }) => {
  const s = window.L_STRINGS[lang];
  return (
    <div data-landing-scroll style={{ background: '#1a1410', height: '100%', overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
      <LandingHeader s={s} lang={lang} setLang={setLang} theme="bold" desktop={desktop}/>
      {/* HERO BOLD — más grande, slash gigante */}
      <div style={{ background: '#1a1410', color: '#fbf7f0', position: 'relative', overflow: 'hidden', padding: desktop ? '110px 56px 130px' : '60px 22px 80px' }}>
        <div style={{ position: 'absolute', top: '50%', right: desktop ? -120 : -180, transform: 'translateY(-50%)', opacity: 0.08, pointerEvents: 'none' }}>
          <window.LogoMarks.slash size={desktop ? 900 : 600} color="#c2410c"/>
        </div>
        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c2410c', marginBottom: 30, fontFamily: 'Geist Mono, monospace' }}>{s.hero.eyebrow}</div>
          </Reveal>
          <Reveal delay={120}>
            <div className="display" style={{ fontSize: desktop ? 110 : 52, letterSpacing: '-0.05em', fontWeight: 500, lineHeight: 0.95, marginBottom: 32, maxWidth: 1000 }}>
              {s.hero.title}
            </div>
          </Reveal>
          <Reveal delay={220}>
            <div style={{ fontSize: desktop ? 20 : 15, color: 'rgba(251,247,240,0.7)', lineHeight: 1.55, maxWidth: 580, fontFamily: 'Fraunces, serif', marginBottom: 36 }}>{s.hero.subtitle}</div>
          </Reveal>
          <Reveal delay={300}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
              <button style={{ background: '#c2410c', color: '#fbf7f0', border: 'none', fontSize: 15, fontWeight: 600, padding: '15px 30px', borderRadius: 999, cursor: 'pointer', fontFamily: 'Geist, sans-serif', boxShadow: '0 12px 32px rgba(194,65,12,0.4)' }}>{s.hero.cta} →</button>
              <div style={{ fontSize: 11, color: 'rgba(251,247,240,0.5)', fontFamily: 'Geist Mono, monospace' }}>{s.hero.ctaSub}</div>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div style={{ maxWidth: 560 }}>
              <TerminalBlock lines={s.hero.terminal} scale={desktop ? 1.1 : 0.9}/>
            </div>
          </Reveal>
        </div>
      </div>
      {/* MANIFIESTO sobre fondo oscuro */}
      <div style={{ background: '#241915', color: '#fbf7f0', padding: desktop ? '110px 56px' : '70px 22px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal><div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c2410c', marginBottom: 18, fontFamily: 'Geist Mono, monospace' }}>{s.manifest.tag}</div></Reveal>
          <Reveal delay={100}><div className="display" style={{ fontSize: desktop ? 56 : 36, letterSpacing: '-0.035em', fontWeight: 500, lineHeight: 1.05, maxWidth: 800, marginBottom: 28 }}>{s.manifest.title}</div></Reveal>
          <Reveal delay={200}><div style={{ fontSize: desktop ? 18 : 15, color: 'rgba(251,247,240,0.7)', lineHeight: 1.6, maxWidth: 720, fontFamily: 'Fraunces, serif', marginBottom: 48 }}>{s.manifest.body}</div></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: desktop ? 'repeat(3, 1fr)' : '1fr', gap: desktop ? 28 : 18 }}>
            {s.manifest.pillars.map((p, i) => (
              <Reveal key={i} delay={300 + i * 100}>
                <div style={{ borderTop: '1px solid #c2410c', paddingTop: 18 }}>
                  <div className="display" style={{ fontSize: 22, letterSpacing: '-0.02em', fontWeight: 500, marginBottom: 8 }}>{p.k}</div>
                  <div style={{ fontSize: 13, color: 'rgba(251,247,240,0.7)', lineHeight: 1.55, fontFamily: 'Geist, sans-serif' }}>{p.v}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <LandingHow s={s} desktop={desktop}/>
      <LandingFeatures s={s} desktop={desktop}/>
      <LandingCases s={s} desktop={desktop}/>
      <LandingFAQ s={s} desktop={desktop}/>
      <LandingCTA s={s} desktop={desktop}/>
      <LandingFooter s={s} desktop={desktop}/>
    </div>
  );
};

Object.assign(window, { LandingPage, LandingPageBold });
