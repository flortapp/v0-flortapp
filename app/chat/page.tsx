import { ChatList } from "@/components/chat/ChatList"
import { ChatWindow } from "@/components/chat/ChatWindow"
import { ChatSidebar } from "@/components/chat/ChatSidebar"

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-64px)]">
      <aside className="w-1/4 border-r bg-muted">
        <ChatList />
      </aside>
      <main className="flex-1 flex flex-col">
        <ChatWindow />
      </main>
      <aside className="w-1/4 border-l bg-muted hidden lg:block">
        <ChatSidebar />
      </aside>
    </div>
  )
} 