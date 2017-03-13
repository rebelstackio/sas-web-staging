<?php

/* https://accounts.google.com/DisplayUnlockCaptcha  - unlock remote device for sending SMTP */

error_reporting(E_ALL ^ E_STRICT);
ini_set('display_errors', '1');
$debug = true;
$error = false;
$message = "";

require_once "Mail.php";

function getLocationInfoByIp(){
	$client = @$_SERVER['HTTP_CLIENT_IP'];
	$forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
	$remote = @$_SERVER['REMOTE_ADDR'];
	$result = array('country'=>'', 'city'=>'');
	if(filter_var($client, FILTER_VALIDATE_IP)) {
		$ip = $client;
	}
	elseif(filter_var($forward, FILTER_VALIDATE_IP)) {
		$ip = $forward;
	}
	else {
		$ip = $remote;
	}
	$ip_data = @json_decode(file_get_contents("http://www.geoplugin.net/json.gp?ip=".$ip));
	if($ip_data && $ip_data->geoplugin_countryName != null) {
		$result['country'] = $ip_data->geoplugin_countryName;
	}
	return $result;
}



function sendMail($from,$to,$subject,$body){
	$headers = array('From' => $from, 'To' => $to, 'Subject' => $subject );
	$smtp = Mail::factory('smtp', array('host'=>'ssl://smtp.gmail.com','port'=>'465','auth'=>true,'username'=>'whaaaaaa@gmail.com','password' => 'use .env dammit!!!'));
	$mail = $smtp->send($to, $headers, $body);
	if (PEAR::isError($mail)) {
	    $error = true;
	    $message = $mail->getMessage();
	}
	else {
	    $error = false;
		$message = "Message successfully sent!";
	}
}


$ipaddy = $_SERVER["REMOTE_ADDR"];
$dt = new DateTime();
$now = date_format($dt, 'Y-m-d H:i:s');
$lang = $_REQUEST["lang"];
$code = $_REQUEST["code"];
$price = $_REQUEST["price"];
$qty = $_REQUEST["minQty"];
$date = $_REQUEST["date"];
$clientName = $_REQUEST["clientName"];
$clientEmail = $_REQUEST["email"];
$notes = $_REQUEST["notes"];
$responderEmail = "reservations@southamericanssecrets.com";
$location = getLocationInfoByIp();
$country =  $location['country'];
$replyto = "info@secretsofperu.com";

// /test.php?code=test&price=123&minQty=1&date=04/20/2014&clientName=ReinPetersen&email=email@reinpetersen.com&notes=nonotes

// notification to responder
$respSubject = "Reservation Request ".$clientName." ".$location['country'];
$respBody = "
Reservation Request
===================

Name: {$clientName}  Email: {$clientEmail}
Code: {$code}  Qty: {$qty}
Requested Date: {$date}
Quoted Price: {$price}
Client Notes: {$notes}

===================
Received from : {$ipaddy} {$country} at {$now}
";

// auto-response to client (en)
$clientSubject = "We received your reservation request";
$clientBody = "
We received a reservation request from ip: {$ipaddy} ({$country}) at {$now}.
If you believe this request is an error please let us know by replying so and
we will ensure you receive no further correspondence.

Requested Tour/Activity: {$code}   Date: {$date}   Qty:{$qty}
=======================

Thank you for your interest in tours and activities with SouthAmericansSecrets.com.

We will respond to your reservation request within 48 hours (probably much sooner)
to let you know if there is availability your desired date. You may receive multiple
automatic responses if you have requested multiple tours but you can rest assured
that your multiple reservation requests will be handled and responded to as a package.

If we are able to confirm availability we will reply with more information and how
you may guarantee your reservation by deposit. If we are unable to secure a
reservation for your desired dates, we may suggest alternative dates we know to be
available.

If you have any further questions, please feel free to reply and ask us :)

Thanks again for your interest from the SouthAmericansSecrets.com team!

";


// auto-response to client (es)
$clientSubjectES = "Hemos recibido su solicitud de reserva";
$clientBodyES = "
Hemos recibido su solicitud de reserva de ip: {$ipaddy} ({$country}) {$now}.
Si usted cree que esta solicitud es un error por favor, responda y
nos aseguraremos de no recibir más correos.

Solicitud: {$code}   Fecha: {$date}   Cant:{$qty}
===========

Gracias por su interés en nuestros tours y actividades.

Nosotros responderemos a su solicitud de reserva dentro de 48 horas
(probablemente más pronto) para hacerle saber si hay disponibilidad en la
fecha. Usted tendrá otra respuestas si ha tenido otras solicitudes.

Si podemos confirmar la disponibilidad, contestaremos con mayor
detalle y usted puede garantizar su reserva con un depósito. Si no
podemos asegurar su reserva para las fechas deseadas, vamos a
proponer fechas alternativas.

Si usted tiene otras preguntas, por favor no dude en preguntar :)

Gracias de nuevo por su interés!

South Amerians Secrets

";

sendMail($replyto,$responderEmail,$respSubject,$respBody);

if ($error) {
    header("HTTP/1.0 500 Internal Server Error");;
 	echo($message);
}
else {
    if ($lang == "es") {
        sendMail($replyto,$clientEmail,$clientSubjectES,$clientBodyES);
    }
    else {
        sendMail($replyto,$clientEmail,$clientSubject,$clientBody);
        if ($error) {
            header("HTTP/1.0 500 Internal Server Error");;
 	        echo($message);
        }
        else {
            header("HTTP/1.0 200 OK");
 	        echo('Reservation messages sent successfully.');
        }
    }
}

?>
