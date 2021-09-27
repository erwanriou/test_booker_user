const Import = require("@erwanriou/test_booker_common")
const { Publisher } = Import("factory", "publisher")
const { Subject } = Import("factory", "types")

// CHILDREN CLASS
class PasswordReqPub extends Publisher {
  subject = Subject.USER_PASSWORD_RESET_REQ
}

exports.PasswordReqPub = PasswordReqPub
