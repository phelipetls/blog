import rss from '@astrojs/rss'
import { useTranslate } from '@utils/i18n/useTranslate'
import { getBlogPostsAsRssItems } from '@utils/posts/getBlogPostsAsRssItems'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const t = useTranslate('pt')

  return rss({
    title: t.SiteTitle,
    description: t.SiteDescription,
    site: import.meta.env.SITE,
    items: await getBlogPostsAsRssItems('pt'),
    customData: `<language>pt-br</language>`,
  })
}
