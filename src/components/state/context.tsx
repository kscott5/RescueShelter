import * as React from "react";
import {SponsorStateModel, SponsorModel} from "./sponsor";

var DefaultSponsorContextValue = {
    model: new SponsorStateModel(),

    onLoggedIn: (login) => {
        (login.ok)?
            console.log("Login is complete.") :
            console.log("Login failed.");

        this.model.hashid = login.data.hashid || '';
        this.model.loggedIn = login.ok || false;
        this.model.sponsor = login.data.sponsor || new SponsorModel();
    },

    onLoggedOut: (logout) => {
        (logout.ok)? 
            console.log("Logout is complete.") :
            console.log("Logout failed.");
        
        this.model = new SponsorStateModel();
    },

    onUpdates: (updates) => {
        (updates.ok)?
            console.log("Updates are complete.") :
            console.log("Updates failed.");
        
        console.log(updates);
    },

    onError: (error) => {
        console.log(`${error}`);
    },    
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
DefaultSponsorContextValue.onError = DefaultSponsorContextValue.onError.bind(DefaultSponsorContextValue);
DefaultSponsorContextValue.onLoggedIn = DefaultSponsorContextValue.onLoggedIn.bind(DefaultSponsorContextValue);
DefaultSponsorContextValue.onLoggedOut = DefaultSponsorContextValue.onLoggedOut.bind(DefaultSponsorContextValue);
DefaultSponsorContextValue.onUpdates = DefaultSponsorContextValue.onUpdates.bind(DefaultSponsorContextValue);

export {DefaultSponsorContextValue};
export const SponsorContext = React.createContext(DefaultSponsorContextValue);