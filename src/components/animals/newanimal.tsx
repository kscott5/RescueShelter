import * as React from "react";
import * as ReactDOM from "react-dom";

import {Form, FormInput, FormTextArea, FormCheckbox, FormButton} from "semantic-ui-react";

class NewAnimal extends React.Component {
    state = {name:'', description: '', endangered: false, imageSrc: ''};
    message = {};
    error = {};

    constructor(props) {
        super(props);
        this.onSaveNewAnimal = this.onSaveNewAnimal.bind(this);
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (this.props !== nextProps) ||
            (this.state !== nextState) ||
            (this.context !== nextContext);
    }

    onSaveNewAnimal(e) {
        const animal = this.state;
        fetch("http://localhost:3302/api/animal/new", {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then(response => this.message = response)
        .catch(error => this.error = error);
    }

    render() {
        let animal = this.state;

        return (
            <Form>
                <FormInput id='name' name='name' placeholder='Animal Name' type='text' value={animal.name}/>
                <FormTextArea id='description' name='description' placeholder='Animal Description' type='textarea' value={animal.description}/>
                <FormInput id='imageSrc' name='imageSrc' placeholder='Animal url image' type='text' value={animal.imageSrc}/>
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
