<?php

# https://github.com/vlucas/phpdotenv
# $dotenv = new Dotenv\Dotenv(__DIR__);
# $dotenv->load();

define('MAC',$_ENV['DBMAC']);
define('USR',$_ENV['DBUSR']);
define('PSW',$_ENV['DBPSW']);
define('DBNAME','reservations');
define('TBNAME','invoice_status');

function createConnection($m,$u,$p,$d) {
    $mysqli = new mysqli($m,$u,$p);
    if ($mysqli->connect_errno) {
        throw new InternalFatalException("Could not connect to db: ".$mysqli->connect_error);
    }
    else {
        if (!$mysqli->query("USE ".$d.";")) return false;
        else return $mysqli;
    }
}

function getReservation($clientEmail,$sessionID){
    /* Returns associative array :
        keys: invoice,status,email,name,country,ip,created.updated
        or false (if empty)
    */
    try {
        $cn = createConnection(MAC,USR,PSW,DBNAME);
        $sql = "SELECT * FROM ".TBNAME." WHERE invoice='".$sessionID."' AND email='".$clientEmail."'";
        $result = $cn->query($sql);
        if ($cn->errno) throw new InternalErrorException("Could not fetch reservation from db: ".$cn->error);
        if ($cn->affected_rows > 0) return $result->fetch_assoc();
        else return false;
    } catch (Exception $e) { throw $e; }
    finally {  $cn->close();  }
}

function newReservation($sessionID,$clientEmail,$name,$country,$ip,$note,$paypal)  {
    global $log;
    try {
        $cn = createConnection(MAC,USR,PSW,DBNAME);
        $sql = "INSERT INTO ".TBNAME." (invoice,email,name,country,ip,note,paypal) "
                . "VALUES('".$sessionID."','".$clientEmail."','".mysqli_real_escape_string ( $cn , $name )."','".$country."','".$ip."','".mysqli_real_escape_string ( $cn , $note )."','".$paypal."')";
        $log->LogDebug("sql insert: ".$sql);
        $result = $cn->query($sql);
        if ($cn->errno) throw new InternalErrorException("Could not create reservation in db: ".$cn->error);
        return $result;
    } catch (Exception $e) {
        throw $e;
    }
      finally {  $cn->close();  }
}

function setReservationStatus($sessionID,$clientEmail,$status,$constraint) {
    global $log;
    try {
        $cn = createConnection(MAC,USR,PSW,DBNAME);
        $sql = "UPDATE ".TBNAME." SET status = '".$status."' "
                . "WHERE invoice = '".$sessionID."' AND email = '".$clientEmail."' ";
        if ($constraint) $sql = $sql . " AND ".$constraint;
        $result = $cn->query($sql);
        $log->LogDebug("sql setReservationStatus: ".$sql);
        if ($cn->errno) throw new InternalErrorException("Could not set reservation status in db: ".$cn->error);
        if ($cn->affected_rows > 0) return true;
        else return false;
    }
    catch (InternalErrorException $f) { throw $f; }
    catch (Exception $e) { throw $e; }
    finally {  $cn->close();  }
}

function deleteReservation($sessionID,$clientEmail) {
    global $log;
    try {
        $cn = createConnection(MAC,USR,PSW,DBNAME);
        $sql = "DELETE  FROM ".TBNAME." WHERE invoice = '".$sessionID."' AND email = '".$clientEmail."' ";
        $log->LogDebug("Deleting invoice_status entry: ".$sql);
        $result = $cn->query($sql);
        if ($cn->errno) throw new InternalErrorException("Could not set reservation status in db: ".$cn->error);
        return $result;
    } catch (Exception $e) { throw $e; }
      finally {  $cn->close();  }
}


function searchInvoicesFuzzyName($clientName){
    global $log;
    try {
        $cn = createConnection(MAC,USR,PSW,DBNAME);
        $sql = "SELECT * FROM ".TBNAME." WHERE name sounds like '".$clientName."'";
        $log->LogDebug("searchFuzzy: ".$sql);
        $result = $cn->query($sql);
        $resultsArr = array();
        if ($cn->errno) throw new InternalErrorException("Could not fetch reservation from db: ".$cn->error);
        if ($cn->affected_rows > 0) {
            $index = 0;
            while($row = $result->fetch_assoc()) // loop to give you the data in an associative array so you can use it however.
            {
             $resultsArr[$index] = $row;
             $index++;
            }
         return $resultsArr;
        }
        else return false;
    } catch (Exception $e) { throw $e; }
}

function searchInvoicesEmail($clientEmail){
    global $log;
    try {
        $cn = createConnection(MAC,USR,PSW,DBNAME);
        $sql = "SELECT * FROM ".TBNAME." WHERE email = '".$clientEmail."'";
        $result = $cn->query($sql);
        $resultsArr = array();
        if ($cn->errno) throw new InternalErrorException("Could not fetch reservation from db: ".$cn->error);
        if ($cn->affected_rows > 0) {
            $index = 0;
            while($row = $result->fetch_assoc()) // loop to give you the data in an associative array so you can use it however.
            {
             $resultsArr[$index] = $row;
             $index++;
            }
         return $resultsArr;
        }
        else return false;
    } catch (Exception $e) { throw $e; }
}

function searchInvoicesSessionID($sessionID){
    global $log;
    try {
        $cn = createConnection(MAC,USR,PSW,DBNAME);
        $sql = "SELECT * FROM ".TBNAME." WHERE invoice = '".$sessionID."'";
        $result = $cn->query($sql);
        $resultsArr = array();
        if ($cn->errno) throw new InternalErrorException("Could not fetch reservation from db: ".$cn->error);
        if ($cn->affected_rows > 0) {
            $index = 0;
            while($row = $result->fetch_assoc()) // loop to give you the data in an associative array so you can use it however.
            {
             $resultsArr[$index] = $row;
             $index++;
            }
         return $resultsArr;
        }
        else return false;
    } catch (Exception $e) { $log->LogError($e->getMessage()); throw $e; }
}

function searchInvoicesStatus($status){
    global $log;
    try {
        $cn = createConnection(MAC,USR,PSW,DBNAME);
        $sql = "SELECT * FROM ".TBNAME." WHERE status = '".$status."'";
        $result = $cn->query($sql);
        $resultsArr = array();
        if ($cn->errno) throw new InternalErrorException("Could not fetch reservation from db: ".$cn->error);
        if ($cn->affected_rows > 0) {
            $index = 0;
            while($row = $result->fetch_assoc()) // loop to give you the data in an associative array so you can use it however.
            {
             $resultsArr[$index] = $row;
             $index++;
            }
         return $resultsArr;
        }
        else return false;
    } catch (Exception $e) { throw $e; }
}


?>
