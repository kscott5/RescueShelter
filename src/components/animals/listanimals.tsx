import * as i18nextReact  from 'react-i18next';

import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';

function ListAnimals() {
    const localizer = i18nextReact.getI18n();
    const [model, setModel] = React.useState({ 
        data: [/*Array of HTML elements <div/> */], ok: true, 
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
            {model.data}
        </div>
        
    );
}

export {ListAnimals as default, ListAnimals};