import * as React from 'react';
import {AppContext} from '../state/context';
import FormStateModel from '../state/form';

const a11y = {
    titles: {},
    headings: {},
    links: {},
    buttons: {
        save: 'Save'
    },
    forms:{
        newsponsor: {
            useremail: {
                label: 'Email address *',
                placeholder: 'your@email.com',
            },
            username: { 
                label: 'Screen name *',
                placeholder: 'unique screen name'
            },
            firstname: {
                label: 'First name',
                placeholder: 'Legal first name'
            },
            lastname: {
                label: 'Last name',
                placeholder: 'Legal last name'
            },
            password: {
                label: 'Password *',
                placeholder: 'Password',
                spec: {
                    regex: '',
                    rules: {
                        r1: 'Password length, minimium 6 and maximium 10 characters',
                        r2: 'At least 1 upper case character',
                        r3: 'At least 1 lower case character',
                        r4: 'At least 1 special character [!@#$%-+.~]'
                    }
                }              
            },
            passwordVerifier: {
                label: 'Verify password *',
                placeholder: 'Verify password'
            }
        }
    }
};

class NewSponsor extends React.Component<any> {
    static contextType = AppContext;
    state: FormStateModel;
    constructor(props) {
        super(props);

        this.state = new FormStateModel();
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.compareTo = this.compareTo.bind(this);
        this.toggleDisplay = this.toggleDisplay.bind(this);
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
        if(!appCtx.querySelector("form.ui.form.register").checkValidity()) {
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

    toggleDisplay(event) {
        const formModel = this.state;
        formModel.toggleDisplay();

        this.setState(formModel);
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
                <legend className="ui diving header">{model.pageTitle}</legend>
                <button type="button" onClick={this.toggleDisplay}><img className="ui icon"/></button><span>First & Last name</span>
                <div className={this.state.displayCss}>
                    <label htmlFor='firstname'>{a11y.forms.newsponsor.firstname.label}</label>
                    <div id="firstname" className="ui field input">
                        <input type="text" id="firstname" name="firstname" onChange={this.onChange} placeholder={a11y.forms.newsponsor.firstname.placeholder} value={model.sponsor.firstname}/>
                    </div>
                </div>
                <div className={this.state.displayCss}>
                    <label htmlFor='lastname'>{a11y.forms.newsponsor.lastname.label}</label>
                    <div id="lastname" className="ui field input">
                        <input type="text" id="lastname" name="lastname" onChange={this.onChange} placeholder={a11y.forms.newsponsor.lastname.placeholder} value={model.sponsor.lastname}/>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor='useremail'>{a11y.forms.newsponsor.useremail.label}</label>
                    <div id="useremail" className={"ui field input " + model.uniqueSuccess}>
                        <input type="text" id="useremail" className="" name="useremail" onChange={this.verifyUniquiness} placeholder={a11y.forms.newsponsor.useremail.placeholder} value={model.sponsor.useremail}/>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor='password'>{a11y.forms.newsponsor.password.label}</label>
                    <div id="password" className={"ui field input " + model.matchSuccess}>
                        <input type="password" id="password" name="password" onChange={this.onChange} placeholder={a11y.forms.newsponsor.password.placeholder} value={model.sponsor.password} />
                    </div>
                </div>
                <div className="field">
                    <label htmlFor='verifyPassword'>{a11y.forms.newsponsor.passwordVerifier.label}</label>
                    <div id="passwordVerifier" className="ui field input">
                        <input type="password" id="verifyPassword" name="verifyPassword" onChange={this.compareTo} placeholder={a11y.forms.newsponsor.passwordVerifier.placeholder} value={model.confirmPassword}/>
                    </div>
                </div>
                <div className="field">
                    <button id="save" name="save" className="ui button" type="button" onClick={this.onClick}>{a11y.buttons.save}</button>
                </div>
            </form>
        );           
    }
}

export function NewSponsorView(){
    return <NewSponsor/>
}

export {NewSponsor as default, NewSponsor, NewSponsorView as NewSponsorFunc};