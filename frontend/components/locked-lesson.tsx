"use client"

import { Lock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { VideoLesson } from "@/components/video-lesson"
import { DownloadLesson } from "@/components/download-lesson"

export function LockedLesson({ title, videoUrl }: { title: string; videoUrl?: string }) {
  const { user } = useAuth()
  const fullyUnlocked = user?.ja_registrado && user?.ja_pagou

  if (!fullyUnlocked && !user?.trader_id) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/5 px-6 py-16 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
            <Lock className="size-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Passo bloqueado</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Para acessar este passo, primeiro ative sua licença no 1º Passo vinculando seu ID de usuário da CasaTrade.
          </p>
          <Link
            href="/smarttrade-pro/aula/primeiro-passo-indicador"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ir para o 1º Passo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <VideoLesson title={title} videoUrl={videoUrl} />
      <div className="mt-6">
        <DownloadLesson />
      </div>
    </>
  )
}
