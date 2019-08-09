class FormStateModel {
    public textCss: string = 'editable';
    public checkboxCss: string = 'editable';
    public buttonCss: string = 'editable';

    constructor() {
        this.updateState(true);
    }

    updateState(editable: boolean) {
        this.textCss = (editable)? 'editable': 'disabled';
        this.checkboxCss = (editable)? 'editable': 'disabled';
        this.buttonCss = (editable)? 'editable': 'disabled';    
    }
}

export { FormStateModel as default, FormStateModel};