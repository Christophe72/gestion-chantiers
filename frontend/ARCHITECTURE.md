# Architecture Refactorisée - Gestion Chantiers

## 📋 Vue d'ensemble

L'application a été restructurée avec une architecture modulaire utilisant React Router pour la navigation entre pages.

## 🎯 Structure des Composants

### Pages Principales (via Routes)
- **Dashboard** (`/`) - Tableau de bord avec métriques et aperçu
- **Clients** (`/clients`) - Gestion complète des clients
- **Techniciens** (`/techniciens`) - Gestion complète des techniciens
- **Chantiers** (`/chantiers`) - Gestion complète des chantiers

### Composants Réutilisables
```
frontend/src/
├── components/
│   ├── Navigation.jsx       - Barre de navigation avec menu
│   ├── Navigation.css
│   ├── Dashboard.jsx        - Page dashboard avec statistiques
│   ├── Dashboard.css
│   ├── ClientsList.jsx      - Composant gestion clients
│   ├── TechniciensList.jsx  - Composant gestion techniciens
│   ├── ChantiersLIst.jsx    - Composant gestion chantiers
│   └── ItemsList.css        - Styles partagés pour les listes
├── hooks/
│   └── useApi.js            - Hook personnalisé pour les appels API
├── utils/
│   └── constants.js         - Constantes partagées (API routes, labels, etc.)
├── App.jsx                  - Composant principal avec Router
├── App.css                  - Styles globaux
└── main.jsx
```

## ✨ Fonctionnalités

### Dashboard
- 📊 Cartes de statistiques (Clients, Techniciens, Chantiers)
- ⚠️ Alertes pour les chantiers en retard
- 📅 Aperçu des chantiers récents
- 💰 Chiffres d'affaires estimés

### Clients
- ➕ Ajouter un client
- 🔍 Rechercher par nom
- ✏️ Modifier un client
- 🗑️ Supprimer un client

### Techniciens
- ➕ Ajouter un technicien (nom, prénom, email)
- 🔍 Rechercher par nom, prénom ou email
- ✏️ Modifier les informations
- 🗑️ Supprimer un technicien

### Chantiers
- ➕ Créer un chantier (référence, adresse, date, type, client, technicien)
- 🔍 Recherche multi-champs
- 📝 Éditer tous les champs
- 🔒 Clôturer un chantier
- 🗑️ Supprimer un chantier
- 🎨 Badges de statut colorés

## 🔧 Hooks & Utilities

### `useApi(apiBase)`
```javascript
const { api, status, setStatus } = useApi(apiBase);
// api(path, options) - Effectue un appel fetch avec gestion d'erreur
// status - { message, isError }
```

### `constants.js`
- `API_ROUTES` - Endpoints API
- `STATUT_LABELS` - Mapping des statuts avec labels
- `matchesSearch()` - Fonction de filtrage

## 🎨 Thème & Style

### Variables CSS Variables
- Mode clair et sombre automatique
- Couleurs primaires et secondaires
- Transitions fluides

### Styles Coordonnés
- Navigation sticky
- Tables responsives
- Modales d'confirmation
- Badges et badges de statut

## 🚀 Installation & Lancement

### Étape 1 : Installer react-router-dom
```bash
cd frontend
npm install
# ou si vous avez déjà un node_modules
# npm install react-router-dom@^6.20.0
```

### Étape 2 : Lancer Dev Server
```bash
npm run dev
```

### Étape 3 : Configurer l'API
Lors du premier lancement, une modale demande l'URL de base :
- **Développement local** : `http://localhost:8080`
- **Production** : URL de votre serveur

## 📱 Responsive Design

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)  
- ✅ Mobile (< 768px)

Tables avec scroll horizontal sur mobile
Formulaires empilés sur mobile
Navigation adaptée

## 🔑 Points Clés de l'Architecture

1. **Modularité** - Chaque page est un composant indépendant
2. **Réutilisabilité** - Styles partagés via ItemsList.css
3. **Gestion d'État Centralisée** - Hook useApi commun
4. **Navigation** - React Router pour un SPsA fluide
5. **Accessibilité** - Thème clair/sombre, contraste élevé
6. **Performant** - Lazy loading possible, code splitting automatique

## 🔄 Flux de Données

```
App.jsx (Router + Auth)
  ├── Navigation (Menu + Thème)
  └── Routes
      ├── Dashboard (Stats globales)
      ├── ClientsList (useApi + States locaux)
      ├── TechniciensList (useApi + States locaux)
      └── ChantiersLIst (useApi + States locaux)
```

## 📝 Notes d'Utilisation

- Les états des formulaires sont gérés localement dans chaque composant
- Les appels API utilisent le hook `useApi` centralisé
- Les messages d'erreur sont affichés via une barre de statut globale
- Les modales de confirmation empêchent les suppressions accidentelles

## 🎓 Étapes Restantes (optionnel)

- [ ] Ajouter Context API pour les états globaux (auth, user)
- [ ] Implémenter la pagination
- [ ] Agrégrer les statistiques avancées (graphiques)
- [ ] TESTS unitaires avec Vitest
- [ ] E2E avec Playwright

---

**Version** : 1.0  
**Dernière mise à jour** : 2026-02-18
