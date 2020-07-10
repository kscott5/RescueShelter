class FormStateModel {
    private cssText = 'editable';
    public textCss(): string {
        return this.cssText;
    }

    private cssCheckbox = 'editable';
    public checkboxCss() : string {
        return this.cssCheckbox;
    }
    
    private cssButton: string = 'editable';
    public get buttonCss() : string {
        return this.cssButton;
    }

    private cssDisplay: string = 'hidden';
    public get displayCss() : string {
        return this.cssDisplay;
    }

    constructor() {
        this.toggleEditable(true);
    }

    toggleDisplay() {
        this.cssDisplay = (this.cssDisplay == 'hidden')? 'visible' : 'hidden';
    }

    toggleEditable(editable: boolean) {
        this.cssText = (editable)? 'editable': 'disabled';
        this.cssCheckbox = (editable)? 'editable': 'disabled';
        this.cssButton = (editable)? 'editable': 'disabled';    
    }
}

export { FormStateModel as default, FormStateModel}; 