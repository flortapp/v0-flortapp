"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Tag, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Define interest categories with their Turkish translations
const interestCategories = {
  travel: {
    name: "Seyahat",
    relatedTerms: ["Gezi", "Tatil", "Turizm", "Dünya Turu", "Macera"],
    suggestedMessages: [
      "En sevdiğin seyahat destinasyonu neresi?",
      "Hiç yurt dışına çıktın mı?",
      "Tatil için deniz kenarı mı, dağlar mı tercih edersin?",
      "Seyahat etmeyi seviyorum, özellikle yeni kültürleri keşfetmek harika.",
      "Bir sonraki tatil planın nedir?",
    ],
    icon: "🌍",
  },
  food: {
    name: "Yemek",
    relatedTerms: ["Mutfak", "Gurme", "Restoran", "Pişirme", "Lezzetler"],
    suggestedMessages: [
      "En sevdiğin yemek nedir?",
      "Yemek yapmayı sever misin?",
      "Hangi mutfağı tercih edersin?",
      "Dışarıda yemek yemeyi mi yoksa evde pişirmeyi mi tercih edersin?",
      "Yeni tarifler denemeyi seviyorum, özellikle tatlılar.",
    ],
    icon: "🍕",
  },
  hiking: {
    name: "Yürüyüş",
    relatedTerms: ["Trekking", "Dağcılık", "Kamp", "Doğa", "Outdoor"],
    suggestedMessages: [
      "Doğa yürüyüşü yapmayı sever misin?",
      "Hangi parkurları denedin?",
      "Kamp yapmayı sever misin?",
      "Doğada vakit geçirmek beni rahatlatıyor.",
      "Hafta sonu bir doğa yürüyüşüne ne dersin?",
    ],
    icon: "🥾",
  },
  yoga: {
    name: "Yoga",
    relatedTerms: ["Meditasyon", "Mindfulness", "Pilates", "Esneme", "Sağlık"],
    suggestedMessages: [
      "Yoga pratiğin var mı?",
      "Hangi yoga stilini tercih edersin?",
      "Meditasyon yapıyor musun?",
      "Yoga benim için hem fiziksel hem zihinsel bir terapi.",
      "Sabah rutininde yoga var mı?",
    ],
    icon: "🧘‍♀️",
  },
  games: {
    name: "Oyunlar",
    relatedTerms: ["Video Oyunları", "Bilgisayar Oyunları", "Konsol", "Mobil Oyunlar", "E-Spor"],
    suggestedMessages: [
      "Hangi oyunları oynuyorsun?",
      "Favori oyun türün nedir?",
      "Konsol mu PC mi tercih edersin?",
      "Boş zamanlarımda oyun oynamayı seviyorum.",
      "Yeni çıkan oyunları takip ediyor musun?",
    ],
    icon: "🎮",
  },
  movies: {
    name: "Filmler",
    relatedTerms: ["Sinema", "Dizi", "Netflix", "Hollywood", "Film Geceleri"],
    suggestedMessages: [
      "Son zamanlarda izlediğin güzel bir film var mı?",
      "Hangi film türlerini seversin?",
      "Favori aktörün kim?",
      "Film izlemek benim için harika bir kaçış yolu.",
      "Sinemaya gitmek mi evde film izlemek mi?",
    ],
    icon: "🎬",
  },
  books: {
    name: "Kitaplar",
    relatedTerms: ["Okuma", "Edebiyat", "Roman", "Şiir", "Kütüphane"],
    suggestedMessages: [
      "Şu anda hangi kitabı okuyorsun?",
      "Favori yazarın kim?",
      "Hangi tür kitapları okumayı seversin?",
      "Kitap okumak benim için vazgeçilmez bir tutku.",
      "Bana önereceğin bir kitap var mı?",
    ],
    icon: "📚",
  },
  animals: {
    name: "Hayvanlar",
    relatedTerms: ["Evcil Hayvanlar", "Köpekler", "Kediler", "Doğa", "Vahşi Yaşam"],
    suggestedMessages: [
      "Evcil hayvanın var mı?",
      "Köpek mi kedi mi tercih edersin?",
      "Hayvanlarla vakit geçirmeyi seviyorum.",
      "Hangi hayvanı en çok seviyorsun?",
      "Hayvanat bahçesine gitmeyi sever misin?",
    ],
    icon: "🐾",
  },
  wine: {
    name: "Şarap",
    relatedTerms: ["İçki", "Bağcılık", "Tadım", "Gurme", "Kokteyl"],
    suggestedMessages: [
      "Şarap içmeyi sever misin?",
      "Kırmızı mı beyaz mı tercih edersin?",
      "Favori şarap çeşidin nedir?",
      "İyi bir yemekle şarap eşleştirmesi yapmayı seviyorum.",
      "Hiç şarap tadımına katıldın mı?",
    ],
    icon: "🍷",
  },
}

