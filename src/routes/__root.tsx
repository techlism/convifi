import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { ThemeProvider } from 'next-themes'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NotFound from '@/components/NotFound'
import { TooltipProvider } from '@/components/ui/tooltip'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  notFoundComponent: () => <NotFound />,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Convifi — Free File Converter, No Upload Required' },
      {
        name: 'description',
        content: 'Convert video, audio, image, and document files instantly in your browser. No upload, no account, 100% private. MKV to MP4, MP4 to MP3, PNG to PDF, and 140+ more formats.',
      },
      {
        name: 'keywords',
        content: 'file converter, video converter, audio converter, image converter, no upload, free converter, mkv to mp4, mp4 to mp3, png to pdf, browser based',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <TooltipProvider delayDuration={100}>
            <Navbar />
            <Outlet />
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
