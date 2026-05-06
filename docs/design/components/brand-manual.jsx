// Invoxa — Brand manual extendido para Slash
// Componentes adicionales que complementan a brand.jsx

const SlashMark = (props) => {
  const M = window.LogoMarks.slash;
  return <M {...props}/>;
};

// ─────────────────────────────────────
// 1) PORTADA / HERO DEL MANUAL
// ─────────────────────────────────────
const ManualCover = () => (
  <div style={{
    width: '100%', height: '100%', background: '#1a1410', color: '#fbf7f0',
    padding: 48, boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.55, fontFamily: 'Geist, sans-serif' }}>Brand Manual · v1.0</div>
      <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.55, fontFamily: 'Geist, sans-serif' }}>Informage Studios · 2025</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <SlashMark size={160} color="#c2410c"/>
      <div>
        <div className="display" style={{ fontSize: 92, letterSpacing: '-0.04em', fontWeight: 500, lineHeight: 0.95 }}>invoxa</div>
        <div style={{ fontSize: 16, marginTop: 18, opacity: 0.7, fontFamily: 'Geist, sans-serif', maxWidth: 480, lineHeight: 1.5 }}>
          Sistema de identidad para una herramienta de facturación. Marca, tipografía, color, voz y aplicaciones — definidos para preservar coherencia a través de productos digitales, comunicación interna y materiales impresos.
        </div>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 10, fontFamily: 'Geist Mono, monospace', opacity: 0.5 }}>
      <div>SLASH · the chosen mark</div>
      <div>01 / 12</div>
    </div>
  </div>
);

// ─────────────────────────────────────
// 2) CONCEPTO Y SIGNIFICADO DEL SLASH
// ─────────────────────────────────────
const ManualConcept = () => (
  <div style={{ width: '100%', height: '100%', background: '#fbf7f0', padding: 36, boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(42,31,23,0.5)', fontFamily: 'Geist, sans-serif' }}>02 · Concepto</div>
      <div>
        <div className="display" style={{ fontSize: 38, color: '#2a1f17', letterSpacing: '-0.025em', fontWeight: 500, lineHeight: 1.05, marginBottom: 18 }}>El comando que cierra el mes.</div>
        <div style={{ fontSize: 13, color: '#2a1f17', lineHeight: 1.55, fontFamily: 'Fraunces, serif', opacity: 0.85 }}>
          Slash es la herramienta del operador: un trazo diagonal que separa lo cobrado de lo pendiente, lo facturado de lo presupuestado. El cursor que lo acompaña representa la entrada — el momento exacto en que un colaborador captura su trabajo y un administrador lo aprueba.
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontFamily: 'Geist, sans-serif' }}>
        {[
          { k: 'Comando', v: 'Slash es la entrada. El sistema responde.' },
          { k: 'División', v: 'Separa lo facturado de lo pendiente.' },
          { k: 'Cursor', v: 'Captura del trabajo. Aprobación humana.' },
          { k: 'Vivo', v: 'Titila. El mes está en curso.' },
        ].map((c, i) => (
          <div key={i}>
            <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c2410c', marginBottom: 4 }}>{c.k}</div>
            <div style={{ fontSize: 11, color: '#2a1f17', opacity: 0.75, lineHeight: 1.4 }}>{c.v}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ background: '#2a1f17', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, position: 'relative' }}>
      <SlashMark size={200} color="#c2410c"/>
      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, fontSize: 9, fontFamily: 'Geist Mono, monospace', color: 'rgba(251,247,240,0.4)', display: 'flex', justifyContent: 'space-between' }}>
        <span>$ invoxa --close-month</span>
        <span>▌</span>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────
