const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");
const UserModel = require("../models/user");

exports.auth = async (req, res, next) => {
  try {
    let token = req.header("x-api-key");
    if (!token) {
      return res.status(401).json({ msg: "You need to send a token to this endpoint" });
    }

    let decodeToken;
    try {
      decodeToken = jwt.verify(token, config.tokenSecret);
    } catch (err) {
      return res.status(401).json({ msg: "Token invalid or expired, log in again or you hacker!" });
    }
    // Retrieve user information from the database based on the decoded token
    const user = await UserModel.findById({_id: decodeToken._id});

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // Add user information to req
    req.tokenData = decodeToken;
    req.user = user;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
