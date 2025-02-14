public without sharing class AccountCaseController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getCasesByAccountId(Id accountId) {
        // Account와 연관된 Case들을 쿼리합니다.
        return [SELECT Status FROM Case WHERE AccountId = :accountId];
    }
//     return [SELECT Id, CaseNumber, Status, Subject, Priority FROM Case WHERE AccountId = :accountId];
// }
}