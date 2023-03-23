var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
   
 
    cart: {type: Object, required: true},
    email: {type: String, required: true},
    userId: {type: String, required: true},
    buyerName:{type:String,required:true},
    buyerMobile:{type:String,required:true},
    amount: {type: Number, required: true},
 
});

module.exports = mongoose.model('Order', schema);