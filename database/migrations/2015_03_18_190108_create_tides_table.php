<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTidesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('tides', function($table)
		{
			$table->increments('id');
			$table->string('name', 50);
			$table->string('slug', 50);
			$table->string('keyday', 20);
			$table->integer('locations_id')->unsigned();
			$table->integer('year');
			$table->integer('month');
			$table->integer('day');
			$table->string('h1st', 6);
			$table->string('m1st', 6);
			$table->string('t1st', 6);
			$table->string('h2st', 6);
			$table->string('m2st', 6);
			$table->string('t2st', 6);
			$table->string('h3st', 6);
			$table->string('m3st', 6);
			$table->string('t3st', 6);
			$table->string('h4st', 6);
			$table->string('m4st', 6);
			$table->string('t4st', 6);

			$table->timestamps();
			#Indices
			$table->index('locations_id');
			#FK
			if (Schema::hasTable('locations'))
			{
			    $table->foreign('locations_id')->references('id')->on('locations');
			}
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('tides');
	}

}
