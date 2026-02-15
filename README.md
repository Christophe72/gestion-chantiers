# Gestion des Chantiers

Application SaaS de gestion de chantiers permettant de suivre les clients, techniciens et chantiers d'intervention.

## Architecture

```
gestion-chantiers/
├── back/          # API REST - Spring Boot 3.2 / Java 21 / PostgreSQL
├── frontend/      # Interface web - React 18 / Vite
└── README.md
```

## Prérequis

- **Java** 21+
- **PostgreSQL** (base `mcp_db`)
- **Node.js** 18+
- **npm** 9+

---

## Installation et lancement

### 1. Base de données

Créer la base PostgreSQL :

```sql
CREATE DATABASE mcp_db;
```

Configuration par défaut (modifiable dans `back/src/main/resources/application.properties`) :

| Paramètre | Valeur |
|-----------|--------|
| URL | `jdbc:postgresql://localhost:5432/mcp_db` |
| Utilisateur | `postgres` |
| Mot de passe | `postgres` |

Le schéma est généré automatiquement par Hibernate (`ddl-auto: update`).

### 2. Backend

```bash
cd back
./mvnw spring-boot:run
```

Le serveur démarre sur **http://localhost:8080**.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

L'interface est accessible sur **http://localhost:5173**.

Le proxy Vite redirige automatiquement les appels `/api/*` vers le backend (port 8080).

---

## Fonctionnalités

- **Clients** : CRUD complet, recherche en temps réel
- **Techniciens** : CRUD complet, recherche par nom/prénom/email
- **Chantiers** : CRUD complet, filtrage multi-critères, clôture
- **Vérifications** : association de vérifications aux chantiers
- **Mode sombre / clair** : bascule persistée en localStorage
- **Modale de confirmation** : avant chaque suppression
- **Modification inline** : édition directe dans les tableaux

---

## API REST

Base URL : `http://localhost:8080/api`

### Index

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/api` | Liste des endpoints disponibles |

### Clients

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/api/clients` | Lister les clients (paginé) |
| `GET` | `/api/clients/{id}` | Obtenir un client |
| `POST` | `/api/clients` | Créer un client |
| `PUT` | `/api/clients/{id}` | Modifier un client |
| `DELETE` | `/api/clients/{id}` | Supprimer un client |

**Paramètres de requête (GET liste)** :
- `q` : recherche par nom (insensible à la casse)
- `page` : numéro de page (défaut : 0)
- `size` : taille de page (défaut : 20)
- `sort` : tri (défaut : `id,desc`)

**Corps de requête (POST / PUT)** :

```json
{
  "nom": "Dupont SA"
}
```

### Techniciens

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/api/techniciens` | Lister les techniciens (paginé) |
| `GET` | `/api/techniciens/{id}` | Obtenir un technicien |
| `POST` | `/api/techniciens` | Créer un technicien |
| `PUT` | `/api/techniciens/{id}` | Modifier un technicien |
| `DELETE` | `/api/techniciens/{id}` | Supprimer un technicien |

**Paramètres de requête (GET liste)** :
- `q` : recherche par nom, prénom ou email

**Corps de requête (POST / PUT)** :

```json
{
  "nom": "Martin",
  "prenom": "Jean",
  "email": "jean.martin@example.com"
}
```

### Chantiers

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/api/chantiers` | Lister les chantiers (paginé) |
| `GET` | `/api/chantiers/{id}` | Obtenir un chantier |
| `POST` | `/api/chantiers` | Créer un chantier |
| `PUT` | `/api/chantiers/{id}` | Modifier un chantier |
| `POST` | `/api/chantiers/{id}/cloturer` | Clôturer un chantier |
| `DELETE` | `/api/chantiers/{id}` | Supprimer un chantier |

**Paramètres de requête (GET liste)** :
- `q` : recherche par référence ou adresse
- `statut` : filtrer par statut
- `dateIntervention` : filtrer par date (format `YYYY-MM-DD`)

**Corps de requête (POST / PUT)** :

```json
{
  "reference": "CH-2025-001",
  "adresse": "12 rue de la Paix, 75002 Paris",
  "typeInstallation": "Climatisation",
  "dateIntervention": "2025-03-15",
  "statut": "EN_COURS",
  "signatureClient": null,
  "dateSignature": null,
  "clientId": 1,
  "technicienId": 1
}
```

**Statuts possibles** :

| Valeur | Description |
|--------|-------------|
| `BROUILLON` | Brouillon (défaut) |
| `EN_COURS` | En cours |
| `TERMINE` | Terminé |
| `VALIDE` | Validé |
| `REFUSE` | Refusé |

### Vérifications

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/api/verifications` | Lister toutes les vérifications |
| `GET` | `/api/verifications/{id}` | Obtenir une vérification |
| `GET` | `/api/verifications/chantier/{chantierId}` | Vérifications d'un chantier |
| `POST` | `/api/verifications/chantier/{chantierId}` | Créer une vérification |
| `DELETE` | `/api/verifications/{id}` | Supprimer une vérification |

---

## Réponses API

### Pagination

Les endpoints de liste retournent un objet paginé Spring Data :

```json
{
  "content": [],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalElements": 42,
  "totalPages": 3
}
```

### Codes HTTP

| Code | Signification |
|------|---------------|
| `200` | Succès (GET, POST, PUT) |
| `204` | Suppression réussie (DELETE) |
| `400` | Requête invalide (client/technicien inexistant) |
| `404` | Ressource non trouvée |

---

## Modèle de données

```
┌─────────────┐       ┌─────────────────┐       ┌──────────────┐
│   Client     │       │    Chantier      │       │  Technicien  │
├─────────────┤       ├─────────────────┤       ├──────────────┤
│ id           │◄──┐  │ id               │  ┌──►│ id            │
│ nom          │   └──│ client_id (FK)   │  │   │ nom           │
└─────────────┘       │ technicien_id(FK)│──┘   │ prenom        │
                      │ reference        │       │ email         │
                      │ adresse          │       │ createdAt     │
                      │ typeInstallation │       └──────────────┘
                      │ dateIntervention │
                      │ statut           │       ┌───────────────────┐
                      │ signatureClient  │       │VerificationChantier│
                      │ dateSignature    │       ├───────────────────┤
                      │ createdAt        │◄──────│ chantier_id (FK)  │
                      │ updatedAt        │       │ id                │
                      └─────────────────┘       └───────────────────┘
```

---

## Stack technique

### Backend

| Technologie | Version |
|-------------|---------|
| Java | 21 |
| Spring Boot | 3.2.0 |
| Spring Data JPA | 3.2.0 |
| PostgreSQL Driver | 42.6.0 |
| Hibernate | 6.3.1 |

### Frontend

| Technologie | Version |
|-------------|---------|
| React | 18.3.1 |
| Vite | 5.4.11 |
| @vitejs/plugin-react | 5.1.4 |

Aucune librairie UI externe : CSS custom avec variables et thème sombre.

---

## Configuration

### Backend (`application.properties`)

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mcp_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

La sécurité Spring est désactivée (`SecurityAutoConfiguration` exclue).

### Frontend (`vite.config.js`)

```js
server: {
  host: "127.0.0.1",
  port: 5173,
  proxy: {
    "/api": {
      target: "http://127.0.0.1:8080",
      changeOrigin: true
    }
  }
}
```
