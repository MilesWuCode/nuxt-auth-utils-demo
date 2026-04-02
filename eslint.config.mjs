// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'no-console': 'off',
    'vue/html-self-closing': 'off',
    'vue/no-v-html': 'off',
  },
})
