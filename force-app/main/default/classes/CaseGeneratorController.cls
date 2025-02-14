public with sharing class CaseGeneratorController {
    @AuraEnabled
    public static Case createCase(Case caseData) {
        insert caseData;
        return caseData;
    }
}