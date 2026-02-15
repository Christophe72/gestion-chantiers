import { useEffect, useMemo, useState } from "react";

const DEFAULT_STATUT = "BROUILLON";

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

function normalizeApiBase(value) {
  const trimmed = (value || "").trim().replace(/\/$/, "");
  if (trimmed.endsWith("/api")) return trimmed.slice(0, -4);
  return trimmed;
}

function readApiBase() {
  return normalizeApiBase(localStorage.getItem("apiBase") || "");
}

function buildUrl(apiBase, path) {
  return `${apiBase}${path}`;
}

function matchesSearch(text, query) {
  if (!query) return true;
  return (text || "").toLowerCase().includes(query.toLowerCase());
}

export default function App() {
  const [apiBaseInput, setApiBaseInput] = useState(readApiBase());
  const [apiBase, setApiBase] = useState(readApiBase());
  const [status, setStatus] = useState({ message: "", isError: false });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  const [clients, setClients] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [chantiers, setChantiers] = useState([]);

  // Search states
  const [searchClient, setSearchClient] = useState("");
  const [searchTechnicien, setSearchTechnicien] = useState("");
  const [searchChantier, setSearchChantier] = useState("");

  // Form states
  const [clientForm, setClientForm] = useState({ nom: "" });
  const [technicienForm, setTechnicienForm] = useState({ nom: "", prenom: "", email: "" });
  const [chantierForm, setChantierForm] = useState({
    reference: "", adresse: "", typeInstallation: "", dateIntervention: "",
    statut: DEFAULT_STATUT, clientId: "", technicienId: ""
  });

  // Edit states
  const [editingClient, setEditingClient] = useState(null);
  const [editingTechnicien, setEditingTechnicien] = useState(null);
  const [editingChantier, setEditingChantier] = useState(null);

  // Delete confirmation modal
  const [deleteModal, setDeleteModal] = useState(null);

  // Dark mode effect
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Filtered data
  const filteredClients = useMemo(() =>
    clients.filter((c) => matchesSearch(c.nom, searchClient)),
    [clients, searchClient]
  );

  const filteredTechniciens = useMemo(() =>
    techniciens.filter((t) =>
      matchesSearch(t.nom, searchTechnicien) ||
      matchesSearch(t.prenom, searchTechnicien) ||
      matchesSearch(t.email, searchTechnicien)
    ),
    [techniciens, searchTechnicien]
  );

  const filteredChantiers = useMemo(() =>
    chantiers.filter((ch) =>
      matchesSearch(ch.reference, searchChantier) ||
      matchesSearch(ch.adresse, searchChantier) ||
      matchesSearch(ch.client?.nom, searchChantier) ||
      matchesSearch(`${ch.technicien?.prenom || ""} ${ch.technicien?.nom || ""}`, searchChantier)
    ),
    [chantiers, searchChantier]
  );

  const api = useMemo(() => {
    return async function request(path, options = {}) {
      const response = await fetch(buildUrl(apiBase, path), {
        headers: { "Content-Type": "application/json" },
        ...options
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status} sur ${path}${text ? ` - ${text}` : ""}`);
      }
      if (response.status === 204) return null;
      return response.json();
    };
  }, [apiBase]);

  function setError(error) {
    setStatus({ message: `Erreur: ${error.message}`, isError: true });
  }

  function chantierClientNom(chantier) {
    return chantier.client?.nom || `#${chantier.client?.id || "?"}`;
  }

  function chantierTechnicienNom(chantier) {
    const t = chantier.technicien;
    if (!t) return "-";
    return `${t.prenom || ""} ${t.nom || ""}`.trim() || `#${t.id || "?"}`;
  }

  async function refreshAll() {
    try {
      const [clientsData, techniciensData, chantiersData] = await Promise.all([
        api(`${ROUTES.clients}?size=200`),
        api(`${ROUTES.techniciens}?size=200`),
        api(`${ROUTES.chantiers}?size=200`)
      ]);

      const loadedClients = clientsData.content || [];
      const loadedTechniciens = techniciensData.content || [];
      const loadedChantiers = chantiersData.content || [];

      setClients(loadedClients);
      setTechniciens(loadedTechniciens);
      setChantiers(loadedChantiers);

      setChantierForm((prev) => ({
        ...prev,
        clientId: loadedClients.some((c) => String(c.id) === prev.clientId)
          ? prev.clientId : String(loadedClients[0]?.id || ""),
        technicienId: loadedTechniciens.some((t) => String(t.id) === prev.technicienId)
          ? prev.technicienId : String(loadedTechniciens[0]?.id || "")
      }));

      setStatus({ message: "Données chargées avec succès", isError: false });
    } catch (error) {
      setError(error);
    }
  }

  useEffect(() => { refreshAll(); }, [api]);

  function applyApiBase() {
    const cleaned = normalizeApiBase(apiBaseInput);
    localStorage.setItem("apiBase", cleaned);
    setApiBaseInput(cleaned);
    setApiBase(cleaned);
  }

  // ── Client CRUD ──
  async function onAddClient(event) {
    event.preventDefault();
    try {
      await api(ROUTES.clients, { method: "POST", body: JSON.stringify({ nom: clientForm.nom }) });
      setClientForm({ nom: "" });
      await refreshAll();
    } catch (error) { setError(error); }
  }

  async function onUpdateClient(id) {
    try {
      await api(`${ROUTES.clients}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ nom: editingClient.nom })
      });
      setEditingClient(null);
      await refreshAll();
    } catch (error) { setError(error); }
  }

  function confirmDeleteClient(client) {
    setDeleteModal({
      title: "Supprimer le client",
      message: `Voulez-vous vraiment supprimer le client "${client.nom}" ?`,
      onConfirm: async () => {
        try {
          await api(`${ROUTES.clients}/${client.id}`, { method: "DELETE" });
          setDeleteModal(null);
          await refreshAll();
        } catch (error) { setDeleteModal(null); setError(error); }
      }
    });
  }

  // ── Technicien CRUD ──
  async function onAddTechnicien(event) {
    event.preventDefault();
    try {
      await api(ROUTES.techniciens, { method: "POST", body: JSON.stringify(technicienForm) });
      setTechnicienForm({ nom: "", prenom: "", email: "" });
      await refreshAll();
    } catch (error) { setError(error); }
  }

  async function onUpdateTechnicien(id) {
    try {
      await api(`${ROUTES.techniciens}/${id}`, {
        method: "PUT",
        body: JSON.stringify(editingTechnicien)
      });
      setEditingTechnicien(null);
      await refreshAll();
    } catch (error) { setError(error); }
  }

  function confirmDeleteTechnicien(tech) {
    setDeleteModal({
      title: "Supprimer le technicien",
      message: `Voulez-vous vraiment supprimer le technicien "${tech.prenom} ${tech.nom}" ?`,
      onConfirm: async () => {
        try {
          await api(`${ROUTES.techniciens}/${tech.id}`, { method: "DELETE" });
          setDeleteModal(null);
          await refreshAll();
        } catch (error) { setDeleteModal(null); setError(error); }
      }
    });
  }

  // ── Chantier CRUD ──
  async function onAddChantier(event) {
    event.preventDefault();
    try {
      await api(ROUTES.chantiers, {
        method: "POST",
        body: JSON.stringify({
          reference: chantierForm.reference,
          adresse: chantierForm.adresse,
          typeInstallation: chantierForm.typeInstallation || null,
          dateIntervention: chantierForm.dateIntervention || null,
          statut: chantierForm.statut,
          signatureClient: null, dateSignature: null,
          clientId: Number(chantierForm.clientId),
          technicienId: Number(chantierForm.technicienId)
        })
      });
      setChantierForm((prev) => ({
        ...prev, reference: "", adresse: "", typeInstallation: "",
        dateIntervention: "", statut: DEFAULT_STATUT
      }));
      await refreshAll();
    } catch (error) { setError(error); }
  }

  function startEditChantier(ch) {
    setEditingChantier({
      id: ch.id,
      reference: ch.reference || "",
      adresse: ch.adresse || "",
      typeInstallation: ch.typeInstallation || "",
      dateIntervention: ch.dateIntervention || "",
      statut: ch.statut || DEFAULT_STATUT,
      clientId: String(ch.client?.id || ""),
      technicienId: String(ch.technicien?.id || "")
    });
  }

  async function onUpdateChantier() {
    try {
      await api(`${ROUTES.chantiers}/${editingChantier.id}`, {
        method: "PUT",
        body: JSON.stringify({
          reference: editingChantier.reference,
          adresse: editingChantier.adresse,
          typeInstallation: editingChantier.typeInstallation || null,
          dateIntervention: editingChantier.dateIntervention || null,
          statut: editingChantier.statut,
          signatureClient: null, dateSignature: null,
          clientId: Number(editingChantier.clientId),
          technicienId: Number(editingChantier.technicienId)
        })
      });
      setEditingChantier(null);
      await refreshAll();
    } catch (error) { setError(error); }
  }

  async function onCloseChantier(id) {
    try {
      await api(`${ROUTES.chantiers}/${id}/cloturer`, { method: "POST" });
      await refreshAll();
    } catch (error) { setError(error); }
  }

  function confirmDeleteChantier(ch) {
    setDeleteModal({
      title: "Supprimer le chantier",
      message: `Voulez-vous vraiment supprimer le chantier "${ch.reference}" ?`,
      onConfirm: async () => {
        try {
          await api(`${ROUTES.chantiers}/${ch.id}`, { method: "DELETE" });
          setDeleteModal(null);
          await refreshAll();
        } catch (error) { setDeleteModal(null); setError(error); }
      }
    });
  }

  return (
    <main className="app">
      {/* ── Header ── */}
      <header className="header">
        <h1>Gestion des chantiers</h1>
        <div className="header-right">
          <button
            type="button"
            className="btn-theme"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Mode jour" : "Mode nuit"}
          >
            {darkMode ? "\u2600\uFE0F" : "\u{1F319}"}
          </button>
          <div className="api-config">
            <label htmlFor="apiBase">API</label>
            <input
              id="apiBase"
              type="text"
              value={apiBaseInput}
              onChange={(e) => setApiBaseInput(e.target.value)}
              placeholder="vide = proxy /api"
            />
            <button type="button" onClick={applyApiBase}>OK</button>
          </div>
        </div>
      </header>

      {/* ── Status bar ── */}
      {status.message && (
        <div className={`status-bar ${status.isError ? "error" : "success"}`}>
          {status.isError ? "\u26A0" : "\u2713"} {status.message}
        </div>
      )}

      {/* ── Clients & Techniciens ── */}
      <div className="panels-row">
        {/* ── Clients ── */}
        <section className="panel">
          <div className="panel-header">
            <h2>Clients</h2>
            <span className="badge">{filteredClients.length}/{clients.length}</span>
          </div>
          <form className="inline-form" onSubmit={onAddClient}>
            <input type="text" placeholder="Nom du client" required
              value={clientForm.nom}
              onChange={(e) => setClientForm({ nom: e.target.value })}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-primary">+ Ajouter</button>
          </form>
          <input type="text" className="search-input" placeholder="Rechercher un client..."
            value={searchClient} onChange={(e) => setSearchClient(e.target.value)}
          />
          <div className="table-container">
            {filteredClients.length === 0 ? (
              <div className="empty-state">Aucun client{searchClient ? " trouvé" : ""}</div>
            ) : (
              <table>
                <thead>
                  <tr><th>ID</th><th>Nom</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.id}</td>
                      <td>
                        {editingClient?.id === client.id ? (
                          <input type="text" value={editingClient.nom}
                            onChange={(e) => setEditingClient({ ...editingClient, nom: e.target.value })}
                            autoFocus
                          />
                        ) : (
                          <strong>{client.nom}</strong>
                        )}
                      </td>
                      <td>
                        <div className="actions">
                          {editingClient?.id === client.id ? (
                            <>
                              <button className="btn-success" type="button"
                                onClick={() => onUpdateClient(client.id)}>Valider</button>
                              <button className="btn-secondary" type="button"
                                onClick={() => setEditingClient(null)}>Annuler</button>
                            </>
                          ) : (
                            <>
                              <button className="btn-edit" type="button"
                                onClick={() => setEditingClient({ id: client.id, nom: client.nom })}>Modifier</button>
                              <button className="btn-danger" type="button"
                                onClick={() => confirmDeleteClient(client)}>Supprimer</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* ── Techniciens ── */}
        <section className="panel">
          <div className="panel-header">
            <h2>Techniciens</h2>
            <span className="badge">{filteredTechniciens.length}/{techniciens.length}</span>
          </div>
          <form className="inline-form" onSubmit={onAddTechnicien}>
            <input type="text" placeholder="Nom" required value={technicienForm.nom}
              onChange={(e) => setTechnicienForm({ ...technicienForm, nom: e.target.value })} />
            <input type="text" placeholder="Prénom" required value={technicienForm.prenom}
              onChange={(e) => setTechnicienForm({ ...technicienForm, prenom: e.target.value })} />
            <input type="email" placeholder="Email" required value={technicienForm.email}
              onChange={(e) => setTechnicienForm({ ...technicienForm, email: e.target.value })} />
            <button type="submit" className="btn-primary">+ Ajouter</button>
          </form>
          <input type="text" className="search-input" placeholder="Rechercher un technicien..."
            value={searchTechnicien} onChange={(e) => setSearchTechnicien(e.target.value)}
          />
          <div className="table-container">
            {filteredTechniciens.length === 0 ? (
              <div className="empty-state">Aucun technicien{searchTechnicien ? " trouvé" : ""}</div>
            ) : (
              <table>
                <thead>
                  <tr><th>ID</th><th>Nom</th><th>Prénom</th><th>Email</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filteredTechniciens.map((tech) => (
                    <tr key={tech.id}>
                      <td>{tech.id}</td>
                      {editingTechnicien?.id === tech.id ? (
                        <>
                          <td><input type="text" value={editingTechnicien.nom}
                            onChange={(e) => setEditingTechnicien({ ...editingTechnicien, nom: e.target.value })}
                            autoFocus /></td>
                          <td><input type="text" value={editingTechnicien.prenom}
                            onChange={(e) => setEditingTechnicien({ ...editingTechnicien, prenom: e.target.value })} /></td>
                          <td><input type="email" value={editingTechnicien.email}
                            onChange={(e) => setEditingTechnicien({ ...editingTechnicien, email: e.target.value })} /></td>
                        </>
                      ) : (
                        <>
                          <td><strong>{tech.nom}</strong></td>
                          <td>{tech.prenom}</td>
                          <td style={{ color: "var(--text-secondary)" }}>{tech.email}</td>
                        </>
                      )}
                      <td>
                        <div className="actions">
                          {editingTechnicien?.id === tech.id ? (
                            <>
                              <button className="btn-success" type="button"
                                onClick={() => onUpdateTechnicien(tech.id)}>Valider</button>
                              <button className="btn-secondary" type="button"
                                onClick={() => setEditingTechnicien(null)}>Annuler</button>
                            </>
                          ) : (
                            <>
                              <button className="btn-edit" type="button"
                                onClick={() => setEditingTechnicien({ id: tech.id, nom: tech.nom, prenom: tech.prenom, email: tech.email })}>Modifier</button>
                              <button className="btn-danger" type="button"
                                onClick={() => confirmDeleteTechnicien(tech)}>Supprimer</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      {/* ── Chantiers ── */}
      <section className="panel">
        <div className="panel-header">
          <h2>Chantiers</h2>
          <span className="badge">{filteredChantiers.length}/{chantiers.length}</span>
        </div>

        <form className="grid-form" onSubmit={onAddChantier}>
          <div className="form-group">
            <label>Référence *</label>
            <input type="text" placeholder="REF-001" required value={chantierForm.reference}
              onChange={(e) => setChantierForm({ ...chantierForm, reference: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Adresse *</label>
            <input type="text" placeholder="123 rue..." required value={chantierForm.adresse}
              onChange={(e) => setChantierForm({ ...chantierForm, adresse: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Type installation</label>
            <input type="text" placeholder="Climatisation..." value={chantierForm.typeInstallation}
              onChange={(e) => setChantierForm({ ...chantierForm, typeInstallation: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Date intervention</label>
            <input type="date" value={chantierForm.dateIntervention}
              onChange={(e) => setChantierForm({ ...chantierForm, dateIntervention: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Statut</label>
            <select value={chantierForm.statut}
              onChange={(e) => setChantierForm({ ...chantierForm, statut: e.target.value })}>
              {Object.entries(STATUT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Client *</label>
            <select required value={chantierForm.clientId}
              onChange={(e) => setChantierForm({ ...chantierForm, clientId: e.target.value })}>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Technicien *</label>
            <select required value={chantierForm.technicienId}
              onChange={(e) => setChantierForm({ ...chantierForm, technicienId: e.target.value })}>
              {techniciens.map((t) => (
                <option key={t.id} value={t.id}>{t.prenom} {t.nom}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ justifyContent: "flex-end" }}>
            <button type="submit" className="btn-primary"
              disabled={!chantierForm.clientId || !chantierForm.technicienId}>
              + Créer chantier
            </button>
          </div>
        </form>

        <input type="text" className="search-input" placeholder="Rechercher un chantier (référence, adresse, client, technicien)..."
          value={searchChantier} onChange={(e) => setSearchChantier(e.target.value)}
        />

        <div className="table-container">
          {filteredChantiers.length === 0 ? (
            <div className="empty-state">Aucun chantier{searchChantier ? " trouvé" : ""}</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Référence</th><th>Adresse</th><th>Statut</th>
                  <th>Client</th><th>Technicien</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredChantiers.map((ch) => (
                  <tr key={ch.id}>
                    {editingChantier?.id === ch.id ? (
                      <>
                        <td>{ch.id}</td>
                        <td><input type="text" value={editingChantier.reference}
                          onChange={(e) => setEditingChantier({ ...editingChantier, reference: e.target.value })} autoFocus /></td>
                        <td><input type="text" value={editingChantier.adresse}
                          onChange={(e) => setEditingChantier({ ...editingChantier, adresse: e.target.value })} /></td>
                        <td>
                          <select value={editingChantier.statut}
                            onChange={(e) => setEditingChantier({ ...editingChantier, statut: e.target.value })}>
                            {Object.entries(STATUT_LABELS).map(([v, l]) => (
                              <option key={v} value={v}>{l}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select value={editingChantier.clientId}
                            onChange={(e) => setEditingChantier({ ...editingChantier, clientId: e.target.value })}>
                            {clients.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                          </select>
                        </td>
                        <td>
                          <select value={editingChantier.technicienId}
                            onChange={(e) => setEditingChantier({ ...editingChantier, technicienId: e.target.value })}>
                            {techniciens.map((t) => (
                              <option key={t.id} value={t.id}>{t.prenom} {t.nom}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div className="actions">
                            <button className="btn-success" type="button" onClick={onUpdateChantier}>Valider</button>
                            <button className="btn-secondary" type="button" onClick={() => setEditingChantier(null)}>Annuler</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{ch.id}</td>
                        <td><strong>{ch.reference}</strong></td>
                        <td>{ch.adresse}</td>
                        <td>
                          <span className={`statut-badge statut-${ch.statut}`}>
                            {STATUT_LABELS[ch.statut] || ch.statut}
                          </span>
                        </td>
                        <td>{chantierClientNom(ch)}</td>
                        <td>{chantierTechnicienNom(ch)}</td>
                        <td>
                          <div className="actions">
                            <button className="btn-edit" type="button" onClick={() => startEditChantier(ch)}>Modifier</button>
                            <button className="btn-secondary" type="button" onClick={() => onCloseChantier(ch.id)}>Clôturer</button>
                            <button className="btn-danger" type="button" onClick={() => confirmDeleteChantier(ch)}>Supprimer</button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ── Modale de confirmation de suppression ── */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{deleteModal.title}</h3>
            <p>{deleteModal.message}</p>
            <div className="modal-actions">
              <button className="btn-secondary" type="button" onClick={() => setDeleteModal(null)}>Annuler</button>
              <button className="btn-danger-solid" type="button" onClick={deleteModal.onConfirm}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
