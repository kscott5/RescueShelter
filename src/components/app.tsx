
import * as i18nextReact from 'react-i18next';

import * as React from 'react';
import {BrowserRouter} from 'react-router-dom';

import '../styles/index.css'
import Layout from './shared/layout'

import AppContext from './state/context';

function App() {
    const localizer = i18nextReact.getI18n();
    const context = React.useContext(AppContext);
    
    const title = 'Rescue Shelter: Home Page';

    React.useEffect(() => {
        const og = {
            description: '',
            determiner: '',
            locale: 'en_US',
            siteName: 'Rescue Shelter',
            title: 'Rescue Shelter: Single Page Application, SPA',
            type: 'website',
            url: 'http://localhost:3301'
        };

        document.querySelector("title").innerText = 
            localizer.t('head.title', title);

        
        // @ts-ignore
        document.querySelector("meta[property='og:description']").content = 
            localizer.t('head.og.description', og.description);
        // @ts-ignore
        document.querySelector("meta[property='og:determiner']").content = 
            localizer.t('head.og.determiner', og.determiner);
        // @ts-ignore
        document.querySelector("meta[property='og:locale']").content = 
            localizer.t('head.og.localizer', og.locale);
        // @ts-ignore
        document.querySelector("meta[property='og:site_name']").content = 
            localizer.t('head.og.site_name', og.siteName);
        // @ts-ignore
        document.querySelector("meta[property='og:title']").content = 
            localizer.t('head.og.title', og.title);
        // @ts-ignore
        document.querySelector("meta[property='og:url']").content = 
            localizer.t('head.og.url', og.url);        
    }, [context]);

    return <AppContext.Provider value={context}>
        <BrowserRouter>
            <Layout/>
        </BrowserRouter>
    </AppContext.Provider>;
}

export { App as default, App };
