<?php
                                                                              // LIVE Credentials                                                      //   Developer credentials (Rein)
$url =   "https://api.paypal.com";                                  //   "https://api.paypal.com"; //                                          // "https://api.sandbox.paypal.com";
$client_id = "Ac8ouxA4lTiipnTNMe6bTV4eoYR0U4PyjhK32SRysCOX214Rjwheui1NOL-L";  // "Ac8ouxA4lTiipnTNMe6bTV4eoYR0U4PyjhK32SRysCOX214Rjwheui1NOL-L"; //      //"ARPaLRBg3dT_brzgpIQGQX7NaZWo6ZONDb-8L2lOrrleFPf18dMxevyNSzGX";
$secret =  "EKwp9RDkdlhupcpJEpNBH3kWoZKlfUH-6B8EETrwBym2KdkOkTQYA6EofdW8";    //"EKwp9RDkdlhupcpJEpNBH3kWoZKlfUH-6B8EETrwBym2KdkOkTQYA6EofdW8";  //      // "EF4IORAhX3ReOjoXZiA2FedNo7hykLADcUn1m4X9YcRj202AlW_RzCUOeiQA";
$token = NULL; // paypal token



function getPaypalAccessToken(){
    // TODO: store token to file for re-use
    //    { "scope": "...", "access_token":"{accessToken}", "token_type":"Bearer", "app_id":"...", "expires_in":28800 }
    global $token;
    if ($token) return $token;
    else {
        try {
            $tr = paypalAccessTokenRequest();
            $token = json_decode($tr,true);
            return $token;
        } catch (Exception $e) {
            throw new RemoteErrorException($e);
        }
    }
}


function getPaypalInvoice($invoiceID) {
    global $token,$log;
    try {
        $token = getPaypalAccessToken();
        $tr = paypalGetInvoice($token,$invoiceID);
        $log->LogDebug("returned from get paypal invoice: ".$tr);
        return json_decode($tr,true);
    } catch (BadRequestException $e) {
        $log->LogDebug("this should be BadRequestException");
        throw $e;
    } catch (Exception $e) {
              throw $e;
    }
}

function deletePaypalDraft($invoiceID) {
    global $log;
    $log->LogDebug("attempting to delete paypal draft: ".$invoiceID);
    try {
        $token = getPaypalAccessToken();
        $tr = paypalGetInvoice($token,$invoiceID);
        return json_decode($tr,true);
    } catch (Exception $e) { throw new RemoteErrorException($e); }
}

function sendPaypalInvoice($invoiceID) {
    global $log;
    $log->LogDebug("attempting to send paypal invoice: ".$invoiceID);
    try {
        $token = getPaypalAccessToken();
        $tr = sendPaypalInvoiceRequest($token,$invoiceID);
        return json_decode($tr,true);
    } catch (Exception $e) { throw new RemoteErrorException($e); }

}

function createPayPalDraft($jsondraft){
    // { ... "access_token": "{accessToken}" ... }
    global $log;
    try {
        $token = getPaypalAccessToken();
        $log->LogDebug("token is what? ".json_encode($token));
        $tr = paypalCreateDraftRequest($token,$jsondraft);
        return json_decode($tr,true);
    } catch (Exception $e) {
        throw new RemoteErrorException($e);
    }

/*  draft:   {
              "id": "INV2-RUVR-ADWQ-H89Y-ABCD",
              "number": "ABCD4971",
              "status": "DRAFT",
              "merchant_info": {},
              "billing_info": [{"email": "email@example.com"}],
              "items": [ { "name": "Sutures", "quantity": 100.0, "unit_price":{"currency":"USD", "value":"5.00" } } ],
              "invoice_date": "2014-02-27 PST",
              "payment_term": { "due_date": "2014-04-13 PDT" },
              "tax_calculated_after_discount": false,
              "tax_inclusive": false,
              "note": "",
              "total_amount": { "currency": "USD", "value": "500.00" }
            }
 */

}



