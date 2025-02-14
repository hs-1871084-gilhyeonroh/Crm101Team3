import { LightningElement, track, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import PRODUCT_MESSAGE from '@salesforce/messageChannel/ProductMessageChannel__c';
import getKnowledgeByProductAndSearch from '@salesforce/apex/ProductKnowledgeFetcher.getKnowledgeByProductAndSearch';

export default class KnowledgeSearch extends LightningElement {
    @track selectedProductName = '';
    @track selectedProductCategory = '';
    @track knowledgeArticles = [];
    @track selectedKnowledge = null; // 선택한 Knowledge 문서

    @wire(MessageContext) messageContext;

    connectedCallback() {

        
        this.subscription = subscribe(this.messageContext, PRODUCT_MESSAGE, (message) => {

            if (this.selectedProductCategory !== message.productCategory) {
                this.selectedKnowledge = null; // ✅ 선택된 Knowledge 문서 초기화
            }
            
            this.selectedProductName = message.productName;
            this.selectedProductCategory = message.productCategory;
            console.log('🔹 Received Product in KnowledgeSearch:', this.selectedProductName);
            console.log('🔹 Received Category in KnowledgeSearch:', this.selectedProductCategory);

            // 제품 선택 후 데이터 로드
            this.loadKnowledgeArticles();
        });
    }

    async loadKnowledgeArticles() {
        console.log('🔹 Calling Apex with:', this.selectedProductCategory);

        if (!this.selectedProductCategory) {
            console.warn('🚨 No category provided. Skipping Apex call.');
            this.knowledgeArticles = [];
            return;
        }

        try {
            const data = await getKnowledgeByProductAndSearch({
                productName: this.selectedProductCategory
            });

            if (data) {
                console.log('✅ Apex Response:', data);
                this.knowledgeArticles = data.map(article => ({
                    id: article.Id,
                    title: article.Title,
                    url: '/knowledge/' + article.UrlName,
                    summary: article.Summary,
                    question: article.Question__c || '질문이 없습니다.', // ✅ null 값 처리
                    answer: article.Answer__c || '답변이 없습니다.' // ✅ null 값 처리
                }));
            } else {
                this.knowledgeArticles = [];
            }
        } catch (error) {
            console.error('❌ Error fetching knowledge:', error);
            this.knowledgeArticles = [];
        }
    }

    handleKnowledgeSelection(event) {
        const selectedId = event.target.value;
        this.selectedKnowledge = this.knowledgeArticles.find(article => article.id === selectedId);
        console.log('🔹 Selected Knowledge:', this.selectedKnowledge);
    }
}
