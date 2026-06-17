import Link from "next/link"
import type React from "react"
import { ChevronLeft } from "lucide-react"

export function ProductHero({
  title,
  description,
  backLabel,
  cta,
  rightSlot,
  image,
}: {
  title: React.ReactNode
  description: string
  backLabel?: string
  cta?: { label: string; href: string }
  rightSlot?: React.ReactNode
  /* Slot de imagem de fundo — coloque uma foto nova em /public e passe o caminho aqui */
  image?: string
}) {
  return (
    <section className="relative min-h-[300px] w-full overflow-hidden border-b border-border">
      {/* Background image slot */}
      {image ? (
        <img src={image || "/placeholder.svg"} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-secondary/30" aria-hidden="true" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" aria-hidden="true" />

      <div className="relative z-10 flex min-h-[300px] flex-col justify-center px-8 py-10 lg:px-12">
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-xl">
            {backLabel && (
              <Link
                href="/"
                className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronLeft className="size-4" />
                {backLabel}
              </Link>
            )}
            <h1 className="text-balance text-4xl font-bold leading-tight text-foreground lg:text-5xl">{title}</h1>
            <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">{description}</p>
            {cta && (
              <Link
                href={cta.href}
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
              >
                {cta.label}
              </Link>
            )}
          </div>
          {rightSlot && <div className="hidden shrink-0 lg:block">{rightSlot}</div>}
        </div>
      </div>
    </section>
  )
}
