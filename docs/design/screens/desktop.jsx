/* Turnia desktop screens. 1440×900 within browser window frame. */

const { Icons, Icon } = window;

// ─────────── shared sidebar ───────────

function DSidebar({ theme, active = 'home', role = 'staff' }) {
  const sections = role === 'admin' ? [
    { t: 'Principal', items: [
      { k: 'home', l: 'Dashboard', i: <Icons.home size={18} /> },
      { k: 'cal', l: 'Calendario', i: <Icons.calendar size={18} /> },
    ]},
    { t: 'Operación', items: [
      { k: 'shifts', l: 'Lista de turnos', i: <Icons.list size={18} /> },
      { k: 'requests', l: 'Solicitudes', i: <Icons.swap size={18} />, badge: 7 },
      { k: 'avail', l: 'Disponibilidad', i: <Icons.beach size={18} /> },
      { k: 'stats', l: 'Estadísticas', i: <Icons.trend size={18} /> },
    ]},
    { t: 'Administración', items: [
      { k: 'members', l: 'Miembros', i: <Icons.users size={18} /> },
      { k: 'types', l: 'Tipos de turno', i: <Icons.cal2 size={18} /> },
      { k: 'export', l: 'Exportar', i: <Icons.download size={18} /> },
      { k: 'audit', l: 'Auditoría', i: <Icons.history size={18} /> },
    ]},
  ] : [
    { t: 'Principal', items: [
      { k: 'home', l: 'Inicio', i: <Icons.home size={18} /> },
      { k: 'cal', l: 'Mis turnos', i: <Icons.calendar size={18} /> },
    ]},
    { t: 'Mi gestión', items: [
      { k: 'requests', l: 'Solicitudes', i: <Icons.swap size={18} />, badge: 2 },
      { k: 'avail', l: 'Disponibilidad', i: <Icons.beach size={18} /> },
      { k: 'open', l: 'Turnos abiertos', i: <Icons.takeOpen size={18} />, badge: 3 },
    ]},
    { t: 'Mi equipo', items: [
      { k: 'team', l: 'On-call ahora', i: <Icons.stethoscope size={18} /> },
      { k: 'people', l: 'Compañeros', i: <Icons.users size={18} /> },
    ]},
  ];
  return (
    <div style={{ width: 252, flexShrink: 0, background: theme.bg, borderRight: `1px solid ${theme.border}`, display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ padding: '20px 18px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 14px -6px ${theme.primary}` }}>
            <div style={{ width: 14, height: 14, position:'relative' }}>
              <div style={{ position:'absolute', left: 5, top: 0, width: 4, height: 14, background:'#fff', borderRadius: 1.5 }} />
              <div style={{ position:'absolute', left: 0, top: 5, width: 14, height: 4, background:'#fff', borderRadius: 1.5 }} />
            </div>
          </div>
          <div className="tn-h" style={{ fontSize: 18, fontWeight: 800, color: theme.text, letterSpacing:'-0.025em' }}>Turnia</div>
        </div>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: theme.subtle, color: theme.muted, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.burger size={14} /></div>
      </div>

      {/* org switcher */}
      <div style={{ margin: '0 12px 14px', padding: '10px 12px', borderRadius: 10, background: theme.subtle, border: `1px solid ${theme.border}`, display:'flex', alignItems:'center', gap: 10, cursor: 'pointer' }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: '#0EA5E9', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 700, fontSize: 11.5 }}>SJ</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Hospital San Juan</div>
          <div style={{ fontSize: 10.5, color: theme.muted, marginTop: 1 }}>{role === 'admin' ? 'Admin' : 'Staff · Cardiología'}</div>
        </div>
        <Icons.chevronD size={14} style={{ color: theme.muted }} />
      </div>

      <div className="tn-noscroll" style={{ flex: 1, overflowY:'auto', padding: '0 10px' }}>
        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10.5, color: theme.muted, fontWeight: 700, letterSpacing:'0.08em', textTransform:'uppercase', padding: '6px 10px' }}>{s.t}</div>
            {s.items.map((it) => {
              const isActive = it.k === active;
              return (
                <div key={it.k} style={{
                  margin: '1px 0',
                  padding: '8px 10px', borderRadius: 8, display:'flex', alignItems:'center', gap: 10,
                  background: isActive ? theme.primary + '14' : 'transparent',
                  color: isActive ? theme.primary : theme.textSec,
                  fontSize: 13, fontWeight: isActive ? 600 : 500, position:'relative',
                }}>
                  {isActive ? <div style={{ position:'absolute', left:-10, top: 6, bottom: 6, width: 2.5, borderRadius: 999, background: theme.primary }} /> : null}
                  {it.i}
                  <span style={{ flex: 1 }}>{it.l}</span>
                  {it.badge ? <span style={{ background: theme.primary, color:'#fff', fontSize: 10, fontWeight: 700, padding:'2px 6px', borderRadius: 999, minWidth: 18, textAlign:'center' }}>{it.badge}</span> : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ padding: 12, borderTop: `1px solid ${theme.border}`, display:'flex', alignItems:'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 999, background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 700, fontSize: 12 }}>{role === 'admin' ? 'MR' : 'AM'}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color: theme.text }}>{role === 'admin' ? 'Dr. M. Reyes' : 'Dra. Ana Morales'}</div>
          <div style={{ fontSize: 10.5, color: theme.muted }}>{role === 'admin' ? 'Org admin' : 'Cardiología'}</div>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: theme.subtle, color: theme.muted, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.settings size={14} /></div>
      </div>
    </div>
  );
}

function DTopbar({ theme, title, sub, right, breadcrumbs }) {
  return (
    <div style={{ height: 64, padding: '0 28px', borderBottom: `1px solid ${theme.border}`, background: theme.bg, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink: 0 }}>
      <div>
        {breadcrumbs ? <div style={{ fontSize: 11.5, color: theme.muted, marginBottom: 2, display:'flex', alignItems:'center', gap: 6 }}>{breadcrumbs}</div> : null}
        <div className="tn-h" style={{ fontSize: 19, fontWeight: 700, color: theme.text, letterSpacing:'-0.02em' }}>{title}</div>
        {sub ? <div style={{ fontSize: 12, color: theme.muted, marginTop: 1 }}>{sub}</div> : null}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8, height: 36, padding: '0 12px', borderRadius: 10, background: theme.subtle, border: `1px solid ${theme.border}`, minWidth: 280, color: theme.muted }}>
          <Icons.search size={15} />
          <span style={{ fontSize: 12.5, color: theme.muted }}>Buscar turnos, personas…</span>
          <span style={{ marginLeft:'auto', fontSize: 10.5, padding:'2px 6px', border:`1px solid ${theme.border}`, borderRadius: 5, color: theme.muted, fontWeight: 600 }}>⌘K</span>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.subtle, color: theme.text, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
          <Icons.bell size={17} />
          <span style={{ position:'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: 999, background: theme.red, border: `2px solid ${theme.subtle}` }} />
        </div>
        {right}
      </div>
    </div>
  );
}

function Pill({ children, color, theme, soft = true, dot = false }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap: 6, padding:'3px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: soft ? color + '20' : color, color: soft ? color : '#fff' }}>
      {dot ? <span style={{ width: 6, height: 6, borderRadius: 999, background:'currentColor' }} /> : null}
      {children}
    </span>
  );
}

// ─────────── Login (desktop) ───────────

function DLogin({ theme }) {
  return (
    <div style={{ width:'100%', height:'100%', background: theme.bg, color: theme.text, display:'flex' }}>
      {/* left brand panel */}
      <div style={{ flex: 1, position:'relative', overflow:'hidden', background: `linear-gradient(155deg, ${theme.primaryDark} 0%, ${theme.primary} 100%)`, display:'flex', alignItems:'center', justifyContent:'center', padding: 40, color:'#fff' }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position:'absolute', inset: 0, width:'100%', height:'100%', opacity: 0.16 }}>
          <defs>
            <pattern id="g1" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="0.4" fill="#fff" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#g1)" />
        </svg>
        <svg width="520" height="520" viewBox="0 0 100 100" style={{ position:'absolute', right: -120, top: -120, opacity: 0.18 }}>
          <circle cx="50" cy="50" r="48" stroke="#fff" strokeWidth=".4" fill="none" />
          <circle cx="50" cy="50" r="36" stroke="#fff" strokeWidth=".4" fill="none" />
          <circle cx="50" cy="50" r="22" stroke="#fff" strokeWidth=".4" fill="none" />
          <circle cx="50" cy="50" r="10" stroke="#fff" strokeWidth=".4" fill="none" />
        </svg>

        <div style={{ position:'relative', maxWidth: 460 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 36 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
              <Icons.cross size={22} stroke={2.4} />
            </div>
            <div className="tn-h" style={{ fontSize: 26, fontWeight: 800, letterSpacing:'-0.03em' }}>Turnia</div>
          </div>
          <div className="tn-h" style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.05, letterSpacing:'-0.03em' }}>
            La gestión<br/>de guardias,<br/><span style={{ background:'rgba(255,255,255,.18)', padding:'0 12px', borderRadius: 10, display:'inline-block', marginTop: 8 }}>al fin clara.</span>
          </div>
          <div style={{ fontSize: 16, marginTop: 24, opacity: 0.92, lineHeight: 1.5, maxWidth: 420 }}>
            Calendarios, intercambios, disponibilidades. Diseñado con y para los profesionales sanitarios.
          </div>

          <div style={{ marginTop: 40, padding: 20, borderRadius: 16, background:'rgba(255,255,255,.12)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,.18)', display:'flex', gap: 14, alignItems:'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 999, background:'#fff', color: theme.primaryDark, display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 14 }}>LP</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>«Resolvemos los swaps en minutos. Antes era una discusión por WhatsApp.»</div>
              <div style={{ fontSize: 12, marginTop: 6, opacity: 0.8 }}>Dra. Lucía Pereira · Jefa de Guardia, UCI</div>
            </div>
          </div>
        </div>
      </div>

      {/* right form */}
      <div style={{ flex: 1, display:'flex', alignItems:'center', justifyContent:'center', padding: 40 }}>
        <div style={{ width: 380 }}>
          <div className="tn-h" style={{ fontSize: 30, fontWeight: 700, letterSpacing:'-0.025em' }}>Inicia sesión</div>
          <div style={{ fontSize: 14, color: theme.muted, marginTop: 6 }}>Bienvenido de vuelta. Empieza tu jornada.</div>

          <div style={{ marginTop: 32, display:'flex', flexDirection:'column', gap: 14 }}>
            <DField theme={theme} label="Email" value="ana.morales@hospitalsj.org" />
            <DField theme={theme} label="Contraseña" value="•••••••••••" trailing={<Icons.eye size={16} />} />
          </div>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 14 }}>
            <label style={{ display:'flex', alignItems:'center', gap: 8, fontSize: 13, color: theme.textSec }}>
              <span style={{ width: 18, height: 18, borderRadius: 5, background: theme.primary, display:'inline-flex', alignItems:'center', justifyContent:'center', color:'#fff' }}><Icons.check size={12} stroke={3} /></span>
              Recordarme
            </label>
            <a style={{ fontSize: 13, color: theme.primary, fontWeight: 600 }}>¿Olvidaste tu contraseña?</a>
          </div>

          <button style={{ width:'100%', marginTop: 22, height: 48, borderRadius: 12, border:'none', background: theme.primary, color:'#fff', fontWeight: 700, fontSize: 14.5, display:'flex', alignItems:'center', justifyContent:'center', gap: 8, boxShadow: `0 10px 24px -12px ${theme.primary}` }}>
            Iniciar sesión <Icons.arrowR size={16} stroke={2.6} />
          </button>

          <div style={{ marginTop: 20, padding: 14, borderRadius: 12, background: theme.subtle, border: `1px solid ${theme.border}`, fontSize: 12.5, color: theme.textSec, display:'flex', alignItems:'flex-start', gap: 10 }}>
            <Icons.shield size={16} style={{ color: theme.primary, flexShrink: 0, marginTop: 1 }} />
            <div><strong>Acceso seguro.</strong> Tu sesión está protegida con autenticación de dos factores.</div>
          </div>

          <div style={{ marginTop: 40, fontSize: 13, color: theme.muted, textAlign:'center' }}>
            ¿Eres nuevo en Turnia? <a style={{ color: theme.primary, fontWeight: 600 }}>Activa tu cuenta</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function DField({ theme, label, value, trailing, focused }) {
  return (
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: theme.textSec, marginBottom: 6 }}>{label}</div>
      <div style={{ height: 46, borderRadius: 12, border: `1px solid ${focused ? theme.primary : theme.border}`, background: theme.bg, padding: '0 14px', display:'flex', alignItems:'center', gap: 10, boxShadow: focused ? `0 0 0 4px ${theme.primary}22` : 'none' }}>
        <span style={{ flex: 1, fontSize: 14, color: theme.text, fontWeight: 500 }}>{value}</span>
        {trailing ? <span style={{ color: theme.muted }}>{trailing}</span> : null}
      </div>
    </div>
  );
}

// ─────────── Manager Calendar (HERO) ───────────

function DCalendar({ theme }) {
  const days = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  const startOffset = 4;
  const today = 14;
  // Prebuilt shift data for week display
  const shifts = {
    1: [{c:'#14B8A6',l:'Diurno',t:'Carlos R.',h:'08:00'}],
    2: [{c:'#14B8A6',l:'Diurno',t:'Lucía P.',h:'08:00'},{c:'#7C3AED',l:'Noct.',t:'Diego M.',h:'22:00'}],
    3: [{c:'#14B8A6',l:'Diurno',t:'+ 2 más',h:'08:00'}],
    4: [{c:'#7C3AED',l:'Noct.',t:'Ana M.',h:'22:00'}],
    5: [{c:'#F59E0B',l:'Vac.',t:'M. Reyes',h:''}],
    6: [{c:'#14B8A6',l:'Diurno',t:'Carlos R.',h:'08:00'}],
    7: [],
    8: [{c:'#14B8A6',l:'Diurno',t:'Lucía P.',h:''}],
    9: [{c:'#7C3AED',l:'Noct.',t:'Diego M.',h:''}],
    10: [{c:'#F59E0B',l:'Vac.',t:'M. Reyes',h:''}],
    11: [{c:'#14B8A6',l:'Diurno',t:'Ana M.',h:''}],
    12: [{c:'#7C3AED',l:'Noct.',t:'+3',h:''}],
    13: [{c:'#14B8A6',l:'Diurno',t:'Lucía P.',h:''}],
    14: [{c:'#7C3AED',l:'Noct.',t:'Ana M. (tú)',h:'22:00'},{c:'#0EA5E9',l:'Diurno',t:'Carlos R.',h:'08:00'}],
    15: [{c:'#14B8A6',l:'Diurno',t:'Carlos R.',h:''}],
    16: [{c:'#0EA5E9',l:'Refz.',t:'Vacante',h:''}],
    17: [{c:'#7C3AED',l:'Noct.',t:'Lucía P.',h:''}],
    18: [{c:'#14B8A6',l:'Diurno',t:'Diego M.',h:''}],
    19: [{c:'#14B8A6',l:'Diurno',t:'Ana M.',h:''}],
    20: [{c:'#7C3AED',l:'Noct.',t:'+2',h:''}],
    21: [],
    22: [{c:'#14B8A6',l:'Diurno',t:'Carlos R.',h:''}],
    23: [{c:'#0EA5E9',l:'Refz.',t:'Vacante',h:''}],
    24: [{c:'#7C3AED',l:'Noct.',t:'Lucía P.',h:''}],
    25: [{c:'#14B8A6',l:'Diurno',t:'Diego M.',h:''}],
    26: [{c:'#14B8A6',l:'Diurno',t:'+3',h:''}],
    27: [{c:'#F59E0B',l:'Cap.',t:'M. Reyes',h:''}],
    28: [{c:'#7C3AED',l:'Noct.',t:'Ana M.',h:''}],
    29: [{c:'#14B8A6',l:'Diurno',t:'Carlos R.',h:''}],
    30: [],
    31: [],
  };
  const grid = [];
  for (let i = 0; i < 35; i++) grid.push(i - startOffset + 1);

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', background: theme.subtle, color: theme.text }}>
      <DSidebar theme={theme} active="cal" role="admin" />
      <div style={{ flex: 1, display:'flex', flexDirection:'column', minWidth: 0 }}>
        <DTopbar theme={theme} title="Calendario · Cardiología" sub="Mayo 2026 · 24 personas" breadcrumbs={<><span>Operación</span><Icons.chevronR size={11} /><span>Calendario</span></>} right={
          <button style={{ height: 36, padding: '0 14px', borderRadius: 10, background: theme.primary, color:'#fff', fontWeight: 600, fontSize: 13, border:'none', display:'flex', alignItems:'center', gap: 6, boxShadow: `0 6px 16px -10px ${theme.primary}` }}>
            <Icons.plus size={15} stroke={2.6} /> Nuevo turno
          </button>
        } />
        <div style={{ flex: 1, padding: 24, overflow:'hidden', display:'flex', flexDirection:'column', gap: 16 }}>

          {/* Toolbar */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap: 12 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
              <div style={{ display:'flex', alignItems:'center', height: 36, borderRadius: 10, background: theme.bg, border: `1px solid ${theme.border}` }}>
                <button style={{ width: 36, height: '100%', display:'flex', alignItems:'center', justifyContent:'center', color: theme.muted }}><Icons.chevronL size={15} /></button>
                <div className="tn-h" style={{ padding: '0 14px', fontSize: 13.5, fontWeight: 600 }}>Mayo 2026</div>
                <button style={{ width: 36, height: '100%', display:'flex', alignItems:'center', justifyContent:'center', color: theme.muted, borderLeft: `1px solid ${theme.border}` }}><Icons.chevronR size={15} /></button>
              </div>
              <button style={{ height: 36, padding:'0 12px', fontSize: 12.5, fontWeight: 500, color: theme.textSec, borderRadius: 8, background: theme.bg, border: `1px solid ${theme.border}` }}>Hoy</button>
              <div style={{ display:'flex', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 10, padding: 3 }}>
                {['Mes','Semana','Día','Lista'].map((v, i) => (
                  <span key={i} style={{ padding: '6px 12px', fontSize: 12, fontWeight: 600, borderRadius: 7, background: i === 0 ? theme.primary + '14' : 'transparent', color: i === 0 ? theme.primary : theme.textSec }}>{v}</span>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
              <FilterChip theme={theme} icon={<Icons.users size={14} />} label="Todos" />
              <FilterChip theme={theme} icon={<Icons.filter size={14} />} label="Tipo: 4" />
              <FilterChip theme={theme} icon={<Icons.alert size={14} />} label="Sin asignar: 2" color={theme.amber} />
              <div style={{ width: 1, height: 24, background: theme.border }} />
              <button style={{ height: 36, padding:'0 12px', fontSize: 12.5, fontWeight: 500, color: theme.textSec, borderRadius: 8, background: theme.bg, border: `1px solid ${theme.border}`, display:'flex', alignItems:'center', gap: 6 }}>
                <Icons.copy size={14} /> Copiar mes
              </button>
            </div>
          </div>

          {/* Calendar grid */}
          <div style={{ flex: 1, borderRadius: 16, background: theme.bg, border: `1px solid ${theme.border}`, overflow:'hidden', display:'flex', flexDirection:'column' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', borderBottom: `1px solid ${theme.border}` }}>
              {days.map((d) => (
                <div key={d} style={{ padding:'10px 14px', fontSize: 11.5, fontWeight: 700, color: theme.muted, letterSpacing:'0.04em', textTransform:'uppercase', borderRight: `1px solid ${theme.border}` }}>{d}</div>
              ))}
            </div>
            <div style={{ flex: 1, display:'grid', gridTemplateColumns:'repeat(7,1fr)', gridAutoRows: '1fr' }}>
              {grid.map((d, i) => {
                const valid = d >= 1 && d <= 31;
                const isToday = d === today;
                const items = shifts[d] || [];
                return (
                  <div key={i} style={{
                    borderRight: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}`,
                    padding: 8, position: 'relative',
                    background: !valid ? theme.subtle : isToday ? theme.primary + '08' : 'transparent',
                    minWidth: 0, overflow:'hidden',
                  }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{
                        fontSize: 12, fontWeight: 600,
                        color: !valid ? theme.muted : isToday ? '#fff' : theme.text,
                        background: isToday ? theme.primary : 'transparent',
                        width: 22, height: 22, borderRadius: 999, display:'inline-flex', alignItems:'center', justifyContent:'center',
                      }}>{valid ? d : ''}</span>
                      {valid && items.length > 0 ? (
                        <span style={{ fontSize: 10, color: theme.muted, fontWeight: 600 }}>{items.length}</span>
                      ) : null}
                    </div>
                    <div style={{ marginTop: 5, display:'flex', flexDirection:'column', gap: 3 }}>
                      {items.slice(0, 2).map((it, j) => (
                        <div key={j} style={{
                          padding: '3px 7px', borderRadius: 6,
                          background: it.t === 'Vacante' ? 'transparent' : it.c + '1A',
                          border: it.t === 'Vacante' ? `1px dashed ${it.c}` : `1px solid ${it.c}30`,
                          color: it.c, fontSize: 10.5, fontWeight: 600, display:'flex', alignItems:'center', gap: 4,
                          minWidth: 0,
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: 999, background: it.c, flexShrink: 0 }} />
                          <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right rail */}
      <div style={{ width: 320, flexShrink: 0, borderLeft: `1px solid ${theme.border}`, background: theme.bg, display:'flex', flexDirection:'column' }}>
        <div style={{ padding: 20, borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div className="tn-h" style={{ fontSize: 14, fontWeight: 700 }}>Hoy · jue 14</div>
            <span style={{ fontSize: 11, color: theme.muted }}>4 turnos</span>
          </div>
          <div style={{ marginTop: 12, display:'flex', flexDirection:'column', gap: 8 }}>
            {[
              { c:'#14B8A6', l:'D', n:'Carlos R.', h:'08:00 — 18:00', sp:'Cardiología' },
              { c:'#7C3AED', l:'N', n:'Ana Morales (tú)', h:'22:00 — 08:00', sp:'UCI', mine:true },
              { c:'#0EA5E9', l:'R', n:'Lucía P.', h:'14:00 — 22:00', sp:'Refuerzo' },
              { c:'#94A3B8', l:'?', n:'Sin asignar', h:'12:00 — 20:00', sp:'Urgencias', open:true },
            ].map((s, i) => (
              <div key={i} style={{ padding: 10, borderRadius: 12, background: s.mine ? theme.primary + '0E' : s.open ? theme.amber + '0E' : theme.subtle, border: `1px solid ${s.mine ? theme.primary + '55' : s.open ? theme.amber + '55' : theme.border}`, display:'flex', alignItems:'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: s.c + '22', color: s.c, fontWeight: 800, fontSize: 13, display:'flex', alignItems:'center', justifyContent:'center' }}>{s.l}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.n}</div>
                  <div style={{ fontSize: 10.5, color: theme.muted, marginTop: 1 }}>{s.h} · {s.sp}</div>
                </div>
                {s.mine ? <Pill color={theme.primary} theme={theme}>Tuyo</Pill> : null}
                {s.open ? <Pill color={theme.amber} theme={theme}>Abierto</Pill> : null}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: 20, borderBottom: `1px solid ${theme.border}` }}>
          <div className="tn-h" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Tipos de turno</div>
          <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
            {[
              { c:'#14B8A6', l:'Diurno', n:'08:00 — 18:00', count: 18 },
              { c:'#7C3AED', l:'Nocturno', n:'22:00 — 08:00', count: 12 },
              { c:'#0EA5E9', l:'Refuerzo', n:'14:00 — 22:00', count: 6 },
              { c:'#F59E0B', l:'Vacaciones', n:'Día completo', count: 4 },
            ].map((t, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap: 10, fontSize: 12.5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: t.c, flexShrink: 0 }} />
                <span style={{ flex: 1, fontWeight: 500 }}>{t.l}</span>
                <span style={{ color: theme.muted }}>{t.n}</span>
                <span style={{ color: theme.text, fontWeight: 600, minWidth: 22, textAlign:'right' }}>{t.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: 20, flex: 1 }}>
          <div className="tn-h" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Cobertura del mes</div>
          <div style={{ display:'flex', alignItems:'baseline', gap: 6 }}>
            <div className="tn-h" style={{ fontSize: 32, fontWeight: 800, letterSpacing:'-0.02em' }}>87<span style={{ fontSize: 18, color: theme.muted }}>%</span></div>
            <Pill color={theme.green} theme={theme}>+4 vs mes pasado</Pill>
          </div>
          <div style={{ marginTop: 10, height: 8, borderRadius: 999, background: theme.subtle2, overflow:'hidden', display:'flex' }}>
            <div style={{ width:'62%', height:'100%', background: theme.primary }} />
            <div style={{ width:'25%', height:'100%', background: theme.green }} />
            <div style={{ width:'8%', height:'100%', background: theme.amber }} />
            <div style={{ width:'5%', height:'100%', background: theme.red }} />
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: theme.muted, lineHeight: 1.6 }}>
            <span style={{ color: theme.text, fontWeight: 600 }}>485h</span> programadas de <span style={{ color: theme.text, fontWeight: 600 }}>560h</span> requeridas. <span style={{ color: theme.amber, fontWeight: 600 }}>2 turnos</span> sin cubrir.
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ theme, icon, label, color }) {
  const c = color || theme.textSec;
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 6, height: 36, padding:'0 12px', borderRadius: 10, background: theme.bg, border: `1px solid ${color ? color + '55' : theme.border}`, fontSize: 12.5, fontWeight: 500, color: c }}>
      {icon} {label} <Icons.chevronD size={13} style={{ marginLeft: 2 }} />
    </div>
  );
}

// ─────────── Requests inbox ───────────

function DRequests({ theme }) {
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', background: theme.subtle, color: theme.text }}>
      <DSidebar theme={theme} active="requests" role="admin" />
      <div style={{ flex: 1, display:'flex', flexDirection:'column', minWidth: 0 }}>
        <DTopbar theme={theme} title="Solicitudes" sub="7 pendientes · 4 esta semana" breadcrumbs={<><span>Operación</span><Icons.chevronR size={11} /><span>Solicitudes</span></>} />
        <div style={{ flex: 1, padding: 24, overflow:'hidden', display:'flex', gap: 18, minHeight: 0 }}>
          {/* List */}
          <div style={{ width: 380, flexShrink: 0, borderRadius: 16, background: theme.bg, border: `1px solid ${theme.border}`, overflow:'hidden', display:'flex', flexDirection:'column' }}>
            <div style={{ padding: 16, borderBottom: `1px solid ${theme.border}` }}>
              <div style={{ display:'flex', gap: 6 }}>
                {[{l:'Pendientes',n:7,active:true},{l:'Aprobadas',n:23},{l:'Rechazadas',n:4}].map((t,i)=>(
                  <div key={i} style={{ padding:'7px 12px', borderRadius: 8, background: t.active ? theme.text : 'transparent', color: t.active ? theme.bg : theme.textSec, fontSize: 12.5, fontWeight: 600, display:'flex', alignItems:'center', gap: 6 }}>
                    {t.l}
                    <span style={{ background: t.active ? 'rgba(255,255,255,.18)' : theme.subtle, padding:'1px 6px', borderRadius: 999, fontSize: 10.5, fontWeight: 700, color: t.active ? '#fff' : theme.muted }}>{t.n}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, display:'flex', alignItems:'center', gap: 8, height: 34, padding:'0 10px', borderRadius: 8, background: theme.subtle, border: `1px solid ${theme.border}`, fontSize: 12, color: theme.muted }}>
                <Icons.search size={14} /> Buscar persona, fecha…
              </div>
            </div>
            <div className="tn-noscroll" style={{ flex: 1, overflowY:'auto' }}>
              {[
                { sel:true, t:'swap', n:'Carlos R.', s:'Mar 14 ⇄ Mié 15', age:'hace 2h', accepted:true, c:'#0EA5E9' },
                { sel:false, t:'giveaway', n:'Lucía P.', s:'Vie 17 may · UCI', age:'hace 4h', c:'#F97316' },
                { sel:false, t:'takeOpen', n:'Diego M.', s:'Sáb 18 may · 12:00', age:'hace 6h', c:'#10B981' },
                { sel:false, t:'swap', n:'Ana Morales', s:'Lun 19 ⇄ Mar 20', age:'ayer', c:'#14B8A6' },
                { sel:false, t:'giveaway', n:'Pedro V.', s:'Mié 21 may · Diurno', age:'ayer', c:'#A78BFA' },
                { sel:false, t:'swap', n:'Sara T.', s:'Jue 22 ⇄ Vie 23', age:'2d', c:'#F59E0B' },
              ].map((r, i) => {
                const Ic = r.t === 'swap' ? Icons.swap : r.t === 'giveaway' ? Icons.giveaway : Icons.takeOpen;
                const tlabel = r.t === 'swap' ? 'Intercambio' : r.t === 'giveaway' ? 'Cesión' : 'Turno abierto';
                return (
                  <div key={i} style={{ padding: 14, borderBottom: `1px solid ${theme.border}`, borderLeft: r.sel ? `3px solid ${theme.primary}` : '3px solid transparent', background: r.sel ? theme.primary + '08' : 'transparent', display:'flex', gap: 12, alignItems:'center', cursor:'pointer' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 999, background: r.c + '22', color: r.c, fontWeight: 700, fontSize: 13, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>{r.n.split(' ').map(x=>x[0]).join('').slice(0,2)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{r.n}</span>
                        {r.accepted ? <span style={{ fontSize: 10, padding:'1px 6px', borderRadius: 4, background: theme.green + '22', color: theme.green, fontWeight: 700 }}>ACEPTADO</span> : null}
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap: 5, fontSize: 11.5, color: theme.muted, marginTop: 2 }}>
                        <Ic size={12} /> {tlabel} · {r.s}
                      </div>
                    </div>
                    <div style={{ fontSize: 10.5, color: theme.muted, whiteSpace:'nowrap' }}>{r.age}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail */}
          <div style={{ flex: 1, borderRadius: 16, background: theme.bg, border: `1px solid ${theme.border}`, overflow:'hidden', display:'flex', flexDirection:'column' }}>
            <div style={{ padding: 24, borderBottom: `1px solid ${theme.border}` }}>
              <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: theme.primary + '14', color: theme.primary, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.swap size={22} /></div>
                <div style={{ flex: 1 }}>
                  <div className="tn-h" style={{ fontSize: 22, fontWeight: 700, letterSpacing:'-0.02em' }}>Intercambio de turnos</div>
                  <div style={{ fontSize: 12.5, color: theme.muted, marginTop: 2 }}>Solicitado por <strong style={{ color: theme.text }}>Carlos Rodríguez</strong> · hace 2 horas · ID #SR-2026-0142</div>
                </div>
                <Pill color={theme.green} theme={theme} dot>Contraparte aceptó</Pill>
              </div>

              {/* Swap visual */}
              <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
                <SwapCard theme={theme} who="Carlos R." letter="D" color="#0EA5E9" date="Mar 14 may · 22:00–08:00" sp="UCI · Nocturno" />
                <div style={{ width: 38, height: 38, borderRadius: 999, background: theme.primary + '14', color: theme.primary, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}><Icons.swap2 size={18} /></div>
                <SwapCard theme={theme} who="Ana Morales" letter="N" color="#14B8A6" date="Mié 15 may · 08:00–18:00" sp="UCI · Diurno" />
              </div>
            </div>

            <div style={{ flex: 1, overflowY:'auto', padding: 24 }} className="tn-noscroll">
              <div className="tn-h" style={{ fontSize: 13.5, fontWeight: 700, color: theme.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom: 12 }}>Detalles</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
                <Stat theme={theme} label="Diferencia de horas" value="0h" sub="Misma duración" pos />
                <Stat theme={theme} label="Especialidades" value="UCI ↔ UCI" sub="Compatible" pos />
                <Stat theme={theme} label="Carga semanal Carlos" value="48h" sub="dentro del límite" />
                <Stat theme={theme} label="Carga semanal Ana" value="46h" sub="dentro del límite" />
              </div>

              <div style={{ marginTop: 22 }}>
                <div className="tn-h" style={{ fontSize: 13.5, fontWeight: 700, color: theme.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom: 10 }}>Mensaje del solicitante</div>
                <div style={{ padding: 14, borderRadius: 12, background: theme.subtle, border: `1px solid ${theme.border}`, fontSize: 13.5, color: theme.text, lineHeight: 1.55 }}>
                  Hola Mario, tengo un compromiso familiar el martes que no puedo mover. Ana ya me confirmó que le viene bien el cambio. ¡Gracias!
                </div>
              </div>

              <div style={{ marginTop: 22 }}>
                <div className="tn-h" style={{ fontSize: 13.5, fontWeight: 700, color: theme.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom: 10 }}>Línea de tiempo</div>
                <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
                  {[
                    { i: <Icons.send size={12} />, c: theme.muted, t:'Carlos R. envió la solicitud', d:'13 may · 16:42' },
                    { i: <Icons.check size={12} stroke={3} />, c: theme.green, t:'Ana M. aceptó el intercambio', d:'13 may · 17:08' },
                    { i: <Icons.clock size={12} />, c: theme.amber, t:'Esperando aprobación de manager', d:'pendiente' },
                  ].map((e, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, fontSize: 13 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 999, background: e.c + '22', color: e.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{e.i}</div>
                      <div style={{ flex: 1 }}>{e.t}</div>
                      <span style={{ fontSize: 11.5, color: theme.muted }}>{e.d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: 20, borderTop: `1px solid ${theme.border}`, display:'flex', gap: 10, alignItems:'center', background: theme.subtle }}>
              <button style={{ height: 42, padding:'0 14px', borderRadius: 10, background: theme.bg, border: `1px solid ${theme.border}`, fontSize: 13, fontWeight: 500, color: theme.textSec }}>Pedir más info</button>
              <div style={{ flex: 1 }} />
              <button style={{ height: 42, padding:'0 18px', borderRadius: 10, background: theme.bg, border: `1px solid ${theme.red}55`, color: theme.red, fontSize: 13.5, fontWeight: 600, display:'flex', alignItems:'center', gap: 6 }}>
                <Icons.x size={15} /> Rechazar
              </button>
              <button style={{ height: 42, padding:'0 22px', borderRadius: 10, background: theme.green, color:'#fff', border:'none', fontSize: 13.5, fontWeight: 700, display:'flex', alignItems:'center', gap: 6, boxShadow: `0 8px 18px -10px ${theme.green}` }}>
                <Icons.check size={15} stroke={2.6} /> Aprobar intercambio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SwapCard({ theme, who, letter, color, date, sp }) {
  return (
    <div style={{ flex: 1, padding: 14, borderRadius: 14, background: theme.subtle, border: `1px solid ${theme.border}` }}>
      <div style={{ fontSize: 11, color: theme.muted, fontWeight: 700, letterSpacing:'0.06em', textTransform:'uppercase' }}>{who}</div>
      <div style={{ display:'flex', alignItems:'center', gap: 10, marginTop: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: color + '24', color: color, fontWeight: 800, fontSize: 16, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter Tight',sans-serif" }}>{letter}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{date}</div>
          <div style={{ fontSize: 11.5, color: theme.muted, marginTop: 1 }}>{sp}</div>
        </div>
      </div>
    </div>
  );
}

function Stat({ theme, label, value, sub, pos }) {
  return (
    <div style={{ padding: 14, borderRadius: 12, background: theme.subtle, border: `1px solid ${theme.border}` }}>
      <div style={{ fontSize: 11, color: theme.muted, fontWeight: 600 }}>{label}</div>
      <div className="tn-h" style={{ fontSize: 18, fontWeight: 700, marginTop: 4, letterSpacing:'-0.015em' }}>{value}</div>
      <div style={{ fontSize: 11.5, color: pos ? theme.green : theme.muted, marginTop: 2, display:'flex', alignItems:'center', gap: 4 }}>
        {pos ? <Icons.check size={11} stroke={3} /> : null}{sub}
      </div>
    </div>
  );
}

// ─────────── Staff Home ───────────

function DStaffHome({ theme }) {
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', background: theme.subtle, color: theme.text }}>
      <DSidebar theme={theme} active="home" role="staff" />
      <div style={{ flex: 1, display:'flex', flexDirection:'column', minWidth: 0 }}>
        <DTopbar theme={theme} title="Hola, Ana 👋" sub="Jueves, 14 de mayo · Hospital San Juan" />
        <div className="tn-noscroll" style={{ flex: 1, overflowY:'auto', padding: 24 }}>
          {/* HERO + side */}
          <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap: 16 }}>
            {/* Próximo turno */}
            <div style={{ borderRadius: 20, padding: 28, background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, color:'#fff', position:'relative', overflow:'hidden', boxShadow: `0 24px 50px -28px ${theme.primary}` }}>
              <svg width="500" height="500" viewBox="0 0 100 100" style={{ position:'absolute', right: -180, top:-180, opacity: 0.16 }}>
                <circle cx="50" cy="50" r="48" stroke="#fff" strokeWidth=".4" fill="none" />
                <circle cx="50" cy="50" r="34" stroke="#fff" strokeWidth=".4" fill="none" />
                <circle cx="50" cy="50" r="20" stroke="#fff" strokeWidth=".4" fill="none" />
              </svg>
              <div style={{ position:'relative', display:'flex', alignItems:'center', gap: 10, fontSize: 11, fontWeight: 700, letterSpacing:'0.1em', textTransform:'uppercase', opacity: .9 }}>
                Tu próximo turno · empieza en 14h 32m
              </div>
              <div style={{ marginTop: 14, display:'flex', alignItems:'flex-end', gap: 24 }}>
                <div style={{ width: 92, height: 92, borderRadius: 18, background:'rgba(255,255,255,.18)', backdropFilter:'blur(8px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, letterSpacing:'0.08em' }}>MAR</div>
                  <div className="tn-h" style={{ fontSize: 44, fontWeight: 800, lineHeight: 1, marginTop: 2 }}>14</div>
                </div>
                <div>
                  <div className="tn-h" style={{ fontSize: 32, fontWeight: 700, letterSpacing:'-0.025em', lineHeight: 1.05 }}>Guardia nocturna</div>
                  <div style={{ fontSize: 16, marginTop: 6, opacity: 0.95 }}>22:00 — 08:00 · 10 horas</div>
                  <div style={{ fontSize: 14, marginTop: 4, opacity: 0.85, display:'flex', alignItems:'center', gap: 6 }}>
                    <Icons.pin size={14} /> UCI · Planta 4, Sala C
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 20, display:'flex', gap: 10, position:'relative' }}>
                <button style={{ height: 42, padding:'0 18px', borderRadius: 11, background: '#fff', color: theme.primaryDark, fontWeight: 700, fontSize: 13.5, border:'none', display:'flex', alignItems:'center', gap: 7 }}>
                  <Icons.eye size={15} /> Ver detalle
                </button>
                <button style={{ height: 42, padding:'0 18px', borderRadius: 11, background:'rgba(255,255,255,.16)', color:'#fff', fontWeight: 600, fontSize: 13.5, border:'1px solid rgba(255,255,255,.3)', display:'flex', alignItems:'center', gap: 7 }}>
                  <Icons.swap size={15} /> Solicitar cambio
                </button>
                <div style={{ flex: 1 }} />
                <div style={{ display:'flex', alignItems:'center', gap: 8, padding:'0 14px', height: 42, borderRadius: 11, background:'rgba(255,255,255,.12)', fontSize: 12 }}>
                  <Icons.users size={13} /> 3 compañeros de guardia
                </div>
              </div>
            </div>

            {/* On-call now */}
            <div style={{ borderRadius: 20, padding: 22, background: theme.bg, border: `1px solid ${theme.border}` }}>
              <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 16 }}>
                <span style={{ position:'relative', display:'inline-flex', width: 9, height: 9 }}>
                  <span style={{ position:'absolute', inset: 0, borderRadius: 999, background: theme.green, animation: 'tn-ping 1.8s ease-out infinite' }} />
                  <span style={{ position:'absolute', inset: 1, borderRadius: 999, background: theme.green }} />
                </span>
                <div className="tn-h" style={{ fontSize: 16, fontWeight: 700 }}>De guardia ahora</div>
                <span style={{ fontSize: 11.5, color: theme.muted, marginLeft:'auto' }}>14:23</span>
              </div>
              {[
                { n:'Carlos R.', sp:'Cardiología', end:'hasta 22:00', c:'#0EA5E9', i:'CR' },
                { n:'Lucía P.', sp:'UCI', end:'hasta 14:00', c:'#8B5CF6', i:'LP' },
                { n:'Diego M.', sp:'Urgencias', end:'hasta 20:00', c:'#F97316', i:'DM' },
              ].map((p, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding:'10px 0', borderBottom: i < 2 ? `1px solid ${theme.border}` : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 999, background: p.c + '22', color: p.c, fontWeight: 700, fontSize: 13, display:'flex', alignItems:'center', justifyContent:'center' }}>{p.i}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{p.n}</div>
                    <div style={{ fontSize: 11.5, color: theme.muted, marginTop: 1 }}>{p.sp}</div>
                  </div>
                  <span style={{ fontSize: 11.5, color: theme.text, fontWeight: 500 }}>{p.end}</span>
                </div>
              ))}
              <button style={{ width:'100%', marginTop: 12, height: 36, borderRadius: 9, background: theme.subtle, border: `1px solid ${theme.border}`, color: theme.textSec, fontSize: 12.5, fontWeight: 500 }}>Ver toda la guardia →</button>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ marginTop: 16, display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 12 }}>
            {[
              { v:'18', l:'Turnos este mes', sub:'2 más que abril', i: <Icons.calendar size={16} />, c: theme.primary },
              { v:'142h', l:'Horas trabajadas', sub:'40h por encima', i: <Icons.clock size={16} />, c: theme.blue },
              { v:'2', l:'Solicitudes pendientes', sub:'1 swap · 1 cesión', i: <Icons.swap size={16} />, c: theme.amber },
              { v:'94%', l:'Asistencia', sub:'Top 10% del equipo', i: <Icons.trend size={16} />, c: theme.green },
            ].map((s, i) => (
              <div key={i} style={{ padding: 18, borderRadius: 14, background: theme.bg, border: `1px solid ${theme.border}` }}>
                <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: s.c + '14', color: s.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{s.i}</div>
                  <span style={{ fontSize: 12, color: theme.muted, fontWeight: 500 }}>{s.l}</span>
                </div>
                <div className="tn-h" style={{ fontSize: 28, fontWeight: 800, marginTop: 10, letterSpacing:'-0.025em' }}>{s.v}</div>
                <div style={{ fontSize: 11.5, color: theme.muted, marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Two columns */}
          <div style={{ marginTop: 16, display:'grid', gridTemplateColumns:'1.4fr 1fr', gap: 16 }}>
            {/* Próximos */}
            <div style={{ borderRadius: 16, background: theme.bg, border: `1px solid ${theme.border}`, overflow:'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div className="tn-h" style={{ fontSize: 15, fontWeight: 700 }}>Próximos turnos</div>
                <a style={{ fontSize: 12.5, color: theme.primary, fontWeight: 600 }}>Ver calendario →</a>
              </div>
              {[
                { d:'mar 14', t:'22:00 — 08:00', n:'Guardia nocturna', sp:'UCI · Planta 4', c:'#7C3AED', l:'N', mine:true },
                { d:'sáb 18', t:'08:00 — 18:00', n:'Guardia diurna', sp:'Cardiología', c:'#14B8A6', l:'D' },
                { d:'mié 22', t:'14:00 — 22:00', n:'Refuerzo tarde', sp:'Urgencias', c:'#0EA5E9', l:'R' },
                { d:'sáb 25', t:'08:00 — 18:00', n:'Guardia diurna', sp:'Cardiología', c:'#14B8A6', l:'D' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '14px 20px', display:'flex', alignItems:'center', gap: 16, borderBottom: i < 3 ? `1px solid ${theme.border}` : 'none' }}>
                  <div style={{ width: 50, textAlign:'center' }}>
                    <div style={{ fontSize: 10, color: theme.muted, fontWeight: 700, textTransform:'uppercase', letterSpacing:'0.06em' }}>{s.d.split(' ')[0]}</div>
                    <div className="tn-h" style={{ fontSize: 22, fontWeight: 800, color: theme.text, lineHeight: 1, marginTop: 2 }}>{s.d.split(' ')[1]}</div>
                  </div>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: s.c + '22', color: s.c, fontWeight: 800, fontSize: 16, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter Tight',sans-serif" }}>{s.l}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{s.n}</div>
                    <div style={{ fontSize: 11.5, color: theme.muted, marginTop: 1 }}>{s.t} · {s.sp}</div>
                  </div>
                  {s.mine ? <Pill color={theme.primary} theme={theme}>Empieza pronto</Pill> : null}
                  <Icons.chevronR size={16} style={{ color: theme.muted }} />
                </div>
              ))}
            </div>

            {/* Activity feed + quick links */}
            <div style={{ display:'flex', flexDirection:'column', gap: 16 }}>
              <div style={{ borderRadius: 16, background: theme.bg, border: `1px solid ${theme.border}`, padding: 18 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12 }}>
                  <div className="tn-h" style={{ fontSize: 15, fontWeight: 700 }}>Actividad reciente</div>
                  <a style={{ fontSize: 12, color: theme.primary, fontWeight: 600 }}>Ver todo</a>
                </div>
                {[
                  { i: <Icons.swap size={13} />, c: theme.primary, t:'Carlos R. te pide intercambio', d:'hace 12 min' },
                  { i: <Icons.check size={13} stroke={3} />, c: theme.green, t:'Tu solicitud fue aprobada', d:'hace 1h' },
                  { i: <Icons.cal2 size={13} />, c: theme.blue, t:'Nuevo turno publicado', d:'hace 3h' },
                ].map((a, i) => (
                  <div key={i} style={{ display:'flex', gap: 10, padding:'8px 0' }}>
                    <div style={{ width: 24, height: 24, borderRadius: 7, background: a.c + '22', color: a.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>{a.i}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, color: theme.text, fontWeight: 500 }}>{a.t}</div>
                      <div style={{ fontSize: 11, color: theme.muted, marginTop: 1 }}>{a.d}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderRadius: 16, background: `linear-gradient(135deg, ${theme.primary}10, ${theme.primary}04)`, border: `1px solid ${theme.primary}30`, padding: 18 }}>
                <div style={{ display:'flex', alignItems:'center', gap: 8, color: theme.primary, fontSize: 11, fontWeight: 700, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                  <Icons.takeOpen size={13} /> Turnos abiertos
                </div>
                <div className="tn-h" style={{ fontSize: 22, fontWeight: 800, marginTop: 6, letterSpacing:'-0.02em' }}>3 disponibles</div>
                <div style={{ fontSize: 12.5, color: theme.textSec, marginTop: 4, lineHeight: 1.5 }}>
                  Hay turnos sin asignar que coinciden con tu disponibilidad. Solicita los que te interesen.
                </div>
                <button style={{ marginTop: 14, height: 38, padding:'0 16px', borderRadius: 10, background: theme.primary, color:'#fff', fontWeight: 600, fontSize: 13, border:'none', display:'flex', alignItems:'center', gap: 6 }}>
                  Ver turnos abiertos <Icons.arrowR size={14} stroke={2.4} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.D = { DLogin, DCalendar, DRequests, DStaffHome };
