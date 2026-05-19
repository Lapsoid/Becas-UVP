import 'dotenv/config'; // ¡Debe ser la línea 1!
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Instancia del cliente de Prisma para interactuar con Postgres
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? '' }),
});
const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde tu frontend (Vite)
app.use(express.json()); // Permite que el servidor reciba datos en formato JSON

// --- RUTAS DE PRUEBA ---

// Ruta para verificar que el servidor funciona
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor de Becas UVP activo' });
});

// Ruta para listar usuarios (útil para verificar la conexión con la DB)
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
});

// ==================== AUTENTICACIÓN ====================

// LOGIN: Email + Password
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscamos al usuario por su email
    const usuario = await prisma.usuario.findUnique({
      where: { email: email },
    });

    // Verificación básica de seguridad
    if (usuario && usuario.password === password) {
      res.status(200).json({ 
        message: 'Acceso concedido', 
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol 
      });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor de base de datos' });
  }
});

// REGISTRO: Nombre + Matrícula + Email + Password + Rol
app.post('/api/register', async (req, res) => {
  const { nombre, matricula, email, password, rol } = req.body;

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await prisma.usuario.findFirst({
      where: { 
        OR: [
          { email: email },
          { matricula: matricula }
        ]
      }
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email o matrícula ya está registrado' });
    }

    // Crear nuevo usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        matricula,
        email,
        password, // En producción, esto debe estar hasheado
        rol: rol || 'ALUMNO'
      }
    });

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      id: nuevoUsuario.id,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// ==================== CONVOCATORIAS ====================

// GET: Obtener todas las convocatorias
app.get('/api/convocatorias', async (req, res) => {
  try {
    const convocatorias = await prisma.convocatoria.findMany({
      orderBy: { fechaCierre: 'asc' }
    });
    res.json(convocatorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener convocatorias' });
  }
});

// POST: Crear nueva convocatoria (solo admin)
app.post('/api/convocatorias', async (req, res) => {
  const { nombre, descripcion, tipo, promedioMinimo, fechaCierre } = req.body;

  try {
    const nuevaConvocatoria = await prisma.convocatoria.create({
      data: {
        nombre,
        descripcion,
        tipo,
        promedioMinimo,
        fechaApertura: new Date(),
        fechaCierre: new Date(fechaCierre)
      }
    });

    res.status(201).json(nuevaConvocatoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear convocatoria' });
  }
});

// PUT: Actualizar convocatoria (solo admin)
app.put('/api/convocatorias/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, tipo, promedioMinimo, fechaCierre } = req.body;

  try {
    const convocatoriaActualizada = await prisma.convocatoria.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        descripcion,
        tipo,
        promedioMinimo,
        fechaCierre: new Date(fechaCierre)
      }
    });

    res.json(convocatoriaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar convocatoria' });
  }
});

// DELETE: Eliminar convocatoria (solo admin)
app.delete('/api/convocatorias/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.convocatoria.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Convocatoria eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar convocatoria' });
  }
});

// GET: Obtener solicitudes de una convocatoria
app.get('/api/convocatorias/:id/solicitudes', async (req, res) => {
  const { id } = req.params;

  try {
    const solicitudes = await prisma.solicitud.findMany({
      where: { convocatoriaId: parseInt(id) },
      include: { usuario: true }
    });

    res.json(solicitudes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener solicitudes de la convocatoria' });
  }
});

// ==================== SOLICITUDES ====================

// GET: Obtener solicitudes del usuario
app.get('/api/solicitudes/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const solicitudes = await prisma.solicitud.findMany({
      where: { usuarioId: parseInt(usuarioId) },
      include: { convocatoria: true }
    });

    res.json(solicitudes.map(s => ({
      id: s.id,
      convocatoriaId: s.convocatoriaId,
      convocatoriaNombre: s.convocatoria.nombre,
      estado: s.estado.toLowerCase(),
      fechaSolicitud: s.fechaEnvio,
      fechaActualizacion: s.fechaEnvio
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
});

// POST: Crear solicitud (postularse a convocatoria)
app.post('/api/solicitudes', async (req, res) => {
  const { usuarioId, convocatoriaId } = req.body;

  try {
    // Verificar que el usuario no haya solicitado ya esta convocatoria
    const solicitudExistente = await prisma.solicitud.findFirst({
      where: {
        usuarioId: parseInt(usuarioId),
        convocatoriaId: parseInt(convocatoriaId)
      }
    });

    if (solicitudExistente) {
      return res.status(400).json({ error: 'Ya has solicitado esta convocatoria' });
    }

    const nuevaSolicitud = await prisma.solicitud.create({
      data: {
        usuarioId: parseInt(usuarioId),
        convocatoriaId: parseInt(convocatoriaId),
        estado: 'EN_REVISION',
        grado: '',
        promedio: 0,
        curp: '',
        edad: 0,
        direccion: '',
        localidad: '',
        cp: '',
        telefono: '',
        correo: '',
        motivo: '',
        cardexUrl: ''
      }
    });

    res.status(201).json({ 
      message: 'Solicitud creada exitosamente',
      solicitud: nuevaSolicitud
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear solicitud' });
  }
});

// DELETE: Cancelar solicitud
app.delete('/api/solicitudes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.solicitud.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Solicitud cancelada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cancelar solicitud' });
  }
});

// PUT: Actualizar estado de una solicitud
app.put('/api/solicitudes/:id/estado', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const solicitudActualizada = await prisma.solicitud.update({
      where: { id: parseInt(id) },
      data: { estado }
    });
    res.json(solicitudActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el estado de la solicitud' });
  }
});

// Puerto de ejecución
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});