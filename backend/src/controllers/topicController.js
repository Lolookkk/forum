const topicModel = require("../models/topicModel");

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

module.exports = {
  getTopicsBySubcategory,
  postTopic,
};
