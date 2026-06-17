"use client"

import Link from "next/link"
import { GraduationCap, Crown, Gift, Lock, MessageCircle } from "lucide-react"

type Product = {
  id: string
  href: string
  badge: string
  badgeClass: string
  title: string
  status: string
  statusIcon: "crown" | "gift" | "message" | null
  statusClass: string
  locked?: boolean
  image?: string
  cardGlow: string
  external?: boolean
}

const products: Product[] = [
  {
    id: "smarttrade",
    href: "/smarttrade-pro",
    badge: "Ative o WallStreet",
    badgeClass: "bg-primary text-primary-foreground",
    title: "WallStreet Revolution",
    status: "Exclusivo",
    statusIcon: "crown",
    statusClass: "text-primary",
    image: "/ARTES/1.png",
    cardGlow: "shadow-[0_0_40px_-12px_rgba(0,102,255,0.35)]",
  },
  {
    id: "suporte",
    href: "/suporte-whatsapp",
    badge: "Chame o Suporte",
    badgeClass: "bg-primary text-primary-foreground",
    title: "Suporte WhatsApp",
    status: "Disponível",
    statusIcon: "message",
    statusClass: "text-primary",
    image: "/ARTES/2.png",
    cardGlow: "shadow-[0_0_40px_-12px_rgba(0,102,255,0.35)]",
  },
  {
    id: "grupo",
    href: "https://chat.whatsapp.com/DhEatM6158AJSgFR0R9e4V",
    badge: "Entre no grupo",
    badgeClass: "bg-primary text-primary-foreground",
    title: "Grupo WhatsApp",
    status: "Bônus",
    statusIcon: "gift",
    statusClass: "text-primary",
    image: "/ARTES/GRUPO DO WHATS.png",
    cardGlow: "shadow-[0_0_40px_-12px_rgba(0,102,255,0.35)]",
    external: true,
  },
  {
    id: "ia",
    href: "/inteligencia-artificial",
    badge: "Inteligência Artificial",
    badgeClass: "bg-amber-500/20 text-amber-300",
    title: "Inteligência Artificial",
    status: "Toque para desbloquear",
    statusIcon: null,
    statusClass: "text-amber-400",
    image: "/ARTES/3.png",
    cardGlow: "shadow-[0_0_40px_-12px_rgba(245,158,11,0.35)]",
  },
]

export function ProductsSection() {
  return (
    <section className="mt-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">
            Meus <span className="text-primary">Produtos</span>
          </h2>
        </div>
        <span className="text-sm text-muted-foreground">3 disponíveis</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {products.map((p) => {
          const StatusIcon = p.statusIcon === "crown" ? Crown : p.statusIcon === "gift" ? Gift : p.statusIcon === "message" ? MessageCircle : null
          const Wrapper = p.external ? "a" : Link
          const extraProps = p.external ? { target: "_blank", rel: "noopener noreferrer" } : {}

          return (
            <Wrapper
              key={p.id}
              href={p.href}
              {...extraProps}
              className={`block overflow-hidden rounded-2xl border border-border bg-card transition-transform hover:-translate-y-1 ${p.cardGlow}`}
            >
              <div className={`py-2.5 text-center text-xs font-bold uppercase tracking-wider ${p.badgeClass}`}>
                {p.badge}
              </div>

              <div className="relative aspect-[3/3.4] bg-gradient-to-b from-secondary/40 to-background">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="size-full object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center text-xs text-muted-foreground" />
                )}
                {p.locked && (
                  <div className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/70 backdrop-blur">
                    <Lock className="size-4 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-foreground">{p.title}</h3>
                <p className={`mt-1 flex items-center gap-1.5 text-sm ${p.statusClass}`}>
                  {StatusIcon && <StatusIcon className="size-4" />}
                  {p.status}
                </p>
              </div>
            </Wrapper>
          )
        })}
      </div>
    </section>
  )
}
