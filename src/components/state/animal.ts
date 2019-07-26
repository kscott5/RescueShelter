class AnimalModel {
    public name: string='';
    public description: string='';
    public imageSrc: string='';
    public endangered: boolean = false;
    public sponsors: Array<string> = [];
}

class AnimalStateModel {
    public id: string='0';
    public message: string='';
    public animal: AnimalModel;
    public sponsor: string='';
    public pageTitle: string='New Animal';
    constructor(id: string) {

        this.id = id;
        this.animal = new AnimalModel();
    }
}

export {AnimalStateModel as default, AnimalStateModel, AnimalModel};