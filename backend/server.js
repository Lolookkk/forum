// 1. Charger les variables d'environnement (.env)
require('dotenv').config();

// 2. Importer l'application configurée depuis src/app.js
const app = require('./src/app');

// 3. Récupérer le PORT
const PORT = process.env.PORT || 5000;

// 4. Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});