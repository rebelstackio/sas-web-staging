<?php
header('Content-Type: application/json');
$logo_url = "http://secretsofperu.com/g/paypal_logo.jpg";


/* TODO: update db and send notifications... no need to touch paypal */

function cancelReservationJSON($clientName,$clientEmail,$sessionID,$country,$lang) {
    global $log;
    $mode = MODE_FINAL;
    if (!$country) $country = "";
    if (!$lang) $lang = "en";
    try { require_once("dbconn.php"); }
    catch (Exception $e) { throw new InternalFatalException($e->getMessage()); }
    try {
        /* TODO: update (rows affected) invoice in draft state else throw BadRequestException */
        if (setReservationStatus($sessionID,$clientEmail,"CANCEL",null)) {
            /* TODO: send notifications to client and operator  */
            require_once('reserveit_notifications.php');
            $clientInfo = array("name"=>$clientName,"email"=>$clientEmail);
            try {
                sendNotification($mode,$lang,$clientInfo,null);
            }
            catch (Exception $e) {
                // what to do if cant notify?
                // setReservationStatus($sessionID,$clientEmail,"DRAFT",null);
                /* TODO: make sure we know former status of invoice so it can be rolled back */
                throw new InternalErrorException("Could not set reservation status (finalize): ".$e->getMessage());
            }
        } else {
            throw new BadRequestException("Error finalizing reservation: could not find matching reservation in draft status. ");
        }
    }
    catch (InternalErrorException $g) { throw $g; }
    catch (BadRequestException $f) { throw $f; }
    catch (Exception $e) { throw $e; }
}

?>