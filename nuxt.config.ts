import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['nuxt-auth-utils', '@nuxt/ui', '@nuxt/scripts', '@nuxt/eslint'],

  runtimeConfig: {
    // nuxt-auth-utils
    session: {
      password: process.env.NUXT_SESSION_PASSWORD as string,
      maxAge: 7 * 86400, // 7天
    },
    // nuxt-auth-utils
    oauth: {
      apple: {
        teamId: process.env.NUXT_OAUTH_APPLE_TEAM_ID,
        keyId: process.env.NUXT_OAUTH_APPLE_KEY_ID,
        privateKey: process.env.NUXT_OAUTH_APPLE_PRIVATE_KEY,
        clientId: process.env.NUXT_OAUTH_APPLE_CLIENT_ID,
        redirectURL: process.env.NUXT_OAUTH_APPLE_REDIRECT_URL,
      },
      facebook: {
        clientId: process.env.NUXT_OAUTH_FACEBOOK_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_FACEBOOK_CLIENT_SECRET,
        redirectURL: process.env.NUXT_OAUTH_FACEBOOK_REDIRECT_URL,
      },
      google: {
        clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET,
        redirectURL: process.env.NUXT_OAUTH_GOOGLE_REDIRECT_URL,
      },
    },
  },

  css: ['~/assets/css/main.css'],

  nitro: {
    experimental: {
      // /_scalar, /_swagger and /_openapi.json
      openAPI: true,
    },
  },

  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit'],
    },
    plugins: [tailwindcss()],
  },
})
