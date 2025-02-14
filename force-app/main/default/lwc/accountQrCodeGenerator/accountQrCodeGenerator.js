import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AccountQrCodeGenerator extends LightningElement {
    @api accountId;  // 외부에서 전달된 Account ID

    qrCodeUrl;  // QR 코드 이미지 URL 저장

    accountId='001WU00000huuEsYAI';

    connectedCallback() {
        if (this.accountId) {
            this.generateQRCode();
        } else {
            this.showErrorToast();
        }
    }

    // QR 코드 생성
    generateQRCode() {
        const baseUrl = 'https://yourcommunity.force.com/yourpage';  // Experience Cloud URL
        const qrCodeUrl = `${baseUrl}?accountId=${this.accountId}`;
        qrCodeUrl="https://www.naver.com/";

        // Google Chart API로 QR 코드 이미지 URL 생성
        this.qrCodeUrl = `https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${encodeURIComponent(qrCodeUrl)}`;
    }

    // 오류 발생 시 Toast 메시지 출력
    showErrorToast() {
        const evt = new ShowToastEvent({
            title: "Error",
            message: "Account ID is missing!",
            variant: "error"
        });
        this.dispatchEvent(evt);
    }
}
