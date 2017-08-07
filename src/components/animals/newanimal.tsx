import * as React from "react";
import * as ReactDOM from "react-dom";

class NewAnimal extends React.Component {
    render() {
        return (
            <form>
                <input id='name' name='name' type='text' />
                <input id='description' name='description' type='textarea'/>
                <input id='population' name='population' type='text'/>
                <input id='endangered' name='endangered' type='checkbox'/>
                <input id='addanimal' name='addanimal' type='submit'/>
            </form>
        );
    }
}

export {NewAnimal as default, NewAnimal};
