import * as React from "react";
import {Form, FormInput, FormButton} from "semantic-ui-react";

class LoginSponsor extends React.Component {
    state = {
        username:'', 
        password: '', 
        loginLabel: 'Login', 
        forgotLabel: 'Forgot It'
    };

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
    
    render()  {
        const login = this.state;
        return (<Form>
            <FormInput type="text" id="username" placeholder="UserName" name="username" value={login.username}/>
            <FormInput type="password" id="password" placeholder="Password" name="password" value={login.password} />
            <FormButton value={login.loginLabel}/> <FormButton value={login.loginLabel} />
        </Form>);           
    }
}

export {LoginSponsor as default, LoginSponsor as LoginSponsor};