// Define bot personas that match with interests
const botPersonas = [
  {
    id: 1,
    name: "Ayşe",
    avatar: "/abstract-geometric-shapes.png?height=200&width=200&query=female avatar",
    interests: ["Yoga", "Seyahat", "Kitaplar"],
    bio: "Merhaba! Ben Ayşe. Yoga eğitmeniyim ve seyahat etmeyi çok seviyorum. Boş zamanlarımda kitap okumak benim için vazgeçilmez.",
  },
  {
    id: 2,
    name: "Mehmet",
    avatar: "/male-avatar.png",
    interests: ["Yürüyüş", "Yemek", "Filmler"],
    bio: "Selam, ben Mehmet! Doğa yürüyüşleri yapmayı ve yeni lezzetler keşfetmeyi seviyorum. Film izlemek de en büyük hobim.",
  },
  {
    id: 3,
    name: "Zeynep",
    avatar: "/diverse-female-profiles.png",
    interests: ["Seyahat", "Şarap", "Kitaplar"],
    bio: "Merhaba, ben Zeynep! Dünyayı keşfetmeyi, iyi bir şarap eşliğinde kitap okumayı seviyorum. Yeni insanlarla tanışmak beni heyecanlandırıyor.",
  },
  {
    id: 4,
    name: "Emre",
    avatar: "/robot-avatar.png",
    interests: ["Oyunlar", "Filmler", "Hayvanlar"],
    bio: "Hey! Ben Emre. Video oyunları oynamayı, film izlemeyi ve hayvanlarla vakit geçirmeyi seviyorum. Özellikle köpekler en büyük tutkum.",
  },
]

