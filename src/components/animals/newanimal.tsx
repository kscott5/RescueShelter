import * as React from "react";
import * as ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom';

import {Form, FormInput, FormTextArea, FormCheckbox, FormButton} from "semantic-ui-react";

class NewAnimal extends React.Component {
    state = {name:'', description: '', endangered: false, imageSrc: ''};
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
        const animal = this.state;
        fetch("http://localhost:3302/api/animal/new", {
            method: 'POST',
            body: JSON.stringify(animal),
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
        let animal = this.state;
        animal[data.id] = data.value;
        this.setState(animal);
    }

    render() {
        let animal = this.state;

        return (
            <Form>
                <FormInput id='name' onChange={this.onChange} name='name' required placeholder='Animal Name' type='text' value={animal.name}/>
                <FormTextArea id='description' onChange={this.onChange} name='description' placeholder='Animal Description' type='textarea' value={animal.description}/>
                <FormInput id='imageSrc' onChange={this.onChange} name='imageSrc' placeholder='Animal url image' type='text' value={animal.imageSrc}/>
                <FormCheckbox id='endangered' onChange={this.onChange} name='endangered' type='checkbox' checked={animal.endangered}/>
                <FormButton id='addanimal' name='addanimal' onClick={this.onSaveNewAnimal}>Save</FormButton>
            </Form>
        );
    }
}

export function AddNewAnimalView() {
    return (<NewAnimal/>);
}
export {NewAnimal as default, NewAnimal};
