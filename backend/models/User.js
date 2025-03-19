const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
});

UserSchema.statics.findById = function (id, callback) {
return this.findOne({ _id: id }, callback);
};

UserSchema.statics.findByUsername = function (username, callback) {
return this.findOne({ username }, callback);
};

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);