function paypalAccessTokenRequest(){
    // TODO: store token to file for re-use
    global $url,$client_id,$secret,$log;
    $url =   "https://api.paypal.com";
    //$url = "https://api.sandbox.paypal.com"; //api.sandbox.paypal.com/v1/oauth2/token
    //$client_id = "ARPaLRBg3dT_brzgpIQGQX7NaZWo6ZONDb-8L2lOrrleFPf18dMxevyNSzGX";
    //$secret = "EF4IORAhX3ReOjoXZiA2FedNo7hykLADcUn1m4X9YcRj202AlW_RzCUOeiQA";
$client_id = "Ac8ouxA4lTiipnTNMe6bTV4eoYR0U4PyjhK32SRysCOX214Rjwheui1NOL-L";  // "Ac8ouxA4lTiipnTNMe6bTV4eoYR0U4PyjhK32SRysCOX214Rjwheui1NOL-L"; //      //"ARPaLRBg3dT_brzgpIQGQX7NaZWo6ZONDb-8L2lOrrleFPf18dMxevyNSzGX";
$secret =  "EKwp9RDkdlhupcpJEpNBH3kWoZKlfUH-6B8EETrwBym2KdkOkTQYA6EofdW8";    //"EKwp9RDkdlhupcpJEpNBH3kWoZKlfUH-6B8EETrwBym2KdkOkTQYA6EofdW8";  //      // "EF4IORAhX3ReOjoXZiA2FedNo7hykLADcUn1m4X9YcRj202AlW_RzCUOeiQA";

    $sUrl = "/v1/oauth2/token";
    $log->LogDebug("paypal endpoint: ".$url.$sUrl);
    $headers = array('Accept:application/json','Accept-Language:en_US');
    $fields_string = "grant_type=client_credentials";
    $ch = curl_init();
    $options = array (CURLOPT_RETURNTRANSFER => true, // return web page
        CURLOPT_FAILONERROR => true,
        CURLOPT_URL => $url.$sUrl,
        CURLOPT_HTTPAUTH => CURLAUTH_BASIC,           // basic auth
        CURLOPT_USERPWD => $client_id.":".$secret,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $fields_string,
        CURLOPT_HEADER => false,                      // don't return headers
        CURLOPT_SSL_VERIFYPEER => false,              // TODO: fix certificate provider list problem later
        CURLOPT_CONNECTTIMEOUT => 5,                  // timeout on connect
        CURLOPT_TIMEOUT => 10  );                      // timeout on response

    curl_setopt_array ( $ch, $options );
    try {
        $result=curl_exec( $ch );
        $log->LogDebug("token result: ".$result);
        //$header = curl_getinfo ( $ch );
        $err = curl_errno ( $ch );
        $errmsg = curl_error ( $ch );
        curl_close($ch);
        if ($errmsg) {
            throw new Exception($errmsg);
         }
        return $result;
    } catch (Exception $e) {  throw $e;  }
}


function paypalDeleteDraft($token,$invoiceID) {
    global $url,$token,$log;
      //  $url = "https://api.sandbox.paypal.com"; //api.sandbox.paypal.com/v1/oauth2/token
    $url =   "https://api.paypal.com";
    $sUrl = "/v1/invoices/".$invoiceID;
    $headers = array("Accept:application/json","Accept-Language:en_US')","Authorization: Bearer ".$token["access_token"]);
    $ch = curl_init();
    $options = array (CURLOPT_RETURNTRANSFER => true, // return web page
        CURLOPT_FAILONERROR => true,
        CURLOPT_URL => $url.$sUrl,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_CUSTOMREQUEST => "DELETE",
        CURLOPT_HEADER => false,                      // don't return headers
        CURLOPT_SSL_VERIFYPEER => false,              // TODO: fix certificate provider list problem later
        CURLOPT_CONNECTTIMEOUT => 4,                  // timeout on connect
        CURLOPT_TIMEOUT => 8  );                      // timeout on response

    curl_setopt_array ( $ch, $options );
    try {
        $result=curl_exec( $ch );
        $log->LogDebug("attempting to delete paypal draft: ".$invoiceID." with access token: ".$token["access_token"]);
        //$header = curl_getinfo ( $ch );
        $err = curl_errno ( $ch );
        $errmsg = curl_error ( $ch );
        curl_close($ch);
        if ($errmsg) throw new Exception($errmsg);
        return $result;
    } catch (Exception $e) {
        throw $e;
    }



}

