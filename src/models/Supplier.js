const mongoose = require('mongoose');

const supplierSchema = mongoose.Schema({
		name: {type: String, required:true},
		description: {type:String, required: true},
		address: {type:String, required: true},
		levelAccount: {type:Number, required: true}
		image: String,
		category: 	{
			type: mongoose.Schema.Types.ObjectId,
			ref:'Category',
			required: true
		},
	},
	{
		collection:'Suppliers'
	});

module.exports = mongoose.model('Supplier', supplierSchema);