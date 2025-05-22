export type PlatformType = "ios" | "android" | "all"
export type PurchaseType = "consumable" | "non_consumable" | "subscription"
export type SubscriptionPeriod = "weekly" | "monthly" | "quarterly" | "biannual" | "annual"
export type PurchaseStatus = "active" | "inactive"

// Temel satın alım tipi
export interface InAppPurchaseBase {
  id: string
  title: string
  description?: string
  icon: string
  status: PurchaseStatus
  sortOrder?: number
  createdAt: string
  updatedAt?: string
  productId: {
    ios?: string
    android?: string
  }
  price: {
    ios?: number
    android?: number
  }
  currency?: {
    ios?: string
    android?: string
  }
}

// Jeton paketi tipi
export interface TokenPackage extends InAppPurchaseBase {
  type: "token_package"
  tokenAmount: number
}

// VIP üyelik paketi tipi
export interface VipSubscription extends InAppPurchaseBase {
  type: "vip_subscription"
  subscriptionPeriod: SubscriptionPeriod
  features: string[]
  trialPeriodDays?: number
}

// Hediye tipi
export interface Gift extends InAppPurchaseBase {
  type: "gift"
  tokenCost: number
  imageUrl: string
}

// Birleşik tip
export type InAppPurchase = TokenPackage | VipSubscription | Gift

// Form veri tipleri
export type TokenPackageFormData = Omit<TokenPackage, "id" | "createdAt" | "updatedAt" | "type"> & {
  type: "token_package"
}
export type VipSubscriptionFormData = Omit<VipSubscription, "id" | "createdAt" | "updatedAt" | "type"> & {
  type: "vip_subscription"
}
export type GiftFormData = Omit<Gift, "id" | "createdAt" | "updatedAt" | "type"> & { type: "gift" }

// İstatistik tipleri
export interface PurchaseStats {
  totalSold: number
  revenue: {
    ios?: number
    android?: number
    total: number
  }
  lastPurchased?: string
}
