import { ArrowDown } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

export default function UnsupportedFormat() {
  function scrollToFooter() {
    const footer = document.getElementById('footer');
    footer?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-4 space-y-5">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Unsupported Format</h1>
        <p className="text-lg mt-2">
          The format you are trying to convert to is not yet supported or it is an invalid file format.
        </p>
      </div>
      <Button onClick={scrollToFooter} className="mt-5 rounded-lg flex p-5 font-medium" variant="outline">
        <ArrowDown className="mr-2 font-bold" />
        <span>Check out all the supported formats</span>
      </Button>
    </main>
  )
}
