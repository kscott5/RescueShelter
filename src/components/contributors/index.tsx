import * as React from "react";
import * as ReactDOM from "react-dom";

import {NewContributor} from "./newcontributor";
import {LoginContributor} from "./logincontributor";
import {ListContributors} from "./listcontributors";

export function ListContributorsView() { return <ListContributors/>;}
export function AddNewContributorView() { return <NewContributor/>;}
export function LoginContributorView() { return <LoginContributor/>;}