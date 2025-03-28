from fastapi import FastAPI, UploadFile, File, HTTPException, Form
import pandas as pd
import mysql.connector
from mysql.connector import Error
import io
import chardet  # Para detectar la codificación del archivo en CSV
from datetime import datetime
from typing import Optional

app = FastAPI()

DB_CONFIG = {
    "host": "mysql",
    "user": "sail",
    "password": "password",
    "database": "laravel",
}

def get_db_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except Error as e:
        print(f"❌ Error de conexión a MySQL: {e}")
        return None




def prefetch_ids(conn, table, column, extra_column=None):
    cursor = conn.cursor()
    if extra_column:
        query = f"SELECT id, {column}, {extra_column} FROM {table}"
        cursor.execute(query)
        data = {(str(val1), str(val2)): id for id, val1, val2 in cursor.fetchall()}
    else:
        query = f"SELECT id, {column} FROM {table}"
        cursor.execute(query)
        data = {str(val): id for id, val in cursor.fetchall()}
    cursor.close()
    return data



def prefetch_fiscales(conn):
    cursor = conn.cursor()
    query = "SELECT id, id_fiscal, nombres_f, dependencias_fk FROM fiscales"
    cursor.execute(query)
    data = { (str(id_fiscal).strip(), str(nombres_f).strip(), str(dependencias_fk)) : id 
            for id, id_fiscal, nombres_f, dependencias_fk in cursor.fetchall() }
    cursor.close()
    return data





def clean_value(val):
    """
    Convierte el valor a cadena limpia.
    Si el valor es None, NaN, 'nan', 'none' o una cadena vacía, retorna None.
    """
    if pd.isna(val):
        return None
    try:
        val_str = str(val).strip()
    except Exception:
        return None
    if val_str.lower() in ["nan", "none"] or val_str == "":
        return None
    return val_str

def get_or_create_value(cursor, conn, lookup_dict, table, column1, value1, column2=None, value2=None):
    """
    Busca el valor en el diccionario; si no lo encuentra, lo inserta en la tabla y actualiza el diccionario.
    Utiliza ON DUPLICATE KEY UPDATE para obtener el ID existente si se intenta insertar un duplicado.
    Devuelve el ID correspondiente o None si el valor está vacío.
    
    Para dos columnas, se forma una clave compuesta (tupla) con (value1_clean, value2_clean).
    """
    # Limpiar value1
    value1_clean = clean_value(value1)
    if value1_clean is None:
        print(f"DEBUG: Valor para {column1} es inválido: {value1}")
        return None

    if column2 is None:
        key = value1_clean
        if key in lookup_dict:
            return lookup_dict[key]
        print(f"Inserting into {table}: {column1} = '{value1_clean}'")
        insert_query = f"INSERT INTO {table} ({column1}) VALUES (%s) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)"
        cursor.execute(insert_query, (value1_clean,))
        conn.commit()
        new_id = cursor.lastrowid
        lookup_dict[key] = new_id
        return new_id
    else:
        # Limpiar value2
        value2_clean = clean_value(value2)
        if value2_clean is None:
            value2_clean = ""
        key = (value1_clean, value2_clean)
        if key in lookup_dict:
            return lookup_dict[key]
        print(f"Inserting into {table}: {column1} = '{value1_clean}', {column2} = '{value2_clean}'")
        insert_query = f"INSERT INTO {table} ({column1}, {column2}) VALUES (%s, %s) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)"
        cursor.execute(insert_query, (value1_clean, value2_clean))
        conn.commit()
        new_id = cursor.lastrowid
        lookup_dict[key] = new_id
        return new_id






