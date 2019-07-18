import * as React from 'react';

import {Form, Button} from 'semantic-ui-react';

class SponsorModel {
    public firstname: string = '';
    public lastname: string  = '';
    public useremail: string = '';
    public password: string = '';
    public questioins: any = [];    
    constructor(){}
}

class NewSponsor extends React.Component<any> {
    state = new SponsorModel();

    constructor(props) {
        super(props);

        this.state = new SponsorModel();

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

        this.setState({name: value});
    }

    compareTo(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        const compareTo = target["data-compareTo"];

        console.log(target);
    }

    verifyUniquiness(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        
        fetch(`http://local:3302/api/unique`, {
            method: "POST",
            body: JSON.stringify({field: name, value: value}),
            headers: {
                "content-type": "application/json"
            }
        })
        .then(response => response.json)
        .then(response => console.log(response))
        .catch(error => console.log(error));
    }

    render()  {
        const sponsor = this.state;

        return (
            <Form>
            <input type="text" id="firstname" name="firstname" placeholder="First Name" value={sponsor.firstname}/>
            <input type="text" id="lastname" name="lastname" placeholder="Last Name" value={sponsor.lastname}/>
            <input type="text" id="useremail" className="" name="useremail" onChange={this.verifyUniquiness} placeholder="User Email" value={sponsor.useremail}/>
            <input type="password" id="password" name="password" placeholder="Password" value={sponsor.password} />
            <input type="password" id="passwordConfirmed" name="passwordConfirmed" data-compareTo={sponsor.password} onChange={this.compareTo} placeholder="Password Confirmed" value=""/>
            <Button value="Save"/>
            </Form>
        );           
    }
}

export function NewContributorView(){
    return <NewSponsor/>
}
export {NewSponsor as default, NewSponsor as NewSponsor};