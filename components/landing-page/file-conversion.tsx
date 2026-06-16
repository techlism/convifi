import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Image, FileArrowDown } from "@phosphor-icons/react"
import type { Conversion } from "@/lib/conversion-formats"
import { Label } from "@/components/ui/label"

export function FileConversion({ conversions }: { conversions: Conversion[] }) {
  const [activeTab, setActiveTab] = useState<Conversion['type'] | 'all'>('all')
  const [fromFormat, setFromFormat] = useState("")
  const [toFormat, setToFormat] = useState("")

  const categories = Array.from(new Set(conversions.map(c => c.type)))

  const getFilteredFormats = () => {
    if (activeTab === 'all') return Array.from(new Set(conversions.map(c => c.from.toLowerCase())))
    return Array.from(new Set(
      conversions.filter(c => c.type === activeTab).map(c => c.from.toLowerCase())
    ))
  }

  const getToFormats = () => {
    if (!fromFormat) return []
    return conversions
      .filter(c =>
        c.from.toLowerCase() === fromFormat &&
        (activeTab === 'all' || c.type === activeTab)
      )
      .map(c => c.to.toLowerCase())
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="homepage_converter">
      <h2 className="text-3xl font-bold text-center mb-8">Try it now</h2>

      <Card className="bg-background overflow-hidden shadow-xl">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={v => { setActiveTab(v as Conversion['type'] | 'all'); setFromFormat(""); setToFormat("") }}>
            <TabsList className="w-full grid grid-cols-1 md:grid-cols-5 h-full my-4">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr] items-end">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">From</Label>
              <Select value={fromFormat} onValueChange={v => { setFromFormat(v); setToFormat("") }}>
                <SelectTrigger><SelectValue placeholder="Select format" /></SelectTrigger>
                <SelectContent>
                  {getFilteredFormats().map(format => (
                    <SelectItem key={format} value={format}>{format.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end justify-center pb-2">
              <div className="h-10 w-10 rounded-full border flex items-center justify-center">
                <ArrowRight size={20} className="text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">To</Label>
              <Select value={toFormat} onValueChange={setToFormat} disabled={!fromFormat}>
                <SelectTrigger><SelectValue placeholder="Select format" /></SelectTrigger>
                <SelectContent>
                  {getToFormats().map(format => (
                    <SelectItem key={format} value={format}>{format.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <Link to={fromFormat && toFormat ? "/convert/$format" : "/"} params={fromFormat && toFormat ? { format: `${fromFormat}-to-${toFormat}` } : undefined}>
              <Button
                className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                disabled={!fromFormat || !toFormat}
              >
                Convert Now
              </Button>
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link to="/compress-images">
              <Button className="w-full">
                <Image size={16} className="mr-2" />
                Compress Images
              </Button>
            </Link>
            <Link to="/remove-bg">
              <Button className="w-full">
                <FileArrowDown size={16} className="mr-2" />
                Remove Background
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
