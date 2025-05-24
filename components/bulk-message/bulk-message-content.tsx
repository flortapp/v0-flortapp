"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { notificationService } from "@/services/notification-service"

// Target group options for reuse
const targetGroupOptions = [
  {
    value: "active",
    label: "Aktif Kullanıcılar",
    description: "Son 7 gün içinde giriş yapanlar",
  },
  {
    value: "inactive",
    label: "İnaktif Kullanıcılar",
    description: "30 günden fazla giriş yapmayanlar",
  },
  {
    value: "new",
    label: "Yeni Kayıt Olanlar",
    description: "Son 30 gün içinde kayıt olanlar",
  },
  {
    value: "vip",
    label: "VIP Üyeler",
    description: "Premium üyelik statüsüne sahip kullanıcılar",
  },
]

// Schema for bulk message form
const bulkMessageFormSchema = z.object({
  title: z.string().min(2, {
    message: "Başlık en az 2 karakter olmalıdır.",
  }),
  message: z.string().min(10, {
    message: "Mesaj en az 10 karakter olmalıdır.",
  }),
  targetGroup: z.string({
    required_error: "Lütfen bir hedef grup seçin.",
  }),
  sendToAll: z.boolean().default(false),
  scheduleTime: z.string().optional(),
})

// Schema for notification form
const notificationFormSchema = z.object({
  title: z.string().min(2, {
    message: "Başlık en az 2 karakter olmalıdır.",
  }),
  message: z.string().min(10, {
    message: "Mesaj en az 10 karakter olmalıdır.",
  }),
  type: z.enum(["info", "success", "warning", "error"], {
    required_error: "Lütfen bir bildirim türü seçin.",
  }),
  targetGroup: z.string().optional(),
  targetUsers: z.string().optional(),
  sendToAll: z.boolean().default(false),
})

type BulkMessageFormValues = z.infer<typeof bulkMessageFormSchema>
type NotificationFormValues = z.infer<typeof notificationFormSchema>

