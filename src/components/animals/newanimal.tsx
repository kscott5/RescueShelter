import * as React from "react";
import * as ReactDOM from "react-dom";

import {Form, FormInput, FormTextArea, FormCheckbox, FormButton} from "semantic-ui-react";

class NewAnimal extends React.Component {
    state;
    constructor(props) {
        super(props);

        this.state = { 
            animal: {
               name: '', 
               description: '', 
               population: 0,
               endangered: false
            }
        };

        this.onSaveNewAnimal = this.onSaveNewAnimal.bind(this);
    }

    onSaveNewAnimal(e) {
        const animal = this.state.animal;

        var post = new XMLHttpRequest();
        try {
            post.open('POST', 'http://localhost:3302/rs/new/animal');
            post.send(animal);
            console.log(post.status + ': ' + post.statusText);
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        let animal = this.state.animal;

        return (
            <Form>
                <FormInput id='name' name='name' placeholder='Animal Name' type='text' value={animal.name}/>
                <FormTextArea id='description' name='description' placeholder='Animal Description' type='textarea' value={animal.description}/>
                <FormInput id='population' name='population' placeholder='Animal Population' type='number' min='1' value={animal.population}/>
                <FormCheckbox id='endangered' name='endangered' type='checkbox' checked={animal.endangered}/>
                <FormButton id='addanimal' name='addanimal' value='Save' onClick={this.onSaveNewAnimal}/>
            </Form>
        );
    }
}

export function AddNewAnimalView() {
    return (<NewAnimal/>);
}
export {NewAnimal as default, NewAnimal};
