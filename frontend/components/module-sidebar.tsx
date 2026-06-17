"use client"

import Link from "next/link"
import { courseLessons } from "@/lib/course-data"
import { CheckCircle } from "lucide-react"
import { useLessonProgress } from "@/lib/lesson-progress"

export function ModuleSidebar({ activeSlug }: { activeSlug: string }) {
  const { isCompleted } = useLessonProgress()

  return (
    <aside className="w-full shrink-0 border-l border-border bg-card/50 lg:w-80">
      <div className="border-b border-border px-5 py-4">
        <p className="font-semibold text-foreground">Conteúdo do Módulo</p>
        <p className="text-xs text-muted-foreground">{courseLessons.length} aulas</p>
      </div>
      <ul className="flex flex-col">
        {courseLessons.map((lesson) => {
          const active = lesson.slug === activeSlug
          const completed = isCompleted(lesson.slug)
          return (
            <li key={lesson.slug}>
              <Link
                href={`/smarttrade-pro/aula/${lesson.slug}`}
                className={[
                  "flex items-center gap-3 border-b border-border px-4 py-4 transition-colors",
                  active ? "border-l-2 border-l-primary bg-primary/5" : "hover:bg-secondary/50",
                ].join(" ")}
              >
                <div className="flex aspect-video w-16 shrink-0 items-center justify-center rounded bg-background text-[8px] font-bold uppercase text-primary">
                  {lesson.title.split(" ").slice(0, 2).join(" ")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>
                    {lesson.title}
                  </p>
                </div>
                {completed && <CheckCircle className="size-4 shrink-0 text-primary" />}
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

