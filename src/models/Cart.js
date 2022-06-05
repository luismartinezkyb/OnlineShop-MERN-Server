const mongoose = require('mongoose');


const CartSchema = mongoose.Schema({
	idUser: 	{
		type: mongoose.Schema.Types.ObjectId,
		ref:'Users',
		required: true
	},
	products: 	[{
		type: mongoose.Schema.Types.ObjectId,
		ref:'Products',
	}],
	total: 						{type:String, required: true},
	createdAt: {
		type: Date, 
		default: new Date()
	},
},{
		collection:'Cart'
	});

module.exports = mongoose.model('Cart', CartSchema);