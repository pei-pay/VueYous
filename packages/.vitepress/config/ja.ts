import type { i18nTheme } from '.'

const nav: i18nTheme['nav'] = [
  { text: 'Home', link: '/ja/' },
  { text: 'Guide', link: '/ja/guide/' },
  { text: 'Starter', link: '/ja/starter/' },
]

const sidebar: i18nTheme['sidebar'] = [
  { text: 'Guide', items: [
    { text: 'はじめに', link: '/ja/guide/' },
    { text: 'VueUseとは', link: '/ja/guide/what-is-vueuse' },
    { text: '環境構築', link: '/ja/guide/setup' },
  ] },
  { text: 'Starter', items: [
    { text: 'What is Starter', link: '/ja/starter/' },
    { text: 'useRefHistory', link: '/ja/starter/useRefHistory' },
  ] },

]

export const ja: i18nTheme = { nav, sidebar }
