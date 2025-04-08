import * as React from "react";

import {NavRoutes} from "./navroutes";
import {NavLinks} from "./navlinks";
import {AppContext} from "../state/context";

class Layout extends React.Component {
    static contextType = AppContext;
    declare context: React.ContextType<typeof AppContext>;
    
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