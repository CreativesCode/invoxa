// Invoxa — 4 logo explorations
// All variants are abstract geometric symbols, designed to work at small sizes.

const LogoMarks = {
  // 1) Quarter — interlocking quarter circles forming an "X" through opposing voids
  quarter: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      <path d="M10 32a22 22 0 0 1 22-22v22H10z" fill={color}/>
      <path d="M54 32a22 22 0 0 1-22 22V32h22z" fill={color}/>
    </svg>
  ),

  // 2) Folded — two folded sheets meeting at an angled spine. Reads as "invoice" + "X"
  folded: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      <path d="M10 12h18l4 6-4 6H10z" fill={color}/>
      <path d="M54 52H36l-4-6 4-6h18z" fill={color}/>
      <path d="M28 18l-12 28h6l12-28h-6z" fill={color} opacity="0.55"/>
    </svg>
  ),

  // 3) Aperture — geometric "X" formed by two opposing chevrons, like a ledger seal
  aperture: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      <path d="M10 10l16 22L10 54V10z" fill={color}/>
      <path d="M54 10L38 32l16 22V10z" fill={color}/>
      <circle cx="32" cy="32" r="3" fill={color}/>
    </svg>
  ),

  // 4) Orbit — two circles linked by a beam, suggesting flow/connection between collaborator and studio
  orbit: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      <circle cx="20" cy="20" r="11" fill={color}/>
      <circle cx="44" cy="44" r="11" fill={color}/>
      <path d="M20 20L44 44" stroke={color} strokeWidth="5" strokeLinecap="round"/>
    </svg>
  ),

  // 5) Prism — moderno y atrevido. Una "X" geométrica diagonal cortada en bandas; sensación
  //    de prisma/factura partida en columnas. Sin contenedor, asimétrico, contemporáneo.
  prism: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      {/* Diagonal descendente — bloque sólido */}
      <path d="M8 14h12L40 50H28L8 14z" fill={color}/>
      {/* Diagonal ascendente — bloque cortado en 3 bandas para sensación de prisma */}
      <path d="M44 14h12L42 38l-6-10 8-14z" fill={color}/>
      <path d="M36 30l6 10-4 6h-12l10-16z" fill={color} opacity="0.65"/>
      <path d="M30 42l-6 8h12l2-4-8-4z" fill={color} opacity="0.4"/>
      {/* Punto pivote */}
      <circle cx="32" cy="32" r="2.5" fill={color}/>
    </svg>
  ),

  // 6) Ledger — propuesta de autor: dos columnas de un libro contable que se inclinan y se
  //    tocan en la base, formando una "V" sutil. Tipo serif suave, refinado, "humano profesional".
  //    Mezcla la página tradicional con un gesto vivo. Es la que mejor encaja con Fraunces.
  ledger: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      {/* Columna izquierda — inclinada hacia adentro */}
      <path d="M14 12 L22 12 L30 50 L22 50 Z" fill={color}/>
      {/* Columna derecha — inclinada hacia adentro */}
      <path d="M50 12 L42 12 L34 50 L42 50 Z" fill={color}/>
      {/* Lazo / cierre en la base — suaviza la V y evoca firma */}
      <path d="M22 50 Q32 56 42 50" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Línea sutil de páginas */}
      <line x1="26" y1="22" x2="38" y2="22" stroke={color} strokeWidth="1.5" opacity="0.5"/>
    </svg>
  ),

  // 7) Bracket — { } con monospaced soul. Dos llaves que abrazan un guión bajo. Para devs.
  bracket: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      <path d="M22 14c-6 0-8 3-8 8v6c0 3-2 4-4 4 2 0 4 1 4 4v6c0 5 2 8 8 8" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M42 14c6 0 8 3 8 8v6c0 3 2 4 4 4-2 0-4 1-4 4v6c0 5-2 8-8 8" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <line x1="26" y1="42" x2="38" y2="42" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
    </svg>
  ),

  // 8) Slash — comando shell. Slash diagonal vivo + cursor que titila.
  //    Refinado: trazo más grueso, cursor sólido, prompt-dots a la izquierda como "$ "
  slash: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      <path d="M42 10 L22 54" stroke={color} strokeWidth="7" strokeLinecap="round"/>
      <rect x="46" y="44" width="11" height="7" rx="1" fill={color}/>
      <circle cx="11" cy="18" r="2.5" fill={color} opacity="0.55"/>
      <circle cx="19" cy="18" r="2.5" fill={color} opacity="0.55"/>
    </svg>
  ),

  // 9) Stack — bloques apilados como commits o líneas de un PR. Vertical, técnico, ordenado.
  stack: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      <rect x="14" y="14" width="22" height="6" rx="1.5" fill={color}/>
      <rect x="14" y="24" width="36" height="6" rx="1.5" fill={color} opacity="0.65"/>
      <rect x="14" y="34" width="28" height="6" rx="1.5" fill={color}/>
      <rect x="14" y="44" width="18" height="6" rx="1.5" fill={color} opacity="0.45"/>
      <circle cx="50" cy="48" r="4" fill={color}/>
    </svg>
  ),

  // 10) Sigma — Σ matemático estilizado, suma del trabajo del mes. Editorial, atrevido, reduccionista.
  sigma: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      <path d="M48 14H18l14 18-14 18h30" stroke={color} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="48" cy="50" r="3" fill={color}/>
    </svg>
  ),

  // 11) Token — moneda + chip. Hexágono con un corte interior que evoca un bit/token de pago.
  token: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      <path d="M32 8 L52 20 L52 44 L32 56 L12 44 L12 20 Z" fill={color}/>
      <path d="M26 26 L38 26 L38 32 L26 32 Z" fill={bg === 'transparent' ? '#fbf7f0' : bg}/>
      <path d="M26 36 L34 36 L34 42 L26 42 Z" fill={bg === 'transparent' ? '#fbf7f0' : bg} opacity="0.85"/>
    </svg>
  ),

  // 12) Receipt — recibo dentado.
  receipt: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      <path d="M16 10 H48 V46 L44 50 L40 46 L36 50 L32 46 L28 50 L24 46 L20 50 L16 46 Z" fill={color}/>
      <line x1="22" y1="20" x2="42" y2="20" stroke={bg === 'transparent' ? '#fbf7f0' : bg} strokeWidth="2"/>
      <line x1="22" y1="28" x2="38" y2="28" stroke={bg === 'transparent' ? '#fbf7f0' : bg} strokeWidth="2"/>
      <line x1="22" y1="36" x2="42" y2="36" stroke={bg === 'transparent' ? '#fbf7f0' : bg} strokeWidth="3"/>
    </svg>
  ),

  // 13) Pulse — onda de señal/heartbeat. Una "x" formada por dos pulsos cruzados. Vivo, generativo.
  pulse: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      <path d="M8 32 H18 L22 22 L28 42 L32 28 L36 36 L42 24 L46 32 H56" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="32" cy="32" r="3" fill={color}/>
    </svg>
  ),

  // 14) Glyph — variable como código, slot de un input ASCII. Doble vertical con asterisco brutalista.
  glyph: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      <rect x="14" y="10" width="6" height="44" fill={color}/>
      <rect x="44" y="10" width="6" height="44" fill={color}/>
      <path d="M32 22 L32 42 M24 26 L40 38 M40 26 L24 38" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),

  // 15) Module — bloque modular asimétrico, swiss-style. Cuadrado mayor + dos ortogonales que lo cortan.
  module: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      <rect x="10" y="10" width="28" height="28" fill={color}/>
      <rect x="42" y="10" width="12" height="44" fill={color} opacity="0.55"/>
      <rect x="10" y="42" width="28" height="12" fill={color}/>
    </svg>
  ),

  // 16) Knot — nodo: cinco puntos conectados por un sólo trazo continuo. Network, trabajo distribuido.
  knot: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      <path d="M14 18 L50 46 L14 46 L50 18 L32 50 Z" stroke={color} strokeWidth="3" strokeLinejoin="round" fill="none"/>
      <circle cx="14" cy="18" r="3.5" fill={color}/>
      <circle cx="50" cy="18" r="3.5" fill={color}/>
      <circle cx="14" cy="46" r="3.5" fill={color}/>
      <circle cx="50" cy="46" r="3.5" fill={color}/>
      <circle cx="32" cy="50" r="3.5" fill={color}/>
    </svg>
  ),

  // 17) Mono — el carácter `x` en mono-grotesque, recortado. Tipográfico puro, anti-marca.
  mono: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      <path d="M14 14 L50 50 M50 14 L14 50" stroke={color} strokeWidth="9" strokeLinecap="square"/>
      <rect x="6" y="48" width="6" height="6" fill={color}/>
    </svg>
  ),

  // 18) Refract — luz pasando por una línea: una sola diagonal que se astilla en 3 colores/opacidades.
  //     Generativo, atrevido, prismático sin ser literal.
  refract: ({ size = 64, color = 'currentColor', bg = 'transparent' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill={bg}/>
      <path d="M10 50 L34 14" stroke={color} strokeWidth="5" strokeLinecap="round"/>
      <path d="M30 14 L40 36" stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity="0.7"/>
      <path d="M34 14 L50 30" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M38 14 L54 22" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
      <circle cx="32" cy="14" r="3.5" fill={color}/>
    </svg>
  ),
};

