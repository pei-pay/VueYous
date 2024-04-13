import { defineConfig } from 'vitepress';

const Guide = [
  { text: 'はじめに', link: '/guide/' },
  { text: 'VueUseとは', link: '/guide/what-is-vueuse' },
  { text: '環境構築', link: '/guide/setup' }
];

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'VueYous',
  description: 'Craft Your Own VueUse Composables From Scratch',

  head: [['link', { rel: 'icon', href: '/logo.png' }]],

  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    search: { provider: 'local' },
    logo: '/logo.png',
    // https://vitepress.dev/reference/default-theme-config

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', items: Guide }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: Guide
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/pei-pay/VueYous' }]
  }
});
