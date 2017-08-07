import * as React from "react";
import * as ReactDom from "react-dom"

class LoginMember extends React.Component {
    constructor(props) {
        super(props);
        // TODO: Handle data changes and commits
    }
    /**
     */
    render()  {
        return <form>
            <input type="text" id="username" name="username" value=""/>
            <input type="password" id="password" name="password" value="" />
            <input type="submit" value="{this.props.login}"/>
        </form>;           
    }
}

export {LoginMember as default, LoginMember};