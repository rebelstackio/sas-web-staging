<?php
header('Content-Type: application/json');
$logo_url = "https://www.paypal.com/pe/cgi-bin/?cmd=_stream-logo-image&id=18783812";

/* session paramter contains json session
    json form
       session.id = "";
       session.note = "";
       session.clientInfo = {};
       session.clientInfo.name="";
       session.clientInfo.email="";
       session.locationInfo = {};
       session.locationInfo.country = "";
       session.locationInfo.ip = "";
       session.pp = {};
       session.pp.items = [];
       session.pp.items[0] = { "name":"Sutures", "description":"description text. Price:x.xx  Deposit:x.xx",
                               "quantity":1, "unit_price":{"currency":"USD","value":5} };
     */


/* Paypal Invoice draft merchant_info (required)
      "merchant_info": { "email":"", "first_name":"", "last_name":"", "business_name":"",
                         "phone":{ "country_code":"", "national_number":"" },
                         "address": { "line1":"", "city":"", "state":"", "postal_code":"", "country_code":"" }
                      } */

function updateSession($session) {
    if ($session.itemsupdated){
        /* TODO: submit paypal invoice update */
        /* TODO: send notifications ITEMS_UPDATED */
    }
    if ($session.newstatus){
        /* TODO: update db status
                 on successful update, send notifications */
        switch($session.newstatus){
            case "DRAFTFIN":

             break;
            case "CONFIRM": break;
            case "PAID": break;
            case "CANCEL": break;
            case "REFUND": break;
            default: break;
        }
    }
}


function newDraft($session) {
    global $log,$logo_url,$mode,$lang,$country,$sessionID,$clientName,$clientEmail,$clientNote,$itemPrice,$itemCode,$itemDate,$itemQty;
    try {
        $session = json_decode($_REQUEST['session'],true);
        $clientEmail = $session["clientInfo"]["email"];
        $clientName = $session["clientInfo"]["name"];
        $clientNote = $session["note"];
        $country = $session["locationInfo"]["country"];
        $sessionID = $session["id"];
        $itemCode = $session["paypal"]["items"][0]["name"];
        $itemDate = $session["paypal"]["items"][0]["date"];
        $itemQty = $session["paypal"]["items"][0]["quantity"];
        $itemPrice = $session["paypal"]["items"][0]["unit_price"]["value"];
    } catch (Exception $e) { throw new BadRequestException("session parameter (json) is malformed: ".$e->getMessage()); }

    try {
        require_once("dbconn.php");
        if (getReservation($clientEmail,$sessionID)) // correct paramaters?
            throw new BadRequestException('Create Reservation Error: A Reservation with the same ID already exists.');
    } catch (Exception $e) { throw $e; }

    try {
        require_once('reservit_merchant_info.php');
//        global $merchant_info;
        $merchant_info = getMerchantInfo();
        $log->LogDebug("merchant_info: ".json_encode($merchant_info));
    } catch (Exception $e) { throw $e;   } // TODO throw FatalErrorException
    $session["paypal"]["number"] = $session["id"];
    $session["paypal"]["merchant_info"] = $merchant_info;
    $session["paypal"]["billing_info"] = array();
    $session["paypal"]["billing_info"][0] = array("email"=>$session["clientInfo"]["email"]);
    $session["pp"]["logo_url"] = $logo_url; //must be served from https (ssl) on server
    $paypal = json_encode($session["paypal"]);
    $log->LogDebug("paypal: ".$paypal);
    try {
        require_once("reserveIt_paypalComm.php");
        $pr = createPayPalDraft($paypal);

        $log->LogDebug("response createPaypaldraft: ".json_encode($pr));
        try {
            $ppid = $pr["id"];
            $drafted = newReservation($session["id"],$session["clientInfo"]["email"],$session["clientInfo"]["name"],$session["locationInfo"]["country"],$session["locationInfo"]["ip"],$session["note"],$ppid);
            try { // TODO: with a confirmed db record send notifications
                // send notifications
                require_once('reserveit_notifications.php');
                sendNotification($mode,$lang,$session["clientInfo"],null);  // correct parameters?
                $log->LogDebug("return from newDraft: ".json_encode($pr));
                return json_encode($pr);
            } catch (Exception $e) {
                try { // TODO: couldn't send notifications // rollback db & paypal

                    $log->LogDebug("rolling back db");
                    $deleted = deleteReservation($session["id"],$session["clientInfo"]["email"]);
                } catch (Exception $e) {
                    throw new InternalFatalException("Rollback error: could not rollback db invoice (".$session['id']."-".$ppid."): ".$e->getMessage());
                }
                throw new InternalFatalException("Error: Could not send create reservation notifications (".$session['id']."-".$ppid."): ".$e->getMessage());
            }
        } catch (Exception $e) { // db entry failed so rollback paypal
            try {
                $log->LogDebug("roll back paypal draft: ".$ppid);
                $deleted = deletePaypalDraft($ppid);

                }
            catch (Exception $e) {
                throw new InternalFatalException("Rollback error: could not rollback paypal invoice (".$ppid."): ".$e->getMessage());
            }
            throw new InternalFatalException("Rolled back transaction: could not create reservation (".$ppid."): ".$e->getMessage());
        }
    } catch (Exception $e) { throw $e; }

}
?>