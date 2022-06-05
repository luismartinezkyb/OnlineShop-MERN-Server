const mongoose = require('mongoose');
const categorySchema = mongoose.Schema({
		name: {type: String, required:true},
	},
	{
		collection:'Categories'
	});

module.exports = mongoose.model('Category', categorySchema);