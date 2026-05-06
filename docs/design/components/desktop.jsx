// Invoxa — Desktop screens
// Layout: sidebar nav + main canvas. Designed for 1280×800 viewport.

const DesktopShell = ({ role = 'admin', t, variant, active, children }) => {
  const adminItems = [
    { id: 'dashboard', icon: 'home', label: t.dashboard },
    { id: 'users', icon: 'users', label: t.users },
    { id: 'projects', icon: 'folder', label: t.projects },
    { id: 'invoices', icon: 'invoice', label: t.invoices },
    { id: 'requests', icon: 'mail', label: t.requests },
    { id: 'changeReq', icon: 'hash', label: t.changeRequests },
  ];
  const userItems = [
    { id: 'dashboard', icon: 'home', label: t.dashboard },
    { id: 'tasks', icon: 'clock', label: t.tasks },
    { id: 'invoices', icon: 'invoice', label: t.invoices },
    { id: 'billing', icon: 'user', label: t.billingProfile },
  ];
  const items = role === 'admin' ? adminItems : userItems;
  const me = role === 'admin' ? SAMPLE.admin : SAMPLE.currentUser;

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg)', color: 'var(--ink)' }}>
      {/* Sidebar */}
      <div style={{
        width: 232, background: 'var(--bg-sunken)', borderRight: '1px solid var(--line)',
        padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{ padding: '4px 10px 18px' }}>
          <Logo size={22} variant={variant}/>
        </div>
        <div style={{
          fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase',
          letterSpacing: '0.08em', padding: '8px 10px 6px', fontWeight: 500,
        }}>
          {role === 'admin' ? 'Admin' : t.profile}
        </div>
        {items.map(it => {
          const on = it.id === active;
          return (
            <button key={it.id} style={{
              display: 'flex', alignItems: 'center', gap: 11,
              padding: '8px 10px', borderRadius: 'var(--radius-sm)',
              background: on ? 'var(--bg-elev)' : 'transparent',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              color: on ? 'var(--ink)' : 'var(--ink-2)',
              boxShadow: on ? 'var(--shadow-1)' : 'none',
              fontFamily: 'var(--font-ui)', fontSize: 13,
              fontWeight: on ? 500 : 400,
            }}>
              <Icon name={it.icon} size={16} color={on ? 'var(--accent)' : 'var(--ink-3)'}/>
              {it.label}
            </button>
          );
        })}
        <div style={{ flex: 1 }}/>
        <Divider style={{ margin: '12px 0' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
          <Avatar name={me.name} size={32}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{me.name}</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{me.email}</div>
          </div>
          <IconBtn size={28}><Icon name="logout" size={14}/></IconBtn>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
};

const PageHeader = ({ kicker, title, subtitle, actions }) => (
  <div style={{
    padding: '24px 32px 20px',
    borderBottom: '1px solid var(--line)',
    background: 'var(--bg)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20,
  }}>
    <div>
      {kicker && <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{kicker}</div>}
      <div className="display" style={{ fontSize: 30, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 6 }}>{subtitle}</div>}
    </div>
    {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
  </div>
);

// ────────────────────────────────────────────────────────────
// DESKTOP — Admin Dashboard
// ────────────────────────────────────────────────────────────
const DesktopAdminDashboard = ({ t, variant }) => (
  <DesktopShell role="admin" t={t} variant={variant} active="dashboard">
    <PageHeader
      kicker="Abril · 2026"
      title="Buen día, María."
      subtitle="Faltan 4 facturas de 14 colaboradores. El cierre del mes es en 1 día."
      actions={<>
        <Btn variant="outline" leading={<Icon name="filter" size={14}/>}>Filtrar</Btn>
        <Btn leading={<Icon name="send" size={14}/>}>{t.requestAll}</Btn>
      </>}
    />

    <div style={{ padding: 32, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, flex: 1 }}>
      {/* Left column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
          {[
            { l: t.activeUsers, v: '14', h: '+2 este mes' },
            { l: t.invoicesPending, v: '4', h: 'por solicitar', accent: true },
            { l: t.invoicesGenerated, v: '10', h: 'de 14' },
            { l: 'Total facturado', v: '$24.8k', h: 'USD · abril' },
          ].map((s, i) => (
            <Card key={i} padded={false} style={{ padding: 16 }}>
              <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.l}</div>
              <div className="display" style={{ fontSize: 28, color: s.accent ? 'var(--accent)' : 'var(--ink)', marginTop: 6, letterSpacing: '-0.01em' }}>{s.v}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 4 }}>{s.h}</div>
            </Card>
          ))}
        </div>

        {/* Invoice progress */}
        <Card padded>
          <SectionTitle title="Estado de facturas · Abril" action={<a href="#" style={{ fontSize: 12, color: 'var(--accent)' }}>Ver todas</a>}/>
          {/* Stacked bar */}
          <div style={{ display: 'flex', height: 28, borderRadius: 6, overflow: 'hidden', marginBottom: 16 }}>
            {[
              { v: 6, c: 'var(--success)', l: 'Pagadas' },
              { v: 2, c: 'oklch(0.65 0.13 145)', l: 'Aprobadas' },
              { v: 2, c: 'var(--info)', l: 'En revisión' },
              { v: 4, c: 'var(--bg-muted)', l: 'Pendientes' },
            ].map((s, i) => (
              <div key={i} style={{ flex: s.v, background: s.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: i < 3 ? '#fff' : 'var(--ink-2)', fontWeight: 500 }}>
                {s.v}
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, fontSize: 11.5 }}>
            {[
              { c: 'var(--success)', l: 'Pagadas', n: 6 },
              { c: 'oklch(0.65 0.13 145)', l: 'Aprobadas', n: 2 },
              { c: 'var(--info)', l: 'En revisión', n: 2 },
              { c: 'var(--bg-muted)', l: 'Pendientes', n: 4 },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.c }}/>
                <span style={{ color: 'var(--ink-2)' }}>{s.l}</span>
                <span className="mono tabular" style={{ marginLeft: 'auto', color: 'var(--ink)' }}>{s.n}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent invoices table */}
        <Card padded={false}>
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)' }}>
            <div className="serif" style={{ fontSize: 17, color: 'var(--ink)' }}>Facturas recientes</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Btn variant="ghost" size="sm">Hoy</Btn>
              <Btn variant="ghost" size="sm" style={{ background: 'var(--bg-muted)' }}>Esta semana</Btn>
              <Btn variant="ghost" size="sm">Mes</Btn>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.4fr 1fr 1fr 0.8fr', padding: '10px 20px', borderBottom: '1px solid var(--line)', fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <span>Colaborador</span><span>Número</span><span>Periodo</span><span style={{ textAlign: 'right' }}>Monto</span><span style={{ textAlign: 'right' }}>Estado</span>
          </div>
          {SAMPLE.invoices.slice(0, 5).map(inv => (
            <div key={inv.id} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.4fr 1fr 1fr 0.8fr', padding: '12px 20px', borderBottom: '1px solid var(--line)', alignItems: 'center', fontSize: 13 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={inv.user} size={28}/>
                <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{inv.user}</span>
              </div>
              <span className="mono" style={{ fontSize: 12, color: 'var(--ink-2)' }}>{inv.number}</span>
              <span style={{ color: 'var(--ink-2)' }}>{inv.period}</span>
              <span className="mono tabular" style={{ textAlign: 'right', color: 'var(--ink)', fontWeight: 500 }}>{fmt$(inv.amount, inv.currency)}</span>
              <span style={{ textAlign: 'right' }}><StatusPill status={inv.status} t={t}/></span>
            </div>
          ))}
        </Card>
      </div>

      {/* Right column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Deadline */}
        <Card padded style={{ background: 'var(--ink)', color: 'var(--ink-inverse)', border: 'none' }}>
          <div style={{ fontSize: 10.5, color: 'rgba(251,247,240,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cierre del mes</div>
          <div className="display" style={{ fontSize: 30, color: '#fff', marginTop: 6, lineHeight: 1.05 }}>30 abr</div>
          <div style={{ fontSize: 13, color: 'rgba(251,247,240,0.7)', marginTop: 4 }}>Quedan 18 horas</div>
          <Divider style={{ margin: '16px 0', background: 'rgba(251,247,240,0.15)' }}/>
          <div style={{ fontSize: 12.5, color: 'rgba(251,247,240,0.85)', lineHeight: 1.55, marginBottom: 14 }}>
            4 colaboradores aún no han enviado factura. Lánzales un recordatorio.
          </div>
          <Btn full size="md" leading={<Icon name="send" size={14}/>}>Enviar recordatorios</Btn>
        </Card>

        {/* Activity */}
        <Card padded={false}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
            <div className="serif" style={{ fontSize: 16, color: 'var(--ink)' }}>{t.recentActivity}</div>
          </div>
          {[
            { i: 'invoice', a: 'Camila Ortiz', b: 'envió INF-COR-2026-0004', c: '12 min' },
            { i: 'check', a: 'Diego Restrepo', b: 'factura aprobada', c: '1 h' },
            { i: 'mail-send', a: 'Tú', b: 'solicitaste 6 facturas', c: '3 h' },
            { i: 'hash', a: 'Ricardo Castaño', b: 'pidió cambio de número', c: 'ayer' },
            { i: 'user', a: 'Sofía Henao', b: 'aceptó la invitación', c: '2 d' },
          ].map((it, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 18px', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--bg-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)', flexShrink: 0 }}>
                <Icon name={it.i} size={13}/>
              </div>
              <div style={{ flex: 1, fontSize: 12.5 }}>
                <div style={{ color: 'var(--ink)', lineHeight: 1.4 }}><span style={{ fontWeight: 500 }}>{it.a}</span> {it.b}</div>
                <div style={{ color: 'var(--ink-3)', fontSize: 11, marginTop: 2 }}>hace {it.c}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  </DesktopShell>
);

// ────────────────────────────────────────────────────────────
// DESKTOP — Admin Users
// ────────────────────────────────────────────────────────────
const DesktopAdminUsers = ({ t, variant }) => (
  <DesktopShell role="admin" t={t} variant={variant} active="users">
    <PageHeader
      kicker="Admin"
      title={t.allUsers}
      subtitle="14 colaboradores · 7 activos · 1 invitado"
      actions={<>
        <Btn variant="outline" leading={<Icon name="download" size={14}/>}>Exportar</Btn>
        <Btn leading={<Icon name="plus" size={14}/>}>{t.inviteUser}</Btn>
      </>}
    />
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <Input leading={<Icon name="search" size={14}/>} placeholder={t.search} value="" style={{ flex: 1, maxWidth: 320 }}/>
        <Select value="all" options={[{ value: 'all', label: 'Todos los proyectos' }, ...SAMPLE.projects.map(p => ({ value: p.id, label: p.name }))]}/>
        <Select value="all" options={[{ value: 'all', label: 'Cualquier modalidad' }, { value: 'hourly', label: t.hourly }, { value: 'fixed', label: t.fixed }]}/>
        <div style={{ flex: 1 }}/>
        <Btn variant="ghost" leading={<Icon name="sort" size={14}/>} size="md">Ordenar</Btn>
      </div>

      <Card padded={false}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.7fr 1.3fr 1fr 0.8fr 1fr 60px', padding: '12px 20px', borderBottom: '1px solid var(--line)', fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <span>Colaborador</span><span>Código</span><span>Proyectos</span><span>Modalidad</span><span style={{ textAlign: 'right' }}>Facturado</span><span>Estado</span><span/>
        </div>
        {SAMPLE.users.map((u, i, arr) => (
          <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '2fr 0.7fr 1.3fr 1fr 0.8fr 1fr 60px', padding: '14px 20px', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none', alignItems: 'center', fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={u.name} size={34}/>
              <div>
                <div style={{ color: 'var(--ink)', fontWeight: 500 }}>{u.name}</div>
                <div style={{ color: 'var(--ink-3)', fontSize: 11.5 }}>{u.email}</div>
              </div>
            </div>
            <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-2)', padding: '2px 8px', background: 'var(--bg-sunken)', borderRadius: 4, alignSelf: 'center', justifySelf: 'start' }}>{u.code}</span>
            <span style={{ color: 'var(--ink-2)' }}>{u.projects > 0 ? `${u.projects} proyecto${u.projects > 1 ? 's' : ''}` : '—'}</span>
            <span style={{ color: 'var(--ink-2)' }}>
              {u.type === 'mixed' ? 'Mixto' : u.type === 'hourly' ? t.hourly : u.type === 'fixed' ? t.fixed : '—'}
            </span>
            <span className="mono tabular" style={{ textAlign: 'right', color: 'var(--ink)' }}>{u.invoiced ? fmt$(u.invoiced) : '—'}</span>
            <span><StatusPill status={u.status} t={t}/></span>
            <IconBtn size={28}><Icon name="more" size={14}/></IconBtn>
          </div>
        ))}
      </Card>
    </div>
  </DesktopShell>
);

// ────────────────────────────────────────────────────────────
// DESKTOP — Project detail (with members)
// ────────────────────────────────────────────────────────────
const DesktopAdminProjectDetail = ({ t, variant }) => {
  const proj = SAMPLE.projects[0];
  return (
    <DesktopShell role="admin" t={t} variant={variant} active="projects">
      <PageHeader
        kicker={<a href="#" style={{ color: 'var(--accent)' }}>← Proyectos</a>}
        title={proj.name}
        subtitle={proj.desc}
        actions={<>
          <Btn variant="outline" leading={<Icon name="edit" size={14}/>}>Editar</Btn>
          <Btn leading={<Icon name="plus" size={14}/>}>{t.addMember}</Btn>
        </>}
      />

      <div style={{ padding: 32, display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Members card */}
          <Card padded={false}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="serif" style={{ fontSize: 17, color: 'var(--ink)' }}>{t.members} · 6</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Btn variant="ghost" size="sm" style={{ background: 'var(--bg-muted)' }}>Activos</Btn>
                <Btn variant="ghost" size="sm">Históricos</Btn>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 0.8fr 1fr 0.8fr 60px', padding: '10px 20px', borderBottom: '1px solid var(--line)', fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>Colaborador</span><span>Modalidad</span><span style={{ textAlign: 'right' }}>Tarifa</span><span>Inicio</span><span>Estado</span><span/>
            </div>
            {[
              { n: 'Ricardo Castaño', m: t.hourly, r: '20 USD/h', d: '15 ene 2026', s: 'active' },
              { n: 'Laura Mejía', m: t.hourly, r: '22 USD/h', d: '03 feb 2026', s: 'active' },
              { n: 'Diego Restrepo', m: t.fixed, r: '2,500 USD/mes', d: '01 mar 2026', s: 'active' },
              { n: 'Camila Ortiz', m: t.fixed, r: '3,200 USD/mes', d: '12 ene 2026', s: 'active' },
              { n: 'Andrés Vélez', m: t.hourly, r: '20 USD/h', d: '20 mar 2026', s: 'active' },
              { n: 'Sofía Henao', m: '—', r: '—', d: 'Pendiente', s: 'invited' },
            ].map((m, i, arr) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 0.8fr 1fr 0.8fr 60px', padding: '12px 20px', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none', alignItems: 'center', fontSize: 13 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={m.n} size={30}/>
                  <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{m.n}</span>
                </div>
                <span style={{ color: 'var(--ink-2)' }}>{m.m}</span>
                <span className="mono tabular" style={{ textAlign: 'right', color: 'var(--ink-2)' }}>{m.r}</span>
                <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>{m.d}</span>
                <span><StatusPill status={m.s} t={t}/></span>
                <IconBtn size={28}><Icon name="more" size={14}/></IconBtn>
              </div>
            ))}
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padded>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Resumen del mes</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{t.hoursLogged}</span>
              <span className="mono tabular" style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>412h</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{t.tasksLogged}</span>
              <span className="mono tabular" style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>87</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>Facturas activas</span>
              <span className="mono tabular" style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>5</span>
            </div>
            <Divider style={{ margin: '12px 0' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--ink)' }}>{t.invoicedAmount}</span>
              <span className="mono tabular display" style={{ fontSize: 22, color: 'var(--accent)' }}>$8.4k</span>
            </div>
          </Card>
          <Card padded>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Distribución</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 80, marginBottom: 10 }}>
              {[40, 60, 80, 50, 70, 90].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 5 ? 'var(--accent)' : 'var(--bg-muted)', borderRadius: 3 }}/>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Nov</span><span>Dic</span><span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span>
            </div>
          </Card>
        </div>
      </div>
    </DesktopShell>
  );
};

// ────────────────────────────────────────────────────────────
// DESKTOP — Invoices
// ────────────────────────────────────────────────────────────
const DesktopAdminInvoices = ({ t, variant }) => (
  <DesktopShell role="admin" t={t} variant={variant} active="invoices">
    <PageHeader
      kicker="Admin"
      title={t.invoices}
      subtitle="Todas las facturas del sistema, agrupadas por mes."
      actions={<>
        <Btn variant="outline" leading={<Icon name="download" size={14}/>}>Exportar CSV</Btn>
        <Btn leading={<Icon name="send" size={14}/>}>Solicitar facturas</Btn>
      </>}
    />
    <div style={{ padding: 32, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
      <div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { l: 'Todas', n: 14, on: true },
            { l: 'Generadas', n: 1 },
            { l: 'En revisión', n: 2 },
            { l: 'Aprobadas', n: 2 },
            { l: 'Pagadas', n: 6 },
            { l: 'Pendientes', n: 4 },
          ].map((c, i) => (
            <button key={i} style={{
              padding: '8px 14px', borderRadius: 999,
              background: c.on ? 'var(--ink)' : 'var(--bg-elev)',
              color: c.on ? 'var(--ink-inverse)' : 'var(--ink-2)',
              border: c.on ? 'none' : '1px solid var(--line)',
              fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              display: 'inline-flex', gap: 6, alignItems: 'center',
            }}>
              {c.l}
              <span style={{
                background: c.on ? 'rgba(255,255,255,0.18)' : 'var(--bg-muted)',
                color: c.on ? '#fff' : 'var(--ink-3)',
                padding: '0 6px', borderRadius: 6, fontSize: 11,
              }} className="mono tabular">{c.n}</span>
            </button>
          ))}
        </div>

        {/* Group by month */}
        {[
          { m: 'Abril 2026', invs: SAMPLE.invoices.filter(i => i.period.includes('Abril')) },
          { m: 'Marzo 2026', invs: SAMPLE.invoices.filter(i => i.period.includes('Marzo')) },
        ].map(grp => (
          <div key={grp.m} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{grp.m}</span>
              <Divider style={{ flex: 1 }}/>
              <span className="mono tabular" style={{ fontSize: 12, color: 'var(--ink-2)' }}>
                {grp.invs.length} · {fmt$(grp.invs.reduce((s, i) => s + i.amount, 0))}
              </span>
            </div>
            <Card padded={false}>
              {grp.invs.map((inv, i, arr) => (
                <div key={inv.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 1fr 0.8fr 36px', padding: '14px 20px', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none', alignItems: 'center', fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={inv.user} size={30}/>
                    <div>
                      <div style={{ color: 'var(--ink)', fontWeight: 500 }}>{inv.user}</div>
                      <div style={{ color: 'var(--ink-3)', fontSize: 11.5 }}>{inv.projects} proyecto{inv.projects > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--ink-2)' }}>{inv.number}</span>
                  <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>{inv.date}</span>
                  <span className="mono tabular" style={{ textAlign: 'right', color: 'var(--ink)', fontWeight: 500 }}>{fmt$(inv.amount, inv.currency)}</span>
                  <span><StatusPill status={inv.status} t={t}/></span>
                  <IconBtn size={28}><Icon name="more" size={14}/></IconBtn>
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>

      {/* PDF preview side panel */}
      <div>
        <div style={{ position: 'sticky', top: 0 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            Vista previa
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <InvoicePDF variant={variant}/>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <Btn variant="outline" full leading={<Icon name="download" size={14}/>}>PDF</Btn>
            <Btn full leading={<Icon name="check" size={14}/>}>{t.approve}</Btn>
          </div>
        </div>
      </div>
    </div>
  </DesktopShell>
);

// ────────────────────────────────────────────────────────────
// DESKTOP — User dashboard
// ────────────────────────────────────────────────────────────
const DesktopUserDashboard = ({ t, variant }) => (
  <DesktopShell role="user" t={t} variant={variant} active="dashboard">
    <PageHeader
      kicker="Abril · 2026"
      title="Hola, Ricardo."
      subtitle="Es momento de generar tu factura mensual. Tu admin la espera antes del 30 de abril."
      actions={<Btn size="md" leading={<Icon name="plus" size={14}/>}>{t.generateInvoice}</Btn>}
    />
    <div style={{ padding: 32, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Hero */}
        <Card padded style={{ background: 'var(--accent)', color: '#fff', border: 'none', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -40, top: -40, opacity: 0.14 }}>
            <Icon name="invoice" size={200} color="#fff" strokeWidth={1}/>
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Próxima factura
              </div>
              <div className="mono" style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginBottom: 14 }}>INF-RCA-2026-0004</div>
              <div className="display" style={{ fontSize: 44, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                $2,000 <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }}>USD</span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 6, marginBottom: 18 }}>
                Estimado · 60h en Atlas Banking + fijo Helio Health
              </div>
              <Btn variant="ink">{t.generateInvoice} →</Btn>
            </div>
          </div>
        </Card>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Card padded>
            <SectionTitle title="Mis proyectos" action={<Badge tone="success">2 activos</Badge>}/>
            {[
              { n: 'Atlas Banking', m: 'Por hora · 20 USD/h', s: '60h', sub: '$1,200 estimados' },
              { n: 'Helio Health', m: 'Fijo · 800 USD/mes', s: '$800', sub: 'abril' },
            ].map((p, i, arr) => (
              <div key={i} style={{ padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{p.n}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{p.m}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono tabular" style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{p.s}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{p.sub}</div>
                </div>
              </div>
            ))}
          </Card>
          <Card padded>
            <SectionTitle title="Tareas recientes" action={<a href="#" style={{ fontSize: 12, color: 'var(--accent)' }}>Ver todas</a>}/>
            {SAMPLE.tasks.slice(0, 4).map((task, i, arr) => (
              <div key={task.id} style={{ padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{task.project} · {task.date.slice(5)}</div>
                </div>
                <span className="mono tabular" style={{ fontSize: 13, color: 'var(--ink)' }}>{task.hours}h</span>
              </div>
            ))}
          </Card>
        </div>

        {/* History chart */}
        <Card padded>
          <SectionTitle title="Mi historial · 2026"/>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', height: 140, marginBottom: 12 }}>
            {[
              { m: 'Ene', v: 1640 },
              { m: 'Feb', v: 1820 },
              { m: 'Mar', v: 1900 },
              { m: 'Abr', v: 2000, active: true },
              { m: 'May', v: 0, future: true },
              { m: 'Jun', v: 0, future: true },
            ].map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span className="mono tabular" style={{ fontSize: 11, color: b.active ? 'var(--accent)' : 'var(--ink-3)', fontWeight: 500 }}>
                  {b.v ? `$${(b.v/1000).toFixed(1)}k` : '—'}
                </span>
                <div style={{
                  width: '100%',
                  height: b.v ? `${(b.v / 2200) * 100}%` : '4px',
                  background: b.active ? 'var(--accent)' : b.future ? 'var(--bg-muted)' : 'var(--ink)',
                  borderRadius: 4, opacity: b.future ? 0.5 : 1,
                }}/>
                <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{b.m}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card padded style={{ background: 'var(--bg-sunken)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Avatar name="Ricardo Castaño" size={42}/>
            <div>
              <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>Ricardo Castaño</div>
              <Badge tone="success" dot>Perfil completo</Badge>
            </div>
          </div>
          <Divider style={{ margin: '12px 0' }}/>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Código de usuario</div>
          <div className="mono" style={{ fontSize: 14, color: 'var(--ink)', marginTop: 2 }}>RCA</div>
        </Card>
        <Card padded>
          <SectionTitle title="Acceso rápido"/>
          {[
            { i: 'plus', l: 'Registrar tarea', s: 'Atlas Banking · 4h' },
            { i: 'invoice', l: 'Generar factura', s: 'Abril 2026' },
            { i: 'user', l: 'Editar perfil', s: 'Datos bancarios' },
            { i: 'hash', l: 'Pedir cambio de #', s: 'Solicitar al admin' },
          ].map((q, i, arr) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <Icon name={q.i} size={16} color="var(--ink-2)"/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--ink)' }}>{q.l}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{q.s}</div>
              </div>
              <Icon name="chev-right" size={14} color="var(--ink-3)"/>
            </div>
          ))}
        </Card>
      </div>
    </div>
  </DesktopShell>
);

// ────────────────────────────────────────────────────────────
// DESKTOP — Generate invoice (full flow)
// ────────────────────────────────────────────────────────────
const DesktopGenerateInvoice = ({ t, variant }) => (
  <DesktopShell role="user" t={t} variant={variant} active="invoices">
    <PageHeader
      kicker={<a href="#" style={{ color: 'var(--accent)' }}>← {t.invoices}</a>}
      title={t.generateInvoice}
      subtitle="Revisa los proyectos y montos antes de generar tu factura mensual."
    />
    <div style={{ padding: 32, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[
            { l: 'Periodo', done: true },
            { l: 'Revisar', active: true },
            { l: 'Confirmar' },
          ].map((s, i, arr) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 999, fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: s.done ? 'var(--accent)' : s.active ? 'var(--ink)' : 'var(--bg-muted)',
                  color: s.done || s.active ? '#fff' : 'var(--ink-3)',
                }}>{s.done ? <Icon name="check" size={14} strokeWidth={3}/> : i+1}</div>
                <span style={{ fontSize: 13, color: s.active || s.done ? 'var(--ink)' : 'var(--ink-3)', fontWeight: s.active ? 600 : 400 }}>{s.l}</span>
              </div>
              {i < arr.length - 1 && <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>}
            </React.Fragment>
          ))}
        </div>

        <Card padded>
          <SectionTitle title="Periodo facturado"/>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Field label={t.month}><Select value="04" options={[{value:'04', label:'Abril'}]}/></Field>
            <Field label={t.year}><Select value="2026" options={['2026']}/></Field>
            <Field label="Rango">
              <Input value="01 — 30 abr" readOnly leading={<Icon name="calendar" size={14}/>}/>
            </Field>
          </div>
        </Card>

        <Card padded={false}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="serif" style={{ fontSize: 17, color: 'var(--ink)' }}>{t.includedProjects}</div>
            <Badge tone="accent">2 proyectos</Badge>
          </div>
          {[
            { p: 'Atlas Banking', q: 60, r: 20, type: 'Por hora', sub: 1200, tasks: 12 },
            { p: 'Helio Health', q: 1, r: 800, type: 'Fijo mensual', sub: 800 },
          ].map((it, i, arr) => (
            <div key={i} style={{ padding: 20, borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500 }}>{it.p}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 4 }}>
                    {it.type} {it.tasks ? `· ${it.tasks} tareas registradas` : '· tarifa configurada para este proyecto'}
                  </div>
                </div>
                <div className="mono tabular display" style={{ fontSize: 22, color: 'var(--ink)' }}>{fmt$(it.sub)}</div>
              </div>
              <div style={{ background: 'var(--bg-sunken)', padding: 12, borderRadius: 'var(--radius-sm)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{it.tasks ? 'Horas' : 'Cantidad'}</div>
                  <div className="mono tabular" style={{ fontSize: 14, color: 'var(--ink)', marginTop: 2 }}>{it.q}{it.tasks ? 'h' : ''}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tarifa</div>
                  <div className="mono tabular" style={{ fontSize: 14, color: 'var(--ink)', marginTop: 2 }}>{fmt$(it.r)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Subtotal</div>
                  <div className="mono tabular" style={{ fontSize: 14, color: 'var(--ink)', marginTop: 2, fontWeight: 600 }}>{fmt$(it.sub)}</div>
                </div>
              </div>
            </div>
          ))}
        </Card>

        <Card padded>
          <Field label={t.notes} hint="Aparecerá en el PDF y la verá tu admin">
            <textarea defaultValue="Trabajo del mes en Atlas Banking (sistema de tablas + onboarding) y Helio Health (visual del marketing site). Pago a 30 días, por favor confirmar recepción al correo." style={{
              minHeight: 90, padding: 14, border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-elev)', fontFamily: 'var(--font-ui)', fontSize: 13.5, color: 'var(--ink)',
              resize: 'vertical', outline: 'none',
            }}/>
          </Field>
        </Card>
      </div>

      {/* Summary side panel */}
      <div>
        <div style={{ position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padded>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{t.invoiceNumber}</div>
            <div className="mono" style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500 }}>INF-RCA-2026-0004</div>
            <Divider style={{ margin: '16px 0' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
              <span style={{ color: 'var(--ink-3)' }}>Atlas Banking</span>
              <span className="mono tabular" style={{ color: 'var(--ink)' }}>{fmt$(1200)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
              <span style={{ color: 'var(--ink-3)' }}>Helio Health</span>
              <span className="mono tabular" style={{ color: 'var(--ink)' }}>{fmt$(800)}</span>
            </div>
            <Divider style={{ margin: '12px 0' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
              <span style={{ color: 'var(--ink-3)' }}>{t.subtotal}</span>
              <span className="mono tabular" style={{ color: 'var(--ink)' }}>{fmt$(2000)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 12 }}>
              <span style={{ color: 'var(--ink-3)' }}>{t.taxes}</span>
              <span className="mono tabular" style={{ color: 'var(--ink-3)' }}>—</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--ink)' }}>
              <span className="serif" style={{ fontSize: 18, color: 'var(--ink)' }}>{t.total}</span>
              <span className="mono tabular display" style={{ fontSize: 28, color: 'var(--ink)', fontWeight: 600 }}>{fmt$(2000)}</span>
            </div>
            <Btn full size="lg" style={{ marginTop: 16 }} trailing={<Icon name="arrow-right" size={14}/>}>{t.confirmGenerate}</Btn>
            <button style={{ width: '100%', marginTop: 8, padding: 8, background: 'transparent', border: 'none', color: 'var(--ink-3)', fontSize: 12.5, cursor: 'pointer' }}>
              Guardar borrador
            </button>
          </Card>
        </div>
      </div>
    </div>
  </DesktopShell>
);

Object.assign(window, {
  DesktopShell, PageHeader,
  DesktopAdminDashboard, DesktopAdminUsers, DesktopAdminProjectDetail, DesktopAdminInvoices,
  DesktopUserDashboard, DesktopGenerateInvoice,
});
