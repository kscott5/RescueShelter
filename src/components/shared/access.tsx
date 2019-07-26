import * as React from "react";
import {SponsorStateModel} from "../state/sponsor";

class Login extends React.Component<any> {
    state =  new SponsorStateModel();

    constructor(props) {
        super(props);

        this.state = new SponsorStateModel();
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

        var sponsor = this.state.sponsor;
        sponsor[key] = value;

        this.setState({sponsor: sponsor});
    }

    onClick(event) {
        var form = document.querySelector("form");
        if(!form.checkValidity()) 
            return;

        var objThis = this;
        var body = { 
            useremail: this.state.sponsor.useremail,
            password: this.state.sponsor.password
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
            if(response.ok) {
                window.sessionStorage.setItem("sessionState", "logout");
                window.sessionStorage.setItem("hashid", response.data.hashid);
                window.sessionStorage.setItem("useremail", response.data.sponsor.useremail);
                window.sessionStorage.setItem("username", response.data.sponsor.username);
                window.sessionStorage.setItem("firstname", response.data.sponsor.firstname);
            
                objThis.setState({hashid: response.data.hashid, sponsor: response.data.sponsor});
            }
        })
        .catch(error => {});
    }

    render()  {
        return (            
            <form id="loginForm" className="ui form">
                <input id="useremail" name="useremail" type="text" onChange={this.onChange} value={this.state.sponsor.useremail}/>
                <input id="password" name="password" type="password" onChange={this.onChange} value={this.state.sponsor.password}/>
                <button onClick={this.onClick}>Login</button>
            </form>
        );
    }
} // end Login

class Access extends React.Component<any> {
    state = "login";
    
    constructor(props) {
        super(props);        
        window.sessionStorage.setItem("sessionState", this.state);
    }

    componentDidMount() {        
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (nextProps !== this.props) || 
            (nextState !== this.state) || 
            (nextContext !== this.context);
    }

    render() {
        switch(this.state || "login") {
            case "login":
                return (<Login/>);

            case "logout":
                break;            
        }

        return ('');
    }
}

export {Access as default, Access, Login};