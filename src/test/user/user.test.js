const request = require("supertest")
const faker = require("faker")
const app = require("../../app")

it("returns user data when login or register", async () => {
  const user = global.userGenerator()
  const cookie = await global.register(user, "users")

  const res = await request(app).get("/user/user").set("Cookie", cookie).send().expect(200)

  expect(res.body.user.authorities).toEqual(["ROLE_USER"])
})

it("responds null if not authenticated", async () => {
  const res = await request(app).get("/user/user").send().expect(200)
  expect(res.body.user).toEqual(null)
})
