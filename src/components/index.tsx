import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './assets/index.css';

import Layout from './shared/layout'

import registerServiceWorker from '../registerServiceWorker';

ReactDOM.render(
    <Layout>
    </Layout>, 
    document.getElementById('root'));
registerServiceWorker();
