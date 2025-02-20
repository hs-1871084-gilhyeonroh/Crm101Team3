import { LightningElement, track } from 'lwc';

export default class ButtonType extends LightningElement {
    @track productSelectHidden=true;
    @track generalSelectHidden=true;
    @track selectHidden=false;
    @track generalQuestion=true;

    connectedCallback(){
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
    }

    productButtonClick() {
        this.selectHidden=true;
        this.productSelectHidden=false;
        document.body.style.overflow = 'auto'; 
        document.body.style.position = ''; 
    }

    generalButtonClick() {
        this.selectHidden=true;
        this.generalSelectHidden=false;
        this.template.querySelector('c-knowledge-search').setGeneralQuestion(this.generalQuestion);
    }
}