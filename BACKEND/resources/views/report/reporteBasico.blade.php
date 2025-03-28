<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $data['titulo'] }}</title>

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

        .chart-container {
            margin: 20px 0;
        }

        .chart-container>img {
            max-width: 100%;
            height: auto;
        }

        .logo img {
            width: 200px;
            height: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 0px 0;
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

        hr {
            border: 0;
            border-top: 1px solid #ddd;
            margin: 10px 0;
        }

        .pie {
            width: 250px;
        }

        .bar {
            width: 300px;
        }

        .card {
            border: 1px solid #ddd;
            /* Aumentado a 1px para mejor visibilidad */
            box-shadow: 1px 1px 3px rgba(100, 100, 100, 0.6);
            /* Mejorada la sombra */
            padding: 1rem 1.5rem;
            /* Ajuste leve para mejor proporción */
            margin: 1rem;
            background-color: #f1f5f92d;
            border-radius: 8px;
            /* Agregado para suavizar bordes */
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Cabecera -->
        <div class="header">
            <table style="width: 100%; table-layout: fixed;">
                <tr>
                    <td style="width: 20%; text-align: center;">
                        <img src="{{ asset('img/logo_fm.png') }}" alt="Logo Fiscalía" style="max-width: 150px;">
                    </td>
                    <td style="width: 15%; text-align: center;">
                        <h3 style="color: #152671;">CARGA LABORAL</h3>
                        <p style="color: #152671;">Fecha inicio: {{ $data['fecha_inicio'] ?? 'No disponible' }}</p>
                        <p style="color: #152671;">Fecha fin: {{ $data['fecha_fin'] ?? 'No disponible' }}</p>
                    </td>
                    <td style="width: 70%; text-align: center; background-color: #152671;">
                        <h1 style="color: #fff;">FISCALÍA PROVINCIAL MIXTA DE TAHUAMANU</h1>
                    </td>
                </tr>
            </table>
        </div>

        <h1 style="text-align: center;">{{ $data['titulo'] }}</h1>
        <p style="text-align: right;">Generado el: {{ $data['fecha'] ?? 'No disponible' }}</p>

        <!-- Gráfico de Barras -->
        <div class="chart-container card">
            <h3>Gráfico de Barras</h3>
            <img src="{{ $data['pieChartImage'] ?? 'no encontrado' }}" class="pie" alt="Gráfico de Barras">
        </div>

        <!-- Gráfico de Dona -->
        <div class="chart-container card">
            <h3>Gráfico de Dona</h3>
            <img src="{{ $data['barChartImage'] ?? 'no encontrado' }}" class="bar" alt="Gráfico de Dona">
        </div>
    </div>
</body>

</html>
