import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter} from "react-router-dom";

import Layout from './shared/layout'

import registerServiceWorker from '../registerServiceWorker';
import { SponsorContext, DefaultSponsorContextValue } from './state/context';

ReactDOM.render(
    <SponsorContext.Provider value={DefaultSponsorContextValue}>
        <HashRouter>
            <Layout/>
        </HashRouter>
    </SponsorContext.Provider> ,
    document.querySelector('#root'));
registerServiceWorker();
