var mongoose= require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');



var transactionSchema = new mongoose.Schema(
    {
        address:{type: String, required:true},
        real_balance:{type: Number, required:true},
          usable_balance:{type:Number, required:true},
        private_key:{type: String, required:true},
        public_key:{type: String, required:true}
    }
);

var Transaction = module.exports = mongoose.model('Transaction', transactionSchema, 'transaction');
// module.exports.getUserById = function(id, callback){
//     User.findById(id, callback);
// };
/*mongoose.model('User', StudentSchema);*/
module.exports = mongoose.model('Transaction',transactionSchema);