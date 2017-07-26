import * as React from "react";
import * as ReactDom from "react-dom"

export default class NewUser extends React.Component {
    constructor(props) {
        super(props);
        // TODO: Handle data changes and commits
    }
    /**
     */
    render()  {
        return <form>
            <input type="text" id="firstname" name="firstname" value=""/>
            <input type="text" id="lastname" name="lastname" value=""/>
            <input type="text" id="username" name="username" value=""/>
            <input type="password" id="password" name="password" value="" />
            <input type="password" id="passwordConfirmed" name="passwordConfirmed" value="" />
            <input type="submit" value="{this.props.newuser}"/>
        </form>;           
    }
}