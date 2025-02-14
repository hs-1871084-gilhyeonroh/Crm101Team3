public without sharing class ProductKnowledgeFetcher {
    @AuraEnabled(cacheable=true)
    public static List<Knowledge__kav> getKnowledgeByProductAndSearch(String productName) {
        // 디버깅 로그 추가
        System.debug(':작은_파란색_다이아몬드: Product Name (Category): ' + productName);
        System.debug(':작은_파란색_다이아몬드: Search Term: ');
        // 기본 SOQL 쿼리
        String queryString = 'SELECT Id, Title, UrlName, Summary, Question__c, Answer__c FROM Knowledge__kav WHERE PublishStatus = \'Online\'';
        // 제품 카테고리를 기반으로 Knowledge 문서 필터링
        if (productName != null && productName.trim() != '') {
            queryString += ' AND Title LIKE \'%' + productName + '%\'';
        }
        
        queryString += ' ORDER BY Title ASC';
        System.debug(':작은_파란색_다이아몬드: Final Query: ' + queryString);
        // SOQL 실행 및 결과 반환
        List<Knowledge__kav> result = Database.query(queryString);
        System.debug(':작은_파란색_다이아몬드: Query Result: ' + result);
        return result;
    }
}