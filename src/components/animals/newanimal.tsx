import * as React from "react";

import {Form, FormInput, FormTextArea, FormCheckbox, FormButton} from "semantic-ui-react";

class AnimalModel {
    public name: string="";
    public description: string="";
    public imageSrc: string="";
    public endangered: boolean = false;
    public contributors: Array<string> = [];
}

class AnimalStateModel {
    public id: string="0";
    public message: string="";
    public animal: AnimalModel;
    public contributor: string="";

    constructor(id: string) {
        this.id = id;
        this.animal = new AnimalModel();
    }
}

class NewAnimal extends React.Component<any> {
    // state = {
    //     id: '',
    //     animal: 
    //     {
    //         name:'', description: '', endangered: false, imageSrc: '', 
    //         contributors: [], 
    //     },
    //     contributor: '',
    //     message: '',
    //     toString: function() {
    //         var arr = this.animal.contributors;
    //         var email = this.contributor.trim();
    //         if(email != "" && arr.indexOf(email.trim()) !== 0) 
    //             arr.push(this.contributor);
                
    //         return JSON.stringify(this.animal);
    //     }
    // };
    state: AnimalStateModel;

    constructor(props) {
        super(props);

        this.state =  new AnimalStateModel(this.props.animalId);
        this.onSaveNewAnimal = this.onSaveNewAnimal.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        var thisObj = this;
        if(this.state.id == "0") return;

        // edit existing details
        fetch(`http://localhost:3302/api/animal/${this.state.id}`)
            .then(response =>response.json())
            .then(response => thisObj.setState({["animal"]: response, ["contributor"]: ''}))
            .catch(error => thisObj.setState({["message"]: error}));
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (this.props !== nextProps) ||
            (this.state !== nextState) ||
            (this.context !== nextContext);
    }

    stateToJson() {        
        let animal = this.state["animal"];
        let contributors = this.state["contributor"].trim().split(',');

        for(var index in contributors) {
            // Validate contributor email address with regex
            if(animal.contributors.indexOf(contributors[index]) == -1) {
                animal.contributors.push(contributors[index]);
            }
        }

        this.setState({animal: animal, contributor: ""});

        console.log(contributors);
        console.log(animal);

        // JSONify only AnimalModel
        return JSON.stringify(animal);
    }

    onSaveNewAnimal(event) {
        const thisObj = this;

        var form = document.querySelector("form");
        if(!form.checkValidity()) return;

        var url = `http://localhost:3302/api/animal/${this.state.id}`;
        if(this.state.id == "0")
            url = `http://localhost:3302/api/animal/new`;

        fetch(url, {
            method: 'POST',
            body: this.stateToJson(),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then(response => {
            thisObj.setState({
                ["id"]: response._id, 
                ["animal"]: response, 
                ["contributor"]: ''
        });

            /*window.location.href='/#/animals';*/ })
        .catch(error => thisObj.setState({message: error}));
        
    }

    onClick(event) {
        const target = event.target;
        const id = target.id;
        const name = target.name;

        if(id == "removeContributor") {
            let animal = this.state.animal;
            let index = animal.contributors.findIndex((item)=>{return item==name;});

            animal.contributors[index] = "";
            let contributorsSorted = animal.contributors.sort().reverse().pop();
            
            console.log(contributorsSorted);
        }
    }
    
    onChange(event) {
        const target = event.target;
        const key = target.name;
        const value = (target.type === 'checkbox')? target.checked : target.value;

        let stateObj = this.state;
        if(key === "contributor") {
            stateObj[key] = value;
        } else {
            stateObj["animal"][key] = value;            
        }
         
        this.setState(stateObj);
    }

    render() {        
        const contributors = this.state.animal.contributors.map((contributor) => {
            return (
                <div key={contributor}>
                    <span>{contributor}</span> <button id="removeContributor" name={contributor}  onClick={this.onClick}>Delete</button>
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
                    <FormInput id='contributor' onChange={this.onChange} name='contributor' placeholder="contributor@email.com" type='text'  value={this.state.contributor}/>
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
