/** @type {import("prettier").Config} */
export default {
  proseWrap: "always",
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-astro"],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}
