import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter} from "react-router-dom";

import Layout from './shared/layout'

import registerServiceWorker from '../registerServiceWorker';
import AppContext from './state/context';
import SponsorStateModel from './state/sponsor';

class App extends React.Component<any> {
    state;
    model: SponsorStateModel;

    constructor(props) {
        super(props);

        this.updateAppContext = this.updateAppContext.bind(this);
        this.model = new SponsorStateModel();
        this.state = this;
    }


    updateAppContext(model: SponsorStateModel) {
        this.setState({model: model});
    }

    render() {
        return (
            <AppContext.Provider value={this}>
                <HashRouter>
                    <Layout/>
                </HashRouter>
            </AppContext.Provider>
        );
    }
}

ReactDOM.render(<App/> , document.querySelector('#root'));
registerServiceWorker();
