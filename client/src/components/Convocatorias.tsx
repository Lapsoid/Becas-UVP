import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Modal from './Modal';
import SolicitudForm from './SolicitudForm';

// ESTRUCTURA DE CONVOCATORIA
interface Convocatoria {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  promedioMinimo: number;
  fechaApertura: string;
  fechaCierre: string;
}

// COMPONENTE PRINCIPAL (LISTADO DE CONVOCATORIAS DISPONIBLES)
export const ListaConvocatorias = () => {
  // ESTADOS DEL COMPONENTE
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState<Convocatoria | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: '',
    message: ''
  });

  // CARGA DE CONVOCATORIAS DESDE LA API
  useEffect(() => {
    fetch('http://localhost:3000/api/convocatorias')
      .then(res => res.json())
      .then(data => {
        setConvocatorias(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching convocatorias:', error);
        setLoading(false);
      });
  }, []);

  // MANEJADORES DE POSTULACIONES Y ENVIÓ DEL FORMULARIO
  const handlePostulateClick = async (convocatoriaId: number) => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (!userId) {
      setAlertInfo({
        isOpen: true,
        title: 'Acceso Denegado',
        message: 'Debes iniciar sesión para postularte'
      });
      return;
    }

    if (userRole === 'ADMIN') {
      setAlertInfo({
        isOpen: true,
        title: 'Acción No Permitida',
        message: 'Los administradores no pueden postularse a las convocatorias.'
      });
      return;
    }

    const targetConvocatoria = convocatorias.find(c => c.id === convocatoriaId);
    if (!targetConvocatoria) return;

    try {
      const solicitudesRes = await fetch(`http://localhost:3000/api/solicitudes/${userId}`);
      if (solicitudesRes.ok) {
        const userSolicitudes = await solicitudesRes.json();
        
        const hasSameType = userSolicitudes.some((solicitud: any) => {
          const appliedConvocatoria = convocatorias.find(c => c.id === solicitud.convocatoriaId);
          return appliedConvocatoria && appliedConvocatoria.tipo === targetConvocatoria.tipo;
        });

        if (hasSameType) {
          setAlertInfo({
            isOpen: true,
            title: 'Límite de Postulaciones',
            message: `Ya te has postulado a una convocatoria de tipo ${targetConvocatoria.tipo}. No puedes solicitar otra del mismo tipo.`
          });
          return;
        }
      }

      setSelectedConvocatoria(targetConvocatoria);
      setShowModal(true);
    } catch (error) {
      console.error('Error:', error);
      setAlertInfo({
        isOpen: true,
        title: 'Error de Conexión',
        message: 'Ocurrió un error al conectar con el servidor.'
      });
    }
  };

  // Manejador para enviar el formulario de postulación
  const handleFormSubmit = async (formData: FormData) => {
    const userId = localStorage.getItem('userId');
    if (!userId || !selectedConvocatoria) return;

    setSubmitting(true);
    try {
      formData.append('usuarioId', userId);
      formData.append('convocatoriaId', selectedConvocatoria.id.toString());

      const response = await fetch('http://localhost:3000/api/solicitudes', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setAlertInfo({
          isOpen: true,
          title: 'Postulación Exitosa',
          message: '¡Te has postulado exitosamente!'
        });
        setShowModal(false);
        setSelectedConvocatoria(null);
      } else {
        const errorData = await response.json().catch(() => null);
        setAlertInfo({
          isOpen: true,
          title: 'Error al Postularse',
          message: errorData?.error || 'Error al postularte. Intenta nuevamente.'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlertInfo({
        isOpen: true,
        title: 'Error de Conexión',
        message: 'Error de conexión con el servidor.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Vista de pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-center text-gray-600">Cargando convocatorias...</p>
        </main>
      </div>
    );
  }

  // VISTA / RENDERIZADO JSX (GRID Y MODALES)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de Navegación */}
      <Navbar />
      
      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Convocatorias Disponibles</h1>
        
        {/* Grid de Convocatorias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {convocatorias
            .filter((beca) => {
              const hoy = new Date();
              hoy.setHours(0, 0, 0, 0);
              return new Date(beca.fechaCierre) >= hoy;
            })
            .map((beca) => (
            <div key={beca.id} className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-[#8B2B91] p-6 hover:scale-105 transition-transform">
              <span className="text-xs font-bold uppercase px-2 py-1 bg-purple-100 text-[#8B2B91] rounded-full">
                {beca.tipo}
              </span>
              <h2 className="text-xl font-bold mt-3 text-gray-800">{beca.nombre}</h2>
              <p className="text-gray-600 mt-2 text-sm line-clamp-3">{beca.descripcion}</p>
              
              {/* Fechas de la Convocatoria */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-t border-dashed pt-3 pb-1">
                <div>
                  <p className="text-gray-400 font-medium">Fecha De Apertura</p>
                  <p className="font-semibold text-gray-700">
                    {new Date(beca.fechaApertura).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Fecha De Cierre</p>
                  <p className="font-semibold text-gray-700">
                    {new Date(beca.fechaCierre).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Promedio Mínimo y Botón de Postulación */}
              <div className="mt-4 flex justify-between items-center border-t pt-4">
                <div className="text-sm">
                  <p className="text-gray-400">Promedio Mínimo</p>
                  <p className="font-bold text-[#8B2B91]">{beca.promedioMinimo}</p>
                </div>
                <button 
                  onClick={() => handlePostulateClick(beca.id)}
                  className="bg-[#8B2B91] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#7a2580] transition"
                >
                  Postularse
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Formulario de Postulación */}
        <Modal
          isOpen={showModal}
          onClose={() => { setShowModal(false); setSelectedConvocatoria(null); }}
          title="Postularse a Convocatoria"
          size="md"
        >
          {selectedConvocatoria && (
            <SolicitudForm
              convocatoria={selectedConvocatoria}
              onSubmit={handleFormSubmit}
              onCancel={() => { setShowModal(false); setSelectedConvocatoria(null); }}
              loading={submitting}
            />
          )}
        </Modal>

        {/* Modal de Alerta */}
        <Modal
          isOpen={alertInfo.isOpen}
          onClose={() => setAlertInfo({ ...alertInfo, isOpen: false })}
          title={alertInfo.title}
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-600">{alertInfo.message}</p>
            <button
              onClick={() => setAlertInfo({ ...alertInfo, isOpen: false })}
              className="w-full bg-[#8B2B91] hover:bg-[#7a2580] text-white font-bold py-2 rounded-lg transition"
            >
              Aceptar
            </button>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default ListaConvocatorias;