# Sexy Latina

## Tecnologías

- **Backend:** NestJS (Node.js)
- **Base de Datos:** MongoDB con Mongoose
- **Caché:** Redis
- **Autenticación:** JWT
- **Documentación API:** Swagger
- **Almacenamiento:** Sistema de archivos local

## Requerimientos

- Node.js (v20 o superior)
- npm
- MongoDB (v6 o superior)
- Redis
- Docker y Docker Compose (opcional)

## Clonar el Proyecto

Para clonar el proyecto y ubicarse en la carpeta del proyecto, se deben ejecutar los siguientes comandos:

```bash
git clone URL_DEL_REPOSITORIO
cd sexy-latina
```

## Instalación de Node.js o NVM (Node Version Manager)

Si se tiene instalado [Node.js](https://nodejs.org/) o [NVM](https://github.com/nvm-sh/nvm) en el sistema, se puede saltar este paso.

Para instalar Node.js, se debe ejecutar el siguiente comando:

```bash
sudo apt-get update

sudo apt-get install nodejs

# Para verificar la versión de Node.js
node -v
```

Si se desea instalar NVM, se deben ejecutar los siguientes comandos:

```bash
# Descargar e instalar nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Instalar la última versión de Node.js
nvm install node

# Verificar la instalación:
node -v

# Verificar la instalación de npm:
npm -v
```

## Instalación de Docker (Opcional)

Asegúrese de tener [Docker](https://www.docker.com/) instalado. Si no, siga los siguientes pasos para instalarlo.

### Instalar Docker

```bash
# Instalar Docker:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Añadir el repositorio a las fuentes de Apt:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
```

### Instalar los paquetes de Docker

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Verificar la instalación

Verifique que la instalación sea exitosa ejecutando la imagen hello-world:

```bash
sudo docker run hello-world
```

Si tiene problemas con la instalación, revise la siguiente [Documentación oficial de Docker](https://docs.docker.com/engine/install/ubuntu/).

## Instalar Dependencias

Para instalar las dependencias, se debe ejecutar el siguiente comando:

```bash
npm install
```

## Configurar Variables de Entorno

Cree los archivos de entorno necesarios en la raíz del proyecto y añada las variables de entorno necesarias. Puede usar el archivo de ejemplo como referencia.

- Para entorno **local**:

  ```bash
  cp .env.example .env.local
  ```

- Para entorno de **desarrollo**:

  ```bash
  cp .env.example .env.development
  ```

- Para entorno de **producción**:

  ```bash
  cp .env.example .env
  ```

Edite los archivos `.env.local`, `.env.development` y `.env` con sus configuraciones.

## Explicación de Variables de Entorno

## `PORT`

Puerto donde correrá el backend NestJS.

### Ejemplo

```env
PORT=3000
```

## `NODE_ENV`

Entorno de ejecución de Node.js.

### Valores válidos

```env
NODE_ENV=local
NODE_ENV=development
NODE_ENV=production
```

### Recomendación

- Local → `local`
- Desarrollo → `development`
- Producción → `production`

## `DB_URL`

Cadena de conexión de MongoDB.

## Opción 1: MongoDB Local

```env
DB_URL=mongodb://localhost:27017/sexy-latina
```

## Opción 2: MongoDB Replica Set con Docker

```env
DB_URL=mongodb://mongodb-primary:27017/sexy-latina?replicaSet=rs0
```

## Opción 3: MongoDB Atlas

Registro:
https://www.mongodb.com/cloud/atlas/register

Documentación:
https://www.mongodb.com/docs/atlas/connect-to-database-deployment/

### Pasos

1. Crear cuenta
2. Crear cluster
3. Ir a:

```text
Connect -> Drivers
```

4. Copiar el connection string

### Ejemplo

```env
DB_URL=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/sexy-latina
```

## `FRONT_PUBLIC_URL`

URL pública del frontend.

### Local

```env
FRONT_PUBLIC_URL=http://localhost:4200
```

### Producción

```env
FRONT_PUBLIC_URL=https://sexylatina.co
```

## `ALLOWED_ORIGINS`

Dominios permitidos para consumir la API.

Separados por coma.

### Ejemplo local

```env
ALLOWED_ORIGINS=http://localhost:4200
```

### Ejemplo múltiples dominios

```env
ALLOWED_ORIGINS=http://localhost:4200,https://sexylatina.co,https://admin.sexylatina.co
```

## `DISCORD_WEBHOOK_URL`

Webhook de Discord usado para logs y notificaciones.

## Cómo obtenerlo

Documentación oficial:
https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks

### Pasos

1. Entrar a Discord
2. Configuración del canal
3. Integraciones
4. Webhooks
5. Crear Webhook
6. Copiar URL

## Ejemplo

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxxxx/yyyyy
```

## `USER_NOTIFICATIONS`

Correo usado para enviar emails.

Ejemplo:

```env
USER_NOTIFICATIONS=myapp@gmail.com
```

## `PASSWORD_NOTIFICATIONS`

Contraseña o App Password del correo.

## Recomendación Gmail

Usar:

- Verificación en dos pasos
- App Password

NO usar la contraseña principal de la cuenta.

## Crear App Password Gmail

https://support.google.com/accounts/answer/185833

Ejemplo:

```env
PASSWORD_NOTIFICATIONS=abcd efgh ijkl mnop
```

## `REDIS_HOST`

Host del servidor Redis.

### Local

```env
REDIS_HOST=localhost
```

### Docker

```env
REDIS_HOST=redis
```

## `REDIS_PORT`

Puerto Redis.

### Valor por defecto

```env
REDIS_PORT=6379
```

## `REDIS_PASSWORD`

Contraseña Redis.

Si Redis no tiene contraseña:

```env
REDIS_PASSWORD=
```

## `REDIS_ADMIN_USER`

Usuario para Redis Commander.

```env
REDIS_ADMIN_USER=admin
```

## `REDIS_ADMIN_PASSWORD`

Contraseña para Redis Commander.

Ejemplo:

```env
REDIS_ADMIN_PASSWORD=admin123
```

### `DEFAULT_USER_NAME`

Nombre completo del administrador por defecto.

Ejemplo:

```env
DEFAULT_USER_NAME=Super Admin
```

## `DEFAULT_USER_PHONE`

Número de teléfono del administrador inicial.

Ejemplo:

```env
DEFAULT_USER_PHONE=3001234567
```

## `DEFAULT_USER_DOCUMENT`

Número de documento del administrador inicial.

Ejemplo:

```env
DEFAULT_USER_DOCUMENT=123456789
```

## `DEFAULT_USER_DOCUMENT_TYPE`

Tipo de documento del administrador inicial.

Valores comunes:

```env
DEFAULT_USER_DOCUMENT_TYPE=CC
DEFAULT_USER_DOCUMENT_TYPE=CE
DEFAULT_USER_DOCUMENT_TYPE=PASSPORT
```

## `DEFAULT_USER_EMAIL`

Correo electrónico del administrador inicial.

Este correo será utilizado para iniciar sesión en la plataforma.

Ejemplo:

```env
DEFAULT_USER_EMAIL=admin@sexylatina.co
```

## `DEFAULT_USER_PASSWORD`

Contraseña del administrador inicial.

Recomendaciones:

- Usar una contraseña segura
- Cambiarla después del primer inicio de sesión
- No compartirla públicamente

Ejemplo:

```env
DEFAULT_USER_PASSWORD=Admin123*
```

## Ejecutar en Local

Para iniciar el servidor en la máquina local, ejecute:

**1. Iniciar servicios con Docker (Opcional)**

Si desea usar Docker para MongoDB y Redis:

```bash
# Iniciar MongoDB Replica Set
npm run docker:db

# Iniciar Redis
npm run docker:redis:local
```

**2. Iniciar la aplicación**

```bash
# Modo normal
npm run start

# Modo watch
npm run start:dev
```

El servidor se ejecutará en `http://localhost:<PORT>` donde `<PORT>` es el puerto configurado en el archivo `.env.local`.

## Desarrollo

Para iniciar el proyecto en un servidor de desarrollo, asegúrate primero de contar con los servicios externos:

- **MongoDB en Replica Set** (por ejemplo, MongoDB Atlas o un Replica Set autogestionado)
- **Redis**

Luego elige **una** forma de ejecutar la aplicación:

### Opción A: Desarrollo con Docker (levanta todo)

Esta opción levanta **Backend + MongoDB (Replica Set) + Redis + Redis Commander** usando `.env.development` con un solo comando.

```bash
npm run start:docker:dev
```

Esto levanta los siguientes servicios:

| Servicio         | Contenedor          | Puerto externo       |
| ---------------- | ------------------- | -------------------- |
| Backend (NestJS) | backend-dev         | `${PORT}`            |
| MongoDB 4.4      | mongodb-primary-dev | — (solo red interna) |
| Redis            | redis-dev           | `${REDIS_PORT}`      |
| Redis Commander  | redis-commander-dev | 8082                 |

> Los datos de MongoDB y Redis se persisten en las carpetas `mongo-dev/` y `redis-dev/` respectivamente, en la raíz del proyecto.

#### (Opcional) Restaurar DB inicial / cargar backup

Si estás levantando una base de datos nueva y necesitas cargar un backup (por ejemplo para tener el usuario **superAdmin**), puedes restaurar el dump así:

```bash
# Copiar el backup al contenedor de MongoDB
docker cp startSexyLatina mongodb-primary-dev:/startSexyLatina

# Entrar al contenedor
docker exec -it mongodb-primary-dev bash

# (Opcional) verificar que el archivo exista
ls

# Restaurar a la base de datos "sexy-latina"
mongorestore -d sexy-latina --archive=startSexyLatina
```

#### Ver logs del backend

```bash
docker logs -f backend-dev
```

#### Reconstruir después de cambios

```bash
npm run start:docker:dev
```

#### Detener todos los servicios

```bash
docker compose -f ./docker/docker-compose.dev.yml down
```

### Opción B: Desarrollo con PM2 (app en el host)

**1. Iniciar la aplicación con PM2**

```bash
# Primera vez
npm run pm2:start:dev

# Reiniciar después de cambios
npm run pm2:restart:dev
```

El servidor se ejecutará en `http://localhost:<PORT>` donde `<PORT>` es el puerto configurado en el archivo `.env.development`.

## Producción

Para ejecutar el proyecto en producción, elija **una** de las siguientes opciones:

### Opción A: Producción con Docker (levanta todo)

Esta opción levanta **Backend + MongoDB (Replica Set)** usando `.env`.

```bash
# Iniciar Aplicación (docker-compose.yml) + Redis (docker-compose.redis.yml) + MongoDB (docker-compose.db.yml)
npm run start:docker:prod
```

#### (Opcional) Restaurar DB inicial / cargar backup

Si estás levantando una base de datos nueva y necesitas cargar un backup (por ejemplo para tener el usuario **superAdmin**), puedes restaurar el dump así:

```bash
# Copiar el archivo/backup al contenedor de MongoDB
docker cp startSexyLatina mongodb-primary/:startSexyLatina

# Entrar al contenedor
docker exec -it mongodb-primary bash

# (Opcional) verificar que el archivo exista
ls

# Restaurar a la base de datos "sexy-latina"
mongorestore -d sexy-latina --archive=startSexyLatina
```

#### (Opcional) Reconstruir / levantar el backend después de cambios

Si hiciste cambios en el backend y necesitas reconstruir la imagen y reiniciar el servicio:

```bash
docker compose up -d --build backend
```

El servidor se ejecutará en `http://localhost:<PORT>` donde `<PORT>` es el puerto configurado en el archivo `.env`.

### Opción B: Producción con PM2 (app en el host)

Esta opción ejecuta el backend con PM2 y asume que los servicios externos (MongoDB y Redis) ya están disponibles.

**Importante (MongoDB):** si vas a ejecutar con PM2, asegúrate de usar una base de datos MongoDB en **Replica Set** (por ejemplo, **MongoDB Atlas**, que ya es un clúster replicado) o un Replica Set autogestionado. Algunas funcionalidades comunes (como transacciones/sesiones) requieren Replica Set.

```bash
# Primera vez
npm run pm2:start:prod

# Reiniciar después de cambios
npm run pm2:restart:prod
```

El servidor se ejecutará en `http://localhost:<PORT>` donde `<PORT>` es el puerto configurado en el archivo `.env`.

> Nota: los scripts de PM2 usan `export` (pensados para Linux/macOS). En Windows es recomendable usar WSL/Linux en el servidor o adaptar la forma de definir `NODE_ENV`.

### Opción C: Ejecutar compilado directamente

```bash
# 1. Compilar el proyecto
npm run build

# 2. Ejecutar en producción
npm run start:prod
```

## Uso de PM2

PM2 es un administrador de procesos de Node.js que facilita la gestión de aplicaciones en producción y desarrollo. A continuación, se detallan los pasos para instalar y usar PM2.

### Instalación de PM2

Para instalar PM2 globalmente en el sistema, ejecute:

```bash
npm install -g pm2
```

### Uso de PM2 en Desarrollo

Para iniciar la aplicación en modo desarrollo con PM2, ejecute:

```bash
npm run pm2:start:dev
```

Para reiniciar la aplicación en modo desarrollo con PM2, ejecute:

```bash
npm run pm2:restart:dev
```

El servidor se ejecutará en `http://localhost:<PORT>` donde `<PORT>` es el puerto configurado en el archivo `.env.development`.

### Uso de PM2 en Producción

Para iniciar la aplicación en modo producción con PM2, ejecute:

```bash
npm run pm2:start:prod
```

Para reiniciar la aplicación en modo producción con PM2, ejecute:

```bash
npm run pm2:restart:prod
```

El servidor se ejecutará en `http://localhost:<PORT>` donde `<PORT>` es el puerto configurado en el archivo `.env`.

## Documentación API

Una vez que la aplicación esté corriendo, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:<PORT>/docs



```

```

```
