import * as React from "react";
import * as ReactDOM from "react-dom";

import {NewContributor} from "./newsponsor";
import {LoginContributor} from "./loginsponsor";
import {ListSponsors} from "./listsponsors";

export function ListSponsorsView() { return <ListSponsors/>;}
export function AddNewContributorView() { return <NewContributor/>;}
export function LoginContributorView() { return <LoginContributor/>;}