
import i18next, { i18n } from 'i18next';
import * as React from 'react';
import {BrowserRouter} from 'react-router-dom';

import '../styles/index.css'
import Layout from './shared/layout'

import AppContext from './state/context';
import AppServices from '../services/appservices';
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
    services: AppServices;
    localizer: i18n;

    constructor(props) {
        super(props);

        this.updateAppContext = this.updateAppContext.bind(this);
        this.querySelector = this.querySelector.bind(this);
        this.services = new AppServices();
        this.localizer = i18next;
        this.model = new SponsorStateModel();
        this.og = new OpenGraph();
        this.state = this;
        this.title = 'Rescue Shelter: Home Page';
    }

    componentDidMount() {                
        this.querySelector("title").innerText = 
            this.localizer.t('head.title', this.title);

        this.querySelector("meta[property='og:description']").content = 
            this.localizer.t('head.og.description', this.og.description);

        this.querySelector("meta[property='og:determiner']").content = 
            this.localizer.t('head.og.determiner', this.og.determiner);

        this.querySelector("meta[property='og:locale']").content = 
            this.localizer.t('head.og.localizer', this.og.locale);

        this.querySelector("meta[property='og:site_name']").content = 
            this.localizer.t('head.og.site_name', this.og.siteName);

        this.querySelector("meta[property='og:title']").content = 
            this.localizer.t('head.og.title', this.og.title);

        this.querySelector("meta[property='og:url']").content = 
            this.localizer.t('head.og.url', this.og.url);
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
                <BrowserRouter>
                    <Layout/>
                </BrowserRouter>
            </AppContext.Provider>
        );
    }
}

export { App as default, App };