function paypalGetInvoice($token,$invoiceID) {
    global $url,$token,$log;
    $log->LogDebug("paypalGetInvoice parameters supplied token:".$token["access_token"]." invoiceID:".$invoiceID);
     //   $url = "https://api.sandbox.paypal.com"; //api.sandbox.paypal.com/v1/oauth2/token
    $url =   "https://api.paypal.com";
    $sUrl = "/v1/invoicing/invoices/".$invoiceID;  //INV2-QUQX-A4V6-ECJM-33TD
    $log->LogDebug("paypalGetInvoice url: ".$url.$sUrl);
    $headers = array("Accept:application/json","Accept-Language:en_US","Authorization: Bearer ".$token["access_token"]);
    $ch = curl_init();
    $options = array (CURLOPT_RETURNTRANSFER => true, // return web page
        // CURLOPT_FAILONERROR => true,        // lose debug info from paypal
        CURLOPT_URL => $url.$sUrl,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HEADER => false,                      // don't return headers
        CURLOPT_SSL_VERIFYPEER => false,              // TODO: fix certificate provider list problem later
        CURLOPT_CONNECTTIMEOUT => 4,                  // timeout on connect
        CURLOPT_TIMEOUT => 8  );                      // timeout on response

    curl_setopt_array ( $ch, $options );
    try {
        $result=curl_exec( $ch );
        $log->LogDebug("raw result from paypalGetInvoice: ".$result);
        //$header = curl_getinfo ( $ch );
        $err = curl_errno ( $ch );
        $errmsg = curl_error ( $ch );
        $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $log->LogDebug("paypalGetInvoice http_status: ".$http_status);
        switch ($http_status) {
            case "404": throw new BadRequestException("could not find paypal invoice : ".$invoiceID." ... ".$result);
            case "500": throw new InternalFatalException("paypal returned fatal : ".$result);
        }
        curl_close($ch);
        if ($errmsg) throw new Exception($errmsg);
        return $result;
    } catch (BadRequestException $e) { throw $e; }
      catch (Exception $e) {  throw $e;  }
}


function paypalCreateDraftRequest($token,$jsondraft){
    global $url,$log;
    $log->LogDebug("access token: ".$token["access_token"]);
    //$url = "https://api.sandbox.paypal.com"; //api.sandbox.paypal.com/v1/oauth2/token
    $url =   "https://api.paypal.com";
    $sUrl = "/v1/invoicing/invoices";
    $log->LogDebug("paypalCreateDraftRequest url: ".$url.$sUrl);
    $log->LogDebug("json payload: ".$jsondraft);
    //$accept = "Accept:application/json";
    //$acceptlang = "Accept-Language:en_US";
    $contenttype = "Content-Type: application/json";
    $contentlen = "Content-Length: " . strlen($jsondraft);
    $authorization = "Authorization: Bearer ".$token["access_token"];
    $headers = array($contenttype,$contentlen,$authorization);
    $fields_string = $jsondraft;
    $ch = curl_init();
    $options = array (CURLOPT_RETURNTRANSFER => true, // return web page
        //CURLOPT_FAILONERROR => true,        // you will lose great debu info from papal
        CURLOPT_URL => $url.$sUrl,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => $fields_string,
        CURLOPT_HEADER => false,                      // don't return headers
        CURLOPT_SSL_VERIFYPEER => false,              // TODO: fix certificate provider list problem later
        CURLOPT_CONNECTTIMEOUT => 6,                  // timeout on connect
        CURLOPT_TIMEOUT => 10  );                      // timeout on response

    curl_setopt_array ( $ch, $options );
    //echo $fields_string;
    global $log;
    $log->LogDebug("headers: ".json_encode($headers));
    try {
        $result=curl_exec( $ch );
        $log->LogDebug("paypalCreateDraft result: ".$result);
        //$header = curl_getinfo ( $ch );
        $err = curl_errno ( $ch );
        $errmsg = curl_error ( $ch );
        $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($errmsg) {
            $log->LogError("error in paypalCreateDraft: ".$errmsg);
            throw new Exception($errmsg);
        }
        $log->LogDebug("paypal http status: ".$http_status);
        switch ($http_status) {
            case "400": throw new BadRequestException("paypal package malformed : ".$result);
            case "500": throw new InternalFatalException("paypal returned fatal : ".$result);
        }
        $log->LogDebug("returned from paypal: ".$result);
        return $result;
     } catch (Exception $e) {  throw $e;  }

}


