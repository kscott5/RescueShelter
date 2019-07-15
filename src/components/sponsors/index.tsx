import * as React from "react";

import {NewSponsor} from "./newsponsor";
import {LoginSponsor} from "./loginsponsor";
import {ListSponsors} from "./listsponsors";

export function ListSponsorsView() { return <ListSponsors/>;}
export function AddNewSponsorView() { return <NewSponsor/>;}
export function LoginSponsorView() { return <LoginSponsor/>;}