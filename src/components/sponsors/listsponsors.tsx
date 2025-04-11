import * as React from 'react';
import * as i18nextReact  from 'react-i18next';
import {Link} from 'react-router-dom';
import {Container} from 'semantic-ui-react';

function ListSponsors() {
    const localizer = i18nextReact.getI18n();
    const [model, setModel] = React.useState({
        data: null, ok: true,
        message: localizer.t('components.http.get.loading'), 
        options: {limit: 100, a11y: {lang: 'en'}}});

    React.useEffect(()=> {
        const httpGet = async () => {
            let response = await fetch(`/api/report/sponsors?limit=${model.options.limit}&lang=${model.options.a11y.lang}`);

            if(!response.ok) {
                console.debug(response.statusText);
                setModel({...model, ok: response.ok, message: localizer.t('components.http.get.error')});
            } else {
                let results = await response.json();
                let items = results?.data.documents.map((item) => {
                    <div key={item._id}>
                        <span>{item.username}</span>
                        <span>{item.useremail} </span>
                        
                        <Link to={`/sponsor/${item._id}`}>{a11y.links.view}</Link>
                    </div>
                });

                setModel({...model, ok: response.ok, message: '', data: items});     
            }
        }
        httpGet();
    }, [/* params */]); // end React.useEffect
    
    return (
        <Container>
            <div className={(model.ok)? "ui": "ui error"}><p>{model.message}</p></div>
            {model.data}
            <Link to="/sponsor">{a11y.links.new}</Link>
        </Container>
    );
} // end ListSponsors

export {ListSponsors as default, ListSponsors as ListSponsors};