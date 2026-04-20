import logoUVP from './assets/logo_uvp_black.png';
import icon from './assets/iconUVP.png';
import textlog from './assets/logoUVP.png';
const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      {/*Encabezado con logo y título*/}
      <header className="p-6 flex justify-center items-center bg-white shadow-sm">
        <div className="flex flex-col items-center">
          <div className="h-16 w-full bg-[#8B2B91] flex items-center justify-center rounded">
            <img 
              src={logoUVP} 
              alt="UVP Logo" 
              className="h-12 w-auto object-contain" 
            />
          </div>
          <h1 className="text-sm mt-2 text-gray-500 uppercase tracking-widest font-semibold">
            Sistema de Gestión de Becas
          </h1>
        </div>
      </header>

      {/*Formulario de inicio de sesión*/}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Bienvenido</h2>
            <p className="text-gray-500">Ingresa tus credenciales institucionales</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input 
                type="email" 
                placeholder="tu.correo@uvp.mx"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2B91] focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2B91] focus:border-transparent outline-none transition"
              />
            </div>

            <button className="w-full bg-[#8B2B91] hover:bg-[#7a2580] text-white font-bold py-3 rounded-lg transition duration-300 shadow-md">
              Iniciar Sesión
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-[#8B2B91] hover:underline">¿Olvidaste tu contraseña?</a>
          </div>
        </div>
      </main>

      {/*Pie de página con información de ayuda y aviso de privacidad*/}
      <footer className="bg-gray-100 p-8 border-t border-gray-200">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Ayuda y Soporte</h3>
            <p>Si tienes problemas para acceder, contacta a servicios escolares o al área de sistemas de la universidad.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Aviso de Privacidad</h3>
            <p>Tus datos están protegidos bajo la normativa vigente de protección de datos personales de la institución.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;