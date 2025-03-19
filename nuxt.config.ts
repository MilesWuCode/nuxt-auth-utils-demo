// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["nuxt-auth-utils", "@nuxt/scripts", "@nuxt/eslint"],

  runtimeConfig: {
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || "",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    },
    oauth: {
      google: {
        clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET,
        redirectURL: process.env.NUXT_OAUTH_GOOGLE_REDIRECT_URL,
      },
      apple: {
        clientId: process.env.NUXT_OAUTH_APPLE_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_APPLE_CLIENT_SECRET,
        redirectURL: process.env.NUXT_OAUTH_APPLE_REDIRECT_URL,
      },
    },
    public: {
      appleClientId: process.env.NUXT_PUBLIC_APPLE_CLIENT_ID,
      appleRedirectUrl: process.env.NUXT_PUBLIC_APPLE_REDIRECT_URL,
    },
  },

  nitro: {
    experimental: {
      // /_scalar, /_swagger and /_openapi.json
      openAPI: true,
    },
  },
});
