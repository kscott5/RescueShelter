import * as React from "react";
import {Navigate} from "react-router";

import {AppContext} from "../state/context";
import {Access} from "../shared/access";

function LoginSponsor(){
    return (<Access/>);
} // end LoginSponsor

export {LoginSponsor as default, LoginSponsor as LoginSponsor};