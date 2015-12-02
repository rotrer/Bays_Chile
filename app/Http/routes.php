<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'WelcomeController@index');

Route::get('localidades/all', 'LocationsController@all');
Route::resource('localidades', 'LocationsController');
Route::get('mareas/populate', 'TidesController@populate');
Route::get('mareas/{slug}', 'TidesController@show');
Route::get('mareas/{bay}/{year}/{month}', 'TidesController@bayfilter');
Route::get('v2/mareas/{bay}/{year}/{month}', 'TidesController@bayfilterV2');
Route::resource('mareas', 'TidesController');

