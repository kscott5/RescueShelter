import * as React from "react";
import * as ReactDom from "react-dom"
import {Segment, Container, Form, FormInput, FormButton} from "semantic-ui-react";

class LoginMember extends React.Component {
    state;
    constructor(props) {
        super(props);
        this.state = {login: 
            {username:'', 
             password: '', 
             loginLabel: 'Login', 
             forgotLabel: 'Forgot It'}
        };
    }
    
    render()  {
        const login = this.state;
        return (<Form>
            <FormInput type="text" id="username" placeholder="UserName" name="username" value={login.username}/>
            <FormInput type="password" id="password" placeholder="Password" name="password" value={login.password} />
            <FormButton value={login.loginLabel}/> <FormButton value={login.loginLabel} />
        </Form>);           
    }
}

export {LoginMember as default, LoginMember};