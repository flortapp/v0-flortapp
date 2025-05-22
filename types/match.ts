export interface Match {
  id: string
  userId: string
  botId: string
  score: number // 0-100 arası eşleşme skoru
  createdAt: string
  status: "pending" | "accepted" | "rejected"
  commonInterests: string[]
}
