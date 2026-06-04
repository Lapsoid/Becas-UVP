import Navbar from './Navbar';
import { useEffect, useState } from 'react';

// ESTRUCTURA DE SOLICITUD
interface Solicitud {
  id: number;
  convocatoriaId: number;
  convocatoriaNombre: string;
  convocatoriaFechaCierre?: string;
  estado: 'en_revision' | 'aprobado' | 'denegado';
  fechaSolicitud: string;
  fechaActualizacion: string;
}

// COMPONENTE PRINCIPAL (VISTA DE ESTADO DE SOLICITUDES DEL ALUMNO)
const Status = () => {
  // ESTADOS DE DATOS DE LA SOLICITUD
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  // EFECTOS (CARGA DE SOLICITUDES DESDE LA API)
  useEffect(() => {
    // Obtener las solicitudes realizadas por el alumno logueado
    if (userId) {
      fetch(`http://localhost:3000/api/solicitudes/${userId}`)
        .then(res => res.json())
        .then(data => {
          setSolicitudes(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching solicitudes:', error);
          setLoading(false);
        });
    }
  }, [userId]);

  // FUNCIONES AUXILIARES DE VISTA Y BADGES
  // Obtener el color de fondo y texto del badge de estado
  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return 'bg-green-100 text-green-800';
      case 'denegado':
        return 'bg-red-100 text-red-800';
      case 'en_revision':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Obtener el icono representativo del estado
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return '✓';
      case 'denegado':
        return '✕';
      case 'en_revision':
      default:
        return '⏳';
    }
  };

  // Formatear el texto legible del estado
  const formatEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return 'Aprobada';
      case 'denegado':
        return 'Rechazada';
      case 'en_revision':
      default:
        return 'En Revisión';
    }
  };

  // Pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-center text-gray-600">Cargando solicitudes...</p>
        </main>
      </div>
    );
  }

  // VISTA / RENDERIZADO JSX
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de Navegación */}
      <Navbar />
      
      {/* Contenedor Principal */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Estado de Mis Solicitudes</h1>
          <p className="text-gray-600">Consulta el estado de tus solicitudes de beca</p>
        </div>

        {/* Tarjeta sin solicitudes o lista de solicitudes */}
        {solicitudes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sin solicitudes</h2>
            <p className="text-gray-600 mb-6">No has realizado solicitudes de beca aún</p>
            <a 
              href="/convocatorias"
              className="inline-block bg-[#8B2B91] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7a2580] transition"
            >
              Ver Convocatorias
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {solicitudes.map((solicitud) => (
              <div key={solicitud.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#8B2B91]">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{solicitud.convocatoriaNombre}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="text-gray-400">Fecha de Solicitud</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(solicitud.fechaSolicitud).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Fecha de Cierre de Convocatoria</p>
                        <p className="font-semibold text-red-600">
                          {solicitud.convocatoriaFechaCierre 
                            ? new Date(solicitud.convocatoriaFechaCierre).toLocaleDateString() 
                            : 'No disponible'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Badge de estado de la postulación */}
                  <div className="ml-4">
                    <div className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${getEstadoBadgeColor(solicitud.estado)}`}>
                      <span className="text-lg">{getEstadoIcon(solicitud.estado)}</span>
                      <span className="capitalize">{formatEstadoTexto(solicitud.estado)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Caja informativa de leyenda de Estados */}
        <div className="mt-12 bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">Información sobre Estados</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li><strong>En Revisión:</strong> Tu solicitud está siendo revisada por el departamento de becas</li>
            <li><strong>Aprobada:</strong> ¡Felicidades! Tu solicitud ha sido aprobada</li>
            <li><strong>Rechazada:</strong> Lamentablemente, tu solicitud no fue aprobada. Contacta a servicios escolares para más información</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Status;
