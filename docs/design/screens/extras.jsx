/* Tanda 1: pantallas adicionales del codebase de Turnia. */

const { Icons } = window;

function _Pill({ children, color, theme, dot }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap: 6, padding:'3px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: color + '20', color }}>
      {dot ? <span style={{ width: 6, height: 6, borderRadius: 999, background:'currentColor' }} /> : null}
      {children}
    </span>
  );
}

// ─────────── AUTH (mobile) ───────────

function MAuthShell({ theme, title, sub, children, footer }) {
  return (
    <div style={{ width:'100%', height:'100%', background: theme.bg, color: theme.text, display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'56px 28px 0', display:'flex', flexDirection:'column', alignItems:'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background:`linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 14px 30px -14px ${theme.primary}` }}>
          <div style={{ width: 22, height: 22, position:'relative' }}>
            <div style={{ position:'absolute', left: 9, top: 0, width: 4, height: 22, background:'#fff', borderRadius: 2 }} />
            <div style={{ position:'absolute', left: 0, top: 9, width: 22, height: 4, background:'#fff', borderRadius: 2 }} />
          </div>
        </div>
        <div className="tn-h" style={{ marginTop: 22, fontSize: 26, fontWeight: 800, letterSpacing:'-0.03em', textAlign:'center' }}>{title}</div>
        <div style={{ marginTop: 8, fontSize: 14, color: theme.muted, textAlign:'center', lineHeight: 1.5, padding:'0 20px' }}>{sub}</div>
      </div>
      <div style={{ flex: 1, padding: 24 }}>{children}</div>
      {footer ? <div style={{ padding: '0 24px 32px', textAlign:'center', fontSize: 13, color: theme.muted }}>{footer}</div> : null}
    </div>
  );
}

function _Field({ theme, label, value, ph, trailing, focused }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label ? <div style={{ fontSize: 12.5, fontWeight: 600, color: theme.textSec, marginBottom: 6 }}>{label}</div> : null}
      <div style={{ height: 50, borderRadius: 12, border:`1.5px solid ${focused?theme.primary:theme.border}`, background: theme.bg, padding:'0 14px', display:'flex', alignItems:'center', gap: 10, boxShadow: focused?`0 0 0 4px ${theme.primary}22`:'none' }}>
        <span style={{ flex: 1, fontSize: 14.5, color: value ? theme.text : theme.muted, fontWeight: 500 }}>{value || ph}</span>
        {trailing}
      </div>
    </div>
  );
}

function _Btn({ theme, label, full, secondary, icon }) {
  return (
    <button style={{ width: full?'100%':'auto', height: 50, padding:'0 20px', borderRadius: 12, border: secondary?`1px solid ${theme.border}`:'none', background: secondary?theme.bg:theme.primary, color: secondary?theme.text:'#fff', fontWeight: 700, fontSize: 14.5, display:'flex', alignItems:'center', justifyContent:'center', gap: 8, boxShadow: secondary?'none':`0 10px 24px -12px ${theme.primary}` }}>
      {label}{icon}
    </button>
  );
}

function MForgotPassword({ theme }) {
  return (
    <MAuthShell theme={theme} title="¿Olvidaste tu contraseña?" sub="Ingresa tu email y te enviaremos un enlace para restablecerla." footer={<>¿Recordaste tu contraseña? <a style={{ color: theme.primary, fontWeight: 600 }}>Iniciar sesión</a></>}>
      <_Field theme={theme} label="Email" value="ana.morales@hospitalsj.org" focused />
      <_Btn theme={theme} label="Enviar enlace" full icon={<Icons.arrowR size={16} stroke={2.6} />} />
      <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: theme.subtle, border:`1px solid ${theme.border}`, fontSize: 12.5, color: theme.textSec, display:'flex', gap: 10 }}>
        <Icons.mail size={16} style={{ color: theme.primary, flexShrink: 0, marginTop: 1 }} />
        <div>El enlace expira en <b>30 min</b>. Revisa también la carpeta de spam.</div>
      </div>
    </MAuthShell>
  );
}

function MResetPassword({ theme }) {
  return (
    <MAuthShell theme={theme} title="Nueva contraseña" sub="Elige una contraseña segura para tu cuenta.">
      <_Field theme={theme} label="Nueva contraseña" value="••••••••••••" trailing={<Icons.eye size={17} style={{ color: theme.muted }} />} />
      <_Field theme={theme} label="Confirmar contraseña" value="••••••••••••" trailing={<Icons.eye size={17} style={{ color: theme.muted }} />} />
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11.5, color: theme.muted, fontWeight: 600, marginBottom: 8 }}>Requisitos</div>
        {[{l:'Al menos 8 caracteres',ok:true},{l:'Una mayúscula',ok:true},{l:'Un número',ok:true},{l:'Un símbolo',ok:false}].map((r,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap: 8, fontSize: 12.5, color: r.ok?theme.green:theme.muted, padding:'4px 0' }}>
            <span style={{ width: 16, height: 16, borderRadius: 999, background: r.ok?theme.green+'22':theme.subtle, color: r.ok?theme.green:theme.muted, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
              {r.ok ? <Icons.check size={11} stroke={3} /> : <Icons.x size={10} stroke={3} />}
            </span>
            {r.l}
          </div>
        ))}
      </div>
      <_Btn theme={theme} label="Actualizar contraseña" full />
    </MAuthShell>
  );
}

