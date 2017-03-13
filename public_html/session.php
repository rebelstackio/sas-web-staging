<?php
header('Content-Type: application/javascript');
$callback = $_REQUEST["callback"];
$fn = "session.txt";
$fh = fopen($fn,'r+');
//flock($fh,LOCK_EX);
$d = fread($fh,filesize($fn));
$response = "";
if ($callback) {
    $response = $callback."('".++$d."')";
}
else $response = "'".++$d."'";
rewind($fh);
fwrite($fh,$d);
fclose($fh);
//flock($fh,LOCK_UN);
echo $response;
?>