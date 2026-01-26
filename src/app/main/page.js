"use client"

import { useState } from "react"
import Dashboard from "../dashboard/page"
import Settings from "../settings/page"
import TeamDetails from "../teamdetails/page"
import LogoutButton from "@/components/logoutbutton"

export default function TeamPage() {
  const navItems = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Team Details", key: "team" },
    { name: "Settings", key: "settings" },
  ]

  const [active, setActive] = useState("dashboard")

  const renderContent = () => {
    switch (active) {
      case "dashboard":
        return <Dashboard />
      case "team":
        return <TeamDetails />
      case "settings":
        return <Settings />
      default:
        return <div>Select a tab</div>
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-[rgba(12,172,79,0.50)] flex flex-col justify-between px-4 py-6">
        <div className="flex flex-col gap-3">
          {navItems.map((item) => {
            const isActive = active === item.key
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`
                  w-full px-5 py-3 rounded-full text-left transition-all duration-200
                  ${isActive
                    ? "bg-black/80 text-white shadow-lg"
                    : "text-emerald-200 hover:bg-black/30 hover:text-white"}
                `}
              >
                {item.name}
              </button>
            )
          })}
        </div>
        <LogoutButton />
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 bg-black/5">
        {renderContent()}
      </div>
    </div>
  )
}
