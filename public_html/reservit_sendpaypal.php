<?php

/* TODO: remove from production */
error_reporting(E_ALL ^ E_STRICT);
ini_set('display_errors', '1');
/* END: remove from production */

require_once('reservit_http_status.php');

class BadRequestException extends Exception{}
class RemoteErrorException extends Exception{}
class InternalErrorException extends Exception{}
class InternalFatalException extends Exception{}

function getRequestParam($param,$default,$boolRaiseExcptn) {
    if(isset($_REQUEST[$param])) return $_REQUEST[$param];
    elseif ($boolRaiseExcptn) throw new BadRequestException('Expected parameter not found: '.$param);
    else return $default;
}

/* logging */
$log = NULL;
$error_logging = "DEBUG";

function setLogger($logging){
    require_once('KLogger.php');
    // KLogger::DEBUG | KLogger::INFO | KLogger::WARN | KLogger::ERROR | KLogger::FATAL
    switch ($logging){
        case "INFO" : $error_logging = KLogger::INFO;  break;
        case "WARN" : $error_logging = KLogger::WARN;  break;
        case "ERROR": $error_logging = KLogger::ERROR; break;
        case "FATAL": $error_logging = KLogger::FATAL; break;
        default: $error_logging = KLogger::DEBUG;
    }
    return new KLogger ( "klog.txt", $error_logging );
}

$ipaddy = $_SERVER["REMOTE_ADDR"];
$dt = new DateTime();
$now = date_format($dt, 'Y-m-d H:i:s');
$status = HTTP_200;
$message = "";
header('Content-Type: application/json');


try {

    $lang = strtolower(getRequestParam('lang','en',false));
    $log = setLogger($error_logging);
    $paypalID = getRequestParam('paypalID',null,true);
    require_once('reserveIt_paypalComm.php');
    $sent = sendPaypalInvoice($paypalID);

} catch (Exception $e) {
    $status = HTTP_500;
    $message = "An internal server error occurred. Please contact the administrator of this website.";
    $log->LogFatal("An unhandled exception occurred: ".$e->getMessage());

} catch (BadRequestException $e) {
    $status = HTTP_400;
    $message = $e.message;
    $log->LogInfo("Bad Request: ".$e->getMessage()); //TODO: log referrer...

} catch (RemoteErrorException $e) {
    $status = HTTP_500;
    $message = "An internal server occurred. Please try again later or contact the administrator of this website.";
    $log->LogError("Error connecting to external service: ".$e->getMessage());

} catch (InternalErrorException $e)  {
    $status = HTTP_500;
    $message = "An internal server occurred. Please try again later or contact the administrator of this website.";
    $log->LogError("Internal Error: ".$e->getMessage());

} catch (InternalFatalException $e) {
    $status = HTTP_500;
    $message = "An internal server occurred. Please contact the administrator of this website.";
    $log->LogFatal("Fatal Internal Error: ".$e->getMessage());
} finally {
     header($status);
     if ($status != HTTP_200) {
        $RR = array('error'=>array('message'=>$message));
        echo json_encode($RR);
     }
}

?>