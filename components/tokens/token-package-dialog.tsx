"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Info } from "lucide-react"
import { format } from "date-fns"
import type { TokenPackage } from "@/types/token-package"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Başlık en az 2 karakter olmalıdır.",
    })
    .max(50, {
      message: "Başlık en fazla 50 karakter olmalıdır.",
    }),
  description: z
    .string()
    .max(200, {
      message: "Açıklama en fazla 200 karakter olmalıdır.",
    })
    .optional(),
  icon: z.string({
    required_error: "Lütfen bir ikon seçin.",
  }),
  tokenAmount: z.coerce
    .number()
    .int({
      message: "Jeton miktarı tam sayı olmalıdır.",
    })
    .positive({
      message: "Jeton miktarı pozitif olmalıdır.",
    }),
  price: z.coerce.number().min(0, {
    message: "Fiyat negatif olamaz.",
  }),
  currency: z.string().default("TL"),
  status: z.enum(["active", "inactive", "promotional"], {
    required_error: "Lütfen bir durum seçin.",
  }),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().optional(),
  isPromotional: z.boolean().default(false),
  validUntil: z.date().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface TokenPackageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: TokenPackage) => void
  title: string
  defaultValues?: TokenPackage
}

export function TokenPackageDialog({ open, onOpenChange, onSave, title, defaultValues }: TokenPackageDialogProps) {
  const [activeTab, setActiveTab] = useState("general")

  // Transform the defaultValues to match the form schema
  const transformedDefaults = defaultValues
    ? {
        ...defaultValues,
        isPromotional: defaultValues.status === "promotional",
        validUntil: defaultValues.promotionalDetails?.validUntil
          ? new Date(defaultValues.promotionalDetails.validUntil)
          : undefined,
      }
    : {
        title: "",
        description: "",
        icon: "Gift",
        tokenAmount: 0,
        price: 0,
        currency: "TL",
        status: "active" as const,
        featured: false,
        sortOrder: 0,
        isPromotional: false,
      }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: transformedDefaults,
  })

  const isPromotional = form.watch("isPromotional")

  function onSubmit(values: FormValues) {
    // Transform form values back to TokenPackage structure
    const packageData: TokenPackage = {
      id: defaultValues?.id || "",
      title: values.title,
      description: values.description,
      icon: values.icon,
      tokenAmount: values.tokenAmount,
      price: values.price,
      currency: values.currency,
      status: values.isPromotional ? "promotional" : values.status,
      createdAt: defaultValues?.createdAt || new Date().toISOString(),
      featured: values.featured,
      sortOrder: values.sortOrder,
    }

    // Add promotional details if applicable
    if (values.isPromotional) {
      packageData.promotionalDetails = {
        validUntil: values.validUntil?.toISOString(),
      }
    }

    onSave(packageData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Jeton paketi detaylarını yapılandırın. Bittiğinde kaydet'e tıklayın.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">Genel</TabsTrigger>
                <TabsTrigger value="advanced">Gelişmiş</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Başlık</FormLabel>
                      <FormControl>
                        <Input placeholder="Paket başlığını girin" {...field} />
                      </FormControl>
                      <FormDescription>Kullanıcılara gösterilen jeton paketinin adı.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Paket açıklamasını girin" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription>Bu paketin sunduğu şeylerin kısa bir açıklaması.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İkon</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Bir ikon seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Gift">Hediye</SelectItem>
                          <SelectItem value="Package">Paket</SelectItem>
                          <SelectItem value="Gem">Mücevher</SelectItem>
                          <SelectItem value="Star">Yıldız</SelectItem>
                          <SelectItem value="CalendarClock">Takvim</SelectItem>
                          {/* New icons */}
                          <SelectItem value="Heart">Kalp</SelectItem>
                          <SelectItem value="Crown">Taç</SelectItem>
                          <SelectItem value="Trophy">Kupa</SelectItem>
                          <SelectItem value="Diamond">Elmas</SelectItem>
                          <SelectItem value="Sparkles">Parıltılar</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Bu paketi temsil eden ikon.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tokenAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jeton Miktarı</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>Bu pakette bulunan jeton sayısı.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fiyat</FormLabel>
                        <div className="flex">
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <Select
                            defaultValue={form.getValues("currency") || "TL"}
                            onValueChange={(value) => form.setValue("currency", value)}
                          >
                            <SelectTrigger className="w-[80px] ml-2">
                              <SelectValue placeholder="TL" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TL">TL</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <FormDescription>Bu paketin satış fiyatı.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durum</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPromotional}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Bir durum seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Aktif</SelectItem>
                          <SelectItem value="inactive">Pasif</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {isPromotional
                          ? "Durum, promosyon ayarlarına göre promosyon olarak ayarlanmıştır."
                          : "Bu paketin satın alınabilir olup olmadığı."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Öne Çıkan Paket</FormLabel>
                        <FormDescription>
                          Bu paketi kullanıcılara önerilen bir seçenek olarak vurgulayın.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span className="flex items-center gap-2">
                          Sıralama Düzeni
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Düşük sayılar listede önce görünür</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value || 0} />
                      </FormControl>
                      <FormDescription>
                        Paketlerin görüntülenme sırasını kontrol eder (düşük sayılar önce).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPromotional"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Promosyon Paketi</FormLabel>
                        <FormDescription>Bu paket için promosyon özelliklerini etkinleştirin.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {isPromotional && (
                  <div className="space-y-4 rounded-md border border-amber-200 bg-amber-50 p-4">
                    <FormField
                      control={form.control}
                      name="validUntil"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Geçerlilik Süresi</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={
                                    ("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")
                                  }
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Bir tarih seçin</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>Bu promosyonun sona erdiği tarih.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                İptal
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-pink-600 to-red-500 hover:from-pink-700 hover:to-red-600"
              >
                Değişiklikleri Kaydet
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
