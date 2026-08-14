const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const register = async (req, res, next) => {
  try {
    // 1. Extraction des données (username, email, password) depuis req.body
    const { username, email, password } = req.body;

    // 2. Validation : Vérifier si des champs sont manquants (renvoyer 400 si incohérent)
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // 3. Vérifier si l'utilisateur existe déjà avec findUserByEmailOrUsername
    //    (renvoyer 400 ou 409 si un utilisateur est trouvé)
    const existingUser = await userModel.findUserByEmailOrUsername(email, username);
    if (existingUser) {
        return res.status(400).json({ message: 'Un utilisateur avec cet email ou ce nom d’utilisateur existe déjà' });
    }

    // 4. Hacher le mot de passe avec bcrypt (ex: const hash = await bcrypt.hash(password, 10))
    const passwordHash = await bcrypt.hash(password, 10);

    // 5. Créer l'utilisateur en BDD avec createUser
    const newUser = await userModel.createUser(email, username, passwordHash);

    // 6. Réponse : Renvoyer un statut 201 avec un message de succès
    //    (pense à ne pas exposer le passwordHash dans le JSON de retour)
    res.status(201).json({ message: 'Utilisateur créé avec succès', user: { id: newUser.id, email: newUser.email, username: newUser.username } });

  } catch (error) {
    // Gestion centralisée des erreurs
    next(error);
  }
};

module.exports = {
  register,
};

