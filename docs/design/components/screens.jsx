// Invoxa — All app screens (mobile + desktop shells)
// Screens are functions that take (ctx) where ctx contains: t (translations), nav, user, etc.

// ────────────────────────────────────────────────────────────
// Status pill (used everywhere)
// ────────────────────────────────────────────────────────────
const StatusPill = ({ status, t }) => {
  const tone = STATUS_TONE[status] || 'neutral';
  const label = t['status' + status[0].toUpperCase() + status.slice(1)] || t[status] || status;
  return <Badge tone={tone} dot>{label}</Badge>;
};

// ────────────────────────────────────────────────────────────
// AppShell — mobile chrome wrapper (replaces android default app bar)
// ────────────────────────────────────────────────────────────
const MobileShell = ({ title, kicker, leading, trailing, children, footer, scroll = true, bare = false, variant }) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
    {!bare && (
      <div style={{
        padding: '14px 16px 12px',
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--line)',
      }}>
        {leading || <Logo size={22} variant={variant}/>}
        <div style={{ flex: 1 }}>
          {kicker && <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{kicker}</div>}
          {title && <div className="serif" style={{ fontSize: 19, color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.1 }}>{title}</div>}
        </div>
        {trailing}
      </div>
    )}
    <div style={{ flex: 1, overflow: scroll ? 'auto' : 'hidden' }}>
      {children}
    </div>
    {footer}
  </div>
);

// ────────────────────────────────────────────────────────────
// AUTH — Login (mobile)
// ────────────────────────────────────────────────────────────
const AuthLogin = ({ t, variant }) => (
  <div style={{ height: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column', padding: 24 }}>
    <div style={{ paddingTop: 24, marginBottom: 48 }}>
      <Logo size={26} variant={variant}/>
    </div>
    <div style={{ marginBottom: 32 }}>
      <div className="display" style={{ fontSize: 36, color: 'var(--ink)', marginBottom: 10, lineHeight: 1.05 }}>
        {t.welcomeBack}
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.5 }}>
        {t.signInSub}
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field label={t.email}>
        <Input value="ricardo@informagestudios.com" placeholder="you@informagestudios.com"/>
      </Field>
      <Field label={t.password}>
        <Input value="••••••••••••" type="password"/>
      </Field>
      <a href="#" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', alignSelf: 'flex-start' }}>
        {t.forgotPassword}
      </a>
      <Btn full size="lg" trailing={<Icon name="arrow-right" size={16}/>}>{t.signIn}</Btn>
    </div>
    <div style={{ flex: 1 }}/>
    <div style={{ fontSize: 12, color: 'var(--ink-4)', textAlign: 'center', paddingTop: 24 }}>
      {t.tagline}
    </div>
  </div>
);

const AuthAcceptInvite = ({ t, variant }) => (
  <div style={{ height: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column', padding: 24 }}>
    <div style={{ paddingTop: 24, marginBottom: 32 }}>
      <Logo size={26} variant={variant}/>
    </div>
    <div style={{ marginBottom: 28 }}>
      <Badge tone="accent">{t.invited}</Badge>
      <div className="display" style={{ fontSize: 32, color: 'var(--ink)', marginTop: 14, lineHeight: 1.05 }}>
        {t.acceptInvite}
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.5, marginTop: 8 }}>
        {t.acceptInviteSub} <span style={{ color: 'var(--ink)', fontWeight: 500 }}>Informage Studios</span>.
      </div>
    </div>

    <Card padded style={{ marginBottom: 20, background: 'var(--bg-sunken)', border: '1px dashed var(--line-strong)' }}>
      <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        {t.project}
      </div>
      <div className="serif" style={{ fontSize: 19, color: 'var(--ink)', marginBottom: 12 }}>Atlas Banking</div>
      <Divider style={{ margin: '12px 0', background: 'var(--line-strong)' }}/>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <span style={{ color: 'var(--ink-3)' }}>{t.paymentType}</span>
        <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{t.hourly} · 20 USD/h</span>
      </div>
    </Card>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label={t.fullName}><Input value="Sofía Henao"/></Field>
      <Field label={t.setPassword} hint="Mínimo 8 caracteres"><Input value="" type="password" placeholder="••••••••"/></Field>
      <Btn full size="lg">{t.createAccount}</Btn>
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────
// ADMIN — Dashboard (mobile)
// ────────────────────────────────────────────────────────────
const AdminDashboard = ({ t, variant, onNav }) => (
  <MobileShell
    variant={variant}
    leading={<Logo size={22} variant={variant}/>}
    trailing={<><IconBtn label="search"><Icon name="search" size={20}/></IconBtn><IconBtn label="bell"><Icon name="bell" size={20}/></IconBtn></>}
    footer={<TabBar items={[
      { id: 'home', icon: 'home', label: t.home },
      { id: 'users', icon: 'users', label: t.users },
      { id: 'projects', icon: 'folder', label: t.projects },
      { id: 'invoices', icon: 'invoice', label: t.invoices },
    ]} active="home" onChange={onNav || (()=>{})}/>}
  >
    <div style={{ padding: '16px 16px 24px' }}>
      {/* Hero */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          Abril · 2026
        </div>
        <div className="display" style={{ fontSize: 30, color: 'var(--ink)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          Buen día, María.
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 6 }}>
          Faltan <span style={{ color: 'var(--accent)', fontWeight: 500 }}>4 facturas</span> por recibir este mes.
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
        <Card padded={false} style={{ padding: 14 }}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.activeUsers}</div>
          <div className="display" style={{ fontSize: 30, color: 'var(--ink)', marginTop: 4 }}>14</div>
        </Card>
        <Card padded={false} style={{ padding: 14 }}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.invoicesPending}</div>
          <div className="display" style={{ fontSize: 30, color: 'var(--accent)', marginTop: 4 }}>4</div>
        </Card>
        <Card padded={false} style={{ padding: 14 }}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.invoicesGenerated}</div>
          <div className="display" style={{ fontSize: 30, color: 'var(--ink)', marginTop: 4 }}>10</div>
        </Card>
        <Card padded={false} style={{ padding: 14 }}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.invoicesPaid}</div>
          <div className="display" style={{ fontSize: 30, color: 'var(--ink)', marginTop: 4 }}>6</div>
        </Card>
      </div>

      {/* CTA */}
      <Card padded style={{ background: 'var(--ink)', color: 'var(--ink-inverse)', border: 'none', marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: 'rgba(251,247,240,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          {t.upcomingDeadline}
        </div>
        <div className="serif" style={{ fontSize: 22, marginBottom: 4, color: 'var(--ink-inverse)' }}>
          30 abr · 23:59
        </div>
        <div style={{ fontSize: 13, color: 'rgba(251,247,240,0.7)', marginBottom: 16, lineHeight: 1.5 }}>
          Solicita las facturas pendientes de los 4 colaboradores que aún no han enviado la suya.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="primary" size="sm" leading={<Icon name="send" size={14}/>}>{t.requestAll}</Btn>
        </div>
      </Card>

      {/* Recent activity */}
      <SectionTitle title={t.recentActivity} action={<a href="#" style={{ fontSize: 12, color: 'var(--accent)' }}>Ver todas</a>}/>
      <Card padded={false}>
        {[
          { ico: 'invoice', who: 'Camila Ortiz', what: 'envió factura', when: 'hace 12 min', amt: '3,200 USD' },
          { ico: 'check',   who: 'Diego Restrepo', what: 'factura aprobada', when: 'hace 1 h', amt: '2,500 USD' },
          { ico: 'mail-send', who: 'María Acosta', what: 'solicitó facturas a 6', when: 'hace 3 h', amt: '' },
          { ico: 'hash',    who: 'Ricardo Castaño', what: 'pidió cambio de número', when: 'ayer', amt: '' },
        ].map((it, i, arr) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--bg-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}>
              <Icon name={it.ico} size={16}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.3 }}>
                <span style={{ fontWeight: 500 }}>{it.who}</span> {it.what}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{it.when}</div>
            </div>
            {it.amt && <span className="mono tabular" style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{it.amt}</span>}
          </div>
        ))}
      </Card>
    </div>
  </MobileShell>
);

