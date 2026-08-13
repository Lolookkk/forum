const express = require('express');
const cors = require('cors');

// Import de nos routes
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const topicRoutes = require('./routes/topicRoutes');
const postRoutes = require('./routes/postRoutes');

// 1. Créer l'application Express
const app = express();

// 2. Middlewares globaux
app.use(cors());
app.use(express.json()); // Lire le JSON dans les requêtes

// 3. Route de test basique
app.get('/', (req, res) => {
  res.json({ message: 'API Forum Safe Space opérationnelle ! 🚀' });
});

// 4. Déclaration des routes de l'API
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/posts', postRoutes);

// 5. Middleware d'erreur centralisé (TOUJOURS en dernier)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
  });
});

// On exporte l'application configurée
module.exports = app;