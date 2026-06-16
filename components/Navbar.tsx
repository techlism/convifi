import { Link, useRouterState } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ListIcon, XIcon } from "@phosphor-icons/react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center xl:justify-start 2xl:justify-start lg:justify-start md:justify-start justify-between h-16 space-x-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <Link to="/">
                <img src="/convifi.svg" alt="Logo" height={35} width={35} className="dark:invert" />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link className="text-sm font-medium hover:underline" to="/about">About</Link>
                <Link className="text-sm font-medium hover:underline" to="/blog">Blog</Link>
                <a
                  className="text-sm font-medium hover:underline"
                  href="https://github.com/techlism/convifi/issues"
                  target="_blank"
                  rel="noreferrer"
                >
                  Report an issue
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="-mr-2 flex md:hidden">
              <Button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 transition"
                variant="outline"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? <ListIcon size={20} /> : <XIcon size={20} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/about" className="px-3 py-2 rounded-lg text-sm font-medium block hover:underline">About</Link>
            <Link to="/blog" className="px-3 py-2 rounded-lg text-sm font-medium block hover:underline">Blog</Link>
            <a
              href="https://github.com/techlism/convifi/issues"
              className="px-3 py-2 rounded-lg text-sm font-medium block hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Report an issue
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
