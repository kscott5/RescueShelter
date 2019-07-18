import * as React from "react";

import {Link} from "react-router-dom";
import {Segment, Container, Menu} from "semantic-ui-react";

import * as Animals from "../animals/index";
import * as Members from "../sponsors/index";

class NavLinks extends React.Component {
    state;
    constructor(props) {
        super(props);        
        
        this.onMenuItemClicked = this.onMenuItemClicked.bind(this);
    }   

    onMenuItemClicked(event, data) {
        document.querySelector(".active").classList.remove("active");
        document.querySelector(`div#${data.id}`).classList.add("active");
    }

    render() {
        return (            
            <Segment inverted vertical textAlign='center' 
                style={{ minHeight: 50, padding: '1em 0em' }}>
                
                <Container>                    
                    <Menu id="menu" name="menu" inverted pointing secondary size='large'>
                        <Menu.Item id='home' name='home' as='div' active onClick={this.onMenuItemClicked}><Link to="/">Home</Link></Menu.Item>
                        <Menu.Item id='animals' name='animals' as='div' onClick={this.onMenuItemClicked}><Link to="/animals">Animals</Link></Menu.Item>
                        <Menu.Item id='sponsors' name='sponsors' as='div' onClick={this.onMenuItemClicked}><Link to="/sponsors">Sponsors</Link></Menu.Item>
                    </Menu>
                    
                </Container>
            </Segment>);
    }
}

export {NavLinks as default, NavLinks};