import { LightningElement, track } from 'lwc';
import getKnowledgeByProductAndSearch from '@salesforce/apex/ProductKnowledgeFetcher.getKnowledgeByProductAndSearch';

export default class KnowledgeSearch extends LightningElement {
    @track accountId = ''; 
    @track selectedProductName = '';
    @track selectedProductCategory = '';
    @track knowledgeArticles = [];
    @track selectedKnowledge = null;

    connectedCallback() {
        // 🔹 `sessionStorage`에서 데이터 불러오기
        this.loadSessionData();
        console.log('🔹 Loaded from sessionStorage:', this.selectedProductCategory);

        if (this.selectedProductCategory) {
            this.loadKnowledgeArticles();
        }
    }

    /** 🔹 `sessionStorage`에서 값 불러오는 함수 */
    loadSessionData() {
        this.accountId = sessionStorage.getItem('accountId') || '';
        this.selectedProductName = sessionStorage.getItem('productName') || '';
        this.selectedProductCategory = sessionStorage.getItem('productCategory') || '';
    }

    /** 🔹 Knowledge 데이터 가져오기 */
    async loadKnowledgeArticles() {
        console.log('🔹 Calling Apex with:', this.selectedProductCategory);

        if (!this.selectedProductCategory) {
            console.warn('🚨 No category provided. Skipping Apex call.');
            this.knowledgeArticles = [];
            return;
        }

        try {
            const data = await getKnowledgeByProductAndSearch({ productName: this.selectedProductCategory });

            if (data && data.length > 0) {
                console.log('✅ Apex Response:', data);
                this.knowledgeArticles = data.map(article => ({
                    id: article.Id,
                    title: article.Title,
                    url: '/knowledge/' + article.UrlName,
                    summary: article.Summary,
                    question: article.Question__c || '❓ 질문이 없습니다.',
                    answer: article.Answer__c || '💡 답변이 없습니다.'
                }));
            } else {
                this.knowledgeArticles = [];
                console.warn('⚠️ No Knowledge Articles Found.');
            }
        } catch (error) {
            console.error('❌ Error fetching knowledge:', error);
            this.knowledgeArticles = [];
        }
    }

    /** 🔹 Knowledge 문서 선택 이벤트 */
    handleKnowledgeSelection(event) {
        const selectedId = event.currentTarget.dataset.id;
        this.selectedKnowledge = this.knowledgeArticles.find(article => article.id === selectedId);

        // 🔹 선택된 카드 강조 (CSS 적용)
        this.template.querySelectorAll('.knowledge-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');

        console.log('🔹 Selected Knowledge:', this.selectedKnowledge);
    }
}
