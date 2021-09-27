// REQUIRES FONCTION
const requires = (path, array) =>
  array.map(item => ({
    path: require(`../routes/${path}/${item}`),
    url: `/${path}/${item}`
  }))

// API ROUTES
let user = []

// APPLY REQUIRES
    user = requires("user", user)

module.exports = routes = [...user]
