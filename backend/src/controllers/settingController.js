const settingModel = require("../models/settingModel");

const DEFAULT_SETTINGS = {
  forum_name: "Espace Sécurisé",
  maintenance_mode: false,
  topics_per_page: 10,
  registration_open: true,
};

const coerceSettings = (raw) => ({
  ...DEFAULT_SETTINGS,
  ...(raw || {}),
  maintenance_mode: Boolean(raw?.maintenance_mode ?? raw?.maintenance_mode === "true" ?? false),
  registration_open: Boolean(raw?.registration_open ?? raw?.registration_open === "true" ?? true),
  topics_per_page: parseInt(raw?.topics_per_page, 10) || 10,
  forum_name: String(raw?.forum_name || DEFAULT_SETTINGS.forum_name).trim(),
});

const getSettings = async (req, res, next) => {
  try {
    const rawSettings = await settingModel.getSettings();
    const settings = coerceSettings(rawSettings);
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur." });
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const payload = coerceSettings(req.body || {});
    const updated = await settingModel.updateSettings(payload);
    res.json({ success: true, data: coerceSettings(updated), message: "Paramètres enregistrés." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur lors de la mise à jour." });
    next(error);
  }
};

module.exports = { getSettings, updateSettings };