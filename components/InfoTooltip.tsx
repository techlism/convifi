import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "@phosphor-icons/react"

export default function InfoTooltip({ information }: { information: string }) {
  const [open, setOpen] = useState(false)

  function handleOpenClose() {
    if (open) {
      setOpen(false)
    } else {
      setOpen(true)
      setTimeout(() => setOpen(false), 2500)
    }
  }

  return (
    <>
      {/* Desktop: hover tooltip via global TooltipProvider */}
      <Tooltip>
        <TooltipTrigger asChild className="hidden lg:inline-flex">
          <Info className="opacity-15 dark:opacity-50 hover:opacity-80 ml-2 cursor-pointer" size={18} />
        </TooltipTrigger>
        <TooltipContent className="max-w-[40vw] p-2">
          <p>{information}</p>
        </TooltipContent>
      </Tooltip>

      {/* Mobile: tap to show */}
      {open && (
        <p className="absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          {information}
        </p>
      )}
      <Button
        onClick={handleOpenClose}
        className="lg:hidden bg-transparent m-2"
        variant="ghost"
        size="icon"
      >
        <Info className="opacity-15 dark:opacity-50 hover:opacity-80" size={18} />
      </Button>
    </>
  )
}
