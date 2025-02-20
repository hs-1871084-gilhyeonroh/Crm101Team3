import { LightningElement, track, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import PRODUCT_MESSAGE from '@salesforce/messageChannel/ProductMessageChannel__c';

export default class ScrollStage extends LightningElement {
    @track scrollPercentage = 0;
    subscription = null;

    @wire(MessageContext) messageContext;

    get progressStyle() {
        return `width: ${this.scrollPercentage}%;`;
    }

    connectedCallback() {
        // window.addEventListener('scroll', this.handleScroll.bind(this));

        setTimeout(() => {
            this.updateProgressBar(33);
        }, 4000); // 1000ms = 1초
        this.subscription = subscribe(this.messageContext, PRODUCT_MESSAGE, (message) => {
            setTimeout(() => {
                this.updateProgressBar(message.progressValue);
            }, 1000);
        });

        
    }

    disconnectedCallback() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    updateProgressBar(value) {
        if (value > this.scrollPercentage) {
            this.scrollPercentage = value;
        }
    }

    // disconnectedCallback() {
    //     window.removeEventListener('scroll', this.handleScroll.bind(this));
    // }

    // handleScroll() {
    //     const scrollTop = window.scrollY;
    //     const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    //     const scrolled = (scrollTop / docHeight) * 100;
        
    //     this.scrollPercentage = Math.min(100, Math.max(0, scrolled));
    // }
}
