import * as React from "react";
import * as ReactDOM from "react-dom";

class NewAnimal extends React.Component {
    name: String;
    description: String;
    population: Number;
    endangered: Boolean;

    addAnimal() {
        var post = new XMLHttpRequest();
        try {
            post.open('POST', 'http://localhost:3302/rs/new/animal');
            post.send('{animal:{}}');
            console.log(post.status + ': ' + post.statusText);
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        return (
            <form method="post">
                <input id='name' name='name' type='text' value={this.name}/>
                <input id='description' name='description' type='textarea' value={this.description}/>
                <input id='population' name='population' type='number' min='1'/>
                <input id='endangered' name='endangered' type='checkbox' checked={this.endangered}/>
                <input id='addanimal' name='addanimal' type='submit' onSubmit={this.addAnimal}/>
            </form>
        );
    }
}

export function AddNewAnimalView() {
    return (<NewAnimal/>);
}
export {NewAnimal as default, NewAnimal};
