"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-full border-2 border-gray-600 bg-gray-200 transform rotate-3 hover:rotate-6 transition-transform"
        style={{ borderStyle: "dashed" }}
      >
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full border-2 border-gray-600 bg-gray-200 dark:bg-gray-800 dark:border-gray-400 transform rotate-3 hover:rotate-6 transition-all duration-300 hover:scale-110"
      style={{ borderStyle: "dashed" }}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-gray-800 dark:text-gray-200 transition-all duration-300" />
      ) : (
        <Sun className="h-5 w-5 text-gray-800 dark:text-gray-200 transition-all duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
