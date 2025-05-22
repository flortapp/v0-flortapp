"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { messageQueueService, type QueuedMessage } from "@/services/message-queue-service"
import { RefreshCcw, CheckCircle2, AlertTriangle, Clock, XCircle } from "lucide-react"

export function MessageQueueMonitor() {
  const [queue, setQueue] = useState<QueuedMessage[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    avgProcessingTime: 0,
  })
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)

  // Subscribe to queue updates
  useEffect(() => {
    const removeListener = messageQueueService.addListener((updatedQueue) => {
      setQueue(updatedQueue)
      setStats(messageQueueService.getStats())
    })

    // Initial load
    setQueue(messageQueueService.getQueue())
    setStats(messageQueueService.getStats())

    return () => {
      removeListener()
    }
  }, [])

  // Auto refresh stats
  useEffect(() => {
    if (!isAutoRefresh) return

    const interval = setInterval(() => {
      setStats(messageQueueService.getStats())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [isAutoRefresh])

  // Get status badge
  const getStatusBadge = (status: QueuedMessage["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <RefreshCcw className="h-3 w-3 animate-spin" />
            <span>Processing</span>
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Completed</span>
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Failed</span>
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Message Queue Monitor</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className="flex items-center gap-1"
          >
            <RefreshCcw className={`h-4 w-4 ${isAutoRefresh ? "animate-spin" : ""}`} />
            {isAutoRefresh ? "Auto-refreshing" : "Auto-refresh"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => messageQueueService.clearQueue()}
            disabled={queue.length === 0}
          >
            Clear Queue
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Queue stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total Messages</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.processing}</div>
                <p className="text-xs text-muted-foreground">Processing</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.failed}</div>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Processing progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Queue Processing</span>
                <span className="text-sm text-muted-foreground">
                  {stats.completed + stats.failed}/{stats.total} processed
                </span>
              </div>
              <Progress
                value={stats.total > 0 ? ((stats.completed + stats.failed) / stats.total) * 100 : 0}
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Avg. Processing Time: {Math.round(stats.avgProcessingTime)}ms</span>
                <span>Success Rate: {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Queue items */}
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attempts
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {queue.length > 0 ? (
                queue.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.conversationId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.message.content}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.attempts}/{item.maxAttempts}
                      {item.error && (
                        <div className="flex items-center mt-1">
                          <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                          <span className="text-xs text-red-500">{item.error}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Queue is empty
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
