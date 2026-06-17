"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  Home,
  PlayCircle,
  Users,
  Crown,
  Lock,
  Building2,
  MessageCircle,
  LogOut,
  Phone,
} from "lucide-react"

type NavItem = {
  label: string
  icon: typeof Home
  href?: string
  locked?: boolean
  highlight?: boolean
  badge?: string
  external?: boolean
  action?: string
}

const navGroups: { section: string; items: NavItem[] }[] = [
  {
    section: "Principal",
    items: [{ label: "Início", icon: Home, href: "/" }],
  },
  {
    section: "Produtos",
    items: [
      { label: "WallStreet Revolution", icon: PlayCircle, href: "/smarttrade-pro" },
      { label: "Suporte WhatsApp", icon: Phone, href: "/suporte-whatsapp" },
      { label: "Grupo WhatsApp", icon: Users, href: "https://chat.whatsapp.com/DhEatM6158AJSgFR0R9e4V", external: true },
      { label: "Inteligência Artificial", icon: Crown, href: "/inteligencia-artificial" },
    ],
  },
  {
    section: "Recursos",
    items: [
      { label: "Abrir conta na CasaTrade", icon: Building2, href: "https://trade.casatrade.com/register?aff=825295&aff_model=revenue&afftrack=areamembros", highlight: true, external: true },
      { label: "Suporte", icon: MessageCircle, href: "https://wa.me/5519996294615?text=Estou%20com%20uma%20duvida...", external: true },
    ],
  },
  {
    section: "Conta",
    items: [{ label: "Sair", icon: LogOut, href: "#", action: "logout" }],
  },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleClick = () => onNavigate?.()

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-20 items-center px-6">
        <Link href="/" aria-label="Início" onClick={handleClick}>
          <img src="/Logo.png" alt="Padinho Invest" className="h-10 w-auto" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {navGroups.map((group) => (
          <div key={group.section} className="mb-6">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.section}
            </p>
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : item.href && item.href !== "#" && !item.external && pathname.startsWith(item.href)

                if (item.action === "logout") {
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => { logout(); handleClick() }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
                      >
                        <Icon className="size-[18px] shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                      </button>
                    </li>
                  )
                }

                if (item.external) {
                  return (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleClick}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
                      >
                        <Icon className="size-[18px] shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                      </a>
                    </li>
                  )
                }

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href ?? "#"}
                      onClick={handleClick}
                      className={[
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                        isActive
                          ? "bg-sidebar-accent font-medium text-primary"
                          : item.highlight
                            ? "text-primary hover:bg-sidebar-accent"
                            : "text-sidebar-foreground hover:bg-sidebar-accent",
                      ].join(" ")}
                    >
                      <Icon className="size-[18px] shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.locked && <Lock className="size-3.5 text-muted-foreground" />}
                      {item.badge && (
                        <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{user?.email?.split("@")[0] || "Usuário"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email || ""}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
