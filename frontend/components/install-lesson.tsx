"use client"

import { useState } from "react"
import { Monitor, ExternalLink, Send, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"

export function InstallLesson() {
  const { user, refreshUser } = useAuth()
  const [userId, setUserId] = useState("")
  const [confirmId, setConfirmId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const canActivate = userId.length > 0 && userId === confirmId && !loading
  const alreadyActivated = !!user?.trader_id
  const fullyUnlocked = user?.ja_registrado && user?.ja_pagou

  if (fullyUnlocked && !user?.trader_id) {
    return null
  }

  const handleActivate = async () => {
    setLoading(true)
    setError("")
    try {
      await api.webhook.ativar(userId)
      setSuccess(true)
      refreshUser()
    } catch (err: any) {
      setError(err.message || "Erro ao ativar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Monitor className="size-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Ativação do Indicador</h2>
        <p className="mt-1 text-sm text-muted-foreground">Siga os passos abaixo para ativar seu indicador</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
            1
          </span>
          <h3 className="font-bold text-foreground">Crie sua conta na CasaTrade</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Clique no botão abaixo para criar sua conta de trading. Após criar, copie o{" "}
          <strong className="text-foreground">ID da conta</strong> — você vai precisar no próximo passo.
        </p>
        <a
          href="https://trade.casatrade.com/register?aff=825295&aff_model=revenue&afftrack=areamembros"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ExternalLink className="size-4" />
          Criar conta na CasaTrade
        </a>
      </div>

      {alreadyActivated || success ? (
        <div className="flex gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <CheckCircle className="size-5 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-primary">Licença ativada!</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Seu ID <strong className="text-foreground">{user?.trader_id || userId}</strong> foi vinculado com sucesso. Agora vá para o próximo passo.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-400">
              2
            </span>
            <h3 className="font-bold text-foreground">Insira seu ID de usuário para ativar a licença</h3>
          </div>

          <label className="mb-1 block text-sm font-medium text-foreground">Seu ID de usuário</label>
          <input
            value={userId}
            onChange={(e) => { setUserId(e.target.value); setError("") }}
            placeholder="Ex: 12345678"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary"
          />
          <p className="mb-4 mt-1 text-xs text-muted-foreground">ID gerado ao criar sua conta na CasaTrade</p>

          <label className="mb-1 block text-sm font-medium text-foreground">Confirme o ID de usuário</label>
          <input
            value={confirmId}
            onChange={(e) => { setConfirmId(e.target.value); setError("") }}
            placeholder="Digite novamente para confirmar"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary"
          />
          <p className="mb-4 mt-1 text-xs text-muted-foreground">Digite o mesmo ID para confirmar — sem erros</p>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            disabled={!canActivate}
            onClick={handleActivate}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold uppercase tracking-wide text-muted-foreground transition-colors enabled:bg-primary enabled:text-primary-foreground enabled:hover:bg-primary/90 disabled:cursor-not-allowed"
          >
            <Send className="size-4" />
            {loading ? "Ativando..." : "Ativar minha licença"}
          </button>
        </div>
      )}
    </div>
  )
}
