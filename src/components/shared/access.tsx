import * as React from "react";
import * as i18nextReact from "react-i18next";
import * as ReactRouterDom from "react-router-dom";

function Login() {
    const localizer = i18nextReact.getI18n();
    const [model, setModel] = React.useState({message:'', useremail:'', password: ''});

    async function onClick(event) {
        const form = document.querySelector("form");
        if(!form.checkValidity())
            return;
        
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
        if(!results.ok) {
            console.debug(`Login error: ${results?.message}`);
            setModel({...model, password:'', message: localizer.t('components.login.error')});
        } else {
            const profile = JSON.stringify({
                token: results.data.token,
                useremail: results.data.useremail,
                username: results.data.username,
                firstname: results.data.firstname,
                lastname: results.data.lastname
            });
            localStorage.setItem("profile", profile);
        } //end if-else results
    }

    const defaultView = 
        (<form id="loginForm" className="ui form">
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
                    <i className="asterisk icon red"></i>
                </div>
            </div>
            <button type="button" className="ui button tiny circular" onClick={(e)=>onClick(e)} 
                aria-label={localizer.t('components.buttons.login')}>{localizer.t('components.buttons.login')}</button>
        </form>)

    const verticalView = 
        (<form id="loginForm" className="ui form">
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
            <button type="button" className="ui button tiny circular" onClick={(e) => onClick(e)} aria-label={localizer.t('components.buttons.login')}>{localizer.t('components.buttons.login')}</button>
        </form>)

        return  (true)? defaultView : verticalView;
    
} // end Login

class Logout extends React.Component<any> {

    async logout(options: any = {data: undefined}) {
        try {
            if(options.data === undefined)
                throw new Error('logout data undefined');

            let fetchObj = fetch(`api/manage/secure/deauth`, { 
                method: `POST`,
                body: JSON.stringify(options.data),
                headers: {
                    'content-type': 'application/json'
                }
            });

            let response = await fetchObj;
            return await response.json();            
        } catch(error) {
            console.log(`[ERROR] logout: ${error}`);
            return {ok: false, data: error};
        }
    } // end logout

    async onClick(event) {
        // var model = this.context.state.model;
        // var body = { 
        //     access_token: model.access_token,
        //     useremail: model.sponsor.useremail
        // };

        // let response = await this.logout({data: body});
        // if(response.ok)
        //     this.onLoggedOut(response);
    }

    render()  {
        return (<button type="button">(Logout)</button>);

        // const model = this.context.state.model;
        // const localizer = getI18n();

        // return (       
        //     <form className="ui form">
        //         <div aria-label={localizer.t('components.access.forms.logout.hello', {'useremail': model.sponsor.useremail})}>{model.sponsor.useremail}</div>
        //         <button type="button" onClick={this.onClick}>{localizer.t('components.buttons.logout')}</button>
        //     </form>
        // );
    }
} // end Logout

class Access extends React.Component<any> {
    onLoggedIn(login) {
        (login.ok)?
            console.log("Login is complete.") :
            console.log("Login failed.");
        

        // const model = new SponsorStateModel();
        // model.access_token = login.data.access_token || '';
        // model.loggedIn = login.ok || false;
        // model.sponsor = login.data.sponsor || new SponsorModel();
                
        //this.context.updateAppContext(model);        
    }

    onLoggedOut(logout) {
        (logout.ok)? 
            console.log("Logout is complete.") :
            console.log("Logout failed.");

        // this.context.updateAppContext(new SponsorStateModel());
    }

    onError(error){
        console.log(`${error}`);
    }

    render() {
        return (        
            (true)? 
                <Login /> :
                <Logout />
        );
    }
}

export {Access as default, Access, Login, Logout};