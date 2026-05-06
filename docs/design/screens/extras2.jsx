/* Tanda 2: settings, audit, exports, reports, organizations, staff-positions, invite admin, viewer, permissions */

const { Icons } = window;

function _Pill2({ children, color, theme, dot, soft }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap: 6, padding:'3px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: soft ? color + '18' : color + '20', color }}>
      {dot ? <span style={{ width: 6, height: 6, borderRadius: 999, background:'currentColor' }} /> : null}
      {children}
    </span>
  );
}

function _AdminShell2({ theme, title, sub, active, children, breadcrumbs, headerRight }) {
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
      { k:'invite', l:'Invitaciones', i:<Icons.mail size={18} /> },
      { k:'audit', l:'Auditoría', i:<Icons.history size={18} /> },
      { k:'exports', l:'Exportar', i:<Icons.download size={18} /> },
      { k:'reports', l:'Reportes', i:<Icons.trend size={18} /> },
      { k:'settings', l:'Configuración', i:<Icons.settings size={18} /> },
    ]},
  ];
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', background: theme.subtle, color: theme.text }}>
      <div style={{ width: 232, flexShrink: 0, background: theme.bg, borderRight:`1px solid ${theme.border}`, padding:'20px 12px', display:'flex', flexDirection:'column', overflow:'auto' }} className="tn-noscroll">
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
      <div style={{ flex: 1, display:'flex', flexDirection:'column', minWidth: 0 }}>
        <div style={{ height: 64, padding:'0 28px', borderBottom:`1px solid ${theme.border}`, background: theme.bg, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            {breadcrumbs ? <div style={{ fontSize: 11.5, color: theme.muted, marginBottom: 2, display:'flex', alignItems:'center', gap: 6 }}>{breadcrumbs}</div> : null}
            <div className="tn-h" style={{ fontSize: 19, fontWeight: 700, letterSpacing:'-0.02em' }}>{title}</div>
            {sub ? <div style={{ fontSize: 12, color: theme.muted, marginTop: 1 }}>{sub}</div> : null}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap: 12 }}>{headerRight}</div>
        </div>
        <div style={{ flex: 1, padding: 24, overflow:'auto' }} className="tn-noscroll">{children}</div>
      </div>
    </div>
  );
}

