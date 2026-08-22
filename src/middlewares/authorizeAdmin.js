const authorizeAdmin = (req, res, next) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ msg: "Access Denied" });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = authorizeAdmin;
