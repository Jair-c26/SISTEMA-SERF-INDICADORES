<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid'); // Define UUID 
            $table->string('nombre');
            $table->string('apellido');
            $table->string('telefono', 15)->nullable();
            $table->string('email')->unique();
            $table->string('dni', 10);
            $table->string('sexo', 50)->nullable();
            $table->string('direccion', 200)->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->string('foto_perfil')->nullable(); // Ruta a la imagen de perfil
            $table->string('extension')->default('sin registrar')->nullable(); // Extensión telefónica interna
            $table->string('tipo_fiscal');
            $table->boolean('activo')->default(true); // si es true el usuario esta activo y false, el usuario esta eliminado
            $table->timestamp('fecha_ingreso')->nullable(); // Fecha en la que ingresó a la fiscalía
            $table->timestamp('email_verified_at')->nullable(); //se verifica el email del susuario enviando un correo electronico
            $table->string('password');
            $table->boolean('estado')->default(true);

            $table->string('verification_code', 10)->nullable();
            $table->timestamp('code_expires_at')->nullable();
            
            $table->unsignedBigInteger('despacho_fk')->nullable();
            $table->unsignedBigInteger('roles_fk')->nullable();
            $table->unsignedBigInteger('fiscal_fk')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
