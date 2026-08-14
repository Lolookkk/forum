const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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



const login = async (req, res, next) => {
  try {
    // 1. Extraire email et password de req.body
    const { email, password } = req.body;

    // 2. Vérifier si l'un des deux est manquant (statut 400)
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe sont requis' });
    }

    // 3. Chercher l'utilisateur avec findUserByEmail
    //    Si l'utilisateur n'existe pas -> statut 401 (Identifiants invalides)
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // 4. Comparer le mot de passe avec bcrypt.compare(password, user.password_hash)
    const isMatch = await bcrypt.compare(password, user.password_hash);
    //    Si pas bon -> statut 401 (Identifiants invalides)
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // 5. Générer le token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, email: user.email}, //payload
      process.env.JWT_SECRET || 'secret_de_dev', //clé secrète
      { expiresIn: '24h' } //options
    );


    // 6. Renvoyer un statut 200 avec le token et les infos user (sans password_hash)
    res.status(200).json({ token, user: { id: user.id, email: user.email, username: user.username } });


  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};