// ────────────────────────────────────────────────────────────
// ADMIN — Users list (mobile)
// ────────────────────────────────────────────────────────────
const AdminUsers = ({ t, variant }) => (
  <MobileShell
    variant={variant}
    title={t.users}
    kicker="Admin"
    trailing={<IconBtn label="add"><Icon name="plus" size={20}/></IconBtn>}
    footer={<TabBar items={[
      { id: 'home', icon: 'home', label: t.home },
      { id: 'users', icon: 'users', label: t.users },
      { id: 'projects', icon: 'folder', label: t.projects },
      { id: 'invoices', icon: 'invoice', label: t.invoices },
    ]} active="users" onChange={()=>{}}/>}
  >
    <div style={{ padding: 16 }}>
      <Input leading={<Icon name="search" size={16}/>} placeholder={t.search} value=""/>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto', paddingBottom: 4 }}>
        {[t.all, t.active, t.invited, t.hourly, t.fixed].map((c, i) => (
          <Badge key={c} tone={i === 0 ? 'accent' : 'outline'} style={{ flexShrink: 0, padding: '6px 12px' }}>{c}</Badge>
        ))}
      </div>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SAMPLE.users.map(u => (
          <Card key={u.id} padded={false} style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={u.name} size={42}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--ink)' }}>{u.name}</span>
                <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', padding: '1px 6px', background: 'var(--bg-sunken)', borderRadius: 4 }}>{u.code}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {u.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <StatusPill status={u.status} t={t}/>
                <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>· {u.projects} {t.projects.toLowerCase()}</span>
              </div>
            </div>
            <Icon name="chev-right" size={16} color="var(--ink-3)"/>
          </Card>
        ))}
      </div>
    </div>
  </MobileShell>
);

// ────────────────────────────────────────────────────────────
// ADMIN — Invite user (mobile)
// ────────────────────────────────────────────────────────────
const AdminInviteUser = ({ t, variant }) => (
  <MobileShell
    variant={variant}
    title={t.inviteUser}
    leading={<IconBtn label="back"><Icon name="arrow-left" size={20}/></IconBtn>}
    footer={
      <div style={{ padding: 14, background: 'var(--bg-elev)', borderTop: '1px solid var(--line)', display: 'flex', gap: 10 }}>
        <Btn variant="outline" full size="lg">{t.cancel}</Btn>
        <Btn full size="lg" leading={<Icon name="send" size={16}/>}>Enviar invitación</Btn>
      </div>
    }
  >
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field label={t.fullName}><Input placeholder="Nombre y apellido" value=""/></Field>
      <Field label={t.email}><Input placeholder="correo@informagestudios.com" value=""/></Field>
      <Field label={t.userCode} hint="3 letras · se usa en el número de factura"><Input value="" placeholder="RCA"/></Field>

      <Divider style={{ margin: '8px 0' }}/>
      <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Asignación inicial
      </div>

      <Field label={t.project}>
        <Select value="p1" options={SAMPLE.projects.map(p => ({ value: p.id, label: p.name }))}/>
      </Field>

      <Field label={t.paymentType}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button style={{
            padding: 14, border: '1.5px solid var(--accent)', borderRadius: 'var(--radius-md)',
            background: 'var(--accent-soft)', textAlign: 'left', cursor: 'pointer', position: 'relative',
          }}>
            <Icon name="clock" size={18} color="var(--accent)"/>
            <div style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 500, marginTop: 8 }}>{t.hourly}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>Cobra por horas registradas</div>
          </button>
          <button style={{
            padding: 14, border: '1px solid var(--line)', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elev)', textAlign: 'left', cursor: 'pointer',
          }}>
            <Icon name="calendar" size={18} color="var(--ink-3)"/>
            <div style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 500, marginTop: 8 }}>{t.fixed}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>Tarifa mensual fija</div>
          </button>
        </div>
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
        <Field label={t.rate + ' / hora'}><Input value="20" trailing={<span style={{ fontSize: 12 }}>USD</span>}/></Field>
        <Field label={t.currency}><Select value="USD" options={['USD', 'COP', 'EUR']}/></Field>
      </div>
    </div>
  </MobileShell>
);

