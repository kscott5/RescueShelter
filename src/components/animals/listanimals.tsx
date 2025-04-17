import * as i18nextReact  from 'react-i18next';

import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';

function ListAnimals() {
    const localizer = i18nextReact.getI18n();
    const [model, setModel] = React.useState({ 
        data: [/*Array of HTML elements <div/> */], ok: true, 
        message: localizer.t(`components.http.get.loading`), 
        options: {categoryid: -1, keywords: '', page: 1, limit: 100, endangered: false, a11y: {lang: 'en'}}
    });

    const loggedIn = false;
    const linkText = (loggedIn)? localizer.t('components.links.edit') : localizer.t('components.links.view');
    
    const HandleSearch = React.useCallback(async () => {
        setModel({...model, ok:true, message: localizer.t('component.http.get.loading')});
        let params = `?page=${model.options.page}`+
                     `&limit=${model.options.limit}`+
                     `&categoryid=${model.options.categoryid}`+
                     `&endangered=${model.options.endangered}`;

        let response = await fetch(`/api/report/animals${params}`,
            {
                method: 'POST',
                body: JSON.stringify({options: model.options}),
                headers: {
                    'content-type': 'application/json'
                }
            }
        );
        
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
    }, [ model ]); // end useCallback

    React.useEffect(() => {
        HandleSearch();
    }, [/* dependency list */]); // end useEffect

    return <div className="ui containter">
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
                        <select id="categoryid" defaultValue={model.options.categoryid}
                            aria-label={localizer.t("component.search.option.categoryid")}
                            onChange={(e) => setModel({...model, 
                                options:{...model.options, categoryid: parseInt(e.target.value)}})}>
                            <option value="-1">{localizer.t("component.search.option.all")}</option>
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
                        <input id="endangered" type="checkbox" defaultChecked={model.options.endangered}
                            onChange={(e) => setModel({...model, 
                                options:{...model.options, endangered: e.target.checked}})}/>
                    </div>
                    <div className="ui field input">
                        <label className="ui field label" htmlFor="keywords" 
                            aria-label={localizer.t("component.search.option.keywords")}>
                                {localizer.t("component.search.option.keywords")}
                        </label>
                        <input id="keywords" type="text" defaultValue={model.options.keywords}
                            onChange={(e) => setModel({...model, 
                                options:{...model.options, keywords: e.target.value}})}/>
                    </div>
                    <div>
                        <label className="ui field label" htmlFor="limit" aria-label={localizer.t("component.search.option.limit")}>{localizer.t("component.search.option.limit")}</label>
                        <select id="limit" defaultValue={model.options.limit} 
                            onChange={(e) => setModel({...model, 
                                options:{...model.options, limit: parseInt(e.target.value)}})}>
                            <option value="25">25</option>
                            <option value="50" >50</option>
                            <option value="100">100</option>
                            <option value="125">125</option>
                            <option value="200">200</option>
                        </select>
                    </div>
                    <div className="ui field input">
                    <button type="button" className="ui button tiny circular" 
                        onClick={HandleSearch}
                        aria-label={localizer.t('components.buttons.login')}>
                        {localizer.t('components.buttons.search')}
                    </button>

                    </div>
                </form>
            </div>
            {model.data}
        </div>;
}

export {ListAnimals as default, ListAnimals};