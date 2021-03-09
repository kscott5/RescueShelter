import * as React from "react";
import {Redirect} from "react-router";
import {AppContext} from "../state/context";
import {Login} from "../shared/access";
import {SponsorStateModel, SponsorModel } from "../state/sponsor";

class LoginSponsor extends React.Component<any> {
    static contextType = AppContext;

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
        
        const model = new SponsorStateModel();
        model.access_token = login.data.access_token || '';
        model.loggedIn = login.ok || false;
        model.sponsor = login.data.sponsor || new SponsorModel();
        
        this.context.updateAppContext(model);        
    }

    onError(error){
        console.log(`${error}`);
    }

    render()  {
        const model = this.context.state.model;

        return (
            (!model.loggedIn)?
                <Login defaultView="false" onLoggedIn={this.onLoggedIn} onError={this.onError} /> :
                <Redirect to={"/sponsor/"+ model.sponsor._id } />
        );
    }
} // end LoginSponsor

export {LoginSponsor as default, LoginSponsor as LoginSponsor};