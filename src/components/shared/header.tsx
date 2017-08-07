import * as React from "react";
import * as ReactDOM from "react-dom";

class Header extends React.Component {
    render() {
        return <div id='header' name='header'>
                <h1>Add Header</h1>
            </div>;
    }
}

export {Header as default, Header};