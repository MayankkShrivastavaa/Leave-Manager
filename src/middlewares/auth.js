const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ msg: "Token is Required" });
    }

    let actualToken = token.split(" ")[1];
    const decodedToken = jwt.verify(actualToken, process.env.JWT_SECRET_KEY);
    req.employeeId = decodedToken.employeeId;
    req.role = decodedToken.role;
    next();
    
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or Expired Token" });
  }
};

module.exports = auth;
