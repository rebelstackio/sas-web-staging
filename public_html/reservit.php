<?php
/*  ReserveIt
    - View Draft (client GET)
    - Create Draft (client POST)
        1. Create draft on Paypal using sessionID (egABA999) : on success,
        2. Create invoice_status entry in reservations db (mysql) : on success,
        3. Create auto_response and operator notification : on success,
        4. Return json object (paypal invoice wrapped by reservation)
    - Update Draft
        1. Update draft on Paypal (sessionID --> pp_invoice_number
        2. update invioce_status record in db
        3. create auto_response (DRAFT UPDATED)
        4. return new json object
    - Finalize Draft (client)
        1. update pp if there are changes
        2. Update invoice_status
        3. send notifications
        4. return new json object
    - Cancel Draft/Sent/Paid
        1. update type in pp if pp type already marked draft/sent/paid/pending
        2. update invoice_status record in db
        3. send notifications
        4. return new json object
*/

/* TODO: remove from production */
error_reporting(E_ALL ^ E_STRICT);
ini_set('display_errors', '1');
/* END: remove from production */

require_once('reservit_modes.php');

/* Constants Invoice Status */
define('DRAFT','DRAFT'); // new created
define('DRAFTFIN','DRAFTFIN'); // new finalized by client
define('CONFIRM','CONFIRM'); // confirmed by operator
define('PAID','PAID'); // paid via paypal
define('CANCEL','CANCEL'); // canceled by client or operator (at any point)

/* status constants from paypal
DRAFT, SENT, PAID, MARKED_AS_PAID, CANCELLED, REFUNDED, PARTIALLY_REFUNDED, MARKED_AS_REFUNDED
*/

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
    $mode = strtolower(getRequestParam('mode',null,false));
    $log = setLogger($error_logging);

    switch($mode){

        case "view"   : require_once(MODE_VIEW);
            // request: user,sessionID
            $user = strtolower(getRequestParam('user',null,true));
            $sessionID = strtoupper(getRequestParam('sessionID',null,true));
            $mode = MODE_VIEW;
            echo getReservationJSON($user,$sessionID);
            break;

        case "new"    : require_once(MODE_NEW);
            // request: session (json)
            $log->LogDebug("Mode is NEW");
            $mode = MODE_NEW;
            $session = json_decode(getRequestParam('session',null,true),true);
            $nd = newDraft($session);
            echo $nd;
            break;

        case "update" :
            require_once(MODE_UPDATE);
            $mode = MODE_UPDATE;
            break;

        case "final"  :
            require_once(MODE_FINAL);
            $clientEmail = strtolower(getRequestParam('clientEmail',null,true));
            $clientName = getRequestParam('clientName',null,true);
            $country = getRequestParam('clientName',null,true); // what?!? TODO: fix dat
            $sessionID = strtoupper(getRequestParam('sessionID',null,true));
            $lang = strtolower(getRequestParam('lang','en',false));
            $mode = MODE_FINAL;
            echo finalizeReservationJSON($clientName,$clientEmail,$sessionID,$country,$lang);
            break;

        case "cancel" :
            require_once(MODE_CANCEL);
            $clientEmail = strtolower(getRequestParam('clientEmail',null,true));
            $clientName = getRequestParam('clientName',null,true);
            $country = getRequestParam('clientName',null,true); // what?!? TODO: fix dat
            $sessionID = strtoupper(getRequestParam('sessionID',null,true));
            $lang = strtolower(getRequestParam('lang','en',false));
            $mode = MODE_CANCEL;
            echo cancelReservationJSON($clientName,$clientEmail,$sessionID,$country,$lang);
            break;

        default:
            require_once(MODE_SCHEMA);
            $mode=NULL;
            break;
    }

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