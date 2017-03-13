<?php
$mac = "localhost";
$usr = "root";
$psw = NULL; //"password";
$dbname = "reservations";
$tbname = "invoice_status";

/*


CREATE TABLE `invoice_status` (
  `invoice` varchar(10) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'DRAFT',
  `email` varchar(255) NOT NULL,
  `name` varchar(50) NOT NULL,
  `country` varchar(50) DEFAULT NULL,
  `ip` varchar(15) DEFAULT NULL,
  `note` varchar(100) DEFAULT NULL,
  `paypal` varchar(24) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`invoice`),
  UNIQUE KEY `invoice_email_index` (`invoice`,`email`),
  UNIQUE KEY `paypal_index` (`invoice`,`paypal`),
  KEY `status_index` (`status`),
  KEY `country_index` (`country`),
  KEY `name_index` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1


 */




function createConnection($mac,$usr,$psw) {
    $mysqli = new mysqli($mac,$usr,$psw);
    if ($mysqli->connect_errno) {
        printf("Connect failed: %s\n", $mysqli->connect_error);
        printf("<br />");
        return false;
    }
    else {
        echo "connected to ".$mac."<br/>";
        return $mysqli;
    }
}

function createUseDB($dbname,$mysqli) {
    $sql = "CREATE DATABASE IF NOT EXISTS ".$dbname.";";
    $mysqli->query($sql);
    if (!$mysqli->query($sql)) {
        printf("Create Database Error: %s\n", $mysqli->error);
        printf("<br />");
        return false;
    }
    else {
        echo "created database ".$dbname."<br/>";
        if (!$mysqli->query("USE ".$dbname.";")) {
            printf("Use Database Error: %s\n", $mysqli->error);
            printf("<br />");
            return false;
        }
        else echo "using database ".$dbname."<br/>";
        return true;
    }
}

function createTable($mysqli,$tbname) {
    $sql = "CREATE TABLE IF NOT EXISTS ".$tbname." (invoice varchar(10) NOT NULL, status varchar(10) NOT NULL, PRIMARY KEY(invoice)) ENGINE=InnoDB; ";
    if (!$mysqli->query($sql)) {
        printf("Create Table Error: %s\n", $mysqli->error);
        printf("<br />");
        return false;
    }
    else {
        echo "created table ".$tbname."<br/>";
        if (!$mysqli->query("CREATE INDEX status_index ON ".$tbname." (status);")) {
            printf("Create Index Error: %s\n", $mysqli->error);
            printf("<br />");
            return false;
        }
        else {
            echo "created index status_index <br />";
            return true;
        }

    }
}

$mysqli = createConnection($mac,$usr,$psw);
if (!$mysqli) { die(); }
if (!createUseDB($dbname,$mysqli,$psw)) { die(); }
if (!createTable($mysqli,$tbname)) { die(); }
$mysqli->close();

?>