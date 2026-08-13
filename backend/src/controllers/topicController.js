const topicModel = require('../models/topicModel');


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

module.exports = {
  getTopicsBySubcategory,
};