import { AdminLayout } from "@/components/layout/admin-layout"
import { BotForm } from "@/components/bot-management/bot-form"

// Mock bot data for demonstration
const mockBotData = {
  id: "1",
  name: "Sophia",
  gender: "female",
  age: 28,
  location: "İstanbul",
  interests: ["Yoga", "Seyahat", "Fotoğrafçılık"],
  bio: "Merhaba! Ben yeni insanlarla tanışmayı ve sohbet etmeyi seven biriyim. Yoga yapmayı, seyahat etmeyi ve fotoğraf çekmeyi seviyorum. Benimle tanışmak ister misin?",
  avatar: "/abstract-geometric-shapes.png?height=200&width=200&query=female avatar",
  initialMessages: [
    "Merhaba! Profilini inceledim ve çok ilgimi çekti. Nasılsın?",
    "Selam! Fotoğraflarına baktım ve çok etkilendim. Tanışabilir miyiz?",
    "Merhaba! Profilinde yazdıklarını okudum ve ortak ilgi alanlarımız var gibi görünüyor. Biraz sohbet etmek ister misin?",
  ],
  responseDelay: "medium",
  isVerified: true,
  isActive: true,
}

export default function EditBotPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <BotForm editMode={true} botData={mockBotData} />
    </AdminLayout>
  )
}
