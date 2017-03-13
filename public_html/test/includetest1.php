<?php

$var = $_REQUEST["var"];

echo "include1 says: ".$var."<br />";

include_once("includetest2.php");

echo "include3 is availble to include1? ".$var3."<br />"

?>