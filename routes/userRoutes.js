const userRoutes = require("express").Router();
const { User } = require("./../models/user");
const bcrypt = require('bcrypt');

userRoutes.post("/", async (req, res) => {
  const { userId, deptName, superAdmin } = req.body;
  let users;

  if(superAdmin) {
    users = await User.find({ _id: { $ne: userId } })
  } else {
    users = await User.find({ _id: { $ne: userId }, department: deptName })
  }
  return res.status(200).json({ response: users, dateTime: new Date() }).end();
});

userRoutes.post("/add-user", async (req, res) => {
  let body = { ...req.body };

  let response = await User.find({ email: body.email });
  if (response.length === 0) {
    const user = new User({ ...body });
    if (body.password !== undefined) {
      user.password = await bcrypt.hash(body.password, 10);
    }
    // res.status(200).json({ ...user['_doc'] })
    user.save((error, message) => {
      if (error) {
        res.status(500).json({ ...error }).end();
      } else {
        res.status(200).json({ messgae: "User Added Successfully", res: message }).end();
      }
    });
  } else {
    res.status(500).json({
      message: "User already registered with this email address. Please use another emai.",
    }).end();
  }
});

userRoutes.put("/update-user/:_id", (req, res) => {
  let query = {};
  for (let key in req.body) {
    if (key !== "_id") query[key] = req.body[key];
  }

  User.findByIdAndUpdate(req.params._id, {
    $set: { ...query }
  }, { new: true }, (error, response) => {
    if (error) {
      return res.status(500).json({ ...error, message: "Something Went Wrong!!" }).end();
    } else {
      return res.status(200).json({ date: new Date(), message: "User Updated successfully", response: response }).end();
    }
  })
});

userRoutes.delete("/delete-user/:userId", (req, res) => {
  User.findByIdAndDelete(req.params.userId, (error, msg) => {
    if (error) {
      return res.status(500).json({ ...error, message: "Something Went Wrong!!" }).end();
    } else {
      return res.status(200).json({ date: new Date(), message: "User Delete successfully" }).end();
    }
  })
})

userRoutes.put("/change-password", async (req, res) => {
  // const { token } = req.params;
  const { _id, oldPassword, newPassword } = req.body;
  
  const user = await User.findOne({ _id });
  if (!user) return res.status(400).json({ error: "Invalid User" });

  const verifyPass = await bcrypt.compare(oldPassword, user.password);
  if(verifyPass) {
    const hashedPass = await bcrypt.hash(newPassword, 10);
    const newUser = await User.findByIdAndUpdate(
      { _id: user._id },
      { password: hashedPass }
    );
    return res.status(200).json(`Password changed, ${newUser}`).end();
  } else {
    return res.status(400).json({ error: 'Old Pasword Incorrect' }).end()
  }
});

module.exports = { userRoutes };