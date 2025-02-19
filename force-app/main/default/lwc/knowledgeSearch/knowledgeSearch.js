import { LightningElement, track, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import PRODUCT_MESSAGE from '@salesforce/messageChannel/ProductMessageChannel__c';
import getKnowledgeByProductAndSearch from '@salesforce/apex/ProductKnowledgeFetcher.getKnowledgeByProductAndSearch';

export default class KnowledgeSearch extends LightningElement {
    @track selectedProductName = '';
    @track selectedProductCategory = '';
    @track selectedProductId = '';
    @track knowledgeArticles = [];
    @track selectedKnowledge = null;

    @wire(MessageContext) messageContext;

    connectedCallback() {
        this.subscription = subscribe(this.messageContext, PRODUCT_MESSAGE, (message) => {
            if (this.selectedProductCategory !== message.productCategory) {
                this.selectedKnowledge = null;
            }

            this.selectedProductId = message.productId;
            this.selectedProductName = message.productName;
            this.selectedProductCategory = message.productCategory;
            console.log('🔹 Received Product in KnowledgeSearch:', this.selectedProductName);

            this.loadKnowledgeArticles();
        });
    }

    /** 🔹 Knowledge 데이터 가져오기 */
    async loadKnowledgeArticles() {
        console.log('🔹 Fetching Knowledge for:', this.selectedProductCategory);
        if (!this.selectedProductCategory) {
            this.knowledgeArticles = [];
            return;
        }

        try {
            const data = await getKnowledgeByProductAndSearch({ productName: this.selectedProductCategory });

            if (data && data.length > 0) {
                console.log('✅ Knowledge Data:', data);
                this.knowledgeArticles = data.map(article => ({
                    id: article.Id,
                    title: article.Title,
                    summary: article.Summary,
                    question: article.Question__c || '❓ 질문이 없습니다.',
                    answer: article.Answer__c || '💡 답변이 없습니다.',
                    expanded: false,
                    answerClass: 'faq-answer-container' // 🔽 기본적으로 숨김 상태
                }));
            } else {
                this.knowledgeArticles = [];
            }
        } catch (error) {
            console.error('❌ Error fetching knowledge:', error);
            this.knowledgeArticles = [];
        }
    }

    /** 🔹 FAQ 질문 클릭 시 부드럽게 펼치기/닫기 */
    toggleKnowledge(event) {
        const selectedId = event.currentTarget.dataset.id;
        this.knowledgeArticles = this.knowledgeArticles.map(article => ({
            ...article,
            expanded: article.id === selectedId ? !article.expanded : false,
            answerClass: article.id === selectedId
                ? (article.expanded ? 'faq-answer-container' : 'faq-answer-container show')
                : 'faq-answer-container'
        }));

        setTimeout(() => {
            this.knowledgeArticles = [...this.knowledgeArticles];
        }, 10);
    }
}
