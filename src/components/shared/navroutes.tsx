import * as React from "react";
import {Route} from "react-router-dom";

import {Segment, Container, Image} from "semantic-ui-react";

import * as home from "../../images/home.png"
import * as Animals from "../animals/index";
import * as Sponsors from "../sponsors/index";

class NavRoutes extends React.Component {
    render() {
        return (
            <Segment>
                <Container>
                    <Route exact path="/" component={function(){return <Image src={home} className="ui image"/>;}} />
                    <Route exact path="/animals" component={Animals.ListAnimalsView}/>
                    <Route exact path="/animal" component={Animals.NewEditAnimalView}/>
                    <Route exact path="/animal/:id" component={Animals.NewEditAnimalView}/>
                    
                    <Route exact path="/sponsors" component={Sponsors.ListSponsorsView}/>
                    <Route exact path="/sponsor" component={Sponsors.NewEditSponsorView}/>
                    <Route exact path="/sponsor/:id" component={Sponsors.NewEditSponsorView}/>

                    <Route exact path="/login" component={Sponsors.LoginSponsorView} />
                    
                </Container>
            </Segment>
        );
    }
}

export {NavRoutes as default, NavRoutes};