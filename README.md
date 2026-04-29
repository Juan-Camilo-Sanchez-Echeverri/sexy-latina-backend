# Sexy Latina

## Tecnologías

- **Backend:** NestJS (Node.js)
- **Base de Datos:** MongoDB con Mongoose
- **Caché:** Redis
- **Autenticación:** JWT
- **Documentación API:** Swagger
- **Inteligencia Artificial:** OpenAI
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

| Servicio         | Contenedor           | Puerto externo             |
| ---------------- | -------------------- | -------------------------- |
| Backend (NestJS) | backend-dev          | `${PORT}`                  |
| MongoDB 4.4      | mongodb-primary-dev  | — (solo red interna)       |
| Redis            | redis-dev            | `${REDIS_PORT}`            |
| Redis Commander  | redis-commander-dev  | 8082                       |

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