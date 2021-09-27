const request = require("supertest")
const faker = require("faker")
const app = require("../../app")

it("returns a 400 never registered user", async () => {
  return request(app)
    .post("/user/login")
    .send({
      email: faker.internet.email(),
      password: faker.internet.password()
    })
    .expect(400)
})

it("returns 400 on incorrect supplied password", async () => {
  const user = global.userGenerator()
  const incorrectPassword = faker.internet.password()
  await global.register(user, "users")

  const res = await request(app)
    .post("/user/login")
    .send({
      email: user.email,
      password: incorrectPassword
    })
    .expect(400)

  expect(res.body.errors[0].message).toEqual("Invalid credentials")
})

it("returns a 200 on successfull login user", async () => {
  const user = global.userGenerator()
  const cookie = await global.register(user, "users")
  const res = await request(app).post("/user/login").send(user).expect(200)

  expect(res.get("Set-Cookie")).toBeDefined()
  expect(res.body.token).toBeDefined()
})
