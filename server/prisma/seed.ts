import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? '' }),
});

async function main() {
  // 1. Crear un Administrador de prueba
  await prisma.usuario.upsert({
    where: { matricula: '12345' },
    update: {},
    create: {
      matricula: '12345',
      nombre: 'Admin UVP',
      email: 'admin@uvp.mx',
      password: 'adminpassword', // En prod usaremos bcrypt
      rol: 'ADMIN',
    },
  });

  // 2. Crear Convocatorias iniciales
  await prisma.convocatoria.createMany({
    data: [
      {
        nombre: 'Beca de Excelencia 2026',
        descripcion: 'Para alumnos con promedio sobresaliente.',
        tipo: 'EXCELENCIA',
        promedioMinimo: 9.6,
        fechaApertura: new Date(),
        fechaCierre: new Date('2026-12-31'),
      },
      {
        nombre: 'Beca Deportiva "Linces"',
        descripcion: 'Representantes de equipos universitarios.',
        tipo: 'DEPORTIVA',
        promedioMinimo: 8.5,
        fechaApertura: new Date(),
        fechaCierre: new Date('2026-11-30'),
      }
    ],
  });

  console.log('Datos de prueba cargados correctamente');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());