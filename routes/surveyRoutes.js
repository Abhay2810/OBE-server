const surveyRoutes = require("express").Router();
const { Survey } = require("./../models/survey");

surveyRoutes.get("/:courseId", async (req, res) => {
    const surveys = await Survey.find({ "courseId": req.params.courseId });
    return res.status(200).json({ surveys: surveys }).end();
});

surveyRoutes.get("/:courseId/survey-response/:surveyId", async (req, res) => {
    const surveys = await Survey.find({ 
        "courseId": req.params.courseId,
        "assessmentId": req.params.surveyId 
    });
    return res.status(200).json({ surveys: surveys }).end();
});

surveyRoutes.post("/add-survey", async (req, res) => {
    let { data } = { ...req.body };

    await Survey.remove({ "courseId": data[0].courseId });
    Survey.insertMany(data)
    .then((value) => {
        return res.status(200).json({ response: value, error: null, message: 'Students Survey Response Imported Successfully' }).end();
    }, (error) => {
        console.log(error);
        return res.status(500).json({ response: null, error: error, message: "Something Went Wrong!! Please Try Again..." }).end();
    });
})

module.exports = { surveyRoutes };