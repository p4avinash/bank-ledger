const express = require("express")

const { authMiddleware } = require("../middlewares/auth.middleware")

const { createAccount } = require("../controllers/account.controller")

const router = express.Router()

/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected Route
 */
router.post("/", authMiddleware, createAccount)

module.exports = router
