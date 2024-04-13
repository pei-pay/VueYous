import type { DefaultTheme, UserConfig } from 'vitepress'
import { defineConfig } from 'vitepress'
import { sharedConfig } from './shared'
import { ja } from './ja'
import { en } from './en'

export type i18nTheme = Partial<NonNullable<UserConfig<DefaultTheme.Config>['themeConfig']>>

export default defineConfig({
  ...sharedConfig,
  themeConfig: sharedConfig.themeConfig,
  locales: {
    root: { label: 'English', lang: 'en', themeConfig: { ...en } },
    ja: { label: '日本語', lang: 'ja', themeConfig: { ...ja } },
    // other languages...
  },
})
