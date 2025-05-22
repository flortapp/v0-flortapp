"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DefaultMessageTemplates() {
  // Mesaj kategorileri
  const messageCategories = [
    { id: "greeting", name: "Karşılama Mesajları" },
    { id: "chat", name: "Sohbet Mesajları" },
    { id: "zero_token", name: "Jeton Bitti Mesajları" },
  ]

  // Aktif kategori
  const [activeCategory, setActiveCategory] = useState("greeting")

  // Mesaj şablonları
  const [templates, setTemplates] = useState({
    greeting: ["Merhaba! Nasılsın? 😊", "Selam, bugün nasıl gidiyor?", "Hey, profilini gördüm ve konuşmak istedim!"],
    chat: [
      "Bu konuda ne düşünüyorsun?",
      "Bana biraz kendinden bahseder misin?",
      "Hobilerin neler?",
      "Favori filmin ne?",
    ],
    zero_token: [
      "Görünüşe göre jetonların bitti. Konuşmaya devam etmek için jeton satın alabilirsin.",
      "Jetonların tükendi! Sohbete devam etmek için jeton satın almak ister misin?",
      "Üzgünüm, jetonların bitti. Konuşmaya devam etmek için jeton satın alabilirsin.",
    ],
  })

  // Yeni mesaj şablonu
  const [newTemplate, setNewTemplate] = useState("")

  // Mesaj şablonu ekleme
  const addTemplate = () => {
    if (newTemplate.trim() === "") return

    setTemplates((prev) => ({
      ...prev,
      [activeCategory]: [...prev[activeCategory as keyof typeof prev], newTemplate],
    }))
    setNewTemplate("")
  }

  // Mesaj şablonu silme
  const removeTemplate = (index: number) => {
    setTemplates((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory as keyof typeof prev].filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Label htmlFor="category" className="min-w-[100px]">
          Mesaj Kategorisi:
        </Label>
        <Select value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Kategori seçin" />
          </SelectTrigger>
          <SelectContent>
            {messageCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{messageCategories.find((c) => c.id === activeCategory)?.name || "Mesaj Şablonları"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates[activeCategory as keyof typeof templates].map((template, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Textarea
                  value={template}
                  onChange={(e) => {
                    const newTemplates = { ...templates }
                    newTemplates[activeCategory as keyof typeof templates][index] = e.target.value
                    setTemplates(newTemplates)
                  }}
                  className="min-h-[80px]"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTemplate(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                >
                  <Trash size={18} />
                </Button>
              </div>
            ))}

            <div className="flex items-start space-x-2 pt-4">
              <Textarea
                value={newTemplate}
                onChange={(e) => setNewTemplate(e.target.value)}
                placeholder="Yeni mesaj şablonu ekleyin..."
                className="min-h-[80px]"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={addTemplate}
                className="text-green-500 hover:text-green-700 hover:bg-green-100"
              >
                <Plus size={18} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">İpuçları:</h3>
        <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
          <li>Karşılama mesajları, botun kullanıcıyla ilk etkileşiminde kullanılır.</li>
          <li>Sohbet mesajları, normal konuşma akışında kullanılır.</li>
          <li>Jeton bitti mesajları, kullanıcının jetonu bittiğinde gösterilir.</li>
          <li>
            Mesajlarda <code>{"{user_name}"}</code> gibi değişkenler kullanabilirsiniz.
          </li>
        </ul>
      </div>
    </div>
  )
}
