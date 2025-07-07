public with sharing class weatherAppController {
    
    @AuraEnabled
    public static string getWeatherDetails(String input) {
        // Encode the input to handle spaces and special characters
        String encodedInput = EncodingUtil.urlEncode(input, 'UTF-8');
        String url = 'https://api.openweathermap.org/data/2.5/weather?q=' + encodedInput + '&units=metric' + getKey();
        String response = getResponse(url);

        return response;
    }
    public static string getKey(){
        string key = '97c9cd38d9c616c4677df3193ab398b3';
        string output = '&appid=' + key;

        return output;
    }
    public static string getResponse(String strUrl){
        String output;
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        HttpResponse response = new HttpResponse();
        request.setEndpoint(strUrl);
        request.setMethod('GET');
        request.setTimeout(12000);
        response = http.send(request);
        if(response.getStatusCode() == 200){
            output = response.getBody();
        }
        return output;
    }
}