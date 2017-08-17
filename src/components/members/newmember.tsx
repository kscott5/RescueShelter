import * as React from "react";
import * as ReactDom from "react-dom"

import {Form, FormInput, FormButton} from "semantic-ui-react";

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
                <FormInput type="text" id="firstname" name="firstname" placeholder="First Name" value={member.firstname}/>
                <FormInput type="text" id="lastname" name="lastname" placeholder="Last Name" value={member.lastname}/>
                <FormInput type="text" id="username" name="username" placeholder="User Name" value={member.username}/>
                <FormInput type="password" id="password" name="password" placeholder="Password" value={member.password} />
                <FormInput type="password" id="passwordConfirmed" name="passwordConfirmed" placeholder="Password Confirmed" value={member.passwordconfirmed} />
                <FormButton  value="Save"/>
            </Form>
        );           
    }
}

export function NewMemberView(){
    return <NewMember/>
}
export {NewMember as default, NewMember};