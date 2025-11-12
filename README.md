# Cloudflare Worker + Supabase CRUD Demo

Este proyecto es una **prueba de concepto (POC)** que demuestra cómo
conectar un **Cloudflare Worker** con **Supabase** y un API externo
(JSONPlaceholder).\
El flujo de datos es el siguiente:

    app => http => jsonplaceholder
                     \> supabase

## 📁 Estructura del Proyecto

    src/
    │
    ├── index.ts                      # Punto de entrada del Worker
    ├── services/
    │   ├── supabaseClient.ts         # Inicializa el cliente de Supabase
    │   └── connectionService.ts      # Lógica CRUD para la tabla ts_connection
    │
    ├── handlers/
    │   └── connectionHandler.ts      # Controlador de las peticiones HTTP
    │
    ├── utils/
    │   ├── validation.ts             # Validaciones y sanitización de datos
    │   └── response.ts               # Helper para formatear respuestas JSON
    │
    ├── types/
    │   └── connection.ts             # Definición de tipos TypeScript
    │
    ├── wrangler.toml                 # Configuración de Cloudflare Workers
    └── package.json

## ⚙️ Requisitos

-   Node.js 18+\
-   Wrangler CLI\
-   Cuenta y proyecto en Supabase\
-   Variables de entorno configuradas

## 🔐 Variables de Entorno

Crea un archivo `.env` o usa los **secrets** en Wrangler con:

``` bash
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_KEY
```

## 🧠 Tabla en Supabase

La tabla usada en este proyecto es **ts_connection** con los siguientes
campos:

  --------------------------------------------------------------------------------
  Campo           Tipo                 Descripción
  --------------- -------------------- -------------------------------------------
  id              uuid (PK, default    Identificador único
                  gen_random_uuid())

  type            text                 Tipo de conexión

  user_id         text                 Identificador del usuario

  message         text                 Mensaje o detalle

  created_at      timestamptz          Fecha de creación
  --------------------------------------------------------------------------------

## 🚀 Despliegue

1.  **Compilar TypeScript**

    ``` bash
    npm run build
    ```

2.  **Ejecutar localmente**

    ``` bash
    wrangler dev
    ```

3.  **Desplegar**

    ``` bash
    wrangler deploy
    ```

## 🔍 Endpoints Disponibles

  -----------------------------------------------------------------------------------------------
  Método   Endpoint                 Descripción                   Ejemplo de uso
  -------- ------------------------ ----------------------------- -------------------------------
  GET      `/api/connections`       Obtiene todas las conexiones  `GET /api/connections`

  GET      `/api/connections/:id`   Obtiene una conexión          `GET /api/connections/123`
                                    específica

  POST     `/api/connections`       Crea una nueva conexión       `POST /api/connections`

  PUT      `/api/connections/:id`   Actualiza una conexión        `PUT /api/connections/123`
                                    existente

  DELETE   `/api/connections/:id`   Elimina una conexión          `DELETE /api/connections/123`
  -----------------------------------------------------------------------------------------------

## 🧪 Ejemplos con Insomnia

### Crear conexión

``` json
POST /api/connections
{
  "type": "async",
  "user_id": "user_123",
  "message": "Conexión establecida correctamente"
}
```

### Actualizar conexión

``` json
PUT /api/connections/abc123
{
  "message": "Conexión actualizada"
}
```

### Eliminar conexión

``` http
DELETE /api/connections/abc123
```

### Obtener todas las conexiones

``` http
GET /api/connections
```

## 🧱 Tecnologías

-   Cloudflare Workers (Wrangler v3)
-   Supabase (PostgreSQL + REST API)
-   JSONPlaceholder (API externa simulada)
-   TypeScript
