export const en = {
  About: 'About',
  Posts: 'Posts',
  AllTags: 'All tags',
  And: 'and',
  ChooseATheme: 'Choose a theme',
  ChooseALanguage: 'Choose a language',
  Contact: 'Contact',
  Contacts: 'Contacts',
  Copied: 'Copied',
  FailedToCopy: 'Failed to copy',
  CopyCodeButtonLabel: 'Copy code',
  Dark: 'Dark',
  GravatarAltText: 'A photo of me',
  LanguageButton: 'Click to read in another language',
  LanguageOptions: 'Translations',
  Light: 'Light',
  MainNavigation: 'Main navigation',
  OpenSidenav: 'Open navigation sidebar',
  PostsListDescription: 'List of all blog posts',
  PostsNavigation: 'Posts navigation',
  RefreshApp: 'Refresh app',
  ShowLess: 'Show less',
  ShowMore: 'Show more',
  SiteDescription:
    'Front-end web developer that writes about the programming craft and its tools',
  SiteTitle: 'Posts about programming - Phelipe Teles',
  Subscribe: 'Subscribe',
  System: 'System',
  TableOfContents: 'Table of Contents',
  Tabs: 'Tabs',
  TagDescription: (opts: { count: number; tag: string }) =>
    `${opts.count} ${opts.count === 1 ? 'post' : 'posts'} tagged with ${
      opts.tag
    }`,
  TagsDescription: 'List of all blog posts tags',
  ThemeButton: 'Change theme',
  ThemeIcon: 'Theme icon',
  '404Title': 'Page not found',
  GoBack: 'Go back to previous page',
  ByTags: 'By tags',
  NextYear: 'Next year',
  PreviousYear: 'Previous year',
  BlogPostsTaggedWith: (tag: string) => `Blog posts tagged with '${tag}'`,
  OpenToc: 'Open table of contents',
  CloseToc: 'Close table of contents',
  NoName: '[No name]',
  LinkToSourceLabel: 'Source code',
}
