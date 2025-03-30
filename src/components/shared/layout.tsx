import * as React from "react";

import {NavRoutes} from "./navroutes";
import {NavLinks} from "./navlinks";

class Layout extends React.Component {
    component: React.Component;
    
     constructor(props) {
        super(props);
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