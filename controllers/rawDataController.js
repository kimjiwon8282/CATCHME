const asyncHandler = require("express-async-handler"); //try catch (err)
const RawData = require("../models/rawDataModel");

// @desc Get all rawdatas
// @route GET /rawdatas
// 전체 데이터 보기
const getAllRawDatas = asyncHandler(async (req, res) => {
    const rawData = await RawData.find();
    res.status(200).send(rawData);
});

// @desc Create a rawdatas
// @route POST /rawdatas
// 새 데이터 추가하기
const createRawData = asyncHandler(async (req, res) => {
    console.log(req.body);
    const dataArray = req.body;

    console.log(dataArray)
    res.status(201).send("Send RawData");
  }
);

module.exports = {
    getAllRawDatas,
    createRawData
};