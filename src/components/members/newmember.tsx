import * as React from 'react';
import * as ReactDom from 'react-dom';

import {Form, Button} from 'semantic-ui-react';

class NewMember extends React.Component {
    state;
    constructor(props) {
        super(props);

        this.state = { member: {
                firstname: '',
                lastname: '',
                username: '',
                password: '',
                passwordconfirmed: '',
            }
        };
    }

    render()  {
        const member = this.state;

        return (
            <Form>
            <input type="text" id="firstname" name="firstname" placeholder="First Name" value={member.firstname}/>
            <input type="text" id="lastname" name="lastname" placeholder="Last Name" value={member.lastname}/>
            <input type="text" id="username" name="username" placeholder="User Name" value={member.username}/>
            <input type="password" id="password" name="password" placeholder="Password" value={member.password} />
            <input type="password" id="passwordConfirmed" name="passwordConfirmed" placeholder="Password Confirmed" value={member.passwordconfirmed} />
            <Button value="Save"/>
            </Form>
        );           
    }
}

export function NewMemberView(){
    return <NewMember/>
}
export {NewMember as default, NewMember};