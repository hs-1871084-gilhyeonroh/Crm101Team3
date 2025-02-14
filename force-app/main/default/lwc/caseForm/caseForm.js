import { LightningElement, track } from 'lwc';

export default class WebToCaseForm extends LightningElement {
    @track accountId = '';

    connectedCallback() {
        const params = new URLSearchParams(window.location.search);
        this.accountId = params.get('accountId') || '';
        console.log(this.accountId);
    }
}
