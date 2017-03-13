<?php
/*  ReserveIt
    - View Draft (client GET)

*/

/* TODO: remove from production */
error_reporting(E_ALL ^ E_STRICT);
ini_set('display_errors', '1');
/* END: remove from production */

# https://github.com/vlucas/phpdotenv
# $dotenv = new Dotenv\Dotenv(__DIR__);
# $dotenv->load();


$notification_tmpl_dir = "templates";
/* Notification Type Constants
 * R_ : Reservation Draft
 * NEW_ : new draft, UPD_ : update draft, FIN_ : finalize draft, CAN_ : cancel draft
 * _NOT : Notification (to responders/operators), _RES : Response (to client/reservee)
 * _ES : Espanol (language code)
 */
define("R_NEW_NOT",array('template'=>'draft_new_notice.txt','subject'=>'Reservation Started'));
define("R_UPD_NOT",'template'=>'draft_update_notice.txt','subject'=>'Reservation Updated'));
define("R_FIN_NOT",'template'=>'draft_final_notice.txt','subject'=>'Reservation Submitted'));
define("R_CAN_NOT",'template'=>'draft_cancel_notice.txt','subject'=>'Reservation Cancelled'));

define("R_NEW_RES",'template'=>'draft_new_response.txt','subject'=>'We received your reservation request'));
define("R_UPD_RES",'template'=>'draft_update_response.txt','subject'=>'Your reservation was updated'));
define("R_FIN_RES",'template'=>'draft_final_response.txt','subject'=>'You completed/submitted your reservation'));
define("R_CAN_RES",'template'=>'draft_cancel_response.txt','subject'=>'Your reservation was cancelled'));

define("R_NEW_RES_ES",'template'=>'draft_new_response_es.txt','subject'=>'Hemos recibido su solicitud de reserva'));
define("R_UPD_RES_ES",'template'=>'draft_update_response_es.txt','subject'=>'Reserva cambiada'));
define("R_FIN_RES_ES",'template'=>'draft_final_response_es.txt','subject'=>'Solicitud de reserva finalizada'));
define("R_CAN_RES_ES",'template'=>'draft_cancel_response_es.txt','subject'=>'Reserva cancelada'));


/* Constants Operation Mode */
define("MODE_VIEW",0);
define("MODE_NEW",1);
define("MODE_UPDATE",2);
define("MODE_FINAL",3);
define("MODE_CANCEL",4);


/* logging */
$log = NULL;
$error_logging = KLogger::DEBUG;

if ($error_logging) {
/*
Logging : usage
    $error_logging = KLogger::OFF; // or NULL and KLogger won't even get loaded
    KLogger::DEBUG | KLogger::INFO | KLogger::WARN | KLogger::ERROR | KLogger::FATAL

eg. $log = new KLogger ( "klog.txt", KLogger::DEBUG );
    $log->LogError("An exception was thrown in ThisFunction()"); // Do database work that throws an exception
    $log->LogInfo("Internal Query Time: $time_ms milliseconds"); // Print out some information
    $log->LogDebug("User Count: $User_Count"); // Print out the value of some variables
*/
    require_once 'KLogger.php';
    $log = new KLogger ( "klog.txt", $error_logging );
}

header('Content-Type: application/json');

$ipaddy = $_SERVER["REMOTE_ADDR"];
$dt = new DateTime();
$now = date_format($dt, 'Y-m-d H:i:s');

define('MAC',$_ENV['DBMAC']);
define('USR',$_ENV['DBUSR']);
define('PSW',$_ENV['DBPSW']);


$smtphost = $_ENV['SMTPHOST'];
$smtpuser = $_ENV['SMTPUSER'];
$smtppass = $_ENV['SMTPPASS'];
$responderEmail = $_ENV['RESPONDEREMAIL'];
$replyto = $_ENV['REPLYTO'];

$ppBAK = NULL;
$dbBAK = NULL;

$error = NULL;

function getLocationInfoByIp() {
	$client = @$_SERVER['HTTP_CLIENT_IP'];
	$forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
	$remote = @$_SERVER['REMOTE_ADDR'];
	$result = array('country'=>'', 'city'=>'');
	if(filter_var($client, FILTER_VALIDATE_IP)) { $ip = $client; }
	elseif(filter_var($forward, FILTER_VALIDATE_IP)) { $ip = $forward; }
	else { $ip = $remote; }
    try {
	    $ip_data = @json_decode(file_get_contents("http://www.geoplugin.net/json.gp?ip=".$ip));
	    if($ip_data && $ip_data->geoplugin_countryName != null) {
	        $result['country'] = $ip_data->geoplugin_countryName;
	    }
    } catch(Exception $e) {
        $log->LogWarn("Could not retrieve country by ip: ".$e->getMessage());
        $result['country'] = "";
    }
	return $result;
}

$location = getLocationInfoByIp();
$country =  $location['country'];


$jsonStr = $_REQUEST["jsonStr"]; // new ... add method and draft type

$lang = $_REQUEST["lang"];
$code = $_REQUEST["mode"];


$code = $_REQUEST["code"]; // move to posted json object
$price = $_REQUEST["price"]; // move to posted json object
$qty = $_REQUEST["minQty"]; // move to posted json object
$date = $_REQUEST["date"]; // move to posted json object
$clientName = $_REQUEST["clientName"]; // move to posted json object
$clientEmail = $_REQUEST["email"]; // move to posted json object
$notes = $_REQUEST["notes"]; // move to posted json object


