import { useEffect, useMemo, useState } from "react";
import { API_ROUTES, STATUT_LABELS, DEFAULT_STATUT, matchesSearch } from "../utils/constants";
import "./ItemsList.css";

export default function ChantiersLIst({ api, apiBase }) {
  const [chantiers, setChantiers] = useState([]);
  const [clients, setClients] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingChantier, setEditingChantier] = useState(null);
  const [chantierForm, setChantierForm] = useState({
    reference: "",
    adresse: "",
    typeInstallation: "",
    dateIntervention: "",
    statut: DEFAULT_STATUT,
    clientId: "",
    technicienId: ""
  });
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    loadData();
  }, [apiBase]);

  async function loadData() {
    try {
      setLoading(true);
      const [chantiersRes, clientsRes, techniciensRes] = await Promise.all([
        api(`${API_ROUTES.chantiers}?size=200`),
        api(`${API_ROUTES.clients}?size=200`),
        api(`${API_ROUTES.techniciens}?size=200`)
      ]);

      setChantiers(Array.isArray(chantiersRes) ? chantiersRes : chantiersRes?.content || []);
      setClients(Array.isArray(clientsRes) ? clientsRes : clientsRes?.content || []);
      setTechniciens(Array.isArray(techniciensRes) ? techniciensRes : techniciensRes?.content || []);
    } catch (err) {
      console.error("Erreur chargement données:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredChantiers = useMemo(
    () =>
      chantiers.filter(ch =>
        matchesSearch(ch.reference, search) ||
        matchesSearch(ch.adresse, search) ||
        matchesSearch(ch.client?.nom, search) ||
        matchesSearch(`${ch.technicien?.prenom || ""} ${ch.technicien?.nom || ""}`, search)
      ),
    [chantiers, search]
  );

  function chantierClientNom(ch) {
    return ch.client?.nom || "Non assigné";
  }

  function chantierTechnicienNom(ch) {
    const t = ch.technicien;
    return t ? `${t.prenom} ${t.nom}` : "Non assigné";
  }

  async function handleAddChantier() {
    if (!chantierForm.reference.trim() || !chantierForm.adresse.trim()) {
      alert("La référence et l'adresse sont requises");
      return;
    }
    try {
      await api(API_ROUTES.chantiers, {
        method: "POST",
        body: JSON.stringify({
          ...chantierForm,
          clientId: chantierForm.clientId ? parseInt(chantierForm.clientId) : null,
          technicienId: chantierForm.technicienId ? parseInt(chantierForm.technicienId) : null
        })
      });
      resetChantierForm();
      loadData();
    } catch (err) {
      console.error("Erreur ajout chantier:", err);
    }
  }

  async function handleUpdateChantier() {
    if (!editingChantier.reference.trim() || !editingChantier.adresse.trim()) {
      alert("La référence et l'adresse sont requises");
      return;
    }
    try {
      await api(`${API_ROUTES.chantiers}/${editingChantier.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...editingChantier,
          clientId: editingChantier.clientId ? parseInt(editingChantier.clientId) : null,
          technicienId: editingChantier.technicienId
            ? parseInt(editingChantier.technicienId)
            : null
        })
      });
      setEditingChantier(null);
      loadData();
    } catch (err) {
      console.error("Erreur mise à jour chantier:", err);
    }
  }

  async function handleCloseChantier(id) {
    try {
      await api(`${API_ROUTES.chantiers}/${id}/cloturer`, { method: "POST" });
      loadData();
    } catch (err) {
      console.error("Erreur clôture chantier:", err);
    }
  }

  function confirmDelete(chantier) {
    setDeleteModal({
      title: "Supprimer le chantier",
      message: `Êtes-vous sûr de vouloir supprimer "${chantier.reference}" ?`,
      onConfirm: async () => {
        try {
          await api(`${API_ROUTES.chantiers}/${chantier.id}`, {
            method: "DELETE"
          });
          loadData();
          setDeleteModal(null);
        } catch (err) {
          console.error("Erreur suppression chantier:", err);
        }
      }
    });
  }

  function resetChantierForm() {
    setChantierForm({
      reference: "",
      adresse: "",
      typeInstallation: "",
      dateIntervention: "",
      statut: DEFAULT_STATUT,
      clientId: "",
      technicienId: ""
    });
  }

  return (
    <div className="items-list-container">
      <h2>Gestion des Chantiers</h2>

      {/* Formulaire d'ajout */}
      <div className="form-section">
        <h3>Ajouter un Chantier</h3>
        <div className="form-group form-group-multi">
          <input
            type="text"
            placeholder="Référence"
            value={chantierForm.reference}
            onChange={e =>
              setChantierForm({ ...chantierForm, reference: e.target.value })
            }
            className="form-input"
          />
          <input
            type="text"
            placeholder="Adresse"
            value={chantierForm.adresse}
            onChange={e =>
              setChantierForm({ ...chantierForm, adresse: e.target.value })
            }
            className="form-input"
          />
          <input
            type="text"
            placeholder="Type d'installation"
            value={chantierForm.typeInstallation}
            onChange={e =>
              setChantierForm({
                ...chantierForm,
                typeInstallation: e.target.value
              })
            }
            className="form-input"
          />
          <input
            type="date"
            value={chantierForm.dateIntervention}
            onChange={e =>
              setChantierForm({
                ...chantierForm,
                dateIntervention: e.target.value
              })
            }
            className="form-input"
          />
          <select
            value={chantierForm.clientId}
            onChange={e =>
              setChantierForm({ ...chantierForm, clientId: e.target.value })
            }
            className="form-input"
          >
            <option value="">-- Sélectionner client --</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
          <select
            value={chantierForm.technicienId}
            onChange={e =>
              setChantierForm({ ...chantierForm, technicienId: e.target.value })
            }
            className="form-input"
          >
            <option value="">-- Sélectionner technicien --</option>
            {techniciens.map(t => (
              <option key={t.id} value={t.id}>
                {t.prenom} {t.nom}
              </option>
            ))}
          </select>
          <button onClick={handleAddChantier} className="btn-primary">
            Ajouter
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Rechercher un chantier..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <span className="search-count">{filteredChantiers.length} résultat(s)</span>
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="loading">Chargement...</div>
      ) : filteredChantiers.length === 0 ? (
        <div className="empty-state">Aucun chantier trouvé</div>
      ) : (
        <div className="table-responsive">
          <table className="items-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Référence</th>
                <th>Adresse</th>
                <th>Statut</th>
                <th>Client</th>
                <th>Technicien</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredChantiers.map(ch => (
                <tr key={ch.id}>
                  {editingChantier?.id === ch.id ? (
                    <>
                      <td>{ch.id}</td>
                      <td>
                        <input
                          type="text"
                          value={editingChantier.reference}
                          onChange={e =>
                            setEditingChantier({
                              ...editingChantier,
                              reference: e.target.value
                            })
                          }
                          className="form-input"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editingChantier.adresse}
                          onChange={e =>
                            setEditingChantier({
                              ...editingChantier,
                              adresse: e.target.value
                            })
                          }
                          className="form-input"
                        />
                      </td>
                      <td>
                        <select
                          value={editingChantier.statut}
                          onChange={e =>
                            setEditingChantier({
                              ...editingChantier,
                              statut: e.target.value
                            })
                          }
                          className="form-input"
                        >
                          {Object.entries(STATUT_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          value={editingChantier.clientId || ""}
                          onChange={e =>
                            setEditingChantier({
                              ...editingChantier,
                              clientId: e.target.value ? parseInt(e.target.value) : null
                            })
                          }
                          className="form-input"
                        >
                          <option value="">-- Sélectionner --</option>
                          {clients.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.nom}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          value={editingChantier.technicienId || ""}
                          onChange={e =>
                            setEditingChantier({
                              ...editingChantier,
                              technicienId: e.target.value
                                ? parseInt(e.target.value)
                                : null
                            })
                          }
                          className="form-input"
                        >
                          <option value="">-- Sélectionner --</option>
                          {techniciens.map(t => (
                            <option key={t.id} value={t.id}>
                              {t.prenom} {t.nom}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn-success"
                            onClick={handleUpdateChantier}
                          >
                            Valider
                          </button>
                          <button
                            className="btn-secondary"
                            onClick={() => setEditingChantier(null)}
                          >
                            Annuler
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{ch.id}</td>
                      <td>
                        <strong>{ch.reference}</strong>
                      </td>
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
                          <button
                            className="btn-edit"
                            onClick={() => setEditingChantier(ch)}
                          >
                            Modifier
                          </button>
                          <button
                            className="btn-secondary"
                            onClick={() => handleCloseChantier(ch.id)}
                          >
                            Clôturer
                          </button>
                          <button
                            className="btn-danger"
                            onClick={() => confirmDelete(ch)}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modale de suppression */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{deleteModal.title}</h3>
            <p>{deleteModal.message}</p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setDeleteModal(null)}
              >
                Annuler
              </button>
              <button
                className="btn-danger-solid"
                onClick={deleteModal.onConfirm}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
