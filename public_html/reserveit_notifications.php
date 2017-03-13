<?php

# https://github.com/vlucas/phpdotenv
# $dotenv = new Dotenv\Dotenv(__DIR__);
# $dotenv->load();

define('SMTPHOST',$_ENV['SMTPHOST']);
define('SMTPUSER',$_ENV['SMTPUSER']);
define('SMTPPASS',$_ENV['SMTPPASS']);
define('RESPONDEREMAIL',$_ENV['RESPONDEREMAIL']);
define('REPLYTO',$_ENV['REPLYTO']);
define('TEMPLATES_BASE',$_ENV['TEMPLATES_BASE']);


require_once('reservit_notify_contants.php');



function getSubject($temp) {
global $log;
$log->LogDebug("getSubject : ".$temp);
	switch ($temp) {
		case R_NEW_NOT: return 'Reservation Started';
		case R_UPD_NOT: return 'Reservation Updated';
		case R_FIN_NOT: return 'Reservation Submitted';
		case R_CAN_NOT: return 'Reservation Cancelled';
		case R_PAY_NOT: return 'Reservation is paid';

		case R_NEW_RES: return 'We received your reservation request';
		case R_UPD_RES: return 'Your reservation was updated';
		case R_FIN_RES: return 'You completed/submitted your reservation';
		case R_CAN_RES: return 'Your reservation was cancelled';
		case R_CFM_RES: return 'Your reservation has been confirmed';
		case R_PAY_RES: return 'Thank You - your reservation deposit is paid';
		case R_RFD_RES: return 'You have been issued a refund';

		case R_NEW_RES_ES: return 'Hemos recibido su solicitud de reserva';
		case R_UPD_RES_ES: return 'Reserva cambiada';
		case R_FIN_RES_ES: return 'Solicitud de reserva finalizada';
		case R_CAN_RES_ES: return 'Reserva cancelada';
		case R_CFM_RES_ES: return 'Solicitud de reserva confirmada';
		case R_PAY_RES_ES: return 'Gracias - el deposito está pagada';
		case R_RFD_RES_ES: return 'Se le ha emitido un reembolso';
		default: return null;
	}
}



function matchTemplate($mode,$lang) {
    $resp_tmpl = NULL;
    $noti_tmpl = NULL;
    global $log,$subjects;
    $log->LogDebug("match notification templates with mode : ".$mode." lang: ".$lang);
    switch($mode) {
        case MODE_NEW:
            switch($lang) {
                case "es": $noti_tmpl = R_NEW_NOT; $resp_tmpl = R_NEW_RES_ES; break;
                default: $noti_tmpl = R_NEW_NOT; $resp_tmpl = R_NEW_RES;
                $log->LogDebug("matched NEW template: ".$noti_tmpl);
            } break;
        case MODE_UPDATE:
            switch($lang) {
                case "es": $noti_tmpl = R_UPD_NOT; $resp_tmpl = R_UPD_RES_ES; break;
                default: $noti_tmpl = R_NEW_NOT; $resp_tmpl = R_UPD_RES;
            } break;
        case MODE_FINAL:
            switch($lang) {
                case "es": $noti_tmpl = R_FIN_NOT; $resp_tmpl = R_FIN_RES_ES; break;
                default: $noti_tmpl = R_FIN_NOT; $resp_tmpl = R_FIN_RES;
            } break;
        case MODE_CONFIRM:
            switch($lang) {
                case "es": $noti_tmpl = R_CFM_NOT; $resp_tmpl = R_CFM_RES_ES ; break;
                default: $noti_tmpl = R_CFM_NOT ; $resp_tmpl = R_CFM_RES;
            } break;
        case MODE_PAID:
            switch($lang) {
                case "es": $noti_tmpl = R_PAY_NOT; $resp_tmpl = R_PAY_RES_ES; break;
                default: $noti_tmpl = R_PAY_NOT ; $resp_tmpl = R_PAY_RES;
            } break;
        case MODE_REFUND:
            switch($lang) {
                case "es": $noti_tmpl = R_RFD_NOT; $resp_tmpl = R_RFD_RES_ES; break;
                default: $noti_tmpl = R_RFD_NOT; $resp_tmpl = R_RFD_RES;
            } break;
        case MODE_CANCEL:
            switch($lang) {
                case "es": $noti_tmpl = R_CAN_NOT; $resp_tmpl = R_CAN_RES_ES; break;
                default: $noti_tmpl = R_CAN_NOT; $resp_tmpl = R_CAN_RES;
            } break;
    }
    $log->LogDebug("notify templates mateched. response: ".$resp_tmpl. " notify: ".$noti_tmpl);
    return array('response'=>$resp_tmpl,'notify'=>$noti_tmpl);
}


function formatTo($name,$email) {
    return $name." <".$email.">";
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
        throw new RemoteErrorException($e->getMessage());
	}
}

function sendNotification($mode,$lang,$clientInfo,$responderEmail) {
    global $subjects;
	global $log;
    if (!$responderEmail) $responderEmail = RESPONDEREMAIL;
    $mt = matchTemplate($mode,$lang);
    $responseBody = NULL; $notifyBody = NULL;
    try {
        require_once('tbs_class.php');
        $TBS = new clsTinyButStrong;
        $respTemp = $mt['response'];
        if ($respTemp) {
            $log->LogDebug("template location: ".$respTemp);
            $TBS->LoadTemplate($respTemp);
            $TBS->Render = TBS_NOTHING;
            $TBS->Show();
            $responseBody = $TBS->Source;
        }
        $notiTemp = $mt['notify'];
        if ($notiTemp) {
            $log->LogDebug("template location: ".$notiTemp);
            $TBS->LoadTemplate($notiTemp);
            $TBS->Render = TBS_NOTHING;
            $TBS->Show();
            $notifyBody = $TBS->Source;
        }
    } catch (Exception $e) {
        $log->LogError($e->getMessage());
        throw new InternalErrorException("Could not render notification template - mode: ".$mode);
    }
    try {
        if ($respTemp) {
			$respSubj = getSubject($respTemp);
			$log->LogDebug("response subject: ".$respSubj);
			$respmail = sendMail(formatTo("Reservation SecretsOfPeru",REPLYTO),formatTo($clientInfo['name'],$clientInfo['email']),$respSubj,$responseBody,SMTPHOST,SMTPUSER,SMTPPASS);
		}
        if ($notiTemp) {
			$notiSubj = getSubject($notiTemp)." ".$clientInfo['name'];
			$log->LogDebug("notice subject: ".$notiSubj);
			$notimail = sendMail(REPLYTO,RESPONDEREMAIL,$notiSubj,$notifyBody,SMTPHOST,SMTPUSER,SMTPPASS);
		}
    } catch (Exception $e) {
		$log->LogError($e->getMessage());
        throw ($e);
    }
}









?>
