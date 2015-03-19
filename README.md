Bays_Chile API
==========

### == Laravel 5 + MySql ==

#### Setup

- Clonar repositorio

- Instalar aplicación `composer update`

- Migraciones `php artisan migrate`

- Poblar localidades `php artisan db:seed`

- Poblar mareas `[URL]:[PORT]/mareas/populate`

#### Endpoints

- Todas localidades `[URL]/localilades`

- Marea por localidad `[URL]/mareas/[SLUG_LOCALIDAD]`

- Marea por localidad por a�o/mes `[URL]/mareas/[SLUG_LOCALIDAD]/[A�O]/[MES]`