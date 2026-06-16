import { createFileRoute, Link } from '@tanstack/react-router'
import { blogPosts } from '@/lib/blog-posts'
import { CalendarBlank, Clock } from '@phosphor-icons/react'

export const Route = createFileRoute('/blog/')({
  component: BlogIndexPage,
  head: () => ({
    meta: [
      { title: 'File Conversion Guides & How-Tos | Convifi Blog' },
      {
        name: 'description',
        content:
          'Practical guides on converting video, audio, image, and document files — all browser-based, no upload required. Tips, tutorials, and how-tos from Convifi.',
      },
      { name: 'robots', content: 'index, follow' },
    ],
    links: [{ rel: 'canonical', href: 'https://convifi.com/blog' }],
  }),
})

function BlogIndexPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3">File Conversion Guides &amp; How-Tos</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Practical tutorials on converting, compressing, and transforming files — all in your
          browser. No upload, no account, no software to install.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((post) => (
          <Link
            key={post.slug}
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="group block border border-border rounded-xl p-5 hover:border-foreground/30 hover:shadow-md transition-all"
          >
            <h2 className="text-base font-semibold leading-snug mb-2 group-hover:underline">
              {post.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
              {post.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarBlank size={12} />
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {post.readingTime} min read
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
