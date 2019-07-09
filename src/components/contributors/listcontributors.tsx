import * as React from "react";
import * as ReactDOM from "react-dom";

class ListContributors extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {        
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (nextProps !== this.props) || 
            (nextState !== this.state) || 
            (nextContext !== this.context);
    }

    render() {
        return (
            <h1> List the contributors of Rescue Shelter</h1>
        );
    }
}

export {ListContributors as default, ListContributors as ListContributors};