// ─────── Settings ───────
function DAdminSettings({ theme }) {
  return (
    <_AdminShell2 theme={theme} title="Configuración" sub="Reglas y preferencias de Hospital San Juan" active="settings" breadcrumbs={<><span>Administración</span><Icons.chevronR size={11} /><span>Configuración</span></>}>
      <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', gap: 24, alignItems:'flex-start' }}>
        <div style={{ display:'flex', flexDirection:'column', gap: 4 }}>
          {['Organización','Reglas de turnos','Aprobaciones','Notificaciones','Integraciones','Seguridad','Facturación'].map((s,i)=>(
            <div key={i} style={{ padding:'9px 12px', borderRadius: 8, fontSize: 13, fontWeight: i===1?600:500, background: i===1?theme.primary+'14':'transparent', color: i===1?theme.primary:theme.textSec }}>{s}</div>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap: 14, maxWidth: 720 }}>
          <div style={{ padding: 20, borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}` }}>
            <div className="tn-h" style={{ fontSize: 15, fontWeight: 700 }}>Descanso mínimo entre turnos</div>
            <div style={{ fontSize: 12.5, color: theme.muted, marginTop: 4, marginBottom: 14 }}>Tiempo mínimo de descanso obligatorio entre dos turnos consecutivos del mismo miembro.</div>
            <div style={{ display:'flex', gap: 8 }}>
              {[8, 10, 12, 14, 16].map((h,i)=>(
                <div key={i} style={{ flex: 1, padding:'14px 0', textAlign:'center', borderRadius: 10, background: h===12?theme.primary:'transparent', border: h===12?'none':`1.5px solid ${theme.border}`, color: h===12?'#fff':theme.text, fontWeight: 700 }}>
                  <div className="tn-h" style={{ fontSize: 22, fontWeight: 800 }}>{h}h</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: 20, borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}` }}>
            <div className="tn-h" style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Horas máximas por semana</div>
            <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
              <div style={{ flex: 1, height: 8, borderRadius: 999, background: theme.subtle, position:'relative' }}>
                <div style={{ position:'absolute', left: 0, top: 0, bottom: 0, width: '60%', background: theme.primary, borderRadius: 999 }} />
                <div style={{ position:'absolute', left: '60%', top: -6, width: 20, height: 20, borderRadius: 999, background: theme.bg, border:`3px solid ${theme.primary}`, boxShadow:'0 2px 6px rgba(0,0,0,.15)' }} />
              </div>
              <div className="tn-h" style={{ fontSize: 24, fontWeight: 800, minWidth: 70, textAlign:'right' }}>48h</div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11, color: theme.muted, marginTop: 4 }}><span>20h</span><span>80h</span></div>
          </div>

          <div style={{ padding: 20, borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}` }}>
            <div className="tn-h" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Reglas activas</div>
            <div style={{ fontSize: 12.5, color: theme.muted, marginBottom: 14 }}>Validaciones automáticas al crear o asignar turnos.</div>
            {[
              { l:'No exceder horas semanales máximas', d:'Bloquea asignaciones que superen el límite', on: true },
              { l:'Validar descanso mínimo', d:'Avisa cuando hay menos de 12h entre turnos', on: true },
              { l:'Aprobar swaps automáticamente', d:'Si ambas partes aceptan, no requiere manager', on: false },
              { l:'Notificar al manager por email', d:'Cada nueva solicitud genera un email', on: true },
              { l:'Permitir auto-asignación de turnos abiertos', d:'Staff puede tomar turnos sin aprobación', on: false },
            ].map((r,i)=>(
              <div key={i} style={{ padding:'12px 0', borderBottom: i<4?`1px solid ${theme.border}`:'none', display:'flex', alignItems:'center', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.l}</div>
                  <div style={{ fontSize: 11.5, color: theme.muted, marginTop: 2 }}>{r.d}</div>
                </div>
                <div style={{ width: 38, height: 22, borderRadius: 999, background: r.on?theme.primary:theme.subtle2, padding: 2, display:'flex', justifyContent: r.on?'flex-end':'flex-start' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 999, background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </_AdminShell2>
  );
}

// ─────── Audit log ───────
function DAdminAudit({ theme }) {
  const events = [
    { t:'14:23', d:'Hoy', who:'Dra. Pereira', wc:'#8B5CF6', i:'LP', action:'aprobó solicitud de intercambio', target:'Carlos R. ↔ Ana M.', kind:'approve' },
    { t:'14:08', d:'Hoy', who:'Carlos R.', wc:'#0EA5E9', i:'CR', action:'creó solicitud de intercambio', target:'Turno D · 14 may', kind:'create' },
    { t:'13:42', d:'Hoy', who:'Dra. Reyes', wc:'#EF4444', i:'MR', action:'cambió rol de miembro', target:'Sara T. · Staff → Manager', kind:'edit' },
    { t:'12:30', d:'Hoy', who:'Lucía P.', wc:'#8B5CF6', i:'LP', action:'cedió turno', target:'Turno N · 14 may', kind:'create' },
    { t:'11:15', d:'Hoy', who:'Dra. Reyes', wc:'#EF4444', i:'MR', action:'invitó nuevo miembro', target:'l.fernandez@hospitalsj.org', kind:'create' },
    { t:'10:14', d:'Hoy', who:'Diego M.', wc:'#F97316', i:'DM', action:'rechazó intercambio', target:'Solicitud #4821', kind:'reject' },
    { t:'09:00', d:'Ayer', who:'Sistema', wc:'#64748B', i:'SY', action:'generó turnos automáticos', target:'14 turnos · semana 20', kind:'system' },
    { t:'18:45', d:'Ayer', who:'Dra. Reyes', wc:'#EF4444', i:'MR', action:'modificó configuración', target:'Descanso mínimo: 10h → 12h', kind:'edit' },
    { t:'14:30', d:'Ayer', who:'Pedro V.', wc:'#A78BFA', i:'PV', action:'tomó turno abierto', target:'Refuerzo · 13 may', kind:'create' },
  ];
  const colorOf = (k) => k==='approve'?theme.green:k==='reject'?theme.red:k==='create'?theme.blue:k==='edit'?theme.amber:theme.muted;
  const labelOf = (k) => k==='approve'?'Aprobado':k==='reject'?'Rechazado':k==='create'?'Creación':k==='edit'?'Edición':'Sistema';

  return (
    <_AdminShell2 theme={theme} title="Auditoría" sub="Registro de todos los cambios en la organización" active="audit" breadcrumbs={<><span>Administración</span><Icons.chevronR size={11} /><span>Auditoría</span></>} headerRight={
      <>
        <div style={{ display:'flex', alignItems:'center', gap: 8, height: 36, padding:'0 12px', borderRadius: 10, background: theme.subtle, border:`1px solid ${theme.border}`, color: theme.muted, minWidth: 220 }}><Icons.search size={15} /><span style={{ fontSize: 12.5 }}>Buscar acción, miembro…</span></div>
        <button style={{ height: 36, padding:'0 14px', borderRadius: 10, background: theme.bg, border:`1px solid ${theme.border}`, color: theme.text, fontWeight: 600, fontSize: 13, display:'flex', alignItems:'center', gap: 6 }}><Icons.download size={15} /> Exportar</button>
      </>
    }>
      <div style={{ display:'flex', gap: 8, marginBottom: 14, alignItems:'center', flexWrap:'wrap' }}>
        {[{l:'Todo',n:1248,a:true},{l:'Aprobaciones',n:312},{l:'Creaciones',n:608},{l:'Ediciones',n:218},{l:'Rechazos',n:84},{l:'Sistema',n:26}].map((t,i)=>(
          <div key={i} style={{ padding:'7px 12px', borderRadius: 999, background: t.a?theme.text:theme.bg, color: t.a?theme.bg:theme.textSec, fontSize: 12, fontWeight: 600, border: t.a?'none':`1px solid ${theme.border}`, display:'flex', alignItems:'center', gap: 6 }}>{t.l}<span style={{ fontSize: 10.5, opacity: .7 }}>{t.n}</span></div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ height: 32, padding:'0 12px', borderRadius: 999, background: theme.bg, border:`1px solid ${theme.border}`, fontSize: 12, color: theme.textSec, display:'flex', alignItems:'center', gap: 6 }}><Icons.calendar size={13} /> Últimos 7 días</div>
      </div>

      <div style={{ borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}`, overflow:'hidden' }}>
        {events.map((e,i)=>{
          const showDay = i===0 || events[i-1].d !== e.d;
          return (
            <React.Fragment key={i}>
              {showDay ? <div style={{ padding:'10px 18px', background: theme.subtle, fontSize: 11, color: theme.muted, fontWeight: 700, letterSpacing:'0.06em', textTransform:'uppercase', borderTop: i>0?`1px solid ${theme.border}`:'none', borderBottom:`1px solid ${theme.border}` }}>{e.d}</div> : null}
              <div style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap: 14, borderBottom: i<events.length-1?`1px solid ${theme.border}`:'none' }}>
                <div style={{ width: 60, fontSize: 12, color: theme.muted, fontWeight: 600, fontVariantNumeric:'tabular-nums' }}>{e.t}</div>
                <div style={{ width: 32, height: 32, borderRadius: 999, background: e.wc+'24', color: e.wc, fontWeight: 700, fontSize: 11, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>{e.i}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, lineHeight: 1.4 }}><b>{e.who}</b> {e.action} · <span style={{ color: theme.textSec, fontFamily:"'JetBrains Mono', ui-monospace, monospace", fontSize: 12 }}>{e.target}</span></div>
                </div>
                <_Pill2 theme={theme} color={colorOf(e.kind)} dot soft>{labelOf(e.kind)}</_Pill2>
                <Icons.more size={16} style={{ color: theme.muted }} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </_AdminShell2>
  );
}

