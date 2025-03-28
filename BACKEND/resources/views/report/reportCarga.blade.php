<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Carga Fiscal</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            width: 100%;
            height: 100%;
        }

        .container {
            max-width: 1000px;
            margin: 10px auto;
            padding: 0px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .header .left,
        .header .right {
            flex: 0 0 15%;
            text-align: center;
        }

        .header .center {
            flex: 0 0 70%;
            text-align: center;
        }

        .header img {
            max-width: 100px;
            height: auto;
            margin: 0 auto;
        }

        h1,
        h3,
        h4 {
            color: #333;
            margin: 5px 0;
        }

        h1 {
            font-size: 1.5em;
        }

        h3 {
            font-size: 1.4em;
        }

        h4 {
            font-size: 1.1em;
        }

        p {
            color: #555;
            font-size: 0.7em;
            margin: 1px 0;
        }

        .p_despacho {
            color: #33333;
            font-size: 0.9em;
            margin: 0px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 0.70em;
        }

        thead {
            background-color: #333;
            color: #fff;
        }

        thead th {
            padding: 5px;
            text-align: left;
        }

        tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        tbody tr:hover {
            background-color: #f1f1f1;
        }

        tbody td {
            padding: 8px;
            border: 1px solid #ddd;
        }



        footer {
            background-color: #f1f1f1;

            padding: 0px;
            margin-top: 3px;
            border-top: 1px solid #ddd;
        }

        .header,
        footer .flex {
            display: flex;
            flex-direction: row;
            /* Asegura alineación horizontal */
            justify-content: space-between;
            align-items: center;
        }

        footer .flex>div {
            flex: 1;
            text-align: center;
        }

        .despachos {
            margin-top: 20px;
            margin-bottom: 0px;
        }

        .fiscales {
            margin-bottom: 15px;
        }

        .fiscales h4 {
            margin-top: 10px;
        }

        hr {
            border: 0;
            border-top: 1px solid #ddd;
            margin: 0px 0;
        }
    </style>
</head>

<body>


    <div class="container">
        <!-- Cabecera -->
        <div class="header">
            <table style="width: 100%; table-layout: fixed;">
                <tr>
                    <td style="width: 15%; text-align: center;">
                        <img src="{{ asset('img/logo_fm.png') }}" alt="Logo_fm" style="max-width: 100px;" />
                        <p>Sistema de Información Estadística Fiscal (SERF)</p>
                    </td>
                    <td style="width: 70%; text-align: center;">
                        <h1>Reporte Detallado de Carga Fiscal por Dependencia</h1>
                        <p>Fecha inicio: {{ $data['fecha_inicio'] ?? 'No disponible' }}</p>
                        <p>Hora fin: {{ $data['fecha_fin'] ?? 'No disponible' }}</p>
                    </td>
                    <td style="width: 15%; text-align: center;">
                        <img src="data:image/png;base64,{{ $data['barcode'] }}" alt="Código de Barras"
                            style="max-width: 100px;">
                        <p>{{ $data['codigoBarrasTexto'] }}</p>
                    </td>
                </tr>
            </table>
        </div>


        <!-- Línea de separación -->

        <h4>Datos Dependencia</h4>

        <div class="dependencia">
            <table
                style="width: 100%; table-layout: fixed; border: 1px solid #ddd; margin-top: 10px; font-size: 0.8em; line-height: 1.2;">
                <tr>
                    <td
                        style="width: 30%; font-weight: bold; text-align: left; padding: 5px; background-color: #f9f9f9;">
                        Código Dependencia:</td>
                    <td style="width: 70%; text-align: left; padding: 5px;">
                        {{ $data['dependencia']->cod_depen ?? 'No disponible' }}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold; text-align: left; padding: 5px; background-color: #f9f9f9;">Fiscalía:
                    </td>
                    <td style="text-align: left; padding: 5px;">{{ $data['dependencia']->fiscalia ?? 'No disponible' }}
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: bold; text-align: left; padding: 5px; background-color: #f9f9f9;">Tipo de
                        Fiscalía:</td>
                    <td style="text-align: left; padding: 5px;">
                        {{ $data['dependencia']->tipo_fiscalia ?? 'No disponible' }}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold; text-align: left; padding: 5px; background-color: #f9f9f9;">Nombre
                        Fiscalía:</td>
                    <td style="text-align: left; padding: 5px;">
                        {{ $data['dependencia']->nombre_fiscalia ?? 'No disponible' }}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold; text-align: left; padding: 5px; background-color: #f9f9f9;">Teléfono:
                    </td>
                    <td style="text-align: left; padding: 5px;">{{ $data['dependencia']->telefono ?? 'No disponible' }}
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: bold; text-align: left; padding: 5px; background-color: #f9f9f9;">RUC:</td>
                    <td style="text-align: left; padding: 5px;">{{ $data['dependencia']->ruc ?? 'No disponible' }}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold; text-align: left; padding: 5px; background-color: #f9f9f9;">Sede:</td>
                    <td style="text-align: left; padding: 5px;">{{ $data['nombre_sede'] ?? 'No disponible' }}
                    </td>
                </tr>
            </table>
        </div>



        <!-- Despachos -->
        @foreach ($data['despachos'] as $despacho)
            <hr>
            <div class="despachos">
                <!-- Título del despacho -->
                <h4>Despacho: {{ $despacho->nombre_despacho }}</h4>

                <!-- Tabla para los fiscales del despacho -->
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Fiscal</th>
                            <th>Resul Histórico</th>
                            <th>Resultado</th>
                            <th>Trámites Históricos</th>
                            <th>Trámites</th>
                            <th>Ingreso</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($despacho->fiscales as $index => $fiscal)
                            <tr>
                                <td>{{ $index + 1 }}</td>
                                <td>{{ $fiscal->nombres_f }}</td>
                                <td>
                                    <!-- Mostrar la suma o el valor total de 'resulHistorico' -->
                                    {{ $fiscal->cargaFilcal->sum('resulHistorico') ?? 0 }}
                                </td>
                                <td>
                                    <!-- Mostrar la suma o el valor total de 'resultado' -->
                                    {{ $fiscal->cargaFilcal->sum('resultado') ?? 0 }}
                                </td>
                                <td>
                                    <!-- Mostrar la suma o el valor total de 'tramitesHistoricos' -->
                                    {{ $fiscal->cargaFilcal->sum('tramitesHistoricos') ?? 0 }}
                                </td>
                                <td>
                                    <!-- Mostrar la suma o el valor total de 'tramites' -->
                                    {{ $fiscal->cargaFilcal->sum('tramites') ?? 0 }}
                                </td>
                                <td>
                                    <!-- Mostrar la suma o el valor total de 'ingreso' -->
                                    {{ $fiscal->cargaFilcal->sum('ingreso') ?? 0 }}
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endforeach


        <footer>
            <table
                style="width: 100%; table-layout: fixed; background-color: #f1f1f1; padding: 0px; border-top: 1px solid #ddd;">
                <tr>
                    <td style="text-align: center;">
                        Responsable: {{ $data['user']->nombre ?? 'No disponible' }}
                    </td>
                    <td style="text-align: center;">
                        IP Origen: {{ $data['ipAddress'] ?? 'No disponible' }}
                    </td>
                    <td style="text-align: center;">
                        Fecha impresión: {{ $data['currentDateTime'] }}
                    </td>
                </tr>
                
            </table>
        </footer>
        



    </div>
</body>

</html>
