/* Tanda 3: pantallas finales que faltan */

const { Icons } = window;

function _Pill3({ children, color, theme, dot, soft }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap: 6, padding:'3px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: soft ? color + '18' : color + '20', color }}>
      {dot ? <span style={{ width: 6, height: 6, borderRadius: 999, background:'currentColor' }} /> : null}
      {children}
    </span>
  );
}

// Manager · Disponibilidad del equipo (vista heatmap)
function DManagerAvailability({ theme }) {
  const peeps = [
    { n:'Carlos R.', c:'#0EA5E9', i:'CR' },
    { n:'Lucía P.', c:'#8B5CF6', i:'LP' },
    { n:'Diego M.', c:'#F97316', i:'DM' },
    { n:'Sara T.', c:'#F59E0B', i:'ST' },
    { n:'Pedro V.', c:'#A78BFA', i:'PV' },
    { n:'Ana M.', c:'#14B8A6', i:'AM' },
  ];
  const days = ['L 12','M 13','X 14','J 15','V 16','S 17','D 18'];
  // 0=disponible, 1=preferido, 2=no disponible, 3=vacaciones
  const matrix = [
    [1,0,0,0,0,2,2],
    [0,0,1,1,0,0,3],
    [0,0,0,2,2,0,0],
    [3,3,0,0,0,0,0],
    [0,1,0,0,1,0,0],
    [0,0,0,1,1,2,0],
  ];
  const colorOf = (v) => v===1?theme.green:v===2?theme.red:v===3?theme.amber:theme.subtle;
  const labelOf = (v) => v===1?'Preferido':v===2?'No disp.':v===3?'Vacaciones':'Disponible';
  return (
    <div style={{ width:'100%', height:'100%', background: theme.subtle, color: theme.text, padding: 24, overflow:'auto' }} className="tn-noscroll">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11.5, color: theme.muted, marginBottom: 2 }}>Manager · Cardiología</div>
          <div className="tn-h" style={{ fontSize: 22, fontWeight: 700, letterSpacing:'-0.02em' }}>Disponibilidad del equipo</div>
          <div style={{ fontSize: 12.5, color: theme.muted, marginTop: 3 }}>Semana 20 · 12 — 18 mayo</div>
        </div>
        <div style={{ display:'flex', gap: 16, fontSize: 11.5, alignItems:'center' }}>
          {[{c:theme.green,l:'Preferido'},{c:theme.subtle,l:'Disponible'},{c:theme.red,l:'No disponible'},{c:theme.amber,l:'Vacaciones'}].map((r,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 6, color: theme.textSec }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: r.c, border: r.c===theme.subtle?`1px solid ${theme.border}`:'none' }} /> {r.l}
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}`, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'200px repeat(7, 1fr)', borderBottom:`1px solid ${theme.border}`, background: theme.subtle }}>
          <div style={{ padding:'12px 18px', fontSize: 11, color: theme.muted, fontWeight: 700, letterSpacing:'.05em', textTransform:'uppercase' }}>Miembro</div>
          {days.map((d,i)=>(<div key={i} style={{ padding:'12px 0', textAlign:'center', fontSize: 11, color: theme.muted, fontWeight: 700, letterSpacing:'.05em', textTransform:'uppercase' }}>{d}</div>))}
        </div>
        {peeps.map((p,i)=>(
          <div key={i} style={{ display:'grid', gridTemplateColumns:'200px repeat(7, 1fr)', alignItems:'center', borderBottom: i<peeps.length-1?`1px solid ${theme.border}`:'none' }}>
            <div style={{ padding:'12px 18px', display:'flex', alignItems:'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 999, background: p.c+'24', color: p.c, fontWeight: 700, fontSize: 11, display:'flex', alignItems:'center', justifyContent:'center' }}>{p.i}</div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{p.n}</span>
            </div>
            {matrix[i].map((v,j)=>(
              <div key={j} style={{ padding: 6 }}>
                <div title={labelOf(v)} style={{ height: 44, borderRadius: 8, background: colorOf(v) + (v===0?'':'CC'), border: v===0?`1px solid ${theme.border}`:'none', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 10.5, color: v===0?theme.muted:'#fff', fontWeight: 700 }}>
                  {v===1?'★':v===2?'×':v===3?'V':''}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: theme.bg, border:`1px solid ${theme.border}`, display:'flex', alignItems:'center', gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: theme.amber+'18', color: theme.amber, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.alert size={18} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>2 huecos sin cobertura</div>
          <div style={{ fontSize: 11.5, color: theme.muted, marginTop: 2 }}>Jueves 15 (turno N) y Sábado 17 (turno D) · todos los staff marcados como no disponibles</div>
        </div>
        <button style={{ height: 36, padding:'0 14px', borderRadius: 8, background: theme.primary, color:'#fff', fontWeight: 600, fontSize: 12.5, border:'none' }}>Resolver</button>
      </div>
    </div>
  );
}

// Manager · Shifts (gestión de turnos en lista)
function DManagerShifts({ theme }) {
  const rows = [
    { d:'Hoy · 14 may', items:[
      { tipo:'D', c:'#14B8A6', from:'08:00', to:'18:00', who:'Carlos R.', wc:'#0EA5E9', wi:'CR', loc:'Planta 4', status:'asignado' },
      { tipo:'N', c:'#7C3AED', from:'22:00', to:'08:00', who:'Sin asignar', wc:'#94A3B8', wi:'?', loc:'Planta 4', status:'abierto' },
      { tipo:'R', c:'#0EA5E9', from:'14:00', to:'22:00', who:'Pedro V.', wc:'#A78BFA', wi:'PV', loc:'Planta 4', status:'asignado' },
    ]},
    { d:'Mañana · 15 may', items:[
      { tipo:'D', c:'#14B8A6', from:'08:00', to:'18:00', who:'Ana M.', wc:'#14B8A6', wi:'AM', loc:'Planta 4', status:'asignado' },
      { tipo:'N', c:'#7C3AED', from:'22:00', to:'08:00', who:'Lucía P.', wc:'#8B5CF6', wi:'LP', loc:'Planta 4', status:'pendiente' },
    ]},
    { d:'Vie 16 may', items:[
      { tipo:'D', c:'#14B8A6', from:'08:00', to:'18:00', who:'Sara T.', wc:'#F59E0B', wi:'ST', loc:'Planta 4', status:'asignado' },
      { tipo:'R', c:'#0EA5E9', from:'14:00', to:'22:00', who:'Sin asignar', wc:'#94A3B8', wi:'?', loc:'Planta 4', status:'abierto' },
    ]},
  ];
  const sc = (s) => s==='asignado'?theme.green:s==='pendiente'?theme.amber:theme.red;
  return (
    <div style={{ width:'100%', height:'100%', background: theme.subtle, color: theme.text, padding: 24, overflow:'auto' }} className="tn-noscroll">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11.5, color: theme.muted, marginBottom: 2 }}>Manager · Cardiología</div>
          <div className="tn-h" style={{ fontSize: 22, fontWeight: 700, letterSpacing:'-0.02em' }}>Gestión de turnos</div>
        </div>
        <div style={{ display:'flex', gap: 8 }}>
          <button style={{ height: 36, padding:'0 14px', borderRadius: 10, background: theme.bg, border:`1px solid ${theme.border}`, color: theme.text, fontWeight: 600, fontSize: 13, display:'flex', alignItems:'center', gap: 6 }}><Icons.copy size={14} /> Duplicar semana</button>
          <button style={{ height: 36, padding:'0 14px', borderRadius: 10, background: theme.primary, color:'#fff', fontWeight: 600, fontSize: 13, border:'none', display:'flex', alignItems:'center', gap: 6 }}><Icons.plus size={15} stroke={2.6} /> Crear turno</button>
        </div>
      </div>
      <div style={{ display:'flex', gap: 8, marginBottom: 14 }}>
        {[{l:'Esta semana',a:true},{l:'Próxima semana'},{l:'Sin asignar',n:5},{l:'Pendientes',n:3}].map((t,i)=>(
          <div key={i} style={{ padding:'7px 12px', borderRadius: 999, background: t.a?theme.text:theme.bg, color: t.a?theme.bg:theme.textSec, fontSize: 12, fontWeight: 600, border: t.a?'none':`1px solid ${theme.border}`, display:'flex', alignItems:'center', gap: 6 }}>{t.l}{t.n?<span style={{ fontSize: 10, opacity:.7 }}>{t.n}</span>:null}</div>
        ))}
      </div>
      {rows.map((g,gi)=>(
        <div key={gi} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: theme.muted, fontWeight: 700, letterSpacing:'.06em', textTransform:'uppercase', padding:'6px 4px 8px' }}>{g.d}</div>
          <div style={{ borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}`, overflow:'hidden' }}>
            {g.items.map((it,i)=>(
              <div key={i} style={{ padding:'14px 18px', display:'grid', gridTemplateColumns:'60px 1fr 200px 1fr 100px 60px', alignItems:'center', gap: 14, borderBottom: i<g.items.length-1?`1px solid ${theme.border}`:'none' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: it.c+'24', color: it.c, fontWeight: 800, fontSize: 18, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter Tight',sans-serif" }}>{it.tipo}</div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{it.from} — {it.to}</div>
                  <div style={{ fontSize: 11.5, color: theme.muted }}><Icons.pin size={11} /> {it.loc}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 999, background: it.wc+'24', color: it.wc, fontWeight: 700, fontSize: 11, display:'flex', alignItems:'center', justifyContent:'center' }}>{it.wi}</div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: it.who.includes('Sin')?theme.muted:theme.text }}>{it.who}</span>
                </div>
                <div></div>
                <_Pill3 theme={theme} color={sc(it.status)} dot soft>{it.status}</_Pill3>
                <div style={{ color: theme.muted, textAlign:'right' }}><Icons.more size={16} /></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Desktop · Transactions
function DTransactions({ theme }) {
  const rows = [
    { d:'Hoy · 14 may', items:[
      { who:'Carlos R.', wc:'#0EA5E9', wi:'CR', what:'pidió intercambio con Ana M.', when:'14:08', kind:'swap', status:'pending', shift:'Turno D · 16 may' },
      { who:'Lucía P.', wc:'#8B5CF6', wi:'LP', what:'cedió su turno', when:'12:30', kind:'give', status:'approved', shift:'Turno N · 17 may' },
      { who:'Sistema', wc:'#64748B', wi:'SY', what:'generó turnos automáticos', when:'09:00', kind:'system', status:'approved', shift:'14 turnos · sem 20' },
    ]},
    { d:'Ayer · 13 may', items:[
      { who:'Ana M.', wc:'#14B8A6', wi:'AM', what:'tomó turno abierto', when:'18:42', kind:'take', status:'approved', shift:'Refuerzo · 13 may' },
      { who:'Diego M.', wc:'#F97316', wi:'DM', what:'rechazó intercambio', when:'10:14', kind:'swap', status:'rejected', shift:'Solicitud #4821' },
      { who:'Pedro V.', wc:'#A78BFA', wi:'PV', what:'pidió cesión', when:'08:30', kind:'give', status:'approved', shift:'Turno R · 18 may' },
    ]},
  ];
  const ks = { swap: Icons.swap, give: Icons.giveaway, take: Icons.takeOpen, system: Icons.zap };
  const sc = (s) => s==='approved'?theme.green:s==='rejected'?theme.red:theme.amber;
  const sl = (s) => s==='approved'?'Aprobado':s==='rejected'?'Rechazado':'Pendiente';
  return (
    <div style={{ width:'100%', height:'100%', background: theme.subtle, color: theme.text, padding: 24, overflow:'auto' }} className="tn-noscroll">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11.5, color: theme.muted, marginBottom: 2 }}>Hospital San Juan · Cardiología</div>
          <div className="tn-h" style={{ fontSize: 22, fontWeight: 700, letterSpacing:'-0.02em' }}>Movimientos</div>
        </div>
        <div style={{ display:'flex', gap: 8 }}>
          <div style={{ height: 36, padding:'0 12px', borderRadius: 10, background: theme.bg, border:`1px solid ${theme.border}`, fontSize: 12.5, color: theme.textSec, display:'flex', alignItems:'center', gap: 6 }}><Icons.calendar size={13} /> Últimos 7 días</div>
          <button style={{ height: 36, padding:'0 14px', borderRadius: 10, background: theme.bg, border:`1px solid ${theme.border}`, color: theme.text, fontWeight: 600, fontSize: 13, display:'flex', alignItems:'center', gap: 6 }}><Icons.download size={15} /> Exportar</button>
        </div>
      </div>

      <div style={{ display:'flex', gap: 8, marginBottom: 14 }}>
        {[{l:'Todos',n:42,a:true},{l:'Swaps',n:18},{l:'Cesiones',n:14},{l:'Abiertos',n:10}].map((t,i)=>(
          <div key={i} style={{ padding:'7px 12px', borderRadius: 999, background: t.a?theme.text:theme.bg, color: t.a?theme.bg:theme.textSec, fontSize: 12, fontWeight: 600, border: t.a?'none':`1px solid ${theme.border}`, display:'flex', alignItems:'center', gap: 6 }}>{t.l}<span style={{ fontSize: 10, opacity:.7 }}>{t.n}</span></div>
        ))}
      </div>

      {rows.map((g,gi)=>(
        <div key={gi} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: theme.muted, fontWeight: 700, letterSpacing:'.06em', textTransform:'uppercase', padding:'6px 4px 8px' }}>{g.d}</div>
          <div style={{ borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}`, overflow:'hidden' }}>
            {g.items.map((it,i)=>{
              const Ic = ks[it.kind] || Icons.history;
              const sCol = sc(it.status);
              return (
                <div key={i} style={{ padding:'14px 18px', display:'grid', gridTemplateColumns:'40px 1.5fr 1fr 80px 110px', alignItems:'center', gap: 14, borderBottom: i<g.items.length-1?`1px solid ${theme.border}`:'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: sCol+'18', color: sCol, display:'flex', alignItems:'center', justifyContent:'center' }}><Ic size={17} /></div>
                  <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 999, background: it.wc+'24', color: it.wc, fontWeight: 700, fontSize: 10.5, display:'flex', alignItems:'center', justifyContent:'center' }}>{it.wi}</div>
                    <div style={{ fontSize: 13 }}><b>{it.who}</b> {it.what}</div>
                  </div>
                  <span style={{ fontSize: 12, color: theme.textSec, fontFamily:"'JetBrains Mono', ui-monospace, monospace" }}>{it.shift}</span>
                  <span style={{ fontSize: 11.5, color: theme.muted, fontVariantNumeric:'tabular-nums' }}>{it.when}</span>
                  <_Pill3 theme={theme} color={sCol} dot soft>{sl(it.status)}</_Pill3>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// Settings desktop with accent picker (replaces previous DAdminSettings appearance section)
function DAccentSettings({ theme }) {
  const accents = [
    { k:'teal', c:'#14B8A6', l:'Teal' },
    { k:'indigo', c:'#6366F1', l:'Indigo' },
    { k:'emerald', c:'#10B981', l:'Emerald' },
    { k:'rose', c:'#F43F5E', l:'Rose' },
  ];
  const current = (window.__tnTweaks && window.__tnTweaks.accent) || 'teal';
  const isDark = theme.mode === 'dark';
  const setAcc = (v) => window.tnSetTweaks && window.tnSetTweaks({ accent: v });
  const setMode = (v) => window.tnSetTweaks && window.tnSetTweaks({ darkMode: v });
  return (
    <div style={{ width:'100%', height:'100%', background: theme.subtle, color: theme.text, padding: 32, overflow:'auto' }} className="tn-noscroll">
      <div style={{ maxWidth: 880, margin:'0 auto' }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11.5, color: theme.muted, marginBottom: 4 }}>Mi cuenta</div>
          <div className="tn-h" style={{ fontSize: 28, fontWeight: 800, letterSpacing:'-0.025em' }}>Apariencia</div>
          <div style={{ fontSize: 13, color: theme.muted, marginTop: 4 }}>Personaliza la apariencia de Turnia. Los cambios se aplican en todos tus dispositivos.</div>
        </div>

        <div style={{ padding: 24, borderRadius: 16, background: theme.bg, border:`1px solid ${theme.border}`, marginBottom: 16 }}>
          <div className="tn-h" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Modo</div>
          <div style={{ fontSize: 12.5, color: theme.muted, marginBottom: 18 }}>Elige entre tema claro u oscuro.</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
            {[{k:false,l:'Claro',bg:'#FFFFFF',fg:'#0F1115',sub:'#F7F8F7'},{k:true,l:'Oscuro',bg:'#0E1116',fg:'#F2F4F7',sub:'#161A22'}].map((m,i)=>{
              const active = isDark === m.k;
              return (
                <div key={i} onClick={() => setMode(m.k)} style={{ cursor:'pointer', padding: 18, borderRadius: 14, background: m.bg, border:`2px solid ${active?theme.primary:theme.border}`, position:'relative' }}>
                  <div style={{ height: 60, borderRadius: 8, background: m.sub, marginBottom: 10, padding: 8, display:'flex', flexDirection:'column', gap: 4 }}>
                    <div style={{ height: 6, width:'40%', background: m.fg, opacity: .6, borderRadius: 2 }} />
                    <div style={{ height: 4, width:'70%', background: m.fg, opacity: .3, borderRadius: 2 }} />
                    <div style={{ height: 4, width:'55%', background: m.fg, opacity: .3, borderRadius: 2 }} />
                  </div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: m.fg }}>{m.l}</span>
                    {active ? <span style={{ width: 20, height: 20, borderRadius: 999, background: theme.primary, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.check size={11} stroke={3} style={{ color:'#fff' }} /></span> : <span style={{ width: 20, height: 20, borderRadius: 999, border:`2px solid ${m.fg}`, opacity: .3 }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: 24, borderRadius: 16, background: theme.bg, border:`1px solid ${theme.border}` }}>
          <div className="tn-h" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Color de acento</div>
          <div style={{ fontSize: 12.5, color: theme.muted, marginBottom: 18 }}>Color principal usado en botones, enlaces y elementos destacados.</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 12 }}>
            {accents.map((a) => {
              const active = a.k === current;
              return (
                <div key={a.k} onClick={() => setAcc(a.k)} style={{ cursor:'pointer', padding: 18, borderRadius: 14, background: active ? a.c + '0F' : theme.subtle, border: `2px solid ${active ? a.c : theme.border}`, display:'flex', flexDirection:'column', alignItems:'center', gap: 12 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 999, background: `linear-gradient(135deg, ${a.c}, ${a.c}cc)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow: active ? `0 8px 24px -6px ${a.c}` : 'none' }}>
                    {active ? <Icons.check size={24} stroke={3} style={{ color:'#fff' }} /> : null}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: active ? a.c : theme.text }}>{a.l}</div>
                  <div style={{ fontSize: 11, color: theme.muted, fontFamily:"'JetBrains Mono', ui-monospace, monospace" }}>{a.c}</div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 22, padding: 16, borderRadius: 12, background: theme.subtle, border:`1px solid ${theme.border}` }}>
            <div style={{ fontSize: 11, color: theme.muted, fontWeight: 700, letterSpacing:'.06em', textTransform:'uppercase', marginBottom: 10 }}>Vista previa</div>
            <div style={{ display:'flex', alignItems:'center', gap: 10, flexWrap:'wrap' }}>
              <button style={{ height: 38, padding:'0 16px', borderRadius: 10, background: theme.primary, color:'#fff', fontWeight: 600, fontSize: 13, border:'none' }}>Botón primario</button>
              <button style={{ height: 38, padding:'0 16px', borderRadius: 10, background:'transparent', color: theme.primary, fontWeight: 600, fontSize: 13, border:`1.5px solid ${theme.primary}` }}>Secundario</button>
              <_Pill3 theme={theme} color={theme.primary} dot>Activo</_Pill3>
              <a style={{ color: theme.primary, fontSize: 13, fontWeight: 600 }}>Enlace de ejemplo →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.X3 = { DManagerAvailability, DManagerShifts, DTransactions, DAccentSettings };