function MSignup({ theme }) {
  return (
    <MAuthShell theme={theme} title="Crea tu cuenta" sub="Únete al equipo y empieza a gestionar tus turnos." footer={<>¿Ya tienes cuenta? <a style={{ color: theme.primary, fontWeight: 600 }}>Iniciar sesión</a></>}>
      <_Field theme={theme} label="Nombre completo" value="Ana Morales" />
      <_Field theme={theme} label="Email" value="ana.morales@hospitalsj.org" />
      <_Field theme={theme} label="Contraseña" value="••••••••••" trailing={<Icons.eye size={17} style={{ color: theme.muted }} />} />
      <label style={{ display:'flex', alignItems:'flex-start', gap: 10, fontSize: 12.5, color: theme.textSec, margin:'4px 0 16px', lineHeight: 1.5 }}>
        <span style={{ width: 18, height: 18, borderRadius: 5, background: theme.primary, display:'inline-flex', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink: 0, marginTop: 1 }}><Icons.check size={11} stroke={3} /></span>
        Acepto los <a style={{ color: theme.primary, fontWeight: 600 }}>Términos</a> y la <a style={{ color: theme.primary, fontWeight: 600 }}>Política de privacidad</a>.
      </label>
      <_Btn theme={theme} label="Crear cuenta" full icon={<Icons.arrowR size={16} stroke={2.6} />} />
    </MAuthShell>
  );
}

function MInvite({ theme }) {
  return (
    <MAuthShell theme={theme} title="Te invitaron a Turnia" sub={<><b style={{ color: theme.text }}>Hospital San Juan</b> te invitó a unirte como <b style={{ color: theme.primary }}>Staff · Cardiología</b>.</>}>
      <div style={{ padding: 18, borderRadius: 16, background: theme.subtle, border:`1px solid ${theme.border}`, marginBottom: 16, display:'flex', alignItems:'center', gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background:'#0EA5E9', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800 }}>SJ</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700 }}>Hospital San Juan</div>
          <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>24 miembros · 6 equipos</div>
        </div>
      </div>
      <_Field theme={theme} label="Tu nombre" value="Ana Morales" />
      <_Field theme={theme} label="Contraseña" value="••••••••••" trailing={<Icons.eye size={17} style={{ color: theme.muted }} />} />
      <_Btn theme={theme} label="Aceptar invitación" full icon={<Icons.arrowR size={16} stroke={2.6} />} />
      <button style={{ width:'100%', marginTop: 10, height: 44, borderRadius: 12, border:`1px solid ${theme.border}`, background:'transparent', color: theme.muted, fontWeight: 500, fontSize: 13 }}>Rechazar invitación</button>
    </MAuthShell>
  );
}

// ─────────── ACTIVE NOW (mobile + desktop) ───────────

function _Header({ theme, title, sub }) {
  return (
    <div style={{ padding:'14px 20px 18px', borderBottom:`1px solid ${theme.border}`, background: theme.bg }}>
      <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.subtle2, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.chevronL size={17} /></div>
        <div style={{ flex: 1 }}>
          <div className="tn-h" style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: 11.5, color: theme.muted }}>{sub}</div>
        </div>
        <div style={{ position:'relative' }}>
          <span style={{ position:'absolute', inset:-2, borderRadius: 999, background: theme.green + '40', animation:'tn-ping 1.8s ease-out infinite' }} />
          <span style={{ position:'relative', display:'block', width: 10, height: 10, borderRadius: 999, background: theme.green }} />
        </div>
      </div>
    </div>
  );
}

