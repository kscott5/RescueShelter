class AppServices {    
    /**
     * 
     * @param options any
     */
    async getAnimals(options: any = {a11y: {lang: 'en-US'}, limit: 100, phrase: ''}) {
        try {
            let response = await fetch(`/api/report/animals?limit=${options.limit}&lang=${options.a11y.lang}`);

            return { ok: response.ok, data: await response.json()};
        } catch(error) {
            console.log(`ERROR with getAnimals: ${error}`);

        }
    } // end getAnimals

    
    async getAnimal(options: any = {id: undefined}) {
        try {
            if(options.id === undefined)
                throw new Error('getAnimal id undefined');

            let response = await fetch(`/api/report/animals/${options.id}`);

            return { ok: response.ok, data: await response.json()};            
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
            var url = `/api/manage/animals/${options.withId}`;
            if(options.withId === undefined || options.withId == "0")
                url = `/api/mange/animals/new`;

            let response = await fetch(url, {
                method: 'POST',
                body: options.data,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return {ok: response.ok, data: await response.json()};
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
            
            return {ok: response.ok, data: await response.json()};    
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
            let response = await fetch(`/api/report/sponsors?limit=${options.limit}&lang=${options.a11y.lang}`);

            return {ok: response.ok, data: await response.json()};
        } catch(error) {
            console.log(`[ERROR] getSponsors: ${error}`);
        }
    } // end getSponsors

    async registerSponsor(options: any = {data: undefined}) {            
        try {
            if(options.data === undefined)
                throw new Error('registerSponsor data undefined');
        
            let response = await fetch(`/api/secure/registration`, {
                method: "POST",
                body: options.data,
                headers: {
                    "content-type": "application/json"
                }
            });
            
            return {ok: response.ok, data: await response.json()};
        } catch(error) {
            console.log(`[ERROR] registerSponsor: ${error}`);
        }
    } // end registerSponsor
} // end AppServices

export {AppServices, AppServices as default};