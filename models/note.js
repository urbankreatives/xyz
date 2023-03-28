var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
   
 

    role: {type: String, required: true},
    type: {type: String, required: true},
    message: {type: String, required: true},
    subject:{type:String,required:true},
    user:{type:String,required:true},
    status: {type: String, required: true},
    status1: {type: String, required: true},
 
});

module.exports = mongoose.model('Note', schema);