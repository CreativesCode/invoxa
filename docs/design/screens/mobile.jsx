/* Turnia mobile screens. Each is a 390×844 React component for iOS frame. */

const { Icons, Icon } = window;

// ─────────── shared mobile chrome ───────────

function MStatusFake({ time = '9:41', dark }) {
  // Lightweight status bar (we use IOSStatusBar from frame, this is for non-framed)
  const c = dark ? '#fff' : '#0F172A';
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 28px 6px', fontSize: 15, fontWeight:600, color: c, fontFamily: '-apple-system,SF Pro,system-ui' }}>
      <span>{time}</span>
      <div style={{ display:'flex', gap: 6, alignItems:'center' }}>
        <Icons.zap size={14} stroke={2.4} />
      </div>
    </div>
  );
}

function MTab({ active, label, icon, theme, badge }) {
  const c = active ? theme.primary : theme.muted;
  return (
    <div style={{ flex: 1, display:'flex', flexDirection:'column', alignItems:'center', gap: 4, padding: '8px 0 6px', position:'relative' }}>
      <div style={{ color: c, position:'relative' }}>
        {icon}
        {badge ? (
          <span style={{ position:'absolute', top:-3, right:-6, background: theme.red, color:'#fff', fontSize: 9, fontWeight: 700, borderRadius: 999, minWidth: 14, height: 14, display:'inline-flex', alignItems:'center', justifyContent:'center', padding:'0 4px', border:`2px solid ${theme.bg}` }}>{badge}</span>
        ) : null}
      </div>
      <span style={{ fontSize: 10.5, fontWeight: active ? 600 : 500, color: c, letterSpacing: '0.01em' }}>{label}</span>
    </div>
  );
}

function MTabBar({ active = 'home', theme, badges = {} }) {
  return (
    <div style={{ position:'absolute', left: 0, right: 0, bottom: 0, background: theme.bg, borderTop: `1px solid ${theme.border}`, paddingBottom: 22, display:'flex' }}>
      <MTab active={active==='home'} label="Inicio" icon={<Icons.home size={22} stroke={active==='home'?2.2:1.8} />} theme={theme} />
      <MTab active={active==='cal'} label="Calendario" icon={<Icons.calendar size={22} stroke={active==='cal'?2.2:1.8} />} theme={theme} />
      <MTab active={active==='requests'} label="Solicitudes" icon={<Icons.swap size={22} stroke={active==='requests'?2.2:1.8} />} theme={theme} badge={badges.requests} />
      <MTab active={active==='avail'} label="Disponible" icon={<Icons.beach size={22} stroke={active==='avail'?2.2:1.8} />} theme={theme} />
      <MTab active={active==='profile'} label="Perfil" icon={<Icons.user size={22} stroke={active==='profile'?2.2:1.8} />} theme={theme} />
    </div>
  );
}

function MHomeIndicator({ dark }) {
  return (
    <div style={{ position:'absolute', left:0, right:0, bottom: 8, display:'flex', justifyContent:'center', pointerEvents:'none' }}>
      <div style={{ width: 134, height: 5, borderRadius: 999, background: dark ? '#fff' : '#0F172A', opacity: dark ? 0.9 : 0.85 }} />
    </div>
  );
}

function MAppBar({ title, subtitle, theme, right, big = false, leading }) {
  return (
    <div style={{ padding: big ? '12px 20px 8px' : '10px 20px 12px', display:'flex', alignItems: big ? 'flex-end' : 'center', justifyContent:'space-between', gap: 12 }}>
      <div style={{ display:'flex', alignItems:'center', gap: 12, minWidth: 0, flex: 1 }}>
        {leading}
        <div style={{ minWidth: 0 }}>
          <div className="tn-h" style={{ fontSize: big ? 28 : 18, fontWeight: 700, color: theme.text, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{title}</div>
          {subtitle ? <div style={{ fontSize: 13, color: theme.muted, marginTop: 2 }}>{subtitle}</div> : null}
        </div>
      </div>
      {right}
    </div>
  );
}

function ShiftLetter({ letter, color, size = 36, theme }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: color + '22', color: color, display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: size * 0.46, fontFamily:"'Inter Tight',Inter,sans-serif" }}>
      {letter}
    </div>
  );
}

function Pill({ children, color, theme, soft = true, dot = false, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems:'center', gap: 6, padding: '3px 9px',
      borderRadius: 999, fontSize: 11.5, fontWeight: 600, letterSpacing: '0.005em',
      background: soft ? color + '1F' : color, color: soft ? color : '#fff',
      ...style,
    }}>
      {dot ? <span style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor' }} /> : null}
      {children}
    </span>
  );
}

// ─────────── 1. Login ───────────

