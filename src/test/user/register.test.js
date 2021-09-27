const request = require("supertest")
const faker = require("faker")
const app = require("../../app")

it("returns a 201 on sucessfull register", async () => {
  const user = global.userGenerator()
  return request(app).post("/user/register").send(user).expect(201)
})

it("returns a cookie after successfull signup", async () => {
  const user = global.userGenerator()
  const res = await request(app).post("/user/register").send(user).expect(201)

  expect(res.get("Set-Cookie")).toBeDefined()
})

it("returns a 400 with an missing email and password", async () => {
  const password = faker.internet.password()
  const user1 = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password2: password
  }
  const user2 = {
    name: faker.name.findName(),
    password,
    password2: password
  }

  await request(app).post("/user/register").send(user1).expect(400)
  await request(app).post("/user/register").send(user2).expect(400)
})
