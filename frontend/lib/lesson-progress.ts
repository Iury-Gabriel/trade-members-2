"use client"

import { useState, useCallback, useEffect } from "react"

const STORAGE_KEY = "completed-lessons"

function getCompleted(): string[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

export function useLessonProgress() {
  const [completed, setCompleted] = useState<string[]>([])

  useEffect(() => {
    setCompleted(getCompleted())
  }, [])

  const isCompleted = useCallback((slug: string) => completed.includes(slug), [completed])

  const toggle = useCallback((slug: string) => {
    setCompleted((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { completed, isCompleted, toggle }
}
