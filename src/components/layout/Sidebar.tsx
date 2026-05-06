import {
  ChevronDown,
  Files,
  FileText,
  FolderKanban,
  Home,
  Menu,
  ReceiptText,
  Send,
  Settings,
  UserSquare,
  Users,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoHorizontal from '/brand/imagotipo-horizontal-cafe.svg'
import type { Profile, UserRole } from '../../types/profile'

type NavItem = {
  to: string
  label: string
  icon: ReactNode
  badge?: number
}

type NavSection = {
  title: string
  items: NavItem[]
}

const adminSections: NavSection[] = [
  {
    title: 'Principal',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    ],
  },
  {
    title: 'Operación',
    items: [
      { to: '/admin/users', label: 'Usuarios', icon: <Users size={18} /> },
      {
        to: '/admin/projects',
        label: 'Proyectos',
        icon: <FolderKanban size={18} />,
      },
    ],
  },
  {
    title: 'Facturación',
    items: [
      { to: '/admin/invoices', label: 'Facturas', icon: <Files size={18} /> },
      {
        to: '/admin/invoice-requests',
        label: 'Solicitudes',
        icon: <Send size={18} />,
      },
      {
        to: '/admin/invoice-number-requests',
        label: 'Cambios consecutivo',
        icon: <ReceiptText size={18} />,
      },
    ],
  },
]

const userSections: NavSection[] = [
  {
    title: 'Principal',
    items: [{ to: '/app/dashboard', label: 'Inicio', icon: <Home size={18} /> }],
  },
  {
    title: 'Mi facturación',
    items: [
      {
        to: '/app/billing-profile',
        label: 'Datos de facturación',
        icon: <UserSquare size={18} />,
      },
      { to: '/app/tasks', label: 'Tareas', icon: <FileText size={18} /> },
      { to: '/app/invoices', label: 'Facturas', icon: <Files size={18} /> },
      {
        to: '/app/invoice-number-requests',
        label: 'Solicitudes consecutivo',
        icon: <ReceiptText size={18} />,
      },
    ],
  },
]

export function Sidebar({ profile }: { profile: Profile }) {
  const sections = profile.role === 'admin' ? adminSections : userSections
  const initials = getInitials(profile.full_name || profile.email)

  return (
    <aside className="flex h-screen w-[252px] flex-shrink-0 flex-col border-r border-border bg-bg">
      {/* Logo + menu toggle */}
      <div className="flex items-center justify-between px-4 py-5">
        <Link to="/" className="flex items-center" aria-label="Invoxa">
          <img src={logoHorizontal} alt="Invoxa" className="h-7 w-auto" />
        </Link>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-subtle hover:text-text-sec"
          aria-label="Toggle menu"
        >
          <Menu size={14} />
        </button>
      </div>

      {/* Org card */}
      <div className="mx-3 mb-3.5 flex cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-subtle px-3 py-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue text-[11px] font-bold text-white">
          IS
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold text-text">
            Informage Studios
          </div>
          <div className="mt-0.5 text-[10px] capitalize text-muted">
            {profile.role}
          </div>
        </div>
        <ChevronDown size={14} className="text-muted" />
      </div>

      {/* Sections */}
      <nav className="scrollbar-none flex-1 overflow-y-auto px-2.5 pb-2">
        {sections.map((section) => (
          <SidebarSection key={section.title} section={section} />
        ))}
      </nav>

      {/* User card */}
      <div className="flex items-center gap-2.5 border-t border-border p-3">
        <div className="font-display flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-xs font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold text-text">
            {profile.full_name || profile.email}
          </div>
          <div className="text-[10px] capitalize text-muted">{profile.role}</div>
        </div>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-subtle text-muted hover:text-text-sec"
          aria-label="Settings"
        >
          <Settings size={14} />
        </button>
      </div>
    </aside>
  )
}

function SidebarSection({ section }: { section: NavSection }) {
  const location = useLocation()
  return (
    <div className="mb-4">
      <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
        {section.title}
      </div>
      {section.items.map((item) => {
        const active = location.pathname.startsWith(item.to)
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`relative my-px flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition ${
              active
                ? 'bg-primary/10 font-semibold text-primary'
                : 'text-text-sec hover:bg-subtle'
            }`}
          >
            {active && (
              <span className="absolute -left-[10px] top-1.5 bottom-1.5 w-[2.5px] rounded-full bg-primary" />
            )}
            {item.icon}
            <span className="flex-1">{item.label}</span>
            {item.badge ? (
              <span className="min-w-[18px] rounded-full bg-primary px-1.5 py-0.5 text-center text-[10px] font-bold text-white">
                {item.badge}
              </span>
            ) : null}
          </Link>
        )
      })}
    </div>
  )
}

function getInitials(value: string): string {
  return value
    .split(/[ @.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('')
}

export type { UserRole }