def get_or_create_fiscal(cursor, conn, lookup_dict, id_fiscal, nombres_f, email_f, dni_f, dependencias_fk):
    """
    Inserta o recupera un registro en la tabla 'fiscales' utilizando una clave compuesta que incluye:
        - id_fiscal (se normaliza; si está vacío, se asigna 'sin codigo')
        - nombres_f (se espera que sea el identificador principal del fiscal)
        - dependencias_fk (el id de la dependencia a la que pertenece)
    
    Además, se usan los campos email_f y dni_f (con valores por defecto si son vacíos).
    
    Utiliza ON DUPLICATE KEY UPDATE para obtener el ID del registro existente si se intenta insertar un duplicado.
    Actualiza el diccionario de búsqueda (lookup_dict) con la clave compuesta.
    
    Devuelve el ID del fiscal.
    """
    # Normalizar y asignar valores por defecto
    id_fiscal = str(id_fiscal).strip() if id_fiscal and str(id_fiscal).strip() != "" else "sin codigo"
    nombres_f = str(nombres_f).strip() if nombres_f and str(nombres_f).strip() != "" else None
    email_f = str(email_f).strip() if email_f and str(email_f).strip() != "" else "sin correo"
    dni_f = str(dni_f).strip() if dni_f and str(dni_f).strip() != "" else "sin dni"
    dependencias_fk = str(dependencias_fk).strip() if dependencias_fk else None

    # Si no hay nombre o dependencia, no podemos identificar al fiscal
    if not nombres_f or not dependencias_fk:
        return None

    # Formar la clave compuesta. Convertimos dependencias_fk a cadena para incluirla en la tupla.
    key = (id_fiscal, nombres_f, dependencias_fk)

    # Si ya está en el diccionario, retornamos su ID.
    if key in lookup_dict:
        return lookup_dict[key]

    # Construir la consulta de inserción
    insert_query = """
        INSERT INTO fiscales (id_fiscal, nombres_f, email_f, dni_f, dependencias_fk)
        VALUES (%s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)
    """
    cursor.execute(insert_query, (id_fiscal, nombres_f, email_f, dni_f, dependencias_fk))
    conn.commit()
    new_id = cursor.lastrowid
    lookup_dict[key] = new_id
    return new_id



def convert_datetime(value):
    if pd.isna(value):
        return None
    # Si ya es un objeto datetime, formatearlo directamente.
    if isinstance(value, (datetime, pd.Timestamp)):
        return value.strftime("%Y-%m-%d %H:%M:%S")
    
    value_str = str(value).strip()
    if value_str == "":
        return None
    
    formats = [
        "%d/%m/%Y %H:%M:%S:%f",
        "%d/%m/%Y %H:%M:%S",
        "%d/%m/%Y",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d %H:%M:%S.%f"
    ]
    for fmt in formats:
        try:
            return datetime.strptime(value_str, fmt).strftime("%Y-%m-%d %H:%M:%S")
        except ValueError:
            continue
    print(f"⚠️ Fecha inválida: {value_str}")
    return None




