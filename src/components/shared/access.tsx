import * as React from "react";
import {SponsorContext} from "../state/context";
import SponsorStateModel, {SponsorModel} from "../state/sponsor";

class Login extends React.Component<any> {
    state: SponsorModel;

    onLoggedIn: Function;
    onError: Function;

    constructor(props) {
        super(props);

        this.state = new SponsorModel();

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

        var sponsor = this.state;
        sponsor[key] = value;

        this.setState({sponsor: sponsor});
    }

    onClick(event) {
        var form = document.querySelector("form");
        if(!form.checkValidity()) 
            return;
        
        var objThis = this;
        var body = { 
            useremail: this.state.useremail,
            password: this.state.password
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
            objThis.setState({useremail: '', password: ''});
            this.onLoggedIn(response);
        })
        .catch(error => {
            objThis.setState({useremail: '', password: ''});
            this.onError(error);
        });
    }

    render()  {
        return (       
            <form id="loginForm" className="ui form">
                <div id="useremail" className="ui left corner labeled input">
                    <input id="useremail" className="ui input error" required name="useremail" type="email" onChange={this.onChange} value={this.state.useremail} placeholder="user@email.com" />
                    <div className="ui left corner label">
                        <i className="asterisk icon red"></i>
                    </div>
                </div>
                <div id="password" className="ui left corner labeled input">
                    <input id="password" className="ui input error" required name="password" type="password" onChange={this.onChange} value={this.state.password} placeholder="password"/ >
                    <div className="ui left corner label">
                        <i className="asterisk icon red"></i>
                    </div>
                </div>
                <button type="button" className="ui button tiny circular" onClick={this.onClick}>Login</button>
            </form>
        );
    }
} // end Login

class Logout extends React.Component<any> {
    state: SponsorStateModel;

    onLoggedOut: Function;
    onError: Function;

    constructor(props) {
        super(props);

        this.state = props.model;

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
        var body = { 
            hashid: this.state.hashid,
            useremail: this.state.sponsor.useremail
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
            if(this.onLoggedOut !== null) {
                this.onLoggedOut(response);
            }
        })
        .catch(error => {
            if(this.onError !== null) {
                this.onError(error);
            }
        });
    }

    render()  {
        return (       
            <form className="ui form">
                <label>{this.state.sponsor.useremail}</label>
                <button type="button" onClick={this.onClick}>Logout</button>
            </form>
        );
    }
} // end Logout

class Access extends React.Component<any> {
    state: SponsorStateModel;
    
    constructor(props) {
        super(props);        
    }

    componentDidMount() {        
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (nextProps !== this.props) || 
            (nextState !== this.state) || 
            (nextContext !== this.context);
    }

    render() {
        return (        
            <SponsorContext.Consumer>
                {
                    ({model, onLoggedIn, onLoggedOut, onError}) => (
                        (!model.loggedIn)? 
                        <Login onLoggedIn={onLoggedIn} onError={onError} /> :
                        <Logout onLoggedOut={onLoggedOut} onError={onError} model={model} />                        
                    )
                }
            </SponsorContext.Consumer>
        );
    }
}

export {Access as default, Access};