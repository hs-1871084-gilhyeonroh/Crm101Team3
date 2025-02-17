import { LightningElement, track, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import PRODUCT_MESSAGE from '@salesforce/messageChannel/ProductMessageChannel__c';
import getProductsByAccount from '@salesforce/apex/ProductFetcher.getProductsByAccount';
import { NavigationMixin } from 'lightning/navigation';

export default class ProductList extends NavigationMixin(LightningElement) {
    @track accountId = '';
    @track products = [];
    @track selectedProductId = '';
    @track selectedProductName = '';
    @track selectedProductCategory = '';
    @track showContent = true;  // ✅ 페이드 아웃 효과 추가

    @wire(MessageContext) messageContext;

    connectedCallback() {
        const params = new URLSearchParams(window.location.search);
        this.accountId = params.get('accountId') || ''; 
        console.log('🔹 Extracted Account ID:', this.accountId);

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
                    category: item.category,  
                    totalQuantity: item.totalQuantity,
                    totalRevenue: item.totalRevenue
                }));
                console.log('✅ Loaded Products:', this.products);
            }
        } catch (error) {
            console.error('❌ Error fetching products:', error);
        }
    }

    handleProductSelection(event) {
        const selectedId = event.currentTarget.dataset.id;
        this.selectedProductId = selectedId;
        const selectedProduct = this.products.find(product => product.id === selectedId);
        this.selectedProductName = selectedProduct?.name || '';
        this.selectedProductCategory = selectedProduct?.category || '';

        // ✅ 선택된 제품 카드 강조 (CSS 적용)
        this.template.querySelectorAll('.product-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');

        console.log('🔹 Selected Product:', this.selectedProductName);
        console.log('🔹 Selected Product Category:', this.selectedProductCategory);

        // ✅ sessionStorage에 저장
        sessionStorage.setItem('accountId', this.accountId);
        sessionStorage.setItem('productId', this.selectedProductId);
        sessionStorage.setItem('productName', this.selectedProductName);
        sessionStorage.setItem('productCategory', this.selectedProductCategory);

        // ✅ LMS 메시지 발행
        const message = {
            accountId: this.accountId,
            productId: this.selectedProductId,
            productName: this.selectedProductName,
            productCategory: this.selectedProductCategory  
        };

        publish(this.messageContext, PRODUCT_MESSAGE, message);
    }

    navigateToKnowledgeSearch() {
        if (!this.selectedProductId) {
            alert('🚨 먼저 제품을 선택하세요!');
            return;
        }

        console.log('🔹 Applying fade-out effect...');
        this.showContent = false;

        // ✅ 0.5초 후 페이지 이동
        setTimeout(() => {
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: `/knowledge-search`
                }
            });
        }, 500);
    }
}
