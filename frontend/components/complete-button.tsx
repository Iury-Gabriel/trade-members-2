"use client"

import { CheckCircle, Circle } from "lucide-react"
import { useLessonProgress } from "@/lib/lesson-progress"

export function CompleteButton({ slug }: { slug: string }) {
  const { isCompleted, toggle } = useLessonProgress()
  const done = isCompleted(slug)

  return (
    <button
      onClick={() => toggle(slug)}
      className={[
        "inline-flex shrink-0 items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors",
        done
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-secondary text-foreground hover:bg-secondary/70",
      ].join(" ")}
    >
      {done ? <CheckCircle className="size-4" /> : <Circle className="size-4" />}
      {done ? "Concluída" : "Marcar como concluída"}
    </button>
  )
}
