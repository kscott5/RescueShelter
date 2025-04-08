import * as i18nextReact  from 'react-i18next';

import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import AppContext from '../state/context';

function ListAnimals() {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [options, setOptions] = React.useState({limit: 100, a11y: {lang: 'en'}});

    const localizer = i18nextReact.getI18n();
    const loggedIn = false;
    const linkText = (loggedIn)? localizer.t('components.links.edit') : localizer.t('components.links.view');
    
    React.useEffect(() => {
        const fetchObj = async() => {
            try {
                let response = await fetch(`http://localhost:3303/api/report/animals?limit=${options.limit}&lang=${options.a11y.lang}`);
                
                if(!response.ok) {
                    setError(response.statusText);
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
                
                    setData(documents);
                }
            } catch(error) {
                setError(`sponsor api ${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchObj();
    }, [ /* params */]); // end useEffect

    return (
        <div className="ui containter">
            <h2>{localizer.t('components.animals.headings.animal_list')}</h2>
            {(loggedIn)? (<ReactRouterDom.Link to="/animal">{localizer.t('components.links.new')}</ReactRouterDom.Link>) : <div/>}
            {(loading)? <p>loading...</p> : <div/>}
            {(error)? <p>{error}</p> : <div/>}
            {data}
        </div>
        
    );
}

export {ListAnimals as default, ListAnimals};