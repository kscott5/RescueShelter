import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter} from "react-router-dom";

import Layout from './shared/layout'

import registerServiceWorker from '../registerServiceWorker';

ReactDOM.render(
    <HashRouter>
        <Layout/>
    </HashRouter> ,
    document.querySelector('#root'));
registerServiceWorker();
