import * as i18nextReact  from 'react-i18next';

import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';

class ListAnimals extends React.Component {
    state = {loggedIn: false, documents:[] };
    
    constructor(props) {
        super(props);
        this.onSponsorClick = this.onSponsorClick.bind(this);        
    }

    /**
     * get list of animals
     * 
     * @param options any
     */
    async getAnimals(options: any = {a11y: {lang: 'en-US'}, limit: 100, phrase: ''}) {
        try {
            
            const fetchObj = fetch(`/api/report/animals?limit=${options.limit}&lang=${options.a11y.lang}`);

            let response = await fetchObj;
            if(!response.ok)
                return {ok: response.ok, data: response.statusText};
                
            return await response.json();
        } catch(error) {
            console.log(`ERROR with getAnimals: ${error}`);
            return {ok: false, data: error}; 
        }
    }; // end getAnimals

    async componentDidMount() { 
        let response = await this.getAnimals();
        if(response.ok) 
            this.setState(response.data);
        else
            this.setState({message: response.data});
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (nextProps !== this.props) || 
            (this.state !== nextState) || 
            (this.context !== nextContext);
    }
        
    onSponsorClick(event, data) {
        // data is both {} and a key:value collection
        // For example:
        // data.label === "Sponsor"
        // data["animalId"] === 23

        console.log(data);
        console.log(data["animinalId"]);        
    }

    render() {
        const localizer = i18nextReact.getI18n();

        const linkText = (this.state.loggedIn)? localizer.t('components.links.edit') : localizer.t('components.links.view');
        const documents = this.state.documents;

        const documentItems = React.Children.map(documents, document =>
            <div key={document._id}>
                <span>{document.name}</span>
                <span>{document.description}</span>
                {
                    (document.image.contenttype == 'icon')?
                    (<i className={document.image.content + ' ui massive ' + document.image.contenttype}/>) :
                    ('&nbsp;')
                }
                <ReactRouterDom.Link to={`/animal/${document._id}`}>{linkText}</ReactRouterDom.Link>        
            </div>
        );
        
        return (
            <div className="ui containter">
                <h2>{localizer.t('components.animals.headings.h2')}</h2>
                {(this.state.loggedIn)? (<ReactRouterDom.Link to="/animal">{localizer.t('components.links.new')}</ReactRouterDom.Link>) : <div/>}
                {documentItems}
            </div>
            
        );
    }
}

export {ListAnimals as default, ListAnimals};