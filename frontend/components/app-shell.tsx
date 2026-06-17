"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { WhatsAppFab } from "@/components/whatsapp-fab"
import { Menu, X } from "lucide-react"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-background">
        {/* Mobile header */}
        <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background px-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
            <Menu className="size-6 text-foreground" />
          </button>
          <img src="/Logo.webp" alt="Padinho Invest" className="h-8 w-auto" />
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={[
            "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 lg:static lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="absolute right-2 top-3 lg:hidden">
            <button onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">
              <X className="size-5 text-muted-foreground" />
            </button>
          </div>
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        {/* Main */}
        <main className="flex-1 overflow-x-hidden pt-14 lg:pt-0">{children}</main>
        <WhatsAppFab />
      </div>
    </AuthGuard>
  )
}
