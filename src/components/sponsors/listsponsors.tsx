import * as React from 'react';
import {Link} from 'react-router-dom';
import {Container} from 'semantic-ui-react';

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
    state = { documents: [], pages: 1, pageIndex: 1};

    constructor(props) {
        super(props);
    }

    /**
     * get list of animal sponsors
     * 
     * @param options: any 
     */
    async getSponsors(options: any = {a11y: {lang: 'en-US'}, limit: 100}) {
        try {
            const fetchObj = fetch(`/api/report/sponsors?limit=${options.limit}&lang=${options.a11y.lang}`);

            let response = await fetchObj;
            if(!response.ok)
                return {ok: response.ok, data: response.statusText};
                
            return await response.json();
        } catch(error) {
            console.log(`[ERROR] getSponsors: ${error}`);
            return {ok: false, data: error}; 
        }
    } // end getSponsors


    async componentDidMount() {
        let response = await this.getSponsors();
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