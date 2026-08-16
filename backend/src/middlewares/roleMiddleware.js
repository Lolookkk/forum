const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Vérifier si req.user existe (positionné par authenticateToken)
    if (!req.user) {
        return res.status(401).json({ message: "Accès refusé : Utilisateur non connecté" });
    }
    // 2. Vérifier si le rôle de l'utilisateur est présent dans le tableau des rôles autorisés
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Accès refusé : Droits insuffisants" });
    }
    // 3. Le rôle est valide, on passe au contrôleur suivant
    next();
};
};

module.exports = requireRole;