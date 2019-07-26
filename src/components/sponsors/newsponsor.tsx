import * as React from 'react';
import {SponsorStateModel} from "../state/sponsor";

class NewSponsor extends React.Component<any> {
    state =  new SponsorStateModel();

    constructor(props) {
        super(props);

        this.state = new SponsorStateModel();

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
        const name = event.target.name;
        const value = event.target.value;
        
        const objThis = this;        
        fetch(`http://localhost:3302/api/secure/registration`, {
            method: "POST",
            body: JSON.stringify(objThis.state.sponsor),
            headers: {
                "content-type": "application/json"
            }
        })
        .then(response => response.json())
        .then(response => { 
            if(response.ok) {
                objThis.setState({ hashid: response.data.hashid});
                objThis.setState({sponsor: response.data.sponsor});
            }
        })
        .catch(error => console.log(error));
    }

    onChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        const sponsor = this.state.sponsor;

        sponsor[name] = value;
        this.setState({sponsor: sponsor});
    }

    compareTo(event) {
        const target = event.target;
        const value = target.value;
        
        this.setState({matchSuccess: ""});
        if(this.state.sponsor.password === value) {
            this.setState({matchSuccess: "success"});
        }

        this.setState({confirmPassword: value});
    }

    verifyUniquiness(event) {
        const name = event.target.name;
        const value = event.target.value;
        
        const objThis = this;        
        fetch(`http://localhost:3302/api/secure/unique/sponsor`, {
            method: "POST",
            body: JSON.stringify({field: name, value: value}),
            headers: {
                "content-type": "application/json"
            }
        })
        .then(response => response.json())
        .then(response => { 
            objThis.setState({uniqueSuccess: ""});
            if(!response.ok)
                objThis.setState({uniqueSuccess: "error"});
            
            const sponsor = objThis.state.sponsor;
            sponsor.useremail = value;
            objThis.setState({sponsor: sponsor});             
        })
        .catch(error => console.log(error));
    }

    render()  {
        return (
            <form className="ui form">
                <h4 className="ui diving header">{this.state.pageTitle}</h4>
                <div className="field">
                    <label>Email *</label>
                    <div id="useremail" className={"ui field input " + this.state.uniqueSuccess}>
                        <input type="text" id="useremail" className="" name="useremail" onChange={this.verifyUniquiness} placeholder="User Email" value={this.state.sponsor.useremail}/>
                    </div>
                </div>
                <div className="field">
                    <label>Password *</label>
                    <div id="password" className={"ui field input " + this.state.matchSuccess}>
                        <input type="password" id="password" name="password" onChange={this.onChange} placeholder="Password" value={this.state.sponsor.password} />
                    </div>
                </div>
                <div className="field">
                    <label>Confirm Password *</label>
                    <div id="confirmPassword" className="ui field input">
                        <input type="password" id="passwordConfirmed" name="passwordConfirmed" onChange={this.compareTo} placeholder="Password Confirmed" value={this.state.confirmPassword}/>
                    </div>
                </div>
                <div className="field">
                    <label>First Name</label>
                    <div id="firstname" className="ui field input">
                        <input type="text" id="firstname" name="firstname" onChange={this.onChange} placeholder="First Name" value={this.state.sponsor.firstname}/>
                    </div>
                </div>
                <div className="field">
                    <label>Last name</label>
                    <div id="lastname" className="ui field input">
                        <input type="text" id="lastname" name="lastname" onChange={this.onChange} placeholder="Last Name" value={this.state.sponsor.lastname}/>
                    </div>
                </div>
                <div className="field">
                    <button id="save" name="save" className="ui button" onClick={this.onClick}>Save</button>
                </div>
            </form>
        );           
    }
}

export function NewContributorView(){
    return <NewSponsor/>
}
export {NewSponsor as default, NewSponsor as NewSponsor};