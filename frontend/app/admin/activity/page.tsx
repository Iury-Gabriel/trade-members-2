"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"

type View = {
  id: string
  slug: string
  viewed_at: string
  user: { email: string }
}

type Pagination = { total: number; page: number; limit: number; pages: number }

const SLUG_LABELS: Record<string, string> = {
  "boas-vindas": "Boas vindas",
  "primeiro-passo-indicador": "1º Passo",
  "segundo-passo-indicador": "2º Passo",
}

export default function ActivityLogsPage() {
  const router = useRouter()
  const [views, setViews] = useState<View[]>([])
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 50, pages: 1 })
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async (page: number) => {
    setLoading(true)
    try {
      const data = await api.admin.activityLogs(page)
      setViews(data.views)
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin")} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="size-5" /></button>
          <h1 className="text-lg font-bold text-foreground">Atividade dos Usuários</h1>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">{pagination.total}</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-card text-left">
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Usuário</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Aula</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Data/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {views.map(v => (
                    <tr key={v.id} className="border-b border-border transition-colors hover:bg-secondary/30">
                      <td className="px-4 py-3 text-foreground">{v.user.email}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {SLUG_LABELS[v.slug] || v.slug}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(v.viewed_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                  {views.length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">Nenhuma atividade registrada</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Página {pagination.page} de {pagination.pages}</p>
                <div className="flex gap-2">
                  <button disabled={pagination.page <= 1} onClick={() => fetch_(pagination.page - 1)} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary disabled:opacity-40">
                    <ChevronLeft className="size-4" /> Anterior
                  </button>
                  <button disabled={pagination.page >= pagination.pages} onClick={() => fetch_(pagination.page + 1)} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary disabled:opacity-40">
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
