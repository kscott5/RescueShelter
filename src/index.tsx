import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom';

import './styles/index.css'
import Layout from './components/shared/layout'

import * as serviceWorker from './serviceWorker';
import AppContext from './components/state/context';
import OpenGraph from "./components/state/opengraph";
import SponsorStateModel from './components/state/sponsor';

class App extends React.Component<any> {
    state;

    /**
     * NOTE: use the SetState() method 
     */
    model: SponsorStateModel;
    title: string;
    og: OpenGraph;
    
    constructor(props) {
        super(props);

        this.updateAppContext = this.updateAppContext.bind(this);
        this.model = new SponsorStateModel();
        this.og = new OpenGraph();
        this.state = this;
        this.title = 'Rescue Shelter: Home Page';
    }

    componentDidMount() {
        this.querySelector("title").innerText = this.title;
        this.querySelector("meta[property='og:description']").content = this.og.description;
        this.querySelector("meta[property='og:determiner']").content = this.og.determiner;
        this.querySelector("meta[property='og:locale']").content = this.og.locale;
        this.querySelector("meta[property='og:site_name']").content = this.og.siteName;
        this.querySelector("meta[property='og:title']").content = this.og.title;
        this.querySelector("meta[property='og:url']").content = this.og.url;
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (this.props !== nextProps) ||
            (this.state !== nextState) ||
            (this.context !== nextContext);
    }

    querySelector(selector: string) : any {
        return document.querySelector(selector);
    }

    updateAppContext(model: SponsorStateModel | any) {
        (model instanceof SponsorStateModel)?
            this.setState({model: model}) :
            this.setState(model);
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

export default { App };

ReactDOM.render(<App/> , document.querySelector('#appContent'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();