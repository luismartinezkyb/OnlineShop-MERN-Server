const mongoose = require('mongoose');
const PaymentMethodSchema = mongoose.Schema({
		user_id: 	{
			type: mongoose.Schema.Types.ObjectId,
			ref:'Users',
			required: true
		},
		paymentType: 	{
			type: mongoose.Schema.Types.ObjectId,
			ref:'paymentType',
			required: true
		},
		card_name: 				{type: String, required:true},
		card_address:{
			street: 			{type: String, required:true},
			city: 				{type: String, required:true},
			state: 				{type: String, required:true},
			postal_code: 		{type: String, required:true},
			country: 			{type: String, required:true}
		},
		card_number: 			{type: String, required:true},
		expiration_date: {
			month: 				{type: String, required:true},
			year: 				{type: String, required:true},
		},
		cvv: 					{type: String, required:true}
	},
	{
		collection:'PaymentMethods'
	});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);