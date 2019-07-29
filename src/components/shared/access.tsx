import * as React from "react";
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
                <input id="useremail" name="useremail" type="text" onChange={this.onChange} value={this.state.useremail}/>
                <input id="password" name="password" type="password" onChange={this.onChange} value={this.state.password}/>
                <button onClick={this.onClick}>Login</button>
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
                <button onClick={this.onClick}>Logout</button>
            </form>
        );
    }
} // end Logout

class Access extends React.Component<any> {
    state: SponsorStateModel;
    
    constructor(props) {
        super(props);        

        this.state = new SponsorStateModel();

        this.onError = this.onError.bind(this);
        this.onLoggedIn = this.onLoggedIn.bind(this);
        this.onLoggedOut = this.onLoggedOut.bind(this);
    }

    componentDidMount() {        
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (nextProps !== this.props) || 
            (nextState !== this.state) || 
            (nextContext !== this.context);
    }

    onLoggedIn(login) {
        console.log("Login completed");
    
        this.setState({hashid: login.data.hashid, loggedIn: login.ok, sponsor: login.data.sponsor});
    }

    onLoggedOut(logout) {
        console.log("Logout completed");
        console.log(logout);

        var sponsor = new SponsorModel();
        this.setState({hashid: '', loggedIn: logout.ok, sponsor: sponsor});
    }

    onError(error) {
        console.log(`${this.state}: ${error}`);
    }

    render() {        
        var model = this.state;
        if(!model.loggedIn)             
            return <Login onLoggedIn={this.onLoggedIn} onError={this.onError} />;
        else
            return <Logout model={model} onLoggedOut={this.onLoggedOut} onError={this.onError} />;
    }
}

export {Access as default, Access};