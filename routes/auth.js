const authRoutes = require("express").Router();
const { User } = require("./../models/user");
const bcrypt = require("bcrypt");
const ldap = require('ldapjs');
const jwt = require('jsonwebtoken')
const {generateTokens} = require('../jwt');

authRoutes.post("/login", async (req, res) => {
  let { email, password } = { ...req.body };

  let response = await User.findOne({ email: email });
  if(response != null) {
    let bcryptRes = await bcrypt.compare(password, response.password);
    if (bcryptRes) {
      const { accessToken, refreshToken } = generateTokens({ id: response._id });
      return res.status(200).json({ 
        message: "User Login Successfully", 
        user: response,
        tokens: {
          accessToken: accessToken,
          refreshToken: refreshToken
        }
      }).end();
    } else {
      return res.status(500).json({ message: "Email or Password Invalid" }).end();
    }
  } else {
    return res.status(500).json({ message: "User Not Found" }).end();
  }
});

authRoutes.post("/verify-email", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'This email address doesn\'t exits. Please try another email address.' }).end();
  } else {
    return res.status(200).json({ _id: user._id, message: 'Email Found' })
  }
})

authRoutes.put("/forgot-password", async (req, res) => {
  const { _id, newPassword } = req.body;
  try {
    const hashedPass = await bcrypt.hash(newPassword, 10);
    const newUser = await User.findByIdAndUpdate(
      { _id },
      { password: hashedPass }
    );
    return res.status(200).json(`Password Reset, ${newUser}`).end();
  } catch (error) {
    return res.status(400).json({ error: error, message: 'Something went wrong while doing database operation.' }).end();
  }
});

module.exports = { authRoutes };
