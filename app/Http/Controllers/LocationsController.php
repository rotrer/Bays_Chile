<?php namespace ApiMareasChile\Http\Controllers;

use ApiMareasChile\Http\Requests;
use ApiMareasChile\Http\Controllers\Controller;

use Illuminate\Http\Request;

#Load Model
use ApiMareasChile\Location;

class LocationsController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$locations = new Location();
		return response()->json( $locations->select( array('name', 'slug') )->orderBy('name', 'asc')->get() );
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function all()
	{
		$locations = new Location();
		$data = array("data" => $locations->select( array('name', 'slug') )->orderBy('name', 'asc')->get());
		return response()->json( $data );
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

}
