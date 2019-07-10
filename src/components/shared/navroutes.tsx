import * as React from "react";
import * as ReactDOM  from "react-dom";
import {Route} from "react-router-dom";

import {Segment, Container} from "semantic-ui-react";

import * as Animals from "../animals/index";
import * as Contributors from "../contributors/index";

class NavRoutes extends React.Component {
    render() {
        return (
            <Segment>
                <Container>
                    <Route exact path="/"/>
                    <Route exact path="/animals" component={Animals.ListAnimalsView}/>
                    <Route exact path="/animal" component={Animals.NewEditAnimalView}/>
                    <Route exact path="/animal/:id" component={Animals.NewEditAnimalView}/>
                    <Route exact path="/contributors" component={Contributors.ListContributorsView}/>
                </Container>
            </Segment>
        );
    }
}

export {NavRoutes as default, NavRoutes};