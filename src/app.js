require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")

/**
 * - Routes
 */
const authRouter = require("./routes/auth.route")
const accountRouter = require("./routes/account.route")

const app = express()

/**
 * - Middlewares
 */
app.use(express.json())
app.use(cookieParser())

/**
 * - Use Routes
 */
app.use("/api/auth", authRouter)
app.use("/api/account", accountRouter)

module.exports = app
