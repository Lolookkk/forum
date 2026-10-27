const express = require("express");
const router = express.Router();
const { getSettings, updateSettings, getPresentation, updatePresentation, getCharter, updateCharter } = require("../controllers/settingController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Lecture accessible (pour récupérer le nom du forum ou l'état de la maintenance)
router.get("/", getSettings);

router.get("/presentation", getPresentation);
router.get("/charter", getCharter);

// Modification réservée aux admins
router.put("/", authMiddleware, roleMiddleware("admin"), updateSettings);
router.put("/presentation", authMiddleware, roleMiddleware("admin"), updatePresentation);
router.put("/charter", authMiddleware, roleMiddleware("admin"), updateCharter);

module.exports = router;