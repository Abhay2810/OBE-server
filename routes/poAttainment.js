const poAttainmentRoutes = require("express").Router();
const mongoose = require('mongoose');
const { CO_PO_Mapping, FinalCoAttainment } = require("./../models/totalCoAttainment");
const { Course } = require("../models/course");
const { getTheoryCOS } = require("./courseCORoutes");

poAttainmentRoutes.get('/:courseId', async (req, res) => {
  const poMapping = await CO_PO_Mapping.find({ 'courseId': req.params.courseId });
  return res.status(200).json({ poMapping: poMapping }).end();
});

poAttainmentRoutes.get('/:courseId/get-po-map/:poMapId', async (req, res) => {
  const getCOS = await getTheoryCOS(req.params.courseId);
  const finalCO = await FinalCoAttainment.find({ "courseId": req.params.courseId }).sort({ "createdAt": -1 }).limit(1);
  const poMap = await CO_PO_Mapping.findById(req.params.poMapId);
  
  return res.status(200).json({ 
    poMap: poMap, 
    finalCo: finalCO[0], 
    cos: getCOS 
  }).end();
});

poAttainmentRoutes.post('/add', async (req, res) => {
  let values = { ...req.body };  
  values._id = values._id === "" ? new mongoose.Types.ObjectId() : values._id;
  
  CO_PO_Mapping.findByIdAndUpdate(
    values._id,
    { ...values },
    { upsert: true, new: true },
    async (error, message) => {
      if (error) {
        return res.status(500).json({ response: null, error: error, message: "Something Went Wrong!! Please Try Again..." }).end();
      } else {
        await Course.findByIdAndUpdate(
          { "_id": message.courseId },
          { $set: { "poMapId": message._id } },
          { upsert: true, multi: true }
        )
        return res.status(200).json({ response: message, error: null, message: 'Co Po Mapping Added Successfully' }).end();
      }
    }
  )
});

module.exports = { poAttainmentRoutes };