import * as React from "react";
import * as ReactDOM from "react-dom";

import {Link, HashRouter} from "react-router-dom";
import {Segment, Container, Menu} from "semantic-ui-react";

import * as Animals from "../animals/index";
import * as Members from "../contributors/index";

class NavLinks extends React.Component {
    state;
    constructor(props) {
        super(props);        
        
        this.state = {activeMenuItem: 'home'};
        this.onMenuItemClicked = this.onMenuItemClicked.bind(this);
    }   

    onMenuItemClicked(e, {name}) {
        this.state = {activeMenuItem: name};
    }

    render() {
        const activeMenuItem = this.state.activeMenuItem;
        return (            
            <Segment inverted vertical textAlign='center' 
                style={{ minHeight: 50, padding: '1em 0em' }}>
                
                <Container>                    
                    <Menu inverted pointing secondary size='large'>
                        <Menu.Item id='home' name='home' as='div' active={activeMenuItem ==='home'} onClick={this.onMenuItemClicked}><Link to="/">Home</Link></Menu.Item>
                        <Menu.Item id='animals' name='animals' as='div' active={activeMenuItem ==='animals'} onClick={this.onMenuItemClicked}><Link to="/animals">Animals</Link></Menu.Item>
                        <Menu.Item id='members' name='contributors' as='div' active={activeMenuItem ==='contributors'} onClick={this.onMenuItemClicked}><Link to="/contributors">Contributors</Link></Menu.Item>
                    </Menu>
                    
                </Container>
            </Segment>);
    }
}

export {NavLinks as default, NavLinks};