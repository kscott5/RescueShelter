import * as React from "react";

class ListSponsors extends React.Component {
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
            <h1> List the sponsors of Rescue Shelter</h1>
        );
    }
}

export {ListSponsors as default, ListSponsors as ListSponsors};