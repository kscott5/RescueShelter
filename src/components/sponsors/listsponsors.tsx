import * as React from 'react';
import {Link} from 'react-router-dom';
import {Container} from 'semantic-ui-react';
import {AppContext} from '../state/context';

const a11y = {
    lang: 'en',
    titles: {
        t1: ''
    },
    headings: {
        h2: 'Rescure Shelter needs sponsors!'
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

class ListSponsors extends React.Component {
    static contextType = AppContext;
    state = { documents: [], pages: 1, pageIndex: 1};

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        fetch(`http://localhost:3302/api/sponsors?limit=100&lang=${a11y.lang}`)
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
        
    render() {
        
        const documentItems = this.state.documents.map((document)=>
            <div key={document._id}>
                <span>{document.username}</span>
                <span>{document.useremail} </span>
                
                <Link to={`/sponsor/${document._id}`}>{a11y.links.view}</Link>
            </div>
        );
        
        return (
            <Container>
                <h2>{a11y.headings.h2}</h2>
                {documentItems}
                <Link to="/sponsor">{a11y.links.new}</Link>
            </Container>
        );
    }
}

export {ListSponsors as default, ListSponsors as ListSponsors};