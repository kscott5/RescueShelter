import * as React from 'react';
import * as i18nextReact  from 'react-i18next';
import {Link} from 'react-router-dom';
import {Container} from 'semantic-ui-react';

const a11y = {
    lang: 'en',
    titles: {
        t1: ''
    },
    headings: {
        h2: 'Rescure Shelter needs sponsors!'
    },
    buttons: {
    },
    links: {
        new: 'New',
        edit: 'Edit',
        view: 'View'
    },
    forms: {
    }
}; 

function ListSponsors() {
    const [model, setModel] = React.useState({ data: null, loading: true, error: null, options: {limit: 100, a11y: {lang: 'en'}}});
    
    const localizer = i18nextReact.getI18n();

    React.useEffect(()=> {
        const fetchObj = async () => {
            let response = await fetch(`/api/report/sponsors?limit=${model.options.limit}&lang=${model.options.a11y.lang}`);

            if(!response.ok) {
                setModel({...model, loading: false, error: response.statusText});
            } else {
                let results = await response.json();
                let documents = results?.data.documents.map((document) => {
                    <div key={document._id}>
                        <span>{document.username}</span>
                        <span>{document.useremail} </span>
                        
                        <Link to={`/sponsor/${document._id}`}>{a11y.links.view}</Link>
                    </div>
                });

                setModel({...model, loading: false, data: documents});     
            }
        }
        fetchObj();
    }, [/* params */]); // end React.useEffect
    
    return (
        <Container>
            <h2></h2>
            {(model.loading)? <p>{localizer.t('components.loading.fetch.api.data')}</p> : <div/>}
            {(model.error)? <p> {model.error}</p> : <p/>}
            {model.data}
            <Link to="/sponsor">{a11y.links.new}</Link>
        </Container>
    );
}

export {ListSponsors as default, ListSponsors as ListSponsors};