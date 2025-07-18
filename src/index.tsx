
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./components/app";

// NOTE: https://www.i18next.com/overview/configuration-options#configuration-options

import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';

import SyncBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(SyncBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: true,
    initImmediate: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  }).then(() =>{

    const root = ReactDOM.createRoot(document.querySelector('#appContent'));
    root.render(<App/>);    
  });