function sendPaypalInvoiceRequest($token,$ppid){
    global $url,$log;
    $log->LogDebug("access token: ".$token["access_token"]);
    //$url = "https://api.sandbox.paypal.com"; //api.sandbox.paypal.com/v1/oauth2/token
    $url =   "https://api.paypal.com";
    $sUrl = "/v1/invoicing/invoices/".$ppid."/send";
    $log->LogDebug("paypalCreateDraftRequest url: ".$url.$sUrl);
    $log->LogDebug("json payload: ".$jsondraft);
    //$accept = "Accept:application/json";
    //$acceptlang = "Accept-Language:en_US";
    $contenttype = "Content-Type: application/json";
    $contentlen = "Content-Length: " . strlen($jsondraft);
    $authorization = "Authorization: Bearer ".$token["access_token"];
    $headers = array($contenttype,$contentlen,$authorization);
    //$fields_string = $jsondraft;
    $ch = curl_init();
    $options = array (CURLOPT_RETURNTRANSFER => true, // return web page
        //CURLOPT_FAILONERROR => true,        // you will lose great debu info from papal
        CURLOPT_URL => $url.$sUrl,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_CUSTOMREQUEST => "POST",
        //CURLOPT_POSTFIELDS => $fields_string,
        CURLOPT_HEADER => false,                      // don't return headers
        CURLOPT_SSL_VERIFYPEER => false,              // TODO: fix certificate provider list problem later
        CURLOPT_CONNECTTIMEOUT => 6,                  // timeout on connect
        CURLOPT_TIMEOUT => 10  );                      // timeout on response

    curl_setopt_array ( $ch, $options );
    //echo $fields_string;
    global $log;
    $log->LogDebug("headers: ".json_encode($headers));
    try {
        $result=curl_exec( $ch );
        $log->LogDebug("paypalCreateDraft result: ".$result);
        //$header = curl_getinfo ( $ch );
        $err = curl_errno ( $ch );
        $errmsg = curl_error ( $ch );
        $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($errmsg) {
            $log->LogError("error in paypalCreateDraft: ".$errmsg);
            throw new Exception($errmsg);
        }
        $log->LogDebug("paypal http status: ".$http_status);
        switch ($http_status) {
            case "202" : $http_status = "200";
            case "400": throw new BadRequestException("paypal package malformed : ".$result);
            case "500": throw new InternalFatalException("paypal returned fatal : ".$result);
        }
        $log->LogDebug("returned from paypal: ".$result);
        return $result;
     } catch (Exception $e) {  throw $e;  }

}




function updatePayPalDraft($jsondraft,$id){
    global $log;
    try {
        $token = getPaypalAccessToken();
        $log->LogDebug("token is what? ".json_encode($token));
        $tr = paypalUpdateDraftRequest($token,$jsondraft,$id);
        return json_decode($tr,true);
    } catch (Exception $e) {
        throw new RemoteErrorException($e);
    }
}



function paypalUpdateDraftRequest($token,$jsondraft,$id){
    global $url,$log;
    $log->LogDebug("access token: ".$token["access_token"]);
    //$url = "https://api.sandbox.paypal.com"; //api.sandbox.paypal.com/v1/oauth2/token
    $url =   "https://api.paypal.com";
    $sUrl = "/v1/invoicing/invoices/".$id;
    $log->LogDebug("paypalUpdateDraftRequest url: ".$url.$sUrl);
    $log->LogDebug("json payload: ".$jsondraft);
    //$accept = "Accept:application/json";
    //$acceptlang = "Accept-Language:en_US";
    $contenttype = "Content-Type: application/json";
    $contentlen = "Content-Length: " . strlen($jsondraft);
    $authorization = "Authorization: Bearer ".$token["access_token"];
    $headers = array($contenttype,$contentlen,$authorization);
    $fields_string = $jsondraft;
    $ch = curl_init();
    $options = array (CURLOPT_RETURNTRANSFER => true, // return web page
        //CURLOPT_FAILONERROR => true,        // you will lose great debu info from papal
        CURLOPT_URL => $url.$sUrl,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_CUSTOMREQUEST => "PUT",
        CURLOPT_POSTFIELDS => $fields_string,
        CURLOPT_HEADER => false,                      // don't return headers
        CURLOPT_SSL_VERIFYPEER => false,              // TODO: fix certificate provider list problem later
        CURLOPT_CONNECTTIMEOUT => 6,                  // timeout on connect
        CURLOPT_TIMEOUT => 10  );                      // timeout on response

    curl_setopt_array ( $ch, $options );
    //echo $fields_string;
    global $log;
    $log->LogDebug("headers: ".json_encode($headers));
    try {
        $result=curl_exec( $ch );
        $log->LogDebug("paypalCreateDraftRequest result: ".$result);
        //$header = curl_getinfo ( $ch );
        $err = curl_errno ( $ch );
        $errmsg = curl_error ( $ch );
        $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($errmsg) {
            $log->LogError("error in paypalUPdateDraftRequest: ".$errmsg);
            throw new Exception($errmsg);
        }
        $log->LogDebug("paypal http status: ".$http_status);
        switch ($http_status) {
            case "400": throw new BadRequestException("paypal package malformed : ".$result);
            case "500": throw new InternalFatalException("paypal returned fatal : ".$result);
            case "503": throw new InternalFatalException("paypal service temporarily unavailable : ".$result);
        }
        $log->LogDebug("returned from paypal: ".$result);
        return $result;
     } catch (Exception $e) {  throw $e;  }

}


?>