import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Modal from './Modal';
import SolicitudForm from './SolicitudForm';

interface Convocatoria {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  promedioMinimo: number;
  fechaCierre: string;
}

export const ListaConvocatorias = () => {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState<Convocatoria | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handlePostulateClick = async (convocatoriaId: number) => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (!userId) {
      alert('Debes iniciar sesión para postularte');
      return;
    }

    if (userRole === 'ADMIN') {
      alert('Los administradores no pueden postularse a las convocatorias.');
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
          alert(`Ya te has postulado a una convocatoria de tipo ${targetConvocatoria.tipo}. No puedes solicitar otra del mismo tipo.`);
          return;
        }
      }

      setSelectedConvocatoria(targetConvocatoria);
      setShowModal(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const handleFormSubmit = async (formData: any) => {
    const userId = localStorage.getItem('userId');
    if (!userId || !selectedConvocatoria) return;

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:3000/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: parseInt(userId),
          convocatoriaId: selectedConvocatoria.id,
          ...formData
        })
      });

      if (response.ok) {
        alert('¡Te has postulado exitosamente!');
        setShowModal(false);
        setSelectedConvocatoria(null);
      } else {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.error || 'Error al postularte. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Convocatorias Disponibles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {convocatorias.map((beca) => (
            <div key={beca.id} className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-[#8B2B91] p-6 hover:scale-105 transition-transform">
              <span className="text-xs font-bold uppercase px-2 py-1 bg-purple-100 text-[#8B2B91] rounded-full">
                {beca.tipo}
              </span>
              <h2 className="text-xl font-bold mt-3 text-gray-800">{beca.nombre}</h2>
              <p className="text-gray-600 mt-2 text-sm line-clamp-3">{beca.descripcion}</p>
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

        {/* Modal de postulación */}
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
      </main>
    </div>
  );
};

export default ListaConvocatorias;