// ────────────────────────────────────────────────────────────
// ADMIN — Projects list + detail
// ────────────────────────────────────────────────────────────
const AdminProjects = ({ t, variant }) => (
  <MobileShell
    variant={variant}
    title={t.projects}
    kicker="Admin"
    trailing={<IconBtn label="add"><Icon name="plus" size={20}/></IconBtn>}
    footer={<TabBar items={[
      { id: 'home', icon: 'home', label: t.home },
      { id: 'users', icon: 'users', label: t.users },
      { id: 'projects', icon: 'folder', label: t.projects },
      { id: 'invoices', icon: 'invoice', label: t.invoices },
    ]} active="projects" onChange={()=>{}}/>}
  >
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SAMPLE.projects.map(p => (
          <Card key={p.id} padded style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="serif" style={{ fontSize: 19, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{p.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 4, lineHeight: 1.5 }}>{p.desc}</div>
              </div>
              <StatusPill status={p.status} t={t}/>
            </div>
            <Divider style={{ margin: '14px 0' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.members}</div>
                <div className="mono tabular" style={{ fontSize: 18, color: 'var(--ink)', marginTop: 2 }}>{p.members}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.hoursLogged}</div>
                <div className="mono tabular" style={{ fontSize: 18, color: 'var(--ink)', marginTop: 2 }}>{p.hours}h</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </MobileShell>
);

const AdminProjectDetail = ({ t, variant }) => {
  const proj = SAMPLE.projects[0];
  return (
    <MobileShell
      variant={variant}
      leading={<IconBtn label="back"><Icon name="arrow-left" size={20}/></IconBtn>}
      trailing={<IconBtn label="edit"><Icon name="more" size={20}/></IconBtn>}
    >
      <div style={{ padding: 16 }}>
        <Badge tone="success" dot>{t.active}</Badge>
        <div className="display" style={{ fontSize: 30, color: 'var(--ink)', marginTop: 10, letterSpacing: '-0.02em' }}>
          {proj.name}
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 6, lineHeight: 1.5 }}>
          {proj.desc}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 18 }}>
          <Card padded={false} style={{ padding: 12, textAlign: 'center' }}>
            <div className="mono tabular display" style={{ fontSize: 22, color: 'var(--ink)' }}>6</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{t.members}</div>
          </Card>
          <Card padded={false} style={{ padding: 12, textAlign: 'center' }}>
            <div className="mono tabular display" style={{ fontSize: 22, color: 'var(--ink)' }}>412h</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>Mes</div>
          </Card>
          <Card padded={false} style={{ padding: 12, textAlign: 'center' }}>
            <div className="mono tabular display" style={{ fontSize: 22, color: 'var(--accent)' }}>$8.4k</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>Facturado</div>
          </Card>
        </div>

        <SectionTitle title={t.members} action={<Btn size="sm" variant="outline" leading={<Icon name="plus" size={12}/>}>{t.addMember}</Btn>} style={{ marginTop: 28 }}/>

        <Card padded={false}>
          {SAMPLE.users.filter(u => u.status === 'active').slice(0, 4).map((u, i, arr) => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <Avatar name={u.name} size={36}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }}>{u.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>
                  {u.type === 'fixed' ? 'Fijo · 2,500 USD/mes' : '20 USD/h'}
                </div>
              </div>
              <Icon name="chev-right" size={16} color="var(--ink-3)"/>
            </div>
          ))}
        </Card>
      </div>
    </MobileShell>
  );
};

// ────────────────────────────────────────────────────────────
// ADMIN — Invoice requests (mobile)
// ────────────────────────────────────────────────────────────
const AdminInvoiceRequests = ({ t, variant }) => (
  <MobileShell
    variant={variant}
    title={t.requests}
    kicker="Admin · Abril 2026"
    leading={<IconBtn label="back"><Icon name="arrow-left" size={20}/></IconBtn>}
    footer={
      <div style={{ padding: 14, background: 'var(--bg-elev)', borderTop: '1px solid var(--line)', display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-2)' }}>
          <span className="mono tabular" style={{ color: 'var(--ink)', fontWeight: 600 }}>4</span> {t.selected}
        </div>
        <Btn size="lg" leading={<Icon name="send" size={16}/>}>Enviar correos</Btn>
      </div>
    }
  >
    <div style={{ padding: '16px 16px 0' }}>
      <Card padded style={{ background: 'var(--bg-sunken)', border: '1px solid var(--line)', marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 6 }}>Plantilla del correo</div>
        <div className="serif" style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1.4 }}>
          "Hola [Nombre], es momento de generar tu factura del periodo 1–30 de abril. Entra a invoxa para completarla."
        </div>
        <a href="#" style={{ fontSize: 12, color: 'var(--accent)', marginTop: 10, display: 'inline-block' }}>Editar plantilla →</a>
      </Card>

      <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
        Pendientes · {SAMPLE.users.filter(u => u.status === 'active').length} colaboradores
      </div>
    </div>
    <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {SAMPLE.users.filter(u => u.status === 'active').slice(0, 5).map((u, i) => {
        const checked = i < 4;
        return (
          <Card key={u.id} padded={false} style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12,
            border: checked ? '1.5px solid var(--accent)' : '1px solid var(--line)',
            background: checked ? 'var(--accent-soft)' : 'var(--bg-elev)',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: checked ? 'var(--accent)' : 'var(--bg-elev)',
              border: checked ? 'none' : '1.5px solid var(--line-strong)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {checked && <Icon name="check" size={14} color="#fff" strokeWidth={2.5}/>}
            </div>
            <Avatar name={u.name} size={36}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }}>{u.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{u.type === 'fixed' ? t.fixed : u.type === 'mixed' ? 'Mixto' : t.hourly}</div>
            </div>
            {i < 2 && <Badge tone="warn">{t.pending}</Badge>}
          </Card>
        );
      })}
    </div>
  </MobileShell>
);