// 3) ANATOMÍA DEL ISOTIPO
// ─────────────────────────────────────
const ManualAnatomy = () => (
  <div style={{ width: '100%', height: '100%', background: '#fbf7f0', padding: 36, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(42,31,23,0.5)', fontFamily: 'Geist, sans-serif' }}>03 · Anatomía</div>
      <div style={{ fontSize: 10, letterSpacing: '0.1em', color: '#7a6a58', fontFamily: 'Geist Mono, monospace' }}>64 × 64 grid</div>
    </div>
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'center' }}>
      <div style={{ position: 'relative', aspectRatio: '1', background: '#fff', borderRadius: 14, padding: 28, boxSizing: 'border-box', overflow: 'hidden' }}>
        {/* grid overlay */}
        <svg width="100%" height="100%" viewBox="0 0 64 64" style={{ position: 'absolute', inset: 28 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 8} x2="64" y2={i * 8} stroke="#e6dcc6" strokeWidth="0.3"/>
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 8} y1="0" x2={i * 8} y2="64" stroke="#e6dcc6" strokeWidth="0.3"/>
          ))}
        </svg>
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SlashMark size={200} color="#2a1f17"/>
        </div>
        {/* annotation lines */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <text x="86%" y="22%" fontSize="9" fill="#c2410c" fontFamily="Geist Mono, monospace">prompt · 2 dots</text>
          <text x="62%" y="42%" fontSize="9" fill="#c2410c" fontFamily="Geist Mono, monospace">slash · 7px stroke</text>
          <text x="68%" y="86%" fontSize="9" fill="#c2410c" fontFamily="Geist Mono, monospace">cursor · 11×7</text>
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontFamily: 'Geist, sans-serif' }}>
        {[
          { n: '01', t: 'Prompt', d: 'Dos puntos a la izquierda. Indican entrada de comando, opacidad 55%.' },
          { n: '02', t: 'Slash diagonal', d: 'Trazo principal de 7px, ángulo 65°, terminales redondeados.' },
          { n: '03', t: 'Cursor', d: 'Bloque sólido 11×7 abajo a la derecha. Anclaje del comando.' },
          { n: '04', t: 'Caja', d: 'Container 64×64 con radio de 14. Solo en versiones contenidas.' },
        ].map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: 14, borderBottom: i < 3 ? '1px solid #e6dcc6' : 'none' }}>
            <div style={{ fontSize: 10, color: '#c2410c', fontFamily: 'Geist Mono, monospace', minWidth: 24 }}>{p.n}</div>
            <div>
              <div style={{ fontSize: 13, color: '#2a1f17', fontWeight: 600, marginBottom: 3 }}>{p.t}</div>
              <div style={{ fontSize: 11, color: '#7a6a58', lineHeight: 1.45 }}>{p.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────
// 4) PALETA COMPLETA — TODOS LOS TONOS
// ─────────────────────────────────────
const ManualPaletteFull = () => {
  const groups = [
    { name: 'Café · Ink', vals: [
      { hex: '#1a1410', n: '900' },
      { hex: '#2a1f17', n: '800' },
      { hex: '#3d2e22', n: '700' },
      { hex: '#5a4636', n: '600' },
      { hex: '#7a6a58', n: '500' },
    ]},
    { name: 'Crema · Paper', vals: [
      { hex: '#fbf7f0', n: '50' },
      { hex: '#f4ede0', n: '100' },
      { hex: '#ebe1ce', n: '200' },
      { hex: '#dbcdb4', n: '300' },
      { hex: '#c2b094', n: '400' },
    ]},
    { name: 'Terracota · Accent', vals: [
      { hex: '#fef0e8', n: '50' },
      { hex: '#f5b896', n: '300' },
      { hex: '#e8753f', n: '500' },
      { hex: '#c2410c', n: '600' },
      { hex: '#8a2c08', n: '800' },
    ]},
    { name: 'Sistema · Status', vals: [
      { hex: '#5b8a47', n: 'success' },
      { hex: '#b88c2b', n: 'warning' },
      { hex: '#a14040', n: 'danger' },
      { hex: '#3a6b87', n: 'info' },
      { hex: '#7a6a58', n: 'neutral' },
    ]},
  ];
  return (
    <div style={{ width: '100%', height: '100%', background: '#fbf7f0', padding: 36, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(42,31,23,0.5)', fontFamily: 'Geist, sans-serif' }}>04 · Paleta</div>
        <div style={{ fontSize: 10, color: '#7a6a58', fontFamily: 'Geist Mono, monospace' }}>20 tonos · 4 grupos</div>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {groups.map((g, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 10, color: '#2a1f17', fontFamily: 'Geist, sans-serif', fontWeight: 600, marginBottom: 4 }}>{g.name}</div>
            {g.vals.map((v, j) => (
              <div key={j} style={{ background: v.hex, borderRadius: 6, padding: '14px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                <div style={{ fontSize: 9, fontFamily: 'Geist Mono, monospace', color: parseInt(v.hex.slice(1,3),16) < 140 ? '#fbf7f0' : '#2a1f17', opacity: 0.85 }}>{v.n}</div>
                <div style={{ fontSize: 9, fontFamily: 'Geist Mono, monospace', color: parseInt(v.hex.slice(1,3),16) < 140 ? '#fbf7f0' : '#2a1f17', opacity: 0.7 }}>{v.hex}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────
// 5) TIPOGRAFÍA — JERARQUÍA COMPLETA
// ─────────────────────────────────────
const ManualType = () => (
  <div style={{ width: '100%', height: '100%', background: '#fbf7f0', padding: 36, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(42,31,23,0.5)', fontFamily: 'Geist, sans-serif' }}>05 · Tipografía</div>
      <div style={{ fontSize: 10, color: '#7a6a58', fontFamily: 'Geist Mono, monospace' }}>Fraunces · Geist · Geist Mono</div>
    </div>
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <div style={{ fontSize: 11, color: '#c2410c', fontFamily: 'Geist, sans-serif', fontWeight: 600, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Display · Fraunces</div>
        <div className="display" style={{ fontSize: 56, color: '#2a1f17', letterSpacing: '-0.04em', fontWeight: 500, lineHeight: 1, marginBottom: 4 }}>$ 142,500</div>
        <div style={{ fontSize: 9, fontFamily: 'Geist Mono, monospace', color: '#7a6a58', marginBottom: 16 }}>Fraunces · 56/56 · -0.04em</div>
        <div className="display" style={{ fontSize: 32, color: '#2a1f17', letterSpacing: '-0.03em', fontWeight: 500, lineHeight: 1.05, marginBottom: 4 }}>Cierre del mes</div>
        <div style={{ fontSize: 9, fontFamily: 'Geist Mono, monospace', color: '#7a6a58', marginBottom: 16 }}>Fraunces · 32/34 · -0.03em</div>
        <div className="display" style={{ fontSize: 22, color: '#2a1f17', letterSpacing: '-0.02em', fontWeight: 500, lineHeight: 1.15, marginBottom: 4 }}>Subtítulo serif suave</div>
        <div style={{ fontSize: 9, fontFamily: 'Geist Mono, monospace', color: '#7a6a58' }}>Fraunces · 22/26</div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#c2410c', fontFamily: 'Geist, sans-serif', fontWeight: 600, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>UI · Geist</div>
        <div style={{ fontSize: 16, color: '#2a1f17', fontWeight: 600, marginBottom: 4, fontFamily: 'Geist, sans-serif' }}>Etiqueta de sección</div>
        <div style={{ fontSize: 9, fontFamily: 'Geist Mono, monospace', color: '#7a6a58', marginBottom: 14 }}>Geist 600 · 16/22</div>
        <div style={{ fontSize: 13, color: '#2a1f17', marginBottom: 4, fontFamily: 'Geist, sans-serif', lineHeight: 1.5 }}>Texto base de interfaz, listas y descripciones cortas dentro del producto.</div>
        <div style={{ fontSize: 9, fontFamily: 'Geist Mono, monospace', color: '#7a6a58', marginBottom: 14 }}>Geist 400 · 13/20</div>
        <div style={{ fontSize: 11, color: '#7a6a58', marginBottom: 4, fontFamily: 'Geist, sans-serif' }}>Caption · metadata, fechas, hints</div>
        <div style={{ fontSize: 9, fontFamily: 'Geist Mono, monospace', color: '#7a6a58', marginBottom: 18 }}>Geist 400 · 11/16</div>

        <div style={{ fontSize: 11, color: '#c2410c', fontFamily: 'Geist, sans-serif', fontWeight: 600, marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Mono · Geist Mono</div>
        <div style={{ fontSize: 13, fontFamily: 'Geist Mono, monospace', color: '#2a1f17', marginBottom: 4 }}>INV-2025-0142 · $ 4,250.00</div>
        <div style={{ fontSize: 9, fontFamily: 'Geist Mono, monospace', color: '#7a6a58' }}>Geist Mono · IDs, tabular nums</div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────
// 6) VOZ Y TONO
// ─────────────────────────────────────
const ManualVoice = () => (
  <div style={{ width: '100%', height: '100%', background: '#fbf7f0', padding: 36, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(42,31,23,0.5)', fontFamily: 'Geist, sans-serif' }}>06 · Voz y tono</div>
      <div style={{ fontSize: 10, color: '#7a6a58', fontFamily: 'Geist Mono, monospace' }}>Formal · cercano · directo</div>
    </div>
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      {[
        { yes: 'Tu factura está lista para revisión.', no: '¡Tu factura ya está! 🎉', label: 'Factura completada' },
        { yes: 'No pudimos procesar este pago. Verifica los datos.', no: 'Ups, algo salió mal :(', label: 'Error de pago' },
        { yes: 'Quedan 3 días para cerrar el mes.', no: 'Date prisa, se acaba el tiempo!', label: 'Recordatorio' },
        { yes: 'Aprobado por María Acosta · 14:32', no: 'Aprobado por la jefa', label: 'Auditoría' },
      ].map((c, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 10, color: '#7a6a58', fontFamily: 'Geist, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{c.label}</div>
          <div style={{ background: '#fff', border: '1px solid #d8c8a8', borderLeft: '3px solid #5b8a47', borderRadius: 6, padding: 14, fontSize: 12.5, color: '#2a1f17', fontFamily: 'Fraunces, serif', lineHeight: 1.45 }}>
            <div style={{ fontSize: 9, fontFamily: 'Geist Mono, monospace', color: '#5b8a47', marginBottom: 6 }}>SÍ</div>
            {c.yes}
          </div>
          <div style={{ background: '#fff', border: '1px solid #efd2cb', borderLeft: '3px solid #a14040', borderRadius: 6, padding: 14, fontSize: 12.5, color: '#2a1f17', fontFamily: 'Fraunces, serif', lineHeight: 1.45, opacity: 0.7 }}>
            <div style={{ fontSize: 9, fontFamily: 'Geist Mono, monospace', color: '#a14040', marginBottom: 6 }}>NO</div>
            {c.no}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────
// 7) ICONOGRAFÍA / SISTEMA DE ICONOS
// ─────────────────────────────────────
const ManualIconography = () => {
  const Icon = ({ children }) => (
    <div style={{ width: 56, height: 56, background: '#fff', border: '1px solid #e6dcc6', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2a1f17" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
    </div>
  );
  const icons = [
    { n: 'invoice', el: <><rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 8h6M9 12h6M9 16h4"/></> },
    { n: 'task', el: <><path d="M5 12l4 4 10-10"/></> },
    { n: 'project', el: <><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 9h18"/></> },
    { n: 'user', el: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/></> },
    { n: 'currency', el: <><path d="M12 4v16M8 8h6a2 2 0 010 4h-4a2 2 0 000 4h6"/></> },
    { n: 'pending', el: <><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2"/></> },
    { n: 'approved', el: <><circle cx="12" cy="12" r="8"/><path d="M8 12l3 3 5-6"/></> },
    { n: 'reject', el: <><circle cx="12" cy="12" r="8"/><path d="M9 9l6 6M15 9l-6 6"/></> },
    { n: 'invite', el: <><path d="M16 4h4v4M20 4l-7 7"/><path d="M9 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-3"/></> },
    { n: 'archive', el: <><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 001 1h12a1 1 0 001-1V8M10 12h4"/></> },
    { n: 'export', el: <><path d="M12 4v12M7 9l5-5 5 5"/><path d="M5 20h14"/></> },
    { n: 'history', el: <><path d="M3 12a9 9 0 109-9"/><path d="M3 4v5h5"/><path d="M12 7v5l3 2"/></> },
  ];
  return (
    <div style={{ width: '100%', height: '100%', background: '#fbf7f0', padding: 36, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(42,31,23,0.5)', fontFamily: 'Geist, sans-serif' }}>07 · Iconografía</div>
        <div style={{ fontSize: 10, color: '#7a6a58', fontFamily: 'Geist Mono, monospace' }}>1.6 stroke · 24×24 · línea</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
        {icons.map((ic, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <Icon>{ic.el}</Icon>
            <div style={{ fontSize: 10, color: '#7a6a58', fontFamily: 'Geist Mono, monospace' }}>{ic.n}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────
// 8) ESPACIO Y RADIOS
// ─────────────────────────────────────
const ManualSpacing = () => {
  const spaces = [4, 8, 12, 16, 24, 32, 48, 64];
  const radii = [{ n: 'sm', v: 4 }, { n: 'md', v: 8 }, { n: 'lg', v: 14 }, { n: 'xl', v: 22 }, { n: 'full', v: 999 }];
  return (
    <div style={{ width: '100%', height: '100%', background: '#fbf7f0', padding: 36, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(42,31,23,0.5)', fontFamily: 'Geist, sans-serif' }}>08 · Espacio y radios</div>
        <div style={{ fontSize: 10, color: '#7a6a58', fontFamily: 'Geist Mono, monospace' }}>base 4px · escala geométrica</div>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <div style={{ fontSize: 11, color: '#c2410c', fontFamily: 'Geist, sans-serif', fontWeight: 600, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Spacing tokens</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {spaces.map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 10, color: '#7a6a58', fontFamily: 'Geist Mono, monospace', minWidth: 32 }}>{s}px</div>
                <div style={{ height: 12, width: s * 3, background: '#c2410c', borderRadius: 2 }}/>
                <div style={{ fontSize: 10, color: '#7a6a58', fontFamily: 'Geist Mono, monospace', opacity: 0.6 }}>space-{s}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#c2410c', fontFamily: 'Geist, sans-serif', fontWeight: 600, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Radios</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {radii.map(r => (
              <div key={r.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 56, height: 56, background: '#2a1f17', borderRadius: r.v }}/>
                <div style={{ fontSize: 10, color: '#2a1f17', fontFamily: 'Geist, sans-serif', fontWeight: 600 }}>{r.n}</div>
                <div style={{ fontSize: 9, color: '#7a6a58', fontFamily: 'Geist Mono, monospace' }}>{r.v}px</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#c2410c', fontFamily: 'Geist, sans-serif', fontWeight: 600, marginTop: 26, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sombras</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { n: 'soft', s: '0 1px 2px rgba(42,31,23,0.06)' },
              { n: 'card', s: '0 4px 12px rgba(42,31,23,0.08)' },
              { n: 'lift', s: '0 10px 30px rgba(42,31,23,0.14)' },
            ].map(sh => (
              <div key={sh.n} style={{ flex: 1, height: 60, background: '#fff', borderRadius: 8, boxShadow: sh.s, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 6, fontSize: 10, fontFamily: 'Geist Mono, monospace', color: '#7a6a58' }}>
                {sh.n}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────
// 9) PATRONES Y TEXTURAS
// ─────────────────────────────────────
const ManualPatterns = () => (
  <div style={{ width: '100%', height: '100%', background: '#fbf7f0', padding: 36, boxSizing: 'border-box' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(42,31,23,0.5)', fontFamily: 'Geist, sans-serif' }}>09 · Patrones</div>
      <div style={{ fontSize: 10, color: '#7a6a58', fontFamily: 'Geist Mono, monospace' }}>derivados del slash</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
      {/* slash field */}
      <div style={{ aspectRatio: '1', background: '#2a1f17', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 8 }).map((_, r) =>
            Array.from({ length: 8 }).map((_, c) => (
              <line key={`${r}-${c}`} x1={c * 14 - 4} y1={r * 14 + 12} x2={c * 14 + 8} y2={r * 14 - 2} stroke="#c2410c" strokeWidth="1.5" opacity={0.4 + (r * c) / 100}/>
            ))
          )}
        </svg>
        <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: 9, color: 'rgba(251,247,240,0.55)', fontFamily: 'Geist Mono, monospace' }}>slash field</div>
      </div>
      {/* dot grid */}
      <div style={{ aspectRatio: '1', background: '#fbf7f0', border: '1px solid #e6dcc6', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          {Array.from({ length: 10 }).map((_, r) =>
            Array.from({ length: 10 }).map((_, c) => (
              <circle key={`${r}-${c}`} cx={c * 10 + 5} cy={r * 10 + 5} r="0.8" fill="#c2410c" opacity="0.45"/>
            ))
          )}
        </svg>
        <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: 9, color: 'rgba(42,31,23,0.55)', fontFamily: 'Geist Mono, monospace' }}>prompt grid</div>
      </div>
      {/* big slash */}
      <div style={{ aspectRatio: '1', background: '#c2410c', borderRadius: 12, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SlashMark size={140} color="#fbf7f0"/>
        <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: 9, color: 'rgba(251,247,240,0.7)', fontFamily: 'Geist Mono, monospace' }}>monogram</div>
      </div>
      {/* terminal lines */}
      <div style={{ aspectRatio: '1', background: '#1a1410', borderRadius: 12, padding: 18, fontFamily: 'Geist Mono, monospace', fontSize: 11, color: '#c2410c', lineHeight: 1.55, overflow: 'hidden', position: 'relative' }}>
        <div style={{ opacity: 0.5 }}>$ invoxa close</div>
        <div style={{ color: '#fbf7f0' }}>→ 14 facturas listas</div>
        <div style={{ color: '#fbf7f0', opacity: 0.6 }}>→ 3 esperando aprobación</div>
        <div style={{ opacity: 0.5 }}>$ invoxa export --pdf</div>
        <div style={{ color: '#fbf7f0' }}>✓ informe-mar-2025.pdf</div>
        <div style={{ opacity: 0.5 }}>$ <span style={{ background: '#c2410c', color: '#1a1410', padding: '0 4px' }}>_</span></div>
        <div style={{ position: 'absolute', bottom: 10, right: 12, fontSize: 9, color: 'rgba(251,247,240,0.4)' }}>terminal block</div>
      </div>
      {/* split */}
      <div style={{ aspectRatio: '1', borderRadius: 12, overflow: 'hidden', display: 'flex' }}>
        <div style={{ flex: 1, background: '#fbf7f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SlashMark size={70} color="#2a1f17"/>
        </div>
        <div style={{ flex: 1, background: '#2a1f17', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SlashMark size={70} color="#c2410c"/>
        </div>
      </div>
      {/* chip pattern */}
      <div style={{ aspectRatio: '1', background: '#f4ede0', borderRadius: 12, padding: 18, display: 'flex', flexWrap: 'wrap', gap: 6, alignContent: 'flex-start', overflow: 'hidden', position: 'relative' }}>
        {['INV-0142','TASK-0089','PRJ-04','/close','$4.2k','MAR-2025','APR','PEND','INV-0143','/sync','TASK-0090','PRJ-05'].map((c, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #dbcdb4', padding: '4px 8px', borderRadius: 4, fontSize: 9, fontFamily: 'Geist Mono, monospace', color: '#2a1f17' }}>{c}</div>
        ))}
        <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: 9, color: 'rgba(42,31,23,0.55)', fontFamily: 'Geist Mono, monospace' }}>token chips</div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────
// 10) APLICACIONES — TARJETA, PAPELERÍA
// ─────────────────────────────────────
const ManualStationery = () => (
  <div style={{ width: '100%', height: '100%', background: '#fbf7f0', padding: 36, boxSizing: 'border-box' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(42,31,23,0.5)', fontFamily: 'Geist, sans-serif' }}>10 · Aplicaciones · papelería</div>
      <div style={{ fontSize: 10, color: '#7a6a58', fontFamily: 'Geist Mono, monospace' }}>tarjeta · firma · sobre</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 18, height: 'calc(100% - 50px)' }}>
      {/* tarjeta de presentación */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ flex: 1, background: '#2a1f17', borderRadius: 8, padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 8px 22px rgba(42,31,23,0.18)' }}>
          <SlashMark size={36} color="#c2410c"/>
          <div>
            <div className="display" style={{ fontSize: 18, color: '#fbf7f0', letterSpacing: '-0.02em', fontWeight: 500, marginBottom: 2 }}>María Acosta</div>
            <div style={{ fontSize: 10, color: 'rgba(251,247,240,0.6)', fontFamily: 'Geist, sans-serif', marginBottom: 12 }}>Administradora · Informage Studios</div>
            <div style={{ height: 1, background: 'rgba(251,247,240,0.15)', marginBottom: 10 }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'Geist Mono, monospace', color: 'rgba(251,247,240,0.55)' }}>
              <span>maria@informage.studio</span>
              <span>+57 301 555 0142</span>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, background: '#fbf7f0', border: '1px solid #e6dcc6', borderRadius: 8, padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <SlashMark size={20} color="#2a1f17"/>
            <span className="display" style={{ fontSize: 18, color: '#2a1f17', letterSpacing: '-0.03em', fontWeight: 500 }}>invoxa</span>
          </div>
          <div style={{ fontSize: 10, color: '#7a6a58', fontFamily: 'Geist Mono, monospace' }}>invoxa.informage.studio</div>
        </div>
      </div>
      {/* email signature */}
      <div style={{ background: '#fff', border: '1px solid #e6dcc6', borderRadius: 8, padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 10, color: '#7a6a58', fontFamily: 'Geist Mono, monospace', marginBottom: 14 }}>email signature · plain</div>
        <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 12, color: '#2a1f17', lineHeight: 1.6 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <SlashMark size={26} color="#c2410c"/>
            <span className="display" style={{ fontSize: 22, color: '#2a1f17', letterSpacing: '-0.03em', fontWeight: 500 }}>invoxa</span>
          </div>
          <div style={{ fontWeight: 600 }}>María Acosta</div>
          <div style={{ color: '#7a6a58', fontSize: 11 }}>Administradora · Informage Studios</div>
          <div style={{ height: 1, background: '#e6dcc6', margin: '10px 0' }}/>
          <div style={{ fontSize: 11, color: '#7a6a58', fontFamily: 'Geist Mono, monospace' }}>maria@informage.studio · +57 301 555 0142</div>
          <div style={{ fontSize: 11, color: '#c2410c', fontFamily: 'Geist Mono, monospace', marginTop: 4 }}>invoxa.informage.studio</div>
        </div>
        <div style={{ fontSize: 9, color: '#a8a098', fontFamily: 'Geist, sans-serif', fontStyle: 'italic', borderTop: '1px solid #f4ede0', paddingTop: 10, lineHeight: 1.4 }}>
          Este mensaje es confidencial. Si lo recibes por error, por favor notifícanos y elimínalo.
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────
// 11) FACTURA IMPRESA — DOCUMENTO REAL
// ─────────────────────────────────────
const ManualInvoiceDoc = () => (
  <div style={{ width: '100%', height: '100%', background: '#e8e0cf', padding: 28, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(42,31,23,0.5)', fontFamily: 'Geist, sans-serif' }}>11 · Aplicación · documento PDF</div>
      <div style={{ fontSize: 10, color: '#7a6a58', fontFamily: 'Geist Mono, monospace' }}>A4 · imprimible</div>
    </div>
    <div style={{ flex: 1, background: '#fbf7f0', borderRadius: 4, padding: 32, boxShadow: '0 14px 40px rgba(42,31,23,0.18)', display: 'flex', flexDirection: 'column', gap: 14, fontFamily: 'Geist, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <SlashMark size={32} color="#2a1f17"/>
          <span className="display" style={{ fontSize: 28, color: '#2a1f17', letterSpacing: '-0.03em', fontWeight: 500 }}>invoxa</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="display" style={{ fontSize: 22, color: '#2a1f17', letterSpacing: '-0.025em', fontWeight: 500 }}>Factura</div>
          <div style={{ fontSize: 11, fontFamily: 'Geist Mono, monospace', color: '#7a6a58' }}>INV-2025-0142</div>
        </div>
      </div>
      <div style={{ height: 1, background: '#e6dcc6' }}/>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, fontSize: 11 }}>
        <div>
          <div style={{ fontSize: 9, color: '#7a6a58', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Emite</div>
          <div style={{ color: '#2a1f17', fontWeight: 600 }}>Informage Studios S.A.S.</div>
          <div style={{ color: '#7a6a58', fontFamily: 'Geist Mono, monospace', fontSize: 10 }}>NIT 901.234.567-8</div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: '#7a6a58', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Para</div>
          <div style={{ color: '#2a1f17', fontWeight: 600 }}>Cliente Demo Ltda.</div>
          <div style={{ color: '#7a6a58', fontFamily: 'Geist Mono, monospace', fontSize: 10 }}>NIT 800.123.456-1</div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: '#7a6a58', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Fecha · vence</div>
          <div style={{ color: '#2a1f17', fontWeight: 600 }}>14 mar 2025</div>
          <div style={{ color: '#7a6a58', fontFamily: 'Geist Mono, monospace', fontSize: 10 }}>14 abr 2025 · 30 días</div>
        </div>
      </div>
      <div style={{ background: '#f4ede0', borderRadius: 6, padding: '8px 12px', fontSize: 10, fontFamily: 'Geist Mono, monospace', color: '#7a6a58', display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', gap: 10, fontWeight: 600 }}>
        <span>DESCRIPCIÓN</span><span style={{ textAlign: 'right' }}>HORAS</span><span style={{ textAlign: 'right' }}>TARIFA</span><span style={{ textAlign: 'right' }}>TOTAL</span>
      </div>
      {[
        { d: 'Diseño de identidad · Slash mark', h: 24, r: 85, t: 2040 },
        { d: 'Sistema de facturación · UI', h: 18, r: 95, t: 1710 },
        { d: 'Manual de marca v1.0', h: 6, r: 85, t: 510 },
      ].map((r, i) => (
        <div key={i} style={{ padding: '6px 12px', fontSize: 11, color: '#2a1f17', display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', gap: 10, borderBottom: '1px solid #f4ede0' }}>
          <span>{r.d}</span>
          <span style={{ textAlign: 'right', fontFamily: 'Geist Mono, monospace' }}>{r.h}.0</span>
          <span style={{ textAlign: 'right', fontFamily: 'Geist Mono, monospace' }}>${r.r}</span>
          <span style={{ textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontWeight: 600 }}>${r.t.toLocaleString()}</span>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
        <div style={{ minWidth: 200, fontSize: 11 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#7a6a58' }}>
            <span>Subtotal</span><span style={{ fontFamily: 'Geist Mono, monospace' }}>$4,260.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#7a6a58' }}>
            <span>IVA 19%</span><span style={{ fontFamily: 'Geist Mono, monospace' }}>$809.40</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '2px solid #2a1f17', marginTop: 4 }}>
            <span style={{ fontWeight: 700, color: '#2a1f17' }}>Total</span>
            <span className="display" style={{ fontSize: 18, color: '#c2410c', letterSpacing: '-0.02em', fontWeight: 600 }}>$5,069.40</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────
// 12) APP ICON · SOCIAL · FAVICON
// ─────────────────────────────────────
const ManualAppIcon = () => (
  <div style={{ width: '100%', height: '100%', background: '#fbf7f0', padding: 36, boxSizing: 'border-box' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(42,31,23,0.5)', fontFamily: 'Geist, sans-serif' }}>12 · App icon · social · favicon</div>
      <div style={{ fontSize: 10, color: '#7a6a58', fontFamily: 'Geist Mono, monospace' }}>contenedor + safe area</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: 22, alignItems: 'flex-start' }}>
      {/* iOS app icon */}
      <div>
        <div style={{ fontSize: 11, color: '#c2410c', fontFamily: 'Geist, sans-serif', fontWeight: 600, marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>App icon · iOS</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
          <div style={{ width: 120, height: 120, borderRadius: 28, background: '#2a1f17', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(42,31,23,0.25)' }}>
            <SlashMark size={70} color="#c2410c"/>
          </div>
          <div style={{ width: 64, height: 64, borderRadius: 14, background: '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(194,65,12,0.3)' }}>
            <SlashMark size={38} color="#fbf7f0"/>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 9, background: '#fbf7f0', border: '1px solid #e6dcc6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SlashMark size={26} color="#2a1f17"/>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: 9, color: '#7a6a58', fontFamily: 'Geist Mono, monospace' }}>
          <span style={{ width: 120 }}>1024px · master</span>
          <span style={{ width: 64 }}>120px · @3x</span>
          <span>40px · @2x</span>
        </div>
      </div>
      {/* social avatar / OG */}
      <div>
        <div style={{ fontSize: 11, color: '#c2410c', fontFamily: 'Geist, sans-serif', fontWeight: 600, marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Avatar · OG image</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#2a1f17', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SlashMark size={42} color="#c2410c"/>
          </div>
          <div style={{ flex: 1, aspectRatio: '1.91/1', background: '#1a1410', borderRadius: 10, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
            <SlashMark size={36} color="#c2410c"/>
            <div>
              <div className="display" style={{ fontSize: 22, color: '#fbf7f0', letterSpacing: '-0.03em', fontWeight: 500, lineHeight: 1 }}>invoxa</div>
              <div style={{ fontSize: 10, color: 'rgba(251,247,240,0.55)', fontFamily: 'Geist, sans-serif', marginTop: 4 }}>Billing for Informage Studios</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 9, color: '#7a6a58', fontFamily: 'Geist Mono, monospace' }}>
          <span style={{ width: 70 }}>400×400</span>
          <span>1200×630 · OpenGraph</span>
        </div>
      </div>
      {/* favicon */}
      <div>
        <div style={{ fontSize: 11, color: '#c2410c', fontFamily: 'Geist, sans-serif', fontWeight: 600, marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Favicon</div>
        <div style={{ background: '#fff', border: '1px solid #e6dcc6', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          {[32, 16].map(s => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <SlashMark size={s} color="#2a1f17"/>
              <div style={{ fontSize: 9, color: '#7a6a58', fontFamily: 'Geist Mono, monospace' }}>{s}px</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, {
  ManualCover, ManualConcept, ManualAnatomy, ManualPaletteFull, ManualType, ManualVoice,
  ManualIconography, ManualSpacing, ManualPatterns, ManualStationery, ManualInvoiceDoc, ManualAppIcon,
});
