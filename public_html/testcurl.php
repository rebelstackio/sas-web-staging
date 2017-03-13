<?php
//header('Content-Type:application/javascript');

$url = "https://api.sandbox.paypal.com/v1/oauth2/token"; //api.sandbox.paypal.com/v1/oauth2/token
$client_id = "ARPaLRBg3dT_brzgpIQGQX7NaZWo6ZONDb-8L2lOrrleFPf18dMxevyNSzGX";
$secret = "EF4IORAhX3ReOjoXZiA2FedNo7hykLADcUn1m4X9YcRj202AlW_RzCUOeiQA";

//  Initiate curl
$ch = curl_init();

// set basic auth
curl_setopt($ch,CURLOPT_HTTPAUTH,CURLAUTH_BASIC);

// set user/password
curl_setopt($ch,CURLOPT_USERPWD,$client_id.":".$secret);

// set header accept
$headers = array('Accept:application/json','Accept-Language:en_US');
curl_setopt($ch,CURLOPT_HTTPHEADER,$headers);

// set mode to POST
curl_setopt($ch,CURLOPT_POST,true);

// add post fields (1)
$fields_string = "grant_type=client_credentials";
curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

// Disable SSL verification
curl_setopt($ch,CURLOPT_SSL_VERIFYPEER, false);

// Will return the response, if false it print the response
curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);

// Set the url
curl_setopt($ch, CURLOPT_URL,$url);

// Execute
$result=curl_exec($ch);
if($result === false)
{
    echo 'Curl error: ' . curl_error($ch);
}

// close curl
curl_close($ch);

// decode result
//var json = json_decode($result, true);

echo('<pre>'.$result.'</pre>');

?>