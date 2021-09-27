const express = require("express")

// IMPORT MIDDLEWARE
const Import = require("@erwanriou/test_booker_common")
const isCurrentUser = Import("middlewares", "isCurrentUser")

// DECLARE ROUTER
const router = express.Router()

// @route  GET api/users/user
// @desc   Fetch information about currently logged user
// @access Public
router.get("/", isCurrentUser, (req, res) => {
  res.send({ user: req.user || null })
})

module.exports = router
