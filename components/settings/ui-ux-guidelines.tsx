"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, CheckCircle, Layout, Palette, Type, Layers, MousePointer, Zap } from "lucide-react"

export function UiUxGuidelines() {
  return (
    <div className="space-y-6">
      <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-900">
        <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle>Tasarım Sistemi</AlertTitle>
        <AlertDescription>
          Bu tasarım sistemi, uygulama genelinde tutarlı bir kullanıcı deneyimi sağlamak için oluşturulmuştur.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="principles" className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="principles" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Prensipler</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span className="hidden sm:inline">Düzen</span>
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Renkler</span>
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span className="hidden sm:inline">Tipografi</span>
          </TabsTrigger>
          <TabsTrigger value="components" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Bileşenler</span>
          </TabsTrigger>
          <TabsTrigger value="interactions" className="flex items-center gap-2">
            <MousePointer className="h-4 w-4" />
            <span className="hidden sm:inline">Etkileşimler</span>
          </TabsTrigger>
        </TabsList>

        {/* Prensipler */}
        <TabsContent value="principles">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tasarım Prensipleri</CardTitle>
                <CardDescription>Uygulama genelinde izlenen temel prensipler</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> Tutarlılık
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tüm sayfalarda ve bileşenlerde tutarlı tasarım öğeleri kullanılmalıdır. Aynı işlevi gören öğeler
                    aynı şekilde görünmeli ve davranmalıdır.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> Sadelik
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Arayüz, kullanıcıyı bunaltmayacak şekilde sade ve anlaşılır olmalıdır. Gereksiz öğelerden
                    kaçınılmalıdır.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> Erişilebilirlik
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Uygulama, farklı yeteneklere sahip tüm kullanıcılar tarafından kullanılabilir olmalıdır. Renk
                    kontrastı, klavye navigasyonu ve ekran okuyucu desteği sağlanmalıdır.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> Geri Bildirim
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Kullanıcı eylemleri her zaman görsel veya işitsel geri bildirimle onaylanmalıdır. Yükleme durumları,
                    başarı ve hata mesajları açıkça gösterilmelidir.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kullanıcı Deneyimi Hedefleri</CardTitle>
                <CardDescription>Kullanıcı deneyimini şekillendiren temel hedefler</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" /> Verimlilik
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Kullanıcıların görevlerini minimum adımla tamamlayabilmeleri sağlanmalıdır. Sık kullanılan işlevler
                    kolay erişilebilir olmalıdır.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" /> Öğrenilebilirlik
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Yeni kullanıcılar, uygulamayı kolayca öğrenebilmelidir. Karmaşık işlevler için ipuçları ve
                    açıklamalar sağlanmalıdır.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" /> Hata Önleme
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Kullanıcıların hata yapmasını önleyecek tasarım çözümleri sunulmalıdır. Kritik işlemler için onay
                    istenmelidir.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" /> Memnuniyet
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Uygulama kullanımı keyifli ve tatmin edici olmalıdır. Görsel çekicilik, animasyonlar ve başarılı
                    etkileşimler kullanıcı memnuniyetini artırır.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Düzen */}
        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Sayfa Düzeni Standartları</CardTitle>
              <CardDescription>Tutarlı sayfa yapısı için izlenmesi gereken kurallar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-medium">Izgara Sistemi</h3>
                  <p className="text-sm text-muted-foreground">
                    Tüm sayfalar 12 sütunlu bir ızgara sistemi kullanmalıdır. Mobil görünümde tek sütun, tablet
                    görünümünde 2 sütun ve masaüstü görünümünde 2-4 sütun kullanılmalıdır.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Kenar Boşlukları</h3>
                  <p className="text-sm text-muted-foreground">
                    Sayfa kenarlarında 16px (mobil) ve 24px (masaüstü) kenar boşluğu kullanılmalıdır. Bileşenler
                    arasında tutarlı boşluklar (8px, 16px, 24px, 32px) kullanılmalıdır.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Sayfa Yapısı</h3>
                  <p className="text-sm text-muted-foreground">
                    Her sayfa, başlık, açıklama ve içerik bölümlerinden oluşmalıdır. Başlık her zaman sayfanın en
                    üstünde yer almalıdır.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Kart Kullanımı</h3>
                  <p className="text-sm text-muted-foreground">
                    İlgili içerikler kartlar içinde gruplandırılmalıdır. Her kartın başlık, açıklama ve içerik bölümleri
                    tutarlı bir şekilde düzenlenmelidir.
                  </p>
                </div>
              </div>

              <div className="border rounded-md p-4 bg-slate-50 dark:bg-slate-900">
                <h3 className="font-medium mb-2">Örnek Sayfa Yapısı</h3>
                <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-md p-4 space-y-4">
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 opacity-70"></div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border rounded-md p-4 bg-white dark:bg-slate-950">
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 opacity-70 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6"></div>
                      </div>
                    </div>
                    <div className="border rounded-md p-4 bg-white dark:bg-slate-950">
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 opacity-70 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Renkler */}
        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>Renk Paleti</CardTitle>
              <CardDescription>Uygulama genelinde kullanılan standart renkler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium">Ana Renkler</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="h-12 bg-gradient-to-r from-pink-600 to-red-500 rounded-md"></div>
                      <p className="text-xs font-medium">Ana Renk</p>
                      <p className="text-xs text-muted-foreground">Vurgu ve CTA butonları için</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 bg-kisstagram-dark rounded-md"></div>
                      <p className="text-xs font-medium">Koyu Tema</p>
                      <p className="text-xs text-muted-foreground">Koyu mod arka planı</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 bg-kisstagram-light rounded-md border"></div>
                      <p className="text-xs font-medium">Açık Tema</p>
                      <p className="text-xs text-muted-foreground">Açık mod arka planı</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 bg-kisstagram-accent rounded-md"></div>
                      <p className="text-xs font-medium">Vurgu</p>
                      <p className="text-xs text-muted-foreground">İkincil vurgu öğeleri için</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Durum Renkleri</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="h-12 bg-green-500 rounded-md"></div>
                      <p className="text-xs font-medium">Başarı</p>
                      <p className="text-xs text-muted-foreground">Başarılı işlemler için</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 bg-red-500 rounded-md"></div>
                      <p className="text-xs font-medium">Hata</p>
                      <p className="text-xs text-muted-foreground">Hata durumları için</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 bg-amber-500 rounded-md"></div>
                      <p className="text-xs font-medium">Uyarı</p>
                      <p className="text-xs text-muted-foreground">Uyarı mesajları için</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 bg-blue-500 rounded-md"></div>
                      <p className="text-xs font-medium">Bilgi</p>
                      <p className="text-xs text-muted-foreground">Bilgilendirme için</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Nötr Renkler</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="h-12 bg-slate-900 rounded-md"></div>
                      <p className="text-xs font-medium">Metin</p>
                      <p className="text-xs text-muted-foreground">Ana metin rengi</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 bg-slate-500 rounded-md"></div>
                      <p className="text-xs font-medium">İkincil Metin</p>
                      <p className="text-xs text-muted-foreground">Açıklamalar için</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 bg-slate-200 rounded-md border"></div>
                      <p className="text-xs font-medium">Kenarlık</p>
                      <p className="text-xs text-muted-foreground">Kenarlıklar için</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 bg-slate-100 rounded-md border"></div>
                      <p className="text-xs font-medium">Arka Plan</p>
                      <p className="text-xs text-muted-foreground">İkincil arka planlar</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tipografi */}
        <TabsContent value="typography">
          <Card>
            <CardHeader>
              <CardTitle>Tipografi Standartları</CardTitle>
              <CardDescription>Metin stillerinin tutarlı kullanımı için kurallar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Yazı Tipi</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-muted-foreground mb-2">Ana Yazı Tipi</p>
                    <p className="text-2xl font-sans">Montserrat</p>
                    <p className="text-sm mt-2">
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ
                      <br />
                      abcdefghijklmnopqrstuvwxyz
                      <br />
                      0123456789
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Başlık Hiyerarşisi</h3>
                <div className="space-y-4 border rounded-md p-4">
                  <div className="pb-2 border-b">
                    <p className="text-sm text-muted-foreground">H1 - Sayfa Başlığı</p>
                    <h1 className="text-3xl font-bold">Sayfa Başlığı</h1>
                  </div>
                  <div className="pb-2 border-b">
                    <p className="text-sm text-muted-foreground">H2 - Bölüm Başlığı</p>
                    <h2 className="text-2xl font-bold">Bölüm Başlığı</h2>
                  </div>
                  <div className="pb-2 border-b">
                    <p className="text-sm text-muted-foreground">H3 - Kart Başlığı</p>
                    <h3 className="text-lg font-medium">Kart Başlığı</h3>
                  </div>
                  <div className="pb-2 border-b">
                    <p className="text-sm text-muted-foreground">H4 - Alt Başlık</p>
                    <h4 className="text-base font-medium">Alt Başlık</h4>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Paragraf</p>
                    <p className="text-sm">
                      Bu bir paragraf metnidir. Paragraflar genellikle 14px veya 16px boyutunda ve normal ağırlıkta
                      kullanılır. Satır yüksekliği okunabilirliği artırmak için 1.5 veya 1.6 olarak ayarlanmalıdır.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Metin Stilleri</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Ana Metin</p>
                    <p>Bu bir ana metin örneğidir.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">İkincil Metin</p>
                    <p className="text-muted-foreground">Bu bir ikincil metin örneğidir.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Vurgulu Metin</p>
                    <p className="font-medium">Bu bir vurgulu metin örneğidir.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Küçük Metin</p>
                    <p className="text-xs">Bu bir küçük metin örneğidir.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bileşenler */}
        <TabsContent value="components">
          <Card>
            <CardHeader>
              <CardTitle>Bileşen Standartları</CardTitle>
              <CardDescription>Tutarlı bileşen kullanımı için kurallar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium">Kartlar</h3>
                  <div className="border rounded-md p-4">
                    <p className="text-sm text-muted-foreground mb-2">Standart Kart Yapısı</p>
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 border-b">
                        <h4 className="font-medium">Kart Başlığı</h4>
                        <p className="text-xs text-muted-foreground">Kart açıklaması</p>
                      </div>
                      <div className="p-4 bg-white dark:bg-slate-950">
                        <p className="text-sm">Kart içeriği burada yer alır.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Formlar</h3>
                  <div className="border rounded-md p-4">
                    <p className="text-sm text-muted-foreground mb-2">Form Öğeleri</p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Etiket</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Placeholder metin"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Açılır Menü</label>
                        <select className="w-full px-3 py-2 border rounded-md">
                          <option>Seçenek 1</option>
                          <option>Seçenek 2</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Butonlar</h3>
                  <div className="border rounded-md p-4">
                    <p className="text-sm text-muted-foreground mb-2">Buton Çeşitleri</p>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-4 py-2 bg-gradient-to-r from-pink-600 to-red-500 text-white rounded-md">
                        Ana Buton
                      </button>
                      <button className="px-4 py-2 border border-slate-200 rounded-md">İkincil Buton</button>
                      <button className="px-4 py-2 text-red-500 rounded-md">Metin Buton</button>
                      <button className="px-2 py-2 border border-slate-200 rounded-md">
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
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5v14" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Sekmeler</h3>
                  <div className="border rounded-md p-4">
                    <p className="text-sm text-muted-foreground mb-2">Sekme Yapısı</p>
                    <div className="border-b">
                      <div className="flex">
                        <div className="px-4 py-2 border-b-2 border-red-500 font-medium">Aktif Sekme</div>
                        <div className="px-4 py-2 text-muted-foreground">Pasif Sekme</div>
                        <div className="px-4 py-2 text-muted-foreground">Pasif Sekme</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm">Sekme içeriği burada yer alır.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Etkileşimler */}
        <TabsContent value="interactions">
          <Card>
            <CardHeader>
              <CardTitle>Etkileşim Standartları</CardTitle>
              <CardDescription>Kullanıcı etkileşimleri için tutarlı davranış kuralları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium">Durum Değişimleri</h3>
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Hover Durumu</p>
                      <div className="flex gap-2">
                        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-md">Normal</div>
                        <div className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-md">Hover</div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Öğeler üzerine gelindiğinde hafif bir arka plan değişimi olmalıdır.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Aktif Durum</p>
                      <div className="flex gap-2">
                        <div className="px-4 py-2 border rounded-md">Normal</div>
                        <div className="px-4 py-2 border-2 border-red-500 rounded-md">Aktif</div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Aktif öğeler belirgin bir kenarlık veya arka plan ile vurgulanmalıdır.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Devre Dışı Durum</p>
                      <div className="flex gap-2">
                        <div className="px-4 py-2 bg-gradient-to-r from-pink-600 to-red-500 text-white rounded-md">
                          Normal
                        </div>
                        <div className="px-4 py-2 bg-slate-300 text-slate-500 dark:bg-slate-700 dark:text-slate-400 rounded-md">
                          Devre Dışı
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Devre dışı öğeler soluk renklerle gösterilmeli ve tıklanamaz olmalıdır.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Geri Bildirimler</h3>
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Toast Bildirimleri</p>
                      <div className="p-3 bg-white dark:bg-slate-800 border rounded-md shadow-md flex items-start gap-2">
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
                          className="text-green-500"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <div>
                          <p className="font-medium text-sm">İşlem Başarılı</p>
                          <p className="text-xs text-muted-foreground">Değişiklikler kaydedildi.</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        İşlem sonuçları için kısa süreli toast bildirimleri kullanılmalıdır.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Yükleme Durumları</p>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-gradient-to-r from-pink-600 to-red-500 text-white rounded-md">
                          Normal
                        </button>
                        <button
                          className="px-4 py-2 bg-gradient-to-r from-pink-600 to-red-500 text-white rounded-md opacity-80"
                          disabled
                        >
                          Yükleniyor...
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Yükleme durumları butonlarda metin değişimi ve devre dışı bırakma ile gösterilmelidir.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Form Doğrulama</p>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">E-posta</label>
                        <input type="text" className="w-full px-3 py-2 border border-red-300 rounded-md" value="test" />
                        <p className="text-xs text-red-500">Geçerli bir e-posta adresi giriniz.</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Form hataları kırmızı kenarlık ve hata mesajı ile gösterilmelidir.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
