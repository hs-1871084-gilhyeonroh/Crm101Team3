import { LightningElement, track } from 'lwc';

export default class FloatingButton extends LightningElement {
    @track isModalOpen = false;
    @track accountId = '';
    @track retURL = 'https://your-experience-cloud.com/thank-you';

    // 🔹 세션에서 accountId 불러오기
    connectedCallback() {
        this.loadSessionData();
        console.log('🔹 Loaded Account ID from sessionStorage:', this.accountId);
    }

    /** 🔹 sessionStorage에서 `accountId` 가져오기 */
    loadSessionData() {
        this.accountId = sessionStorage.getItem('accountId') || '';
    }

    // 🔹 모달 열기
    openModal() {
        this.isModalOpen = true;
    }

    // 🔹 모달 닫기
    closeModal() {
        this.isModalOpen = false;
    }
}
