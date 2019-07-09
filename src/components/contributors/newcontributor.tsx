import * as React from 'react';
import * as ReactDom from 'react-dom';

import {Form, Button} from 'semantic-ui-react';

class NewContributor extends React.Component {
    state = {
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        passwordconfirmed: '',
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
        const contributor = this.state;

        return (
            <Form>
            <input type="text" id="firstname" name="firstname" placeholder="First Name" value={contributor.firstname}/>
            <input type="text" id="lastname" name="lastname" placeholder="Last Name" value={contributor.lastname}/>
            <input type="text" id="username" name="username" placeholder="User Name" value={contributor.username}/>
            <input type="password" id="password" name="password" placeholder="Password" value={contributor.password} />
            <input type="password" id="passwordConfirmed" name="passwordConfirmed" placeholder="Password Confirmed" value={contributor.passwordconfirmed} />
            <Button value="Save"/>
            </Form>
        );           
    }
}

export function NewContributorView(){
    return <NewContributor/>
}
export {NewContributor as default, NewContributor as NewContributor};