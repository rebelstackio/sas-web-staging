<?php
error_reporting(E_ALL ^ E_STRICT);
ini_set('display_errors', '1');
class BadRequestException extends Exception{}
class RemoteErrorException extends Exception{}
class InternalErrorException extends Exception{}
class InternalFatalException extends Exception{}
try {
    require_once('KLogger.php');
    $log = new KLogger ( "klog.txt", KLogger::DEBUG );
    require_once("dbconn.php");
    $drafted = newReservation("test1","test@test.com","test","Peru","127.0.0.1","notes","id");
    echo "inserted" . $drafted;

} catch (Exception $e) {
    $log->LogError($e->getMessage());
    echo $e->getMessage();
}

?>