// ─────── Exports ───────
function DAdminExports({ theme }) {
  const recent = [
    { n:'Turnos · Mayo 2026', kind:'CSV', size:'42 KB', when:'Hace 2 min', by:'Dra. Reyes', status:'ready' },
    { n:'Horas trabajadas · Q1 2026', kind:'XLSX', size:'128 KB', when:'Hace 1 h', by:'Dra. Reyes', status:'ready' },
    { n:'Audit log · Abr 2026', kind:'CSV', size:'318 KB', when:'Ayer', by:'Sistema', status:'ready' },
    { n:'Solicitudes · 2026', kind:'XLSX', size:'—', when:'Procesando…', by:'Dra. Pereira', status:'processing' },
  ];
  return (
    <_AdminShell2 theme={theme} title="Exportar datos" sub="Genera reportes para nómina, auditoría o análisis" active="exports" breadcrumbs={<><span>Administración</span><Icons.chevronR size={11} /><span>Exportar</span></>}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14, marginBottom: 18 }}>
        {[
          { t:'Turnos asignados', d:'Listado completo con tipo, hora, persona', i: <Icons.calendar size={20} />, c: theme.primary },
          { t:'Horas trabajadas', d:'Por persona, equipo o tipo de turno', i: <Icons.clock size={20} />, c: theme.violet },
          { t:'Solicitudes', d:'Swaps, cesiones, abiertos · con estado', i: <Icons.swap size={20} />, c: theme.blue },
          { t:'Audit log', d:'Todas las acciones en la organización', i: <Icons.history size={20} />, c: theme.amber },
          { t:'Disponibilidad', d:'Preferencias y bloqueos del equipo', i: <Icons.beach size={20} />, c: theme.green },
          { t:'Miembros y equipos', d:'Roster con roles, puestos, contratos', i: <Icons.users size={20} />, c: theme.red },
        ].map((c,i)=>(
          <div key={i} style={{ padding: 18, borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}`, display:'flex', alignItems:'flex-start', gap: 14, cursor:'pointer' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c.c+'1A', color: c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>{c.i}</div>
            <div style={{ flex: 1 }}>
              <div className="tn-h" style={{ fontSize: 14.5, fontWeight: 700 }}>{c.t}</div>
              <div style={{ fontSize: 12, color: theme.muted, marginTop: 3, lineHeight: 1.5 }}>{c.d}</div>
              <div style={{ display:'flex', gap: 6, marginTop: 10 }}>
                <span style={{ padding:'4px 8px', borderRadius: 6, background: theme.subtle, fontSize: 11, fontWeight: 700, color: theme.textSec }}>CSV</span>
                <span style={{ padding:'4px 8px', borderRadius: 6, background: theme.subtle, fontSize: 11, fontWeight: 700, color: theme.textSec }}>XLSX</span>
                <span style={{ padding:'4px 8px', borderRadius: 6, background: theme.subtle, fontSize: 11, fontWeight: 700, color: theme.textSec }}>PDF</span>
              </div>
            </div>
            <Icons.download size={17} style={{ color: theme.muted }} />
          </div>
        ))}
      </div>

      <div className="tn-h" style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Exportaciones recientes</div>
      <div style={{ borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}`, overflow:'hidden' }}>
        {recent.map((r,i)=>(
          <div key={i} style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap: 14, borderBottom: i<recent.length-1?`1px solid ${theme.border}`:'none' }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: theme.subtle, color: theme.textSec, fontWeight: 800, fontSize: 11, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter Tight',sans-serif" }}>{r.kind}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.n}</div>
              <div style={{ fontSize: 11.5, color: theme.muted, marginTop: 2 }}>{r.size} · por {r.by} · {r.when}</div>
            </div>
            {r.status === 'ready' ? (
              <button style={{ height: 32, padding:'0 14px', borderRadius: 8, background: theme.primary+'18', color: theme.primary, fontWeight: 600, fontSize: 12.5, border:'none', display:'flex', alignItems:'center', gap: 6 }}><Icons.download size={14} /> Descargar</button>
            ) : (
              <_Pill2 theme={theme} color={theme.amber} dot>Procesando</_Pill2>
            )}
          </div>
        ))}
      </div>
    </_AdminShell2>
  );
}

