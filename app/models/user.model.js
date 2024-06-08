// const bcrypt = require('bcrypt')

module.exports = mongoose => {
    const schema = mongoose.Schema({
        username: String,
        phone: String,
        password: String,
        packet: [String],
    })

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })

    const User = mongoose.model("users", schema)

    // const user = new User({
    //     username: "admin",
    //     phone: "084578869212",
    //     password: bcrypt.hashSync("admin", 10),
    //     packet: ["1", "2"],
    // })

    // user.save(User)

    return User
}