"use client"

import { useEffect, useRef } from "react"
import { api } from "@/lib/api"

export function LessonTracker({ slug }: { slug: string }) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    api.lessons.trackView(slug).catch(() => {})
  }, [slug])

  return null
}
