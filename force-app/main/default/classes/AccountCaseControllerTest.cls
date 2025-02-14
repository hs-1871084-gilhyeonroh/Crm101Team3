@isTest
private class AccountCaseControllerTest {
    @isTest
    static void testGetCasesByAccountId() {
        // 테스트용 Account 생성
        Account testAccount = new Account(Name='Test Account');
        insert testAccount;

        // 테스트용 Case 생성
        Case testCase = new Case(Subject='Test Case', AccountId=testAccount.Id, Status='New');
        insert testCase;

        // Apex 메서드 호출
        Test.startTest();
        List<Case> cases = AccountCaseController.getCasesByAccountId(testAccount.Id);
        Test.stopTest();

        // 검증 (Assert)
        System.assertNotEquals(0, cases.size(), 'Case 목록이 비어 있으면 안 됩니다.');
    }
}
