
const usefulnumberModel = require("../models/usefulnumberModel");

const getAllNumbers = async (req, res, next) => {
  try {
    const numbers = await usefulnumberModel.getAllNumbers();
    res.status(200).json({
      success: true,
      data: numbers,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAllNumbers
};
