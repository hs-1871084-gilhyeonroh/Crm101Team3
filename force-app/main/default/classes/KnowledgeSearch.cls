public without sharing class KnowledgeSearch {
    @AuraEnabled(cacheable=true)
    public static List<Knowledge__kav> searchKnowledge(String searchTerm) {
        String queryString = 'SELECT Id, Title, UrlName, Summary FROM Knowledge__kav WHERE PublishStatus = \'Online\'';
        
        if (searchTerm != null && searchTerm.trim() != '') {
            queryString += ' AND (Title LIKE \'%' + searchTerm + '%\' OR Summary LIKE \'%' + searchTerm + '%\')';
        }
        
        queryString += ' ORDER BY Title ASC';
        return Database.query(queryString);
    }
}
