const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access, token in missing",
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const foundUser = await userModel.findOne({ _id: decoded.userId })

    req.user = foundUser

    return next()
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized access, token is invalid",
    })
  }
}

module.exports = { authMiddleware }
