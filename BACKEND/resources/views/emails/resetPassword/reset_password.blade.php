<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>

<body>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header text-center">
                        <h4>Restablecer Contraseña</h4>
                        <p>Siendo las <strong><i> {{ now()->format('H:i:s') ?? '00:00' }} </i></strong></p>
                        <p class="">Estimado: {{ $nombre }} </p>
                        <p>Eamil: {{ $correo }}</p>
                        <p>codigo usuario: {{ $uuid }}</p>
                    </div>
                    <div class="card-body">
                        <form method="POST" action="{{ route('reser.pass') }}">
                            @csrf
                            <input type="hidden" name="uuid" value="{{ $uuid }}">
                            <div class="mb-3">
                                <label for="password" class="form-label">Nueva Contraseña</label>
                                <input type="password" name="password" id="password" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="password_confirmation" class="form-label">Confirmar Contraseña</label>
                                <input type="password" name="password_confirmation" id="password_confirmation"
                                    class="form-control" required>
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary">Actualizar Contraseña</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
