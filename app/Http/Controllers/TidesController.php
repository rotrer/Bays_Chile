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
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		return response()->json( array());
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
		$endPoint = 'http://www.shoa.cl/mareas/{tide}.php';
		$locations = Location::all();
		foreach ($locations as $key => $location) {
			$tideUrl = str_replace('{tide}', $location->slug, $endPoint);
			var_dump($tideUrl);
		}
		die();
	}

}
