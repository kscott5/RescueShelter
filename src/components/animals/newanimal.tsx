import * as React from "react";

import {Form, FormInput, FormTextArea, FormCheckbox, FormButton} from "semantic-ui-react";

class AnimalModel {
    public name: string="";
    public description: string="";
    public imageSrc: string="";
    public endangered: boolean = false;
    public sponsors: Array<string> = [];
}

class AnimalStateModel {
    public id: string="0";
    public message: string="";
    public animal: AnimalModel;
    public sponsor: string="";

    constructor(id: string) {
        this.id = id;
        this.animal = new AnimalModel();
    }
}

class NewAnimal extends React.Component<any> {
    state: AnimalStateModel;

    constructor(props) {
        super(props);

        this.state =  new AnimalStateModel(this.props.animalId);
        this.onSaveNewAnimal = this.onSaveNewAnimal.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        var objThis = this;
        if(objThis.state.id == "0") return;

        // edit existing details
        fetch(`http://localhost:3302/api/animal/${objThis.state.id}`)
            .then(response =>response.json())
            .then(response => {
                if(response.ok) 
                    objThis.setState({animal: response.data, sponsor: ''});
                else
                    objThis.setState({message: response.data});
            })
            .catch(error => objThis.setState({message: error}));
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (this.props !== nextProps) ||
            (this.state !== nextState) ||
            (this.context !== nextContext);
    }

    stateToJson() {        
        var animal = this.state["animal"];
        var sponsors = this.state["sponsor"].trim().split(',');

        for(var index in sponsors) {
            var sponsor = sponsors[index].trim();

            // Validate sponsor email address with regex
            if(animal.sponsors.indexOf(sponsors[index]) == -1 && sponsor.length != 0) {
                animal.sponsors.push(sponsors[index]);
            }
        }

        this.setState({animal: animal, sponsor: ""});

        console.log(sponsors);
        console.log(animal);

        // JSONify only AnimalModel
        return JSON.stringify(animal);
    }

    onSaveNewAnimal(event) {
        var objThis = this;
        var form = document.querySelector("form");
        if(!form.checkValidity()) return;

        var url = `http://localhost:3302/api/animal/${objThis.state.id}`;
        if(this.state.id == "0")
            url = `http://localhost:3302/api/animal/new`;

        fetch(url, {
            method: 'POST',
            body: objThis.stateToJson(),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then(response => {
            if(response.ok)    
                objThis.setState({["id"]: response.data._id, ["animal"]: response.data, ["sponsor"]: ''});
            else
                objThis.setState({["message"]: response.data});
        })
        .catch(error => objThis.setState({["message"]: error}));
    }

    onClick(event) {
        const target = event.target;
        const id = target.id;
        const name = target.name;

        if(id == "removesponsor") {
            let animal = this.state.animal;
            let index = animal.sponsors.findIndex((item)=>{return item==name;});

            animal.sponsors[index] = "";
            let sponsorsSorted = animal.sponsors.sort().reverse().pop();
            
            console.log(sponsorsSorted);
        }
    }
    
    onChange(event) {
        const target = event.target;
        const key = target.name;
        const value = (target.type === 'checkbox')? target.checked : target.value;

        let stateObj = this.state;
        if(key === "sponsor") {
            stateObj[key] = value;
        } else {
            stateObj["animal"][key] = value;            
        }
         
        this.setState(stateObj);
    }

    render() {        
        const sponsors = this.state.animal.sponsors.map((sponsor) => {
            return (
                <div key={sponsor}>
                    <span>{sponsor}</span> <button id="removesponsor" name={sponsor}  onClick={this.onClick}>Delete</button>
                </div>
            );    
        });
                return (
            <div>
                <div className="ui error">{this.state.message}</div>
                <Form>
                    <FormInput id='name' onChange={this.onChange} name='name' required placeholder='Animal Name' type='text' value={this.state.animal.name}/>
                    <FormTextArea id='description' onChange={this.onChange} name='description' placeholder='Animal Description' type='textarea' value={this.state.animal.description}/>
                    <FormInput id='imageSrc' onChange={this.onChange} name='imageSrc' placeholder='Animal url image' type='text' value={this.state.animal.imageSrc}/>
                    <FormCheckbox id='endangered' onChange={this.onChange} name='endangered' type='checkbox' checked={this.state.animal.endangered}/>
                    <FormInput id='sponsor' onChange={this.onChange} name='sponsor' placeholder="sponsor@email.com" type='text'  value={this.state.sponsor}/>
                    {sponsors}    
                    <FormButton id='addanimal' name='addanimal' onClick={this.onSaveNewAnimal}>Save</FormButton>
                </Form>                
            </div>
        );
    }
}

export function AddNewAnimalView() {
    return (<NewAnimal/>);
}
export {NewAnimal as default, NewAnimal};
