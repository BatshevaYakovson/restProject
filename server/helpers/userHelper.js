const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

exports.createToken = (_id) => {
    let token = jwt.sign({ _id }, config.tokenSecret, { expiresIn: "60mins" });
    return token;
};


exports.extractUserIdFromToken = (token) => {
    try {
        const decodedToken = jwt.verify(token, config.tokenSecret);
        const userId = decodedToken._id;
        return userId;
    } catch (error) {
        console.error("Error extracting user ID from token:", error);
        return null;
    }
};