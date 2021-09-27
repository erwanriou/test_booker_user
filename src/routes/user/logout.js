const express = require("express")

// DECLARE ROUTER
const router = express.Router()

// @route  POST user/logout
// @desc   Logout a user
// @access Public
router.get("/", (req, res) => {
  req.session = null
  res.status(200).json({})
})

module.exports = router
