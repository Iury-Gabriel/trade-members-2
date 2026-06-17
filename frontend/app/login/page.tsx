"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const { login, register } = useAuth()
  const [email, setEmail] = useState("")
  const [mode, setMode] = useState<"login" | "register">("login")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      if (mode === "login") {
        await login(email)
      } else {
        await register(email)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <img src="/Logo.png" alt="Padinho Invest" className="h-20 w-auto" />
          </div>

          {/* Title */}
          <h1 className="mb-1 text-center text-xl font-bold text-foreground">
            {mode === "login" ? "Acesse sua conta" : "Crie sua conta"}
          </h1>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            {mode === "login"
              ? "Digite seu e-mail cadastrado para entrar na plataforma"
              : "Digite seu e-mail para criar uma conta na plataforma"}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                Seu e-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                required
                className="h-11 w-full rounded-lg border border-primary/40 bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="h-11 w-full rounded-lg bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting
                ? "Carregando..."
                : mode === "login"
                  ? "Entrar na plataforma"
                  : "Criar conta"}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Não tem uma conta?{" "}
                <button
                  onClick={() => { setMode("register"); setError("") }}
                  className="font-medium text-primary hover:underline"
                >
                  Criar conta
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{" "}
                <button
                  onClick={() => { setMode("login"); setError("") }}
                  className="font-medium text-primary hover:underline"
                >
                  Entrar
                </button>
              </>
            )}
          </p>

          {/* Support link */}
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Não conseguiu acessar?{" "}
            <a href="https://api.whatsapp.com/send/?phone=5513978207673&text=Estou+com+uma+d%C3%BAvida&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
              Chame o Suporte
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
