const mongoose = require('mongoose');
const PaymentTypeSchema = mongoose.Schema({
		id_type: 	{type: Number, required:true},
		type: 		{type: String, required:true},
	},
	{
		collection:'PaymentType'
	});

module.exports = mongoose.model('PaymentType', PaymentTypeSchema);