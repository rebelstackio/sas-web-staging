<?php
class BadRequestException extends Exception{}
class RemoteErrorException extends Exception{}
class InternalErrorException extends Exception{}
class InternalFatalException extends Exception{}
$error_logging = "DEBUG";

if ($error_logging) {
    require_once('KLogger.php');
    // KLogger::DEBUG | KLogger::INFO | KLogger::WARN | KLogger::ERROR | KLogger::FATAL
    switch ($error_logging){
        case "INFO" : $error_logging = KLogger::INFO;  break;
        case "WARN" : $error_logging = KLogger::WARN;  break;
        case "ERROR": $error_logging = KLogger::ERROR; break;
        case "FATAL": $error_logging = KLogger::FATAL; break;
        default: $error_logging = KLogger::DEBUG;
    }
    $log = new KLogger ( "klog.txt", $error_logging );
}


require_once("reserveIt_paypalComm.php");

// check paypal for existing invoice id: INV2-TUWV-U53T-QFAD-7VTP
$d = "INV2-TUWV-U53T-QFAD-7VTP";
try {

  echo getPaypalInvoice($d);

}
 catch (BadRequestException $f) { $log->LogError("General error: ".$f->getMessage()); throw $f; }
 catch (Exception $e) { $log->LogError("General error: ".$e->getMessage()); throw $e; }





?>