"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"

type Slide = {
  id: string
  tag: string
  tagColor: string
  title: React.ReactNode
  description: string
  ctaLabel: string
  ctaColor: string
  image: string
  gradient: string
}

const slides: Slide[] = [
  {
    id: "smarttrade",
    tag: "Em destaque",
    tagColor: "text-primary",
    title: "WallStreet Revolution",
    description: "Indicador de análise probabilística com inteligência artificial que coloca dinheiro no bolso. A melhor forma de começar.",
    ctaLabel: "Acessar agora",
    ctaColor: "bg-primary text-primary-foreground hover:bg-primary/90",
    image: "/ARTES/BANNER.png",
    gradient: "from-background via-background/80 to-transparent",
  },
  {
    id: "whatsapp",
    tag: "Comunidade",
    tagColor: "text-primary",
    title: (
      <>
        Grupo <span className="text-primary">WhatsApp</span>
      </>
    ),
    description: "Entre no nosso grupo exclusivo do WhatsApp e fique por dentro de tudo.",
    ctaLabel: "Entrar no grupo",
    ctaColor: "bg-primary text-primary-foreground hover:bg-primary/90",
    image: "/ARTES/BANNER.png",
    gradient: "from-background via-background/80 to-transparent",
  },
]

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [])

  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  const slide = slides[current]

  return (
    <section className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border sm:aspect-[16/7] lg:aspect-[16/5]">
      <img
        src={slide.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} aria-hidden="true" />

      <div className="relative z-10 flex h-full max-w-xl flex-col justify-center px-5 sm:px-10">
        <div className="mb-2 flex items-center gap-2 sm:mb-4">
          <span className="size-2 rounded-full bg-primary" />
          <span className={`text-[10px] font-semibold uppercase tracking-widest sm:text-xs ${slide.tagColor}`}>{slide.tag}</span>
        </div>

        <h1 className="text-balance text-2xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">{slide.title}</h1>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">{slide.description}</p>

        <button
          className={`mt-4 inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold shadow-lg transition-colors sm:mt-8 sm:px-6 sm:py-3 sm:text-sm ${slide.ctaColor}`}
        >
          <Play className="size-3 sm:size-4" />
          {slide.ctaLabel}
        </button>
      </div>

      <div className="absolute bottom-6 right-6 z-10 flex items-center gap-3">
        <button
          onClick={prev}
          aria-label="Slide anterior"
          className="flex size-9 items-center justify-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur transition-colors hover:bg-background"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          onClick={next}
          aria-label="Próximo slide"
          className="flex size-9 items-center justify-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur transition-colors hover:bg-background"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="absolute bottom-9 right-32 z-10 flex items-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrent(i)}
            aria-label={`Ir para slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
