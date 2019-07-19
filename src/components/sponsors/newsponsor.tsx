import * as React from 'react';

//import {Form, Button} from 'semantic-ui-react';

class SponsorModel {
    public firstname: string = '';
    public lastname: string  = '';
    public useremail: string = '';
    public password: string = '';
    public questioins: any = [];    
    constructor(){}
}

class SponsorStateModel {
    public sponsor: SponsorModel;
    public matchSuccess: string = '';
    public uniqueSuccess = '';
    public confirmPassword = '';
    constructor() {
        this.sponsor = new SponsorModel();
    }
}

class NewSponsor extends React.Component<any> {
    state = new SponsorStateModel();

    constructor(props) {
        super(props);

        this.state = new SponsorStateModel();

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

    onChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({[name]: value});
    }

    compareTo(event) {
        const target = event.target;
        const value = target.value;
        
        this.setState({["matchSuccess"]: ""});
        if(this.state.sponsor.password === value) {
            this.setState({["matchSuccess"]: "success"});
        }

        this.setState({confirmPassword: value});
    }

    verifyUniquiness(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        
        const objThis = this;

        fetch(`http://localhost:3302/api/sponsor/unique`, {
            method: "POST",
            body: JSON.stringify({field: name, value: value}),
            headers: {
                "content-type": "application/json"
            }
        })
        .then(response => response.json())
        .then(response => { 
            objThis.setState({["uniqueSuccess"]: ""});
            if(!response.ok)
                objThis.setState({["uniqueSuccess"]: "error"});

            objThis.setState({[name]: value});             
        })
        .catch(error => console.log(error));
    }

    render()  {
        return (
            <form className="ui form">
                <div id="firstname" className="ui field input">
                    <input type="text" id="firstname" name="firstname" onChange={this.onChange} placeholder="First Name" value={this.state.sponsor.firstname}/>
                </div>
                <div id="lastname" className="ui field input">
                    <input type="text" id="lastname" name="lastname" onChange={this.onChange} placeholder="Last Name" value={this.state.sponsor.lastname}/>
                </div>
                <div id="useremail" className={"ui field input" + this.state.uniqueSuccess}>
                    <input type="text" id="useremail" className="" name="useremail" onChange={this.verifyUniquiness} placeholder="User Email" value={this.state.sponsor.useremail}/>
                </div>
                <div id="password" className={"ui field input" + this.state.matchSuccess}>
                    <input type="password" id="password" name="password" onChange={this.onChange} placeholder="Password" value={this.state.sponsor.password} />
                </div>
                <div id="comfirmPassword" className="ui field input">
                    <input type="password" id="passwordConfirmed" name="passwordConfirmed" onChange={this.compareTo} placeholder="Password Confirmed" value={this.state.confirmPassword}/>
                </div>
                <button id="save" name="save" className="ui button" value="Save"/>
            </form>
        );           
    }
}

export function NewContributorView(){
    return <NewSponsor/>
}
export {NewSponsor as default, NewSponsor as NewSponsor};