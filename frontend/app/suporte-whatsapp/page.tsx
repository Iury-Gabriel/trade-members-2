import { AppShell } from "@/components/app-shell"
import { ProductHero } from "@/components/product-hero"
import { MessageCircle, ExternalLink } from "lucide-react"

export default function SuporteWhatsappPage() {
  return (
    <AppShell>
      <ProductHero
        backLabel="Voltar"
        title={
          <>
            Suporte <span className="text-primary">WhatsApp</span>
          </>
        }
        description="Fale diretamente com nosso suporte pelo WhatsApp. Estamos prontos para te ajudar."
      />
      <div className="mx-auto max-w-2xl px-6 py-10 lg:px-8">
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#25D366]/20 text-[#25D366]">
            <MessageCircle className="size-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Precisa de ajuda?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Clique no botão abaixo para abrir uma conversa direta com nosso suporte no WhatsApp. Responderemos o mais rápido possível.
          </p>
          <a
            href="https://api.whatsapp.com/send/?phone=5513978207673&text=Estou+com+uma+d%C3%BAvida&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#20bd5a]"
          >
            <ExternalLink className="size-4" />
            Chamar no WhatsApp
          </a>
        </div>
      </div>
    </AppShell>
  )
}
