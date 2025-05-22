"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Oca",
    "Aktif Kullanıcılar": 4000,
    "Yeni Kullanıcılar": 2400,
    "Premium Kullanıcılar": 2400,
  },
  {
    name: "Şub",
    "Aktif Kullanıcılar": 3000,
    "Yeni Kullanıcılar": 1398,
    "Premium Kullanıcılar": 2210,
  },
  {
    name: "Mar",
    "Aktif Kullanıcılar": 2000,
    "Yeni Kullanıcılar": 9800,
    "Premium Kullanıcılar": 2290,
  },
  {
    name: "Nis",
    "Aktif Kullanıcılar": 2780,
    "Yeni Kullanıcılar": 3908,
    "Premium Kullanıcılar": 2000,
  },
  {
    name: "May",
    "Aktif Kullanıcılar": 1890,
    "Yeni Kullanıcılar": 4800,
    "Premium Kullanıcılar": 2181,
  },
  {
    name: "Haz",
    "Aktif Kullanıcılar": 2390,
    "Yeni Kullanıcılar": 3800,
    "Premium Kullanıcılar": 2500,
  },
  {
    name: "Tem",
    "Aktif Kullanıcılar": 3490,
    "Yeni Kullanıcılar": 4300,
    "Premium Kullanıcılar": 2100,
  },
  {
    name: "Ağu",
    "Aktif Kullanıcılar": 4000,
    "Yeni Kullanıcılar": 2400,
    "Premium Kullanıcılar": 2400,
  },
  {
    name: "Eyl",
    "Aktif Kullanıcılar": 3000,
    "Yeni Kullanıcılar": 1398,
    "Premium Kullanıcılar": 2210,
  },
  {
    name: "Eki",
    "Aktif Kullanıcılar": 2000,
    "Yeni Kullanıcılar": 9800,
    "Premium Kullanıcılar": 2290,
  },
  {
    name: "Kas",
    "Aktif Kullanıcılar": 2780,
    "Yeni Kullanıcılar": 3908,
    "Premium Kullanıcılar": 2000,
  },
  {
    name: "Ara",
    "Aktif Kullanıcılar": 1890,
    "Yeni Kullanıcılar": 4800,
    "Premium Kullanıcılar": 2181,
  },
]

export function AnalyticsChart() {
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
        <Bar dataKey="Aktif Kullanıcılar" fill="#1FE4A2" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Yeni Kullanıcılar" fill="#FE6C12" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Premium Kullanıcılar" fill="#FA2674" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
