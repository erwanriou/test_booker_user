const mongoose = require("mongoose")
const faker = require("faker")
const request = require("supertest")
const jwt = require("jsonwebtoken")

// IMPORT HELPERS
const dbhandler = require("./dbhandler")
const app = require("../app")

// CREATE TEST DATABASE
beforeAll(async () => {
  process.env.JWT_TOKEN = faker.random.uuid()
  await dbhandler.connect()
})

// MOCKED FILES
jest.mock("../services/natsWrapper", () => require("./mocks/natsWrapper"))

// DROP TEST DABASE
beforeEach(async () => await dbhandler.clearDatabase())

// CLOSE TEST DATABSE
afterAll(async () => await dbhandler.closeDatabase())

// GLOBAL SCOPE
global.cookieGenerator = (website = "users") => [
  `country=${faker.address.country()}`,
  `state=${faker.address.state()}`,
  `city=${faker.address.city()}`,
  `ip=${faker.internet.ip()}`,
  `website=${website}.archsplace.com`
]

global.userGenerator = () => {
  const password = faker.internet.password()
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    password2: password
  }
}

global.register = async (user, role) => {
  const res = await request(app)
    .post("/auth/register")
    .set({ Host: "users.archsplace.com" })
    .set("Cookie", global.cookieGenerator(role))
    .send(user)
    .expect(201)
  return res.get("Set-Cookie")
}
