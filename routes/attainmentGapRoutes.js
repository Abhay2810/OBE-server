const attainmentGapRoutes = require("express").Router();
const mongoose = require('mongoose');
const { AttainmentGap } = require("./../models/totalCoAttainment");
const { Course } = require("./../models/course");

attainmentGapRoutes.get('/:gapId', async(req, res) => {
    const attainmentGaps = await AttainmentGap.findById(req.params.gapId);
    return res.status(200).json({ attainmentGaps: attainmentGaps }).end();
});

attainmentGapRoutes.post('/add', async(req, res) => {
    let values = { ...req.body };
    values._id = values._id === "" ? new mongoose.Types.ObjectId() : values._id;

    AttainmentGap.findByIdAndUpdate(
        values._id,
        { ...values },
        { upsert: true, new: true },
        async (error, response) => {
            if (error) {
                return res.status(500).json({ response: null, error: error, message: "Unable To Add AttainmentGap" }).end();
            } else {
                await Course.findByIdAndUpdate(
                    { "_id": response.courseId },
                    { $set: { "gapId": response._id } },
                    { upsert: true, multi: true }
                  )
                return res.status(200).json({ response: response, error: null, message: "AttainmentGap Added Successfully" }).end();
            }
        }
    )
});

module.exports = { attainmentGapRoutes };