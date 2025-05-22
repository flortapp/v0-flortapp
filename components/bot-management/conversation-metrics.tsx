"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Bot 1",
    "Başlatılan Konuşmalar": 245,
    "Cevaplanan Konuşmalar": 178,
    "Yükseltilen Konuşmalar": 65,
  },
  {
    name: "Bot 2",
    "Başlatılan Konuşmalar": 312,
    "Cevaplanan Konuşmalar": 256,
    "Yükseltilen Konuşmalar": 87,
  },
  {
    name: "Bot 3",
    "Başlatılan Konuşmalar": 198,
    "Cevaplanan Konuşmalar": 143,
    "Yükseltilen Konuşmalar": 52,
  },
  {
    name: "Bot 4",
    "Başlatılan Konuşmalar": 276,
    "Cevaplanan Konuşmalar": 201,
    "Yükseltilen Konuşmalar": 73,
  },
  {
    name: "Bot 5",
    "Başlatılan Konuşmalar": 189,
    "Cevaplanan Konuşmalar": 132,
    "Yükseltilen Konuşmalar": 48,
  },
  {
    name: "Bot 6",
    "Başlatılan Konuşmalar": 287,
    "Cevaplanan Konuşmalar": 219,
    "Yükseltilen Konuşmalar": 79,
  },
]

export function ConversationMetrics() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
        <XAxis dataKey="name" stroke={isDark ? "#888" : "#333"} />
        <YAxis stroke={isDark ? "#888" : "#333"} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#333" : "#fff",
            borderColor: isDark ? "#444" : "#ddd",
            color: isDark ? "#fff" : "#333",
          }}
        />
        <Legend />
        <Bar dataKey="Başlatılan Konuşmalar" fill="#1FE4A2" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Cevaplanan Konuşmalar" fill="#FE6C12" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Yükseltilen Konuşmalar" fill="#FA2674" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
