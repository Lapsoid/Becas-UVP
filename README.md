# Sistema de Becas UVP 🎓

¡Hola! Bienvenido al repositorio del Sistema de Gestión de Becas para la UVP. Este proyecto está diseñado para facilitar la solicitud y administración de becas.

Este documento te guiará para que puedas levantar el proyecto en tu computadora localmente sin problemas.

## 🚀 Tecnologías que usamos

El proyecto está dividido en dos partes principales (Frontend y Backend) usando las siguientes tecnologías:

### Frontend (`/client`)
- **React 19** con **Vite** (para que todo cargue súper rápido).
- **TypeScript** (para tener código más seguro y con autocompletado).
- **Tailwind CSS 4** (para los estilos, sin tener que escribir mucho CSS manual).
- **React Router** (para navegar entre las diferentes páginas).

### Backend (`/server`)
- **Node.js** con **Express 5** (para crear nuestra API).
- **TypeScript** (igual que en el frontend, para evitar errores tontos).
- **Prisma ORM** (para interactuar con la base de datos de forma fácil).
- **PostgreSQL** (nuestra base de datos relacional).
- **JWT (JSON Web Tokens)** (para el manejo de sesiones y seguridad).

---

## 🛠️ Estructura del Proyecto

El repositorio es un monorepo, lo que significa que tanto el cliente como el servidor viven en la misma carpeta:

```text
Becas-UVP/
├── client/      # Todo el código visual (Frontend en React)
├── server/      # Toda la lógica de negocio y base de datos (Backend en Node/Express)
└── README.md    # Este archivo que estás leyendo
```

---

## ⚙️ ¿Qué necesitas instalar antes de empezar?

Asegúrate de tener instalado lo siguiente en tu computadora:
1. **[Node.js](https://nodejs.org/es/)**: (Versión 18 o superior).
2. **[PostgreSQL](https://www.postgresql.org/)**: Necesitas tener el motor de base de datos instalado y corriendo en tu computadora.

---

## 🏗️ Cómo levantar el proyecto paso a paso

### Paso 1: Clonar el repositorio
Si no lo has hecho, clona el proyecto en tu computadora:
```bash
git clone https://github.com/Lapsoid/Becas-UVP.git
cd Becas-UVP
```

### Paso 2: Configurar el Backend (Servidor)

1. Entra a la carpeta del servidor:
   ```bash
   cd server
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo llamado `.env` dentro de la carpeta `server/` basándote en un archivo `.env.example` (si existe) o agrega la conexión a tu base de datos local de PostgreSQL:
   ```env
   # Ejemplo de variable de entorno (cambia "usuario", "password" y el puerto según tu configuración local)
   DATABASE_URL="postgresql://usuario:password@localhost:5432/sistema_becas?schema=public"
   ```
4. Sincroniza la base de datos con Prisma:
   ```bash
   npx prisma db push
   # o si ya hay migraciones creadas: npx prisma migrate dev
   ```
5. Opcional: Si el proyecto tiene datos semilla (seeders), puedes correrlos:
   ```bash
   npx prisma db seed
   ```
6. Enciende el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   *El servidor debería estar corriendo (generalmente en el puerto 3000 o el que esté configurado).*

### Paso 3: Configurar el Frontend (Cliente)

Abre **otra ventana de la terminal** (deja el servidor corriendo) y sigue estos pasos:

1. Desde la carpeta raíz del proyecto, entra a la carpeta del cliente:
   ```bash
   cd client
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Enciende el cliente de desarrollo:
   ```bash
   npm run dev
   ```
   *Esto te dará un enlace local (usualmente `http://localhost:5173`) al que puedes entrar desde tu navegador para ver la aplicación funcionando.*

---

## 👩‍💻 Tips

- **¿Tienes un error de Prisma?** Si modificas el archivo `schema.prisma`, recuerda correr siempre `npx prisma generate` y `npx prisma db push` para que los cambios se reflejen.
- **Prisma Studio:** Si quieres ver qué datos hay en la base de datos con una interfaz gráfica bonita, ve a la carpeta `/server` y corre `npx prisma studio`. Se abrirá en tu navegador.
