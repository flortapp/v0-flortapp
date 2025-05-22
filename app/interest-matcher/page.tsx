import { InterestMatcher } from "@/components/bot-management/interest-matcher"

export default function InterestMatcherPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">İlgi Alanı Eşleştirici</h1>
      <InterestMatcher />
    </div>
  )
}
