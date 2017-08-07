import * as React from 'react';
import * as ReactDOM from 'react-dom';

class ListAnimals extends React.Component {
    constructor() {
        super();
    }
    
    render() {
        return <div>
            <h2>Display list of animals from data source</h2>
        </div>;
    }
}

export {ListAnimals as default, ListAnimals};