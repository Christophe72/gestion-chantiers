import { useEffect, useState } from "react";
import { API_ROUTES, STATUT_LABELS } from "../utils/constants";
import "./Dashboard.css";

export default function Dashboard({ api, apiBase }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, [apiBase]);

  async function loadStats() {
    try {
      setLoading(true);
      setError(null);

      const [clientsRes, techniciensRes, chantiersRes] = await Promise.all([
        api(`${API_ROUTES.clients}?size=200`),
        api(`${API_ROUTES.techniciens}?size=200`),
        api(`${API_ROUTES.chantiers}?size=200`)
      ]);

      const clients = Array.isArray(clientsRes) ? clientsRes : clientsRes?.content || [];
      const techniciens = Array.isArray(techniciensRes) ? techniciensRes : techniciensRes?.content || [];
      const chantiers = Array.isArray(chantiersRes) ? chantiersRes : chantiersRes?.content || [];

      // Calcul des statistiques
      const chantiersEnCours = chantiers.filter(c => c.statut === "EN_COURS").length;
      const chantiersEnRetard = chantiers.filter(c => {
        if (c.statut === "TERMINE" || c.statut === "VALIDE") return false;
        return new Date(c.dateIntervention) < new Date();
      }).length;

      const chiffresAffairesEstime = chantiers.reduce((acc, c) => {
        // À adapter si vous avez un montant dans l'entité Chantier
        return acc + (c.montant || 0);
      }, 0);

      setStats({
        totalClients: clients.length,
        totalTechniciens: techniciens.length,
        totalChantiers: chantiers.length,
        chantiersEnCours,
        chantiersEnRetard,
        chantiersTermines: chantiers.filter(c => c.statut === "TERMINE" || c.statut === "VALIDE").length,
        chiffresAffairesEstime,
        clients,
        chantiers
      });
    } catch (err) {
      setError(err.message);
      console.error("Erreur chargement statistiques:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="dashboard-loading">Chargement des statistiques...</div>;
  }

  if (error) {
    return <div className="dashboard-error">Erreur: {error}</div>;
  }

  if (!stats) {
    return <div className="dashboard-empty">Aucune donnée</div>;
  }

  return (
    <div className="dashboard">
      <h2>Tableau de Bord</h2>

      <div className="stats-grid">
        <div className="stat-card stat-clients">
          <h3>Clients</h3>
          <div className="stat-value">{stats.totalClients}</div>
          <p className="stat-label">Total</p>
        </div>

        <div className="stat-card stat-techniciens">
          <h3>Techniciens</h3>
          <div className="stat-value">{stats.totalTechniciens}</div>
          <p className="stat-label">Total</p>
        </div>

        <div className="stat-card stat-chantiers">
          <h3>Chantiers</h3>
          <div className="stat-value">{stats.totalChantiers}</div>
          <p className="stat-label">Total</p>
        </div>

        <div className="stat-card stat-en-cours">
          <h3>En Cours</h3>
          <div className="stat-value">{stats.chantiersEnCours}</div>
          <p className="stat-label">Chantiers actifs</p>
        </div>

        <div className="stat-card stat-retard">
          <h3>En Retard</h3>
          <div className="stat-value alert">{stats.chantiersEnRetard}</div>
          <p className="stat-label">À vérifier</p>
        </div>

        <div className="stat-card stat-termines">
          <h3>Terminés</h3>
          <div className="stat-value">{stats.chantiersTermines}</div>
          <p className="stat-label">Complétés</p>
        </div>
      </div>

      {/* Section Retards */}
      {stats.chantiersEnRetard > 0 && (
        <div className="dashboard-section retards-section">
          <h3>⚠️ Chantiers en Retard</h3>
          <div className="retards-list">
            {stats.chantiers
              .filter(c => {
                if (c.statut === "TERMINE" || c.statut === "VALIDE") return false;
                return new Date(c.dateIntervention) < new Date();
              })
              .slice(0, 5)
              .map(chantier => (
                <div key={chantier.id} className="retard-item">
                  <div className="retard-header">
                    <h4>{chantier.reference}</h4>
                    <span className={`statut-badge statut-${chantier.statut}`}>
                      {STATUT_LABELS[chantier.statut] || chantier.statut}
                    </span>
                  </div>
                  <p className="retard-adresse">{chantier.adresse}</p>
                  <p className="retard-date">
                    Prévu: {new Date(chantier.dateIntervention).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Derniers chantiers */}
      <div className="dashboard-section recent-section">
        <h3>Chantiers Récents</h3>
        <div className="recent-list">
          {stats.chantiers.slice(0, 5).map(chantier => (
            <div key={chantier.id} className="recent-item">
              <div className="recent-header">
                <h4>{chantier.reference}</h4>
                <span className={`statut-badge statut-${chantier.statut}`}>
                  {STATUT_LABELS[chantier.statut] || chantier.statut}
                </span>
              </div>
              <p className="recent-adresse">{chantier.adresse}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
