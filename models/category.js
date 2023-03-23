var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({

    category1: {type: String, required: true}
});

module.exports = mongoose.model('Category', schema);