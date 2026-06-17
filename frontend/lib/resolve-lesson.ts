import { notFound } from "next/navigation"
import { getLesson } from "@/lib/course-data"

export function resolveLessonOr404(slug: string) {
  const lesson = getLesson(slug)
  if (!lesson) notFound()
  return lesson
}