def buscar_id_depen(id_dependencia):
    conn = get_db_connection()
    if conn is None:
        return False  # Si no hay conexión a la BD, se asume que no se encontró.

    try:
        cursor = conn.cursor()
        query = "SELECT * FROM dependencias WHERE id = %s"
        cursor.execute(query, (id_dependencia,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()

        return result[0] > 0  # Retorna True si encontró al menos una coincidencia.
    
    except Error as e:
        print(f"❌ Error en la consulta dependencia: {e}")
        return False  # En caso de error, se asume que no se encontró.




@app.post("/upload-file")
async def upload_file(
    file: UploadFile = File(...),
    id_dependencia: Optional[int] = Form(None),
    tipo_archivo: Optional[int] = Form(None)
):
    # Validar el parámetro tipo_archivo, si se requiere que sea uno de dos valores específicos
    if tipo_archivo not in [1, 2,3]:
        return {"error": "El valor de tipo_archivo debe ser 'carga_deltio' o 'control_plazo' o 'tipo_delitos'"}
    
    if tipo_archivo == 1:
        if id_dependencia:
            if buscar_id_depen(id_dependencia):
                result = await process_carga_deltio(file, id_dependencia)
                return result
            else:
                return {"message": "❌ No se encontró la dependencia..."}
        else:
            return {"message": "⚠️ Ingrese un id válido!."}
    else:
        # Aquí puedes implementar la lógica para tipo_archivo == 2, si corresponde.
        result = await process_control_plazo(file)

        return result



async def process_carga_deltio(file: UploadFile, id_dependencia: int) -> dict:
    try:
        contents = await file.read()
        print(f"Tamaño del archivo recibido: {len(contents)} bytes")

        # Procesar según extensión
        if file.filename.endswith(".csv"):
            detected = chardet.detect(contents)
            encoding = detected.get("encoding")
            if not encoding:
                raise HTTPException(status_code=400, detail="❌ No se pudo detectar la codificación del archivo.")
            print(f"Codificación detectada: {encoding}")
            df = pd.read_csv(io.StringIO(contents.decode(encoding)), dtype=str)
        elif file.filename.endswith(".xlsx"):
            df = pd.read_excel(io.BytesIO(contents), dtype=str)
        else:
            raise HTTPException(status_code=400, detail="❌ Formato no soportado. Solo CSV o XLSX.")

        # Reemplazar valores "nan" por cadena vacía
        df = df.replace(to_replace=["nan", "NaN"], value="")

        print("Columnas detectadas en el archivo:", df.columns.tolist())

        required_columns = {"condicion", "de_estado", "de_etapa", "de_mat_deli", "fe_asig", "fe_conclusion",
                            "fe_denuncia", "fe_ing_caso", "id_unico", "no_fiscal", "tx_tipo_caso"}
        if not required_columns.issubset(df.columns):
            missing = required_columns - set(df.columns)
            return {"error": f"Faltan columnas: {missing}"}

        # Convertir fechas
        for col in ["fe_asig", "fe_conclusion", "fe_denuncia", "fe_ing_caso"]:
            df[col] = df[col].apply(lambda x: convert_datetime(x) if pd.notna(x) else None)

        print("Primeras filas del DataFrame:")
        #print(df.head())

        # Abrir conexión a la base de datos
        conn = get_db_connection()
        if conn is None:
            raise HTTPException(status_code=500, detail="Error de conexión con la base de datos")
        cursor = conn.cursor()

        # Desactivar restricciones para acelerar inserción
        cursor.execute("SET FOREIGN_KEY_CHECKS=0;")
        cursor.execute("SET UNIQUE_CHECKS=0;")

        # Preconsultar IDs
        condicion_dict = prefetch_ids(conn, "condicion", "nombre")
        estado_dict = prefetch_ids(conn, "estado", "id_estado", "estado")
        etapa_dict = prefetch_ids(conn, "etapas", "id_etapa", "etapa")
        fiscal_dict = prefetch_fiscales(conn)
        delito_dict = prefetch_ids(conn, "casos_tipo_delito", "nombre_delito")

        # Preparar datos para 'casos' e 'incidencias'
        datos_casos = []
        datos_incidencias = []
        for _, row in df.iterrows():
            codi_caso = clean_value(row.get("id_unico"))
            fiscal_id = get_or_create_fiscal(
                cursor, conn, fiscal_dict,
                row.get("id_fiscal"), row.get("no_fiscal"),
                row.get("email_f"), row.get("dni_f"),
                id_dependencia
            )
            estado_id = get_or_create_value(
                cursor, conn, estado_dict, "estado",
                "id_estado", clean_value(row.get("id_estado")),
                "estado", clean_value(row.get("de_estado"))
            )
            etapa_id = get_or_create_value(
                cursor, conn, etapa_dict, "etapas",
                "id_etapa", clean_value(row.get("id_etapa")),
                "etapa", clean_value(row.get("de_etapa"))
            )
            condicion_id = get_or_create_value(
                cursor, conn, condicion_dict, "condicion",
                "nombre", clean_value(row.get("condicion"))
            )
            delito_id = get_or_create_value(
                cursor, conn, delito_dict, "casos_tipo_delito",
                "nombre_delito", clean_value(row.get("de_mat_deli"))
            )

            datos_casos.append((
                codi_caso,
                fiscal_id,
                clean_value(row.get("fe_denuncia")),
                clean_value(row.get("fe_ing_caso")),
                clean_value(row.get("fe_asig")),
                clean_value(row.get("fe_conclusion")),
                clean_value(row.get("tx_tipo_caso")),
                condicion_id,
                estado_id,
                etapa_id
            ))
            if delito_id:
                datos_incidencias.append((codi_caso, delito_id))

        # Insertar casos en bloque con ON DUPLICATE KEY UPDATE
        casos_query = """
            INSERT INTO casos (
                codi_caso, fiscal_fk, fe_denuncia, fe_ing_caso, fe_asignacion, fe_conclucion,
                tx_tipo_caso, condicion_fk, estado_fk, etapa_fk
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                fiscal_fk = VALUES(fiscal_fk),
                fe_denuncia = VALUES(fe_denuncia),
                fe_ing_caso = VALUES(fe_ing_caso),
                fe_asignacion = VALUES(fe_asignacion),
                fe_conclucion = VALUES(fe_conclucion),
                tx_tipo_caso = VALUES(tx_tipo_caso),
                condicion_fk = VALUES(condicion_fk),
                estado_fk = VALUES(estado_fk),
                etapa_fk = VALUES(etapa_fk)
        """
        cursor.executemany(casos_query, datos_casos)
        conn.commit()
        
        print(f"Se insertaron/actualizaron {cursor.rowcount} registros en 'casos'")

        # Obtener mapeo entre codi_caso y id (la PK autogenerada en 'casos')
        codi_casos = list({row[0] for row in datos_casos})
        placeholders = ", ".join(["%s"] * len(codi_casos))
        mapping_query = f"SELECT id, codi_caso FROM casos WHERE codi_caso IN ({placeholders})"
        cursor.execute(mapping_query, codi_casos)
        casos_mapping = {codi: id for id, codi in cursor.fetchall()}
        #print("Mapping de codi_caso a id:", casos_mapping)

        # Convertir datos_incidencias (con codi_caso) a registros con id real
        incidencias_final = []
        for codi, delito in datos_incidencias:
            if codi in casos_mapping:
                incidencias_final.append((casos_mapping[codi], delito))

        # Insertar incidencias en bloque
        if incidencias_final:
            incidencia_query = """
                INSERT INTO incidencias (casos_fk, t_delito_fk)
                VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE t_delito_fk = VALUES(t_delito_fk)
            """
            cursor.executemany(incidencia_query, incidencias_final)
            conn.commit()

        # Reactivar restricciones
        cursor.execute("SET FOREIGN_KEY_CHECKS=1;")
        cursor.execute("SET UNIQUE_CHECKS=1;")

        cursor.close()
        conn.close()

        return {"message": "✅ Archivo importado correctamente", 
                "dependencia": id_dependencia,
                "archivo": "carga con delitos"}

    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return {"error": str(e)}






##### -------------------------------------------control de plazos----///////////////////////////////////

async def process_control_plazo(file: UploadFile) -> dict:
    try:
        contents = await file.read()
        print(f"Tamaño del archivo recibido: {len(contents)} bytes")

        # Procesar según extensión
        if file.filename.endswith(".csv"):
            detected = chardet.detect(contents)
            encoding = detected.get("encoding")
            if not encoding:
                raise HTTPException(status_code=400, detail="❌ No se pudo detectar la codificación del archivo.")
            df = pd.read_csv(io.StringIO(contents.decode(encoding)), dtype=str)
        elif file.filename.endswith(".xlsx"):
            df = pd.read_excel(io.BytesIO(contents), dtype=str)
        else:
            raise HTTPException(status_code=400, detail="❌ Formato no soportado. Solo CSV o XLSX.")

        # Reemplazar valores "nan" por cadena vacía
        df = df.replace(to_replace=["nan", "NaN"], value="")

        print("Columnas detectadas en el archivo:", df.columns.tolist())

        required_columns = {"id_unico", "etapa", "estado", "fh_estado", "color", "plazo", "tipo_caso", "dias", "des_observacion_plazo", "dias_paralizacion", "dias_total_transcurrido"}
        if not required_columns.issubset(df.columns):
            missing = required_columns - set(df.columns)
            return {"error": f"Faltan columnas: {missing}"}

        # Convertir fechas
        df["fh_estado"] = df["fh_estado"].apply(lambda x: convert_datetime(x) if pd.notna(x) else None)

        print("Primeras filas del DataFrame:")
        print(df.head())

        # Abrir conexión a la base de datos
        conn = get_db_connection()
        if conn is None:
            raise HTTPException(status_code=500, detail="Error de conexión con la base de datos")
        cursor = conn.cursor()

        # Desactivar restricciones para acelerar inserción
        cursor.execute("SET FOREIGN_KEY_CHECKS=0;")
        cursor.execute("SET UNIQUE_CHECKS=0;")

        # Preconsultar IDs
        color_dict = prefetch_ids(conn, "color_plazo", "color")
        etapa_dict = prefetch_ids(conn, "etapas", "id_etapa", "etapa")
        estado_dict = prefetch_ids(conn, "estado", "id_estado", "estado")
        casos_dict = prefetch_ids(conn, "casos", "codi_caso")

        # Preparar datos para insertar
        datos_control_plazo = []
        for _, row in df.iterrows():
            codi_caso = clean_value(row.get("id_unico"))

            # Buscar o crear el caso
            caso_id = get_or_create_value(
                cursor, conn, casos_dict, "casos",
                "codi_caso", codi_caso
            )

            # Obtener o crear valores relacionados
            color_id = get_or_create_value(
                cursor, conn, color_dict, "color_plazo",
                "color", clean_value(row.get("color"))
            )
            estado_id = get_or_create_value(
                cursor, conn, estado_dict, "estado",
                "id_estado", clean_value(row.get("estado")),
                "estado", clean_value(row.get("estado"))
            )
            etapa_id = get_or_create_value(
                cursor, conn, etapa_dict, "etapas",
                "id_etapa", clean_value(row.get("etapa")),
                "etapa", clean_value(row.get("etapa"))
            )

            datos_control_plazo.append((
                caso_id,
                clean_value(row.get("fh_estado")),
                color_id,
                clean_value(row.get("plazo")),
                clean_value(row.get("tipo_caso")),
                clean_value(row.get("dias")),
                clean_value(row.get("des_observacion_plazo")),
                clean_value(row.get("dias_paralizacion")),
                clean_value(row.get("dias_total_transcurrido"))
            ))

        # Insertar control de plazos en bloque con ON DUPLICATE KEY UPDATE
        control_plazo_query = """
            INSERT INTO control_plazo (
                caso_fk, f_estado, color_fk, plazo, tipo_caso, dias,
                observacion_plazo, dias_paralizados, dias_total_transcurridos
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                f_estado = VALUES(f_estado),
                color_fk = VALUES(color_fk),
                plazo = VALUES(plazo),
                tipo_caso = VALUES(tipo_caso),
                dias = VALUES(dias),
                observacion_plazo = VALUES(observacion_plazo),
                dias_paralizados = VALUES(dias_paralizados),
                dias_total_transcurridos = VALUES(dias_total_transcurridos)
        """
        cursor.executemany(control_plazo_query, datos_control_plazo)
        conn.commit()

        # Reactivar restricciones
        cursor.execute("SET FOREIGN_KEY_CHECKS=1;")
        cursor.execute("SET UNIQUE_CHECKS=1;")

        cursor.close()
        conn.close()

        return {"message": "✅ Archivo de control de plazos importado correctamente"}

    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return {"error": str(e)}
    
    


#####--------------------------**********************************

@app.post("/upload-delitos")
async def upload_delitos(
    file: UploadFile = File(...),
    id_dependencia: Optional[int] = Form(None)
):
    if id_dependencia is None:
        return {"message": "⚠️ Ingrese un id_dependencia válido."}
    if not buscar_id_depen(id_dependencia):
        return {"message": "❌ No se encontró la dependencia."}
    
    result = await process_delitos_excel(file, id_dependencia)
    return result




async def process_delitos_excel(file: UploadFile, id_dependencia: int) -> dict:
    try:
        # Leer el contenido del archivo Excel
        contents = await file.read()
        print(f"Tamaño del archivo recibido: {len(contents)} bytes")
        
        # Procesar el archivo Excel usando pandas
        df = pd.read_excel(io.BytesIO(contents), dtype=str)
        df = df.replace(to_replace=["nan", "NaN"], value="")
        
        print("Columnas detectadas en el archivo:", df.columns.tolist())
        
        # Definir las columnas requeridas para la jerarquía de delitos
        required_columns = {"generica", "sub_gen", "especif"}
        if not required_columns.issubset(df.columns):
            missing = required_columns - set(df.columns)
            return {"error": f"Faltan columnas: {missing}"}
        
        # Abrir conexión a la base de datos
        conn = get_db_connection()
        if conn is None:
            raise HTTPException(status_code=500, detail="Error de conexión con la base de datos")
        cursor = conn.cursor()
        
        # Desactivar restricciones para acelerar inserción
        cursor.execute("SET FOREIGN_KEY_CHECKS=0;")
        cursor.execute("SET UNIQUE_CHECKS=0;")
        
        # Preconsultar las tablas de referencia
        # Para la tabla generico usamos la columna "generica"
        generico_dict = prefetch_ids(conn, "generico", "generica")
        # Para la tabla sud_generico usamos la columna "sub_gen"
        sub_generico_dict = prefetch_ids(conn, "sud_generico", "sub_gen")
        # Para la tabla casos_tipo_delito usamos la columna "nombre_delito"
        delito_dict = prefetch_ids(conn, "casos_tipo_delito", "nombre_delito")
        
        # Preparar lista de inserciones para control_delitos
        datos_control_delitos = []
        
        for _, row in df.iterrows():
            # Limpiar valores de cada columna
            generica_val = clean_value(row.get("generica"))
            sub_gen_val = clean_value(row.get("sub_gen"))
            especif_val = clean_value(row.get("especif"))
            
            if not generica_val or not sub_gen_val or not especif_val:
                print(f"DEBUG: Faltan datos en la fila: {row}")
                continue  # O bien, registrar error y continuar
            
            # Insertar o recuperar el ID en la tabla 'generico'
            gen_fk = get_or_create_value(cursor, conn, generico_dict, "generico", "generica", generica_val)
            # Insertar o recuperar el ID en la tabla 'sud_generico'
            sub_gen_fk = get_or_create_value(cursor, conn, sub_generico_dict, "sud_generico", "sub_gen", sub_gen_val)
            # Insertar o recuperar el ID en la tabla 'casos_tipo_delito'
            tipo_delito_fk = get_or_create_value(cursor, conn, delito_dict, "casos_tipo_delito", "nombre_delito", especif_val)
            
            # Preparar datos para control_delitos: si existen los tres IDs, agregarlos junto con id_dependencia
            if gen_fk and sub_gen_fk and tipo_delito_fk:
                datos_control_delitos.append((
                    gen_fk,
                    sub_gen_fk,
                    tipo_delito_fk,
                    id_dependencia
                ))
        
        # Insertar los registros en bloque en la tabla 'control_delitos'
        if datos_control_delitos:
            control_delitos_query = """
                INSERT INTO control_delitos (
                    gen_fk, sub_gen_fk, tipo_delito_fk, dependencia_fk
                )
                VALUES (%s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE 
                    gen_fk = VALUES(gen_fk),
                    sub_gen_fk = VALUES(sub_gen_fk),
                    tipo_delito_fk = VALUES(tipo_delito_fk)
            """
            cursor.executemany(control_delitos_query, datos_control_delitos)
            conn.commit()
            print(f"Se insertaron/actualizaron {cursor.rowcount} registros en 'control_delitos'")
        else:
            print("No se encontraron registros válidos para insertar en control_delitos")
        
        # Reactivar restricciones
        cursor.execute("SET FOREIGN_KEY_CHECKS=1;")
        cursor.execute("SET UNIQUE_CHECKS=1;")
        
        cursor.close()
        conn.close()
        
        return {"message": "✅ Archivo de delitos importado correctamente",
                "dependencia": id_dependencia,
                "registros": len(datos_control_delitos)}
    
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return {"error": str(e)}
