import Navbar from './Navbar';
import Modal from './Modal';
import { useEffect, useState } from 'react';

interface Usuario {
  id: number;
  nombre: string;
  matricula: string;
  email: string;
}

interface Solicitud {
  id: number;
  estado: string;
  promedio: number;
  usuario: Usuario;
  grado: string;
  curp: string;
  edad: number;
  direccion: string;
  localidad: string;
  cp: string;
  telefono: string;
  correo: string;
  motivo: string;
  cardexPdf: string;
  fechaEnvio: string;
}

interface Convocatoria {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  promedioMinimo: number;
  fechaCierre: string;
  estado?: string;
}

const GestionConvocatorias = () => {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showSolicitudesModal, setShowSolicitudesModal] = useState(false);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState<Convocatoria | null>(null);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(false);
  const [expandedSolicitudId, setExpandedSolicitudId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'académica',
    promedioMinimo: 0,
    fechaCierre: ''
  });
  
  const [alertInfo, setAlertInfo] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: '',
    message: ''
  });

  useEffect(() => {
    fetchConvocatorias();
  }, []);

  const fetchConvocatorias = () => {
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
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'promedioMinimo' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:3000/api/convocatorias/${editingId}`
      : 'http://localhost:3000/api/convocatorias';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchConvocatorias();
        resetForm();
        setShowForm(false);
        setAlertInfo({
          isOpen: true,
          title: 'Operación Exitosa',
          message: editingId ? 'Convocatoria actualizada con éxito' : 'Convocatoria creada con éxito'
        });
      } else {
        setAlertInfo({
          isOpen: true,
          title: 'Error',
          message: 'Error al guardar la convocatoria'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlertInfo({
        isOpen: true,
        title: 'Error de Conexión',
        message: 'Error de conexión con el servidor.'
      });
    }
  };

  const handleEdit = (convocatoria: Convocatoria) => {
    setFormData({
      nombre: convocatoria.nombre,
      descripcion: convocatoria.descripcion,
      tipo: convocatoria.tipo,
      promedioMinimo: convocatoria.promedioMinimo,
      fechaCierre: convocatoria.fechaCierre
    });
    setEditingId(convocatoria.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta convocatoria?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/convocatorias/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchConvocatorias();
          setAlertInfo({
            isOpen: true,
            title: 'Eliminado',
            message: 'Convocatoria eliminada con éxito'
          });
        } else {
          setAlertInfo({
            isOpen: true,
            title: 'Error',
            message: 'Error al eliminar la convocatoria'
          });
        }
      } catch (error) {
        console.error('Error:', error);
        setAlertInfo({
          isOpen: true,
          title: 'Error de Conexión',
          message: 'Error de conexión con el servidor.'
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      tipo: 'ACADEMICA',
      promedioMinimo: 0,
      fechaCierre: ''
    });
    setEditingId(null);
  };

  const handleViewSolicitudes = async (convocatoria: Convocatoria) => {
    setSelectedConvocatoria(convocatoria);
    setShowSolicitudesModal(true);
    setLoadingSolicitudes(true);
    setExpandedSolicitudId(null);
    try {
      const response = await fetch(`http://localhost:3000/api/convocatorias/${convocatoria.id}/solicitudes`);
      if (response.ok) {
        const data = await response.json();
        setSolicitudes(data);
      } else {
        setAlertInfo({
          isOpen: true,
          title: 'Error',
          message: 'Error al obtener solicitudes'
        });
      }
    } catch (error) {
      console.error(error);
      setAlertInfo({
        isOpen: true,
        title: 'Error de Conexión',
        message: 'Error de conexión con el servidor.'
      });
    } finally {
      setLoadingSolicitudes(false);
    }
  };

  const handleUpdateSolicitudStatus = async (solicitudId: number, estado: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/solicitudes/${solicitudId}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado })
      });

      if (response.ok) {
        setSolicitudes(solicitudes.map(s => s.id === solicitudId ? { ...s, estado } : s));
      } else {
        setAlertInfo({
          isOpen: true,
          title: 'Error',
          message: 'Error al actualizar el estado de la solicitud.'
        });
      }
    } catch (error) {
      console.error(error);
      setAlertInfo({
        isOpen: true,
        title: 'Error de Conexión',
        message: 'Error de conexión con el servidor.'
      });
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Convocatorias</h1>
            <p className="text-gray-600">Administra las convocatorias de becas disponibles</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="bg-[#8B2B91] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7a2580] transition"
          >
            {showForm ? 'Cancelar' : '+ Nueva Convocatoria'}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8 border-l-4 border-[#8B2B91]">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? 'Editar Convocatoria' : 'Nueva Convocatoria'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B2B91] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B2B91] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B2B91] focus:border-transparent"
                  >
                    <option value="ACADEMICA">Académica</option>
                    <option value="DEPORTIVA">Deportiva</option>
                    <option value="CULTURAL">Cultural</option>
                    <option value="SOCIOECONOMICA">Socioeconómica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Promedio Mínimo</label>
                  <input
                    type="number"
                    name="promedioMinimo"
                    value={formData.promedioMinimo}
                    onChange={handleInputChange}
                    step="0.1"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B2B91] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Cierre</label>
                <input
                  type="date"
                  name="fechaCierre"
                  value={formData.fechaCierre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B2B91] focus:border-transparent"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-[#8B2B91] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#7a2580] transition"
                >
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal de Solicitudes */}
        <Modal
          isOpen={showSolicitudesModal}
          onClose={() => setShowSolicitudesModal(false)}
          title={`Solicitudes para ${selectedConvocatoria?.nombre || ''}`}
        >
          {loadingSolicitudes ? (
            <p className="text-center text-gray-500 my-8">Cargando solicitudes...</p>
          ) : solicitudes.length === 0 ? (
            <p className="text-center text-gray-500 my-8">No hay solicitudes para esta convocatoria.</p>
          ) : (
            <div className="space-y-4">
              {solicitudes.map((solicitud) => (
                <div key={solicitud.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{solicitud.usuario?.nombre || 'Estudiante'}</h3>
                      <div className="flex gap-4 mt-1 text-sm text-gray-600">
                        <p><span className="font-semibold">Promedio:</span> {solicitud.promedio}</p>
                        <p><span className="font-semibold">Estado:</span> 
                          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                            solicitud.estado === 'APROBADO' ? 'bg-green-100 text-green-800' : 
                            solicitud.estado === 'DENEGADO' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {solicitud.estado}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setExpandedSolicitudId(expandedSolicitudId === solicitud.id ? null : solicitud.id)}
                        className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-200 transition"
                      >
                        {expandedSolicitudId === solicitud.id ? 'Ocultar info' : 'Ver info'}
                      </button>
                      
                      {solicitud.estado === 'EN_REVISION' ? (
                        <>
                          <button
                            onClick={() => handleUpdateSolicitudStatus(solicitud.id, 'APROBADO')}
                            className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-700 transition"
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={() => handleUpdateSolicitudStatus(solicitud.id, 'DENEGADO')}
                            className="bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-red-700 transition"
                          >
                            Negar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleUpdateSolicitudStatus(solicitud.id, 'EN_REVISION')}
                          className="bg-orange-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-orange-600 transition"
                        >
                          Cancelar selección
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Información expandida */}
                  {expandedSolicitudId === solicitud.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                      <div><span className="font-semibold text-gray-700">Matrícula:</span> {solicitud.usuario?.matricula}</div>
                      <div><span className="font-semibold text-gray-700">Correo:</span> {solicitud.correo}</div>
                      <div><span className="font-semibold text-gray-700">Teléfono:</span> {solicitud.telefono}</div>
                      <div><span className="font-semibold text-gray-700">CURP:</span> {solicitud.curp}</div>
                      <div><span className="font-semibold text-gray-700">Edad:</span> {solicitud.edad} años</div>
                      <div><span className="font-semibold text-gray-700">Grado:</span> {solicitud.grado}</div>
                      <div className="md:col-span-2"><span className="font-semibold text-gray-700">Dirección:</span> {solicitud.direccion}, {solicitud.localidad}, CP {solicitud.cp}</div>
                      <div className="md:col-span-2"><span className="font-semibold text-gray-700">Motivo:</span> <p className="mt-1 text-gray-600">{solicitud.motivo}</p></div>
                      {solicitud.cardexPdf && (
                        <div className="md:col-span-2 mt-2">
                          <a href={`http://localhost:3000${solicitud.cardexPdf}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            Ver Cárdex (PDF)
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Modal>

        {/* Lista de Convocatorias */}
        {convocatorias.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📢</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sin convocatorias</h2>
            <p className="text-gray-600 mb-6">No hay convocatorias creadas aún</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-block bg-[#8B2B91] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7a2580] transition"
            >
              Crear Primera Convocatoria
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {convocatorias.map((convocatoria) => (
              <div key={convocatoria.id} className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-[#8B2B91]">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{convocatoria.nombre}</h3>
                      <p className="text-gray-600 mb-4">{convocatoria.descripcion}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-400 uppercase">Tipo</p>
                          <p className="font-semibold text-gray-800 capitalize">{convocatoria.tipo}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase">Promedio Mínimo</p>
                          <p className="font-semibold text-gray-800">{convocatoria.promedioMinimo}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase">Fecha de Cierre</p>
                          <p className="font-semibold text-gray-800">
                            {new Date(convocatoria.fechaCierre).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase">Estado</p>
                          <p className="font-semibold text-[#8B2B91]">Activa</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => handleViewSolicitudes(convocatoria)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      Solicitudes
                    </button>
                    <button
                      onClick={() => handleEdit(convocatoria)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(convocatoria.id)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

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
    </div>
  );
};

export default GestionConvocatorias;
