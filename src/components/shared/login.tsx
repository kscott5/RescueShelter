import * as React from "react";
import * as i18nextReact from "react-i18next";

import {AppContext} from "../state/context";

export function Login() {
    const localizer = i18nextReact.getI18n();
    const context = React.useContext(AppContext);
    const [model, setModel] = React.useState({loggedIn: false, message: '', useremail:'', password: ''});

    const LoginHandler = async ()=> {
        const response = await fetch(`/api/manage/secure/auth`, { 
            method: `POST`,
            body: `{\"useremail\": \"${model.useremail}\", \"password\": \"${model.password}\"}`,
            headers: {
                'content-type': 'application/json'
            }
        });

        if(!response.ok) {
            console.debug(`Login error: ${response.statusText}`);
            setModel({...model, password:'', message: localizer.t('components.login.error')});
            return;
        }

        const results = await response.json();
        if(results.data?.sponsor == undefined) {
            console.debug(`Login error: ${results?.message || results.data}`);
            setModel({...model, password:'', message: localizer.t('components.login.error')});
        } else {
            setModel({...model, loggedIn: true, password: '', useremail:'', message:''});
            
            context.loggedIn = true;
            context.token = results.data.token;
            context.useremail = results.data.sponsor.useremail;
            context.username = results.data.sponsor.username;
            context.firstname = results.data.sponsor.firstname;
            context.lastname = results.data.sponsor.lastname;                
        } //end if-else results
    };

    const defaultView = <form id="loginForm" className="ui form">
        <div>{model.message}</div>
        <div id="useremail" className="ui left corner labeled input">
            <input id="useremail" className="ui input error" required name="useremail" type="email" 
                onChange={(e) => setModel({...model, useremail: e.target.value})} value={model.useremail}
                placeholder={localizer.t('components.access.forms.login.useremail.placeholder')} />

            <div className="ui left corner label" aria-label={localizer.t('components.access.forms.login.useremail.label')}>
                <i className="asterisk icon red"></i>
            </div>
        </div>
        <div id="password" className="ui left corner labeled input">
            <input id="password" className="ui input error" required name="password" type="password" 
                onChange={(e) => setModel({...model, password: e.target.value})} value={model.password}
                placeholder={localizer.t('components.access.forms.login.password.placeholder')} />

            <div className="ui left corner label" aria-label={localizer.t('components.access.forms.login.password.label')}>
                <i className="asterisk icon true"></i>
            </div>
        </div>
        <button type="button" className="ui button tiny circular" onClick={(e) => LoginHandler()} 
            aria-label={localizer.t('components.buttons.login')}>
                {localizer.t('components.buttons.login')}
        </button>
    </form>;

    const verticalView = <form id="loginForm" className="ui form">
        <div>{model.message}</div>
        <div className="ui field">
            <label className="ui field label" htmlFor="useremail">{localizer.t('components.access.forms.login.useremail.label')}</label>
            <div className="ui field input">
                <input id="useremail" className="ui input error" required name="useremail" type="email" 
                    onChange={(e) => setModel({...model, useremail: e.target.value})} value={model.useremail} 
                    placeholder={localizer.t('components.access.forms.login.useremail.placeholder')} />
            </div>
        </div>
        <div id="password" className="ui field">
        <label className="ui field label" htmlFor="password">{localizer.t('components.access.forms.login.password.label')}</label>
            <div className="ui field input">
                <input id="password" className="ui input error" required name="password" type="password"
                    onChange={(e) => setModel({...model, password: e.target.value})} value={model.password} 
                    placeholder={localizer.t('components.access.forms.login.password.placeholder')} />
            </div>
        </div>
        <button type="button" className="ui button tiny circular" onClick={(e) => LoginHandler()} 
            aria-label={localizer.t('components.buttons.login')}>
                {localizer.t('components.buttons.login')}
        </button>
    </form>;

    return  defaultView;
    
} // end Login