/* clientInfo comes from submitted json */
$clientInfo = array('name'=>$clientName,'email'=>$clientEmail,'lang'=>$lang,'ip'=>$ipaddy,'location'=>$location);

function rollbackDB() {
    if (!$dbBAK) {
        $err = "Cannot rollback changes to database: original record is missing. Please contact website admin."
        handleError($err,"Fatal",500);
    }
}

function rollbackPP() {
    if (!$ppBAK) {
        $err = "Cannot rollback changes to Paypal: original copy of PayPal element is missing. Please contact website admin."
        handleError($err,"Fatal",500);
    }
}

function rollback($level) {
    switch($level){
        case 2: rollbackDB();
        case 1: rollbackPP();
        default: die();
    }
}

function handleError($msg,$level,$status_code) {
    switch($level) {
        case "Fatal": $log->LogFatal($msg); break;
        case "Error": $log->LogError($msg); break;
    }
    switch($status_code){
        case 500: header("HTTP/1.0 500 Internal Server Error");
        case 400: header("HTTP/1.0 400 Bad Request");
    }
    $errmsg = array('message' => $msg);
    $err = array('error' => $errmsg);
    array_unshift($error, $err);
}

function sendMail($from,$to,$subject,$body,$host,$user,$pass){
    $errornote = "common mail error with gmail smtp - unlock remote device : see https://accounts.google.com/DisplayUnlockCaptcha";
	$headers = array('From' => $from, 'To' => $to, 'Subject' => $subject );
    try {
        require_once "Mail.php";
	    $smtp = Mail::factory('smtp', array('host'=>$host,'port'=>'465','auth'=>true,'username'=>$user,'password'=>$pass));
	    $mail = $smtp->send($to, $headers, $body);
	    if (PEAR::isError($mail)) {
	        throw new Exception("Unable to send notification email: ".$mail->getMessage().PHP_EOL.$errornote);
	    }
	} catch (Exception $e) {
	    handleError($e->getMessage(),"Error",500);
	    rollback(2);
	}
}

function matchTemplate($mode,$lang) {
    $resp_tmpl = NULL;
    $noti_tmpl = NULL;
    switch($mode) {
        case MODE_NEW:
            switch($lang) {
                case "es": $noti_tmpl = R_NEW_NOT_ES; $resp_tmpl = R_NEW_RES_ES; break;
                default: $noti_tmpl = R_NEW_NOT; $resp_tmpl = R_NEW_RES;
            } break;
        case MODE_UPDATE:
            switch($lang) {
                case "es": $noti_tmpl = R_UPD_NOT_ES; $resp_tmpl = R_UPD_RES_ES; break;
                default: $noti_tmpl = R_NEW_NOT; $resp_tmpl = R_UPD_RES;
            } break;
        case MODE_FINAL:
            switch($lang) {
                case "es": $noti_tmpl = R_FIN_NOT_ES; $resp_tmpl = R_FIN_RES_ES; break;
                default: $noti_tmpl = R_FIN_NOT; $resp_tmpl = R_FIN_RES;
            } break;
        case MODE_CANCEL:
            switch($lang) {
                case "es": $noti_tmpl = R_CAN_NOT_ES; $resp_tmpl = R_CAN_RES_ES; break;
                default: $noti_tmpl = R_CAN_NOT; $resp_tmpl = R_CAN_RES;
            } break;
    }
    return array('response'=>$resp_tmpl,'notify'=>noti_tmpl);
}

function formatTo($name,$email) {
    return $name." <".$email.">";
}

function sendNotification($mode,$lang,$clientEmail,$responderEmail) {
    $mt = matchTemplate($mode,$lang);
    $responseBody = NULL; $notifyBody = NULL;
    try {
        require_once('tbs_class.php');
        $TBS = new clsTinyButStrong;
        $TBS->LoadTemplate($mt['response']);
        $TBS->Render = TBS_NOTHING;
        $TBS->Show();
        $responseBody = $TBS->Source;
        $TBS->LoadTemplate($mt['notify']);
        $TBS->Render = TBS_NOTHING;
        $TBS->Show();
        $notifyBody = $TBS->Source;
    } catch (Exception $e) {
	    handleError("Could not build notification: ".$e->getMessage(),"Error",500);
	    rollback(2);
    }
    try {
        $respmail = sendMail(formatTo("Reservation SecretsOfPeru",$replyto),formatTo($clientInfo['name'],$clientInfo['email']),$mt['response']['subject'],$responseBody,$smtphost,$smtpuser,$smtppass);
        $notimail = sendMail($replyto,$responderEmail,$mt['response']['subject'],$notifyBody,$smtphost,$smtpuser,$smtppass);
    } catch (Exception $e) {
	    handleError("Could not send notification: ".$e->getMessage(),"Error",500);
	    rollback(2);
    }
}



/*  TODO: curl new draft invoice to paypal
    (see testcurl.php)

    1. curl post paypal json invoice (created at client)
    2. onerror - hard failure - response error object (json)
 */

/* TODO: with paypal return data, create reservation db entry
    3. json decode paypal response
    4. get status from paypal response
    5. create reservation db entry (invoice_id, invoice_status (draft), due_date)

    * DATABASE STRUCTURE
        invoice_id VARCHAR(8) NOT NULL PRIMARY KEY,
        status VARCHAR(8) NOT NULL,
        due_date DATE NOT NULL,
        created DATE NOT NULL,
        reservee VARCHAR(255) NOT NULL
 */







?>
