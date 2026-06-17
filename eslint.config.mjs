import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'no-console': 'off',
    'vue/html-self-closing': 'off',
    'vue/no-v-html': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/padding-line-between-blocks': ['error', 'always'],
    'vue/block-lang': [
      'error',
      {
        script: {
          lang: 'ts',
        },
      },
    ],
    'vue/block-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/define-macros-order': [
      'warn',
      {
        order: ['defineOptions', 'defineProps', 'defineModel', 'defineEmits'],
        defineExposeLast: true,
      },
    ],
  },
})
