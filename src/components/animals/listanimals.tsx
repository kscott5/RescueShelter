import * as i18nextReact  from 'react-i18next';

import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';

function ListAnimals() {
    const localizer = i18nextReact.getI18n();
    const [model, setModel] = React.useState({ 
        data: null, ok: true, 
        message: localizer.t(`components.http.get.loading`), 
        options: {limit: 100, a11y: {lang: 'en'}}
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
                let items = results.data.documents.map((item) =>
                    <div key={item._id}>
                        <span>{item.name}</span>
                        <span>{item.description}</span>
                        {
                            (item.image.contenttype == 'icon')?
                            (<i className={item.image.content + ' ui massive ' + item.image.contenttype}/>) :
                            ('&nbsp;')
                        }
                        <ReactRouterDom.Link to={`/animal/${item._id}`}>{linkText}</ReactRouterDom.Link>        
                    </div>
                );
                setModel({...model, ok: response.ok, message:'', data: items});
            }
        };

        httpGet();
    }, [ /* params */]); // end useEffect

    return (
        <div className="ui containter">
            <h2>{localizer.t('components.animals.headings.animal_list')}</h2>
            {(loggedIn)? (<ReactRouterDom.Link to="/animal">{localizer.t('components.links.new')}</ReactRouterDom.Link>) : <div/>}
            <div className={(model.ok)? "ui": "ui error"}>{model.message}</div>
            {model.data}
        </div>
        
    );
}

export {ListAnimals as default, ListAnimals};