const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// it will add username and password to the user -> passport module
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User' , UserSchema)