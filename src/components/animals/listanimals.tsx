import * as React from 'react';
import {Link} from 'react-router-dom';

import {Container, Image} from 'semantic-ui-react';

class ListAnimals extends React.Component {
    state = { documents: [], pages: 1, pageIndex: 1};

    constructor(props) {
        super(props);
        this.onSponsorClick = this.onSponsorClick.bind(this);
    }

    componentDidMount() {
        fetch("http://localhost:3302/api/animals?limit=100")
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
        const documentItems = this.state.documents.map((document)=>
            <div key={document._id}>
                <span>{document.name}</span>
                <span>{document.description}</span>
                <Image src={document.imageSrc} class="ui image"/>
                <Link to={`/animal/${document._id}`}>Edit</Link>        
            </div>
        );
        
        return (
            <Container>
                <h2>Animal Rescurers! We need YOU!</h2>
                <Link to="/animal" >New</Link>
                {documentItems}
            </Container>
        );
    }
}

export {ListAnimals as default, ListAnimals};