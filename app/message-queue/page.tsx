import { MessageQueueMonitor } from "@/components/live-chat/message-queue-monitor"

export default function MessageQueuePage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Message Queue Management</h1>
      <MessageQueueMonitor />
    </div>
  )
}
