import * as React from "react";
import {Routes, Route} from "react-router-dom";

import {Segment, Container, Image} from "semantic-ui-react";

//import * as home from "../../images/home.png"
import * as Animals from "../animals/index";
import * as Sponsors from "../sponsors/index";
import * as Reports from "../reports/index";

class NavRoutes extends React.Component {
    render() {
        return (
            <Segment>
                <Container>
                <Routes>
                    <Route  path="/" element={<image href="{home}" className="ui image"/>} />
                    <Route  path="/animals" element={<Animals.ListAnimalsView/>}/>
                    <Route  path="/animal" element={<Animals.NewEditAnimalView/>}/>
                    <Route  path="/animal/:id" element={<Animals.NewEditAnimalView/>}/>

                    <Route  path="/sponsors" element={<Sponsors.ListSponsorsView/>}/>
                    <Route  path="/sponsor" element={<Sponsors.NewEditSponsorView/>}/>
                    <Route  path="/sponsor/:id" element={<Sponsors.NewEditSponsorView/>}/>
                    
                    <Route  path="/login" element={<Sponsors.LoginSponsorView/>} />

                    <Route  path="/animal/reports/:reportType" element={<Reports.ChartJsReport/>}/>
                    <Route  path="/sponsor/reports/:reportType" element={<Reports.ChartJsReport/>}/>
                </Routes>
                </Container>
            </Segment>
        );
    }
}

export {NavRoutes as default, NavRoutes};