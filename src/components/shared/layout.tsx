import * as React from "react";
import * as ReactDOM from "react-dom";

import Header from "./header";
import Footer from "./footer";

export default class Layout extends React.Component {    
    renderContent() {

    }

    render() {
        return <div id='layout' name='layout'>
            <Header/>
            renderContent()
            <Footer/>
        </div>;
    }
}