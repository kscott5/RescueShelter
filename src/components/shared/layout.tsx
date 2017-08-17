import * as React from "react";
import * as ReactDOM from "react-dom";

import {Segment, Container} from "semantic-ui-react";

import {NavRoutes} from "./navroutes";
import {NavLinks} from "./navlinks";

class Layout extends React.Component {
    component: React.Component;
    
     constructor() {
        super();
    }

    render() {
        return (
            <div>
                <NavLinks/>
                <NavRoutes/>
            </div>
        );
    }
}

export {Layout as default, Layout};