<?php

function getReservationJSON($user,$session) {
    global $log;
    // check db
    try {
        require_once("dbconn.php");
        $res = getReservation($user,$session);
    } catch (Exception $e) { throw $e; }

    // keys: invoice,status,email,name,country,ip,note,paypal,created,updated
    $RR = array('sessionID'=>$res['invoice'],'status'=>$res['status'],'note'=>$res['note'],'createdUnix'=>$res['created'],'updatedUnix'=>$res['updated'],
                'clientInfo'=>array('name'=>$res['name'],'email'=>$res['email']),
                'locationInfo'=>array('ip'=>$res['ip'],'country'=>$res['country']) );

    // TODO: with sessionID fetch associated paypal record with curl and add to 'paypal' key in $RR
    try {
            require_once("reserveit_paypalComm.php");
            $pp = getPaypalInvoice($res['paypal']);
            $RR['paypal'] = $pp;
            $message = json_encode($RR);
            return $message;
    } catch (BadRequestException $e) { throw ($e); }
      catch (Exception $e) { throw ($e); }

}

?>