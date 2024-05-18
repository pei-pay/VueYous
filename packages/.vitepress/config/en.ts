import type { i18nTheme } from '.'

const nav: i18nTheme['nav'] = [
  { text: 'Home', link: '/' },
  { text: 'Guide', link: '/guide/' },
  { text: 'Starter', link: '/starter/' },
]

const sidebar: i18nTheme['sidebar'] = [
  { text: 'Guide', items: [
    { text: 'Getting Started', link: '/guide/' },
    { text: 'What is VueUse?', link: '/guide/what-is-vueuse' },
    { text: 'Setup', link: '/guide/setup' },
  ] },
  { text: 'Starter', items: [
    { text: 'What is Starter', link: '/starter/' },
    { text: 'useRefHistory', link: '/starter/useRefHistory' },
  ] },
]

export const en: i18nTheme = { nav, sidebar }
