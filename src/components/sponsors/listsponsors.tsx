import * as React from 'react';
import * as i18nextReact  from 'react-i18next';
import * as ReactRouterDom from 'react-router-dom';

function ListSponsors() {
    const localizer = i18nextReact.getI18n();
    const [model, setModel] = React.useState({
        data: [/*Array of HTML elements <div/> */], ok: true, 
        message: localizer.t('components.http.get.loading'), 
        options: {keywords: '', page: 1, limit: 100, a11y: {lang: 'en'}}
    });

    const loggedIn = false;
    const linkText = (loggedIn)? localizer.t('components.links.edit') : 
        localizer.t('components.links.view');

    const GetResponseFrom = (results) => {
        let elements = [...results.data.documents].map((element) => {
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
            </div>
        });
        
        return elements;
    } // end GetResponseFrom

    const HandleSearch = async () => {
        setModel({...model, ok:true, message: localizer.t('component.http.get.loading')});
        let params = `?page=${model.options.page}`+
                `&limit=${model.options.limit}`;

        let response = await fetch(`${import.meta.env.VITE_REPORT_API_URI}/api/report/sponsors${params}}`,
            {
                method: 'POST',
                body: JSON.stringify({options: model.options}),
                headers: {
                    'content-type': 'application/json'
                }
            }
        );

        console.debug(`search with ${JSON.stringify(params)} ${response.statusText}`);
        setModel({...model, ok: response.ok, 
            message: (response.ok)? /*empty*/ '' : localizer.t('components.http.get.error'),
            data: GetResponseFrom(await response.json())
        });
    };

    React.useEffect(()=> {
        HandleSearch();
    }, [/* params */]); // end React.useEffect


    return (
        <div className="ui containter">
            <div className={(model.ok)? "ui": "ui error"}><p>{model.message}</p></div>
            <ReactRouterDom.Link to="/sponsor">{localizer.t('components.links.new')}</ReactRouterDom.Link>

            <div>
            <form id="search" name="search" className='ui form'>
                    <div><h3>{localizer.t("component.search.options")}</h3></div>
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
        </div>
    );
} // end ListSponsors

export {ListSponsors as default, ListSponsors as ListSponsors};