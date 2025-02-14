import { LightningElement, wire } from 'lwc';
import createCase from '@salesforce/apex/CaseGeneratorController.createCase';
import { CurrentPageReference } from 'lightning/navigation';

export default class CaseForm extends LightningElement {
    recordId;
    caseRecord = { 
        Subject: '', 
        Description: '', 
        Status: 'New', 
        Origin: 'Web', 
        IsClosedOnCreate: true, 
        AccountId: '',
        Reason: 'Other' // 기본값 설정
        //Reason: 'Others' // 기본값 설정
    };

    // Reason picklist 값들
    reasonOptions = [
        { label: 'Installation', value: 'Installation' },
        { label: 'Equipment Complexity', value: 'Equipment Complexity' },
        { label: 'Performance', value: 'Performance' },
        { label: 'Breakdown', value: 'Breakdown' },
        { label: 'Equipment Design', value: 'Equipment Design' },
        { label: 'Feedback', value: 'Feedback' },
        { label: 'Other', value: 'Other' }
    ];

    // reasonOptions = [
    //     { label: '기기파손', value: 'Damaged' },
    //     { label: '오작동', value: 'Malfunction' },
    //     { label: '작동안함', value: 'Failure' },
    //     { label: '기타', value: 'Others' },
    //     { label: '누수', value: 'Leakage' }
    // ];

    // URL에서 accountId 가져오기
    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        if (currentPageReference) {
            const params = currentPageReference.state;
            if (params.accountId) {
                this.recordId = params.accountId;
                this.updateAccountId(); // accountId가 변경될 때마다 caseRecord 업데이트
            }
        }
    }

    connectedCallback() {
        if (this.recordId) {
            this.updateAccountId(); // 컴포넌트가 연결될 때 recordId가 있을 경우 업데이트
        }
    }

    updateAccountId() {
        this.caseRecord = { ...this.caseRecord, AccountId: this.recordId };
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.caseRecord = { ...this.caseRecord, [name]: value };
    }

    handleSubmit() {
        createCase({ caseData: this.caseRecord }) // caseRecord 객체 그대로 전달
            .then(result => {
                alert('Case Created! Case Number: ' + result.CaseNumber);
            })
            .catch(error => {
                alert('Error: ' + (error.body ? error.body.message : error.message));
            });
    }
}
