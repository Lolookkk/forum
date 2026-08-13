const topicModel = require('../models/postModel');


const getPostsByTopic = async (req, res, next) => {
  const { topic_id } = req.params;
  try {
    const posts = await topicModel.getAllPostsByTopic(topic_id);
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPostsByTopic,
};