import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

export default function Navigation({ darkMode, onToggleDarkMode, apiBase, onApiBaseChange }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <h1>Gestion Chantiers</h1>
        </Link>
      </div>

      <ul className="nav-menu">
        <li>
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/clients"
            className={`nav-link ${isActive("/clients") ? "active" : ""}`}
          >
            Clients
          </Link>
        </li>
        <li>
          <Link
            to="/techniciens"
            className={`nav-link ${isActive("/techniciens") ? "active" : ""}`}
          >
            Techniciens
          </Link>
        </li>
        <li>
          <Link
            to="/chantiers"
            className={`nav-link ${isActive("/chantiers") ? "active" : ""}`}
          >
            Chantiers
          </Link>
        </li>
      </ul>

      <div className="navbar-controls">
        <button
          type="button"
          className="btn-theme"
          onClick={onToggleDarkMode}
          title="Basculer le thème"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}
