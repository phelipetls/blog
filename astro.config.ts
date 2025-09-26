import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import robotsTxt from 'astro-robots-txt'
import { defineConfig } from 'astro/config'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkMath from 'remark-math'
import { rehypeSyntaxHighlight } from './plugins/rehype-syntax-highlight'
import { remarkReadingTime } from './plugins/remark-reading-time'
import { remarkSummary } from './plugins/remark-summary'
import { LOCALES } from './src/utils/i18n/locales'
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://phelipetls.github.io/',
  i18n: {
    locales: [...LOCALES],
    defaultLocale: 'en' as const,
  },
  integrations: [
    robotsTxt(),
    react(),
    mdx({
      syntaxHighlight: false,
      remarkPlugins: [remarkReadingTime, remarkSummary, remarkMath],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
          },
        ],
        rehypeSyntaxHighlight,
        rehypeKatex,
      ],
    }),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          pt: 'pt-BR',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
})
