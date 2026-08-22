const bcrypt = require("bcrypt");
const User = require("../models/userModel");


const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

getAllUsers

const updateUserEmail = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Le champ email est requis" });
  }
  try {
    const updatedUser = await User.updateUserEmail(req.user.id, email);

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: "Email mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ updateUserEmail error:", error);
    next(error);
  }
};

const updateUserUsername = async (req, res, next) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Le champ username est requis" });
  }
  try {
    const updatedUser = await User.updateUserUsername(req.user.id, username);

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: "Nom d'utilisateur mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ updateUserUsername error:", error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
    next(error);
  }
};

const updateUserPassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({
        message: "Les champs currentPassword et newPassword sont requis",
      });
  }
  try {
    const user = await User.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe actuel incorrect" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.updateUserPassword(
      req.user.id,
      hashedPassword,
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json({
      message: "Mot de passe mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ updateUserPassword error:", error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  const userId = req.params.id;
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ message: "Le nouveau role est requis" });
  }
  try {
    const updatedUser = await User.updateUserRole(userId, role);

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: "Role mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ updateUserRole error:", error);
    next(error);
  }
};

const toggleUserBan = async (req, res, next) => {
  const { id } = req.params;
  const { isBanned } = req.body; // true ou false

  if (typeof isBanned !== "boolean") {
    return res.status(400).json({ message: "Le statut isBanned (boolean) est requis" });
  }

  try {
    const updatedUser = await User.setBanStatus(id, isBanned);

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const actionText = isBanned ? "banni" : "débanni";
    return res.status(200).json({
      message: `Utilisateur ${actionText} avec succès`,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateUserEmail,
  updateUserUsername,
  updateUserPassword,
  updateUserRole,
  toggleUserBan,
  getAllUsers
};
