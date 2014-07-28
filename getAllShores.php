<?php
$baseUrlShoa = 'http://www.shoa.cl/mareas/';
$dirBays = 'bays/';
$baysChile = array(
    'ancud' => 'ancud.php',
    'angostura' => 'angostura.php',
    'antofagasta' => 'antofagasta.php',
    'arica' => 'arica.php',
    'cumberland' => 'cumberland.php',
    'orange' => 'orange.php',
    'caldera' => 'caldera.php',
    'coquimbo' => 'coquimbo.php',
    'corral' => 'corral.php',
    'pascua' => 'pascua.php',
    'iquique' => 'iquique.php',
    'chacabuco'=> 'chacabuco.php',
    'chacao' => 'chacao.php',
    'montt' => 'montt.php',
    'natales' => 'natales.php',
    'soberania' => 'soberania.php',
    'williams' => 'williams.php',
    'arenas' => 'arenas.php',
    'delgada' => 'delgada.php',
    'covadonga' => 'covadonga.php',
    'sanantonio' => 'sanantonio.php',
    'talcahuano' => 'talcahuano.php',
    'valparaiso' => 'valparaiso.php'
);

$timeStamp = time();
if ($baysChile) foreach ($baysChile as $keyBay => $bay) {
    #Actualizar bay
    $updateBay = false;
    #Crear archivo bay
    $bayFile = $dirBays . $keyBay . '.json';
    #Si existe archivo, comprueba timestamp actualización
    if (file_exists($bayFile)) {
        $contentBay = file_get_contents($bayFile);
        #Convertir formato jSon
        $contentBay = @json_decode($contentBay);
        #Diferencia timestamp mayor a 1 semana
        $diffTimeStamp = $timeStamp - $contentBay->timestamp;
        $totalDays = floor($diffTimeStamp/(60*60*24));
        if ($totalDays > 6) {
            $updateBay = true;
        }
    }
    if ($newBayFile) {
        #Endpoint a consultar
        $urlEndBay = $baseUrlShoa . $bay;
        #Obtener contenido
        $contentShore = file_get_contents($urlEndBay);
        #Limpiar saltos de lineas y tabs
        $cleanContent = preg_replace("/\s+/", "", $contentShore);
        #Convertir caracteres especiales
        $xmlConvert = htmlspecialchars($cleanContent);
        #Formar json archivo
        $bayData = json_encode(
            array(
                'timestamp' => $timeStamp,
                'data' => $xmlConvert
            )
        );
        #Escribir archivo
        fwrite($newBayFile, $bayData);
        fclose($newBayFile);
        echo "Write bay: $keyBay <br>";
    } else {
        echo "Error bay: $keyBay <br>";
    }
//    $mareas = new SimpleXMLElement($contentShore);
}