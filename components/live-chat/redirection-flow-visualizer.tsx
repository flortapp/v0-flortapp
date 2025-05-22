"use client"

import { useEffect, useRef, useState } from "react"

interface RedirectionFlowVisualizerProps {
  sourceBot: {
    id: string
    name: string
  } | null
  targetBot: {
    id: string
    name: string
  } | null
  userId: string
  userName: string
  status: "pending" | "success" | "failed" | null
}

export function RedirectionFlowVisualizer({
  sourceBot,
  targetBot,
  userId,
  userName,
  status,
}: RedirectionFlowVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationFrame, setAnimationFrame] = useState(0)

  useEffect(() => {
    if (!canvasRef.current || !sourceBot || !targetBot || !status) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Define positions
    const userX = 50
    const userY = canvas.height / 2
    const sourceBotX = canvas.width / 2 - 50
    const sourceBotY = canvas.height / 2
    const targetBotX = canvas.width - 50
    const targetBotY = canvas.height / 2

    // Draw user
    ctx.fillStyle = "#f3f4f6"
    ctx.beginPath()
    ctx.arc(userX, userY, 20, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = "#6b7280"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw source bot
    ctx.fillStyle = "#e0f2fe"
    ctx.beginPath()
    ctx.arc(sourceBotX, sourceBotY, 20, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = "#0ea5e9"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw target bot
    ctx.fillStyle = status === "success" ? "#dcfce7" : status === "failed" ? "#fee2e2" : "#f3f4f6"
    ctx.beginPath()
    ctx.arc(targetBotX, targetBotY, 20, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = status === "success" ? "#22c55e" : status === "failed" ? "#ef4444" : "#6b7280"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw lines
    ctx.strokeStyle = "#6b7280"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(userX + 20, userY)
    ctx.lineTo(sourceBotX - 20, sourceBotY)
    ctx.stroke()

    // Draw arrow from source to target
    ctx.strokeStyle = status === "success" ? "#22c55e" : status === "failed" ? "#ef4444" : "#6b7280"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(sourceBotX + 20, sourceBotY)

    if (status === "pending") {
      // Animated dashed line for pending
      const dashLength = 5
      const gapLength = 5
      const totalLength = Math.sqrt(Math.pow(targetBotX - sourceBotX - 40, 2))
      const dashCount = Math.floor(totalLength / (dashLength + gapLength))

      for (let i = 0; i < dashCount; i++) {
        const startPercent = (i * (dashLength + gapLength)) / totalLength
        const endPercent = (i * (dashLength + gapLength) + dashLength) / totalLength

        const startX = sourceBotX + 20 + (targetBotX - sourceBotX - 40) * startPercent
        const endX = sourceBotX + 20 + (targetBotX - sourceBotX - 40) * endPercent

        ctx.moveTo(startX, sourceBotY)
        ctx.lineTo(endX, sourceBotY)
      }
    } else {
      // Solid line for success or failed
      ctx.lineTo(targetBotX - 20, targetBotY)
    }

    ctx.stroke()

    // Draw labels
    ctx.fillStyle = "#111827"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(userName, userX, userY + 40)
    ctx.fillText(sourceBot.name, sourceBotX, sourceBotY + 40)
    ctx.fillText(targetBot.name, targetBotX, targetBotY + 40)

    // Animate if pending
    if (status === "pending") {
      const animate = () => {
        setAnimationFrame(requestAnimationFrame(animate))
      }

      setAnimationFrame(requestAnimationFrame(animate))
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [sourceBot, targetBot, userId, userName, status, animationFrame])

  if (!sourceBot || !targetBot || !status) return null

  return (
    <div className="w-full h-32 mb-4">
      <canvas ref={canvasRef} className="w-full h-full" style={{ maxHeight: "150px" }} />
    </div>
  )
}
