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
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    
    const [options, setOptions] = React.useState({a11y: {lang: 'en-US'}, limit: 100});

    const localizer = i18nextReact.getI18n();

    React.useEffect(()=> {
        const fetchObj = async () => {
            let response = await fetch(`https://localhost:3303/api/report/sponsors?limit=${options.limit}&lang=${options.a11y.lang}`);

            if(!response.ok) {
                setError(response.statusText);
            } else {
                let results = await response.json();
                let documents = results?.data.documents.map((document) => {
                    <div key={document._id}>
                        <span>{document.username}</span>
                        <span>{document.useremail} </span>
                        
                        <Link to={`/sponsor/${document._id}`}>{a11y.links.view}</Link>
                    </div>
                });

                setData(documents);
            }
        }
        fetchObj();
    }, [/* params */]); // end React.useEffect
    
    return (
        <Container>
            <h2></h2>
            {(loading)? <p>{localizer.t('components.loading.fetch.api.data')}</p> : <div/>}
            {(error)? <p> {error}</p> : <p/>}
            {data}
            <Link to="/sponsor">{a11y.links.new}</Link>
        </Container>
    );
}

export {ListSponsors as default, ListSponsors as ListSponsors};