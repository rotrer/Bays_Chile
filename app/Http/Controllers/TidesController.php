<?php namespace ApiMareasChile\Http\Controllers;

use ApiMareasChile\Http\Requests;
use ApiMareasChile\Http\Controllers\Controller;

use Illuminate\Http\Request;

#Load Model
use ApiMareasChile\Location;
use ApiMareasChile\Tide;

class TidesController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return response()->json( array());
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		return response()->json( array());
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		return response()->json( array());
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $bay
	 * @return Response
	 */
	public function show($bay)
	{
		// Instance Models
		$tides = new Tide;
		$location = new Location;
		$response = array();
		if ( isset($bay) && !empty($bay) ) {
			//get location
			$locationData = $location->where( 'slug', '=', $bay)->first();
			//get tide info
			$response = $tides->select( array('year as years', 'month as months', 'day', 'h1st', 'm1st', 't1st', 'h2st', 'm2st', 't2st', 'h3st', 'm3st', 't3st', 'h4st', 'm4st', 't4st') )
																						->where( 'locations_id', '=', $locationData->id)
																						->orderBy('years', 'desc')
																						->orderBy('months', 'asc')
																						->orderBy('day', 'asc')
																						->get();
		} else {
			$response = array('ERROR');
		}
		

		return response()->json( $response );
	}

	/**
	 * Display filter by bay, year, month
	 *
	 * @param  string  $bay
	 * @param  int  $year
	 * @param  int  $month
	 * @return Response
	 */
	public function bayfilter($bay, $year, $month)
	{
		// Instance Models
		$tides = new Tide;
		$location = new Location;
		$response = array();
		if ( isset($bay) && !empty($bay) && isset($year) && !empty($year)  && isset($month) && !empty($month) ) {
			//get location
			$locationData = $location->where( 'slug', '=', $bay)->first();
			//get tide info
			$response = $tides->select( array('year as years', 'month as months', 'day', 'h1st', 'm1st', 't1st', 'h2st', 'm2st', 't2st', 'h3st', 'm3st', 't3st', 'h4st', 'm4st', 't4st') )
																						->where( 'locations_id', '=', $locationData->id)
																						->where( 'year', '=', $year)
																						->where( 'month', '=', $month)
																						->orderBy('years', 'desc')
																						->orderBy('months', 'asc')
																						->orderBy('day', 'asc')
																						->get();
		} else {
			$response = array('ERROR');
		}
		

		return response()->json( $response );
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		return response()->json( array());
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		return response()->json( array());
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		return response()->json( array());
	}

	/**
	 * Populate tides.
	 *
	 * @return Response
	 */
	public function populate()
	{
		// Instance Models
		$locations = Location::all();
		$tides = new Tide();
		// Bay remote
		$endPoint = 'http://www.shoa.cl/mareas/{tide}.php';
		// initialize the multihandler
		$mh = curl_multi_init();
		$channels = array();
		######
			// $tideUrl = str_replace('{tide}', $locations->slug, $endPoint);
			// $channels[0]['slug'] = $locations->slug;
			// $channels[0]['id'] = $locations->id;
			// // initiate individual channel
			// $channels[0]['curl'] = curl_init();
			// curl_setopt_array($channels[0]['curl'], array(
			// 	CURLOPT_URL => $tideUrl,
			// 	CURLOPT_RETURNTRANSFER => true,
			// 	CURLOPT_FOLLOWLOCATION => true
			// ));
			// // add channel to multihandler
			// curl_multi_add_handle($mh, $channels[0]['curl']);
		######
		foreach ($locations as $key => $location) {
			
			$tideUrl = str_replace('{tide}', $location->slug, $endPoint);
			$channels[$key]['slug'] = $location->slug;
			$channels[$key]['id'] = $location->id;
			// initiate individual channel
			$channels[$key]['curl'] = curl_init();
			curl_setopt_array($channels[$key]['curl'], array(
				CURLOPT_URL => $tideUrl,
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_FOLLOWLOCATION => true
			));
			// add channel to multihandler
			curl_multi_add_handle($mh, $channels[$key]['curl']);

		}
		
		// execute - if there is an active connection then keep looping
		$active = null;
		do {
			$status = curl_multi_exec($mh, $active);
		}
		while ($active && $status == CURLM_OK);

		// echo the content, remove the handlers, then close them
		foreach ($channels as $chan) {
			
			$location_id = $chan['id'];
			$contentBay = curl_multi_getcontent($chan['curl']);
			#Clean break lines and tabs
			$cleanContent = preg_replace( "/\r|\n/", "", $contentBay );
			
			###########
			#Read XML
			###########
			$xmlIterator = simplexml_load_string($cleanContent, 'SimpleXMLIterator');
			// for( $xmlIterator->rewind(); $xmlIterator->valid(); $xmlIterator->next() ) {
			// 		foreach($xmlIterator->getChildren() as $name => $data) {
			// 				$dias[] = $data;
			// 		}
			// }

			#$mareas = new SimpleXMLElement($mareasDias);
			$dias = (array) $xmlIterator->marea->dia;
			if ($dias)
			{
					foreach ($dias as $keyDay => $day) {
							if (strlen($day) > 45)
							{
									#Dia marea
									$dayPB = explode('/', substr($day, 0, 10)); 
									$monthDay = $dayPB[2] . '-' . $dayPB[1];

									#Primer tramo día
									$h1st = substr($day, 11, 5);
									$m1st = substr($day, 17, 4);
									$t1st = substr($day, 22, 1);

									#Segundo tramo día
									$h2nd = substr($day, 24, 5);
									$m2nd = substr($day, 30, 4);
									$t2nd = substr($day, 35, 1);

									#Tercer tramo día
									$h3rd = substr($day, 37, 5);
									$m3rd = substr($day, 43, 4);
									$t3rd = substr($day, 48, 1);

									#Cuarto tramo día
									$hourFourthPB = substr($day, 50, 5);
									if ($hourFourthPB)
									{
											$h4th = $hourFourthPB;
											$m4th = substr($day, 56, 4);
											$t4th = substr($day, 61, 1);
									}
									else
									{
											$h4th = $m4th = $t4th = '';
									}
									
									// Search tide before insert
									$dayInfo = Tide::where('locations_id', '=', $location_id)
																	->where('year', '=', $dayPB[2])
																	->where('month', '=', (int )$dayPB[1])
																	->where('day', '=', (int) $dayPB[0])
																	->take(1)
																	->get();

									#insert
									if ($dayInfo->isEmpty()) {
										$newTide = new Tide();
										$newTide->keyday = $monthDay;
										$newTide->locations_id = $location_id;
										$newTide->year = $dayPB[2];
										$newTide->month = $dayPB[1];
										$newTide->day = $dayPB[0];
										
										$newTide->h1st = $h1st;
										$newTide->m1st = $m1st;
										$newTide->t1st = $t1st;
										
										$newTide->h2st = $h2nd;
										$newTide->m2st = $m2nd;
										$newTide->t2st = $t2nd;
										
										$newTide->h3st = $h3rd;
										$newTide->m3st = $m3rd;
										$newTide->t3st = $t3rd;

										$newTide->h4st = $h4th;
										$newTide->m4st = $m4th;
										$newTide->t4st = $t4th;

										$newTide->save();
									#update
									} else {
										$dayInfo[0]->keyday = $monthDay;
										$dayInfo[0]->locations_id = $location_id;
										$dayInfo[0]->year = $dayPB[2];
										$dayInfo[0]->month = $dayPB[1];
										$dayInfo[0]->day = $dayPB[0];
										
										$dayInfo[0]->h1st = $h1st;
										$dayInfo[0]->m1st = $m1st;
										$dayInfo[0]->t1st = $t1st;
										
										$dayInfo[0]->h2st = $h2nd;
										$dayInfo[0]->m2st = $m2nd;
										$dayInfo[0]->t2st = $t2nd;
										
										$dayInfo[0]->h3st = $h3rd;
										$dayInfo[0]->m3st = $m3rd;
										$dayInfo[0]->t3st = $t3rd;

										$dayInfo[0]->h4st = $h4th;
										$dayInfo[0]->m4st = $m4th;
										$dayInfo[0]->t4st = $t4th;

										$dayInfo[0]->save();
									}
									
							}
					}
			}
			###########
			#End Read XML
			###########

			curl_multi_remove_handle($mh, $chan['curl']);
			curl_close($chan['curl']);
		}

		// close the multihandler
		curl_multi_close($mh);
		
		return response()->json( array('OK'));
	}

	private function writeJsonMarea($bayFile, $timestamp, $mareasDias){
			
	}

}