// ─────── Reports ───────
function DAdminReports({ theme }) {
  const months = ['Ene','Feb','Mar','Abr','May'];
  const data = [142, 168, 156, 184, 210];
  const max = Math.max(...data);
  return (
    <_AdminShell2 theme={theme} title="Reportes" sub="Insights del rendimiento del equipo · 2026" active="reports" breadcrumbs={<><span>Administración</span><Icons.chevronR size={11} /><span>Reportes</span></>} headerRight={
      <>
        <div style={{ height: 36, padding:'0 12px', borderRadius: 10, background: theme.bg, border:`1px solid ${theme.border}`, fontSize: 12.5, color: theme.textSec, display:'flex', alignItems:'center', gap: 6 }}>Periodo: 2026 <Icons.chevronD size={13} /></div>
        <button style={{ height: 36, padding:'0 14px', borderRadius: 10, background: theme.primary, color:'#fff', fontWeight: 600, fontSize: 13, border:'none', display:'flex', alignItems:'center', gap: 6 }}><Icons.download size={15} /> Exportar PDF</button>
      </>
    }>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { l:'Turnos cubiertos', v:'1,860', s:'+12% vs 2025', c: theme.primary, i:<Icons.check size={14} stroke={2.4} /> },
          { l:'Tasa swap aprobado', v:'87%', s:'+4 puntos', c: theme.green, i:<Icons.swap size={14} /> },
          { l:'Horas extra promedio', v:'8.2h', s:'-1.4h vs Q1', c: theme.amber, i:<Icons.clock size={14} /> },
          { l:'Cobertura urgencias', v:'94%', s:'2 huecos esta sem.', c: theme.red, i:<Icons.alert size={14} /> },
        ].map((s,i)=>(
          <div key={i} style={{ padding: 16, borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}` }}>
            <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: s.c+'1A', color: s.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{s.i}</div>
              <span style={{ fontSize: 11.5, color: theme.muted, fontWeight: 500 }}>{s.l}</span>
            </div>
            <div className="tn-h" style={{ fontSize: 28, fontWeight: 800, marginTop: 8, letterSpacing:'-0.025em' }}>{s.v}</div>
            <div style={{ fontSize: 11, color: s.c, fontWeight: 600, marginTop: 2 }}>{s.s}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap: 14 }}>
        <div style={{ padding: 20, borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}` }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 16 }}>
            <div>
              <div className="tn-h" style={{ fontSize: 14.5, fontWeight: 700 }}>Turnos por mes</div>
              <div style={{ fontSize: 11.5, color: theme.muted, marginTop: 2 }}>Tendencia 2026</div>
            </div>
            <div style={{ display:'flex', gap: 6 }}>
              {['Mes','Trimestre','Año'].map((t,i)=>(<div key={i} style={{ padding:'4px 10px', borderRadius: 6, background: i===0?theme.primary+'14':'transparent', color: i===0?theme.primary:theme.muted, fontSize: 11.5, fontWeight: 600 }}>{t}</div>))}
            </div>
          </div>
          <div style={{ height: 220, display:'flex', alignItems:'flex-end', gap: 16, paddingBottom: 24, borderBottom:`1px solid ${theme.border}`, position:'relative' }}>
            {data.map((v,i)=>{
              const h = (v/max)*180;
              return (
                <div key={i} style={{ flex: 1, display:'flex', flexDirection:'column', alignItems:'center', gap: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: theme.text }}>{v}</div>
                  <div style={{ width:'100%', height: h, background: `linear-gradient(180deg, ${theme.primary}, ${theme.primaryDark})`, borderRadius:'8px 8px 0 0', position:'relative' }}>
                    {i===4 ? <div style={{ position:'absolute', top: -32, right: -10, padding:'4px 8px', borderRadius: 6, background: theme.text, color: theme.bg, fontSize: 10.5, fontWeight: 700 }}>+14% vs Abr</div> : null}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display:'flex', justifyContent:'space-around', marginTop: 6 }}>
            {months.map((m,i)=>(<span key={i} style={{ fontSize: 11.5, color: theme.muted, fontWeight: 600 }}>{m}</span>))}
          </div>
        </div>

        <div style={{ padding: 20, borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}` }}>
          <div className="tn-h" style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 4 }}>Top equipos por horas</div>
          <div style={{ fontSize: 11.5, color: theme.muted, marginBottom: 16 }}>Mayo 2026</div>
          {[
            { n:'Urgencias', h: 1840, pct: 100, c:'#F97316' },
            { n:'UCI', h: 1620, pct: 88, c:'#7C3AED' },
            { n:'Cardiología', h: 1280, pct: 70, c:'#14B8A6' },
            { n:'Pediatría', h: 920, pct: 50, c:'#0EA5E9' },
            { n:'Anestesia', h: 540, pct: 29, c:'#A78BFA' },
            { n:'Quirófano', h: 320, pct: 17, c:'#F59E0B' },
          ].map((r,i)=>(
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{r.n}</span>
                <span style={{ color: theme.muted, fontVariantNumeric:'tabular-nums' }}>{r.h.toLocaleString()}h</span>
              </div>
              <div style={{ height: 7, borderRadius: 999, background: theme.subtle, overflow:'hidden' }}>
                <div style={{ width: r.pct+'%', height:'100%', background: r.c, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </_AdminShell2>
  );
}

// ─────── Organizations (superadmin) ───────
function DAdminOrgs({ theme }) {
  const orgs = [
    { n:'Hospital San Juan', loc:'Madrid · ES', members: 24, plan:'Pro', status:'active', c:'#0EA5E9', i:'SJ', shifts: 1860 },
    { n:'Clínica Norte', loc:'Barcelona · ES', members: 18, plan:'Pro', status:'active', c:'#14B8A6', i:'CN', shifts: 1240 },
    { n:'Centro Médico Sur', loc:'Sevilla · ES', members: 12, plan:'Starter', status:'active', c:'#F97316', i:'CS', shifts: 642 },
    { n:'Hospital del Valle', loc:'Valencia · ES', members: 32, plan:'Enterprise', status:'active', c:'#7C3AED', i:'HV', shifts: 2890 },
    { n:'Mediterránea', loc:'Málaga · ES', members: 6, plan:'Starter', status:'trial', c:'#F59E0B', i:'ME', shifts: 142 },
    { n:'Salud Andina', loc:'Bogotá · CO', members: 14, plan:'Pro', status:'paused', c:'#94A3B8', i:'SA', shifts: 0 },
  ];
  const planColor = (p) => p==='Enterprise'?theme.violet:p==='Pro'?theme.primary:theme.muted;
  const statusOf = (s) => s==='active'?{c:theme.green,l:'Activa'}:s==='trial'?{c:theme.amber,l:'Trial · 12d'}:{c:theme.muted,l:'Pausada'};

  return (
    <_AdminShell2 theme={theme} title="Organizaciones" sub="Superadmin · 6 organizaciones gestionadas" active="orgs" breadcrumbs={<><span>Superadmin</span><Icons.chevronR size={11} /><span>Organizaciones</span></>} headerRight={
      <>
        <div style={{ display:'flex', alignItems:'center', gap: 8, height: 36, padding:'0 12px', borderRadius: 10, background: theme.subtle, border:`1px solid ${theme.border}`, color: theme.muted, minWidth: 220 }}><Icons.search size={15} /><span style={{ fontSize: 12.5 }}>Buscar organización…</span></div>
        <button style={{ height: 36, padding:'0 14px', borderRadius: 10, background: theme.primary, color:'#fff', fontWeight: 600, fontSize: 13, border:'none', display:'flex', alignItems:'center', gap: 6 }}><Icons.plus size={15} stroke={2.6} /> Crear organización</button>
      </>
    }>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap: 14 }}>
        {orgs.map((o,i)=>{
          const st = statusOf(o.status);
          return (
            <div key={i} style={{ padding: 18, borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}` }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: o.c, color:'#fff', fontWeight: 800, fontSize: 17, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>{o.i}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap: 8, flexWrap:'wrap' }}>
                    <div className="tn-h" style={{ fontSize: 16, fontWeight: 700 }}>{o.n}</div>
                    <_Pill2 theme={theme} color={st.c} dot soft>{st.l}</_Pill2>
                  </div>
                  <div style={{ fontSize: 12, color: theme.muted, marginTop: 3, display:'flex', alignItems:'center', gap: 4 }}><Icons.pin size={11} /> {o.loc}</div>
                </div>
                <_Pill2 theme={theme} color={planColor(o.plan)}>{o.plan}</_Pill2>
              </div>
              <div style={{ marginTop: 14, display:'flex', gap: 24 }}>
                <div><div style={{ fontSize: 10.5, color: theme.muted, fontWeight: 600, letterSpacing:'.04em' }}>MIEMBROS</div><div className="tn-h" style={{ fontSize: 20, fontWeight: 800, marginTop: 2 }}>{o.members}</div></div>
                <div><div style={{ fontSize: 10.5, color: theme.muted, fontWeight: 600, letterSpacing:'.04em' }}>TURNOS / AÑO</div><div className="tn-h" style={{ fontSize: 20, fontWeight: 800, marginTop: 2 }}>{o.shifts.toLocaleString()}</div></div>
              </div>
            </div>
          );
        })}
      </div>
    </_AdminShell2>
  );
}

