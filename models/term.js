const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const TermSchema = new Schema({
    termName: { type: String, required: true },
    termNo: { type: Number, required: true },
    curriculumId: { type: String },
    curriculumName: { type: String },
    deptName: {type: String},
}, {
    timestamps: true,
    autoIndex: true
});

const Term = mongoose.model("term", TermSchema);
module.exports = { Term, TermSchema };