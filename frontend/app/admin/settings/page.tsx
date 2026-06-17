"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { ArrowLeft, Download, Lock } from "lucide-react"

export default function AdminSettingsPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "As senhas não coincidem" })
      return
    }

    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Nova senha deve ter no mínimo 8 caracteres" })
      return
    }

    setSubmitting(true)
    try {
      await api.admin.changePassword(currentPassword, newPassword)
      setMessage({ type: "success", text: "Senha alterada com sucesso!" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleExportCsv = () => {
    const token = localStorage.getItem("admin-token")
    if (token) {
      window.open(`https://api.gabrielcampostrader.com.br/api/admin/users/export?token=${token}`, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin")} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="size-5" /></button>
          <h1 className="text-lg font-bold text-foreground">Configurações</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-8">
        {/* Export CSV */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-2 flex items-center gap-2 font-bold text-foreground">
            <Download className="size-5 text-primary" /> Exportar Dados
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">Exportar todos os usuários em formato CSV para abrir no Excel.</p>
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Download className="size-4" />
            Exportar CSV
          </button>
        </div>

        {/* Change Password */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-2 flex items-center gap-2 font-bold text-foreground">
            <Lock className="size-5 text-primary" /> Alterar Senha
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">Altere a senha de acesso ao painel administrativo.</p>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Senha atual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Nova senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Confirmar nova senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {message && (
              <p className={`rounded-lg px-3 py-2 text-sm ${message.type === "success" ? "bg-green-500/10 text-green-400" : "bg-destructive/10 text-destructive"}`}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="h-11 w-full rounded-lg bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? "Alterando..." : "Alterar senha"}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
