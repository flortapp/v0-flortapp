export interface Message {
  id: string
  conversationId: string
  sender: "user" | "bot" | "system"
  content: string
  timestamp: string
  read: boolean
  templateId?: string // Hangi şablondan geldiği
  keywords?: string[] // Tespit edilen anahtar kelimeler
  creditCost?: number // Kullanıcıdan alınan jeton miktarı
  image?: string
  location?: {
    lat: number
    lng: number
    placeName: string
    city: string
  }
}
