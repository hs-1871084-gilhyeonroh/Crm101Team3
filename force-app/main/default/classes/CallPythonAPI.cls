public class CallPythonAPI {
    @future(callout=true) // 비동기 Callout (Salesforce는 외부 서버 호출 시 비동기가 필요함)
    public static void sendRequestToPython(Decimal inputValue) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        
        // 🔹 여기에 Colab에서 받은 ngrok 주소를 넣어야 해!
        request.setEndpoint('https://b027-34-16-131-34.ngrok-free.app/do_math');
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json');
        
        // 🔹 Salesforce에서 Python 서버로 보낼 데이터 (JSON 형태)
        String jsonBody = '{"number": ' + inputValue + '}';
        request.setBody(jsonBody);

        HttpResponse response = http.send(request);
        System.debug('🔥 Python 서버 응답: ' + response.getBody()); // 응답 확인!
    }
}
