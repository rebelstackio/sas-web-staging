<?php

class BadRequestException extends Exception{}
class RemoteErrorException extends Exception{}
class InternalErrorException extends Exception{}
class InternalFatalException extends Exception{}

/* TODO: remove from production */
error_reporting(E_ALL ^ E_STRICT);
ini_set('display_errors', '1');
/* END: remove from production */

header('Content-Type: application/json');

function getRequestParam($param,$default,$boolRaiseExcptn) {
    if(isset($_REQUEST[$param])) return $_REQUEST[$param];
    elseif ($boolRaiseExcptn) throw new Exception('Expected parameter not found: '.$param);
    else return $default;
}

/* logging */
$log = NULL;
$error_logging = "DEBUG";

function setLogger($logging){
    require_once('../../KLogger.php');
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

require_once('../../dbconn.php');

/* TODO : parameters to check : clientEmail, clientName, status, sessionID  */
$log = setLogger($error_logging);
$search = getRequestParam("search",null,null);
$mode = getRequestParam("mode",null,null);

$results = null;
require_once('../../reservit_http_status.php');

$http_status = HTTP_200;

if ($search) {
    switch($search){
        case "getInvoicesByFuzzyName":
            $clientName = getRequestParam("clientName",null,null);
            $log->LogDebug("clientName: ".$clientName);
            $results = searchInvoicesFuzzyName($clientName);
            break;
        case "getInvoicesByEmail":
            $clientEmail = getRequestParam("clientEmail",null,null);
            $results = searchInvoicesEmail($clientEmail);
            break;
        case "getInvoicesByStatus":
            $status = getRequestParam("status",null,null);
            $results = searchInvoicesStatus($status);
            break;
        case "getInvoiceByID":
            $sessionID = getRequestParam("sessionID",null,null);
            $results = searchInvoicesSessionID($sessionID);
            break;
        case "session":
            $sessionID = getRequestParam("sessionID",null,null);
            $clientEmail = getRequestParam("clientEmail",null,null);
            $results = getReservation($clientEmail,$sessionID);
            if ($results) {
                require_once('../../reserveIt_paypalComm.php');
                try {
                    $pp = getPaypalInvoice($results["paypal"]);
                } catch (Exception $e) { $results = $e->getMessage(); $http_status = HTTP_500; }
                $results["paypal"] = $pp;
            }
            break;
    }
}
else if ($mode) {
    require_once('../../reservit_modes.php');
    switch($mode){
        case "update":
            $mode = MODE_UPDATE;
            try {
                $session = json_decode(getRequestParam("session",null,null),true);
                if (isset($session["newstatus"])) {
                    /* TODO: update status */
                    require_once('../../dbconn.php');
                    $status = setReservationStatus($session["invoice"],$session["email"],$session["newstatus"]);
                }
                if ($session["itemschanged"]) {
                    /* TODO: update paypal */
                    require_once('../../reserveIt_paypalComm.php');
                    $id = $session["paypal"]["id"];
                    $paypal = array();
                    $paypal["items"] = array();
                    foreach ($session["paypal"]["items"] as $item){
                        $newitem = array("name"=>$item["name"],"quantity"=>$item["quantity"],"description"=>$item["description"],"date"=>$item["date"],"unit_price"=>array("currency"=>$item["unit_price"]["currency"],"value"=>$item["unit_price"]["value"]));
                        array_push($paypal["items"],$newitem);
                    }
                    $updated = updatePayPalDraft(json_encode($paypal),$id);
                    $log->LogDebug("updated:".$updated);
                }
                /* TODO send notifications */
                require_once('../../reserveit_notifications.php');
                $sessionID = $session["invoice"]; $clientEmail = $session["clientInfo"]["email"];
                $notified = sendNotification($mode,$session["preflang"],$session["clientInfo"]);
            } catch (Exception $e) {
                $http_status = HTTP_500;
                $results = $e->getMessage();
                $log->LogError($e);
            }
        break;
    }
}

header( $http_status );
echo json_encode($results);

?>