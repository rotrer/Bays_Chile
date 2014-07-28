<?php

$urlBay = 'http://www.shoa.cl/mareas/ancud.php';

$contentShore = file_get_contents($urlBay);

//$cleanContent = preg_replace( "/\r|\n/", "", $contentShore );
$cleanContent = preg_replace("/\s+/", "", $contentShore);
$mareas = new SimpleXMLElement($contentShore);
print_r($mareas);
die();
if ($mareas) foreach($mareas->marea->dia as $diaMarea) {
    print_r($marea);
    die();
}