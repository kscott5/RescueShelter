import * as React from "react";

export const AppContext = React.createContext({
    loggedIn: false,
    useremail: '',
    username:'',
    firstname: '',
    lastname: '',
    token: ''
});

export {AppContext as default};
