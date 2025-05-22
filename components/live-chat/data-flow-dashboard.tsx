"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageFlowAnalyzer } from "./message-flow-analyzer"
import { DataFlowInspector } from "./data-flow-inspector"
import { ConversationFlowVisualizer } from "./conversation-flow-visualizer"

export function DataFlowDashboard() {
  const [activeTab, setActiveTab] = useState("message-flow")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Data Flow Analysis Dashboard</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="message-flow">Message Flow</TabsTrigger>
          <TabsTrigger value="data-flow">Data Flow</TabsTrigger>
          <TabsTrigger value="conversation-flow">Conversation Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="message-flow">
          <MessageFlowAnalyzer />
        </TabsContent>

        <TabsContent value="data-flow">
          <DataFlowInspector />
        </TabsContent>

        <TabsContent value="conversation-flow">
          <ConversationFlowVisualizer />
        </TabsContent>
      </Tabs>
    </div>
  )
}
