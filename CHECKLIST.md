# ✅ Checklist d'Installation & Déploiement

## Avant de Démarrer

### 1. Dépendances Frontend
- [ ] Exécuter `npm install` dans le dossier `frontend/`
- [ ] Vérifier que `node_modules/react-router-dom` existe
- [ ] Vérifier que package.json contient `"react-router-dom": "^6.20.0"`

### 2. Backend
- [ ] Serveur Spring Boot démarré et accessible
- [ ] API disponible sur `http://localhost:8080`
- [ ] Endpoints testés:
  - [ ] `GET /api/clients?size=200`
  - [ ] `GET /api/techniciens?size=200`
  - [ ] `GET /api/chantiers?size=200`

### 3. Fichiers Frontend Vérifiés
- [ ] `frontend/src/hooks/useApi.js` ✅ Créé
- [ ] `frontend/src/utils/constants.js` ✅ Créé
- [ ] `frontend/src/components/Navigation.jsx` ✅ Créé
- [ ] `frontend/src/components/Navigation.css` ✅ Créé
- [ ] `frontend/src/components/Dashboard.jsx` ✅ Créé
- [ ] `frontend/src/components/Dashboard.css` ✅ Créé
- [ ] `frontend/src/components/ClientsList.jsx` ✅ Créé
- [ ] `frontend/src/components/TechniciensList.jsx` ✅ Créé
- [ ] `frontend/src/components/ChantiersLIst.jsx` ✅ Créé
- [ ] `frontend/src/components/ItemsList.css` ✅ Créé
- [ ] `frontend/src/App.jsx` ✅ Refactorisé
- [ ] `frontend/src/App.css` ✅ Créé
- [ ] `frontend/package.json` ✅ Modifié

## Démarrage du Développement

### Étape 1 : Installation
```bash
cd frontend
npm install
```
- [ ] Pas d'erreurs de compilation
- [ ] Dépendances installées

### Étape 2 : Lancement Dev Server
```bash
npm run dev
```
- [ ] Message: "Local: http://localhost:5173"
- [ ] Pas d'erreurs dans la console

### Étape 3 : Navigation dans le Navigateur
```
http://localhost:5173
```
- [ ] Écran de configuration API affiché
- [ ] Entrée pour URL API
- [ ] Bouton "Connecter"

### Étape 4 : Configuration API
- [ ] Entrer: `http://localhost:8080`
- [ ] Cliquer "Connecter"
- [ ] Attendre le chargement des données

## Tests Fonctionnels

### Dashboard (/)
- [ ] Page affichée après config de l'API
- [ ] 6 cartes de statistiques visibles:
  - [ ] Clients (total)
  - [ ] Techniciens (total)
  - [ ] Chantiers (total)
  - [ ] En Cours
  - [ ] En Retard (coloré en rouge)
  - [ ] Terminés
- [ ] Section "Chantiers en Retard" visible si des retards existent
- [ ] Section "Chantiers Récents" affichée

### Navigation
- [ ] Barre de navigation sticky en haut
- [ ] Menu: Dashboard | Clients | Techniciens | Chantiers
- [ ] Bouton thème (lune/soleil) fonctionnel
- [ ] Mode sombre/clair basculant

### Clients (/clients)
- [ ] Formulaire d'ajout visible
- [ ] Barre de recherche fonctionnelle
- [ ] Tableau avec ID, Nom, Actions
- [ ] Boutons: Modifier | Supprimer
- [ ] Ajout d'un nouveau client fonctionnel
- [ ] Modification d'un client fonctionnelle
- [ ] Suppression avec modale de confirmation

### Techniciens (/techniciens)
- [ ] Formulaire d'ajout (Nom, Prénom, Email)
- [ ] Tableau: ID, Nom, Prénom, Email, Actions
- [ ] Recherche multi-champs (nom, prénom, email)
- [ ] Opérations CRUD fonctionnelles

### Chantiers (/chantiers)
- [ ] Formulaire complet visible:
  - [ ] Référence
  - [ ] Adresse
  - [ ] Type d'installation
  - [ ] Date d'intervention
  - [ ] Statut (dropdown)
  - [ ] Client (dropdown)
  - [ ] Technicien (dropdown)
- [ ] Tableau avec tous les champs
- [ ] Badges de statut colorés
- [ ] Boutons: Modifier | Clôturer | Supprimer
- [ ] Recherche multi-critères fonctionnelle

## Vérifications Techniques

### Console Navigateur
- [ ] Pas d'erreurs rouges
- [ ] Pas de warnings non critiques

### Responsive Design
- [ ] Desktop (>1200px): ✅ Layout normal
- [ ] Tablet (768-1199px): ✅ Adaptations appliquées
- [ ] Mobile (<768px): ✅ Menu empilé, tables scrollables

### Persistance
- [ ] URL API sauvegardée en localStorage
- [ ] Thème sauvegardé en localStorage
- [ ] Refresh de page: données conservées

### Performance
- [ ] Pas de lag lors du navigation
- [ ] Tables réactives avec ~200 items
- [ ] Recherche instantanée

## Problèmes Courants

### "API non accessible"
**Solution:**
- [ ] Vérifier que backend est démarré
- [ ] Vérifier l'URL API (sans `/api` final)
- [ ] Vérifier CORS si cross-origin

### "Fichiers non trouvés"
**Solution:**
- [ ] Vérifier chemins des imports
- [ ] Vérifier casse des noms (ex: ChantiersLIst avec L majuscules)
- [ ] npm run dev après avoir créé les fichiers

### "Module not found: react-router-dom"
**Solution:**
```bash
npm install react-router-dom@^6.20.0
```

## Déploiement Production

### Build
```bash
npm run build
```
- [ ] Pas d'erreurs
- [ ] Dossier `dist/` créé
- [ ] HTML/JS/CSS minifiés

### Servir avec HTTP Server
```bash
npx http-server dist -p 3000
```
- [ ] Accessible sur `http://localhost:3000`
- [ ] API reachable depuis le navigateur

## Points à Vérifier Ultérieurement

- [ ] Ajouter authentification
- [ ] Implémenter pagination
- [ ] Ajouter graphiques/charts
- [ ] Tests unitaires
- [ ] Tests e2e
- [ ] Gestion des erreurs API améliorée
- [ ] Loading states
- [ ] Validation des formulaires

---

**Status**: En cours de configuration  
**Dernière mise à jour**: 18/02/2026

**Questions?** Consultez ARCHITECTURE.md pour plus de détails.
