const Import = require("@erwanriou/test_booker_common")
const { Publisher } = Import("factory", "publisher")
const { Subject } = Import("factory", "types")

// CHILDREN CLASS
class UserCreatedPub extends Publisher {
  subject = Subject.USER_CREATED
}

exports.UserCreatedPub = UserCreatedPub
