import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { SITE_URL, SITE_OG_IMAGE } from '@/lib/site'
import { blogPosts, type BlogPost } from '@/lib/blog-posts'
import { CalendarBlank, Clock, ArrowLeft, ArrowRight } from '@phosphor-icons/react'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPage,
  head: ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug)
    if (!post) return { meta: [] }
    return {
      meta: [
        { title: `${post.title} | Convifi Blog` },
        { name: 'description', content: post.description },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: post.title },
        { property: 'og:description', content: post.description },
        { property: 'og:type', content: 'article' },
        { property: 'og:image', content: SITE_OG_IMAGE },
        { property: 'og:image:alt', content: `${post.title} — Convifi` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: SITE_OG_IMAGE },
      ],
      links: [{ rel: 'canonical', href: `${SITE_URL}/blog/${params.slug}` }],
    }
  },
  loader: ({ params }): BlogPost => {
    const post = blogPosts.find((p) => p.slug === params.slug)
    if (!post) throw notFound()
    return post
  },
})

function ArticleSchema({ post }: { post: BlogPost }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'Convifi' },
    publisher: {
      '@type': 'Organization',
      name: 'Convifi',
      url: SITE_URL,
    },
  }
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

function BlogPostPage() {
  const post = Route.useLoaderData() as BlogPost

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <ArticleSchema post={post} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link to="/blog" className="hover:underline">
          Blog
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-xs">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold leading-tight mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarBlank size={14} />
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {post.readingTime} min read
          </span>
        </div>
      </header>

      {/* Article body */}
      <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        {post.sections.map((section, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static ordered sections
          <section key={i}>
            {section.heading && (
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">
                {section.heading}
              </h2>
            )}
            <p className="leading-relaxed text-foreground/80">{section.body}</p>
            {section.list && (
              <ul className="mt-3 space-y-1.5 pl-5 list-disc text-foreground/80">
                {section.list.map((item) => (
                  <li key={item} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {section.code && (
              <pre className="mt-3 bg-muted rounded-lg px-4 py-3 text-sm font-mono overflow-x-auto">
                <code>{section.code}</code>
              </pre>
            )}
          </section>
        ))}
      </article>

      {/* CTA */}
      {post.relatedTools.length > 0 && (
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-sm font-medium text-foreground mb-4">Try it free on Convifi:</p>
          <div className="flex flex-wrap gap-3">
            {post.relatedTools.map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {tool.label}
                <ArrowRight size={14} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Back to blog */}
      <div className="mt-10">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          Back to all guides
        </Link>
      </div>
    </main>
  )
}
