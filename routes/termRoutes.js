const termRoutes = require("express").Router();
const { Term } = require("./../models/term");

termRoutes.get('/', async (req, res) => {
    const terms = await Term.find();
    return res.status(200).json({ terms: terms }).end();
});

termRoutes.post('/add-term', async (req, res) => {
    const term = new Term({ ...req.body });
    term.save((error, response) => {
        if(error) {
            return res.status(500).json({ response: null, error: error, message: "Unable To Add Term" }).end();
        } else {
            return res.status(200).json({ response: response, error: null, message: "Term Added Successfully" }).end();
        }
    })
});

termRoutes.delete("/delete/:termId", (req, res) => {
    Term.findByIdAndDelete(req.params.termId, (err, msg) => {
        if(err) {
            return res.status(500).json({ ...err, message: "Something Went Wrong!!" }).end();
        } else {
            return res.status(200).json({ date: new Date(), message: "Term Delete successfully" }).end();
        }
    })
});

module.exports = { termRoutes };