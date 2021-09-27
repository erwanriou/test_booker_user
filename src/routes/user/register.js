const express = require("express")
const db = require("mongoose")
const jwt = require("jsonwebtoken")

// DATABASE AND LIBRARIES
const Import = require("@erwanriou/test_booker_common")
const User = Import("models", "User", "user")

// EVENTS
const { NatsWrapper } = require("../../services/natsWrapper")
const { UserCreatedPub } = require("../../events/publishers/userCreatedPub")

// VALIDATES
const validateRegisterInput = require("../../validation/register")
const { BadRequestError, DatabaseConnectionError, RequestValdationError, NotAuthorizedError } = Import("factory", "errors")

// DECLARE ROUTER
const router = express.Router()

// @route  POST auth/register
// @desc   Register API main function (handle AUTHORITIES)
// @access Public
router.post("/", async (req, res) => {
  // HANDLE BODY VALIDATION
  const { errors, isValid } = validateRegisterInput(req.body)
  if (!isValid) return res.status(400).json(errors)

  // DEFINE COOKIES AND VARIABLES
  const { email, password, name } = req.body

  // HANDLE EXISTING USER
  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    throw new BadRequestError("Email already exists")
  }

  // BUILD USER
  const newUser = new User({
    name,
    email: email.toLowerCase(),
    password,
    authorities: ["ROLE_USER"],
    lastConnectionDate: Date.now()
  })

  // HANDLE MONGODB TRANSACTIONS
  const SESSION = await db.startSession()
  await SESSION.startTransaction()
  try {
    await newUser.save()
    await new UserCreatedPub(NatsWrapper.client()).publish(newUser)

    // STORE JWT
    const payload = { _id: newUser._id, authorities: newUser.authorities }
    req.session = { jwt: jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "7d" }) }

    // RETURN AND FINALIZE ENDPOINT
    await SESSION.commitTransaction()
    res.status(201).json({
      success: true,
      authorities: newUser.authorities,
      token: "Bearer " + req.session.jwt
    })
    // HANDLE
  } catch (e) {
    // CATCH ANY ERROR DUE TO TRANSACTION
    await SESSION.abortTransaction()
    console.error(e)
    throw new DatabaseConnectionError()
  } finally {
    // FINALIZE SESSION
    SESSION.endSession()
  }
})

module.exports = router
