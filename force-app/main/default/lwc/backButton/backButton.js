import { LightningElement } from 'lwc';

export default class BackButton extends LightningElement {
    goBack() {
        window.history.back();
    }
}