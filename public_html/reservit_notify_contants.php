<?php

/* Notification Type Constants
 * R_ : Reservation Draft
 * NEW_ : new draft, UPD_ : update draft, FIN_ : finalize draft, CAN_ : cancel draft
 * _NOT : Notification (to responders/operators), _RES : Response (to client/reservee)
 * _ES : Espanol (language code)
 */
define("R_NEW_NOT","draft_new_notice.txt");         // 'Reservation Started'
define("R_UPD_NOT","draft_update_notice.txt");      // 'Reservation Updated'
define("R_FIN_NOT","draft_final_notice.txt");       // 'Reservation Submitted'
define("R_CAN_NOT","draft_cancel_notice.txt");      // 'Reservation Cancelled'
define("R_PAY_NOT","draft_paid_notice.txt");        // 'Reservation Paid'
define("R_CFM_NOT",null);
define("R_RFD_NOT",null);

define("R_NEW_RES","draft_new_response.txt");       // 'We received your reservation request'
define("R_UPD_RES","draft_update_response.txt");    // 'Your reservation was updated'
define("R_FIN_RES","draft_final_response.txt");     // 'You completed/submitted your reservation'
define("R_CAN_RES","draft_cancel_response.txt");    // 'Your reservation was cancelled'
define("R_CFM_RES","draft_confirm_response.txt");   // 'Your reservation has been confirmed'
define("R_PAY_RES","draft_paid_response.txt");      // 'Thank You - your reservation deposit is paid'
define("R_RFD_RES","draft_refund_response.txt");    // 'You have been issued a refund'


define("R_NEW_RES_ES","draft_new_response_es.txt");     // 'Hemos recibido su solicitud de reserva'
define("R_UPD_RES_ES","draft_update_response_es.txt");  // 'Reserva cambiada'
define("R_FIN_RES_ES","draft_final_response_es.txt");   // 'Solicitud de reserva finalizada'
define("R_CAN_RES_ES","draft_cancel_response_es.txt");  // 'Reserva cancelada'
define("R_CFM_RES_ES","draft_confirm_response.es.txt"); // 'Reserva confirmada'
define("R_PAY_RES_ES","draft_paid_response.es.txt");    // 'Gracias - el deposito está pagada'
define("R_RFD_RES_ES","draft_refund_response.es.txt");  // 'Se le ha emitido un reembolso'


$subjects = array();
$subjects[R_NEW_NOT]='Reservation Started';
$subjects[R_UPD_NOT]='Reservation Updated';
$subjects[R_FIN_NOT]='Reservation Submitted';
$subjects[R_CAN_NOT]='Reservation Cancelled';
$subjects[R_PAY_NOT]='Reservation is paid';

$subjects[R_NEW_RES]='We received your reservation request';
$subjects[R_UPD_RES]='Your reservation was updated';
$subjects[R_FIN_RES]='You completed/submitted your reservation';
$subjects[R_CAN_RES]='Your reservation was cancelled';
$subjects[R_CFM_RES]='Your reservation has been confirmed';
$subjects[R_PAY_RES]='Thank You - your reservation deposit is paid';
$subjects[R_RFD_RES]='You have been issued a refund';

$subjects[R_NEW_RES_ES]='Hemos recibido su solicitud de reserva';
$subjects[R_UPD_RES_ES]='Reserva cambiada';
$subjects[R_FIN_RES_ES]='Solicitud de reserva finalizada';
$subjects[R_CAN_RES_ES]='Reserva cancelada';
$subjects[R_CFM_RES_ES]='Solicitud de reserva confirmada';
$subjects[R_PAY_RES_ES]='Gracias - el deposito está pagada';
$subjects[R_RFD_RES_ES]='Se le ha emitido un reembolso';



?>