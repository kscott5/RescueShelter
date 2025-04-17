import * as React from "react";
import * as i18nextReact from "react-i18next";

import {AppContext} from "../state/context";

export function Logout() {
    const localizer = i18nextReact.getI18n();
    const context = React.useContext(AppContext);
    const [model, setModel] = React.useState({loggedIn: false, message: '', useremail:'', password: ''});

    const LogoutHandler = async ()=> {
        const response = await fetch(`/api/manage/secure/deauth`, { 
            method: `POST`,
            body: `{\"useremail\": \"${context.useremail}\", \"token\": \"${context.token}\"}`,
            headers: {
                'content-type': 'application/json'
            }
        });

        if(!response.ok) {
            console.debug(`Logout error: ${response.statusText}`);
            setModel({...model, useremail:'', password:'', message: localizer.t('components.login.error')});
            return;
        }

        setModel({...model, loggedIn: false});
        context.loggedIn = false;
        context.token = '';
        context.useremail = '';
        context.username = '';
        context.firstname = '';
        context.lastname = '';
    };
    

    return <form className="ui form">
        <div aria-label={localizer.t('components.access.forms.logout.hello', {'useremail': context.useremail})}>{context.firstname}</div>
        <button type="button" onClick={(e) => LogoutHandler()}>{localizer.t('components.buttons.logout')}</button>
    </form>;    
} // end Logout
