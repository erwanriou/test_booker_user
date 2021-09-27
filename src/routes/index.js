// REQUIRES FONCTION
const requires = (path, array) =>
  array.map(item => ({
    path: require(`../routes/${path}/${item}`),
    url: `/${path}/${item}`
  }))

// API ROUTES
let user = ["user", "login", "logout", "register"]

// APPLY REQUIRES
user = requires("user", user)

module.exports = routes = [...user]