const LOGO_OPTIONS = [
  { key: 'quarter',  name: 'Quarter',  meaning: 'Cuartos opuestos · ciclos mensuales que cierran' },
  { key: 'folded',   name: 'Folded',   meaning: 'Hoja plegada · documento + intercambio' },
  { key: 'aperture', name: 'Aperture', meaning: 'Apertura · transparencia entre ambas partes' },
  { key: 'orbit',    name: 'Orbit',    meaning: 'Conexión · colaborador y estudio enlazados' },
  { key: 'prism',    name: 'Prism',    meaning: 'Prisma · factura descompuesta — moderno y atrevido' },
  { key: 'ledger',   name: 'Ledger',   meaning: 'Columnas de libro contable que firman — autoría' },
  { key: 'bracket',  name: 'Bracket',  meaning: '{ _ } · llaves de código que abrazan el subrayado — devs' },
  { key: 'slash',    name: 'Slash',    meaning: '/_ · slash diagonal + cursor de terminal — shell vivo' },
  { key: 'stack',    name: 'Stack',    meaning: 'Líneas apiladas · commits, tareas, PRs ordenados' },
  { key: 'sigma',    name: 'Sigma',    meaning: 'Σ · suma del trabajo del mes, editorial y matemático' },
  { key: 'token',    name: 'Token',    meaning: 'Hexágono · token de pago, chip, valor digital' },
  { key: 'receipt',  name: 'Receipt',  meaning: 'Recibo dentado · declaración literal y directa' },
  { key: 'pulse',    name: 'Pulse',    meaning: 'Onda heartbeat · trabajo vivo, latido del mes' },
  { key: 'glyph',    name: 'Glyph',    meaning: 'Carácter ASCII brutalista · slot de variable' },
  { key: 'module',   name: 'Module',   meaning: 'Bloques swiss · sistema modular y editorial' },
  { key: 'knot',     name: 'Knot',     meaning: 'Nodo de red · 5 puntos, trabajo distribuido' },
  { key: 'mono',     name: 'Mono',     meaning: 'X tipográfica anti-marca · descarado, mono-grotesque' },
  { key: 'refract',  name: 'Refract',  meaning: 'Diagonal que se astilla · luz prismática generativa' },
];

const LogoLockup = ({ variant, size = 28, color = 'var(--ink)' }) => {
  const Mark = LogoMarks[variant] || LogoMarks.quarter;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <Mark size={size} color={color}/>
      <span className="display" style={{
        fontSize: size * 0.85, color, letterSpacing: '-0.025em', fontWeight: 500, lineHeight: 1,
      }}>invoxa</span>
    </div>
  );
};

Object.assign(window, { LogoMarks, LOGO_OPTIONS, LogoLockup });
