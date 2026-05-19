import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logoUVP from '../assets/logo_uvp_black.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail') || '';
  const isAuthenticated = Boolean(userRole);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    setIsMenuOpen(false);
    window.location.href = '/';
  };

  const isActive = (path: string) => {
    if (path.startsWith('/?')) {
      return location.pathname === '/' && location.search.includes('register');
    }

    return location.pathname === path;
  };

  const navItems = [
    { path: '/home', label: 'Home', visible: true },
    { path: '/convocatorias', label: 'Convocatorias', visible: isAuthenticated },
    { path: '/status', label: 'Status', visible: isAuthenticated && userRole?.toUpperCase() === 'ALUMNO' },
    { path: '/gestion-convocatorias', label: 'Gestión de Convocatorias', visible: isAuthenticated && userRole?.toUpperCase() === 'ADMIN' },
    { path: '/', label: 'Iniciar Sesión', visible: !isAuthenticated },
    { path: '/?register=true', label: 'Registrarse', visible: !isAuthenticated },
  ];

  const handleNavigate = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="relative bg-[#8B2B91] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavigate('/home')}>
            <div className="h-10 px-3 bg-white flex items-center justify-center rounded">
              <img src={logoUVP} alt="UVP Logo" className="h-8 w-auto object-contain" />
            </div>
            <span className="font-bold text-sm hidden sm:inline">Gestión de Becas UVP</span>
          </div>

          {/* Hamburguesa siempre visible */}
          <div
            className="relative"
          >
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Abrir menú"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#7a2580] rounded-2xl border border-white/10 shadow-2xl z-50">
                <div className="px-3 py-3 space-y-1">
                  {navItems.map(
                    (item) =>
                      item.visible && (
                        <button
                          key={item.path}
                          onClick={() => handleNavigate(item.path)}
                          className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${isActive(item.path)
                            ? 'bg-white/20 text-white'
                            : 'hover:bg-white/10 text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      )
                  )}

                  {isAuthenticated && (
                    <div className="border-t border-white/10 pt-3">
                      <p className="px-3 py-2 text-xs text-gray-200 truncate">{userEmail}</p>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 transition mt-2"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
