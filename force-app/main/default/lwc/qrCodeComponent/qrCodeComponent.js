import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import qrResource from '@salesforce/resourceUrl/QRJS'; // QRJS는 ZIP 파일을 가리킴

export default class QRCodeComponent extends LightningElement {
    @api recordId;
    qrCodeUrl;

    connectedCallback() {
        this.loadQRCodeJS();
    }

    loadQRCodeJS() {
        // QRJS.zip 내 QRCode.js 파일을 로드
        loadScript(this, qrResource + '/qrcode.js') // QRJS/QRCode.js 경로로 파일 로드
            .then(() => {
                this.generateQRCode();
            })
            .catch(error => {
                console.error('Error loading QRCode.js', error);
            });
    }

    generateQRCode() {
        const qrCodeContainer = this.template.querySelector('.qrcode');
        if (qrCodeContainer) {
            new window.QRCode(qrCodeContainer, {
                text: `https://crm101-2a-dev-ed.develop.my.site.com/gps/s/?accountId=${this.recordId}`,
                width: 128,
                height: 128,
            });
        }
    }
}
