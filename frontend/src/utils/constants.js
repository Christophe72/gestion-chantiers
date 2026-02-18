export const DEFAULT_STATUT = "BROUILLON";

export const STATUT_LABELS = {
  BROUILLON: "Brouillon",
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  VALIDE: "Validé",
  REFUSE: "Refusé"
};

export const API_ROUTES = {
  clients: "/api/clients",
  techniciens: "/api/techniciens",
  chantiers: "/api/chantiers",
  index: "/api"
};

export function matchesSearch(text, query) {
  if (!query) return true;
  return (text || "").toLowerCase().includes(query.toLowerCase());
}
