const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/settingController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Lecture accessible (pour récupérer le nom du forum ou l'état de la maintenance)
router.get("/", getSettings);

// Modification réservée aux admins
router.put("/", authMiddleware, roleMiddleware("admin"), updateSettings);

module.exports = router;