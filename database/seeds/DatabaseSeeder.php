<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();

		$this->call('LocationTableSeeder');
		$this->command->info('Locations table seeded!');
	}

}

use ApiMareasChile\Location as Location;
class LocationTableSeeder extends Seeder {

    public function run()
    {
        DB::table('locations')->delete();

				Location::create(['name' => 'Puerto Williams', 	'slug' => 'williams']);
				Location::create(['name' => 'Ancud', 						'slug' => 'ancud']);
				Location::create(['name' => 'Valparaíso', 			'slug' => 'valparaiso']);
				Location::create(['name' => 'Angostura', 				'slug' => 'angostura']);
				Location::create(['name' => 'Antofagasta', 			'slug' => 'antofagasta']);
				Location::create(['name' => 'Arica', 						'slug' => 'arica']);
				Location::create(['name' => 'Caldera', 					'slug' => 'caldera']);
				Location::create(['name' => 'Coquimbo', 				'slug' => 'coquimbo']);
				Location::create(['name' => 'Corral', 					'slug' => 'corral']);
				Location::create(['name' => 'Iquique', 					'slug' => 'iquique']);
				Location::create(['name' => 'Puerto Chacao', 		'slug' => 'chacao']);
				Location::create(['name' => 'Puerto Montt', 		'slug' => 'montt']);
				Location::create(['name' => 'Puerto Natales', 	'slug' => 'natales']);
				Location::create(['name' => 'Puerto Arenas', 		'slug' => 'arenas']);
				Location::create(['name' => 'San Antonio', 			'slug' => 'sanantonio']);
				Location::create(['name' => 'Talcahuano', 			'slug' => 'talcahuano']);

    }

}