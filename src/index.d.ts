interface BlogPostFrontmatter {
  title: string
  date: string
  readingTime: number
  summary: string
  tags?: string[]
  math?: boolean
}

interface ProjectFrontmatter {
  title: string
  date: string
  website?: string
  github?: string
  weight: number
  icons: string[]
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

type Theme = 'dark' | 'light'
type ThemeChoice = Theme | 'system'

type NewThemeEvent = CustomEvent<{
  theme: Theme
  themeChoice: ThemeChoice
}>

declare module '@astro-community/astro-embed-youtube' {
  import type { AstroComponentFactory } from 'astro/dist/runtime/server'
  import { HTMLAttributes } from 'astro/types'

  export interface YouTubeProps extends HTMLAttributes<'div'> {
    id: string
    poster?: string
    params?: string
    playlabel?: string
  }

  export function YouTube(props: YouTubeProps): AstroComponentFactory
}
