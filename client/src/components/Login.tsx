import { useState } from 'react';
import logoUVP from '../assets/logo_uvp_black.png';
import Modal from './Modal';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    matricula: '',
    email: '',
    password: '',
    rol: 'ALUMNO'
  });
  
  const [alertInfo, setAlertInfo] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email: formData.email, password: formData.password } : formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Guardar datos del usuario en localStorage
        localStorage.setItem('userRole', data.rol || 'ALUMNO');
        localStorage.setItem('userEmail', data.email || formData.email);
        localStorage.setItem('userId', data.id || '');
        // Al tener éxito, redirigimos a la vista de home
        window.location.href = '/home';
      } else {
        setAlertInfo({
          isOpen: true,
          title: 'Error de Autenticación',
          message: 'Error en la autenticación. Verifica tus datos.'
        });
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setAlertInfo({
        isOpen: true,
        title: 'Error de Conexión',
        message: 'No se pudo conectar con el servidor.'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      {/* Encabezado Institucional */}
      <header className="p-6 flex justify-center items-center bg-white shadow-sm">
        <div className="flex flex-col items-center">
          <div className="h-16 px-6 bg-[#8B2B91] flex items-center justify-center rounded">
            <img src={logoUVP} alt="UVP Logo" className="h-12 w-auto object-contain" />
          </div>
          <h1 className="text-sm mt-2 text-gray-500 uppercase tracking-widest font-semibold">
            Sistema de Gestión de Becas
          </h1>
        </div>
      </header>

      {/* Card de Autenticación */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          
          {/* Toggles de Pestaña */}
          <div className="flex mb-8 border-b">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-4 font-bold transition ${isLogin ? 'border-b-2 border-[#8B2B91] text-[#8B2B91]' : 'text-gray-400'}`}
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-4 font-bold transition ${!isLogin ? 'border-b-2 border-[#8B2B91] text-[#8B2B91]' : 'text-gray-400'}`}
            >
              Registrarse
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} style={{ minHeight: '300px' }}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input 
                  name="nombre"
                  type="text" 
                  required={!isLogin}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2B91] focus:border-transparent outline-none transition"
                />
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
                <input 
                  name="matricula"
                  type="text" 
                  required={!isLogin}
                  onChange={handleInputChange}
                  placeholder="Ej. 20261234"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2B91] focus:border-transparent outline-none transition"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Institucional</label>
              <input 
                name="email"
                type="email" 
                required
                onChange={handleInputChange}
                placeholder="tu.correo@uvp.mx"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2B91] focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input 
                name="password"
                type="password" 
                required
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2B91] focus:border-transparent outline-none transition"
              />
            </div>
            <button type="submit" className="w-full bg-[#8B2B91] hover:bg-[#7a2580] text-white font-bold py-3 rounded-lg transition duration-300 shadow-md mt-6">
              {isLogin ? 'Acceder al Portal' : 'Crear Cuenta'}
            </button>
          </form>
          
          {isLogin && (
            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-[#8B2B91] hover:underline">¿Olvidaste tu contraseña?</a>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-100 p-8 border-t border-gray-200">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Ayuda y Soporte</h3>
            <p>Si tienes problemas para acceder, contacta a servicios escolares o al área de sistemas de la universidad.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Aviso de Privacidad</h3>
            <p>Tus datos están protegidos bajo la normativa vigente de la institución.</p>
          </div>
        </div>
      </footer>

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

export default Login;