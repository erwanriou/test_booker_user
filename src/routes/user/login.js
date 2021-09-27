const express = require("express")
const db = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// DATABASE AND LIBRARIES
const Import = require("@erwanriou/test_booker_common")
const User = Import("models", "User", "user")

// EVENTS
const { NatsWrapper } = require("../../services/natsWrapper")
const { UserUpdatedPub } = require("../../events/publishers/userUpdatedPub")

// VALIDATES
const validateLoginInput = require("../../validation/login")
const { BadRequestError, DatabaseConnectionError, NotAuthorizedError } = Import("factory", "errors")

// DECLARE ROUTER
const router = express.Router()

// @route  POST user/login
// @desc   Login API main function (handle AUTHORITIES)
// @access Public
router.post("/", async (req, res) => {
  // HANDLE BODY VALIDATION
  const { errors, isValid } = validateLoginInput(req.body)
  if (!isValid) return res.status(400).json(errors)
  // DEFINE COOKIES AND VARIABLES
  const { email, password } = req.body

  // HANDLE EXISTING USER
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    throw new BadRequestError("Invalid credentials")
  }

  // CHECK MATCH
  const match = await bcrypt.compareSync(password, user.passwordHash)
  // HANDLE MONGODB TRANSACTIONS
  if (match) {
    const SESSION = await db.startSession()
    await SESSION.startTransaction()
    try {
      // UPDATE LAST CONNECTION DATE
      user.set({ lastConnectionDate: Date.now() })
      await user.save()
      await new UserUpdatedPub(NatsWrapper.client()).publish(user)

      // STORE JWT
      const payload = { _id: user._id, authorities: user.authorities }
      req.session = { jwt: jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "7d" }) }
      // RETURN AND FINALIZE ENDPOINT
      await SESSION.commitTransaction()
      res.status(200).json({
        success: true,
        authorities: user.authorities,
        token: "Bearer " + req.session.jwt
      })
    } catch (e) {
      // CATCH ANY ERROR DUE TO TRANSACTION
      await SESSION.abortTransaction()
      console.error(e)
      throw new DatabaseConnectionError()
    } finally {
      // FINALIZE SESSION
      SESSION.endSession()
    }
  } else {
    throw new BadRequestError("Invalid credentials")
  }
})

module.exports = router
