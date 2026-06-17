"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Search, ChevronLeft, ChevronRight, ArrowLeft, Check, X, Unlock, UserPlus } from "lucide-react"

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
  const [showCreate, setShowCreate] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [newLiberar, setNewLiberar] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createMsg, setCreateMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

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

  const handleLiberarTudo = async (user: User) => {
    if (user.ja_registrado && user.ja_pagou) return
    try {
      await api.admin.updateUser(user.id, { ja_registrado: true, ja_pagou: true })
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ja_registrado: true, ja_pagou: true } : u))
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setCreateMsg(null)
    try {
      await api.admin.createUser(newEmail, newLiberar, newLiberar)
      setCreateMsg({ type: "success", text: "Usuário cadastrado com sucesso!" })
      setNewEmail("")
      setNewLiberar(false)
      fetchUsers(pagination.page, search)
    } catch (err: any) {
      setCreateMsg({ type: "error", text: err.message })
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-4 sm:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/admin")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-5" />
            </button>
            <h1 className="text-lg font-bold text-foreground">Usuários</h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">{pagination.total}</span>
          </div>
          <button
            onClick={() => { setShowCreate(!showCreate); setCreateMsg(null) }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <UserPlus className="size-4" />
            Cadastrar
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        {showCreate && (
          <div className="mb-6 rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 font-bold text-foreground">Cadastrar novo usuário</h2>
            <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3">
              <div className="min-w-[250px] flex-1">
                <label className="mb-1.5 block text-sm font-medium text-foreground">E-mail</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  required
                  placeholder="usuario@email.com"
                  className="h-10 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                <input
                  type="checkbox"
                  checked={newLiberar}
                  onChange={e => setNewLiberar(e.target.checked)}
                  className="size-4 accent-primary"
                />
                Liberar Registro + FTD
              </label>
              <button
                type="submit"
                disabled={creating}
                className="h-10 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {creating ? "Cadastrando..." : "Cadastrar"}
              </button>
            </form>
            {createMsg && (
              <p className={`mt-3 rounded-lg px-3 py-2 text-sm ${createMsg.type === "success" ? "bg-blue-500/10 text-blue-400" : "bg-destructive/10 text-destructive"}`}>
                {createMsg.text}
              </p>
            )}
          </div>
        )}

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
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-card text-left">
                    <th className="px-4 py-3 font-semibold text-muted-foreground">E-mail</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Trader ID</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Registrado</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">FTD</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Ações</th>
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
                              ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
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
                              ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          }`}
                        >
                          {user.ja_pagou ? <Check className="size-4" /> : <X className="size-4" />}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleLiberarTudo(user)}
                          disabled={user.ja_registrado && user.ja_pagou}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                            user.ja_registrado && user.ja_pagou
                              ? "bg-blue-500/10 text-blue-400/50 cursor-default"
                              : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                          }`}
                        >
                          <Unlock className="size-3.5" />
                          {user.ja_registrado && user.ja_pagou ? "Liberado" : "Liberar Tudo"}
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
