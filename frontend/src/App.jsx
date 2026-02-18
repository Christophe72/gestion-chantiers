import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useApi, readApiBase } from "./hooks/useApi";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import ClientsList from "./components/ClientsList";
import TechniciensList from "./components/TechniciensList";
import ChantiersLIst from "./components/ChantiersLIst";
import "./App.css";


const STATUT_LABELS = {
  BROUILLON: "Brouillon",
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  VALIDE: "Validé",
  REFUSE: "Refusé"
};

const ROUTES = {
  clients: "/api/clients",
  techniciens: "/api/techniciens",
  chantiers: "/api/chantiers"
};

export default function App() {
  const [apiBaseInput, setApiBaseInput] = useState(readApiBase());
  const [apiBase, setApiBase] = useState(readApiBase());
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem("darkMode") === "true"
  );
  const [showSettings, setShowSettings] = useState(!apiBase);

  const { api, status } = useApi(apiBase);

  // Dark mode effect
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  function handleSetApiBase() {
    if (!apiBaseInput.trim()) {
      alert("Veuillez entrer une URL valide");
      return;
    }
    setApiBase(apiBaseInput);
    localStorage.setItem("apiBase", apiBaseInput);
    setShowSettings(false);
  }

  function handleToggleDarkMode() {
    setDarkMode(!darkMode);
  }

  // Settings modal pour configurer l'API
  if (showSettings || !apiBase) {
    return (
      <div className="app settings-modal">
        <div className="settings-content">
          <h2>Configuration API</h2>
          <p>Entrez l'URL de base de votre API:</p>
          <input
            type="text"
            placeholder="http://localhost:8080"
            value={apiBaseInput}
            onChange={e => setApiBaseInput(e.target.value)}
            onKeyPress={e => e.key === "Enter" && handleSetApiBase()}
            className="settings-input"
          />
          <button onClick={handleSetApiBase} className="btn-primary">
            Connecter
          </button>
          {status.message && (
            <div
              className={`status-message ${status.isError ? "error" : "success"}`}
            >
              {status.message}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Navigation
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          apiBase={apiBase}
          onApiBaseChange={setApiBase}
        />

        {/* Status message */}
        {status.message && (
          <div
            className={`status-bar ${status.isError ? "error" : "success"}`}
          >
            {status.message}
          </div>
        )}

        {/* Routes */}
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={<Dashboard api={api} apiBase={apiBase} />}
            />
            <Route
              path="/clients"
              element={<ClientsList api={api} apiBase={apiBase} />}
            />
            <Route
              path="/techniciens"
              element={<TechniciensList api={api} apiBase={apiBase} />}
            />
            <Route
              path="/chantiers"
              element={<ChantiersLIst api={api} apiBase={apiBase} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
