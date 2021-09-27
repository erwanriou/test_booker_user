const request = require("supertest")
const faker = require("faker")
const app = require("../../app")

const userGenerator = () => {
  const password = faker.internet.password()
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    password2: password
  }
}

it("Return and empty session on logout", async () => {
  const user = userGenerator()
  await global.register(user, "users")

  const res = await request(app).get("/api/user/logout").send({}).expect(200)

  expect(res.get("Set-Cookie")[0]).toEqual("express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly")
})
