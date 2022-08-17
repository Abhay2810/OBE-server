const totalPoAttainmentRoutes = require("express").Router();
const { FinalPoAttainment } = require("./../models/totalCoAttainment");

totalPoAttainmentRoutes.get('/:courseId', async (req, res) => {
    const finalPoAttainment = await FinalPoAttainment.find({ 'courseId': req.params.courseId });
    return res.status(200).json({ finalPoAttainment: finalPoAttainment }).end();
});

totalPoAttainmentRoutes.post('/add-total-po-attainment', async (req, res) => {
    const totalCOAttain = new FinalPoAttainment({ ...req.body });

    totalCOAttain.save((error, message) => {
        if (error) {
            return res.status(500).json({ response: null, error: error, message: "Something Went Wrong!! Please Try Again..." }).end();
        } else {
            return res.status(200).json({ response: message, error: null, message: 'Total Po Attainment Added Successfully' }).end();
        }
    });
});

module.exports = { totalPoAttainmentRoutes };
