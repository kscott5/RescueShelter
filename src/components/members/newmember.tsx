import * as React from "react";
import * as ReactDom from "react-dom"

class NewMember extends React.Component {
    constructor() {
        super();
    }

    render()  {
        return (
            <form>
                <input type="text" id="firstname" name="firstname" value=""/>
                <input type="text" id="lastname" name="lastname" value=""/>
                <input type="text" id="username" name="username" value=""/>
                <input type="password" id="password" name="password" value="" />
                <input type="password" id="passwordConfirmed" name="passwordConfirmed" value="" />
                <input type="submit" value="{this.props.newuser}"/>
            </form>
        );           
    }
}

export {NewMember as default, NewMember};