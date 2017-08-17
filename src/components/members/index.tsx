import * as React from "react";
import * as ReactDOM from "react-dom";

import {NewMember} from "./newmember";
import {LoginMember} from "./memberlogin";
import {ListMembers} from "./listmembers";

export function ListMembersView() { return <ListMembers/>;}
export function AddNewMemberView() { return <NewMember/>;}
export function LoginMemberView() { return <LoginMember/>;}