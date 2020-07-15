import {FormStateModel} from "./form";

class AnimalModel {
    public name: string='';
    public description: string='';
    public image = {'content': '', 'contenttype': ''};
    public endangered: boolean = false;
    public sponsors: Array<string> = [];
}

class AnimalStateModel {
    public id: string='0';
    public message: string='';
    public animal: AnimalModel;
    public sponsor: string='';
    public pageTitle: string='New Animal';
    public form: FormStateModel;

    constructor(id: string) {
        this.id = id;
        this.animal = new AnimalModel(); 
        this.form = new FormStateModel();       
    }
}

export {AnimalStateModel as default, AnimalStateModel, AnimalModel};