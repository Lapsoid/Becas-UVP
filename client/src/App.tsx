import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import ListaConvocatorias from './components/Convocatorias';
import Status from './components/Status';
import GestionConvocatorias from './components/GestionConvocatorias';

function App() {
  // Verificar si el usuario está autenticado
  const isAuthenticated = !!localStorage.getItem('userRole');

  return (
    <Router>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
        <Route path="/convocatorias" element={isAuthenticated ? <ListaConvocatorias /> : <Navigate to="/" />} />
        <Route path="/status" element={isAuthenticated ? <Status /> : <Navigate to="/" />} />
        <Route path="/gestion-convocatorias" element={isAuthenticated ? <GestionConvocatorias /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;