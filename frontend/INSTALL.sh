#!/bin/bash

echo "============================================"
echo "Installation des dépendances Frontend"
echo "============================================"

cd frontend

# Installer/mettre à jour les dépendances
echo "📦 Installation des dépendances..."
npm install

echo ""
echo "✅ Installation complète!"
echo ""
echo "============================================"
echo "Commandes disponibles"
echo "============================================"
echo ""
echo "🚀 Démarrer le serveur de développement:"
echo "   npm run dev"
echo ""
echo "🔨 Construire pour la production:"
echo "   npm run build"
echo ""
echo "👀 Prévisualiser la build de production:"
echo "   npm run preview"
echo ""
echo "============================================"
echo "Assurez-vous que le serveur backend est"
echo "démarré sur http://localhost:8080"
echo "============================================"
