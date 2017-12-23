var mongoose = require('mongoose');


var UserSchema = new mongoose.Schema(
    {
        user_name: String,
        password: String,
        email: String,
        transaction_id: ObjectId
});
mongoose.model('User', StudentSchema);
module.exports = mongoose.model('User');