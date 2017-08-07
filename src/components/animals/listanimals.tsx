import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Link, Route} from 'react-router-dom';

class ListAnimals extends React.Component {
    constructor() {
        super();
    }
    
    render() {
        return <div>
            <h2>Display list of animals from data source</h2>
            <Link to="/animals/new">New</Link>            
        </div>;
    }
}

export {ListAnimals as default, ListAnimals};