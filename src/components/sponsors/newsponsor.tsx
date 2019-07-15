import * as React from 'react';

import {Form, Button} from 'semantic-ui-react';

class NewSponsor extends React.Component {
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
        const sponsor = this.state;

        return (
            <Form>
            <input type="text" id="firstname" name="firstname" placeholder="First Name" value={sponsor.firstname}/>
            <input type="text" id="lastname" name="lastname" placeholder="Last Name" value={sponsor.lastname}/>
            <input type="text" id="username" name="username" placeholder="User Name" value={sponsor.username}/>
            <input type="password" id="password" name="password" placeholder="Password" value={sponsor.password} />
            <input type="password" id="passwordConfirmed" name="passwordConfirmed" placeholder="Password Confirmed" value={sponsor.passwordconfirmed} />
            <Button value="Save"/>
            </Form>
        );           
    }
}

export function NewContributorView(){
    return <NewSponsor/>
}
export {NewSponsor as default, NewSponsor as NewSponsor};