var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
   


    category: {type: String, required: true},
    code: {type: String, required: true},
    id:{type:String, required:true},
    qty: {type: Number, required: true},
    buyerName:{type:String, required:true},
    buyerMobile:{type:String, required:true},
    author:{type:String,required:true},
    title:{type:String,required:true},
    barcodeNumber:{type:String,required:true},
    date:{type:String,required:true},
    price: {type: Number, required: true},

  

});

module.exports = mongoose.model('Order2', schema);