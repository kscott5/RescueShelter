import * as React from "react";

import {Form, FormInput, FormTextArea, FormCheckbox, FormButton} from "semantic-ui-react";


class NewAnimal extends React.Component<any> {
    state = {
        animal: 
        {
            name:'', description: '', endangered: false, imageSrc: '', 
            contributors: [], 
        },
        contributor: '',
        toString: function() {
            if(this.animal.contributors.indexOf(this.contributor.trim()) !== 0) 
                this.animal.contributors.push([this.contributor]);
                
            return JSON.stringify(this.animal);
        }
    };

    animalId = '';
    message = '';
    error = '';
    
    constructor(props) {
        super(props);

        this.animalId=this.props.animalId; 
        this.onSaveNewAnimal = this.onSaveNewAnimal.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        if(this.animalId == "0") return;

        // edit existing details
        fetch(`http://localhost:3302/api/animal/${this.animalId}`)
            .then(response =>response.json())
            .then(response => this.setState({["animal"]: response, ["contributor"]: ''}))
            .catch(error => console.log(error));
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (this.props !== nextProps) ||
            (this.state !== nextState) ||
            (this.context !== nextContext);
    }

    onSaveNewAnimal(event) {
        const stateObj = this.state;

        var form = document.querySelector("form");
        if(!form.checkValidity()) return;

        var url = `http://localhost:3302/api/animal/${this.animalId}`;
        if(this.animalId == "0")
            url = `http://localhost:3302/api/animal/new`;

        fetch(url, {
            method: 'POST',
            body: stateObj.toString(), // returns JSON.stringify 
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then(response => {
            console.log(response);
            this.animalId = response._id;
            this.forceUpdate();

            /*window.location.href='/#/animals';*/ })
        .catch(error => this.error = error);
        
    }

    onChange(event) {
        const target = event.target;
        const key = target.name;
        const value = (target.type === 'checkbox')? target.checked : target.value;

        let stateObj = this.state;
        if(key !== "contributor")
            stateObj["animal"][key] = value;
        else
            stateObj[key] = value;
        
        this.setState(stateObj);
    }

    render() {        
        let animal = this.state.animal;
        let contributor = this.state.contributor;

        const contributors = animal.contributors.map((contributor) => {
            return (
                <div key={contributor}  >
                    <span>{contributor}</span>
                </div>
            );    
        });
        
        return (
            <div>
                <Form>
                    <FormInput id='name' onChange={this.onChange} name='name' required placeholder='Animal Name' type='text' value={animal.name}/>
                    <FormTextArea id='description' onChange={this.onChange} name='description' placeholder='Animal Description' type='textarea' value={animal.description}/>
                    <FormInput id='imageSrc' onChange={this.onChange} name='imageSrc' placeholder='Animal url image' type='text' value={animal.imageSrc}/>
                    <FormCheckbox id='endangered' onChange={this.onChange} name='endangered' type='checkbox' checked={animal.endangered}/>
                    <FormInput id='contributor' onChange={this.onChange} name='contributor' placeholder="contributor@email.com" type='email' value={contributor}/>
                    <FormButton id='addanimal' name='addanimal' onClick={this.onSaveNewAnimal}>Save</FormButton>
                </Form>

                {contributors}
            </div>
        );
    }
}

export function AddNewAnimalView() {
    return (<NewAnimal/>);
}
export {NewAnimal as default, NewAnimal};