function MActiveNow({ theme }) {
  const peeps = [
    { n:'Carlos Rodríguez', sp:'Cardiología', from:'08:00', to:'18:00', loc:'Planta 4', c:'#0EA5E9', i:'CR', pct: 64 },
    { n:'Lucía Pereira', sp:'UCI', from:'06:00', to:'14:00', loc:'Planta 3', c:'#8B5CF6', i:'LP', pct: 95 },
    { n:'Diego Méndez', sp:'Urgencias', from:'10:00', to:'20:00', loc:'PB', c:'#F97316', i:'DM', pct: 40 },
    { n:'Sara Torres', sp:'Pediatría', from:'08:00', to:'16:00', loc:'Planta 2', c:'#14B8A6', i:'ST', pct: 75 },
    { n:'Pedro Vázquez', sp:'Anestesia', from:'12:00', to:'00:00', loc:'Quirófano 1', c:'#F59E0B', i:'PV', pct: 18 },
  ];
  return (
    <div style={{ width:'100%', height:'100%', background: theme.subtle, color: theme.text, display:'flex', flexDirection:'column' }}>
      <_Header theme={theme} title="De turno ahora" sub="14:23 · 5 personas activas" />
      <div className="tn-noscroll" style={{ flex: 1, overflowY:'auto', padding:'14px 16px 32px', display:'flex', flexDirection:'column', gap: 10 }}>
        {peeps.map((p,i)=>(
          <div key={i} style={{ padding: 14, borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}` }}>
            <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 999, background: p.c+'22', color: p.c, display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 13 }}>{p.i}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{p.n}</div>
                <div style={{ fontSize: 11.5, color: theme.muted, marginTop: 2, display:'flex', alignItems:'center', gap: 5 }}><Icons.stethoscope size={11} /> {p.sp} · <Icons.pin size={11} /> {p.loc}</div>
              </div>
              <_Pill theme={theme} color={theme.green} dot>En curso</_Pill>
            </div>
            <div style={{ marginTop: 12, display:'flex', alignItems:'center', gap: 10 }}>
              <span style={{ fontSize: 11, color: theme.muted, fontWeight: 600 }}>{p.from}</span>
              <div style={{ flex: 1, height: 6, borderRadius: 999, background: theme.subtle, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', inset:0, width: p.pct+'%', background: `linear-gradient(90deg, ${p.c}88, ${p.c})`, borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: 11, color: theme.muted, fontWeight: 600 }}>{p.to}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────── DAILY SCHEDULE (mobile) ───────────

function MDailySchedule({ theme }) {
  const hours = ['08','10','12','14','16','18','20','22'];
  const peeps = [
    { n:'Carlos R.', i:'CR', c:'#0EA5E9', start: 0, dur: 6, label:'Diurno' },
    { n:'Lucía P.', i:'LP', c:'#8B5CF6', start: 0, dur: 4, label:'Mañana' },
    { n:'Ana M. (tú)', i:'AM', c:'#14B8A6', start: 7, dur: 5, label:'Nocturno', mine:true },
    { n:'Diego M.', i:'DM', c:'#F97316', start: 1, dur: 5, label:'Tarde' },
    { n:'Sara T.', i:'ST', c:'#F59E0B', start: 0, dur: 4, label:'Diurno' },
    { n:'Pedro V.', i:'PV', c:'#A78BFA', start: 2, dur: 6, label:'Refuerzo' },
  ];
  return (
    <div style={{ width:'100%', height:'100%', background: theme.subtle, color: theme.text, display:'flex', flexDirection:'column' }}>
      <_Header theme={theme} title="Agenda de hoy" sub="Jueves 14 may · 6 personas" />
      <div style={{ padding: 14, background: theme.bg, borderBottom: `1px solid ${theme.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', gap: 6 }}>
          {['Hoy','Mañana','Sáb 16'].map((d,i)=>(
            <div key={i} style={{ padding:'7px 12px', borderRadius: 999, background: i===0?theme.text:theme.subtle, color: i===0?theme.bg:theme.textSec, fontSize: 12, fontWeight: 600 }}>{d}</div>
          ))}
        </div>
        <Icons.filter size={17} style={{ color: theme.muted }} />
      </div>
      <div className="tn-noscroll" style={{ flex: 1, overflowY:'auto', padding:'12px 16px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', padding:'0 50px 6px 56px', fontSize: 9.5, color: theme.muted, fontWeight: 700 }}>
          {hours.map((h,i)=>(<span key={i}>{h}</span>))}
        </div>
        {peeps.map((p,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap: 10, padding:'8px 0', borderBottom: i<peeps.length-1?`1px solid ${theme.border}`:'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: p.c+'22', color: p.c, fontWeight: 700, fontSize: 11.5, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>{p.i}</div>
            <div style={{ width: 60, fontSize: 11, fontWeight: 600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.n}</div>
            <div style={{ flex: 1, height: 28, position:'relative' }}>
              {hours.map((_,j)=>(<div key={j} style={{ position:'absolute', left: (j/(hours.length-1))*100+'%', top:0, bottom:0, width: 1, background: theme.border, opacity:.5 }} />))}
              <div style={{ position:'absolute', left: (p.start/(hours.length-1))*100+'%', width: (p.dur/(hours.length-1))*100+'%', top: 4, bottom: 4, borderRadius: 7, background: p.mine?p.c:p.c+'24', border: p.mine?'none':`1px solid ${p.c}55`, color: p.mine?'#fff':p.c, fontSize: 9.5, fontWeight: 700, display:'flex', alignItems:'center', paddingLeft: 6, overflow:'hidden' }}>{p.label}</div>
              {/* now line */}
              <div style={{ position:'absolute', left: '47%', top: -4, bottom: -4, width: 1.5, background: theme.red }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: theme.subtle, fontSize: 11.5, color: theme.muted, display:'flex', alignItems:'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: theme.red }} /> 14:23 · ahora
        </div>
      </div>
    </div>
  );
}

// ─────────── TRANSACTIONS (mobile) ───────────

function MTransactions({ theme }) {
  const groups = [
    { date:'Hoy · jue 14', items: [
      { who:'Carlos R.', what:'pidió intercambio contigo', when:'14:08', kind:'swap', status:'pending' },
      { who:'Lucía P.', what:'cedió su turno', when:'12:30', kind:'give', status:'approved' },
    ]},
    { date:'Ayer · mié 13', items: [
      { who:'Ana M. (tú)', what:'tomaste un turno abierto', when:'18:42', kind:'take', status:'approved' },
      { who:'Diego M.', what:'rechazó tu intercambio', when:'10:14', kind:'swap', status:'rejected' },
    ]},
    { date:'Mar 12 may', items: [
      { who:'Sara T.', what:'aceptó tu cesión', when:'09:00', kind:'give', status:'approved' },
    ]},
  ];
  return (
    <div style={{ width:'100%', height:'100%', background: theme.subtle, color: theme.text, display:'flex', flexDirection:'column' }}>
      <_Header theme={theme} title="Movimientos" sub="Historial de solicitudes y cambios" />
      <div style={{ padding:'10px 16px', display:'flex', gap: 6, background: theme.bg, borderBottom:`1px solid ${theme.border}` }}>
        {[{l:'Todos',n:42,a:true},{l:'Swaps',n:18},{l:'Cesiones',n:14},{l:'Abiertos',n:10}].map((t,i)=>(
          <div key={i} style={{ padding:'7px 11px', borderRadius: 999, background: t.a?theme.text:theme.subtle, color: t.a?theme.bg:theme.textSec, fontSize: 11.5, fontWeight: 600, display:'flex', alignItems:'center', gap: 5 }}>{t.l}<span style={{ fontSize: 10, opacity: .7 }}>·{t.n}</span></div>
        ))}
      </div>
      <div className="tn-noscroll" style={{ flex: 1, overflowY:'auto', padding:'8px 16px 24px' }}>
        {groups.map((g,gi)=>(
          <div key={gi} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10.5, color: theme.muted, fontWeight: 700, textTransform:'uppercase', letterSpacing:'0.06em', padding:'10px 4px 8px' }}>{g.date}</div>
            <div style={{ borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}`, overflow:'hidden' }}>
              {g.items.map((it,ii)=>{
                const Ic = it.kind==='swap'?Icons.swap:it.kind==='give'?Icons.giveaway:Icons.takeOpen;
                const sc = it.status==='approved'?theme.green:it.status==='rejected'?theme.red:theme.amber;
                const sl = it.status==='approved'?'Aprobado':it.status==='rejected'?'Rechazado':'Pendiente';
                return (
                  <div key={ii} style={{ padding: 14, display:'flex', alignItems:'center', gap: 12, borderBottom: ii<g.items.length-1?`1px solid ${theme.border}`:'none' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: sc+'18', color: sc, display:'flex', alignItems:'center', justifyContent:'center' }}><Ic size={17} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, lineHeight: 1.4 }}><b>{it.who}</b> {it.what}</div>
                      <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>{it.when}</div>
                    </div>
                    <_Pill color={sc} theme={theme} dot>{sl}</_Pill>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────── STATISTICS (mobile + desktop) ───────────

function _Bar({ pct, c, h = 100 }) {
  return (
    <div style={{ flex: 1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', height: h }}>
      <div style={{ width:'70%', height: pct+'%', background: `linear-gradient(180deg, ${c}cc, ${c})`, borderRadius:'5px 5px 0 0', minHeight: 4 }} />
    </div>
  );
}

function MStatistics({ theme }) {
  const months = ['E','F','M','A','M','J','J','A','S','O','N','D'];
  const data = [60, 70, 55, 80, 92, 85, 78, 88, 95, 90, 83, 75];
  return (
    <div style={{ width:'100%', height:'100%', background: theme.subtle, color: theme.text, display:'flex', flexDirection:'column' }}>
      <_Header theme={theme} title="Estadísticas" sub="Tu actividad en 2026" />
      <div className="tn-noscroll" style={{ flex: 1, overflowY:'auto', padding:'14px 16px 32px' }}>
        {/* Hero KPI */}
        <div style={{ padding: 20, borderRadius: 18, background:`linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, color:'#fff', position:'relative', overflow:'hidden' }}>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: .9, letterSpacing:'0.08em', textTransform:'uppercase' }}>Total este año</div>
          <div className="tn-h" style={{ fontSize: 44, fontWeight: 800, lineHeight: 1, marginTop: 8 }}>1,248h</div>
          <div style={{ fontSize: 12.5, opacity: .92, marginTop: 4 }}>156 turnos · +12% vs 2025</div>
          <div style={{ marginTop: 14, display:'flex', alignItems:'flex-end', gap: 4, height: 70 }}>
            {data.map((v,i)=>(<_Bar key={i} pct={v} c={'rgba(255,255,255,.6)'} h={70} />))}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop: 4, fontSize: 9.5, opacity: .8, fontWeight: 600 }}>
            {months.map((m,i)=>(<span key={i}>{m}</span>))}
          </div>
        </div>

        {/* By type */}
        <div style={{ marginTop: 16, padding: 16, borderRadius: 16, background: theme.bg, border:`1px solid ${theme.border}` }}>
          <div className="tn-h" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Por tipo de turno</div>
          {[
            { l:'Diurno', h:'620h', pct: 50, c:'#14B8A6' },
            { l:'Nocturno', h:'380h', pct: 30, c:'#7C3AED' },
            { l:'Refuerzo', h:'180h', pct: 14, c:'#0EA5E9' },
            { l:'Vacaciones', h:'68h', pct: 6, c:'#F59E0B' },
          ].map((r,i)=>(
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize: 12.5, marginBottom: 4 }}>
                <span style={{ display:'flex', alignItems:'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: r.c }} />{r.l}</span>
                <span style={{ color: theme.muted }}>{r.h} · {r.pct}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: theme.subtle, overflow:'hidden' }}>
                <div style={{ width: r.pct+'%', height:'100%', background: r.c }} />
              </div>
            </div>
          ))}
        </div>

        {/* Comparativa */}
        <div style={{ marginTop: 16, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          {[
            { l:'Asistencia', v:'94%', s:'+2 vs equipo', c: theme.green },
            { l:'Swaps aceptados', v:'12', s:'92% éxito', c: theme.primary },
            { l:'Horas extra', v:'42h', s:'este trimestre', c: theme.amber },
            { l:'Disponibilidad', v:'82%', s:'top 25%', c: theme.blue },
          ].map((s,i)=>(
            <div key={i} style={{ padding: 14, borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}` }}>
              <div style={{ fontSize: 11, color: theme.muted, fontWeight: 600 }}>{s.l}</div>
              <div className="tn-h" style={{ fontSize: 22, fontWeight: 800, marginTop: 4, color: s.c, letterSpacing:'-0.02em' }}>{s.v}</div>
              <div style={{ fontSize: 10.5, color: theme.muted, marginTop: 2 }}>{s.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────── ADMIN: Members (desktop) ───────────

function _AdminShell({ theme, title, sub, active, children, breadcrumbs, headerRight }) {
  // Reuse DSidebar from desktop.jsx via window-exposed escape: skip — reimplement minimal sidebar inline
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', background: theme.subtle, color: theme.text }}>
      <_AdminSidebar theme={theme} active={active} />
      <div style={{ flex: 1, display:'flex', flexDirection:'column', minWidth: 0 }}>
        <div style={{ height: 64, padding:'0 28px', borderBottom:`1px solid ${theme.border}`, background: theme.bg, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            {breadcrumbs ? <div style={{ fontSize: 11.5, color: theme.muted, marginBottom: 2, display:'flex', alignItems:'center', gap: 6 }}>{breadcrumbs}</div> : null}
            <div className="tn-h" style={{ fontSize: 19, fontWeight: 700, letterSpacing:'-0.02em' }}>{title}</div>
            {sub ? <div style={{ fontSize: 12, color: theme.muted, marginTop: 1 }}>{sub}</div> : null}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap: 12 }}>{headerRight}</div>
        </div>
        <div style={{ flex: 1, padding: 24, overflow:'hidden' }}>{children}</div>
      </div>
    </div>
  );
}

function _AdminSidebar({ theme, active }) {
  const sections = [
    { t:'Operación', items:[
      { k:'cal', l:'Calendario', i:<Icons.calendar size={18} /> },
      { k:'requests', l:'Solicitudes', i:<Icons.swap size={18} />, badge: 7 },
    ]},
    { t:'Administración', items:[
      { k:'members', l:'Miembros', i:<Icons.users size={18} /> },
      { k:'teams', l:'Equipos', i:<Icons.briefcase size={18} /> },
      { k:'shift-types', l:'Tipos de turno', i:<Icons.cal2 size={18} /> },
      { k:'positions', l:'Puestos', i:<Icons.stethoscope size={18} /> },
      { k:'orgs', l:'Organizaciones', i:<Icons.building size={18} /> },
      { k:'audit', l:'Auditoría', i:<Icons.history size={18} /> },
      { k:'exports', l:'Exportar', i:<Icons.download size={18} /> },
      { k:'reports', l:'Reportes', i:<Icons.trend size={18} /> },
    ]},
  ];
  return (
    <div style={{ width: 232, flexShrink: 0, background: theme.bg, borderRight:`1px solid ${theme.border}`, padding:'20px 12px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', gap: 10, padding:'0 8px 18px' }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background:`linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width: 13, height: 13, position:'relative' }}><div style={{ position:'absolute', left: 4.5, top: 0, width: 4, height: 13, background:'#fff', borderRadius: 1.5 }} /><div style={{ position:'absolute', left: 0, top: 4.5, width: 13, height: 4, background:'#fff', borderRadius: 1.5 }} /></div>
        </div>
        <div className="tn-h" style={{ fontSize: 16, fontWeight: 800 }}>Turnia <span style={{ fontSize: 10, padding:'2px 6px', borderRadius: 6, background: theme.primary+'22', color: theme.primary, marginLeft: 4, fontWeight: 700 }}>ADMIN</span></div>
      </div>
      {sections.map((s,si)=>(
        <div key={si} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10.5, color: theme.muted, fontWeight: 700, letterSpacing:'0.08em', textTransform:'uppercase', padding:'4px 10px' }}>{s.t}</div>
          {s.items.map(it=>{
            const a = it.k===active;
            return (
              <div key={it.k} style={{ margin:'1px 0', padding:'8px 10px', borderRadius: 8, display:'flex', alignItems:'center', gap: 10, background: a?theme.primary+'14':'transparent', color: a?theme.primary:theme.textSec, fontSize: 13, fontWeight: a?600:500 }}>
                {it.i}<span style={{ flex: 1 }}>{it.l}</span>
                {it.badge?<span style={{ background: theme.primary, color:'#fff', fontSize: 10, fontWeight: 700, padding:'1px 6px', borderRadius: 999 }}>{it.badge}</span>:null}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function DAdminMembers({ theme }) {
  const rows = [
    { n:'Dra. Ana Morales', e:'ana.morales@hospitalsj.org', role:'Staff', team:'Cardiología', pos:'Médico adjunto', status:'active', i:'AM', c:'#14B8A6' },
    { n:'Dr. Carlos Rodríguez', e:'c.rodriguez@hospitalsj.org', role:'Staff', team:'Cardiología', pos:'Médico adjunto', status:'active', i:'CR', c:'#0EA5E9' },
    { n:'Dra. Lucía Pereira', e:'l.pereira@hospitalsj.org', role:'Manager', team:'UCI', pos:'Jefa de servicio', status:'active', i:'LP', c:'#8B5CF6' },
    { n:'Dr. Diego Méndez', e:'d.mendez@hospitalsj.org', role:'Staff', team:'Urgencias', pos:'Residente R3', status:'active', i:'DM', c:'#F97316' },
    { n:'Dra. Sara Torres', e:'s.torres@hospitalsj.org', role:'Staff', team:'Pediatría', pos:'Médico adjunto', status:'invited', i:'ST', c:'#F59E0B' },
    { n:'Dr. Pedro Vázquez', e:'p.vazquez@hospitalsj.org', role:'Staff', team:'Anestesia', pos:'Médico adjunto', status:'active', i:'PV', c:'#A78BFA' },
    { n:'Dra. María Reyes', e:'m.reyes@hospitalsj.org', role:'Admin', team:'—', pos:'Org admin', status:'active', i:'MR', c:'#EF4444' },
    { n:'Dr. Javier Soto', e:'j.soto@hospitalsj.org', role:'Viewer', team:'Calidad', pos:'Auditor', status:'inactive', i:'JS', c:'#64748B' },
  ];
  const roleColor = (r) => r==='Admin'?theme.red:r==='Manager'?theme.violet:r==='Viewer'?theme.muted:theme.primary;
  const statusOf = (s) => s==='active'?{c:theme.green,l:'Activo'}:s==='invited'?{c:theme.amber,l:'Invitado'}:{c:theme.muted,l:'Inactivo'};

  return (
    <_AdminShell theme={theme} title="Miembros" sub="24 miembros · 6 equipos" active="members" breadcrumbs={<><span>Administración</span><Icons.chevronR size={11} /><span>Miembros</span></>} headerRight={
      <>
        <div style={{ display:'flex', alignItems:'center', gap: 8, height: 36, padding:'0 12px', borderRadius: 10, background: theme.subtle, border:`1px solid ${theme.border}`, color: theme.muted, minWidth: 240 }}><Icons.search size={15} /><span style={{ fontSize: 12.5 }}>Buscar miembros…</span></div>
        <button style={{ height: 36, padding:'0 14px', borderRadius: 10, background: theme.primary, color:'#fff', fontWeight: 600, fontSize: 13, border:'none', display:'flex', alignItems:'center', gap: 6 }}><Icons.plus size={15} stroke={2.6} /> Invitar</button>
      </>
    }>
      <div style={{ display:'flex', flexDirection:'column', gap: 14, height:'100%', minHeight: 0 }}>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: 10 }}>
          {[
            { l:'Total miembros', v:'24', i:<Icons.users size={16} />, c: theme.primary },
            { l:'Activos', v:'21', i:<Icons.check size={16} stroke={2.4} />, c: theme.green },
            { l:'Invitaciones pendientes', v:'2', i:<Icons.mail size={16} />, c: theme.amber },
            { l:'Inactivos', v:'1', i:<Icons.user size={16} />, c: theme.muted },
          ].map((s,i)=>(
            <div key={i} style={{ padding: 14, borderRadius: 12, background: theme.bg, border:`1px solid ${theme.border}` }}>
              <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: s.c+'18', color: s.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{s.i}</div>
                <span style={{ fontSize: 11.5, color: theme.muted, fontWeight: 500 }}>{s.l}</span>
              </div>
              <div className="tn-h" style={{ fontSize: 24, fontWeight: 800, marginTop: 6, letterSpacing:'-0.02em' }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap: 8, alignItems:'center' }}>
          <div style={{ display:'flex', background: theme.bg, border:`1px solid ${theme.border}`, borderRadius: 10, padding: 3 }}>
            {['Todos','Staff','Manager','Admin','Viewer'].map((t,i)=>(
              <span key={i} style={{ padding:'6px 12px', fontSize: 12, fontWeight: 600, borderRadius: 7, background: i===0?theme.primary+'14':'transparent', color: i===0?theme.primary:theme.textSec }}>{t}</span>
            ))}
          </div>
          <div style={{ height: 34, padding:'0 12px', borderRadius: 10, background: theme.bg, border:`1px solid ${theme.border}`, fontSize: 12.5, color: theme.textSec, display:'flex', alignItems:'center', gap: 6 }}><Icons.filter size={13} /> Equipo: Todos <Icons.chevronD size={13} /></div>
          <div style={{ height: 34, padding:'0 12px', borderRadius: 10, background: theme.bg, border:`1px solid ${theme.border}`, fontSize: 12.5, color: theme.textSec, display:'flex', alignItems:'center', gap: 6 }}>Estado: Activos <Icons.chevronD size={13} /></div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}`, overflow:'hidden', display:'flex', flexDirection:'column' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 1fr 0.8fr 60px', padding:'12px 18px', borderBottom:`1px solid ${theme.border}`, fontSize: 11, color: theme.muted, fontWeight: 700, letterSpacing:'0.05em', textTransform:'uppercase' }}>
            <span>Miembro</span><span>Rol</span><span>Equipo</span><span>Puesto</span><span>Estado</span><span></span>
          </div>
          <div className="tn-noscroll" style={{ flex: 1, overflowY:'auto' }}>
            {rows.map((r,i)=>{
              const st = statusOf(r.status);
              return (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 1fr 0.8fr 60px', padding:'14px 18px', borderBottom: i<rows.length-1?`1px solid ${theme.border}`:'none', alignItems:'center', fontSize: 13 }}>
                  <div style={{ display:'flex', alignItems:'center', gap: 12, minWidth: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 999, background: r.c+'24', color: r.c, fontWeight: 700, fontSize: 12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>{r.i}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.n}</div>
                      <div style={{ fontSize: 11, color: theme.muted, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.e}</div>
                    </div>
                  </div>
                  <div><_Pill theme={theme} color={roleColor(r.role)}>{r.role}</_Pill></div>
                  <div style={{ color: theme.textSec }}>{r.team}</div>
                  <div style={{ color: theme.textSec }}>{r.pos}</div>
                  <div><_Pill theme={theme} color={st.c} dot>{st.l}</_Pill></div>
                  <div style={{ color: theme.muted }}><Icons.more size={16} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </_AdminShell>
  );
}

// ─────────── ADMIN: Teams (desktop) ───────────

function DAdminTeams({ theme }) {
  const teams = [
    { n:'Cardiología', mgr:'Dra. Pereira', members: 6, color:'#14B8A6', shifts: 142, coverage: 92 },
    { n:'UCI', mgr:'Dra. Pereira', members: 5, color:'#7C3AED', shifts: 168, coverage: 87 },
    { n:'Urgencias', mgr:'Dr. Méndez', members: 7, color:'#F97316', shifts: 224, coverage: 78 },
    { n:'Pediatría', mgr:'Dra. Torres', members: 3, color:'#0EA5E9', shifts: 86, coverage: 95 },
    { n:'Anestesia', mgr:'Dr. Vázquez', members: 2, color:'#A78BFA', shifts: 64, coverage: 68 },
    { n:'Quirófano', mgr:'Sin asignar', members: 1, color:'#F59E0B', shifts: 32, coverage: 42 },
  ];
  return (
    <_AdminShell theme={theme} title="Equipos" sub="6 equipos · 24 miembros" active="teams" breadcrumbs={<><span>Administración</span><Icons.chevronR size={11} /><span>Equipos</span></>} headerRight={
      <button style={{ height: 36, padding:'0 14px', borderRadius: 10, background: theme.primary, color:'#fff', fontWeight: 600, fontSize: 13, border:'none', display:'flex', alignItems:'center', gap: 6 }}><Icons.plus size={15} stroke={2.6} /> Nuevo equipo</button>
    }>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 14 }}>
        {teams.map((t,i)=>(
          <div key={i} style={{ padding: 18, borderRadius: 16, background: theme.bg, border:`1px solid ${theme.border}`, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', left: 0, top: 0, bottom: 0, width: 4, background: t.color }} />
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: t.color+'1A', color: t.color, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.briefcase size={17} /></div>
                <div>
                  <div className="tn-h" style={{ fontSize: 16, fontWeight: 700 }}>{t.n}</div>
                  <div style={{ fontSize: 11.5, color: theme.muted, marginTop: 1 }}>{t.mgr}</div>
                </div>
              </div>
              <Icons.more size={16} style={{ color: theme.muted }} />
            </div>
            <div style={{ marginTop: 14, display:'flex', gap: 16 }}>
              <div><div style={{ fontSize: 10.5, color: theme.muted, fontWeight: 600 }}>MIEMBROS</div><div className="tn-h" style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>{t.members}</div></div>
              <div><div style={{ fontSize: 10.5, color: theme.muted, fontWeight: 600 }}>TURNOS / MES</div><div className="tn-h" style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>{t.shifts}</div></div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11, marginBottom: 4 }}>
                <span style={{ color: theme.muted, fontWeight: 600 }}>Cobertura</span>
                <span style={{ color: t.coverage>=85?theme.green:t.coverage>=70?theme.amber:theme.red, fontWeight: 700 }}>{t.coverage}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: theme.subtle, overflow:'hidden' }}>
                <div style={{ width: t.coverage+'%', height:'100%', background: t.coverage>=85?theme.green:t.coverage>=70?theme.amber:theme.red }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </_AdminShell>
  );
}

// ─────────── ADMIN: Shift Types (desktop) ───────────

function DAdminShiftTypes({ theme }) {
  const types = [
    { l:'D', n:'Diurno', from:'08:00', to:'18:00', dur:'10h', c:'#14B8A6', count: 142, paid: true },
    { l:'N', n:'Nocturno', from:'22:00', to:'08:00', dur:'10h', c:'#7C3AED', count: 96, paid: true, premium: true },
    { l:'R', n:'Refuerzo tarde', from:'14:00', to:'22:00', dur:'8h', c:'#0EA5E9', count: 48, paid: true },
    { l:'V', n:'Vacaciones', from:'—', to:'—', dur:'24h', c:'#F59E0B', count: 28, paid: false },
    { l:'C', n:'Capacitación', from:'09:00', to:'13:00', dur:'4h', c:'#10B981', count: 14, paid: true },
    { l:'L', n:'Libre', from:'—', to:'—', dur:'24h', c:'#94A3B8', count: 42, paid: false },
  ];
  return (
    <_AdminShell theme={theme} title="Tipos de turno" sub="6 tipos configurados · Cardiología" active="shift-types" breadcrumbs={<><span>Administración</span><Icons.chevronR size={11} /><span>Tipos de turno</span></>} headerRight={
      <button style={{ height: 36, padding:'0 14px', borderRadius: 10, background: theme.primary, color:'#fff', fontWeight: 600, fontSize: 13, border:'none', display:'flex', alignItems:'center', gap: 6 }}><Icons.plus size={15} stroke={2.6} /> Nuevo tipo</button>
    }>
      <div style={{ display:'flex', gap: 16, height:'100%', minHeight: 0 }}>
        <div style={{ flex: 1, display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 12, alignContent:'flex-start' }}>
          {types.map((t,i)=>(
            <div key={i} style={{ padding: 16, borderRadius: 14, background: theme.bg, border: i===0?`1.5px solid ${t.c}55`:`1px solid ${theme.border}`, position:'relative' }}>
              <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: t.c+'24', color: t.c, fontWeight: 800, fontSize: 22, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter Tight',sans-serif" }}>{t.l}</div>
                <div style={{ flex: 1 }}>
                  <div className="tn-h" style={{ fontSize: 15, fontWeight: 700 }}>{t.n}</div>
                  <div style={{ fontSize: 11.5, color: theme.muted, marginTop: 2 }}>{t.from} — {t.to} · {t.dur}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap: 5, flexWrap:'wrap', marginTop: 12 }}>
                {t.paid ? <_Pill theme={theme} color={theme.green}>Remunerado</_Pill> : <_Pill theme={theme} color={theme.muted}>No remunerado</_Pill>}
                {t.premium ? <_Pill theme={theme} color={theme.violet}>Plus 25%</_Pill> : null}
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop:`1px solid ${theme.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize: 11.5, color: theme.muted }}>Programados este mes</span>
                <span className="tn-h" style={{ fontSize: 18, fontWeight: 800, color: t.c }}>{t.count}</span>
              </div>
            </div>
          ))}
          {/* Add card */}
          <div style={{ padding: 16, borderRadius: 14, border: `1.5px dashed ${theme.border}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight: 180, color: theme.muted, gap: 6 }}>
            <Icons.plus size={20} stroke={2} />
            <span style={{ fontSize: 12.5, fontWeight: 500 }}>Crear tipo</span>
          </div>
        </div>

        {/* Editor preview */}
        <div style={{ width: 340, flexShrink: 0, borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}`, padding: 18, display:'flex', flexDirection:'column' }}>
          <div className="tn-h" style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Editar · Diurno</div>
          <div style={{ fontSize: 11.5, color: theme.muted, marginBottom: 16 }}>Configura el turno seleccionado</div>
          <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
            <_Field theme={theme} label="Nombre" value="Diurno" />
            <div style={{ display:'flex', gap: 10 }}>
              <div style={{ flex: 1 }}><_Field theme={theme} label="Inicio" value="08:00" /></div>
              <div style={{ flex: 1 }}><_Field theme={theme} label="Fin" value="18:00" /></div>
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: theme.textSec, marginBottom: 6 }}>Color</div>
              <div style={{ display:'flex', gap: 8 }}>
                {['#14B8A6','#7C3AED','#0EA5E9','#F59E0B','#10B981','#F43F5E'].map((c,i)=>(
                  <div key={i} style={{ width: 32, height: 32, borderRadius: 999, background: c, border: i===0?`3px solid ${theme.bg}`:'none', boxShadow: i===0?`0 0 0 2px ${c}`:'none' }} />
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: theme.textSec, marginBottom: 6 }}>Letra (icono)</div>
              <div style={{ width: 50, height: 50, borderRadius: 12, background:'#14B8A624', color:'#14B8A6', fontWeight: 800, fontSize: 22, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter Tight',sans-serif" }}>D</div>
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <button style={{ marginTop: 16, height: 42, borderRadius: 10, background: theme.primary, color:'#fff', fontWeight: 700, fontSize: 13, border:'none' }}>Guardar cambios</button>
        </div>
      </div>
    </_AdminShell>
  );
}

window.X = { MForgotPassword, MResetPassword, MSignup, MInvite, MActiveNow, MDailySchedule, MTransactions, MStatistics, DAdminMembers, DAdminTeams, DAdminShiftTypes };
