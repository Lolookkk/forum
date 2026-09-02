const topicModel = require("../models/topicModel");

const getTwentyFirstTopics = async (req, res, next) => {
  try {
    const topics = await topicModel.getTwentyMostRecentTopics(); 
    res.status(200).json({
      success: true,
      data: topics,
    });
  } catch (error) {
    next(error); // Transmet l'erreur au middleware global
  }
};


const getTopicInformationById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const topic = await topicModel.getTopicInformationById(id);
    res.status(200).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    next(error);
  }
};

const getTopicsBySubcategory = async (req, res, next) => {
  const { subcategory_id } = req.params;
  try {
    const topics = await topicModel.getAllTopicsBySubcategory(subcategory_id);
    res.status(200).json({
      success: true,
      data: topics,
    });
  } catch (error) {
    next(error);
  }
};


const getTopicBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const topic = await topicModel.getTopicBySlug(slug);

    if (!topic) {
      return res.status(404).json({ message: "Sujet non trouvé" });
    }

    res.status(200).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    next(error);
  }
};

const postTopic = async (req, res, next) => {
  try {
    const { subcategory_id, title, content } = req.body;

    const user_id = req.user?.id || req.user?.userId || req.user?.user_id;

    if (!subcategory_id || !title || !content) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }
    const newTopic = await topicModel.createTopic(
      subcategory_id,
      user_id,
      title,
      content,
    );
    res
      .status(201)
      .json({ message: "Topic créé avec succès", topic: newTopic });
  } catch (error) {
    next(error);
  }
};

const updateTopic = async (req, res, next) => {
  const { title, content } = req.body;
  const userId = req.user?.id || req.user?.userId || req.user?.user_id;
  const trimmedTitle = title?.trim();
  const trimmedContent = content?.trim();

  if (!trimmedTitle || !trimmedContent) {
    return res.status(400).json({
      message: "Les champs title et content sont requis",
    });
  }

  try {
    const existingTopic = await topicModel.getTopicInformationById(req.params.id);

    if (!existingTopic) {
      return res.status(404).json({ message: "Sujet non trouvé" });
    }

    if (String(existingTopic.user_id) !== String(userId)) {
      return res.status(403).json({ message: "Vous ne pouvez pas modifier ce sujet" });
    }

    if (!existingTopic.is_within_edit_window) {
      return res.status(400).json({
        message: "Ce sujet ne peut plus être modifié après 15 minutes",
      });
    }

    if (existingTopic.has_replies) {
      return res.status(400).json({
        message: "Ce sujet ne peut plus être modifié car il a déjà reçu une réponse",
      });
    }

    const updatedTopic = await topicModel.updateOwnTopic(
      req.params.id,
      userId,
      trimmedTitle,
      trimmedContent,
    );

    res.status(200).json({
      message: "Sujet mis à jour avec succès",
      topic: updatedTopic,
    });
  } catch (error) {
    next(error);
  }
};

const moveTopic = async (req, res, next) => {
    try {
      const { id } = req.params; // ID du topic transmis dans l'URL
      const { subcategoryId } = req.body; // ID de la nouvelle sous-catégorie transmis dans le body
      if (!subcategoryId) {
        return res.status(400).json({ message: "L'id de la nouvelle sous-catégorie est requis" });
      }
      const updatedTopic = await topicModel.moveTopic( id,subcategoryId);
  
      if (!updatedTopic) {
        return res.status(404).json({ message: "Sujet introuvable" });
      }
  
      res.status(200).json({
        message: "Sujet déplacé avec succès",
        topic: updatedTopic,
      });
    } catch (error) {
      next(error)
    }
};

module.exports = {
  getTopicsBySubcategory,
  postTopic,
  updateTopic,
  moveTopic,
  getTwentyFirstTopics,
  getTopicBySlug,
  getTopicInformationById
};
