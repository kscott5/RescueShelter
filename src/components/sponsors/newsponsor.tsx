import * as React from 'react';
import * as i18NextReact from "react-i18next";
import {AppContext} from '../state/context';

function NewSponsor() {
    const localizer = i18NextReact.getI18n();

    const context = React.useContext(AppContext);
    const [model, setModel] = React.useState({
        _id:'', firstname:'', lastname:'', useremail:'', username:'', password: '', photo:''});

    React.useEffect(() => {

    }, [model]);

    React.useCallback(() => {

    },[model]);

    return <form className="ui form register">
            <legend className="ui diving header">{localizer.t('component.sponsor.heading.new')}</legend>
            <button type="button" onClick={(e) => { console.debug("not available")}}>
                    <img className="ui icon"/>
                </button>
            <span>{localizer.t('component.sponse.heading.fullname')}</span>
            <div className={"not available"}>
                <label htmlFor='firstname'>{localizer.t('a11y.forms.newsponsor.firstname.label')}</label>
                <div id="firstname" className="ui field input">
                    <input type="text" id="firstname" name="firstname" onChange={(e) => setModel({...model})} 
                    placeholder={localizer.t('a11y.forms.newsponsor.firstname.placeholder')} 
                    value={model.firstname}/>
                </div>
            </div>
            <div className={"not available"}>
                <label htmlFor='lastname'>{localizer.t('a11y.forms.newsponsor.lastname.label')}</label>
                <div id="lastname" className="ui field input">
                    <input type="text" id="lastname" name="lastname" onChange={(e) => setModel({...model})} 
                        placeholder={localizer.t('a11y.forms.newsponsor.lastname.placeholder')} 
                        value={model.lastname} />
                </div>
            </div>
            <div className="field">
                <label htmlFor='useremail'>{localizer.t('a11y.forms.newsponsor.useremail.label')}</label>
                <div id="useremail" className={"ui field input " + "model.uniqueSuccess"}>
                    <input type="text" id="useremail" className="" name="useremail" onChange={(e) => {}}
                        placeholder={localizer.t('a11y.forms.newsponsor.useremail.placeholder')}
                        value={model.useremail}/>
                </div>
            </div>
            <div className="field">
                <label htmlFor='password'>{localizer.t('a11y.forms.newsponsor.password.label')}</label>
                <div id="password" className={"ui field input " + "model.matchSuccess"}>
                    <input type="password" id="password" name="password" onChange={(e) => {}} 
                        placeholder={localizer.t('a11y.forms.newsponsor.password.placeholder')}
                        value={model.password} />
                </div>
            </div>
            <div className="field">
                <label htmlFor='verifyPassword'>{localizer.t('a11y.forms.newsponsor.passwordVerifier.label')}</label>
                <div id="passwordVerifier" className="ui field input">
                    <input type="password" id="verifyPassword" name="verifyPassword" onChange={(e) => {}} 
                        placeholder={localizer.t('a11y.forms.newsponsor.passwordVerifier.placeholder')} />
                </div>
            </div>
            <div className="field">
                <button id="save" name="save" className="ui button" type="button" onClick={(e) => {}}>
                    {localizer.t('a11y.buttons.save')}
                </button>
            </div>
        </form>;
}

export {NewSponsor as default, NewSponsor};