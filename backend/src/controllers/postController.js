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

const updatePost = async (req, res, next) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "Le champ content est requis" });
  }
  try {
    const updatedPost = await postModel.updateUserPost(req.params.id, req.user.id, content);

    if (!updatedPost) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    res.status(200).json({
      message: "Contenu mis à jour avec succès",
      post: updatedPost,
    });
  } catch (error) {
    next(error)
  }
};

const likePost = async (req,res,next) => {
  try {
    const {id} = req.params;
    const user_id = req.user?.id || req.user?.userId;

    const newLike = await postModel.addLike(id, user_id);
    if (!newLike) {
      return res.status(409).json({ message: "Vous avez déjà liké ce post" });
    }
    res.status(201).json({ message: "Post liké avec succès", like: newLike });
  } catch (error) {
    next(error);
    console.error("❌ likePost error:", error);
  }
}

const unlikePost = async (req,res,next) => {
  try {
    const {id} = req.params;
    const user_id = req.user?.id || req.user?.userId;

    const deleteLike = await postModel.removeLike(id, user_id);
    if (!deleteLike) {
      return res.status(404).json({ message: "Aucun like à retirer pour ce post" });
    }
    res.status(200).json({ message: "Like retiré avec succès"});
  } catch (error) {
    next(error);
    console.error("❌ unlikePost error:", error);
  }
}



module.exports = {
  getPostsByTopic,
  postPost,
  updatePost,
  likePost,
  unlikePost
};
