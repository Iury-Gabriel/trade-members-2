import Link from "next/link"
import { AppShell } from "@/components/app-shell"
import { ModuleSidebar } from "@/components/module-sidebar"
import { resolveLessonOr404 } from "@/lib/resolve-lesson"
import { VideoLesson } from "@/components/video-lesson"
import { InstallLesson } from "@/components/install-lesson"
import { LockedLesson } from "@/components/locked-lesson"
import { CompleteButton } from "@/components/complete-button"
import { LessonTracker } from "@/components/lesson-tracker"
import { ChevronLeft } from "lucide-react"

export function generateStaticParams() {
  return [
    { slug: "boas-vindas" },
    { slug: "primeiro-passo-indicador" },
    { slug: "segundo-passo-indicador" },
  ]
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const lesson = resolveLessonOr404(slug)

  return (
    <AppShell>
      <div className="flex flex-col lg:flex-row">
        {/* Conteúdo principal */}
        <div className="min-w-0 flex-1">
          {/* Topo */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4 lg:px-8">
            <Link
              href="/smarttrade-pro/curso"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="size-4 text-primary" />
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Início Rápido
                </span>
                <span className="font-semibold text-foreground">{lesson.title}</span>
              </span>
            </Link>
          </div>

          <LessonTracker slug={lesson.slug} />
          <div className="px-6 py-6 lg:px-8">
            {lesson.slug === "primeiro-passo-indicador" ? (
              <>
                <VideoLesson title={lesson.title} videoUrl={lesson.videoUrl} />
                <div className="mt-6">
                  <InstallLesson />
                </div>
              </>
            ) : lesson.slug === "segundo-passo-indicador" ? (
              <LockedLesson title={lesson.title} videoUrl={lesson.videoUrl} />
            ) : (
              <VideoLesson title={lesson.title} videoUrl={lesson.videoUrl} />
            )}

            {/* Descrição + concluir */}
            <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-xl">
                <h1 className="text-xl font-bold text-foreground">{lesson.title}</h1>
                <p className="mt-2 leading-relaxed text-muted-foreground">{lesson.description}</p>
              </div>
              <CompleteButton slug={lesson.slug} />
            </div>
          </div>
        </div>

        {/* Sidebar do módulo */}
        <ModuleSidebar activeSlug={lesson.slug} />
      </div>
    </AppShell>
  )
}
