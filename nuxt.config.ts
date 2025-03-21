import primevueConfig from "./primevue.config";

export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@pinia/nuxt", "@primevue/nuxt-module", "@nuxtjs/i18n", "@vueuse/nuxt"],

  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon-96x96.png",
          sizes: "96x96",
        },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "shortcut icon", href: "/favicon.ico" },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "manifest",
          href: "/site.webmanifest",
        },
      ],
      meta: [{ name: "apple-mobile-web-app-title", content: "ЭФИР" }],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },

  i18n: {
    locales: [{ code: "ru", iso: "ru-RU", file: "ru.json" }],
    defaultLocale: "ru",
    lazy: true,
    langDir: ".",
  },

  postcss: { plugins: { "@tailwindcss/postcss": {} } },

  primevue: primevueConfig,

  css: ["~/assets/css/main.css"],

  compatibilityDate: "2025-03-03",
});