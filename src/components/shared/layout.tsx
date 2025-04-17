import * as React from "react";

import {NavRoutes} from "./navroutes";
import {NavLinks} from "./navlinks";
import {AppContext} from "../state/context";

function Layout() {
    const context = React.useContext(AppContext);
    
    return <div>
        <NavLinks/>
        <NavRoutes/>
    </div>;
}

export {Layout as default, Layout};