const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Déclarer la route protégée GET /me
//    - Passer authenticateToken en deuxième argument (entre l'URL et le contrôleur)
//    - Renvoyer un statut 200 avec req.user dans la réponse JSON
router.get('/me',authenticateToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;