<?php
require_once 'bays.inc.php';
#Create Json bays
file_put_contents(BAYS_DIR . DS . 'bays.json', json_encode(array("bays" => $baysChile)));

if ($baysChile) foreach ($baysChile as $bay)
{
    #Actualizar bay
    $updateBay = false;
    #Crear archivo bay
    $bayFile = BAYS_DIR . DS . $bay . '.json';
    #Endpoint a consultar
    $urlEndBay = BASE_URL_SHOA . $bay. '.php';
    #Obtener contenido
    $contentShore = @file_get_contents($urlEndBay);
    #Limpiar saltos de lineas y tabs
    $cleanContent = preg_replace( "/\r|\n/", "", $contentShore );
    $lastDay = getLastDay($cleanContent);

    #Si existe archivo, comprueba timestamp actualización
    if (file_exists($bayFile))
    {
        $contentBay = file_get_contents($bayFile);
        #Convertir formato jSon
        $contentBay = @json_decode($contentBay);
        #Si timestamp de Url es mayor a local
        if ($lastDay > $contentBay->timestamp)
        {
            $updateBay = true;
        }
    }
    else
    {
        $updateBay = true;
    }
    if ($updateBay)
    {
        #Escribir archivo
        writeJsonMarea($bayFile, $lastDay, $cleanContent);
        echo "Write bay: $bay <br>";
    }
//    else
//    {
//        echo "Error bay: $bay <br>";
//    }
}

function getLastDay($xml){
    $mareas = new SimpleXMLElement($xml);
    $dias = (array) $mareas->marea->dia;
    if ($dias)
    {
        foreach ($dias as $keyDay => $day) {
            $lastDay = $day;
        }
        $lastDay = explode('/', substr($lastDay, 0, 10));
        $timeStamp = strtotime($lastDay[2] . '-' . $lastDay[1] . '-' . $lastDay[0]);
        return $timeStamp;
    }
    else
    {
        return null;
    }
}

function writeJsonMarea($bayFile, $timestamp, $mareasDias){
    $xmlIterator = new SimpleXMLIterator($mareasDias); 
    for( $xmlIterator->rewind(); $xmlIterator->valid(); $xmlIterator->next() ) {
        foreach($xmlIterator->getChildren() as $name => $data) {
            $dias[] = $data;
        }
    }

    #$mareas = new SimpleXMLElement($mareasDias);
    #$dias = (array) $mareas->marea->dia; pr($dias);
    if ($dias)
    {
        foreach ($dias as $keyDay => $day) {
            if (strlen($day) > 40)
            {
                #Dia marea
                $dayPB = explode('/', substr($day, 0, 10));
                $monthDay = $dayPB[2] . '-' . $dayPB[1];
                $timeStamp = str_replace('/', '-', substr($day, 0, 10));

                #Primer tramo día
                $nodeDay[$monthDay][$timeStamp]['h1st'] = substr($day, 11, 5);
                $nodeDay[$monthDay][$timeStamp]['h1st'] = substr($day, 17, 4);
                $nodeDay[$monthDay][$timeStamp]['t1sr'] = substr($day, 22, 1);


                #Segundo tramo día
                $nodeDay[$monthDay][$timeStamp]['h2nd'] = substr($day, 24, 5);
                $nodeDay[$monthDay][$timeStamp]['m2nd'] = substr($day, 30, 4);
                $nodeDay[$monthDay][$timeStamp]['t2nd'] = substr($day, 35, 1);

                #Tercer tramo día
                $nodeDay[$monthDay][$timeStamp]['h3rd'] = substr($day, 37, 5);
                $nodeDay[$monthDay][$timeStamp]['m3rd'] = substr($day, 43, 4);
                $nodeDay[$monthDay][$timeStamp]['t3rd'] = substr($day, 48, 1);

                #Cuarto tramo día
                $hourFourthPB = substr($day, 50, 5);
                if ($hourFourthPB)
                {
                    $nodeDay[$monthDay][$timeStamp]['h4th'] = $hourFourthPB;
                    $nodeDay[$monthDay][$timeStamp]['m4th'] = substr($day, 56, 4);
                    $nodeDay[$monthDay][$timeStamp]['t4th'] = substr($day, 61, 1);
                }
            }
        }
        #Formar json archivo
        $bayData = json_encode(
            array(
                'timestamp' => $timestamp,
                'data' => $nodeDay
            )
        );
        return @file_put_contents($bayFile, $bayData);
    }
    else
    {
        return null;
    }
}