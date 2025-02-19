import { LightningElement, track } from 'lwc';

export default class FaqComponent extends LightningElement {
    @track faqList = [
        { 
            id: '1', 
            question: '아이스크림 등을 인터넷 쇼핑몰에서 냉동제품을 구입했는데, 제품에서 알싸한 맛이 나요.', 
            answer: '냉동 보관 중 온도 변화로 인해 제품의 맛이 달라질 수 있습니다. 가급적 빠른 시간 내 섭취를 권장합니다.', 
            expanded: false 
        },
        { 
            id: '2', 
            question: '유아식 액상분유를 어떻게 데워 이용하면 되나요?', 
            answer: '뜨거운 물에 용기를 넣어 2~3분간 가열 후, 적당한 온도로 식혀서 아기에게 먹이시면 됩니다.', 
            expanded: false 
        },
        { 
            id: '3', 
            question: '까망베르 치즈를 처음 샀는데, 치즈 겉면에 하얀 껍질을 벗겨내고 먹는 건가요?', 
            answer: '까망베르 치즈의 흰 곰팡이 부분은 먹을 수 있으며, 치즈의 풍미를 더욱 높여줍니다.', 
            expanded: false 
        }
    ];

    // 🔹 질문 클릭 시 답변 열기/닫기
    toggleAnswer(event) {
        const faqId = event.currentTarget.dataset.id;
        this.faqList = this.faqList.map(faq => ({
            ...faq,
            expanded: faq.id === faqId ? !faq.expanded : false // 선택한 항목만 열고 나머지는 닫기
        }));
    }
}
