import { CheckCircle2, X } from "lucide-react"

const wins = [
  { pair: "XAU/USD·M1", value: "WIN +R$ 830,00" },
  { pair: "BTC/USD·M1", value: "WIN +R$ 610,88" },
  { pair: "USD/JPY·M1", value: "WIN +R$ 980,30" },
]

export function WinCards() {
  return (
    <div className="flex flex-col gap-3">
      {wins.map((w) => (
        <div
          key={w.pair}
          className="flex items-center gap-3 rounded-xl border border-primary/40 bg-background/70 px-4 py-3 shadow-[0_0_25px_-8px_rgba(0,102,255,0.5)] backdrop-blur"
        >
          <CheckCircle2 className="size-6 shrink-0 text-primary" />
          <div className="min-w-[150px]">
            <p className="text-xs text-muted-foreground">{w.pair}</p>
            <p className="text-base font-bold text-primary">{w.value}</p>
          </div>
          <X className="size-4 shrink-0 text-muted-foreground" />
        </div>
      ))}
    </div>
  )
}
