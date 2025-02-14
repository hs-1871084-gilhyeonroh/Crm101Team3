import { LightningElement, track, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import PRODUCT_MESSAGE from '@salesforce/messageChannel/ProductMessageChannel__c';
import getProductsByAccount from '@salesforce/apex/ProductFetcher.getProductsByAccount';

export default class ProductList extends LightningElement {
    @track accountId = '';
    @track products = [];
    @track selectedProductId = '';
    @track selectedProductName = '';
    @track selectedProductCategory = '';

    @wire(MessageContext) messageContext;

    connectedCallback() {
        const params = new URLSearchParams(window.location.search);
        this.accountId = params.get('accountId') || ''; 
        console.log('Extracted Account ID:', this.accountId);

        if (this.accountId) {
            this.loadProducts();
        }
    }

    async loadProducts() {
        try {
            const data = await getProductsByAccount({ accountId: this.accountId });
            if (data) {
                this.products = data.map(item => ({
                    id: item.productId,
                    name: item.name,
                    category: item.category,  // ✅ 카테고리 포함
                    totalQuantity: item.totalQuantity,
                    totalRevenue: item.totalRevenue
                }));
                console.log('Loaded Products:', this.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    handleProductSelection(event) {
        this.selectedProductId = event.target.value;
        const selectedProduct = this.products.find(product => product.id === this.selectedProductId);
        this.selectedProductName = selectedProduct?.name || '';
        this.selectedProductCategory = selectedProduct?.category || '';
        
        console.log('Selected Product:', this.selectedProductName);
        console.log('Selected Product Category:', this.selectedProductCategory);

        // LMS 메시지 발행
        const message = {
            productId: this.selectedProductId,
            productName: this.selectedProductName,
            productCategory: this.selectedProductCategory  // ✅ 카테고리 추가
        };

        publish(this.messageContext, PRODUCT_MESSAGE, message);
    }
}
