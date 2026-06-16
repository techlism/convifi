import { useEffect, useState } from "react"
import { Moon, Sun } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export default function DarkModeSwitch() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const changeTheme = () => {
    setTimeout(() => {
      if (theme === 'light') setTheme('dark')
      else if (theme === 'dark') setTheme('light')
      else setTheme('dark')
    }, 150)
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="bg-transparent border-0 mr-1" disabled>
        <span className="size-5" />
      </Button>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={changeTheme}
          className="transition-colors duration-200 bg-transparent border-0 mr-1"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          <span className="sr-only">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Switch to {theme === 'dark' ? 'Light' : 'Dark'} mode</p>
      </TooltipContent>
    </Tooltip>
  )
}
