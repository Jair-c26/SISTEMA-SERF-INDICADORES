<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call(RolesUser::class);
        $this->call(tiposfiscal::class);
        $this->call(UserSeeder::class);
        $this->call(regionSeeder::class);
        $this->call(tipoReporSeeder::class);
        //$this->call(tipoEtapasSeeder::class);
    }
}
