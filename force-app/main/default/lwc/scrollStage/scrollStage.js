import { LightningElement, track } from 'lwc';

export default class ScrollStage extends LightningElement {
    @track scrollPercentage = 0;

    get progressStyle() {
        return `width: ${this.scrollPercentage}%;`;
    }

    connectedCallback() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    disconnectedCallback() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        
        this.scrollPercentage = Math.min(100, Math.max(0, scrolled));
    }
}
