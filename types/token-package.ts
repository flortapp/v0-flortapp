export interface TokenPackage {
  id: string
  title: string
  description?: string
  icon: string
  tokenAmount: number
  price: number // Added price field
  currency?: string // Added optional currency field (defaults to TL)
  status: "active" | "inactive" | "promotional"
  createdAt: string
  updatedAt?: string
  promotionalDetails?: {
    validUntil?: string
  }
  featured?: boolean
  sortOrder?: number
}

export type TokenPackageFormData = Omit<TokenPackage, "id" | "createdAt" | "updatedAt">

export interface TokenPackageStats {
  totalSold: number
  lastPurchased?: string
}
