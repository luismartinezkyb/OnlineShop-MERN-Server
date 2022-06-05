const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
	id_product: 			{type: Number, required: true},
	name: 					{type:String, required: true}, 
	description: 			{type:String, required: true},
	price: 					{type:String, required: true},
	stock : 				{type:Number, required: true},
	image: 					String,
	category: 	{
		type: mongoose.Schema.Types.ObjectId,
		ref:'Category',
		required: true
	},
	supplier: 	{
		type: mongoose.Schema.Types.ObjectId,
		ref:'Supplier',
		required: true
	},
	createdAt: {
		type: Date, 
		default: new Date()
	},

},{
		collection:'Products'
	});

module.exports = mongoose.model('Product', productSchema);