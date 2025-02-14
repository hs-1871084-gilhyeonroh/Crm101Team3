import { LightningElement, api } from 'lwc';

export default class AccountQrCode extends LightningElement {
    @api recordId;  // Account 레코드 ID
    

    get qrCodeUrl() {
        console.log(this.recordId);
        return `https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://crm101-2a-dev-ed.develop.my.site.com/gps/s/?accountId=${this.recordId}`;
    }
}
