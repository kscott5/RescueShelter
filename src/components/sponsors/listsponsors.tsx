import * as React from 'react';
import {Link} from 'react-router-dom';

import {Container, Image} from 'semantic-ui-react';

class ListSponsors extends React.Component {
    state = { documents: [], pages: 1, pageIndex: 1};

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        fetch("http://localhost:3302/api/sponsors?limit=100")
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
                
                <Link to={`/sponsor/${document._id}`}>Edit</Link>        
            </div>
        );
        
        return (
            <Container>
                <h2>Rescure Shelter needs sponsors!</h2>
                <Link to="/sponsor" >New</Link>
                {documentItems}
            </Container>
        );
    }
}

export {ListSponsors as default, ListSponsors as ListSponsors};