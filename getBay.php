<?php
require_once 'bays.inc.php';

$contentShore = @file_get_contents($dirBays . 'ancud' . '.json');

if ($contentShore)
{
    $dataBay = json_decode($contentShore);
    pr($dataBay->data->{'2014-07'});
    if ($dataBay) foreach ($dataBay->data as $key => $dia) {
    	pr($dia);
    }
}