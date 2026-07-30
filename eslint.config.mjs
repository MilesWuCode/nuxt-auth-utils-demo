import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'no-console': 'off', // 允許 console
    'comma-dangle': ['error', 'always-multiline'],
    'vue/html-self-closing': 'off', // 允許非自閉合標籤
    'vue/no-v-html': 'off', // 允許 v-html
    'vue/multi-word-component-names': 'off', // 允許單字元件名稱
    'vue/padding-line-between-blocks': ['error', 'always'], // script template style 之間必須空行
    'vue/block-lang': [
      // script 區塊必須使用 TypeScript
      'error',
      {
        script: {
          lang: 'ts',
        },
      },
    ],
    'vue/block-order': [
      // 區塊順序：script > template > style
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/define-macros-order': [
      // macro 宣告順序，defineExpose 放最後
      'warn',
      {
        order: ['defineOptions', 'defineProps', 'defineModel', 'defineEmits'],
        defineExposeLast: true,
      },
    ],
    'vue/component-name-in-template-casing': [
      // template 中元件名稱必須使用 PascalCase
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
      },
    ],
    // 'vue/first-attribute-linebreak': [
    //   // 第一個屬性要換行
    //   'error',
    //   {
    //     singleline: 'ignore',
    //     multiline: 'below',
    //   },
    // ],
  },
})
