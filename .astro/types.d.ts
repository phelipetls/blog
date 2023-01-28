declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		(typeof entryMap)[C][keyof (typeof entryMap)[C]] & Render;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	type BaseCollectionConfig<S extends BaseSchema> = {
		schema?: S;
		slug?: (entry: {
			id: CollectionEntry<keyof typeof entryMap>['id'];
			defaultSlug: string;
			collection: string;
			body: string;
			data: import('astro/zod').infer<S>;
		}) => string | Promise<string>;
	};
	export function defineCollection<S extends BaseSchema>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	type EntryMapKeys = keyof typeof entryMap;
	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidEntrySlug<C extends EntryMapKeys> = AllValuesOf<(typeof entryMap)[C]>['slug'];

	export function getEntryBySlug<
		C extends keyof typeof entryMap,
		E extends ValidEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getCollection<C extends keyof typeof entryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof typeof entryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		Required<ContentConfig['collections'][C]>['schema']
	>;

	type Render = {
		render(): Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	};

	const entryMap: {
		"posts": {
"adb-a-must-know-cli-tool-for-android-development/index.mdx": {
  id: "adb-a-must-know-cli-tool-for-android-development/index.mdx",
  slug: "adb-a-must-know-cli-tool-for-android-development",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"async-make-in-nvim-with-lua/index.mdx": {
  id: "async-make-in-nvim-with-lua/index.mdx",
  slug: "async-make-in-nvim-with-lua",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"automating-svg-to-jsx-conversion-with-svgr/index.mdx": {
  id: "automating-svg-to-jsx-conversion-with-svgr/index.mdx",
  slug: "automating-svg-to-jsx-conversion-with-svgr",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"bash-for-javascript-developers/index.mdx": {
  id: "bash-for-javascript-developers/index.mdx",
  slug: "bash-for-javascript-developers",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"code-formatting-vim/index.mdx": {
  id: "code-formatting-vim/index.mdx",
  slug: "code-formatting-vim",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"configuring-eslint-to-work-with-neovim-lsp/index.mdx": {
  id: "configuring-eslint-to-work-with-neovim-lsp/index.mdx",
  slug: "configuring-eslint-to-work-with-neovim-lsp",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"demystifying-git-rebase/index.mdx": {
  id: "demystifying-git-rebase/index.mdx",
  slug: "demystifying-git-rebase",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"demystifying-git-rebase/index.pt.mdx": {
  id: "demystifying-git-rebase/index.pt.mdx",
  slug: "demystifying-git-rebase/indexpt",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"deploying-flask-app-on-heroku/index.mdx": {
  id: "deploying-flask-app-on-heroku/index.mdx",
  slug: "deploying-flask-app-on-heroku",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"discovering-tailscale/index.mdx": {
  id: "discovering-tailscale/index.mdx",
  slug: "discovering-tailscale",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"extending-vim-with-ripgrep/index.mdx": {
  id: "extending-vim-with-ripgrep/index.mdx",
  slug: "extending-vim-with-ripgrep",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"f-strings-syntax-highlighting-in-vim/index.mdx": {
  id: "f-strings-syntax-highlighting-in-vim/index.mdx",
  slug: "f-strings-syntax-highlighting-in-vim",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"favorite-custom-git-commands/index.mdx": {
  id: "favorite-custom-git-commands/index.mdx",
  slug: "favorite-custom-git-commands",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"game-of-thrones-text-mining/index.pt.mdx": {
  id: "game-of-thrones-text-mining/index.pt.mdx",
  slug: "game-of-thrones-text-mining/indexpt",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"getting-salesforce-reports-with-vba/index.mdx": {
  id: "getting-salesforce-reports-with-vba/index.mdx",
  slug: "getting-salesforce-reports-with-vba",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"git-worktrees-are-great-for-code-reviews/index.mdx": {
  id: "git-worktrees-are-great-for-code-reviews/index.mdx",
  slug: "git-worktrees-are-great-for-code-reviews",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"gram-schmidt/index.pt.mdx": {
  id: "gram-schmidt/index.pt.mdx",
  slug: "gram-schmidt/indexpt",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"how-not-to-write-forms-in-react/index.mdx": {
  id: "how-not-to-write-forms-in-react/index.mdx",
  slug: "how-not-to-write-forms-in-react",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"implementing-dark-mode-for-static-websites/index.mdx": {
  id: "implementing-dark-mode-for-static-websites/index.mdx",
  slug: "implementing-dark-mode-for-static-websites",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"improving-the-android-studio-experience-in-dwm/index.mdx": {
  id: "improving-the-android-studio-experience-in-dwm/index.mdx",
  slug: "improving-the-android-studio-experience-in-dwm",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"introduction-to-ansible/index.mdx": {
  id: "introduction-to-ansible/index.mdx",
  slug: "introduction-to-ansible",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"making-vim-understand-typescript-path-mapping/index.mdx": {
  id: "making-vim-understand-typescript-path-mapping/index.mdx",
  slug: "making-vim-understand-typescript-path-mapping",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"mdx-syntax-highlight-treesitter-nvim/index.mdx": {
  id: "mdx-syntax-highlight-treesitter-nvim/index.mdx",
  slug: "mdx-syntax-highlight-treesitter-nvim",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"metodo-de-newton/index.pt.mdx": {
  id: "metodo-de-newton/index.pt.mdx",
  slug: "metodo-de-newton/indexpt",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"migrating-from-cra-to-vite/index.mdx": {
  id: "migrating-from-cra-to-vite/index.mdx",
  slug: "migrating-from-cra-to-vite",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"moving-away-from-tiling-window-managers/index.mdx": {
  id: "moving-away-from-tiling-window-managers/index.mdx",
  slug: "moving-away-from-tiling-window-managers",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"my-experience-testing-react-applications/index.mdx": {
  id: "my-experience-testing-react-applications/index.mdx",
  slug: "my-experience-testing-react-applications",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"nodejs-one-liner-to-read-json-files/index.mdx": {
  id: "nodejs-one-liner-to-read-json-files/index.mdx",
  slug: "nodejs-one-liner-to-read-json-files",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"puzzle-do-cavalo-no-tabuleiro-infinito-com-numpy/index.pt.mdx": {
  id: "puzzle-do-cavalo-no-tabuleiro-infinito-com-numpy/index.pt.mdx",
  slug: "puzzle-do-cavalo-no-tabuleiro-infinito-com-numpy/indexpt",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"spread-bancario-brasileiro-r/index.pt.mdx": {
  id: "spread-bancario-brasileiro-r/index.pt.mdx",
  slug: "spread-bancario-brasileiro-r/indexpt",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"surprising-react-bug/index.mdx": {
  id: "surprising-react-bug/index.mdx",
  slug: "surprising-react-bug",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"template-string-converter-with-neovim-treesitter/index.mdx": {
  id: "template-string-converter-with-neovim-treesitter/index.mdx",
  slug: "template-string-converter-with-neovim-treesitter",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"tres-algoritmos-para-a-sequencia-de-fibonacci/index.pt.mdx": {
  id: "tres-algoritmos-para-a-sequencia-de-fibonacci/index.pt.mdx",
  slug: "tres-algoritmos-para-a-sequencia-de-fibonacci/indexpt",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"using-storybook-and-msw-in-react-native/index.mdx": {
  id: "using-storybook-and-msw-in-react-native/index.mdx",
  slug: "using-storybook-and-msw-in-react-native",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"vim-errorformat-for-pytest/index.mdx": {
  id: "vim-errorformat-for-pytest/index.mdx",
  slug: "vim-errorformat-for-pytest",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"visualizacao-dados-homicidios-baltimore/index.pt.mdx": {
  id: "visualizacao-dados-homicidios-baltimore/index.pt.mdx",
  slug: "visualizacao-dados-homicidios-baltimore/indexpt",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
"web-scraping-de-paginas-dinamicas/index.pt.mdx": {
  id: "web-scraping-de-paginas-dinamicas/index.pt.mdx",
  slug: "web-scraping-de-paginas-dinamicas/indexpt",
  body: string,
  collection: "posts",
  data: InferEntrySchema<"posts">
},
},
"projects": {
"blog/index.md": {
  id: "blog/index.md",
  slug: "blog",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
"blog/index.pt.md": {
  id: "blog/index.pt.md",
  slug: "blog/indexpt",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
"dotfiles/index.md": {
  id: "dotfiles/index.md",
  slug: "dotfiles",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
"dotfiles/index.pt.md": {
  id: "dotfiles/index.pt.md",
  slug: "dotfiles/indexpt",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
"ipeadata-explorer/index.md": {
  id: "ipeadata-explorer/index.md",
  slug: "ipeadata-explorer",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
"ipeadata-explorer/index.pt.md": {
  id: "ipeadata-explorer/index.pt.md",
  slug: "ipeadata-explorer/indexpt",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
"reportforce/index.md": {
  id: "reportforce/index.md",
  slug: "reportforce",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
"reportforce/index.pt.md": {
  id: "reportforce/index.pt.md",
  slug: "reportforce/indexpt",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
"seriesbr/index.md": {
  id: "seriesbr/index.md",
  slug: "seriesbr",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
"seriesbr/index.pt.md": {
  id: "seriesbr/index.pt.md",
  slug: "seriesbr/indexpt",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
},

	};

	type ContentConfig = typeof import("../src/content/config");
}
