import * as React from "react";
import * as ReactDOM  from "react-dom";
import {Route} from "react-router-dom";

import {Segment, Container} from "semantic-ui-react";

import * as Animals from "../animals/index";
import * as Members from "../members/index";

class NavRoutes extends React.Component {
    render() {
        return (
            <Segment>
                <Container>
                    <Route exact path="/"/>
                    <Route exact path="/animals" component={Animals.ListAnimalsView}/>
                    <Route exact path="/animals/new" component={Animals.AddNewAnimalView}/>
                    <Route exact path="/members" component={Members.ListMembersView}/>
                </Container>
            </Segment>
        );
    }
}

export {NavRoutes as default, NavRoutes};