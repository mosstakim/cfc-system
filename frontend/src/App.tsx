import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <nav className="main-nav">
        <Link to="/" className="nav-link">Accueil</Link>
        <Link to="/register" className="nav-link">Inscription</Link>
        <Link to="/login" className="nav-link">Connexion</Link>
        <Link to="/dashboard" className="nav-link">Tableau de bord</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