// ────────────────────────────────────────────────────────────
// ADMIN — Invoices list (mobile)
// ────────────────────────────────────────────────────────────
const AdminInvoicesList = ({ t, variant }) => (
  <MobileShell
    variant={variant}
    title={t.invoices}
    kicker="Admin · Todas"
    trailing={<IconBtn label="filter"><Icon name="filter" size={20}/></IconBtn>}
    footer={<TabBar items={[
      { id: 'home', icon: 'home', label: t.home },
      { id: 'users', icon: 'users', label: t.users },
      { id: 'projects', icon: 'folder', label: t.projects },
      { id: 'invoices', icon: 'invoice', label: t.invoices },
    ]} active="invoices" onChange={()=>{}}/>}
  >
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 14 }}>
        {['Todas', 'Generadas', 'Aprobadas', 'Pagadas', 'Rechazadas'].map((c, i) => (
          <Badge key={c} tone={i === 0 ? 'accent' : 'outline'} style={{ flexShrink: 0, padding: '6px 12px' }}>{c}</Badge>
        ))}
      </div>

      <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
        Abril · 2026
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SAMPLE.invoices.filter(i => i.period.includes('Abril')).map(inv => (
          <Card key={inv.id} padded={false} style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)', letterSpacing: '0.02em' }}>{inv.number}</div>
                <div style={{ fontSize: 14.5, color: 'var(--ink)', fontWeight: 500, marginTop: 3 }}>{inv.user}</div>
              </div>
              <StatusPill status={inv.status} t={t}/>
            </div>
            <Divider/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{inv.projects} proyecto{inv.projects > 1 ? 's' : ''} · {inv.period}</div>
              <div className="mono tabular" style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500 }}>
                {fmt$(inv.amount, inv.currency)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </MobileShell>
);

// ────────────────────────────────────────────────────────────
// ADMIN — Invoice detail (mobile)
// ────────────────────────────────────────────────────────────
const AdminInvoiceDetail = ({ t, variant }) => {
  const inv = SAMPLE.invoices[0];
  return (
    <MobileShell
      variant={variant}
      leading={<IconBtn label="back"><Icon name="arrow-left" size={20}/></IconBtn>}
      trailing={<><IconBtn label="download"><Icon name="download" size={18}/></IconBtn><IconBtn label="more"><Icon name="more" size={18}/></IconBtn></>}
      footer={
        <div style={{ padding: 14, background: 'var(--bg-elev)', borderTop: '1px solid var(--line)', display: 'flex', gap: 10 }}>
          <Btn variant="outline" full size="lg" leading={<Icon name="x" size={16}/>}>{t.reject}</Btn>
          <Btn full size="lg" leading={<Icon name="check" size={16}/>}>{t.approve}</Btn>
        </div>
      }
    >
      <div style={{ padding: 16 }}>
        <StatusPill status={inv.status} t={t}/>
        <div className="mono" style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 12, letterSpacing: '0.02em' }}>
          {inv.number}
        </div>
        <div className="display" style={{ fontSize: 30, color: 'var(--ink)', marginTop: 6, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
          {fmt$(inv.amount, inv.currency)}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
          {inv.user} · {inv.period}
        </div>

        <Card padded style={{ marginTop: 18 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            {t.breakdown}
          </div>
          {[
            { p: 'Atlas Banking', desc: '60h × 20 USD', total: 1200, type: 'hourly' },
            { p: 'Helio Health', desc: 'Mensual · abril', total: 800, type: 'fixed' },
          ].map((it, i, arr) => (
            <div key={i} style={{ paddingBottom: i < arr.length - 1 ? 12 : 0, paddingTop: i > 0 ? 12 : 0, borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{it.p}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{it.desc} · <Badge tone="outline" style={{ padding: '1px 8px', fontSize: 9.5 }}>{it.type}</Badge></div>
                </div>
                <div className="mono tabular" style={{ fontSize: 14, color: 'var(--ink)' }}>{fmt$(it.total, 'USD')}</div>
              </div>
            </div>
          ))}
          <Divider style={{ marginTop: 16, marginBottom: 12 }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
            <span style={{ color: 'var(--ink-3)' }}>{t.subtotal}</span>
            <span className="mono tabular" style={{ color: 'var(--ink)' }}>{fmt$(2000, 'USD')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10 }}>
            <span style={{ color: 'var(--ink-3)' }}>{t.taxes}</span>
            <span className="mono tabular" style={{ color: 'var(--ink-3)' }}>—</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--line)' }}>
            <span className="serif" style={{ fontSize: 17, color: 'var(--ink)' }}>{t.total}</span>
            <span className="mono tabular" style={{ fontSize: 19, color: 'var(--ink)', fontWeight: 600 }}>{fmt$(2000, 'USD')}</span>
          </div>
        </Card>

        <Card padded style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {t.notes}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55 }}>
            Trabajo durante el mes en Atlas Banking (sistema de tablas y onboarding) y Helio Health (visual del marketing site). Todas las tareas con horas detalladas.
          </div>
        </Card>

        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>
          <Icon name="pdf" size={16}/> Ver PDF generado
        </a>
      </div>
    </MobileShell>
  );
};

// ────────────────────────────────────────────────────────────
// ADMIN — Number change requests
// ────────────────────────────────────────────────────────────
const AdminNumberChangeRequests = ({ t, variant }) => (
  <MobileShell
    variant={variant}
    title={t.changeRequests}
    kicker="Admin"
    leading={<IconBtn label="back"><Icon name="arrow-left" size={20}/></IconBtn>}
  >
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {SAMPLE.numberChangeRequests.map(r => (
        <Card key={r.id} padded>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }}>{r.user}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{r.date}</div>
            </div>
            <StatusPill status={r.status} t={t}/>
          </div>
          <div style={{ background: 'var(--bg-sunken)', borderRadius: 'var(--radius-sm)', padding: 12, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>{t.current}</div>
                <div className="mono" style={{ color: 'var(--ink-2)', marginTop: 2, textDecoration: 'line-through' }}>{r.current}</div>
              </div>
              <Icon name="arrow-right" size={14} color="var(--ink-3)"/>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>{t.proposed}</div>
                <div className="mono" style={{ color: 'var(--accent)', marginTop: 2, fontWeight: 600 }}>{r.proposed}</div>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: 12, fontStyle: 'italic' }}>
            "{r.reason}"
          </div>
          {r.status === 'pending' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn variant="outline" size="sm" full>{t.reject}</Btn>
              <Btn size="sm" full>{t.approve}</Btn>
            </div>
          )}
        </Card>
      ))}
    </div>
  </MobileShell>
);

