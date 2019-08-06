import * as React from "react";
import AppContext from "../state/context";
import SponsorStateModel, {SponsorModel} from "../state/sponsor";

const a11y = {
    titles: {},
    headings: {},
    links: {},
    buttons: {
        login: 'Login',
        logoff: 'Logout'
    },
    forms:{
        login: {
            useremail: {
                label: 'Email address *',
                placeholder: 'your@email.com',
            },
            password: {
                label: 'Password *',
                placeholder: 'Password',
                spec: {
                    regex: '',
                    rules: {
                        r1: 'Password length, minimium 6 and maximium 10 characters',
                        r2: 'At least 1 upper case character',
                        r3: 'At least 1 lower case character',
                        r4: 'At least 1 special character [!@#$%-+.~]'
                    }
                }              
            }
        },
        logout: {
            hello: {
                label: 'Hello'
            },
            welcome: {
                label: 'Welcome back'
            }
        }
    }
};

class Login extends React.Component<any> {
    static contextType = AppContext;

    onLoggedIn: Function;
    onError: Function;
    defaultView: Boolean;

    constructor(props) {
        super(props);

        this.defaultView = this.props.defaultView || true;

        this.onLoggedIn = this.props.onLoggedIn;
        this.onError = this.props.onError;

        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);         
    }

    componentDidMount() {        
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (nextProps !== this.props) || 
            (nextState !== this.state) || 
            (nextContext !== this.context);
    }

    onChange(event) {
        var key = event.target.name;
        var value = event.target.value;

        var model = this.context.state.model;

        model.sponsor[key] = value;

        this.context.updateAppContext(model);
    }

    onClick(event) {
        var form = document.querySelector("form");
        if(!form.checkValidity()) 
            return;
        
        var model = this.context.state.model;
        var body = { 
            useremail: model.sponsor.useremail,
            password: model.sponsor.password
        };

        fetch(`http://localhost:3302/api/secure/auth`, { 
            method: `POST`,
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(response => {
            this.onLoggedIn(response);
        })
        .catch(error => {
            this.onError(error);
        });
    }

    render()  {
        const model = this.context.state.model;

        const defaultView = 
            (<form id="loginForm" className="ui form">
                <div id="useremail" className="ui left corner labeled input">
                    <input id="useremail" className="ui input error" required name="useremail" type="email" onChange={this.onChange} value={model.sponsor.useremail} placeholder={a11y.forms.login.useremail.placeholder} />
                    <div className="ui left corner label" aria-label={a11y.forms.login.useremail.label}>
                        <i className="asterisk icon red"></i>
                    </div>
                </div>
                <div id="password" className="ui left corner labeled input">
                    <input id="password" className="ui input error" required name="password" type="password" onChange={this.onChange} value={model.sponsor.password} placeholder={a11y.forms.login.password.placeholder} />
                    <div className="ui left corner label" aria-label={a11y.forms.login.password.label}>
                        <i className="asterisk icon red"></i>
                    </div>
                </div>
                <button type="button" className="ui button tiny circular" onClick={this.onClick} aria-label={a11y.buttons.login}>{a11y.buttons.login}</button>
            </form>)

        const verticalView = 
            (<form id="loginForm" className="ui form">
                <div className="ui field">
                    <label className="ui field label" htmlFor="useremail">{a11y.forms.login.useremail.label}</label>
                    <div className="ui field input">
                        <input id="useremail" className="ui input error" required name="useremail" type="email" onChange={this.onChange} value={model.sponsor.useremail} placeholder={a11y.forms.login.useremail.placeholder} />
                    </div>
                </div>
                <div id="password" className="ui field">
                <label className="ui field label" htmlFor="password">{a11y.forms.login.password.label}</label>
                    <div className="ui field input">
                        <input id="password" className="ui input error" required name="password" type="password" onChange={this.onChange} value={model.sponsor.password} placeholder={a11y.forms.login.password.placeholder} />
                    </div>
                </div>
                <button type="button" className="ui button tiny circular" onClick={this.onClick} aria-label={a11y.buttons.login}>{a11y.buttons.login}</button>
            </form>)

        return  (this.defaultView)? defaultView : verticalView;
    }
} // end Login

class Logout extends React.Component<any> {
    static contextType = AppContext;

    onLoggedOut: Function;
    onError: Function;

    constructor(props) {
        super(props);

        this.onLoggedOut = props.onLoggedOut;
        this.onError = props.onError;

        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {        
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (nextProps !== this.props) || 
            (nextState !== this.state) || 
            (nextContext !== this.context);
    }

    onClick(event) {
        var model = this.context.state.model;
        var body = { 
            hashid: model.hashid,
            useremail: model.sponsor.useremail
        };

        fetch(`http://localhost:3302/api/secure/deauth`, { 
            method: `POST`,
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(response => {
            this.onLoggedOut(response);
        })
        .catch(error => {
            this.onError(error);
        });
    }

    render()  {
        const model = this.context.state.model;
        return (       
            <form className="ui form">
                <div aria-label={a11y.forms.logout.hello + ' ' + model.sponsor.useremail}>{model.sponsor.useremail}</div>
                <button type="button" onClick={this.onClick}>{a11y.buttons.logoff}</button>
            </form>
        );
    }
} // end Logout

class Access extends React.Component<any> {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        
        this.onLoggedIn = this.onLoggedIn.bind(this);
        this.onLoggedOut = this.onLoggedOut.bind(this);
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
        (login.ok)?
            console.log("Login is complete.") :
            console.log("Login failed.");
        
        const model = new SponsorStateModel();
        model.hashid = login.data.hashid || '';
        model.loggedIn = login.ok || false;
        model.sponsor = login.data.sponsor || new SponsorModel();
        
        this.context.updateAppContext(model);        
    }

    onLoggedOut(logout) {
        (logout.ok)? 
            console.log("Logout is complete.") :
            console.log("Logout failed.");

        this.context.updateAppContext(new SponsorStateModel());
    }

    onError(error){
        console.log(`${error}`);
    }

    render() {
        return (        
            (!this.context.state.model.loggedIn)? 
                <Login onLoggedIn={this.onLoggedIn} onError={this.onError} /> :
                <Logout onLoggedOut={this.onLoggedOut} onError={this.onError} />
        );
    }
}

export {Access as default, Access, Login, Logout};