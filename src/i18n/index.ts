import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'

/**
 * i18n setup. English is the source of truth and lives in `locales/en.json`.
 * To add a language, drop in `locales/<code>.json` and register it in
 * `resources` below (and add a switcher if you want runtime switching).
 */
export const resources = {
  en: { translation: en },
} as const

export const defaultLanguage = 'en'

void i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  interpolation: {
    // React already escapes values, so i18next doesn't need to.
    escapeValue: false,
  },
  returnNull: false,
})

export default i18n
