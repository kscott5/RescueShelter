import * as React from 'react';
import {HashRouter} from 'react-router-dom';

import '../styles/index.css'
import Layout from './shared/layout'

import AppContext from './state/context';
import OpenGraph from "./state/opengraph";
import SponsorStateModel from './state/sponsor';

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
        this.querySelector = this.querySelector.bind(this);
        
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

export { App as default, App };
