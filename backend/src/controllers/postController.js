const postModel = require("../models/postModel");

const getPostsByTopic = async (req, res, next) => {
  const { topic_id } = req.params;
  try {
    const posts = await postModel.getAllPostsByTopic(topic_id);
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

const postPost = async (req, res, next) => {
  try {
    const { topic_id, content } = req.body;

    const user_id = req.user?.id || req.user?.userId;

    if (!topic_id || !content) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }
    const newPost = await postModel.createPost(topic_id, user_id, content);
    res.status(201).json({ message: "Post créé avec succès", post: newPost });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPostsByTopic,
  postPost,
};
