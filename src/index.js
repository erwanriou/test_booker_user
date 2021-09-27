const app = require("./app")
const transaction = require("./services/transactions")

// CONNECT DATABASE
transaction("User")

// LISTEN APP
app.listen(3000, () => {
  console.log("User listening on port 3000!")
})
