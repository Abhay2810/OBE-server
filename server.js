const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const { tokenVerify } = require('./jwt')
require("dotenv").config();

// const { routes } = require("./routes/demo");
const { authRoutes } = require("./routes/auth");
const { userRoutes } = require("./routes/userRoutes");
const { courseRoutes } = require("./routes/courseRoutes");
const { courseCORoutes } = require("./routes/courseCORoutes");
const { curriculumRoutes } = require("./routes/curriculumRoutes");
const { termRoutes } = require("./routes/termRoutes");
const { assessmentRoutes } = require("./routes/assessmentRoutes");
const { attainmentRoutes } = require("./routes/attainmentRoutes");
const { surveyRoutes } = require("./routes/surveyRoutes");
const { totalCoAttainmentRoutes } = require("./routes/totalCoAttainmentRoutes");
const { poAttainmentRoutes } = require("./routes/poAttainment");
const { totalPoAttainmentRoutes } = require("./routes/totalPoAttainmentRoutes");
const { attainmentGapRoutes } = require("./routes/attainmentGapRoutes");

const app = express();
const server = require('http').createServer(app);
const PORT = process.env.PORT || 8000;

app.use(cors({
    credentials: true
})); // Cross-Origin Resource Sharing (CORS) Middleware
app.use(morgan("dev")); // HTTP Request Logger Middleware for node.js
app.use(express.json({ limit: '50mb' })); // The express.json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(cookieParser())
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
// app.use("/api", routes);
app.use("/auth", authRoutes);
app.use("/users", tokenVerify, userRoutes);
app.use("/courses", tokenVerify, courseRoutes);
app.use("/course-outcomes", tokenVerify, courseCORoutes);
app.use("/curriculums", tokenVerify, curriculumRoutes);
app.use("/terms", tokenVerify, termRoutes);
app.use("/assessments", tokenVerify, assessmentRoutes);
app.use("/attainments", tokenVerify, attainmentRoutes);
app.use("/surveys", tokenVerify, surveyRoutes);
app.use("/totalcoattainments", tokenVerify, totalCoAttainmentRoutes);
app.use("/co_po_mapping", tokenVerify, poAttainmentRoutes);
app.use("/totalpoattainments", tokenVerify, totalPoAttainmentRoutes);
app.use("/attainmentgaps", tokenVerify, attainmentGapRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_PROD_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((value) => {
    console.log(">>> Mongoose is connected ");
}, (error) => {
    console.log(">>> Error: ", error);
});

// Base Route
// app.get("/", (req, res) => {
//     res.json({
//         date: new Date(),
//         port: PORT,
//         dirName: __dirname,
//     });
// });

server.listen(PORT, () => console.log(`App Running On ${PORT}`));
// app.listen(PORT, () => console.log(`App Running On ${PORT}`));