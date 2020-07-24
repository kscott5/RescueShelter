// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await

class AppServices {    
    origin: string = '';

    constructor() {
        // TODO: use https://create-react-app.dev/docs/adding-custom-environment-variables/
        if(true /* Development */ ) {
            let location = document.location;
            this.origin = `${location.protocol}//${location.hostname}`;
        }
    }

    /**
     * 
     * @param options any
     */
    async getAnimals(options: any = {a11y: {lang: 'en-US'}, limit: 100, phrase: ''}) {
        try {
            const fetchObj = fetch(`${this.origin}/api/report/animals?limit=${options.limit}&lang=${options.a11y.lang}`);

            let response = await fetchObj;
            if(!response.ok)
                return {ok: response.ok, data: response.statusText};
                
            return await response.json();
        } catch(error) {
            console.log(`ERROR with getAnimals: ${error}`);
            return {ok: false, data: error}; 
        }
    } // end getAnimals

    
    async getAnimal(options: any = {id: undefined}) {
        try {
            if(options.id === undefined)
                throw new Error('getAnimal id undefined');

            const fetchObj = fetch(`${this.origin}/api/report/animals/${options.id}`);
            
            let response = await fetchObj;
            if(!response.ok)
                return {ok: response.ok, data: response.statusText};
                
            return await response.json();
        } catch(error) {
            console.log(`Error with getAnimal: ${error}`);
            return {ok: false, data: error}; 
        }        
    } // end getAnimal

    async updateSponsor(options: any = {data: {}, withId: '0'}) {
        throw new Error('updateSponsor not implemented');
    }

    async getSponsor(options: any = {id: undefined}) {
        throw new Error('getSponsor not implemented');
    }
     
    /**
     * 
     * @param options any
     */
    async updateAnimal(options: any = {data: {}, withId: '0'}) {
        try {
            var url = `${this.origin}/api/manage/animals/${options.withId}`;
            if(options.withId === undefined || options.withId == "0")
                url = `${this.origin}/api/mange/animals/new`;

                const fetchObj = fetch(url, {
                method: 'POST',
                body: options.data,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            let response = await fetchObj;
            if(!response.ok)
                return {ok: response.ok, data: response.statusText};
                
            return await response.json();
        } catch(error) {
            console.log(`[ERROR] updateAnimal: ${error}`);
            return {ok: false, data: error}; 
        }
    } // end updateAnimal

    /**
     * 
     * @param options any
     */
    async getCategories(options: any = {}) {
        try {
            const fetchObj = fetch(`${this.origin}/api/report/animals/categories`, {
                method: `GET`,
                //body: JSON.stringify(body),
                headers: {
                    'content-type': 'application/json'
                }
            });
            
            let response = await fetchObj;
            if(!response.ok)
                return {ok: response.ok, data: response.statusText};

            return await response.json();
        } catch(error) {
            console.log(`[ERROR] getCategories: ${error}`);
            return {ok: false, data: error}; 
        }
    } // end getCategories

    /**
     * 
     * @param options: any 
     */
    async getSponsors(options: any = {a11y: {lang: 'en-US'}, limit: 100}) {
        try {
            const fetchObj = fetch(`${this.origin}/api/report/sponsors?limit=${options.limit}&lang=${options.a11y.lang}`);

            let response = await fetchObj;
            if(!response.ok)
                return {ok: response.ok, data: response.statusText};
                
            return await response.json();
        } catch(error) {
            console.log(`[ERROR] getSponsors: ${error}`);
            return {ok: false, data: error}; 
        }
    } // end getSponsors

    async registration(options: any = {data: undefined}) {            
        try {
            if(options.data === undefined)
                throw new Error('register data undefined');
        
                const fetchObj = fetch(`${this.origin}/api/manage/secure/registration`, {
                method: "POST",
                body: JSON.stringify(options.data),
                headers: {
                    "content-type": "application/json"
                }
            });
            
            let response = await fetchObj;
            if(!response.ok)
                return {ok: response.ok, data: response.statusText};
                
            return await response.json();
        } catch(error) {
            console.log(`[ERROR] registration: ${error}`);
            return {ok: false, data: error}; 
        }
    } // end registration

    async login(options: any = {data: undefined}) {
        try {
            if(options.data === undefined)
                throw new Error('login data undefined');

            const fetchObj = fetch(`${this.origin}/api/manage/secure/auth`, { 
                method: `POST`,
                body: JSON.stringify(options.data),
                headers: {
                    'content-type': 'application/json'
                }
            });

            let response = await fetchObj;
            return await response.json()
        } catch(error) {
            console.log(`[ERROR] login: ${error}`);
            return {ok: false, data: error}; 
        }
    } // end login

    async logout(options: any = {data: undefined}) {
        try {
            if(options.data === undefined)
                throw new Error('logout data undefined');

            let fetchObj = fetch(`${this.origin}/api/manage/secure/deauth`, { 
                method: `POST`,
                body: JSON.stringify(options.data),
                headers: {
                    'content-type': 'application/json'
                }
            });

            let response = await fetchObj;
            return await response.json();            
        } catch(error) {
            console.log(`[ERROR] logout: ${error}`);
            return {ok: false, data: error};
        }
    } // end logout

    async verifyUniqueness(options: any = {data: {field: undefined, value: undefined}}) {
        try {
            if(options.data === undefined || options.data.field === undefined || options.data.value === undefined)
                throw new Error(`verifyUniqueness data undefined`);
            if(options.data.field === undefined)
                throw new Error(`verifyUniqueness {data: {field: undefined}}`);
            if(options.data.value === undefined)
                throw new Error(`verifyUniqueness {data: {value: undefined}}`)

            const fetchObj = fetch(`${this.origin}/api/manage/secure/unique/sponsor`, {
                method: 'POST',
                body: JSON.stringify(options.data),
                headers: {
                    'content-type': 'application/json'
                }
            });

            let response = await fetchObj;
            return await response.json();
        } catch(error) {
            console.log(`[ERROR] uniqueness: ${error}`);
            return {ok: false, data: error};
        }
    } // end uniqueSponsor
} // end AppServices

export {AppServices, AppServices as default};