// ────────────────────────────────────────────────────────────
// USER — Dashboard
// ────────────────────────────────────────────────────────────
const UserDashboard = ({ t, variant }) => (
  <MobileShell
    variant={variant}
    leading={<Logo size={22} variant={variant}/>}
    trailing={<><IconBtn label="bell"><Icon name="bell" size={20}/></IconBtn><Avatar name="Ricardo Castaño" size={32}/></>}
    footer={<TabBar items={[
      { id: 'home', icon: 'home', label: t.home },
      { id: 'tasks', icon: 'clock', label: t.tasks },
      { id: 'invoices', icon: 'invoice', label: t.invoices },
      { id: 'profile', icon: 'user', label: t.profile },
    ]} active="home" onChange={()=>{}}/>}
  >
    <div style={{ padding: '12px 16px 24px' }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          Abril · 2026
        </div>
        <div className="display" style={{ fontSize: 30, color: 'var(--ink)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          Hola, Ricardo.
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 6 }}>
          Es momento de generar tu factura mensual.
        </div>
      </div>

      {/* Hero: generate invoice card */}
      <Card padded style={{ background: 'var(--accent)', color: 'var(--accent-ink)', border: 'none', marginBottom: 18, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, top: -30, opacity: 0.16 }}>
          <Icon name="invoice" size={140} color="#fff" strokeWidth={1}/>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            {t.invoiceNumber}
          </div>
          <div className="mono" style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginBottom: 16, letterSpacing: '0.02em' }}>
            INF-RCA-2026-0004 · siguiente
          </div>
          <div className="display" style={{ fontSize: 28, color: '#fff', marginBottom: 6, lineHeight: 1.1 }}>
            2,000 USD
          </div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.8)', marginBottom: 18 }}>
            Estimado · 2 proyectos · 60h + fijo
          </div>
          <Btn variant="ink" size="md" trailing={<Icon name="arrow-right" size={14}/>}>
            {t.generateInvoice}
          </Btn>
        </div>
      </Card>

      {/* Active projects */}
      <SectionTitle title="Mis proyectos" action={<span style={{ fontSize: 12, color: 'var(--ink-3)' }}>2 activos</span>}/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {[
          { n: 'Atlas Banking', mode: 'Por hora · 20 USD', stat: '60h', sub: 'este mes' },
          { n: 'Helio Health', mode: 'Fijo · 800 USD/mes', stat: '$800', sub: 'abril' },
        ].map((p, i) => (
          <Card key={i} padded={false} style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-sm)', background: 'var(--bg-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}>
              <Icon name="folder" size={18}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{p.n}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{p.mode}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono tabular" style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{p.stat}</div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{p.sub}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <SectionTitle title="Acceso rápido"/>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Card padded={false} style={{ padding: 14, cursor: 'pointer' }}>
          <Icon name="plus" size={18} color="var(--accent)"/>
          <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500, marginTop: 8 }}>Registrar tarea</div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>Atlas Banking</div>
        </Card>
        <Card padded={false} style={{ padding: 14, cursor: 'pointer' }}>
          <Icon name="user" size={18} color="var(--ink-2)"/>
          <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500, marginTop: 8 }}>Perfil de facturación</div>
          <div style={{ fontSize: 11, color: 'var(--success)', marginTop: 2 }}>Completo</div>
        </Card>
      </div>
    </div>
  </MobileShell>
);

