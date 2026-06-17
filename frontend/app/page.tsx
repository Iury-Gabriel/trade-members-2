import { AppShell } from "@/components/app-shell"
import { HeroCarousel } from "@/components/hero-carousel"
import { ProductsSection } from "@/components/products-section"

export default function Page() {
  return (
    <AppShell>
      <div className="p-6 lg:p-8">
        <HeroCarousel />
        <ProductsSection />
      </div>
    </AppShell>
  )
}
