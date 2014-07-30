<?php
define('DS', '/');
define('BASE_DIR', str_replace('/api', '', __DIR__));
define('BAYS_DIR', BASE_DIR . DS . 'bays');
define('BASE_URL_SHOA', 'http://www.shoa.cl/mareas/');
//$baseUrlShoa = 'http://www.shoa.cl/mareas/';

$baysChile = array(
    'ancud',
    'angostura',
    'antofagasta',
    'arica',
    'cumberland',
    'orange',
    'caldera',
    'coquimbo',
    'corral',
    'pascua',
    'iquique',
    'chacabuco',
    'chacao',
    'montt',
    'natales',
    'soberania',
    'williams',
    'arenas',
    'delgada',
    'covadonga',
    'sanantonio',
    'talcahuano',
    'valparaiso'
);

function pr($arr){
    echo '<pre>';
    print_r($arr);
    echo '</pre>';
}