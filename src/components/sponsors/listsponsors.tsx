import * as React from 'react';
import * as i18nextReact  from 'react-i18next';
import * as ReactRouterDom from 'react-router-dom';

function ListSponsors() {
    const localizer = i18nextReact.getI18n();
    const [model, setModel] = React.useState({
        data: [/*Array of HTML elements <div/> */], ok: true, 
        message: localizer.t('components.http.get.loading'), 
        options: {limit: 100, a11y: {lang: 'en'}}});

    const loggedIn = false;
    const linkText = (loggedIn)? localizer.t('components.links.edit') : 
        localizer.t('components.links.view');

    React.useEffect(()=> {
        const httpGet = async () => {
            let response = await fetch(`/api/report/sponsors?limit=${model.options.limit}&lang=${model.options.a11y.lang}`);

            if(!response.ok) {
                console.debug(response.statusText);
                setModel({...model, ok: response.ok, message: localizer.t('components.http.get.error')});
            } else {
                let results = await response.json();
                
                let elements = []; 
                results.data.documents.map((element) => {
                    elements.push(
                        <div key={element._id}>
                            <div>
                                <span>{element.username}</span>
                            </div>
                            <div>
                                <span>{element.useremail} </span>
                            </div>
                            <div>
                                <ReactRouterDom.Link to={`/sponsor/${element._id}`}>{linkText}</ReactRouterDom.Link>
                            </div>
                        </div>);
                });

                setModel({...model, ok: response.ok, message: '', data: elements});
            }
        };

        httpGet();
    }, [/* params */]); // end React.useEffect
    
    return (
        <div className="ui containter">
            <div className={(model.ok)? "ui": "ui error"}><p>{model.message}</p></div>
            <ReactRouterDom.Link to="/sponsor">{localizer.t('components.links.new')}</ReactRouterDom.Link>
            {model.data}
        </div>
    );
} // end ListSponsors

export {ListSponsors as default, ListSponsors as ListSponsors};