// ────────────────────────────────────────────────────────────
// USER — Tasks list
// ────────────────────────────────────────────────────────────
const UserTasks = ({ t, variant }) => (
  <MobileShell
    variant={variant}
    title={t.tasks}
    kicker="Abril 2026"
    trailing={<IconBtn label="add"><Icon name="plus" size={20}/></IconBtn>}
    footer={<TabBar items={[
      { id: 'home', icon: 'home', label: t.home },
      { id: 'tasks', icon: 'clock', label: t.tasks },
      { id: 'invoices', icon: 'invoice', label: t.invoices },
      { id: 'profile', icon: 'user', label: t.profile },
    ]} active="tasks" onChange={()=>{}}/>}
  >
    <div style={{ padding: 16 }}>
      <Card padded style={{ marginBottom: 16, background: 'var(--bg-sunken)', border: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.totalHours}</div>
            <div className="display mono tabular" style={{ fontSize: 32, color: 'var(--ink)', marginTop: 2 }}>28.5<span style={{ fontSize: 18, color: 'var(--ink-3)' }}>h</span></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Estimado</div>
            <div className="display mono tabular" style={{ fontSize: 32, color: 'var(--accent)', marginTop: 2 }}>$570</div>
          </div>
        </div>
      </Card>

      <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
        Esta semana
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SAMPLE.tasks.slice(0, 5).map(task => (
          <Card key={task.id} padded={false} style={{ padding: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 500, lineHeight: 1.3 }}>{task.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <Badge tone="outline" style={{ padding: '1px 8px', fontSize: 9.5 }}>{task.project}</Badge>
                  <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{task.date.slice(5)}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="mono tabular" style={{ fontSize: 16, color: 'var(--ink)' }}>{task.hours}h</div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{fmt$(task.hours * 20, 'USD')}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </MobileShell>
);

const UserNewTask = ({ t, variant }) => (
  <MobileShell
    variant={variant}
    title={t.newTask}
    leading={<IconBtn label="back"><Icon name="x" size={20}/></IconBtn>}
    footer={
      <div style={{ padding: 14, background: 'var(--bg-elev)', borderTop: '1px solid var(--line)' }}>
        <Btn full size="lg" leading={<Icon name="check" size={16}/>}>{t.saveTask}</Btn>
      </div>
    }
  >
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field label={t.taskName}><Input value="Iconografía custom (12 iconos)" placeholder="¿En qué trabajaste?"/></Field>
      <Field label={t.project}><Select value="p2" options={SAMPLE.projects.slice(0, 2).map(p => ({ value: p.id, label: p.name }))}/></Field>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
        <Field label={t.date}><Input value="2026-04-26" leading={<Icon name="calendar" size={14}/>}/></Field>
        <Field label={t.hours}><Input value="5.5" trailing={<span style={{ fontSize: 12, color: 'var(--ink-3)' }}>h</span>}/></Field>
      </div>
      <Field label={t.description}>
        <textarea defaultValue="12 iconos custom para el módulo de pacientes y agenda. Estilo line, 20px stroke 1.5." style={{
          minHeight: 80, padding: 12, border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-elev)', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)',
          resize: 'vertical', outline: 'none',
        }}/>
      </Field>
      <Card padded style={{ background: 'var(--bg-sunken)', border: '1px dashed var(--line-strong)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="sparkle" size={18} color="var(--accent)"/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12.5, color: 'var(--ink)', fontWeight: 500 }}>Subtotal estimado</div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>5.5h × 20 USD</div>
        </div>
        <div className="mono tabular display" style={{ fontSize: 22, color: 'var(--accent)' }}>$110</div>
      </Card>
    </div>
  </MobileShell>
);

// ────────────────────────────────────────────────────────────
// USER — Generate invoice (multi-step)
// ────────────────────────────────────────────────────────────
const UserGenerateInvoice = ({ t, variant }) => (
  <MobileShell
    variant={variant}
    title={t.generateInvoice}
    kicker="Paso 2 de 3"
    leading={<IconBtn label="back"><Icon name="arrow-left" size={20}/></IconBtn>}
    footer={
      <div style={{ padding: 14, background: 'var(--bg-elev)', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.total}</div>
          <div className="mono tabular display" style={{ fontSize: 22, color: 'var(--ink)' }}>$2,000 <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>USD</span></div>
        </div>
        <Btn size="lg" trailing={<Icon name="arrow-right" size={14}/>}>{t.confirmGenerate}</Btn>
      </div>
    }
  >
    <div style={{ padding: 16 }}>
      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
        {[
          { l: 'Periodo', done: true },
          { l: 'Revisar', done: false, active: true },
          { l: 'Confirmar', done: false },
        ].map((s, i, arr) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: s.active || s.done ? 'var(--ink)' : 'var(--ink-3)' }}>
              <div style={{
                width: 22, height: 22, borderRadius: 999, fontSize: 11, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: s.done ? 'var(--accent)' : s.active ? 'var(--ink)' : 'var(--bg-muted)',
                color: s.done || s.active ? '#fff' : 'var(--ink-3)',
              }}>
                {s.done ? <Icon name="check" size={12} strokeWidth={3}/> : i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: s.active ? 600 : 400 }}>{s.l}</span>
            </div>
            {i < arr.length - 1 && <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>}
          </React.Fragment>
        ))}
      </div>

      <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        {t.period}
      </div>
      <Card padded style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="serif" style={{ fontSize: 19, color: 'var(--ink)' }}>Abril 2026</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>1 — 30 abr</div>
        </div>
        <Icon name="edit" size={16} color="var(--ink-3)"/>
      </Card>

      <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        {t.includedProjects}
      </div>
      <Card padded={false} style={{ marginBottom: 16 }}>
        {[
          { p: 'Atlas Banking', q: '60h × 20 USD', tot: 1200, type: 'Por hora' },
          { p: 'Helio Health', q: 'Mensual abril', tot: 800, type: 'Fijo' },
        ].map((it, i, arr) => (
          <div key={i} style={{ padding: 14, borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{it.p}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 3 }}>{it.q} · <Badge tone="outline" style={{ padding: '1px 8px', fontSize: 9.5 }}>{it.type}</Badge></div>
              </div>
              <div className="mono tabular" style={{ fontSize: 15, color: 'var(--ink)' }}>{fmt$(it.tot, 'USD')}</div>
            </div>
          </div>
        ))}
      </Card>

      <Field label={t.notes} hint="Visible en el PDF y para el admin" style={{ marginBottom: 16 }}>
        <textarea defaultValue="Trabajo del mes en Atlas Banking (sistema de tablas + onboarding) y Helio Health (visual del marketing site)." style={{
          minHeight: 80, padding: 12, border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-elev)', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)',
          resize: 'vertical', outline: 'none',
        }}/>
      </Field>
    </div>
  </MobileShell>
);

// ────────────────────────────────────────────────────────────
// USER — Invoices list
// ────────────────────────────────────────────────────────────
const UserInvoices = ({ t, variant }) => (
  <MobileShell
    variant={variant}
    title={t.invoices}
    kicker="Mi historial"
    footer={<TabBar items={[
      { id: 'home', icon: 'home', label: t.home },
      { id: 'tasks', icon: 'clock', label: t.tasks },
      { id: 'invoices', icon: 'invoice', label: t.invoices },
      { id: 'profile', icon: 'user', label: t.profile },
    ]} active="invoices" onChange={()=>{}}/>}
  >
    <div style={{ padding: 16 }}>
      <Card padded style={{ background: 'var(--bg-sunken)', border: '1px solid var(--line)', marginBottom: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>2026 · Total facturado</div>
        <div className="display mono tabular" style={{ fontSize: 36, color: 'var(--ink)', marginTop: 6 }}>$7,800</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>4 facturas · USD</div>
      </Card>

      <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
        Recientes
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SAMPLE.invoices.filter(i => i.code === 'RCA').map(inv => (
          <Card key={inv.id} padded style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{inv.number}</div>
                <div className="serif" style={{ fontSize: 17, color: 'var(--ink)', marginTop: 2 }}>{inv.period}</div>
              </div>
              <StatusPill status={inv.status} t={t}/>
            </div>
            <Divider/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <div className="mono tabular" style={{ fontSize: 17, color: 'var(--ink)', fontWeight: 600 }}>{fmt$(inv.amount)}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <IconBtn size={32}><Icon name="eye" size={16}/></IconBtn>
                <IconBtn size={32}><Icon name="download" size={16}/></IconBtn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </MobileShell>
);

// ────────────────────────────────────────────────────────────
// USER — Billing profile
// ────────────────────────────────────────────────────────────
const UserBillingProfile = ({ t, variant }) => (
  <MobileShell
    variant={variant}
    title={t.billingProfile}
    kicker="Mi perfil"
    leading={<IconBtn label="back"><Icon name="arrow-left" size={20}/></IconBtn>}
    footer={
      <div style={{ padding: 14, background: 'var(--bg-elev)', borderTop: '1px solid var(--line)' }}>
        <Btn full size="lg">{t.save}</Btn>
      </div>
    }
  >
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <Avatar name="Ricardo Castaño" size={56}/>
        <div>
          <div style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500 }}>Ricardo Castaño</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>ricardo@informagestudios.com</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>
            <Badge tone="success" dot>Perfil completo</Badge>
          </div>
        </div>
      </div>

      <SectionTitle kicker="Datos fiscales" title="Identificación"/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        <Field label={t.legalName}><Input value="Ricardo Castaño Acevedo"/></Field>
        <Field label={t.taxId}><Input value="1.020.123.456"/></Field>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
          <Field label={t.city}><Input value="Medellín"/></Field>
          <Field label={t.country}><Select value="CO" options={[{ value: 'CO', label: 'Colombia' }, { value: 'MX', label: 'México' }, { value: 'US', label: 'EE.UU.' }]}/></Field>
        </div>
        <Field label={t.address}><Input value="Cra 43A #5A-113, El Poblado"/></Field>
      </div>

      <SectionTitle kicker="Pago" title="Datos bancarios"/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        <Field label={t.bankName}><Input value="Bancolombia" leading={<Icon name="building" size={14}/>}/></Field>
        <Field label={t.bankAccount}><Input value="•••• •••• 4827" leading={<Icon name="card" size={14}/>}/></Field>
      </div>

      <SectionTitle kicker="Por defecto" title="Observaciones"/>
      <Field label={t.defaultNotes} hint="Aparecerán pre-llenadas en cada nueva factura">
        <textarea defaultValue="Pago a 30 días. Por favor confirmar recepción al correo." style={{
          minHeight: 70, padding: 12, border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-elev)', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)',
          resize: 'vertical', outline: 'none',
        }}/>
      </Field>
    </div>
  </MobileShell>
);

// ────────────────────────────────────────────────────────────
// USER — Request number change
// ────────────────────────────────────────────────────────────
const UserRequestNumberChange = ({ t, variant }) => (
  <MobileShell
    variant={variant}
    title={t.requestNumberChange}
    leading={<IconBtn label="back"><Icon name="arrow-left" size={20}/></IconBtn>}
    footer={
      <div style={{ padding: 14, background: 'var(--bg-elev)', borderTop: '1px solid var(--line)', display: 'flex', gap: 10 }}>
        <Btn variant="outline" full size="lg">{t.cancel}</Btn>
        <Btn full size="lg" leading={<Icon name="send" size={14}/>}>{t.sendRequest}</Btn>
      </div>
    }
  >
    <div style={{ padding: 16 }}>
      <Card padded style={{ background: 'var(--warn-soft)', border: '1px solid var(--warn)', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Icon name="flag" size={18} color="var(--warn)"/>
          <div>
            <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>Requiere aprobación</div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 4, lineHeight: 1.5 }}>
              Tu solicitud quedará pendiente. María Acosta la revisará y aplicará el cambio si la aprueba.
            </div>
          </div>
        </div>
      </Card>

      <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        Factura
      </div>
      <Card padded style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span className="mono" style={{ fontSize: 13, color: 'var(--ink-2)' }}>INF-RCA-2026-0004</span>
          <StatusPill status="sent" t={t}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-3)' }}>
          <span>Abril 2026</span>
          <span className="mono tabular" style={{ color: 'var(--ink)' }}>{fmt$(2000)}</span>
        </div>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label={t.proposedNumber} hint="Mantén el formato INF-{TUS_INICIALES}-AÑO-####">
          <Input value="INF-RCA-2026-0006" leading={<Icon name="hash" size={14}/>}/>
        </Field>
        <Field label={t.reason}>
          <textarea defaultValue="Tengo una numeración paralela en mi contabilidad personal, y este número rompe la secuencia. Necesito alinear con mi consecutivo externo." style={{
            minHeight: 100, padding: 12, border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-elev)', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)',
            resize: 'vertical', outline: 'none',
          }}/>
        </Field>
      </div>
    </div>
  </MobileShell>
);

