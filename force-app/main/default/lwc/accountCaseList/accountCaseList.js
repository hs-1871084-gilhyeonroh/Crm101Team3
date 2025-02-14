import { LightningElement, wire } from 'lwc';
import getCasesByAccountId from '@salesforce/apex/AccountCaseController.getCasesByAccountId';
import { CurrentPageReference } from 'lightning/navigation';

export default class AccountCaseList extends LightningElement {
    accountId; // Account ID를 저장할 변수
    cases; // Case 데이터
    error; // 오류 메시지

    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        if (currentPageReference) {
            const params = currentPageReference.state;
            if (params.accountId) {
                this.accountId = params.accountId; // URL에서 accountId 추출
            }
        }
    }

    @wire(getCasesByAccountId, { accountId: '$accountId' })
    wiredCases({ error, data }) {
        if (data) {
            this.cases = data;
            this.error = undefined;
        } else if (error) {
            this.error = error.body.message;
            this.cases = undefined;
        }
    }
}