function MLogin({ theme }) {
  return (
    <div style={{ width: '100%', height: '100%', background: theme.bg, color: theme.text, position:'relative', display:'flex', flexDirection:'column' }}>
      <div style={{ flex: 1, padding: '76px 28px 0', display:'flex', flexDirection:'column' }}>
        {/* logo lockup */}
        <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 6px 20px -8px ${theme.primary}99` }}>
            <div style={{ width: 22, height: 22, borderRadius: 7, background: '#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width: 4, height: 11, background: theme.primary, borderRadius: 2 }} />
              <div style={{ width: 11, height: 4, background: theme.primary, borderRadius: 2, position: 'absolute' }} />
            </div>
          </div>
          <div className="tn-h" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>Turnia</div>
        </div>

        <div style={{ marginTop: 56 }}>
          <div className="tn-h" style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.025em' }}>Tu guardia,<br/>en orden.</div>
          <div style={{ fontSize: 15, color: theme.muted, marginTop: 10, lineHeight: 1.45 }}>Inicia sesión para ver tus turnos, solicitar cambios y gestionar tu disponibilidad.</div>
        </div>

        <div style={{ marginTop: 36, display:'flex', flexDirection:'column', gap: 14 }}>
          <FieldM theme={theme} label="Email" value="ana.morales@hospitalsj.org" icon={<Icons.mail size={18} />} />
          <FieldM theme={theme} label="Contraseña" value="•••••••••••" icon={<Icons.lock size={18} />} trailing={<Icons.eye size={18} />} />
          <div style={{ alignSelf:'flex-end', fontSize: 13, color: theme.primary, fontWeight: 600, marginTop: -2 }}>¿Olvidaste tu contraseña?</div>
        </div>

        <button style={{ marginTop: 28, height: 52, borderRadius: 14, border: 'none', background: theme.primary, color: '#fff', fontSize: 15.5, fontWeight: 700, letterSpacing: '-0.005em', display:'flex', alignItems:'center', justifyContent:'center', gap: 8, boxShadow: `0 8px 22px -10px ${theme.primary}` }}>
          Iniciar sesión <Icons.arrowR size={18} stroke={2.4} />
        </button>

        <div style={{ display:'flex', alignItems:'center', gap: 12, margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, background: theme.border }} />
          <span style={{ fontSize: 11.5, color: theme.muted, fontWeight: 600, letterSpacing: '0.06em' }}>O</span>
          <div style={{ flex: 1, height: 1, background: theme.border }} />
        </div>

        <button style={{ height: 52, borderRadius: 14, border: `1px solid ${theme.border}`, background: theme.surface, color: theme.text, fontSize: 14.5, fontWeight: 600, display:'flex', alignItems:'center', justifyContent:'center', gap: 10 }}>
          <Icons.fingerprint size={20} /> Acceder con Face ID
        </button>
      </div>

      <div style={{ padding: '20px 28px 32px', textAlign:'center', fontSize: 13, color: theme.muted }}>
        ¿Eres nuevo? <span style={{ color: theme.primary, fontWeight: 600 }}>Acepta tu invitación</span>
      </div>
    </div>
  );
}

function FieldM({ theme, label, value, icon, trailing, focused }) {
  return (
    <div style={{ borderRadius: 14, border: `1px solid ${focused ? theme.primary : theme.border}`, background: theme.surface, padding: '10px 14px', display:'flex', alignItems:'center', gap: 12, boxShadow: focused ? `0 0 0 4px ${theme.primary}22` : 'none' }}>
      <div style={{ color: theme.muted }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: theme.muted, letterSpacing:'0.04em', textTransform:'uppercase' }}>{label}</div>
        <div style={{ fontSize: 15, color: theme.text, marginTop: 2, fontWeight: 500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{value}</div>
      </div>
      {trailing ? <div style={{ color: theme.muted }}>{trailing}</div> : null}
    </div>
  );
}

// ─────────── 2. Home Staff ───────────

function MHomeStaff({ theme }) {
  const teal = theme.primary;
  return (
    <div style={{ width: '100%', height: '100%', background: theme.subtle, color: theme.text, position:'relative', display:'flex', flexDirection:'column' }}>
      {/* header */}
      <div style={{ background: theme.bg, padding: '8px 20px 16px', borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 999, background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 700, fontSize: 14 }}>AM</div>
            <div>
              <div style={{ fontSize: 12, color: theme.muted }}>Hola,</div>
              <div className="tn-h" style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Dra. Ana Morales</div>
            </div>
          </div>
          <div style={{ display:'flex', gap: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: theme.subtle2, display:'flex', alignItems:'center', justifyContent:'center', color: theme.text, position:'relative' }}>
              <Icons.bell size={19} />
              <span style={{ position:'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 999, background: theme.red, border: `2px solid ${theme.subtle2}` }} />
            </div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: theme.muted, marginTop: 12, display:'flex', alignItems:'center', gap: 6 }}>
          <Icons.hospital size={13} /> Hospital San Juan · Cardiología
        </div>
      </div>

      <div className="tn-noscroll" style={{ flex: 1, overflowY:'auto', padding: '16px 20px 100px' }}>

        {/* HERO próximo turno */}
        <div style={{ borderRadius: 22, padding: 20, background: `linear-gradient(150deg, ${teal} 0%, ${theme.primaryDark} 100%)`, color: '#fff', position:'relative', overflow:'hidden', boxShadow: `0 14px 30px -16px ${teal}` }}>
          <svg width="240" height="240" viewBox="0 0 100 100" style={{ position:'absolute', right: -60, top: -60, opacity: 0.18 }}>
            <circle cx="50" cy="50" r="40" stroke="#fff" strokeWidth="0.6" fill="none" />
            <circle cx="50" cy="50" r="28" stroke="#fff" strokeWidth="0.6" fill="none" />
            <circle cx="50" cy="50" r="16" stroke="#fff" strokeWidth="0.6" fill="none" />
          </svg>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', position:'relative' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform:'uppercase', opacity: 0.9 }}>Tu próximo turno</div>
            <div style={{ display:'inline-flex', alignItems:'center', gap: 6, padding: '4px 10px', background:'rgba(255,255,255,.18)', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
              <span style={{ position:'relative', width: 7, height: 7, borderRadius: 999, background:'#fff' }} className="tn-blink" /> En 14h 32m
            </div>
          </div>

          <div style={{ marginTop: 14, display:'flex', alignItems:'flex-end', gap: 14, position:'relative' }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background:'rgba(255,255,255,.18)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.85, letterSpacing:'0.06em' }}>MAR</div>
              <div className="tn-h" style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, marginTop: 2 }}>14</div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="tn-h" style={{ fontSize: 22, fontWeight: 700, letterSpacing:'-0.02em', lineHeight: 1.1 }}>Guardia nocturna</div>
              <div style={{ fontSize: 14, marginTop: 4, opacity: 0.95 }}>22:00 — 08:00 · 10h</div>
              <div style={{ fontSize: 13, marginTop: 2, opacity: 0.85, display:'flex', alignItems:'center', gap: 5 }}>
                <Icons.pin size={12} /> UCI · Planta 4
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, display:'flex', gap: 8, position:'relative' }}>
            <button style={{ flex: 1, height: 40, borderRadius: 12, background:'rgba(255,255,255,.95)', color: theme.primaryDark, fontSize: 13.5, fontWeight: 700, border: 'none', display:'flex', alignItems:'center', justifyContent:'center', gap: 6 }}>
              <Icons.eye size={15} /> Ver detalle
            </button>
            <button style={{ flex: 1, height: 40, borderRadius: 12, background:'rgba(255,255,255,.18)', color:'#fff', fontSize: 13.5, fontWeight: 600, border: '1px solid rgba(255,255,255,.3)', display:'flex', alignItems:'center', justifyContent:'center', gap: 6 }}>
              <Icons.swap size={15} /> Solicitar cambio
            </button>
          </div>
        </div>

        {/* On-call now */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 10 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
              <span style={{ position:'relative', display:'inline-flex', width: 8, height: 8 }}>
                <span style={{ position:'absolute', inset: 0, borderRadius: 999, background: theme.green, animation: 'tn-ping 1.8s ease-out infinite' }} />
                <span style={{ position:'absolute', inset: 1, borderRadius: 999, background: theme.green }} />
              </span>
              <div className="tn-h" style={{ fontSize: 16, fontWeight: 700, letterSpacing:'-0.015em' }}>De guardia ahora</div>
            </div>
            <div style={{ fontSize: 12, color: theme.primary, fontWeight: 600 }}>Ver todos →</div>
          </div>
          <div style={{ display:'flex', gap: 10, overflowX:'auto', margin:'0 -20px', padding: '0 20px 4px' }} className="tn-noscroll">
            {[
              { n: 'Carlos R.', r: 'Cardiología', c: '#0EA5E9', i: 'CR', end: 'hasta 22:00' },
              { n: 'Lucía P.', r: 'UCI', c: '#8B5CF6', i: 'LP', end: 'hasta 14:00' },
              { n: 'Diego M.', r: 'Urgencias', c: '#F97316', i: 'DM', end: 'hasta 20:00' },
            ].map((p, i) => (
              <div key={i} style={{ minWidth: 180, padding: 14, borderRadius: 16, background: theme.bg, border: `1px solid ${theme.border}` }}>
                <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 999, background: p.c + '20', color: p.c, display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 700, fontSize: 13 }}>{p.i}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.n}</div>
                    <div style={{ fontSize: 11.5, color: theme.muted }}>{p.r}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11.5, marginTop: 10, color: theme.muted, display:'flex', alignItems:'center', gap: 4 }}>
                  <Icons.clock size={12} /> {p.end}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mes en cifras */}
        <div style={{ marginTop: 22, display:'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { v: '18', l: 'Turnos', sub: 'este mes' },
            { v: '142h', l: 'Horas', sub: 'trabajadas' },
            { v: '2', l: 'Solicitudes', sub: 'pendientes', accent: theme.amber },
          ].map((m, i) => (
            <div key={i} style={{ padding: 12, borderRadius: 14, background: theme.bg, border: `1px solid ${theme.border}` }}>
              <div className="tn-h" style={{ fontSize: 22, fontWeight: 800, letterSpacing:'-0.02em', color: m.accent || theme.text }}>{m.v}</div>
              <div style={{ fontSize: 11, color: theme.text, marginTop: 2, fontWeight: 600 }}>{m.l}</div>
              <div style={{ fontSize: 11, color: theme.muted }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ marginTop: 22 }}>
          <div className="tn-h" style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 10 }}>Acciones rápidas</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
            {[
              { l: 'Turnos abiertos', s: '3 disponibles', i: <Icons.takeOpen size={18} />, c: theme.primary },
              { l: 'Mi disponibilidad', s: 'Vacaciones', i: <Icons.beach size={18} />, c: theme.blue },
              { l: 'Mis solicitudes', s: '2 pendientes', i: <Icons.swap size={18} />, c: theme.amber },
              { l: 'Equipo', s: '24 miembros', i: <Icons.users size={18} />, c: theme.violet },
            ].map((a, i) => (
              <div key={i} style={{ padding: 14, borderRadius: 16, background: theme.bg, border: `1px solid ${theme.border}`, display:'flex', flexDirection:'column', gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: a.c + '1A', color: a.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{a.i}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{a.l}</div>
                  <div style={{ fontSize: 11.5, color: theme.muted, marginTop: 1 }}>{a.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MTabBar active="home" theme={theme} badges={{ requests: 2 }} />
    </div>
  );
}

// ─────────── 3. Calendar (Mis turnos) ───────────

function MCalendar({ theme }) {
  const days = ['L','M','X','J','V','S','D'];
  // Generate 6 weeks for May 2026 starting on Friday May 1
  const startOffset = 4; // Mon=0, Fri=4
  const today = 14;
  const grid = [];
  for (let i = 0; i < 42; i++) {
    const dayNum = i - startOffset + 1;
    grid.push(dayNum);
  }
  const shiftMap = {
    2: { c: '#14B8A6', l:'D' },
    5: { c: '#14B8A6', l:'D' },
    8: { c: '#7C3AED', l:'N' },
    11: { c: '#14B8A6', l:'D' },
    14: { c: '#7C3AED', l:'N' },
    17: { c: '#F59E0B', l:'L' },
    18: { c: '#F59E0B', l:'L' },
    19: { c: '#F59E0B', l:'L' },
    22: { c: '#14B8A6', l:'D' },
    25: { c: '#14B8A6', l:'D' },
    28: { c: '#7C3AED', l:'N' },
  };
  return (
    <div style={{ width:'100%', height:'100%', background: theme.bg, color: theme.text, position:'relative', display:'flex', flexDirection:'column' }}>
      <MAppBar theme={theme} title="Mis turnos" subtitle="Mayo 2026" right={
        <div style={{ display:'flex', gap: 8 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: theme.subtle, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.filter size={18} /></div>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: theme.subtle, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.search size={18} /></div>
        </div>
      } />

      <div style={{ padding: '0 20px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding: '4px 4px 12px' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: theme.subtle2, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.chevronL size={16} /></div>
            <div className="tn-h" style={{ fontSize: 18, fontWeight: 700, letterSpacing:'-0.015em', minWidth: 96, textAlign:'center' }}>Mayo</div>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: theme.subtle2, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.chevronR size={16} /></div>
          </div>
          <div style={{ display:'flex', background: theme.subtle2, borderRadius: 10, padding: 3 }}>
            <span style={{ fontSize: 12, padding: '5px 10px', borderRadius: 7, background: theme.bg, fontWeight: 600, boxShadow: `0 1px 2px ${theme.border}` }}>Mes</span>
            <span style={{ fontSize: 12, padding: '5px 10px', color: theme.muted, fontWeight: 500 }}>Sem</span>
            <span style={{ fontSize: 12, padding: '5px 10px', color: theme.muted, fontWeight: 500 }}>Lista</span>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap: 0, marginBottom: 6 }}>
          {days.map(d => <div key={d} style={{ textAlign:'center', fontSize: 11, color: theme.muted, fontWeight: 600, paddingBottom: 6 }}>{d}</div>)}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap: 4 }}>
          {grid.map((d, i) => {
            const visible = d >= 1 && d <= 31;
            const sh = shiftMap[d];
            const isToday = d === today;
            return (
              <div key={i} style={{
                aspectRatio: '1', borderRadius: 10,
                background: isToday ? theme.primary + '12' : 'transparent',
                border: isToday ? `1.5px solid ${theme.primary}` : `1px solid transparent`,
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', paddingTop: 6, gap: 3,
                opacity: visible ? 1 : 0,
                position:'relative',
              }}>
                <div style={{ fontSize: 13, fontWeight: isToday ? 700 : 500, color: isToday ? theme.primary : theme.text }}>{visible ? d : ''}</div>
                {sh ? (
                  <div style={{ width: 18, height: 18, borderRadius: 6, background: sh.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 10, fontWeight: 800 }}>{sh.l}</div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend + day list */}
      <div style={{ padding: '14px 20px 0', display:'flex', gap: 10, flexWrap:'wrap' }}>
        <Pill color="#14B8A6" theme={theme} dot>Diurno</Pill>
        <Pill color="#7C3AED" theme={theme} dot>Nocturno</Pill>
        <Pill color="#F59E0B" theme={theme} dot>Vacaciones</Pill>
      </div>

      <div className="tn-noscroll" style={{ flex: 1, overflowY:'auto', marginTop: 14, padding: '0 20px 110px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 10 }}>
          <div className="tn-h" style={{ fontSize: 15, fontWeight: 700 }}>Hoy · Jueves 14</div>
          <div style={{ fontSize: 12, color: theme.muted }}>1 turno</div>
        </div>
        <div style={{ borderRadius: 16, background: theme.subtle, border: `1px solid ${theme.border}`, padding: 14, display:'flex', alignItems:'center', gap: 12 }}>
          <ShiftLetter letter="N" color="#7C3AED" theme={theme} size={42} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Guardia nocturna · UCI</div>
            <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>22:00 — 08:00 · 10h</div>
          </div>
          <Pill color={theme.primary} theme={theme}>Tuyo</Pill>
        </div>
      </div>

      <MTabBar active="cal" theme={theme} badges={{ requests: 2 }} />
    </div>
  );
}

// ─────────── 4. Shift Detail (modal sheet style) ───────────

function MShiftDetail({ theme }) {
  return (
    <div style={{ width:'100%', height:'100%', background: theme.bg, color: theme.text, position:'relative', display:'flex', flexDirection:'column' }}>
      <div style={{ padding: '8px 16px 6px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: theme.subtle2, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.chevronL size={20} /></div>
        <div className="tn-h" style={{ fontSize: 14, fontWeight: 700 }}>Detalle del turno</div>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: theme.subtle2, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.more size={20} /></div>
      </div>

      <div className="tn-noscroll" style={{ flex: 1, overflowY:'auto', padding: '6px 20px 120px' }}>
        {/* Type banner */}
        <div style={{ borderRadius: 18, background: '#7C3AED', color:'#fff', padding: 20, position:'relative', overflow:'hidden' }}>
          <svg width="120" height="120" viewBox="0 0 100 100" style={{ position:'absolute', right: -30, top: -30, opacity: .14 }}>
            <circle cx="50" cy="50" r="40" stroke="#fff" strokeWidth="1" fill="none" />
            <circle cx="50" cy="50" r="22" fill="#fff" />
          </svg>
          <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background:'rgba(255,255,255,.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 26, fontWeight: 800, fontFamily:"'Inter Tight',sans-serif" }}>N</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, opacity: .85, textTransform:'uppercase', letterSpacing:'0.1em' }}>Nocturno</div>
              <div className="tn-h" style={{ fontSize: 22, fontWeight: 700, letterSpacing:'-0.02em', marginTop: 2 }}>Guardia UCI</div>
            </div>
          </div>
          <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 14, background:'rgba(255,255,255,.14)', backdropFilter:'blur(8px)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize: 11, opacity: .8 }}>FECHA</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>Mar 14 may 2026</div>
              </div>
              <div style={{ width: 1, height: 30, background:'rgba(255,255,255,.28)' }} />
              <div>
                <div style={{ fontSize: 11, opacity: .8 }}>HORARIO</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>22:00 — 08:00</div>
              </div>
              <div style={{ width: 1, height: 30, background:'rgba(255,255,255,.28)' }} />
              <div>
                <div style={{ fontSize: 11, opacity: .8 }}>HORAS</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>10h</div>
              </div>
            </div>
          </div>
        </div>

        {/* Info rows */}
        <div style={{ marginTop: 18, borderRadius: 16, background: theme.subtle, border: `1px solid ${theme.border}`, overflow:'hidden' }}>
          <Row theme={theme} icon={<Icons.user size={18}/>} label="Asignado" value="Dra. Ana Morales (tú)" trailing={<Pill color={theme.primary} theme={theme}>Tu turno</Pill>} />
          <Row theme={theme} icon={<Icons.pin size={18}/>} label="Ubicación" value="UCI · Planta 4 · Sala C" />
          <Row theme={theme} icon={<Icons.briefcase size={18}/>} label="Especialidad" value="Cardiología" />
          <Row theme={theme} icon={<Icons.cross size={18}/>} label="Estado" value="Publicado" trailing={<span style={{ fontSize: 11, color: theme.green, fontWeight: 600 }}>● Activo</span>} last />
        </div>

        {/* Equipo */}
        <div style={{ marginTop: 18 }}>
          <div className="tn-h" style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Compañeros de guardia</div>
          <div style={{ display:'flex', gap: 8, alignItems:'center' }}>
            {[{n:'CR',c:'#0EA5E9'},{n:'LP',c:'#F97316'},{n:'DM',c:'#10B981'}].map((p,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap: 8, padding:'6px 12px 6px 6px', borderRadius: 999, background: theme.subtle, border:`1px solid ${theme.border}` }}>
                <div style={{ width: 26, height: 26, borderRadius: 999, background: p.c + '22', color: p.c, fontSize: 11, fontWeight: 700, display:'flex', alignItems:'center', justifyContent:'center' }}>{p.n}</div>
                <span style={{ fontSize: 12.5, fontWeight: 500 }}>{p.n === 'CR' ? 'Carlos R.' : p.n === 'LP' ? 'Lucía P.' : 'Diego M.'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div style={{ marginTop: 18, padding: 14, borderRadius: 14, background: theme.amberSoft, border: `1px solid ${theme.amber}33`, display:'flex', gap: 10 }}>
          <Icons.alert size={18} style={{ color: theme.amber, flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 12.5, color: theme.text, lineHeight: 1.45 }}>
            <strong>Recordatorio del centro:</strong> Pase de guardia a las 21:45 en Sala de Sesiones B. Lleva ID y dosímetro.
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div style={{ position:'absolute', left: 0, right: 0, bottom: 0, padding: '12px 20px 28px', background: theme.bg, borderTop: `1px solid ${theme.border}`, display:'flex', gap: 10 }}>
        <button style={{ flex: 1, height: 50, borderRadius: 14, border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, fontWeight: 600, fontSize: 13.5, display:'flex', alignItems:'center', justifyContent:'center', gap: 6 }}>
          <Icons.giveaway size={16} /> Ceder turno
        </button>
        <button style={{ flex: 1.3, height: 50, borderRadius: 14, border: 'none', background: theme.primary, color: '#fff', fontWeight: 700, fontSize: 13.5, display:'flex', alignItems:'center', justifyContent:'center', gap: 6, boxShadow: `0 8px 22px -10px ${theme.primary}` }}>
          <Icons.swap size={16} /> Intercambiar
        </button>
      </div>
    </div>
  );
}

function Row({ theme, icon, label, value, trailing, last }) {
  return (
    <div style={{ padding: '14px 16px', display:'flex', alignItems:'center', gap: 12, borderBottom: last ? 'none' : `1px solid ${theme.border}` }}>
      <div style={{ width: 32, height: 32, borderRadius: 10, background: theme.bg, color: theme.muted, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11.5, color: theme.muted, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 14, color: theme.text, marginTop: 1, fontWeight: 600 }}>{value}</div>
      </div>
      {trailing}
    </div>
  );
}

// ─────────── 5. Request flow (swap form) ───────────

function MRequestSwap({ theme }) {
  return (
    <div style={{ width:'100%', height:'100%', background: theme.bg, color: theme.text, position:'relative', display:'flex', flexDirection:'column' }}>
      <div style={{ padding: '10px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: theme.subtle2, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.x size={20} /></div>
        <div className="tn-h" style={{ fontSize: 15, fontWeight: 700 }}>Intercambiar turno</div>
        <div style={{ width: 40, fontSize: 12, color: theme.muted, textAlign:'right' }}>2 / 3</div>
      </div>

      {/* progress */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display:'flex', gap: 6 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 999, background: theme.primary }} />
          <div style={{ flex: 1, height: 4, borderRadius: 999, background: theme.primary }} />
          <div style={{ flex: 1, height: 4, borderRadius: 999, background: theme.subtle2 }} />
        </div>
      </div>

      <div className="tn-noscroll" style={{ flex: 1, overflowY:'auto', padding: '20px 20px 120px' }}>
        <div className="tn-h" style={{ fontSize: 22, fontWeight: 700, letterSpacing:'-0.02em', lineHeight: 1.2 }}>¿Con qué turno quieres intercambiar?</div>
        <div style={{ fontSize: 13.5, color: theme.muted, marginTop: 6 }}>Tu turno es <strong style={{ color: theme.text }}>Nocturna · Mar 14 may</strong>.</div>

        {/* Tu turno card */}
        <div style={{ marginTop: 18, padding: 14, borderRadius: 14, border: `1px solid ${theme.border}`, background: theme.subtle, display:'flex', alignItems:'center', gap: 12 }}>
          <ShiftLetter letter="N" color="#7C3AED" size={40} theme={theme} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: theme.muted, fontWeight: 600 }}>TU TURNO</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 1 }}>Nocturna · UCI · Mar 14 may</div>
            <div style={{ fontSize: 12, color: theme.muted, marginTop: 1 }}>22:00 — 08:00</div>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap: 10, margin: '14px 0' }}>
          <div style={{ flex: 1, height: 1, background: theme.border }} />
          <div style={{ width: 36, height: 36, borderRadius: 999, background: theme.primary + '18', color: theme.primary, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.swap2 size={18} /></div>
          <div style={{ flex: 1, height: 1, background: theme.border }} />
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: theme.muted, fontWeight: 600, letterSpacing:'0.04em', textTransform:'uppercase' }}>Turnos compatibles</div>
          <div style={{ fontSize: 12, color: theme.primary, fontWeight: 600 }}>Filtrar</div>
        </div>

        {[
          { sel: true, n: 'Carlos R.', sp: 'Cardiología', d: 'Mié 15 may · 08:00–18:00', l:'D', c:'#14B8A6' },
          { sel: false, n: 'Lucía P.', sp: 'UCI', d: 'Vie 17 may · 22:00–08:00', l:'N', c:'#7C3AED' },
          { sel: false, n: 'Diego M.', sp: 'UCI', d: 'Sáb 18 may · 22:00–08:00', l:'N', c:'#7C3AED' },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 10, padding: 14, borderRadius: 14, border: `${s.sel ? 2 : 1}px solid ${s.sel ? theme.primary : theme.border}`, background: s.sel ? theme.primary + '0E' : theme.bg, display:'flex', alignItems:'center', gap: 12 }}>
            <ShiftLetter letter={s.l} color={s.c} size={40} theme={theme} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{s.n} · <span style={{ color: theme.muted, fontWeight: 500 }}>{s.sp}</span></div>
              <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>{s.d}</div>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: 999, background: s.sel ? theme.primary : 'transparent', border: s.sel ? 'none' : `1.5px solid ${theme.borderStrong}`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
              {s.sel ? <Icons.check size={14} stroke={3} /> : null}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12, color: theme.muted, fontWeight: 600, letterSpacing:'0.04em', textTransform:'uppercase', marginBottom: 8 }}>Mensaje (opcional)</div>
          <div style={{ borderRadius: 14, border: `1px solid ${theme.border}`, padding: 12, fontSize: 13.5, color: theme.textSec, minHeight: 70, lineHeight: 1.45 }}>
            ¡Hola Carlos! Tengo un imprevisto familiar el martes. ¿Te animas a cambiar?<span style={{ display:'inline-block', width: 1.5, height: 14, background: theme.primary, marginLeft: 1, verticalAlign:'middle' }} className="tn-blink" />
          </div>
        </div>
      </div>

      <div style={{ position:'absolute', left:0, right:0, bottom: 0, padding: '12px 20px 28px', background: theme.bg, borderTop: `1px solid ${theme.border}`, display:'flex', gap: 10 }}>
        <button style={{ width: 50, height: 50, borderRadius: 14, border: `1px solid ${theme.border}`, background: theme.bg, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.chevronL size={18} /></button>
        <button style={{ flex: 1, height: 50, borderRadius: 14, background: theme.primary, color:'#fff', fontWeight: 700, fontSize: 14, border:'none', display:'flex', alignItems:'center', justifyContent:'center', gap: 8, boxShadow: `0 8px 22px -10px ${theme.primary}` }}>
          Continuar <Icons.arrowR size={18} stroke={2.4} />
        </button>
      </div>
    </div>
  );
}

// ─────────── 6. My Requests + pending swaps ───────────

function MMyRequests({ theme }) {
  return (
    <div style={{ width:'100%', height:'100%', background: theme.subtle, color: theme.text, position:'relative', display:'flex', flexDirection:'column' }}>
      <div style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
        <MAppBar theme={theme} title="Solicitudes" subtitle="Tu actividad reciente" right={
          <button style={{ height: 36, padding: '0 12px', borderRadius: 10, background: theme.primary, color:'#fff', fontWeight: 600, fontSize: 12.5, border:'none', display:'flex', alignItems:'center', gap: 6 }}><Icons.plus size={14} stroke={2.6}/> Nueva</button>
        } />
        <div style={{ display:'flex', gap: 6, padding: '0 20px 12px', overflowX:'auto' }} className="tn-noscroll">
          {['Todas','Pendientes','Aceptadas','Rechazadas'].map((t,i) => (
            <div key={i} style={{
              padding: '7px 13px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
              background: i === 1 ? theme.text : theme.subtle, color: i === 1 ? theme.bg : theme.textSec,
              whiteSpace:'nowrap',
            }}>{t}{i===1?' · 2':''}</div>
          ))}
        </div>
      </div>

      <div className="tn-noscroll" style={{ flex: 1, overflowY:'auto', padding: '16px 20px 100px' }}>
        {/* Action-needed callout */}
        <div style={{ borderRadius: 18, padding: 16, background: theme.bg, border: `1.5px solid ${theme.amber}55`, position:'relative', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 8, color: theme.amber, fontSize: 11.5, fontWeight: 700, textTransform:'uppercase', letterSpacing:'0.06em' }}>
            <Icons.bell size={13} /> Te piden un swap
          </div>
          <div style={{ display:'flex', alignItems:'center', gap: 12, marginTop: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 999, background: '#0EA5E920', color:'#0EA5E9', fontWeight: 700, fontSize: 14, display:'flex', alignItems:'center', justifyContent:'center' }}>CR</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>Carlos R. quiere intercambiar</div>
              <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>Tu sáb 18 ⇄ su mié 15</div>
            </div>
          </div>
          <div style={{ marginTop: 14, display:'flex', gap: 8 }}>
            <button style={{ flex: 1, height: 40, borderRadius: 12, background: theme.text, color: theme.bg, border:'none', fontWeight: 700, fontSize: 13, display:'flex', alignItems:'center', justifyContent:'center', gap: 6 }}>
              <Icons.check size={15} stroke={2.6} /> Aceptar
            </button>
            <button style={{ width: 50, height: 40, borderRadius: 12, background: theme.subtle, border: `1px solid ${theme.border}`, display:'flex', alignItems:'center', justifyContent:'center', color: theme.muted }}>
              <Icons.x size={16} />
            </button>
            <button style={{ width: 50, height: 40, borderRadius: 12, background: theme.subtle, border: `1px solid ${theme.border}`, display:'flex', alignItems:'center', justifyContent:'center', color: theme.muted }}>
              <Icons.eye size={16} />
            </button>
          </div>
        </div>

        {/* Timeline list */}
        <div style={{ marginTop: 22, fontSize: 12, color: theme.muted, fontWeight: 600, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom: 8 }}>Mis solicitudes</div>

        {[
          { kind:'swap', title:'Intercambio con Carlos R.', sub:'Mar 14 may ⇄ Mié 15 may', status:'pending', badge: 'Pendiente' },
          { kind:'giveaway', title:'Ceder guardia diurna', sub:'Sáb 18 may · 08:00–18:00', status:'accepted', badge: 'Aprobada' },
          { kind:'takeOpen', title:'Pedir turno abierto', sub:'Vie 24 may · 22:00–08:00', status:'rejected', badge: 'Rechazada' },
          { kind:'swap', title:'Intercambio con Lucía P.', sub:'Lun 5 may · cancelada', status:'cancelled', badge: 'Cancelada' },
        ].map((r, i) => {
          const map = {
            pending: { c: theme.amber, soft: theme.amberSoft },
            accepted: { c: theme.green, soft: theme.greenSoft },
            rejected: { c: theme.red, soft: theme.redSoft },
            cancelled: { c: theme.muted, soft: theme.subtle2 },
          }[r.status];
          const Ic = r.kind === 'swap' ? Icons.swap : r.kind === 'giveaway' ? Icons.giveaway : Icons.takeOpen;
          return (
            <div key={i} style={{ marginBottom: 8, padding: 14, borderRadius: 16, background: theme.bg, border: `1px solid ${theme.border}`, display:'flex', alignItems:'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: map.soft, color: map.c, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Ic size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: theme.muted, marginTop: 2 }}>{r.sub}</div>
              </div>
              <Pill color={map.c} theme={theme} dot>{r.badge}</Pill>
            </div>
          );
        })}
      </div>

      <MTabBar active="requests" theme={theme} badges={{ requests: 1 }} />
    </div>
  );
}

// ─────────── 7. Availability ───────────

function MAvailability({ theme }) {
  return (
    <div style={{ width:'100%', height:'100%', background: theme.bg, color: theme.text, position:'relative', display:'flex', flexDirection:'column' }}>
      <MAppBar theme={theme} title="Disponibilidad" subtitle="Tus eventos y ausencias" right={
        <div style={{ width: 38, height: 38, borderRadius: 11, background: theme.primary, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow: `0 8px 18px -10px ${theme.primary}` }}><Icons.plus size={18} stroke={2.6} /></div>
      } />

      <div style={{ padding: '0 20px' }}>
        <div style={{ display:'flex', gap: 8, overflowX:'auto', paddingBottom: 10 }} className="tn-noscroll">
          {[
            { l:'Vacaciones', c: theme.amber, i: <Icons.beach size={14} /> },
            { l:'Licencia', c: theme.red, i: <Icons.cross size={14} /> },
            { l:'Capacitación', c: theme.blue, i: <Icons.edu size={14} /> },
            { l:'No disponible', c: theme.muted, i: <Icons.x size={14} /> },
          ].map((t,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 6, padding:'7px 12px', borderRadius: 999, background: t.c + '14', color: t.c, fontSize: 12, fontWeight: 600, whiteSpace:'nowrap' }}>
              {t.i} {t.l}
            </div>
          ))}
        </div>
      </div>

      <div className="tn-noscroll" style={{ flex: 1, overflowY:'auto', padding: '8px 20px 100px' }}>

        {/* Year strip */}
        <div style={{ marginTop: 4, padding: 14, borderRadius: 18, background: theme.subtle, border: `1px solid ${theme.border}` }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div className="tn-h" style={{ fontSize: 14, fontWeight: 700 }}>Año 2026</div>
            <div style={{ fontSize: 12, color: theme.muted }}>5 eventos</div>
          </div>
          <div style={{ marginTop: 12, display:'grid', gridTemplateColumns:'repeat(12, 1fr)', gap: 3 }}>
            {Array.from({ length: 12 }).map((_, m) => {
              const isJul = m === 6; const isAgo = m === 7;
              const hasEvent = isJul || isAgo;
              return (
                <div key={m} style={{ height: 36, borderRadius: 4, background: hasEvent ? theme.amber : theme.subtle2, position:'relative' }}>
                  <span style={{ position:'absolute', bottom:-16, left:0, right:0, textAlign:'center', fontSize: 9, color: theme.muted, fontWeight: 600 }}>{['E','F','M','A','M','J','J','A','S','O','N','D'][m]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming */}
        <div style={{ marginTop: 30 }}>
          <div className="tn-h" style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Próximos eventos</div>

          {[
            { type:'Vacaciones', range:'Lun 14 jul → Vie 1 ago', days:'19 días', c: theme.amber, i: <Icons.beach size={18} />, status:'Confirmado' },
            { type:'Capacitación', range:'Mié 17 sep · 09:00–14:00', days:'5 horas', c: theme.blue, i: <Icons.edu size={18} />, status:'Aprobado por mánager' },
            { type:'No disponible', range:'Sáb 4 oct · todo el día', days:'Compromiso familiar', c: theme.muted, i: <Icons.x size={18} />, status:'Borrador' },
          ].map((e, i) => (
            <div key={i} style={{ marginBottom: 10, padding: 16, borderRadius: 18, background: theme.bg, border: `1px solid ${theme.border}`, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', left: 0, top: 0, bottom: 0, width: 4, background: e.c, borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }} />
              <div style={{ display:'flex', alignItems:'center', gap: 12, paddingLeft: 6 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: e.c + '18', color: e.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{e.i}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{e.type}</div>
                  <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>{e.range}</div>
                  <div style={{ fontSize: 11.5, color: theme.text, marginTop: 4, display:'flex', alignItems:'center', gap: 5 }}>
                    <Icons.clock size={11} /> {e.days}
                  </div>
                </div>
                <Icons.chevronR size={18} style={{ color: theme.muted }} />
              </div>
              <div style={{ marginTop: 8, paddingLeft: 6, fontSize: 11, color: theme.muted }}>{e.status}</div>
            </div>
          ))}
        </div>
      </div>

      <MTabBar active="avail" theme={theme} />
    </div>
  );
}

// ─────────── 8. Notifications ───────────

function MNotifications({ theme }) {
  return (
    <div style={{ width:'100%', height:'100%', background: theme.subtle, color: theme.text, position:'relative', display:'flex', flexDirection:'column' }}>
      <div style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
        <MAppBar theme={theme} title="Notificaciones" subtitle="3 nuevas" leading={<div style={{ width: 36, height: 36, borderRadius: 10, background: theme.subtle2, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.chevronL size={18} /></div>} right={<div style={{ fontSize: 12.5, color: theme.primary, fontWeight: 600 }}>Marcar todas</div>} />
      </div>

      <div className="tn-noscroll" style={{ flex: 1, overflowY:'auto', padding: '12px 20px 32px' }}>
        <div style={{ fontSize: 11.5, color: theme.muted, fontWeight: 700, letterSpacing:'0.06em', textTransform:'uppercase', margin: '6px 4px 8px' }}>Hoy</div>

        {[
          { read:false, kind:'swap', title:'Carlos R. te pide un intercambio', sub:'Tu sáb 18 may ⇄ su mié 15 may', t:'hace 12 min', c: theme.primary, i: <Icons.swap size={16} /> },
          { read:false, kind:'approve', title:'Tu solicitud fue aprobada', sub:'Ceder guardia · sáb 18 may', t:'hace 1 h', c: theme.green, i: <Icons.check size={16} stroke={2.6} /> },
          { read:false, kind:'shift', title:'Nuevo turno publicado', sub:'Lun 19 may · 08:00–18:00 · UCI', t:'hace 3 h', c: theme.blue, i: <Icons.cal2 size={16} /> },
        ].map((n, i) => <NotifRow key={i} {...n} theme={theme} />)}

        <div style={{ fontSize: 11.5, color: theme.muted, fontWeight: 700, letterSpacing:'0.06em', textTransform:'uppercase', margin: '20px 4px 8px' }}>Esta semana</div>

        {[
          { read:true, title:'Recordatorio: pase de guardia', sub:'Hoy 21:45 · Sala B', t:'mar', c: theme.amber, i: <Icons.bell size={16} /> },
          { read:true, title:'Lucía P. aceptó tu intercambio', sub:'Mar 14 may ⇄ Vie 17 may', t:'lun', c: theme.green, i: <Icons.check size={16} stroke={2.6} /> },
          { read:true, title:'Tu manager publicó el calendario', sub:'Junio 2026 disponible', t:'dom', c: theme.violet, i: <Icons.calendar size={16} /> },
        ].map((n, i) => <NotifRow key={i+10} {...n} theme={theme} />)}
      </div>
    </div>
  );
}

function NotifRow({ read, title, sub, t, c, i, theme }) {
  return (
    <div style={{ marginBottom: 8, padding: 14, borderRadius: 16, background: theme.bg, border: `1px solid ${theme.border}`, display:'flex', alignItems:'flex-start', gap: 12, position:'relative' }}>
      {!read ? <span style={{ position:'absolute', left: 4, top: 22, width: 6, height: 6, borderRadius: 999, background: theme.primary }} /> : null}
      <div style={{ width: 36, height: 36, borderRadius: 10, background: c + '18', color: c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0, marginLeft: read ? 0 : 6 }}>{i}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: read ? 500 : 600, color: theme.text }}>{title}</div>
        <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ fontSize: 11, color: theme.muted, whiteSpace:'nowrap', marginTop: 2 }}>{t}</div>
    </div>
  );
}

// ─────────── 9. Profile ───────────

function MProfile({ theme }) {
  return (
    <div style={{ width:'100%', height:'100%', background: theme.subtle, color: theme.text, position:'relative', display:'flex', flexDirection:'column' }}>
      <div style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}`, paddingBottom: 18 }}>
        <div style={{ padding: '12px 20px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ width: 36, height: 36 }} />
          <div className="tn-h" style={{ fontSize: 15, fontWeight: 700 }}>Mi perfil</div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.subtle2, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.settings size={18} /></div>
        </div>

        <div style={{ marginTop: 18, padding: '0 20px', display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{ width: 84, height: 84, borderRadius: 999, background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 30, fontWeight: 800, fontFamily:"'Inter Tight',sans-serif", boxShadow: `0 14px 30px -16px ${theme.primary}`, position:'relative' }}>
            AM
            <div style={{ position:'absolute', bottom: -2, right: -2, width: 24, height: 24, borderRadius: 999, background: theme.bg, display:'flex', alignItems:'center', justifyContent:'center', border: `2px solid ${theme.bg}` }}>
              <div style={{ width: 18, height: 18, borderRadius: 999, background: theme.green, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.check size={11} stroke={3} style={{ color:'#fff' }} /></div>
            </div>
          </div>
          <div className="tn-h" style={{ fontSize: 20, fontWeight: 700, marginTop: 12, letterSpacing:'-0.015em' }}>Dra. Ana Morales</div>
          <div style={{ fontSize: 13, color: theme.muted, marginTop: 2 }}>ana.morales@hospitalsj.org</div>
          <div style={{ marginTop: 10, display:'flex', gap: 6 }}>
            <Pill color={theme.primary} theme={theme}>Staff</Pill>
            <Pill color={theme.blue} theme={theme}>Cardiología</Pill>
          </div>
        </div>

        <div style={{ marginTop: 18, padding: '0 20px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 8 }}>
          {[{v:'18',l:'Turnos / mes'},{v:'142h',l:'Horas / mes'},{v:'94%',l:'Asistencia'}].map((s,i)=>(
            <div key={i} style={{ padding: 12, borderRadius: 14, background: theme.subtle, textAlign:'center' }}>
              <div className="tn-h" style={{ fontSize: 18, fontWeight: 800 }}>{s.v}</div>
              <div style={{ fontSize: 10.5, color: theme.muted, marginTop: 2, fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tn-noscroll" style={{ flex: 1, overflowY:'auto', padding: '16px 20px 100px' }}>
        <Section theme={theme} title="Cuenta">
          <RowM theme={theme} icon={<Icons.user size={18} />} label="Datos personales" />
          <RowM theme={theme} icon={<Icons.building size={18} />} label="Mis organizaciones" right={<Pill color={theme.primary} theme={theme}>1</Pill>} />
          <RowM theme={theme} icon={<Icons.lock size={18} />} label="Seguridad" last />
        </Section>
        <Section theme={theme} title="Aplicación">
          <RowM theme={theme} icon={<Icons.bell size={18} />} label="Notificaciones" right={<Switch on theme={theme} />} />
          <RowM theme={theme} icon={<Icons.history size={18} />} label="Actividad reciente" last />
        </Section>

        <Section theme={theme} title="Apariencia">
          <ThemeRow theme={theme} />
          <AccentPicker theme={theme} />
        </Section>
        <button style={{ width:'100%', marginTop: 14, height: 50, borderRadius: 14, border: `1px solid ${theme.border}`, background: theme.bg, color: theme.red, fontWeight: 600, fontSize: 13.5, display:'flex', alignItems:'center', justifyContent:'center', gap: 8 }}>
          <Icons.logout size={16} /> Cerrar sesión
        </button>
      </div>

      <MTabBar active="profile" theme={theme} />
    </div>
  );
}

function ThemeRow({ theme }) {
  const isDark = theme.mode === 'dark';
  const set = (v) => window.tnSetTweaks && window.tnSetTweaks({ darkMode: v });
  return (
    <div style={{ padding: '12px 14px', borderBottom: `1px solid ${theme.border}` }}>
      <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: theme.subtle, color: theme.textSec, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.sparkle size={18} /></div>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: theme.text }}>Modo</div>
      </div>
      <div style={{ display:'flex', gap: 8, padding: 4, borderRadius: 12, background: theme.subtle }}>
        {[{k:false,l:'Claro',i:<Icons.sparkle size={14} />},{k:true,l:'Oscuro',i:<Icons.eye size={14} />}].map((opt,i)=>{
          const active = isDark === opt.k;
          return (
            <div key={i} onClick={() => set(opt.k)} style={{ flex: 1, height: 38, borderRadius: 9, background: active ? theme.bg : 'transparent', color: active ? theme.text : theme.muted, display:'flex', alignItems:'center', justifyContent:'center', gap: 6, fontSize: 12.5, fontWeight: 600, cursor:'pointer', boxShadow: active ? '0 1px 3px rgba(0,0,0,.06)' : 'none' }}>
              {opt.i}{opt.l}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AccentPicker({ theme }) {
  const accents = [
    { k:'teal', c:'#14B8A6', l:'Teal' },
    { k:'indigo', c:'#6366F1', l:'Indigo' },
    { k:'emerald', c:'#10B981', l:'Emerald' },
    { k:'rose', c:'#F43F5E', l:'Rose' },
  ];
  const current = (window.__tnTweaks && window.__tnTweaks.accent) || 'teal';
  const set = (v) => window.tnSetTweaks && window.tnSetTweaks({ accent: v });
  return (
    <div style={{ padding: '14px 14px' }}>
      <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: theme.primary + '18', color: theme.primary, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.zap size={16} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: theme.text }}>Color de acento</div>
          <div style={{ fontSize: 11, color: theme.muted, marginTop: 1 }}>Personaliza el color principal de la app</div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 8 }}>
        {accents.map((a) => {
          const active = a.k === current;
          return (
            <div key={a.k} onClick={() => set(a.k)} style={{ cursor:'pointer', padding: 8, borderRadius: 12, background: active ? a.c + '12' : theme.subtle, border: `1.5px solid ${active ? a.c : 'transparent'}`, display:'flex', flexDirection:'column', alignItems:'center', gap: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: `linear-gradient(135deg, ${a.c}, ${a.c}cc)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow: active ? `0 4px 14px -4px ${a.c}` : 'none' }}>
                {active ? <Icons.check size={16} stroke={3} style={{ color:'#fff' }} /> : null}
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: active ? a.c : theme.textSec }}>{a.l}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Section({ theme, title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 11.5, color: theme.muted, fontWeight: 700, textTransform:'uppercase', letterSpacing:'0.08em', margin: '0 4px 8px' }}>{title}</div>
      <div style={{ borderRadius: 16, background: theme.bg, border: `1px solid ${theme.border}`, overflow:'hidden' }}>{children}</div>
    </div>
  );
}

function RowM({ theme, icon, label, right, last }) {
  return (
    <div style={{ padding: '14px 14px', display:'flex', alignItems:'center', gap: 12, borderBottom: last ? 'none' : `1px solid ${theme.border}` }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: theme.subtle, color: theme.textSec, display:'flex', alignItems:'center', justifyContent:'center' }}>{icon}</div>
      <div style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: theme.text }}>{label}</div>
      {right || <Icons.chevronR size={16} style={{ color: theme.muted }} />}
    </div>
  );
}

function Switch({ on, theme }) {
  return (
    <div style={{ width: 42, height: 24, borderRadius: 999, background: on ? theme.primary : theme.subtle2, padding: 2, display:'flex', alignItems:'center', justifyContent: on ? 'flex-end' : 'flex-start' }}>
      <div style={{ width: 20, height: 20, borderRadius: 999, background:'#fff', boxShadow: '0 1px 2px rgba(0,0,0,.2)' }} />
    </div>
  );
}

// ─────────── 10. Manager Calendar (mobile, week list) ───────────

function MManagerHome({ theme }) {
  return (
    <div style={{ width:'100%', height:'100%', background: theme.subtle, color: theme.text, position:'relative', display:'flex', flexDirection:'column' }}>
      <div style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
        <MAppBar theme={theme} title="Manager" subtitle="Cardiología · 24 personas" right={
          <div style={{ display:'flex', gap: 8 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: theme.subtle2, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
              <Icons.bell size={18} />
              <span style={{ position:'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 999, background: theme.amber, border: `2px solid ${theme.subtle2}` }} />
            </div>
          </div>
        } />
      </div>

      <div className="tn-noscroll" style={{ flex: 1, overflowY:'auto', padding: '16px 20px 100px' }}>
        {/* KPI strip */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8 }}>
          <div style={{ padding: 14, borderRadius: 16, background: theme.bg, border: `1px solid ${theme.border}` }}>
            <div style={{ fontSize: 11, color: theme.muted, fontWeight: 600 }}>Esta semana</div>
            <div className="tn-h" style={{ fontSize: 26, fontWeight: 800, marginTop: 2, letterSpacing:'-0.02em' }}>62 <span style={{ fontSize: 13, color: theme.muted, fontWeight: 600 }}>turnos</span></div>
            <div style={{ marginTop: 6, height: 4, background: theme.subtle2, borderRadius: 999, overflow:'hidden' }}>
              <div style={{ width:'78%', height:'100%', background: theme.primary }} />
            </div>
            <div style={{ fontSize: 11, color: theme.muted, marginTop: 4 }}>485h cubiertas · 78%</div>
          </div>
          <div style={{ padding: 14, borderRadius: 16, background: theme.amber + '0E', border: `1px solid ${theme.amber}55` }}>
            <div style={{ fontSize: 11, color: theme.amber, fontWeight: 700 }}>Atención</div>
            <div className="tn-h" style={{ fontSize: 26, fontWeight: 800, marginTop: 2, letterSpacing:'-0.02em', color: theme.amber }}>7</div>
            <div style={{ fontSize: 11.5, color: theme.text, marginTop: 4, fontWeight: 500 }}>Solicitudes pendientes</div>
            <div style={{ fontSize: 10.5, color: theme.muted, marginTop: 1 }}>3 swaps · 4 cesiones</div>
          </div>
        </div>

        {/* Quick CTA */}
        <button style={{ width:'100%', marginTop: 14, height: 56, borderRadius: 16, background: theme.primary, color:'#fff', fontWeight: 700, fontSize: 14, border:'none', display:'flex', alignItems:'center', justifyContent:'center', gap: 8, boxShadow: `0 12px 26px -12px ${theme.primary}` }}>
          <Icons.plus size={18} stroke={2.6} /> Crear nuevo turno
        </button>

        {/* Coverage bar */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10 }}>
            <div className="tn-h" style={{ fontSize: 14, fontWeight: 700 }}>Cobertura semanal</div>
            <div style={{ fontSize: 12, color: theme.primary, fontWeight: 600 }}>Ver calendario →</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap: 4 }}>
            {['L','M','X','J','V','S','D'].map((d, i) => {
              const cov = [100, 100, 95, 80, 60, 100, 75][i];
              const c = cov >= 95 ? theme.green : cov >= 80 ? theme.primary : cov >= 70 ? theme.amber : theme.red;
              return (
                <div key={i} style={{ padding: 10, borderRadius: 12, background: theme.bg, border: `1px solid ${theme.border}`, textAlign:'center' }}>
                  <div style={{ fontSize: 10, color: theme.muted, fontWeight: 600 }}>{d}</div>
                  <div className="tn-h" style={{ fontSize: 14, fontWeight: 700, marginTop: 4, color: c }}>{cov}%</div>
                  <div style={{ marginTop: 6, height: 3, background: theme.subtle2, borderRadius: 999, overflow:'hidden' }}>
                    <div style={{ width: cov + '%', height:'100%', background: c }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending requests */}
        <div style={{ marginTop: 24 }}>
          <div className="tn-h" style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Solicitudes urgentes</div>
          {[
            { i:'CR', n:'Carlos R.', t:'Intercambio · Mar 14 may', c:'#0EA5E9' },
            { i:'LP', n:'Lucía P.', t:'Cesión · Vie 17 may · UCI', c:'#F97316' },
          ].map((r, i) => (
            <div key={i} style={{ marginBottom: 8, padding: 14, borderRadius: 16, background: theme.bg, border: `1px solid ${theme.border}` }}>
              <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 999, background: r.c + '20', color: r.c, fontWeight: 700, fontSize: 13, display:'flex', alignItems:'center', justifyContent:'center' }}>{r.i}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.n}</div>
                  <div style={{ fontSize: 11.5, color: theme.muted, marginTop: 1 }}>{r.t}</div>
                </div>
                <Pill color={theme.amber} theme={theme}>Pendiente</Pill>
              </div>
              <div style={{ marginTop: 12, display:'flex', gap: 8 }}>
                <button style={{ flex: 1, height: 38, borderRadius: 11, background: theme.primary, color:'#fff', border:'none', fontSize: 12.5, fontWeight: 600, display:'flex', alignItems:'center', justifyContent:'center', gap: 5 }}>
                  <Icons.check size={14} stroke={2.6} /> Aprobar
                </button>
                <button style={{ width: 70, height: 38, borderRadius: 11, background: theme.subtle, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 12.5, fontWeight: 600 }}>Rechazar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MTabBar active="home" theme={theme} badges={{ requests: 7 }} />
    </div>
  );
}

window.M = { MLogin, MHomeStaff, MCalendar, MShiftDetail, MRequestSwap, MMyRequests, MAvailability, MNotifications, MProfile, MManagerHome };
