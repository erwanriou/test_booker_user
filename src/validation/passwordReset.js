const Validator = require("validator")
const isEmpty = require("./isEmpty")

module.exports = function validateResetPasswordInput(data) {
  let errors = {}

  data.password = !isEmpty(data.password) ? data.password : ""
  data.password2 = !isEmpty(data.password2) ? data.password2 : ""

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters"
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match"
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required"
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required"
  }
  return {
    errors,
    isValid: isEmpty(errors)
  }
}
