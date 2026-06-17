import Link from "next/link"
import { AppShell } from "@/components/app-shell"
import { ProductHero } from "@/components/product-hero"
import { WinCards } from "@/components/win-cards"
import { courseLessons } from "@/lib/course-data"
import { Play, ChevronUp, Circle } from "lucide-react"

export default function CoursePage() {
  return (
    <AppShell>
      <ProductHero
        backLabel="Voltar"
        title="WallStreet Revolution"
        description="O melhor indicador de análise probabilística do mercado. Feito para colocar dinheiro no bolso de iniciantes de forma simples e assertiva. A porta de entrada ideal para quem busca consistência."
        cta={{ label: "Começar agora", href: `/smarttrade-pro/aula/${courseLessons[0].slug}` }}
        rightSlot={<WinCards />}
      />

      {/* Barra de progresso/topo do curso */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4 lg:px-8">
        <p className="font-semibold text-foreground">WallStreet Revolution</p>
        <Link
          href={`/smarttrade-pro/aula/${courseLessons[0].slug}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Play className="size-4" />
          Começar
        </Link>
      </div>

      <div className="px-6 py-8 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            Conteúdo do <span className="text-primary">Curso</span>
          </h2>
          <span className="text-sm text-muted-foreground">1 módulo · {courseLessons.length} aulas</span>
        </div>

        {/* Módulo */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
                1
              </span>
              <div>
                <p className="font-semibold text-foreground">Início Rápido</p>
                <p className="text-xs text-muted-foreground">{courseLessons.length} aulas · 0% concluído</p>
              </div>
            </div>
            <ChevronUp className="size-5 text-muted-foreground" />
          </div>

          <ul className="flex flex-col gap-3 p-4">
            {courseLessons.map((lesson) => (
              <li key={lesson.slug}>
                <Link
                  href={`/smarttrade-pro/aula/${lesson.slug}`}
                  className="flex items-center gap-4 rounded-xl border border-border bg-secondary/40 p-3 transition-colors hover:bg-secondary"
                >
                  <div className="flex aspect-video w-28 shrink-0 items-center justify-center rounded-lg bg-background text-[10px] font-bold uppercase text-primary">
                    {/* Slot de thumbnail — troque por imagem em /public */}
                    {lesson.title.split(" ").slice(0, 3).join(" ")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{lesson.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{lesson.description}</p>
                  </div>
                  <Circle className="size-6 shrink-0 text-muted-foreground/50" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  )
}
