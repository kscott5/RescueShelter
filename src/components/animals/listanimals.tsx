import * as i18nextReact  from 'react-i18next';

import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';

function ListAnimals() {
    const [model, setModel] = React.useState({ data: null, loading: true, error: null, options: {limit: 100, a11y: {lang: 'en'}}});

    const localizer = i18nextReact.getI18n();
    const loggedIn = false;
    const linkText = (loggedIn)? localizer.t('components.links.edit') : localizer.t('components.links.view');
    
    React.useEffect(() => {
        const fetchObj = async() => {
            let response = await fetch(`/api/report/animals?limit=${model.options.limit}&lang=${model.options.a11y.lang}`);
            
            if(!response.ok) {
                setModel({...model, loading: false, error: response.statusText});
            } else {
                let results = await response.json();
                let documents = results.data.documents.map((document) =>
                    <div key={document._id}>
                        <span>{document.name}</span>
                        <span>{document.description}</span>
                        {
                            (document.image.contenttype == 'icon')?
                            (<i className={document.image.content + ' ui massive ' + document.image.contenttype}/>) :
                            ('&nbsp;')
                        }
                        <ReactRouterDom.Link to={`/animal/${document._id}`}>{linkText}</ReactRouterDom.Link>        
                    </div>
                );
                setModel({...model, loading: false, data: documents});
            }
        };

        fetchObj();
    }, [ /* params */]); // end useEffect

    return (
        <div className="ui containter">
            <h2>{localizer.t('components.animals.headings.animal_list')}</h2>
            {(loggedIn)? (<ReactRouterDom.Link to="/animal">{localizer.t('components.links.new')}</ReactRouterDom.Link>) : <div/>}
            {(model.loading)? <p>loading...</p> : <div/>}
            {(model.error)? <p>{model.error}</p> : <div/>}
            {model.data}
        </div>
        
    );
}

export {ListAnimals as default, ListAnimals};