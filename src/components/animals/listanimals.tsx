import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';

import {Button, Container, Grid, Image} from 'semantic-ui-react';

class ListAnimals extends React.Component {
    state = { documents: [], pages: 1, pageIndex: 1};

    constructor(props) {
        super(props);
        this.onSponsorClick = this.onSponsorClick.bind(this);
    }

    componentDidMount() {
        fetch("http://localhost:3302/api/animals?limit=10")
            .then(response =>response.json())
            .then(response => this.setState(response))
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
        const documentItems = this.state.documents.map((document)=>
            <div key={document._id}>
                <span>{document.name}</span>
                <span>{document.description}</span>
                <Image src={document.imageSrc}/>
            </div>);
        
        
        return (
            <Container>
                <h2>Animal Rescurers! We need YOU!</h2>
                <Link to="/animals/new" >New</Link>
                {documentItems}
            </Container>
        );
    }
}

export {ListAnimals as default, ListAnimals};