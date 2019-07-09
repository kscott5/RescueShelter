import * as React from "react";
import * as ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom';

import {Form, FormInput, FormTextArea, FormCheckbox, FormButton} from "semantic-ui-react";
import { stat } from "fs";

class NewAnimal extends React.Component {
    state = {
        animal: 
        {
            name:'', description: '', endangered: false, imageSrc: '', 
            contributors: [], 
        },
        contributor: '',
        toString: function() {
            if(this.contributor.trim().length > 0)            
                this.animal.contributors = [this.contributor];
                
            return JSON.stringify(this.animal);
        }
    };

    message = {};
    error = {};


    constructor(props) {
        super(props);
        this.onSaveNewAnimal = this.onSaveNewAnimal.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (this.props !== nextProps) ||
            (this.state !== nextState) ||
            (this.context !== nextContext);
    }

    onSaveNewAnimal(event, data) {
        const stateObj = this.state;
        console.log(stateObj.toString());

        var form = document.querySelector("form");
        if(!form.checkValidity()) return;

        fetch("http://localhost:3302/api/animal/new", {
            method: 'POST',
            body: stateObj.toString(), // returns JSON.stringify 
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then(response => {
            this.message = response; 
            window.location.href='/#/animals'; })
        .catch(error => this.error = error);
        
    }

    onChange(event, data) {
        let stateObj = this.state;

        if (data.id === 'endangered') {
            stateObj.animal[data.id] = (data.checked || false);
        } else if(data.id === 'contributor') {
            stateObj.contributor = data.value;
        } else {
            stateObj.animal[data.id] = data.value;
        }  

        this.setState(stateObj);
    }

    render() {
        let animal = this.state.animal;
        let contributor = this.state.contributor;

        return (
            <Form>
                <FormInput id='name' onChange={this.onChange} name='name' required placeholder='Animal Name' type='text' value={animal.name}/>
                <FormTextArea id='description' onChange={this.onChange} name='description' placeholder='Animal Description' type='textarea' value={animal.description}/>
                <FormInput id='imageSrc' onChange={this.onChange} name='imageSrc' placeholder='Animal url image' type='text' value={animal.imageSrc}/>
                <FormCheckbox id='endangered' onChange={this.onChange} name='endangered' type='checkbox' checked={animal.endangered}/>
                <FormInput id='contributor' onChange={this.onChange} name='contributor' type='email' value={contributor}/>
                <FormButton id='addanimal' name='addanimal' onClick={this.onSaveNewAnimal}>Save</FormButton>
            </Form>
        );
    }
}

export function AddNewAnimalView() {
    return (<NewAnimal/>);
}
export {NewAnimal as default, NewAnimal};
