const express = require("express");
const cors = require("cors");

// Import de nos routes
const categoryRoutes = require("./routes/categoryRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const topicRoutes = require("./routes/topicRoutes");
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require('./routes/reportRoute');
const announcementRoutes = require('./routes/announcementRoutes');
const usefulnumberRoutes = require('./routes/usefulnumberRoutes');
const ficheRoutes = require('./routes/ficheRoutes');
const settingRoutes = require('./routes/settingRoutes');
const statsRoutes = require('./routes/statsRoutes');

// 1. Créer l'application Express
const app = express();

// 2. Middlewares globaux
app.use(cors());
app.use(express.json()); // Lire le JSON dans les requêtes

// 3. Route de test basique
app.get("/", (req, res) => {
  res.json({ message: "API Forum Safe Space opérationnelle ! 🚀" });
});

// 4. Déclaration des routes de l'API
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/usefulnumbers', usefulnumberRoutes);
app.use('/api/fiches', ficheRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/stats', statsRoutes);

// 5. Middleware d'erreur centralisé (TOUJOURS en dernier)
app.use((err, req, res, next) => {
  //console.error(err.stack);
  console.error("Erreur complète :", err);
  console.error("Message :", err.message);
  console.error("Cause :", err.cause);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erreur serveur interne",
  });
});

// On exporte l'application configurée
module.exports = app;
