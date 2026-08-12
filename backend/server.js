//Construire le serveur Express
// charger → importer → créer → configurer → créer une route → gérer les erreurs → démarrer

//charger .env
require('dotenv').config();
//importer express
const express = require('express');
//importer cors
const cors = require('cors');

//importer la base de données
const pool = require('./src/config/db.js');

//créer une instance d'Express = faire exister l application
const app = express();

// 1. Middlewares de base
//middlewares
app.use(cors());
//lire du json
app.use(express.json());

// 2. Route de test basique
app.get('/', async (req, res) => {
    res.json('API Forum Safe Space opérationnelle ! ');
});

// 3. Tes futures routes viendront ici :
// app.use('/api/auth', authRoutes);
// app.use('/api/posts', postRoutes);

// 4. Middleware d'erreur centralisé (TOUJOURS en dernier avant app.listen)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status ||500).json({success: false, message: err.message || 'Erreur serveur interne' });
});

const PORT = process.env.PORT || 5000;

//Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});