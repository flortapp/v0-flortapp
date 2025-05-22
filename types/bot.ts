export interface Bot {
  id: string
  name: string
  avatar: string
  status: "active" | "inactive"
  createdAt: string
  interests: string[]
  age: number
  location?: string
  bio: string
  relationshipGoal: "flirt" | "friendship" | "casual" | "serious"
  messageTemplates: {
    greeting: string[]
    chat: string[]
    zeroCredit: string[]
  }
}
