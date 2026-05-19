import Navbar from './Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Bienvenido al Sistema de Gestión de Becas</h1>
          <p className="text-gray-600 text-lg">
            Portal de gestión de becas y apoyos educativos de la Universidad del Valle de Puebla
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Información General */}
          <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-[#8B2B91]">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Información General</h2>
            <p className="text-gray-600 mb-4">
              El área de Servicios Escolares ofrece diversos programas de becas y apoyos económicos para estudiantes.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#8B2B91] font-bold mr-2">•</span>
                <span>Becas por desempeño académico</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8B2B91] font-bold mr-2">•</span>
                <span>Becas por situación socioeconómica</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8B2B91] font-bold mr-2">•</span>
                <span>Becas por participación en actividades culturales</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8B2B91] font-bold mr-2">•</span>
                <span>Becas por excelencia deportiva</span>
              </li>
            </ul>
          </div>

          {/* Procesos y Requisitos */}
          <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-[#8B2B91]">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Procesos y Requisitos</h2>
            <p className="text-gray-600 mb-4">
              Para participar en nuestros programas de becas, es importante que cumplas con los siguientes requisitos:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#8B2B91] font-bold mr-2">✓</span>
                <span>Ser estudiante activo de la UVP</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8B2B91] font-bold mr-2">✓</span>
                <span>Mantener una asistencia mínima</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8B2B91] font-bold mr-2">✓</span>
                <span>Presentar documentación requerida</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#8B2B91] font-bold mr-2">✓</span>
                <span>Cumplir con los criterios académicos</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Enlaces Rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/convocatorias" className="bg-[#8B2B91] text-white rounded-lg p-6 hover:bg-[#7a2580] transition shadow-md">
              <h3 className="font-bold text-lg mb-2">Ver Convocatorias</h3>
              <p className="text-sm">Accede a todas las convocatorias de becas disponibles</p>
            </a>
            <a href="/status" className="bg-[#8B2B91] text-white rounded-lg p-6 hover:bg-[#7a2580] transition shadow-md">
              <h3 className="font-bold text-lg mb-2">Mis Solicitudes</h3>
              <p className="text-sm">Revisa el estado de tus solicitudes de beca</p>
            </a>
            <div className="bg-gray-100 text-gray-600 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Contacto</h3>
              <p className="text-sm">servicios.escolares@uvp.edu.mx</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
