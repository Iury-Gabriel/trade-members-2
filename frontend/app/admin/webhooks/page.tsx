"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"

type Postback = {
  id: string
  trader_id: string
  postback_name: string
  amount: number | null
  criado_em: string
}

type Pagination = { total: number; page: number; limit: number; pages: number }

export default function WebhookLogsPage() {
  const router = useRouter()
  const [postbacks, setPostbacks] = useState<Postback[]>([])
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 50, pages: 1 })
  const [typeFilter, setTypeFilter] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async (page: number, type?: string) => {
    setLoading(true)
    try {
      const data = await api.admin.webhookLogs(page, type || undefined)
      setPostbacks(data.postbacks)
      setPagination(data.pagination)
    } catch {
      localStorage.removeItem("admin-token")
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    const token = localStorage.getItem("admin-token")
    if (!token) { router.push("/admin/login"); return }
    fetch_(1)
  }, [])

  const handleType = (t: string) => {
    setTypeFilter(t)
    fetch_(1, t)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin")} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="size-5" /></button>
          <h1 className="text-lg font-bold text-foreground">Webhook Logs</h1>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">{pagination.total}</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        <div className="mb-6 flex gap-2">
          {["", "Registro", "FTD"].map(t => (
            <button key={t} onClick={() => handleType(t)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${typeFilter === t ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-secondary"}`}>
              {t || "Todos"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-card text-left">
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Tipo</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Trader ID</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Valor</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Data/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {postbacks.map(p => (
                    <tr key={p.id} className="border-b border-border transition-colors hover:bg-secondary/30">
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.postback_name === "FTD" ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"}`}>
                          {p.postback_name}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{p.trader_id}</td>
                      <td className="px-4 py-3 text-xs text-foreground">
                        {p.amount ? `R$ ${p.amount.toFixed(2)}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(p.criado_em).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                  {postbacks.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">Nenhum postback encontrado</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Página {pagination.page} de {pagination.pages}</p>
                <div className="flex gap-2">
                  <button disabled={pagination.page <= 1} onClick={() => fetch_(pagination.page - 1, typeFilter)} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary disabled:opacity-40">
                    <ChevronLeft className="size-4" /> Anterior
                  </button>
                  <button disabled={pagination.page >= pagination.pages} onClick={() => fetch_(pagination.page + 1, typeFilter)} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary disabled:opacity-40">
                    Próxima <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
