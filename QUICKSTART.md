# 🚀 Guide de Démarrage Rapide

## En 3 Étapes

### 1️⃣ Installation des Dépendances (2 min)
```bash
cd frontend
npm install
```

### 2️⃣ Démarrer l'Application (1 min)
```bash
npm run dev
```
Attendez que vous voyiez:
```
  ➜  Local:   http://localhost:5173
```

### 3️⃣ Configurer l'API (30 sec)
- Ouvrez `http://localhost:5173` dans votre navigateur
- Entrez: `http://localhost:8080` (ou votre URL backend)
- Cliquez: "Connecter"

✅ **C'est prêt!**

---

## 🎯 Navigation

Une fois connecté, utilisez le menu en haut:

| Lien | Description |
|------|-------------|
| **Dashboard** | 📊 Tableau de bord avec statistiques |
| **Clients** | 👥 Gestion des clients |
| **Techniciens** | 🔧 Gestion des techniciens |
| **Chantiers** | 🏗️ Gestion des chantiers |

---

## 📊 Ce que Vous Verrez

### Dashboard
- Cartes avec le nombre total de clients, techniciens, chantiers
- Alertes pour les chantiers en retard
- Aperçu des chantiers récents

### Clients / Techniciens / Chantiers
- Formulaire pour ajouter rapidement
- Barre de recherche en temps réel
- Tableau avec modifier/supprimer
- Modales de confirmation avant suppression

---

## 🎨 Bonus: Thème Sombre

Cliquez le bouton 🌙 en haut à droite pour basculer entre clair et sombre!

---

## ⚠️ Prérequis

- ✅ Backend Spring Boot démarré (`http://localhost:8080`)
- ✅ Node.js 16+ installé
- ✅ npm ou yarn

---

## 📝 Structure Créée

```
frontend/src/
├── components/        # Composants réutilisables
│   ├── Navigation
│   ├── Dashboard
│   ├── ClientsList
│   ├── TechniciensList
│   └── ChantiersLIst
├── hooks/            # Logique réutilisable
│   └── useApi
├── utils/            # Constantes & helpers
│   └── constants
└── App.jsx          # Routeur principal
```

Chaque page est **indépendante et réponsive**.

---

## 🔧 Commandes Utiles

| Commande | Effet |
|----------|-------|
| `npm run dev` | Démarrer le serveur dev |
| `npm run build` | Construire pour la production |
| `npm run preview` | Prévisualiser la build |

---

## 💡 Tips

1. **Données de Test** - Ajoutez des clients/techniciens en cliquant "Ajouter"
2. **Recherche** - Tapez dans la barre de recherche, ça filtre en temps réel
3. **Modification** - Cliquez "Modifier" puis "Valider" pour sauvegarder
4. **Suppression** - Une modale demande confirmation (pas d'accident!)

---

## 📚 Plus de Détails?

- **Architecture complète**: Voir `ARCHITECTURE.md`
- **Checklist d'installation**: Voir `CHECKLIST.md`
- **Journal des changements**: Voir `CHANGELOG_FRONTEND.md`

---

**Besoin d'aide?** 
- Vérifiez que le backend est bien démarré
- Contrôlez l'URL de l'API
- Regardez la console du navigateur (F12) pour les erreurs

**Happy coding! 🎉**
