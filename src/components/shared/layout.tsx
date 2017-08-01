import * as React from "react";
import * as ReactDOM from "react-dom";

import Header from "./header";
import Footer from "./footer";

export default class Layout extends React.Component {
     RenderContent() {
         return <div className="App">
        <div className="App-header">        
          <h2>Welcome to Rescue Shelter</h2>
        </div>
      </div>;
    }

    render() {
        return <div id='layout' name='layout'>
            <Header/>
            <this.RenderContent/>
            <Footer/>
        </div>;
    }
}