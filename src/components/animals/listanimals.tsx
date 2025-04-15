import * as i18nextReact  from 'react-i18next';

import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { Checkbox, Select } from 'semantic-ui-react';

function ListAnimals() {
    const localizer = i18nextReact.getI18n();
    const [model, setModel] = React.useState({ 
        data: [/*Array of HTML elements <div/> */], ok: true, 
        message: localizer.t(`components.http.get.loading`), 
        options: {category_id: 5, keywords: '', limit: 100, endangered: false, a11y: {lang: 'en'}}
    });

    const loggedIn = false;
    const linkText = (loggedIn)? localizer.t('components.links.edit') : localizer.t('components.links.view');
    
    React.useEffect(() => {
        const httpGet = async() => {
            setModel({...model, ok:true, message: localizer.t('component.http.get.loading')});
            let response = await fetch(`/api/report/animals?limit=${model.options.limit}&lang=${model.options.a11y.lang}`);
            
            if(!response.ok) {                
                console.error(response.statusText);
                setModel({...model, ok: response.ok, message: localizer.t(`components.http.get.error`)});
            } else {
                let results = await response.json();
                
                let elements = [];
                results.data.documents.map((element) =>
                    elements.push( 
                        <div key={element._id}>
                            <span>{element.name}</span>
                            <span>{element.description}</span>
                            {
                                (element.image?.contenttype == 'icon')?
                                (<i className={element.image.content + ' ui massive ' + element.image.contenttype}/>) :
                                ('&nbsp;')
                            }
                            <ReactRouterDom.Link to={`/animal/${element._id}`}>{linkText}</ReactRouterDom.Link>   
                        </div>
                    )
                );

                setModel({...model, ok: response.ok, message:'', data: elements});
            }
        };

        httpGet();
    }, [ /* params */]); // end useEffect

    return (
        <div className="ui containter">
            <h2>{localizer.t('components.animals.headings.animal_list')}</h2>
            {(loggedIn)? (<ReactRouterDom.Link to="/animal">{localizer.t('components.links.new')}</ReactRouterDom.Link>) : <div/>}
            <div className={(model.ok)? "ui": "ui error"}>{model.message}</div>

            <div>
                <form id="search" name="search" className='ui form'>
                    <div><h3>{localizer.t("component.search.options")}</h3></div>
                    <div className="ui field">
                        <label className="ui field label" htmlFor="categoryid" 
                            aria-label={localizer.t("component.search.option.category")}>
                                {localizer.t("component.search.option.category")}
                        </label>
                        <select id="categoryid" value={model.options.category_id} aria-label={localizer.t("component.search.option.category_id")}> 
                            <option value="1">{localizer.t("component.search.option.invertebrates")}</option>
                            <option value="2">{localizer.t("component.search.option.amphibians")}</option>
                            <option value="3">{localizer.t("component.search.option.birds")}</option>
                            <option value="4">{localizer.t("component.search.option.reptiles")}</option>
                            <option value="5">{localizer.t("component.search.option.mammals")}</option>
                            <option value="6">{localizer.t("component.search.option.fishes")}</option>
                        </select>
                    </div>
                    <div className="ui field input">
                        <label className="ui field label" htmlFor="endangered" 
                            aria-label={localizer.t("component.search.option.endangered")}>
                                {localizer.t("component.search.option.endangered")}
                        </label>
                        <Checkbox id="endangered" checked={model.options.endangered}>{localizer.t("component.search.option.endangered")}</Checkbox>
                    </div>
                    <div className="ui field input">
                        <label className="ui field label" htmlFor="keywords" 
                            aria-label={localizer.t("component.search.option.keywords")}>
                                {localizer.t("component.search.option.keywords")}
                        </label>
                        <input id="keywords" type="text" value={model.options.keywords}></input>
                    </div>
                    <div>
                        <label className="ui field label" htmlFor="limit" aria-label={localizer.t("component.search.option.limit")}>{localizer.t("component.search.option.limit")}</label>
                        <select id="limit" value={model.options.limit}>
                            <option value="25">25</option>
                            <option value="50" >50</option>
                            <option value="100">100</option>
                            <option value="125">125</option>
                            <option value="200">200</option>
                        </select>
                    </div>
                    <div className="ui field input">
                    <button type="button" className="ui button tiny circular" aria-label={localizer.t('components.buttons.login')}>
                        {localizer.t('components.buttons.search')}
                    </button>

                    </div>
                </form>
            </div>
            {model.data}
        </div>
        
    );
}

export {ListAnimals as default, ListAnimals};