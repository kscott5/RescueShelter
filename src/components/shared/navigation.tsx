import * as React from "react";
import * as ReactDOM from "react-dom";
import {Link, Route} from "react-router-dom";

import * as Animals from "../animals/index";
import * as Members from "../members/index";

class Navigation extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div id="rsNavigation" className="rsNavigation">
                <Link to="/">Home</Link>
                <Link to="/animals">Animals</Link>
                <Link to="/members">Members</Link>
            
                <Route exact path="/"/>
                <Route exact path="/animals" component={Animals.ListAnimalsView}/>
                <Route exact path="/members" component={Members.ListMembersView}/>
            </div>);
    }
}

export {Navigation as default, Navigation};