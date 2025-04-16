import {i18n} from "i18next";
import * as i18nextReact  from 'react-i18next';

import * as React from "react";
import { Navigate } from "react-router";

function NewAnimal() {
    const [model, setModel] = React.useState({title: '', message:'', ok: true,
        data: {
            _id:'', name:'', description:'', category:'',
            category_id: -1, endangered: false, sponsors:[], 
            data: [], image: {content:'', contenttype: ''}
        }
    });
    const localizer = i18nextReact.getI18n();

    function onChange(event) {
        const target = event.target;
        const key = target.name;
        const value = (target.type === 'checkbox')? target.checked : target.value;

        const data = model.data;
        data[key] = value;

        setModel({...model, data: data});
    };

    function onClick(event) {
        const target = event.target;
        const id = target.id;
        const name = target.name;

        console.log('onClick not available');
        // if(id == "removesponsor") {
        //     let data = model.data;
        //     let index = data?.sponsors.findIndex((item)=>{return item==name;});

        //     animal.sponsors[index] = '';
        //     let sponsorsSorted = animal.sponsors.sort().reverse().pop();
            
        //     console.log(sponsorsSorted);
        // }
    }

    function onSaveNewAnimal(event) {
        setModel({...model, ok: true, message: localizer.t('component.save.model.state.updates')});

        const httpPost = async () => {
            // var form = document.querySelector("form");
            // if(!form.checkValidity()) return;

            // let response = await this.updateAnimal({data: model.ToJson(), withId: model.id});
            // if(response.ok) 
            //     setModel({id: response.data._id, animal: response.data, sponsor: ''});
            // else
            //     setModel({message: response.data});
        };

        httpPost();
    }

    React.useEffect(() => {
        setModel({...model, ok: true, message: 'loading data'});

        const httpGet = async()=> {
            const path = document.location.pathname.split('/');
            try {
                const response = await fetch(`/api/report/animals/${path[path.length-1]}`);
                
                if(!response.ok) {
                    setModel({...model, ok: false, message: response.statusText});
                } else {
                    const results = await response.json();
                    setModel({...model, ok: true, message: '', data: results.data});
                }
            } catch(error) {
                setModel({...model, ok: false, message: `http get animal: ${error}`});
            }        
        };

        httpGet();
    }, [ /* params */]); // end useEffect
    
    if(false /*model.loggedIn*/) {
        return <Navigate to={"/login?redirectUrl=/animal"} replace/>;
    } else {
        return <form id="animalForm" className="ui form">
                <legend className="ui diving header">{model.title}</legend>
                
                <div className={(model.ok)? "ui": "ui error"}><p>{model.message}</p></div>
                <div className="field">
                    <label htmlFor="name">{localizer.t('components.animal.forms.name.label')}</label>
                    <div className={"ui field input " + 'formState.textCss'}>                                
                        <input id='name' onChange={e => onChange(e)} name='name' 
                        required placeholder={localizer.t('components.animal.forms.name.placeholder')} 
                        type='text' value={model.data.name}/>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor='description'>{localizer.t('components.animal.forms.description.label')}</label>
                    <div className={"ui field input " + 'formState.textCss'}>
                        <textarea id='description' onChange={e => onChange(e)} name='description'
                        placeholder={localizer.t('components.animal.forms.description.placeholder')} 
                        value={model.data.description}/>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor='imageSrc'>{localizer.t('components.animal.forms.imageUrl.labe')}</label>
                    <div className={"ui field input " + 'formState.textCss'}>
                        <input id='image.content' onChange={e =>onChange(e)} name='image.content'
                        placeholder={localizer.t('components.animal.forms.imageUrl.placeholder')} type='text' 
                        value={model.data.image.content}/>
                    </div>
                </div>
                <div className="inline field">
                    <div className={"ui checkbox " + 'formState.checkboxCss'}>
                        <input id='endangered' onChange={onChange} name='endangered' type='checkbox' checked={model.data.endangered}/>
                        <label htmlFor='endangered'>{localizer.t('components.animal.forms.endangered.label')}</label>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor='sponsor'>{localizer.t('components.animal.forms.sponsor.label')}</label>
                    <div className={"ui field input " + 'formState.textCss'}>
                        <input id='sponsor' onChange={e =>onChange(e)} name='sponsor'
                        placeholder={localizer.t('components.animal.forms.sponsor.placeholder')} 
                        type='text'  value={model.data.sponsors}/>
                    </div>
                </div>
                <div className="field">
                    <h3>{localizer.t('components.headings.sponsors')}</h3>                                
                    <div className="ui field input">
                        {/* {sponsors}     */}
                    </div>
                </div>
                <div className="field">
                    <button id='addanimal' name='addanimal' className={"ui button " + 'formState.buttonCss'} type="button" 
                    onClick={e => onSaveNewAnimal(e)}>{localizer.t('components.buttons.save')}</button>
                </div>
            </form>;
    }
}

export {NewAnimal as default, NewAnimal};
