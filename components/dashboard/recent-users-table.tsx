import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface RecentUsersTableProps {
  filter?: string
}

export function RecentUsersTable({ filter }: RecentUsersTableProps) {
  // Örnek kullanıcı verileri
  const users = [
    {
      id: "1",
      name: "Mehmet Yılmaz",
      email: "mehmet.yilmaz@example.com",
      username: "mehmetyilmaz",
      status: "active",
      joinDate: "6 Mar 2023",
      lastActive: "Bugün",
      type: "premium",
    },
    {
      id: "2",
      name: "Ayşe Demir",
      email: "ayse.demir@example.com",
      username: "aysedemir",
      status: "active",
      joinDate: "12 Şub 2023",
      lastActive: "Dün",
      type: "standard",
    },
    {
      id: "3",
      name: "Ali Kaya",
      email: "ali.kaya@example.com",
      username: "alikaya",
      status: "inactive",
      joinDate: "3 Oca 2023",
      lastActive: "2 hafta önce",
      type: "premium",
    },
    {
      id: "4",
      name: "Zeynep Şahin",
      email: "zeynep.sahin@example.com",
      username: "zeynepsahin",
      status: "active",
      joinDate: "15 Ara 2022",
      lastActive: "3 gün önce",
      type: "standard",
    },
    {
      id: "5",
      name: "Mustafa Öztürk",
      email: "mustafa.ozturk@example.com",
      username: "mustafaozturk",
      status: "inactive",
      joinDate: "20 Kas 2022",
      lastActive: "1 ay önce",
      type: "premium",
    },
  ]

  // Filtreleme işlemi
  const filteredUsers = filter
    ? users.filter((user) => {
        if (filter === "active") return user.status === "active"
        if (filter === "inactive") return user.status === "inactive"
        if (filter === "premium") return user.type === "premium"
        return true
      })
    : users

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kullanıcı</TableHead>
          <TableHead>Durum</TableHead>
          <TableHead>Katılma Tarihi</TableHead>
          <TableHead>Son Aktivite</TableHead>
          <TableHead>Tip</TableHead>
          <TableHead className="text-right">İşlemler</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={`/abstract-geometric-shapes.png?height=32&width=32&query=${user.name}`}
                    alt={user.name}
                  />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">@{user.username}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={user.status === "active" ? "success" : "secondary"}>
                {user.status === "active" ? "Aktif" : "Pasif"}
              </Badge>
            </TableCell>
            <TableCell>{user.joinDate}</TableCell>
            <TableCell>{user.lastActive}</TableCell>
            <TableCell>
              <Badge variant={user.type === "premium" ? "default" : "outline"}>
                {user.type === "premium" ? "Premium" : "Standart"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Menüyü Aç</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profili Görüntüle</DropdownMenuItem>
                  <DropdownMenuItem>Düzenle</DropdownMenuItem>
                  <DropdownMenuItem>Jeton Ekle</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Sil</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
