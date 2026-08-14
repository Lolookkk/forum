const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // 1. Récupérer le header "Authorization" envoyé dans la requête
  const authHeader = req.headers['authorization'];

  // 2. Extraire le token de la chaîne (format attendu : "Bearer <token>")
  const token = authHeader && authHeader.split(' ')[1];

  // 3. Si aucun token n'est fourni, couper la requête et renvoyer un statut 401
    if(!token) {
        return res.status(401).json({ message: 'Accès refusé : Token manquant' });
    }

  // 4. Vérifier la validité du token avec jwt.verify()
  //    - En cas d'erreur (token invalide ou expiré) : renvoyer un statut 403
  //    - Si le token est valide : attacher le payload décodé à req.user et exécuter next()
    jwt.verify(token, process.env.JWT_SECRET || 'secret_de_dev', (err, userPayload) => {
        if (err) {
            return res.status(403).json({ message: 'Accès refusé : Token invalide ou expiré' });
        }
        req.user = userPayload;
        next();
    });
};

module.exports = authenticateToken;