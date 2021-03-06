import {i18n} from "i18next";
import * as React from "react";
import {Redirect} from "react-router";
import {AnimalStateModel} from "../state/animal";
import {AppContext} from "../state/context";

const a11y = {
    headings: {
        h3: 'Sponsors'
    },
    
    forms: {
        animal: {
            name: {
                label: 'Animal Name',
                placeholder: 'Animal Name'
            },
            description: {
                label: 'Description',
                placeholder: 'Details Animal Description'
            },
            endangered: {
                label: 'Endangered',                
            },
            imageUrl: {
                label: 'Image Url',
                placeholder: 'http://animal.image.url.img'
            },
            sponsor: {
                label: 'Sponsor',
                placeholder: 'info@rescueshelter.com'
            }
        }
    }
};

class NewAnimal extends React.Component<any,any> {
    static contextType = AppContext;
    state: AnimalStateModel;

    constructor(props) {
        super(props);

        this.state =  new AnimalStateModel(this.props.animalId);
        this.onSaveNewAnimal = this.onSaveNewAnimal.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    async componentDidMount() {
        if(this.state.id == "0") return;

        let response = await this.context.services.getAnimal({id: this.state.id});
        var formState = this.state.form;
        formState.toggleEditable(this.context.loggedIn);

        this.setState({pageTitle: 'Animal Details'});
        if(response.ok) 
            this.setState({animal: response.data, sponsor: '', form: formState});
        else
            this.setState({message: response.data, form: formState});
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (this.props !== nextProps) ||
            (this.state !== nextState) ||
            (this.context !== nextContext);
    }

    stateToJson() {        
        var animal = this.state.animal;
        var sponsors = this.state.sponsor.trim().split(',');

        for(var index in sponsors) {
            var sponsor = sponsors[index].trim();

            // Validate sponsor email address with regex
            if(animal.sponsors.indexOf(sponsors[index]) === -1 && sponsor.length !== 0) {
                animal.sponsors.push(sponsors[index]);
            }
        }

        this.setState({animal: animal, sponsor: ''});

        var hashid = this.context.state.model.hashid;
        var useremail = this.context.state.model.sponsor.useremail;

        // JSONify only AnimalModel
        return JSON.stringify({hashid: hashid, useremail: useremail, animal: animal});
    }

    async onSaveNewAnimal(event) {
        var form = document.querySelector("form");
        if(!form.checkValidity()) return;

        let response = await this.context.services.updateAnimal({data: this.stateToJson(), withId: this.state.id});
        if(response.ok) 
            this.setState({id: response.data._id, animal: response.data, sponsor: ''});
        else
            this.setState({message: response.data});
    }

    onClick(event) {
        const target = event.target;
        const id = target.id;
        const name = target.name;

        if(id == "removesponsor") {
            let animal = this.state.animal;
            let index = animal.sponsors.findIndex((item)=>{return item==name;});

            animal.sponsors[index] = '';
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
        const localizer = this.context.localizer as i18n;
        const formState = this.state.form;
        const sponsors = this.state.animal.sponsors.map((sponsor) => {
            return (
                <div key={sponsor}>
                    <span>{sponsor}</span> <button id="removesponsor" className={"ui button " + formState.buttonCss } name={sponsor} type="button" onClick={this.onClick}>Delete</button>
                </div>
            ); 
        });

        const model = this.context.state.model;
        if(model.loggedIn)
            return (<Redirect to="/login?/animal" /> );
        else
            return (
                    <form id="animalForm" className="ui form">
                        <legend className="ui diving header">{this.state.pageTitle}</legend>
                        <div className="ui error">{this.state.message}</div>
                        <div className="field">
                            <label htmlFor="name">{localizer.t('components.animal.forms.name.label')}</label>
                            <div className={"ui field input " + formState.textCss}>                                
                                <input id='name' onChange={this.onChange} name='name' required placeholder={localizer.t('components.animal.forms.name.placeholder')} type='text' value={this.state.animal.name}/>
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor='description'>{localizer.t('components.animal.forms.description.label')}</label>
                            <div className={"ui field input " + formState.textCss}>
                                <textarea id='description' onChange={this.onChange} name='description' placeholder={localizer.t('components.animal.forms.description.placeholder')} value={this.state.animal.description}/>
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor='imageSrc'>{localizer.t('components.animal.forms.imageUrl.labe')}</label>
                            <div className={"ui field input " + formState.textCss}>
                                <input id='image.content' onChange={this.onChange} name='image.content' placeholder={localizer.t('components.animal.forms.imageUrl.placeholder')} type='text' value={this.state.animal.image.content}/>
                            </div>
                        </div>
                        <div className="inline field">
                            <div className={"ui checkbox " + formState.checkboxCss}>
                                <input id='endangered' onChange={this.onChange} name='endangered' type='checkbox' checked={this.state.animal.endangered}/>
                                <label htmlFor='endangered'>{localizer.t('components.animal.forms.endangered.label')}</label>
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor='sponsor'>{localizer.t('components.animal.forms.sponsor.label')}</label>
                            <div className={"ui field input " + formState.textCss}>
                                <input id='sponsor' onChange={this.onChange} name='sponsor' placeholder={localizer.t('components.animal.forms.sponsor.placeholder')} type='text'  value={this.state.sponsor}/>
                            </div>
                        </div>
                        <div className="field">
                            <h3>{localizer.t('components.headings.sponsors')}</h3>                                
                            <div className="ui field input">
                                {sponsors}    
                            </div>
                        </div>
                        <div className="field">
                            <button id='addanimal' name='addanimal' className={"ui button " + formState.buttonCss} type="button" onClick={this.onSaveNewAnimal}>{localizer.t('components.buttons.save')}</button>
                        </div>
                    </form>
            );
    }
}

export function AddNewAnimalView() {
    return (<NewAnimal/>);
}
export {NewAnimal as default, NewAnimal};
