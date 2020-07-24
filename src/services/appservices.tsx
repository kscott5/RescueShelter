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
            let response = await fetch(`${this.origin}/api/report/animals?limit=${options.limit}&lang=${options.a11y.lang}`);
            if(!response.ok)
                return {ok: response.ok, data: response.statusText};
                
            return await response.json();
        } catch(error) {
            console.log(`ERROR with getAnimals: ${error}`);

        }
    } // end getAnimals

    
    async getAnimal(options: any = {id: undefined}) {
        try {
            if(options.id === undefined)
                throw new Error('getAnimal id undefined');

            let response = await fetch(`${this.origin}/api/report/animals/${options.id}`);
            if(!response.ok)
                return {ok: response.ok, data: response.statusText};
                
            return await response.json();
        } catch(error) {
            console.log(`Error with getAnimal: ${error}`);
        }        
    } // end getAnimal

    /**
     * 
     * @param options any
     */
    async updateAnimal(options: any = {data: {}, withId: '0'}) {
        try {
            var url = `${this.origin}/api/manage/animals/${options.withId}`;
            if(options.withId === undefined || options.withId == "0")
                url = `${this.origin}/api/mange/animals/new`;

            let response = await fetch(url, {
                method: 'POST',
                body: options.data,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(!response.ok)
                return {ok: response.ok, data: response.statusText};
                
            return await response.json();
        } catch(error) {
            console.log(`[ERROR] updateAnimal: ${error}`);
        }
    } // end updateAnimal

    /**
     * 
     * @param options any
     */
    async getCategories(options: any = {}) {
        try {
            let response = await fetch('/api/report/animals/categories', {
                method: `GET`,
                //body: JSON.stringify(body),
                headers: {
                    'content-type': 'application/json'
                }
            });
            
            if(!response.ok)
                return {ok: response.ok, data: response.statusText};

            return await response.json();
        } catch(error) {
            console.log(`[ERROR] getCategories: ${error}`);
        }
    } // end getCategories

    /**
     * 
     * @param options: any 
     */
    async getSponsors(options: any = {a11y: {lang: 'en-US'}, limit: 100}) {
        try {
            let response = await fetch(`${this.origin}/api/report/sponsors?limit=${options.limit}&lang=${options.a11y.lang}`);

            if(!response.ok)
                return {ok: response.ok, data: response.statusText};
                
            return await response.json();
        } catch(error) {
            console.log(`[ERROR] getSponsors: ${error}`);
        }
    } // end getSponsors

    async registerSponsor(options: any = {data: undefined}) {            
        try {
            if(options.data === undefined)
                throw new Error('registerSponsor data undefined');
        
            let response = await fetch(`${this.origin}/api/secure/registration`, {
                method: "POST",
                body: options.data,
                headers: {
                    "content-type": "application/json"
                }
            });
            
            if(!response.ok)
                return {ok: response.ok, data: response.statusText};
                
            return await response.json();
        } catch(error) {
            console.log(`[ERROR] registerSponsor: ${error}`);
        }
    } // end registerSponsor
} // end AppServices

export {AppServices, AppServices as default};