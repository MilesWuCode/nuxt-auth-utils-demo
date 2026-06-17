import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'no-console': 'off', // 允許 console
    'vue/html-self-closing': 'off', // 允許非自閉合標籤
    'vue/no-v-html': 'off', // 允許 v-html
    'vue/multi-word-component-names': 'off', // 允許單字元件名稱
    'vue/padding-line-between-blocks': ['error', 'always'], // script template style 之間必須空行
    'vue/block-lang': [
      'error',
      {
        script: {
          lang: 'ts', // script 必須使用 TypeScript
        },
      },
    ],
    'vue/block-order': [
      'error',
      {
        order: ['script', 'template', 'style'], // 區塊順序：script > template > style
      },
    ],
    'vue/define-macros-order': [
      'warn',
      {
        order: ['defineOptions', 'defineProps', 'defineModel', 'defineEmits'], // macro 宣告順序
        defineExposeLast: true, // defineExpose 放最後
      },
    ],
  },
})
