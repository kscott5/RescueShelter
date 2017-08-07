import * as React from "react";
import * as ReactDOM from "react-dom";

import Header from "./header";
import Footer from "./footer";
import Navigation from "./navigation";

class Layout extends React.Component {
    component: React.Component;
    
     constructor() {
        super();
    }

    render() {
        return <div id='layout' name='layout'>
            <Header/>
            <Navigation/>            
            <Footer/>
        </div>;
    }
}

export {Layout as default, Layout};