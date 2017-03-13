<?php

try {
error_reporting(E_ALL ^ E_STRICT);
ini_set('display_errors', '1');

class BadRequestException extends Exception{}
class RemoteErrorException extends Exception{}
class InternalErrorException extends Exception{}
class InternalFatalException extends Exception{}

require_once("KLogger.php");

$log = new KLogger ( "klog.txt", KLogger::DEBUG );

$log->LogDebug("log somethingdammit!");

throw new Exception("anything?");

} catch (Exception $e) {
    echo $e->getMessage();
}

?>