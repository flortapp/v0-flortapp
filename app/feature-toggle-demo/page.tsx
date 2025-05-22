import { FeatureShowcase } from "@/components/feature-toggle/feature-showcase"

export default function FeatureToggleDemoPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Özellik Bayrakları</h1>
      <p className="mb-6 text-muted-foreground">
        Bu sayfa, uygulamadaki tüm özellik bayraklarını (feature flags) ve durumlarını gösterir. Kırmızı ile işaretlenen
        özellikler henüz geliştirme aşamasındadır.
      </p>
      <FeatureShowcase />
    </div>
  )
}
