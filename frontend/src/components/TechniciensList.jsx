import { useEffect, useMemo, useState } from "react";
import { API_ROUTES, matchesSearch } from "../utils/constants";
import "./ItemsList.css";

export default function TechniciensList({ api, apiBase }) {
  const [techniciens, setTechniciens] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingTechnicien, setEditingTechnicien] = useState(null);
  const [technicienForm, setTechnicienForm] = useState({
    nom: "",
    prenom: "",
    email: ""
  });
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    loadTechniciens();
  }, [apiBase]);

  async function loadTechniciens() {
    try {
      setLoading(true);
      const response = await api(`${API_ROUTES.techniciens}?size=200`);
      const data = Array.isArray(response)
        ? response
        : response?.content || [];
      setTechniciens(data);
    } catch (err) {
      console.error("Erreur chargement techniciens:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredTechniciens = useMemo(
    () =>
      techniciens.filter(
        t =>
          matchesSearch(t.nom, search) ||
          matchesSearch(t.prenom, search) ||
          matchesSearch(t.email, search)
      ),
    [techniciens, search]
  );

  async function handleAddTechnicien() {
    if (
      !technicienForm.nom.trim() ||
      !technicienForm.prenom.trim()
    ) {
      alert("Le nom et prénom sont requis");
      return;
    }
    try {
      await api(API_ROUTES.techniciens, {
        method: "POST",
        body: JSON.stringify(technicienForm)
      });
      setTechnicienForm({ nom: "", prenom: "", email: "" });
      loadTechniciens();
    } catch (err) {
      console.error("Erreur ajout technicien:", err);
    }
  }

  async function handleUpdateTechnicien() {
    if (
      !editingTechnicien.nom.trim() ||
      !editingTechnicien.prenom.trim()
    ) {
      alert("Le nom et prénom sont requis");
      return;
    }
    try {
      await api(`${API_ROUTES.techniciens}/${editingTechnicien.id}`, {
        method: "PUT",
        body: JSON.stringify(editingTechnicien)
      });
      setEditingTechnicien(null);
      loadTechniciens();
    } catch (err) {
      console.error("Erreur mise à jour technicien:", err);
    }
  }

  function confirmDelete(technicien) {
    setDeleteModal({
      title: "Supprimer le technicien",
      message: `Êtes-vous sûr de vouloir supprimer "${technicien.prenom} ${technicien.nom}" ?`,
      onConfirm: async () => {
        try {
          await api(`${API_ROUTES.techniciens}/${technicien.id}`, {
            method: "DELETE"
          });
          loadTechniciens();
          setDeleteModal(null);
        } catch (err) {
          console.error("Erreur suppression technicien:", err);
        }
      }
    });
  }

  return (
    <div className="items-list-container">
      <h2>Gestion des Techniciens</h2>

      {/* Formulaire d'ajout */}
      <div className="form-section">
        <h3>Ajouter un Technicien</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nom"
            value={technicienForm.nom}
            onChange={e =>
              setTechnicienForm({ ...technicienForm, nom: e.target.value })
            }
            className="form-input"
          />
          <input
            type="text"
            placeholder="Prénom"
            value={technicienForm.prenom}
            onChange={e =>
              setTechnicienForm({ ...technicienForm, prenom: e.target.value })
            }
            className="form-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={technicienForm.email}
            onChange={e =>
              setTechnicienForm({ ...technicienForm, email: e.target.value })
            }
            className="form-input"
          />
          <button onClick={handleAddTechnicien} className="btn-primary">
            Ajouter
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Rechercher un technicien..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <span className="search-count">{filteredTechniciens.length} résultat(s)</span>
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="loading">Chargement...</div>
      ) : filteredTechniciens.length === 0 ? (
        <div className="empty-state">Aucun technicien trouvé</div>
      ) : (
        <div className="table-responsive">
          <table className="items-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTechniciens.map(tech => (
                <tr key={tech.id}>
                  {editingTechnicien?.id === tech.id ? (
                    <>
                      <td>{tech.id}</td>
                      <td>
                        <input
                          type="text"
                          value={editingTechnicien.nom}
                          onChange={e =>
                            setEditingTechnicien({
                              ...editingTechnicien,
                              nom: e.target.value
                            })
                          }
                          className="form-input"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editingTechnicien.prenom}
                          onChange={e =>
                            setEditingTechnicien({
                              ...editingTechnicien,
                              prenom: e.target.value
                            })
                          }
                          className="form-input"
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          value={editingTechnicien.email}
                          onChange={e =>
                            setEditingTechnicien({
                              ...editingTechnicien,
                              email: e.target.value
                            })
                          }
                          className="form-input"
                        />
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn-success"
                            onClick={handleUpdateTechnicien}
                          >
                            Valider
                          </button>
                          <button
                            className="btn-secondary"
                            onClick={() => setEditingTechnicien(null)}
                          >
                            Annuler
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{tech.id}</td>
                      <td>
                        <strong>{tech.nom}</strong>
                      </td>
                      <td>{tech.prenom}</td>
                      <td>{tech.email}</td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn-edit"
                            onClick={() => setEditingTechnicien(tech)}
                          >
                            Modifier
                          </button>
                          <button
                            className="btn-danger"
                            onClick={() => confirmDelete(tech)}
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
