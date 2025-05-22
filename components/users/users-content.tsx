"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { UsersTable } from "@/components/users/users-table"
import { UserEditDialog } from "@/components/users/user-edit-dialog"
import { useUsers } from "@/hooks/use-api-data"
import type { User } from "@/types/user"
import api from "@/services/api"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VipUsersTable } from "@/components/vip/vip-users-table"

export function UsersContent() {
  const { users, isLoading, error, refetch } = useUsers()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("all-users")

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleSaveUser = async (userData: Partial<User>) => {
    try {
      if (selectedUser) {
        // Update existing user
        await api.users.update(selectedUser.id, userData)
        toast({
          title: "User updated",
          description: "User information has been updated successfully.",
        })
      } else {
        // Create new user
        await api.users.create(userData)
        toast({
          title: "User created",
          description: "New user has been created successfully.",
        })
      }
      // Refresh the users list
      refetch()
      setIsDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.users.delete(userId)
      toast({
        title: "User deleted",
        description: "User has been deleted successfully.",
      })
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
      </div>

      <Tabs defaultValue="all-users" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px] mb-6">
          <TabsTrigger value="all-users">Tüm Kullanıcılar</TabsTrigger>
          <TabsTrigger value="vip-users">VIP Üyeler</TabsTrigger>
        </TabsList>

        <TabsContent value="all-users">
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Kullanıcı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Error loading users: {error}
            </div>
          )}

          <UsersTable users={filteredUsers} isLoading={isLoading} onEdit={handleEditUser} onDelete={handleDeleteUser} />
        </TabsContent>

        <TabsContent value="vip-users">
          <Card>
            <CardHeader>
              <CardTitle>VIP Üye Yönetimi</CardTitle>
              <CardDescription>Uygulamanın premium kullanıcılarını yönetin</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">Tüm VIP Üyeler</TabsTrigger>
                  <TabsTrigger value="active">Aktif</TabsTrigger>
                  <TabsTrigger value="expired">Süresi Dolmuş</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <VipUsersTable />
                </TabsContent>
                <TabsContent value="active">
                  <VipUsersTable filter="active" />
                </TabsContent>
                <TabsContent value="expired">
                  <VipUsersTable filter="expired" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <UserEditDialog user={selectedUser} open={isDialogOpen} onOpenChange={setIsDialogOpen} onSave={handleSaveUser} />
    </div>
  )
}