// ────────────────────────────────────────────────────────────
// PDF preview (rendered in-app)
// ────────────────────────────────────────────────────────────
const InvoicePDF = ({ variant }) => (
  <div style={{
    width: 360, minHeight: 510, background: '#fff', color: '#1a1410',
    padding: 28, fontFamily: 'var(--font-ui)', fontSize: 10.5, lineHeight: 1.45,
    boxShadow: '0 24px 60px rgba(0,0,0,0.18)', position: 'relative', overflow: 'hidden',
  }}>
    {/* Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
      <Logo size={20} variant={variant} color="#1a1410"/>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 9, color: '#7a6a58', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Invoice</div>
        <div className="mono" style={{ fontSize: 11, color: '#1a1410', marginTop: 2, fontWeight: 600 }}>INF-RCA-2026-0004</div>
      </div>
    </div>

    <div className="display" style={{ fontSize: 26, color: '#1a1410', marginBottom: 18, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
      Abril 2026
    </div>

    {/* From / To */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
      <div>
        <div style={{ fontSize: 8.5, color: '#7a6a58', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Bill from</div>
        <div style={{ fontSize: 11, color: '#1a1410', fontWeight: 500 }}>Ricardo Castaño Acevedo</div>
        <div style={{ fontSize: 9.5, color: '#4a3a2c', marginTop: 2 }}>NIT 1.020.123.456</div>
        <div style={{ fontSize: 9.5, color: '#4a3a2c' }}>Cra 43A #5A-113</div>
        <div style={{ fontSize: 9.5, color: '#4a3a2c' }}>Medellín, Colombia</div>
      </div>
      <div>
        <div style={{ fontSize: 8.5, color: '#7a6a58', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Bill to</div>
        <div style={{ fontSize: 11, color: '#1a1410', fontWeight: 500 }}>Informage Studios S.A.S.</div>
        <div style={{ fontSize: 9.5, color: '#4a3a2c', marginTop: 2 }}>NIT 901.234.567-8</div>
        <div style={{ fontSize: 9.5, color: '#4a3a2c' }}>Calle 10 #43E-25</div>
        <div style={{ fontSize: 9.5, color: '#4a3a2c' }}>Medellín, Colombia</div>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16, padding: '10px 0', borderTop: '1px solid #e6dcc6', borderBottom: '1px solid #e6dcc6' }}>
      <div>
        <div style={{ fontSize: 8.5, color: '#7a6a58', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Issue</div>
        <div className="mono" style={{ fontSize: 10.5, color: '#1a1410', marginTop: 2 }}>2026-04-30</div>
      </div>
      <div>
        <div style={{ fontSize: 8.5, color: '#7a6a58', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Period</div>
        <div className="mono" style={{ fontSize: 10.5, color: '#1a1410', marginTop: 2 }}>2026-04-01 → 04-30</div>
      </div>
      <div>
        <div style={{ fontSize: 8.5, color: '#7a6a58', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Currency</div>
        <div className="mono" style={{ fontSize: 10.5, color: '#1a1410', marginTop: 2 }}>USD</div>
      </div>
    </div>

    {/* Items table */}
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 0.6fr 0.7fr 0.9fr', fontSize: 8.5, color: '#7a6a58', textTransform: 'uppercase', letterSpacing: '0.08em', paddingBottom: 8, borderBottom: '1px solid #e6dcc6' }}>
        <span>Project</span><span>Description</span><span style={{ textAlign: 'right' }}>Qty</span><span style={{ textAlign: 'right' }}>Rate</span><span style={{ textAlign: 'right' }}>Total</span>
      </div>
      {[
        { p: 'Atlas Banking', d: 'Hourly · April', q: '60', r: '20', t: '1,200' },
        { p: 'Helio Health', d: 'Fixed · April', q: '1', r: '800', t: '800' },
      ].map((r, i) => (
        <div key={i} className="mono" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 0.6fr 0.7fr 0.9fr', fontSize: 10, color: '#1a1410', padding: '10px 0', borderBottom: '1px solid #f4ede0' }}>
          <span style={{ fontWeight: 500 }}>{r.p}</span>
          <span style={{ color: '#4a3a2c' }}>{r.d}</span>
          <span style={{ textAlign: 'right' }} className="tabular">{r.q}</span>
          <span style={{ textAlign: 'right' }} className="tabular">{r.r}</span>
          <span style={{ textAlign: 'right' }} className="tabular">{r.t}</span>
        </div>
      ))}
    </div>

    {/* Totals */}
    <div style={{ marginLeft: 'auto', width: 180, marginBottom: 18 }}>
      <div className="mono tabular" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#4a3a2c', marginBottom: 4 }}>
        <span>Subtotal</span><span>2,000.00</span>
      </div>
      <div className="mono tabular" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#4a3a2c', marginBottom: 8 }}>
        <span>Taxes</span><span>—</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #1a1410' }}>
        <span className="serif" style={{ fontSize: 13, color: '#1a1410' }}>Total</span>
        <span className="mono tabular" style={{ fontSize: 16, fontWeight: 600 }}>2,000.00 USD</span>
      </div>
    </div>

    <div style={{ background: '#fbf7f0', padding: 12, fontSize: 9.5, color: '#4a3a2c', borderRadius: 4, marginBottom: 12 }}>
      <div style={{ fontSize: 8.5, color: '#7a6a58', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Payment</div>
      Bancolombia · Cuenta de ahorros •••• 4827<br/>
      Pago a 30 días. Confirmar recepción al correo.
    </div>
  </div>
);

Object.assign(window, {
  StatusPill, MobileShell,
  AuthLogin, AuthAcceptInvite,
  AdminDashboard, AdminUsers, AdminInviteUser, AdminProjects, AdminProjectDetail,
  AdminInvoiceRequests, AdminInvoicesList, AdminInvoiceDetail, AdminNumberChangeRequests,
  UserDashboard, UserTasks, UserNewTask, UserGenerateInvoice, UserInvoices,
  UserBillingProfile, UserRequestNumberChange,
  InvoicePDF,
});