// ─────── Staff Positions ───────
function DAdminPositions({ theme }) {
  const positions = [
    { n:'Médico adjunto', team:'Cardiología', count: 4, perm:'Asignar turnos · Aprobar swaps', c:'#14B8A6' },
    { n:'Residente R3', team:'Urgencias', count: 3, perm:'Solicitar swaps', c:'#F97316' },
    { n:'Residente R1', team:'Pediatría', count: 2, perm:'Solo ver propios turnos', c:'#0EA5E9' },
    { n:'Jefa de servicio', team:'UCI', count: 1, perm:'Manager · Todos los permisos', c:'#7C3AED' },
    { n:'Enfermera/o', team:'Quirófano', count: 6, perm:'Solicitar swaps · Disponibilidad', c:'#A78BFA' },
    { n:'Auxiliar', team:'General', count: 8, perm:'Solo ver propios turnos', c:'#F59E0B' },
  ];
  return (
    <_AdminShell2 theme={theme} title="Puestos del equipo" sub="Roles funcionales por equipo · define permisos y categorías" active="positions" breadcrumbs={<><span>Administración</span><Icons.chevronR size={11} /><span>Puestos</span></>} headerRight={
      <button style={{ height: 36, padding:'0 14px', borderRadius: 10, background: theme.primary, color:'#fff', fontWeight: 600, fontSize: 13, border:'none', display:'flex', alignItems:'center', gap: 6 }}><Icons.plus size={15} stroke={2.6} /> Nuevo puesto</button>
    }>
      <div style={{ borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}`, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 0.7fr 1.5fr 60px', padding:'12px 18px', borderBottom:`1px solid ${theme.border}`, fontSize: 11, color: theme.muted, fontWeight: 700, letterSpacing:'0.05em', textTransform:'uppercase' }}>
          <span>Puesto</span><span>Equipo</span><span>Personas</span><span>Permisos</span><span></span>
        </div>
        {positions.map((p,i)=>(
          <div key={i} style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 0.7fr 1.5fr 60px', padding:'14px 18px', alignItems:'center', borderBottom: i<positions.length-1?`1px solid ${theme.border}`:'none', fontSize: 13 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: p.c+'1A', color: p.c, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.stethoscope size={16} /></div>
              <span style={{ fontWeight: 600 }}>{p.n}</span>
            </div>
            <span style={{ color: theme.textSec }}>{p.team}</span>
            <span><_Pill2 theme={theme} color={theme.primary}>{p.count}</_Pill2></span>
            <span style={{ color: theme.muted, fontSize: 12, lineHeight: 1.4 }}>{p.perm}</span>
            <span style={{ color: theme.muted }}><Icons.more size={16} /></span>
          </div>
        ))}
      </div>
    </_AdminShell2>
  );
}

// ─────── Invite admin ───────
function DAdminInvite({ theme }) {
  const pending = [
    { e:'l.fernandez@hospitalsj.org', role:'Staff', team:'Pediatría', sent:'Hace 2 días', exp:'Expira en 5 días' },
    { e:'r.alvarez@hospitalsj.org', role:'Manager', team:'Cardiología', sent:'Ayer', exp:'Expira en 6 días' },
    { e:'p.medina@hospitalsj.org', role:'Staff', team:'Urgencias', sent:'Hoy 11:15', exp:'Expira en 7 días' },
  ];
  return (
    <_AdminShell2 theme={theme} title="Invitar miembros" sub="Envía invitaciones por email para unirse a la organización" active="invite" breadcrumbs={<><span>Administración</span><Icons.chevronR size={11} /><span>Invitaciones</span></>}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap: 18, alignItems:'flex-start' }}>
        <div>
          <div style={{ padding: 24, borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}` }}>
            <div className="tn-h" style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Nueva invitación</div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: theme.textSec, marginBottom: 6 }}>Emails</div>
              <div style={{ minHeight: 80, padding: 10, borderRadius: 10, border:`1.5px solid ${theme.primary}`, background: theme.bg, display:'flex', flexWrap:'wrap', gap: 6, alignContent:'flex-start', boxShadow:`0 0 0 4px ${theme.primary}22` }}>
                {['ana.lopez@hospitalsj.org','m.garcia@hospitalsj.org','j.ruiz@hospitalsj.org'].map((e,i)=>(
                  <span key={i} style={{ display:'inline-flex', alignItems:'center', gap: 5, padding:'5px 9px', borderRadius: 7, background: theme.primary+'18', color: theme.primary, fontSize: 12, fontWeight: 600 }}>{e}<Icons.x size={11} stroke={2.4} /></span>
                ))}
                <span style={{ padding:'5px 4px', fontSize: 12, color: theme.muted }}>Escribe o pega…<span className="tn-blink" style={{ display:'inline-block', width: 1.5, height: 13, background: theme.text, marginLeft: 2, verticalAlign:'middle' }} /></span>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: theme.textSec, marginBottom: 6 }}>Rol</div>
                <div style={{ height: 44, padding:'0 12px', borderRadius: 10, border:`1px solid ${theme.border}`, background: theme.bg, display:'flex', alignItems:'center', gap: 8, fontSize: 13.5, fontWeight: 500 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: theme.primary }} /> Staff <Icons.chevronD size={14} style={{ marginLeft:'auto', color: theme.muted }} /></div>
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: theme.textSec, marginBottom: 6 }}>Equipo</div>
                <div style={{ height: 44, padding:'0 12px', borderRadius: 10, border:`1px solid ${theme.border}`, background: theme.bg, display:'flex', alignItems:'center', gap: 8, fontSize: 13.5, fontWeight: 500 }}>Cardiología <Icons.chevronD size={14} style={{ marginLeft:'auto', color: theme.muted }} /></div>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: theme.textSec, marginBottom: 6 }}>Mensaje (opcional)</div>
              <div style={{ minHeight: 80, padding: 12, borderRadius: 10, border:`1px solid ${theme.border}`, background: theme.bg, fontSize: 13, color: theme.textSec, lineHeight: 1.5 }}>Hola, te invitamos a unirte al equipo de Cardiología en Hospital San Juan. Verás tus turnos y podrás solicitar cambios desde la app.</div>
            </div>

            <div style={{ display:'flex', gap: 10 }}>
              <button style={{ height: 44, padding:'0 18px', borderRadius: 10, background: theme.primary, color:'#fff', fontWeight: 700, fontSize: 13.5, border:'none', display:'flex', alignItems:'center', gap: 8 }}><Icons.send size={15} /> Enviar 3 invitaciones</button>
              <button style={{ height: 44, padding:'0 18px', borderRadius: 10, background:'transparent', color: theme.text, fontWeight: 600, fontSize: 13.5, border:`1px solid ${theme.border}`, display:'flex', alignItems:'center', gap: 8 }}><Icons.copy size={14} /> Copiar enlace</button>
            </div>
          </div>
        </div>

        <div>
          <div className="tn-h" style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Pendientes ({pending.length})</div>
          <div style={{ borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}`, overflow:'hidden' }}>
            {pending.map((p,i)=>(
              <div key={i} style={{ padding: 14, borderBottom: i<pending.length-1?`1px solid ${theme.border}`:'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: theme.amber+'18', color: theme.amber, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.mail size={14} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.e}</div>
                    <div style={{ fontSize: 10.5, color: theme.muted, marginTop: 2 }}>{p.role} · {p.team}</div>
                  </div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop: 8, fontSize: 11, color: theme.muted }}><span>{p.sent}</span><span>{p.exp}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </_AdminShell2>
  );
}

// ─────── Viewer (read-only dashboard) ───────
function DViewer({ theme }) {
  return (
    <_AdminShell2 theme={theme} title="Vista de solo lectura" sub="Acceso de auditor · No puedes editar ni asignar" active="cal" breadcrumbs={<><span>Calidad / Auditor</span><Icons.chevronR size={11} /><span>Calendario</span></>} headerRight={<_Pill2 theme={theme} color={theme.muted} dot>Solo lectura</_Pill2>}>
      <div style={{ padding: 14, borderRadius: 12, background: theme.amber+'14', border:`1px solid ${theme.amber}33`, color: theme.amber, fontSize: 12.5, display:'flex', alignItems:'center', gap: 10, marginBottom: 16 }}>
        <Icons.eye size={16} />
        Tienes acceso como <b>Viewer</b>. Puedes consultar turnos, miembros y reportes, pero no realizar cambios.
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap: 8, marginBottom: 16 }}>
        {['L','M','X','J','V','S','D'].map((d,i)=>(<div key={i} style={{ textAlign:'center', fontSize: 11, color: theme.muted, fontWeight: 700, padding:'6px 0' }}>{d}</div>))}
        {Array.from({length:35}, (_,i)=>{
          const day = i - 2;
          const has = [1,3,5,8,10,12,14,15,17,21,23,26].includes(day);
          const today = day === 14;
          return (
            <div key={i} style={{ aspectRatio:'1', borderRadius: 10, background: theme.bg, border: today?`2px solid ${theme.primary}`:`1px solid ${theme.border}`, padding: 6, display:'flex', flexDirection:'column', gap: 3, opacity: day<1||day>31?.4:1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: today?theme.primary:theme.text }}>{day>0&&day<32?day:''}</div>
              {has && day>0&&day<32 ? (
                <div style={{ display:'flex', gap: 2, flexWrap:'wrap' }}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background:'#14B8A6' }} />
                  <span style={{ width: 5, height: 5, borderRadius: 999, background:'#7C3AED' }} />
                  {[5,12,21].includes(day) ? <span style={{ width: 5, height: 5, borderRadius: 999, background:'#F97316' }} /> : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 12 }}>
        {[
          { l:'Cobertura del mes', v:'94%', c: theme.green },
          { l:'Turnos asignados', v:'186', c: theme.primary },
          { l:'Solicitudes resueltas', v:'42', c: theme.violet },
        ].map((s,i)=>(
          <div key={i} style={{ padding: 16, borderRadius: 12, background: theme.bg, border:`1px solid ${theme.border}` }}>
            <div style={{ fontSize: 11.5, color: theme.muted }}>{s.l}</div>
            <div className="tn-h" style={{ fontSize: 26, fontWeight: 800, color: s.c, marginTop: 4 }}>{s.v}</div>
          </div>
        ))}
      </div>
    </_AdminShell2>
  );
}

// ─────── Permissions matrix ───────
function DPermissions({ theme }) {
  const perms = [
    { c:'Calendario', items:[
      { l:'Ver propios turnos', a:[1,1,1,1] },
      { l:'Ver turnos del equipo', a:[0,1,1,1] },
      { l:'Crear/editar turnos', a:[0,0,1,1] },
      { l:'Asignar turnos a miembros', a:[0,0,1,1] },
    ]},
    { c:'Solicitudes', items:[
      { l:'Crear swap', a:[1,1,1,0] },
      { l:'Crear cesión', a:[1,1,1,0] },
      { l:'Aprobar/rechazar', a:[0,0,1,1] },
      { l:'Ver historial de la org.', a:[0,0,1,1] },
    ]},
    { c:'Equipo', items:[
      { l:'Ver miembros', a:[1,1,1,1] },
      { l:'Invitar miembros', a:[0,0,1,1] },
      { l:'Cambiar roles', a:[0,0,0,1] },
      { l:'Configurar puestos', a:[0,0,0,1] },
    ]},
    { c:'Administración', items:[
      { l:'Configurar reglas', a:[0,0,0,1] },
      { l:'Ver auditoría', a:[0,0,1,1] },
      { l:'Exportar datos', a:[0,0,1,1] },
      { l:'Gestionar facturación', a:[0,0,0,1] },
    ]},
  ];
  const roles = [
    { l:'Staff', c: theme.primary },
    { l:'Manager', c: theme.violet },
    { l:'Org Admin', c: theme.red },
    { l:'Superadmin', c: theme.amber },
  ];
  return (
    <_AdminShell2 theme={theme} title="Permisos" sub="Matriz de capacidades por rol" active="cal" breadcrumbs={<><span>Administración</span><Icons.chevronR size={11} /><span>Permisos</span></>}>
      <div style={{ borderRadius: 14, background: theme.bg, border:`1px solid ${theme.border}`, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr repeat(4, 1fr)', alignItems:'center', padding:'14px 20px', background: theme.subtle, borderBottom:`1px solid ${theme.border}` }}>
          <div style={{ fontSize: 11, color: theme.muted, fontWeight: 700, letterSpacing:'0.06em', textTransform:'uppercase' }}>Capacidad</div>
          {roles.map((r,i)=>(
            <div key={i} style={{ textAlign:'center' }}>
              <_Pill2 theme={theme} color={r.c}>{r.l}</_Pill2>
            </div>
          ))}
        </div>
        {perms.map((cat, ci)=>(
          <div key={ci}>
            <div style={{ padding:'12px 20px', fontSize: 12, color: theme.text, fontWeight: 700, background: theme.subtle, opacity:.5, borderTop: ci>0?`1px solid ${theme.border}`:'none' }}>{cat.c}</div>
            {cat.items.map((it, i)=>(
              <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr repeat(4, 1fr)', alignItems:'center', padding:'12px 20px', borderTop:`1px solid ${theme.border}`, fontSize: 13 }}>
                <span style={{ color: theme.text, fontWeight: 500 }}>{it.l}</span>
                {it.a.map((on, j)=>(
                  <div key={j} style={{ display:'flex', justifyContent:'center' }}>
                    {on ? (
                      <span style={{ width: 24, height: 24, borderRadius: 6, background: roles[j].c+'1A', color: roles[j].c, display:'flex', alignItems:'center', justifyContent:'center' }}><Icons.check size={14} stroke={3} /></span>
                    ) : (
                      <span style={{ width: 24, height: 24, borderRadius: 6, background: theme.subtle, color: theme.muted, display:'flex', alignItems:'center', justifyContent:'center', opacity:.5 }}>—</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </_AdminShell2>
  );
}

window.X2 = { DAdminSettings, DAdminAudit, DAdminExports, DAdminReports, DAdminOrgs, DAdminPositions, DAdminInvite, DViewer, DPermissions };
