import { useEffect, useMemo, useState } from "react";
import { API_ROUTES, matchesSearch } from "../utils/constants";
import "./ItemsList.css";

export default function ClientsList({ api, apiBase }) {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientForm, setClientForm] = useState({ nom: "" });
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    loadClients();
  }, [apiBase]);

  async function loadClients() {
    try {
      setLoading(true);
      const response = await api(`${API_ROUTES.clients}?size=200`);
      const data = Array.isArray(response) ? response : response?.content || [];
      setClients(data);
    } catch (err) {
      console.error("Erreur chargement clients:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredClients = useMemo(
    () => clients.filter(c => matchesSearch(c.nom, search)),
    [clients, search]
  );

  async function handleAddClient() {
    if (!clientForm.nom.trim()) {
      alert("Le nom du client est requis");
      return;
    }
    try {
      await api(API_ROUTES.clients, {
        method: "POST",
        body: JSON.stringify({ nom: clientForm.nom })
      });
      setClientForm({ nom: "" });
      loadClients();
    } catch (err) {
      console.error("Erreur ajout client:", err);
      alert(`Erreur création client:\n${err.message}`);
    }
  }

  async function handleUpdateClient() {
    if (!editingClient.nom.trim()) {
      alert("Le nom du client est requis");
      return;
    }
    try {
      await api(`${API_ROUTES.clients}/${editingClient.id}`, {
        method: "PUT",
        body: JSON.stringify(editingClient)
      });
      setEditingClient(null);
      loadClients();
    } catch (err) {
      console.error("Erreur mise à jour client:", err);
    }
  }

  function confirmDelete(client) {
    setDeleteModal({
      title: "Supprimer le client",
      message: `Êtes-vous sûr de vouloir supprimer "${client.nom}" ?`,
      onConfirm: async () => {
        try {
          await api(`${API_ROUTES.clients}/${client.id}`, { method: "DELETE" });
          loadClients();
          setDeleteModal(null);
        } catch (err) {
          console.error("Erreur suppression client:", err);
        }
      }
    });
  }

  return (
    <div className="items-list-container">
      <h2>Gestion des Clients</h2>

      {/* Formulaire d'ajout */}
      <div className="form-section">
        <h3>Ajouter un Client</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nom du client"
            value={clientForm.nom}
            onChange={e => setClientForm({ nom: e.target.value })}
            onKeyPress={e => e.key === "Enter" && handleAddClient()}
            className="form-input"
          />
          <button onClick={handleAddClient} className="btn-primary">
            Ajouter
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <span className="search-count">{filteredClients.length} résultat(s)</span>
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="loading">Chargement...</div>
      ) : filteredClients.length === 0 ? (
        <div className="empty-state">Aucun client trouvé</div>
      ) : (
        <div className="table-responsive">
          <table className="items-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id}>
                  {editingClient?.id === client.id ? (
                    <>
                      <td>{client.id}</td>
                      <td>
                        <input
                          type="text"
                          value={editingClient.nom}
                          onChange={e =>
                            setEditingClient({ ...editingClient, nom: e.target.value })
                          }
                          className="form-input"
                        />
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn-success"
                            onClick={handleUpdateClient}
                          >
                            Valider
                          </button>
                          <button
                            className="btn-secondary"
                            onClick={() => setEditingClient(null)}
                          >
                            Annuler
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{client.id}</td>
                      <td>
                        <strong>{client.nom}</strong>
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn-edit"
                            onClick={() => setEditingClient(client)}
                          >
                            Modifier
                          </button>
                          <button
                            className="btn-danger"
                            onClick={() => confirmDelete(client)}
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
