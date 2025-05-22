export interface User {
  id: string
  name: string
  email: string
  avatar: string
  status: "active" | "inactive" | "blocked"
  createdAt: string
  lastActive?: string
  isVip: boolean
  credits: number
  location?: string
  birthDate?: string
  interests: string[]
  online: boolean
  gender: "male" | "female" | "other"
  age: number
  registrationMethod?: "google" | "apple" | "phone" | "guest" | string
}
