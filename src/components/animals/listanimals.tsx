import * as React from 'react';
import {Link} from 'react-router-dom';

import {AppContext} from "../state/context";

const a11y = {
    lang: 'en',
    titles: {
        t1: ''
    },
    headings: {
        h2: 'Animal Rescurers! We need YOU!'
    },
    buttons: {
    },
    links: {
        new: 'New',
        edit: 'Edit',
        view: 'View'
    },
    forms: {
    }
};

class ListAnimals extends React.Component {
    static contextType = AppContext;
    state = { documents: [], pages: 1, pageIndex: 1};
    
    constructor(props) {
        super(props);
        this.onSponsorClick = this.onSponsorClick.bind(this);
    }

    componentDidMount() { 
        fetch(`/api/report/animals?limit=100&lang=${a11y.lang}`)
            .then(response =>response.json())
            .then(response => {
                if(response.ok) 
                    this.setState(response.data);
                else
                    this.setState({message: response.data});
            })
            .catch(error => console.log(error));
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
        const model = this.context.state.model;
        const linkText = (model.loggedIn)? a11y.links.edit : a11y.links.view;

        const documentItems = this.state.documents.map((document)=>
            <div key={document._id}>
                <span>{document.name}</span>
                <span>{document.description}</span>
                {
                    (document.image.contenttype == 'icon')?
                    (<i className={document.image.content + ' ui massive ' + document.image.contenttype}/>) :
                    ('&nbsp;')
                }
                <Link to={`/animal/${document._id}`}>{linkText}</Link>        
            </div>
        );
        
        return (
            <div className="ui containter">
                <h2>{a11y.headings.h2}</h2>
                {(model.loggedIn)? (<Link to="/animal">{a11y.links.new}</Link>) : <div/>}
                {documentItems}
            </div>
            
        );
    }
}

export {ListAnimals as default, ListAnimals};