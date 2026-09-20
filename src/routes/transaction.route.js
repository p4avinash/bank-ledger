const express = require("express")

const { authMiddleware } = require("../middlewares/auth.middleware")
const { createTransaction } = require("../controllers/transaction.controller")

const router = express.Router()

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */
router.post("/", authMiddleware, createTransaction)

module.exports = router
