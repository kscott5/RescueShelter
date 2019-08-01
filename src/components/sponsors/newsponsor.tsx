import * as React from 'react';
import {SponsorStateModel} from "../state/sponsor";
import {AppContext} from '../state/context';
import { callbackify } from 'util';

class NewSponsor extends React.Component<any> {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.compareTo = this.compareTo.bind(this);
        this.verifyUniquiness = this.verifyUniquiness.bind(this);
    }

    componentDidMount() {        
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (nextProps !== this.props) || 
            (nextState !== this.state) || 
            (nextContext !== this.context);
    }

    onClick(event) {
        const appCtx = this.context.state;
        if(appCtx.querySelector("form.ui.form.register").checkValidity()) {
            console.log("not valid");
            return false;
        }

        fetch(`http://localhost:3302/api/secure/registration`, {
            method: "POST",
            body: JSON.stringify(appCtx.model.sponsor),
            headers: {
                "content-type": "application/json"
            }
        })
        .then(response => response.json())
        .then(response => { 
            if(response.ok) {
                var model = appCtx.model;
                model.hashid = response.data.hashid;
                model.sponsor = response.data.sponsor;

                appCtx.updateAppContext(model);
            }
        })
        .catch(error => console.log(error));
    }

    onChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        const model = this.context.state.model;

        model.sponsor[name] = value;
        this.context.state.updateAppContext(model);
    }

    compareTo(event) {
        const target = event.target;
        const value = target.value;
        
        var model = this.context.state.model;

        model.matchSuccess = (model.sponsor.password === value)? "success": "";
        model.confirmPassword = value;

        this.context.state.updateAppContext(model);
    }

    verifyUniquiness(event) {
        const name = event.target.name;
        const value = event.target.value;
        
        const appCtx = this.context.state;
        fetch(`http://localhost:3302/api/secure/unique/sponsor`, {
            method: "POST",
            body: JSON.stringify({field: name, value: value}),
            headers: {
                "content-type": "application/json"
            }
        })
        .then(response => response.json())
        .then(response => {
            var model = appCtx.model;

            model.uniqueSuccess = (!response.ok)? "error": "";
            model.sponsor.useremail = value;
            appCtx.updateAppContext(model);
        })
        .catch(error => console.log(error));
    }

    render()  {
        var model = this.context.state.model;
        return (
            <form className="ui form register">
                <h4 className="ui diving header">{model.pageTitle}</h4>
                <div className="field">
                    <label>Email *</label>
                    <div id="useremail" className={"ui field input " + model.uniqueSuccess}>
                        <input type="text" id="useremail" className="" name="useremail" onChange={this.verifyUniquiness} placeholder="User Email" value={model.sponsor.useremail}/>
                    </div>
                </div>
                <div className="field">
                    <label>Password *</label>
                    <div id="password" className={"ui field input " + model.matchSuccess}>
                        <input type="password" id="password" name="password" onChange={this.onChange} placeholder="Password" value={model.sponsor.password} />
                    </div>
                </div>
                <div className="field">
                    <label>Confirm Password *</label>
                    <div id="confirmPassword" className="ui field input">
                        <input type="password" id="passwordConfirmed" name="passwordConfirmed" onChange={this.compareTo} placeholder="Password Confirmed" value={model.confirmPassword}/>
                    </div>
                </div>
                <div className="field">
                    <label>First Name</label>
                    <div id="firstname" className="ui field input">
                        <input type="text" id="firstname" name="firstname" onChange={this.onChange} placeholder="First Name" value={model.sponsor.firstname}/>
                    </div>
                </div>
                <div className="field">
                    <label>Last name</label>
                    <div id="lastname" className="ui field input">
                        <input type="text" id="lastname" name="lastname" onChange={this.onChange} placeholder="Last Name" value={model.sponsor.lastname}/>
                    </div>
                </div>
                <div className="field">
                    <button id="save" name="save" className="ui button" type="button" onClick={this.onClick}>Save</button>
                </div>
            </form>
        );           
    }
}

export function NewContributorView(){
    return <NewSponsor/>
}
export {NewSponsor as default, NewSponsor as NewSponsor};