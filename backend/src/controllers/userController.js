
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const updateUserEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Le champ email est requis' });
    }
    try {
    const updatedUser = await User.updateUserEmail(req.user.id, email);

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({
      message: 'Email mis à jour avec succès',
      user: updatedUser
    });
  } catch (error) {
    console.error("❌ updateUserEmail error:", error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
  }
};

const updateUserUsername = async (req, res) => {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Le champ username est requis' });
    }
    try {
    const updatedUser = await User.updateUserUsername(req.user.id, username );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({
      message: 'Nom d\'utilisateur mis à jour avec succès',
      user: updatedUser
    });
  } catch (error) {
    console.error("❌ updateUserUsername error:", error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
  }
};

const updateUserPassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Les champs currentPassword et newPassword sont requis' });
    }
    try {
        const user = await User.findUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.updateUserPassword(req.user.id, hashedPassword);
        if (!updatedUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json({
            message: 'Mot de passe mis à jour avec succès',
            user: updatedUser
        });
    } catch (error) {
        console.error("❌ updateUserPassword error:", error);
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
    }
};

module.exports = {
    updateUserEmail,
    updateUserUsername,
    updateUserPassword
};