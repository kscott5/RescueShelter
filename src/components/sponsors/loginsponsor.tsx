import * as React from "react";
import {Navigate} from "react-router";

import {AppContext} from "../state/context";
import {Login} from "../shared/access";
import {SponsorStateModel, SponsorModel } from "../state/sponsor";

class LoginSponsor extends React.Component<any> {
    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;

    constructor(props) {
        super(props);

        this.onLoggedIn = this.onLoggedIn.bind(this);
        this.onError = this.onError.bind(this);
    }

    componentDidMount() {        
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (nextProps !== this.props) || 
            (nextState !== this.state) || 
            (nextContext !== this.context);
    }
    
    onLoggedIn(login) {
        if(!login.ok) {
            console.log("Login sponsor failed."); 
            return ;
        }

        console.log("Login sponsor is complete.");
        
        let model = new SponsorStateModel();
        model.access_token = login.data.access_token || '';
        model.loggedIn = login.ok || false;
        model.sponsor = login.data.sponsor || new SponsorModel();

        this.context.set("model", model);
    }

    onError(error){
        console.log(`${error}`);
    }

    render()  {
        if (this.context.has("loggedIn") && !this.context.get("loggedIn")) {
            return (<Login defaultView="false" onLoggedIn={this.onLoggedIn} onError={this.onError} /> );

        } else if(this.context.has("model")) {
            
            const model = this.context.get("model");
            return (<Navigate to={"/sponsor/"+ model._id } replace /> );
        }
    }
} // end LoginSponsor

export {LoginSponsor as default, LoginSponsor as LoginSponsor};