export function InterestMatcher() {
  const { toast } = useToast()
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("interests")
  const [matchedBots, setMatchedBots] = useState<typeof botPersonas>([])

  // Filter bots based on selected interest
  useEffect(() => {
    if (selectedInterest) {
      const interest = interestCategories[selectedInterest as keyof typeof interestCategories].name
      const filtered = botPersonas.filter((bot) => bot.interests.includes(interest))
      setMatchedBots(filtered)
    } else {
      setMatchedBots([])
    }
  }, [selectedInterest])

  // Filter interests based on search term
  const filteredInterests = Object.entries(interestCategories).filter(([key, value]) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      value.name.toLowerCase().includes(searchLower) ||
      value.relatedTerms.some((term) => term.toLowerCase().includes(searchLower))
    )
  })

  const handleInterestSelect = (key: string) => {
    setSelectedInterest(key)
    toast({
      title: "İlgi Alanı Seçildi",
      description: `${interestCategories[key as keyof typeof interestCategories].name} ilgi alanı seçildi.`,
      variant: "default",
    })
  }

  const handleAddToBotProfile = (botId: number) => {
    if (!selectedInterest) return

    toast({
      title: "İlgi Alanı Eklendi",
      description: `${interestCategories[selectedInterest as keyof typeof interestCategories].name} ilgi alanı bot profiline eklendi.`,
      variant: "success",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>İlgi Alanı Eşleştirici</CardTitle>
          <CardDescription>İlgi alanlarını botlarla eşleştirin ve konuşma önerileri alın</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="İlgi alanı ara..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Tabs defaultValue="interests" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="interests">İlgi Alanları</TabsTrigger>
                <TabsTrigger value="matched-bots">Eşleşen Botlar</TabsTrigger>
                <TabsTrigger value="suggestions">Konuşma Önerileri</TabsTrigger>
              </TabsList>

              <TabsContent value="interests" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                  {filteredInterests.map(([key, interest]) => (
                    <div
                      key={key}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedInterest === key ? "border-primary bg-primary/10" : "hover:border-primary/50"
                      }`}
                      onClick={() => handleInterestSelect(key)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{interest.icon}</span>
                          <h3 className="font-medium">{interest.name}</h3>
                        </div>
                        {selectedInterest === key && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {interest.relatedTerms.map((term, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {term}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredInterests.length === 0 && (
                  <div className="text-center p-6 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">Arama kriterine uygun ilgi alanı bulunamadı.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="matched-bots">
                {selectedInterest ? (
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <p>
                        <span className="font-medium">
                          {interestCategories[selectedInterest as keyof typeof interestCategories].name}
                        </span>{" "}
                        ilgi alanına sahip botlar:
                      </p>
                    </div>

                    {matchedBots.length > 0 ? (
                      <div className="space-y-3">
                        {matchedBots.map((bot) => (
                          <div key={bot.id} className="flex items-start gap-3 p-3 border rounded-lg">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={bot.avatar || "/placeholder.svg"} alt={bot.name} />
                              <AvatarFallback>{bot.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-medium">{bot.name}</h3>
                              <div className="flex flex-wrap gap-1 my-1">
                                {bot.interests.map((interest, i) => (
                                  <Badge
                                    key={i}
                                    className={
                                      interest ===
                                      interestCategories[selectedInterest as keyof typeof interestCategories].name
                                        ? "bg-primary"
                                        : "bg-secondary"
                                    }
                                  >
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{bot.bio}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAddToBotProfile(bot.id)}
                              className="whitespace-nowrap"
                            >
                              Profilini Düzenle
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-6 border border-dashed rounded-lg">
                        <p className="text-muted-foreground">Bu ilgi alanına sahip bot bulunamadı.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-6 border border-dashed rounded-lg mt-4">
                    <p className="text-muted-foreground">Lütfen önce bir ilgi alanı seçin.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="suggestions">
                {selectedInterest ? (
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {interestCategories[selectedInterest as keyof typeof interestCategories].icon}
                      </span>
                      <h3 className="font-medium">
                        {interestCategories[selectedInterest as keyof typeof interestCategories].name} Konuşma Önerileri
                      </h3>
                    </div>

                    <div className="space-y-2">
                      {interestCategories[selectedInterest as keyof typeof interestCategories].suggestedMessages.map(
                        (message, i) => (
                          <div key={i} className="flex items-start gap-3 group">
                            <div className="bg-[#2b2c46] text-white rounded-lg p-3 flex-1">
                              <p className="text-sm">{message}</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                navigator.clipboard.writeText(message)
                                toast({
                                  title: "Kopyalandı",
                                  description: "Mesaj panoya kopyalandı.",
                                  variant: "default",
                                })
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-copy"
                              >
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                              </svg>
                            </Button>
                          </div>
                        ),
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => {
                          toast({
                            title: "Mesajlar Eklendi",
                            description: `${interestCategories[selectedInterest as keyof typeof interestCategories].name} konuşma önerileri bot mesaj havuzuna eklendi.`,
                            variant: "success",
                          })
                        }}
                      >
                        Tüm Mesajları Bot Havuzuna Ekle
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 border border-dashed rounded-lg mt-4">
                    <p className="text-muted-foreground">Lütfen önce bir ilgi alanı seçin.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>İlgi Alanı İstatistikleri</CardTitle>
          <CardDescription>İlgi alanlarının bot profilleri ve konuşmalardaki kullanım istatistikleri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">En Popüler İlgi Alanları</h3>
              <ol className="space-y-2">
                <li className="flex justify-between items-center">
                  <span>1. Seyahat</span>
                  <Badge>68%</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>2. Filmler</span>
                  <Badge>54%</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>3. Yemek</span>
                  <Badge>47%</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>4. Kitaplar</span>
                  <Badge>42%</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>5. Yoga</span>
                  <Badge>35%</Badge>
                </li>
              </ol>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Konuşma Başlatma Oranı</h3>
              <ol className="space-y-2">
                <li className="flex justify-between items-center">
                  <span>1. Oyunlar</span>
                  <Badge className="bg-green-500">78%</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>2. Hayvanlar</span>
                  <Badge className="bg-green-500">72%</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>3. Seyahat</span>
                  <Badge className="bg-green-500">65%</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>4. Yemek</span>
                  <Badge className="bg-amber-500">58%</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>5. Şarap</span>
                  <Badge className="bg-amber-500">52%</Badge>
                </li>
              </ol>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Kullanıcı Etkileşimi</h3>
              <ol className="space-y-2">
                <li className="flex justify-between items-center">
                  <span>1. Filmler</span>
                  <Badge className="bg-blue-500">8.4</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>2. Oyunlar</span>
                  <Badge className="bg-blue-500">7.9</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>3. Seyahat</span>
                  <Badge className="bg-blue-500">7.6</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>4. Yürüyüş</span>
                  <Badge className="bg-blue-500">7.2</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>5. Hayvanlar</span>
                  <Badge className="bg-blue-500">6.8</Badge>
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
