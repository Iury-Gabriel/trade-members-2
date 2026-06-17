"use client"

import { Download, Lock, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function DownloadLesson() {
  const { user } = useAuth()
  const canDownload = user?.ja_pagou === true

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {!canDownload && (
        <div className="flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
          <AlertTriangle className="size-5 shrink-0 text-amber-400" />
          <div>
            <p className="font-semibold text-amber-400">Depósito necessário para ativação</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Para liberar o download e a instalação do indicador, é necessário realizar o primeiro depósito (FTD) na sua conta da corretora.
              Após o depósito, o botão será liberado automaticamente.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
            1
          </span>
          <h3 className="font-bold text-foreground">Baixar o Indicador SmartTrade IA</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Clique no botão abaixo para baixar o instalador do indicador. Após o download, execute o arquivo e siga as instruções.
        </p>
        {canDownload ? (
          <a
            href="https://api.whatsapp.com/send/?phone=5513978207673&text=A+Palavra+Chave+é+SMARTACESSO&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Download className="size-4" />
            Baixar Indicador SmartTrade IA
          </a>
        ) : (
          <button
            disabled
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Lock className="size-4" />
            Bloqueado — Faça o depósito para liberar
          </button>
        )}
      </div>
    </div>
  )
}
