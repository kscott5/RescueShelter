
import * as React from 'react';
import * as Client from 'react-dom/client';

import App from "./components/app";

import * as serviceWorker from './serviceWorker';

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

    const root = Client.createRoot(document.querySelector('#appContent'));
    root.render(<App/>);

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
    
  });

