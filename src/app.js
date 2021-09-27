require("express-async-errors")
const express = require("express")
const helmet = require("helmet")
const passport = require("passport")
const compression = require("compression")
const bodyParser = require("body-parser")
const cookieSession = require("cookie-session")
const cookieParser = require("cookie-parser")

// IMPORT ROUTES
const routes = require("./routes")

// IMPORT MIDDLWARES



// LAUNCH EXPRESS
const app = express()
const secure = process.env.NODE_ENV !== "test"

// USE MAIN MIDDLWWARE
app.set("trust proxy", true)
app.use(helmet())
app.disable("x-powered-by")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieSession({ signed: false, secure }))
app.use(isCurrentUser)
app.use(cookieParser())
app.use(passport.initialize())
app.use(compression())

// USE ROUTES
app.get("/", (req, res) => res.status(200).send("User"))
routes.map(route => app.use(route.url, route.path))
app.all("*", async (req, res) => {
  throw new NotFoundError()
})

// USE CUSTOM MIDDLWWARE
app.use(isError)

module.exports = app
