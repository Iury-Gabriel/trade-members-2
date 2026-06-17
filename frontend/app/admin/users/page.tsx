"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Search, ChevronLeft, ChevronRight, ArrowLeft, Check, X } from "lucide-react"

type User = {
  id: string
  email: string
  telefone: string | null
  trader_id: string | null
  ja_registrado: boolean
  ja_pagou: boolean
  last_login: string | null
  login_count: number
  criado_em: string
}

type Pagination = {
  total: number
  page: number
  limit: number
  pages: number
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 50, pages: 1 })
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async (page: number, q?: string) => {
    setLoading(true)
    try {
      const data = await api.admin.users(page, q)
      setUsers(data.users)
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
    if (!token) {
      router.push("/admin/login")
      return
    }
    fetchUsers(1)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    fetchUsers(1, searchInput)
  }

  const handleToggle = async (user: User, field: "ja_pagou" | "ja_registrado") => {
    try {
      await api.admin.updateUser(user.id, { [field]: !user[field] })
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, [field]: !u[field] } : u))
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-4 sm:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/admin")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-5" />
            </button>
            <h1 className="text-lg font-bold text-foreground">Usuários</h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">{pagination.total}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Buscar por e-mail ou trader ID..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button type="submit" className="rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Buscar
          </button>
        </form>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-card text-left">
                    <th className="px-4 py-3 font-semibold text-muted-foreground">E-mail</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Trader ID</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Registrado</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">FTD</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Último Login</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Logins</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-border transition-colors hover:bg-secondary/30">
                      <td className="px-4 py-3 text-foreground">{user.email}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{user.trader_id || "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggle(user, "ja_registrado")}
                          className={`inline-flex size-7 items-center justify-center rounded-full transition-colors ${
                            user.ja_registrado
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          }`}
                        >
                          {user.ja_registrado ? <Check className="size-4" /> : <X className="size-4" />}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggle(user, "ja_pagou")}
                          className={`inline-flex size-7 items-center justify-center rounded-full transition-colors ${
                            user.ja_pagou
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          }`}
                        >
                          {user.ja_pagou ? <Check className="size-4" /> : <X className="size-4" />}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {user.last_login
                          ? new Date(user.last_login).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })
                          : "Nunca"}
                      </td>
                      <td className="px-4 py-3 text-center text-xs font-medium text-foreground">{user.login_count}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(user.criado_em).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Página {pagination.page} de {pagination.pages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => fetchUsers(pagination.page - 1, search)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                  >
                    <ChevronLeft className="size-4" /> Anterior
                  </button>
                  <button
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => fetchUsers(pagination.page + 1, search)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                  >
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