export function BulkMessageContent() {
  const [activeTab, setActiveTab] = useState("bulk-message")
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  // Bulk message form
  const bulkMessageForm = useForm<BulkMessageFormValues>({
    resolver: zodResolver(bulkMessageFormSchema),
    defaultValues: {
      title: "",
      message: "",
      sendToAll: false,
      scheduleTime: "",
    },
  })

  // Notification form
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "info",
      targetGroup: "",
      targetUsers: "",
      sendToAll: false,
    },
  })

  // Handle bulk message submission
  function onBulkMessageSubmit(data: BulkMessageFormValues) {
    setIsSending(true)

    // Simulate API call
    setTimeout(() => {
      setIsSending(false)
      toast({
        title: "Toplu Mesaj Gönderildi",
        description: `"${data.title}" başlıklı mesaj ${data.sendToAll ? "tüm kullanıcılara" : data.targetGroup + " grubuna"} başarıyla gönderildi.`,
      })
      bulkMessageForm.reset()
    }, 1500)
  }

  // Handle notification submission
  function onNotificationSubmit(data: NotificationFormValues) {
    setIsSending(true)

    // Add notification using the notification service
    notificationService.addNotification({
      title: data.title,
      message: data.message,
      type: data.type,
      read: false,
    })

    // Determine target description for toast
    let targetDescription = "tüm kullanıcılara"
    if (data.sendToAll) {
      targetDescription = "tüm kullanıcılara"
    } else if (data.targetGroup) {
      const group = targetGroupOptions.find((g) => g.value === data.targetGroup)
      targetDescription = group ? `${group.label} grubuna` : "seçili gruba"
    } else if (data.targetUsers) {
      targetDescription = "belirli kullanıcılara"
    }

    // Simulate API call
    setTimeout(() => {
      setIsSending(false)
      toast({
        title: "Bildirim Gönderildi",
        description: `"${data.title}" başlıklı bildirim ${targetDescription} başarıyla gönderildi.`,
      })
      notificationForm.reset()
    }, 1500)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Mesaj ve Bildirim Gönderimi</h1>
        <p className="text-muted-foreground">Kullanıcılara toplu mesaj veya bildirim gönderin.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bulk-message">Toplu Mesaj</TabsTrigger>
          <TabsTrigger value="notification">Bildirim</TabsTrigger>
        </TabsList>

        {/* Bulk Message Tab */}
        <TabsContent value="bulk-message">
          <Card>
            <CardHeader>
              <CardTitle>Toplu Mesaj Gönder</CardTitle>
              <CardDescription>Belirli bir kullanıcı grubuna veya tüm kullanıcılara mesaj gönderin.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...bulkMessageForm}>
                <form onSubmit={bulkMessageForm.handleSubmit(onBulkMessageSubmit)} className="space-y-6">
                  <FormField
                    control={bulkMessageForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mesaj Başlığı</FormLabel>
                        <FormControl>
                          <Input placeholder="Mesaj başlığını girin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bulkMessageForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mesaj İçeriği</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Mesaj içeriğini girin" className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={bulkMessageForm.control}
                      name="targetGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hedef Grup</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={bulkMessageForm.watch("sendToAll")}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Bir grup seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {targetGroupOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex flex-col">
                                    <span>{option.label}</span>
                                    <span className="text-xs text-muted-foreground">{option.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bulkMessageForm.control}
                      name="scheduleTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gönderim Zamanı (Opsiyonel)</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormDescription>Boş bırakılırsa hemen gönderilir.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={bulkMessageForm.control}
                    name="sendToAll"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked)
                              if (checked) {
                                bulkMessageForm.setValue("targetGroup", "")
                              }
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Tüm Kullanıcılara Gönder</FormLabel>
                          <FormDescription>
                            Bu seçenek işaretlenirse, mesaj tüm kullanıcılara gönderilir.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <CardFooter className="px-0 pb-0">
                    <Button type="submit" disabled={isSending}>
                      {isSending ? "Gönderiliyor..." : "Mesajı Gönder"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Tab */}
        <TabsContent value="notification">
          <Card>
            <CardHeader>
              <CardTitle>Bildirim Gönder</CardTitle>
              <CardDescription>
                Uygulama içi bildirim gönderin. Bu bildirimler kullanıcıların bildirim panelinde görünecektir.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <FormField
                    control={notificationForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bildirim Başlığı</FormLabel>
                        <FormControl>
                          <Input placeholder="Bildirim başlığını girin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bildirim İçeriği</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Bildirim içeriğini girin" className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={notificationForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bildirim Türü</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Bir tür seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="info">Bilgi</SelectItem>
                              <SelectItem value="success">Başarı</SelectItem>
                              <SelectItem value="warning">Uyarı</SelectItem>
                              <SelectItem value="error">Hata</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="targetGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hedef Grup</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={notificationForm.watch("sendToAll")}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Bir grup seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {targetGroupOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex flex-col">
                                    <span>{option.label}</span>
                                    <span className="text-xs text-muted-foreground">{option.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Grup seçilirse, bildirim seçilen gruptaki tüm kullanıcılara gönderilir.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={notificationForm.control}
                    name="targetUsers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Belirli Kullanıcılar (Opsiyonel)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Kullanıcı ID'lerini virgülle ayırarak girin"
                            {...field}
                            disabled={notificationForm.watch("sendToAll") || !!notificationForm.watch("targetGroup")}
                          />
                        </FormControl>
                        <FormDescription>
                          Belirli kullanıcılara bildirim göndermek için ID'leri virgülle ayırarak girin. Grup seçiliyse
                          bu alan dikkate alınmaz.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationForm.control}
                    name="sendToAll"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked)
                              if (checked) {
                                notificationForm.setValue("targetGroup", "")
                                notificationForm.setValue("targetUsers", "")
                              }
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Tüm Kullanıcılara Gönder</FormLabel>
                          <FormDescription>
                            Bu seçenek işaretlenirse, bildirim tüm kullanıcılara gönderilir.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <CardFooter className="px-0 pb-0">
                    <Button type="submit" disabled={isSending}>
                      {isSending ? "Gönderiliyor..." : "Bildirimi Gönder"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
