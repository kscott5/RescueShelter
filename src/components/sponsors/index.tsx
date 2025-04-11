import * as React from "react";

import {NewSponsor} from "./newsponsor";
import {LoginSponsor} from "./loginsponsor";
import {ListSponsors} from "./listsponsors";

export function ListSponsorsView() { return <ListSponsors/>;}
export function LoginSponsorView() { return <LoginSponsor/>;}
export function NewEditSponsorView() {return <NewSponsor/>;}