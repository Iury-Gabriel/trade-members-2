"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Users, UserCheck, DollarSign, BarChart3, ArrowRightLeft, TrendingUp, LogOut, List, Webhook, Activity, Settings, ArrowDown } from "lucide-react"

type Funnel = {
  cadastros: number
  ativaram: number
  ftd: number
  dropCadastroAtivacao: string
  dropAtivacaoFtd: string
}

type Stats = {
  totalUsers: number
  usersWithTraderId: number
  usersWithFtd: number
  totalPostbacks: number
  registroPostbacks: number
  ftdPostbacks: number
  convRegistro: string
  convFtd: string
  convFtdTotal: string
  receitaBruta: number
  receitaLiquida: number
  funnel: Funnel
  usersPerDay: { date: string; count: number }[]
}

type FilterKey = "today" | "yesterday" | "7days" | "month" | "total" | "custom"

function getDateRange(key: FilterKey): { from?: string; to?: string } {
  const now = new Date()
  const fmt = (d: Date) => d.toISOString().split("T")[0]

  switch (key) {
    case "today":
      return { from: fmt(now), to: fmt(now) }
    case "yesterday": {
      const y = new Date(now)
      y.setDate(y.getDate() - 1)
      return { from: fmt(y), to: fmt(y) }
    }
    case "7days": {
      const d = new Date(now)
      d.setDate(d.getDate() - 6)
      return { from: fmt(d), to: fmt(now) }
    }
    case "month": {
      const m = new Date(now.getFullYear(), now.getMonth(), 1)
      return { from: fmt(m), to: fmt(now) }
    }
    case "total":
      return {}
    default:
      return {}
  }
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "today", label: "Hoje" },
  { key: "yesterday", label: "Ontem" },
  { key: "7days", label: "7 dias" },
  { key: "month", label: "Este mês" },
  { key: "total", label: "Total" },
  { key: "custom", label: "Personalizado" },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterKey>("total")
  const [customFrom, setCustomFrom] = useState("")
  const [customTo, setCustomTo] = useState("")

  const fetchStats = useCallback(async (f: FilterKey, cf?: string, ct?: string) => {
    setLoading(true)
    try {
      const range = f === "custom" ? { from: cf, to: ct } : getDateRange(f)
      const data = await api.admin.dashboard(range.from, range.to)
      setStats(data.stats)
    } catch {
      localStorage.removeItem("admin-token")
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    const token = localStorage.getItem("admin-token")
    if (!token) {
      router.push("/admin/login")
      return
    }
    fetchStats(filter)
  }, [])

  const handleFilter = (key: FilterKey) => {
    setFilter(key)
    if (key !== "custom") fetchStats(key)
  }

  const handleCustom = () => {
    if (customFrom && customTo) fetchStats("custom", customFrom, customTo)
  }

  const logout = () => {
    localStorage.removeItem("admin-token")
    router.push("/admin/login")
  }

  const maxCount = stats?.usersPerDay?.length ? Math.max(...stats.usersPerDay.map(d => d.count), 1) : 1

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-4 sm:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="Logo" className="h-10 w-auto" />
            <h1 className="text-lg font-bold text-foreground">Painel Admin</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => router.push("/admin/users")} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              <List className="size-4" />
              <span className="hidden sm:inline">Usuários</span>
            </button>
            <button onClick={() => router.push("/admin/webhooks")} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              <Webhook className="size-4" />
              <span className="hidden sm:inline">Webhooks</span>
            </button>
            <button onClick={() => router.push("/admin/activity")} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              <Activity className="size-4" />
              <span className="hidden sm:inline">Atividade</span>
            </button>
            <button onClick={() => router.push("/admin/settings")} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              <Settings className="size-4" />
              <span className="hidden sm:inline">Config</span>
            </button>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary">
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => handleFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filter === "custom" && (
          <div className="mb-6 flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">De</label>
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Até</label>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
            </div>
            <button onClick={handleCustom} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Filtrar</button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : stats ? (
          <>
            {/* Funnel Visual */}
            <div className="mb-8 rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-5 text-base font-bold text-foreground">Funil de Conversão</h3>
              <div className="flex flex-col items-center gap-1">
                <FunnelStep label="Cadastros" value={stats.funnel.cadastros} width="100%" color="bg-blue-500" />
                <div className="flex items-center gap-1 text-xs text-red-400">
                  <ArrowDown className="size-3" /> {stats.funnel.dropCadastroAtivacao}% drop-off
                </div>
                <FunnelStep label="Ativaram licença" value={stats.funnel.ativaram} width={stats.funnel.cadastros > 0 ? `${Math.max((stats.funnel.ativaram / stats.funnel.cadastros) * 100, 8)}%` : "8%"} color="bg-blue-500" />
                <div className="flex items-center gap-1 text-xs text-red-400">
                  <ArrowDown className="size-3" /> {stats.funnel.dropAtivacaoFtd}% drop-off
                </div>
                <FunnelStep label="FTD (depositou)" value={stats.funnel.ftd} width={stats.funnel.cadastros > 0 ? `${Math.max((stats.funnel.ftd / stats.funnel.cadastros) * 100, 8)}%` : "8%"} color="bg-yellow-500" />
              </div>
            </div>

            {/* Financial Cards */}
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Card icon={<DollarSign className="size-5" />} label="Receita Bruta" value={`R$ ${stats.receitaBruta.toFixed(2)}`} color="text-blue-400" subtitle={`${stats.usersWithFtd} FTDs`} />
              <Card icon={<TrendingUp className="size-5" />} label="Comissão (70%)" value={`R$ ${stats.receitaLiquida.toFixed(2)}`} color="text-sky-400" subtitle="Sua receita líquida" />
              <Card icon={<DollarSign className="size-5" />} label="Ticket Médio" value={`R$ ${stats.usersWithFtd > 0 ? (stats.receitaLiquida / stats.usersWithFtd).toFixed(2) : '0.00'}`} color="text-cyan-400" subtitle="Comissão por FTD" />
              <Card icon={<BarChart3 className="size-5" />} label="LTV Estimado" value={`R$ ${stats.totalUsers > 0 ? (stats.receitaLiquida / stats.totalUsers).toFixed(2) : '0.00'}`} color="text-purple-400" subtitle="Receita por cadastro" />
            </div>

            {/* Metric Cards */}
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
              <Card icon={<Users className="size-5" />} label="Cadastros" value={stats.totalUsers} color="text-blue-400" />
              <Card icon={<UserCheck className="size-5" />} label="Licenças ativas" value={stats.usersWithTraderId} color="text-blue-400" />
              <Card icon={<DollarSign className="size-5" />} label="FTDs" value={stats.usersWithFtd} color="text-yellow-400" />
              <Card icon={<ArrowRightLeft className="size-5" />} label="Conv. Registro" value={`${stats.convRegistro}%`} color="text-purple-400" subtitle={`${stats.usersWithTraderId} de ${stats.totalUsers}`} />
              <Card icon={<TrendingUp className="size-5" />} label="Conv. FTD / Ativados" value={`${stats.convFtd}%`} color="text-orange-400" subtitle={`${stats.usersWithFtd} de ${stats.usersWithTraderId}`} />
              <Card icon={<BarChart3 className="size-5" />} label="Conv. FTD / Total" value={`${stats.convFtdTotal}%`} color="text-pink-400" subtitle={`${stats.usersWithFtd} de ${stats.totalUsers}`} />
            </div>

            {/* Postbacks */}
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
              <Card icon={<BarChart3 className="size-5" />} label="Total Postbacks" value={stats.totalPostbacks} color="text-cyan-400" />
              <Card icon={<UserCheck className="size-5" />} label="Postbacks Registro" value={stats.registroPostbacks} color="text-sky-400" />
              <Card icon={<DollarSign className="size-5" />} label="Postbacks FTD" value={stats.ftdPostbacks} color="text-amber-400" />
            </div>

            {/* Chart */}
            {stats.usersPerDay.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold text-foreground">Cadastros por dia</h3>
                <div className="flex items-end gap-1 overflow-x-auto" style={{ minHeight: 180 }}>
                  {stats.usersPerDay.map(d => (
                    <div key={d.date} className="flex flex-1 flex-col items-center gap-1" style={{ minWidth: 32 }}>
                      <span className="text-[10px] font-medium text-foreground">{d.count}</span>
                      <div className="w-full min-w-[16px] rounded-t bg-primary" style={{ height: Math.max((d.count / maxCount) * 140, 4) }} />
                      <span className="text-[9px] text-muted-foreground">
                        {new Date(d.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  )
}

function Card({ icon, label, value, color, subtitle }: {
  icon: React.ReactNode; label: string; value: number | string; color: string; subtitle?: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-2 flex items-center gap-2">
        <span className={color}>{icon}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

function FunnelStep({ label, value, width, color }: { label: string; value: number; width: string; color: string }) {
  return (
    <div className="w-full" style={{ maxWidth: width }}>
      <div className={`${color} rounded-lg px-4 py-3 text-center transition-all`}>
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-xs font-medium text-white/80">{label}</p>
      </div>
    </div>
  )
}
