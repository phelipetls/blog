import rss from '@astrojs/rss'
import { Language, translate } from '@utils/i18n'
import type { APIContext, MDXInstance } from 'astro'

export function getStaticPaths() {
  return [
    // Using a filename like src/pages/[lang]/index.xml does not work -- the
    // endpoint would be available in en.xml and pt.xml. This is some hacky way
    // to build the XML in /{en,pt}/index.ml
    { params: { lang: undefined }, props: { language: 'en' } },
    { params: { lang: 'pt' }, props: { language: 'pt' } },
  ]
}

export const get = ({ props }: APIContext<{ language: Language }>) => {
  const t = translate(props.language)

  let postsImportResult
  if (props.language === 'en') {
    postsImportResult = import.meta.glob<MDXInstance<BlogPostFrontmatter>>(
      '../../../../content/posts/**/*.mdx',
      {
        eager: true,
      }
    )
  } else {
    postsImportResult = import.meta.glob<MDXInstance<BlogPostFrontmatter>>(
      '../../../../content/posts/**/*.pt.mdx',
      {
        eager: true,
      }
    )
  }

  const posts = Object.values(postsImportResult)

  return rss({
    title: t('SiteTitle'),
    description: t('SiteDescription'),
    site: import.meta.env.SITE,
    items: posts.map((post) => {
      return {
        link: post.url || '',
        title: post.frontmatter.title,
        pubDate: new Date(post.frontmatter.date),
        description: post.frontmatter.summary,
      }
    }),
    customData: `<language>${
      props.language === 'en' ? 'en-us' : 'pt-br'
    }</language>`,
  })
}
