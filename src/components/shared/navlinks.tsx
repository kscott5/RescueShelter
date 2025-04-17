import * as React from "react";

import {Link} from "react-router-dom";
import {Segment, Container, Menu, Dropdown} from "semantic-ui-react";

import * as Animals from "../animals/index";
import * as Members from "../sponsors/index";

import {Login} from "../shared/login";
import {Logout} from "../shared/logout";
import {Access} from "../shared/access";

function NavLinks() {
    const HandleMenuClick = React.useCallback((event,data) => {
        console.debug("onMenuItemClick");
        
        document.querySelector(".active").classList.remove("active");
        document.querySelector(`div#${data.id}`).classList.add("active");
    },[]);

    return (            
        <Segment inverted vertical textAlign='center' 
            style={{ minHeight: 50, padding: '1em 0em' }}>
            
            <div className="ui row">
            <Container className="left float">    
                                
                <Menu id="menu" name="menu" compact inverted pointing secondary size='large'>
                    <Menu.Item id='home' name='home' as='div' active data-id="home" onClick={HandleMenuClick}><i className="home icon"></i><Link to="/">Home</Link></Menu.Item>
                    <Menu.Item id='animals' name='animals' as='div' data-id="animals" onClick={HandleMenuClick}><i className="paw icon"></i><Link to="/animals">Animals</Link></Menu.Item>
                    <Menu.Item id='sponsors' name='sponsors' as='div' data-id="sponsors" onClick={HandleMenuClick}><i className="users icon"></i><Link to="/sponsors">Sponsors</Link></Menu.Item>
                    <Menu.Item id='reports' name='reports' as='div'>
                        <i className='chart line icon'></i>
                        <Dropdown text='Reports'>
                            <Dropdown.Menu>
                                <Dropdown.Item as='div' className="item inverted">
                                    <Link to='/report/animals/categories'>Animals</Link>
                                </Dropdown.Item>
                                <Dropdown.Item as='div' className="item inverted" >
                                <Link to='/report/sponsors'>Sponsors</Link>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                    
                </Menu>
            </Container>
            <Container className="right float">
                <Access/>
            </Container>
            </div>
        </Segment>
    ); // end return of render
} // end NavLinks

export {NavLinks as default, NavLinks};