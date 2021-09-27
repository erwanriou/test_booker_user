const Import = require("@erwanriou/test_booker_common")
const { Publisher } = Import("factory", "publisher")
const { Subject } = Import("factory", "types")

// CHILDREN CLASS
class UserUpdatedPub extends Publisher {
  subject = Subject.USER_UPDATED
}

exports.UserUpdatedPub = UserUpdatedPub
