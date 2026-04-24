import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'no-console': 'off',
    'vue/html-self-closing': 'off',
    'vue/no-v-html': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/define-macros-order': [
      'warn',
      {
        order: ['defineProps', 'defineModel', 'defineEmits'],
        defineExposeLast: true,
      },
    ],
  },
})
