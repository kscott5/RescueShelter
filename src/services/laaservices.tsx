// NOTE: https://www.i18next.com/overview/configuration-options#configuration-options

import i18next, { i18n } from 'i18next';
import { initReactI18next as ReactI18NextInit } from 'react-i18next';

import SyncBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(SyncBackend)
  .use(LanguageDetector)
  .use(ReactI18NextInit)
  
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: true,
    initImmediate: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });


export function localizer() : i18n {
  return i18next;
}

export {localizer as LaaServices, localizer as default};