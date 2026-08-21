const express = require("express");
const router = express.Router();
const {getAllAnnouncements,createAnnouncement,deleteAnnouncement} = require("../controllers/announcementController");
const authenticateToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

// Route publique : tout le monde peut lire les annonces
router.get("/", getAllAnnouncements);

// Routes protégées : seul l'administrateur connecté peut créer/supprimer
router.post("/", authenticateToken, requireRole("admin"), createAnnouncement);
router.delete("/:id", authenticateToken, requireRole("admin"), deleteAnnouncement);

module.exports = router;
