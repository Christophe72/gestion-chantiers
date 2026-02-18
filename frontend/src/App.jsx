import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useApi, readApiBase, normalizeApiBaseFunc } from "./hooks/useApi";
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

  async function testApiConnection(url) {
    if (!url.trim()) {
      alert("Veuillez entrer une URL valide");
      return;
    }
    try {
      const normalized = normalizeApiBaseFunc(url);
      if (!normalized.startsWith("http")) {
        alert("URL doit commencer par http:// ou https://");
        return false;
      }
      const testUrl = `${normalized}/api/clients?size=10`;
      console.log("Test connexion API:", testUrl);
      const response = await fetch(testUrl);
      if (response.ok) {
        alert("✅ Connexion OK! API répond correctement.");
        return true;
      } else {
        alert(`❌ Erreur ${response.status} ${response.statusText}\n\nVérifiez que le backend démarre sur:\n${normalized}`);
        return false;
      }
    } catch (err) {
      alert(`❌ Impossible de se connecter\n\nErreur: ${err.message}\n\nVérifications:\n1. Backend démarré sur http://localhost:8080?\n2. Avez-vous la bonne URL?\n3. CORS activé sur le backend?`);
      return false;
    }
  }

  function handleSetApiBase() {
    if (!apiBaseInput.trim()) {
      alert("Veuillez entrer une URL valide");
      return;
    }
    const normalized = normalizeApiBaseFunc(apiBaseInput);
    if (!normalized.startsWith("http")) {
      alert("❌ URL invalide. Exemples valides:\n- http://localhost:8080\n- 127.0.0.1:8080\n- https://api.example.com");
      return;
    }
    setApiBase(normalized);
    localStorage.setItem("apiBase", normalized);
    setApiBaseInput(normalized);
    setShowSettings(false);
  }

  async function handleTestAndConnect() {
    const connected = await testApiConnection(apiBaseInput);
    if (connected) {
      handleSetApiBase();
    }
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
          <p>Entrez l'URL de base de votre API backend:</p>
          <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}>
            Exemples acceptés:<br/>
            • <code>localhost:8080</code><br/>
            • <code>127.0.0.1:8080</code><br/>
            • <code>http://localhost:8080</code><br/>
            • <code>https://api.example.com</code>
          </p>
          <input
            type="text"
            placeholder="localhost:8080"
            value={apiBaseInput}
            onChange={e => setApiBaseInput(e.target.value)}
            onKeyPress={e => e.key === "Enter" && handleTestAndConnect()}
            className="settings-input"
          />
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <button onClick={handleTestAndConnect} className="btn-primary" style={{ flex: 1 }}>
              🔍 Tester & Connecter
            </button>
            <button onClick={handleSetApiBase} className="btn-secondary" style={{ flex: 1 }}>
              Connecter (direct)
            </button>
          </div>
          {status.message && (
            <div
              className={`status-message ${status.isError ? "error" : "success"}`}
              style={{ marginBottom: "1rem" }}
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
