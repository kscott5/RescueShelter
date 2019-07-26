class SponsorModel {
    public firstname: string = '';
    public lastname: string  = '';
    public useremail: string = '';
    public password: string = '';
    public questioins: any = [];    
    constructor(){}
}

class SponsorStateModel {
    public hashid: string = '';
    public message: string = '';
    public sponsor: SponsorModel;
    public matchSuccess: string = '';
    public uniqueSuccess: string = '';
    public confirmPassword: string = '';
    public pageTitle: string = 'New Sponsor';
    constructor() {
        this.sponsor = new SponsorModel();
    }
}

export {SponsorStateModel as default, SponsorStateModel, SponsorModel};