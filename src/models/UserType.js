const mongoose = require('mongoose');
const userTypeSchema = mongoose.Schema({
		type: {type: String, required:true},
	},
	{
		collection:'UserType'
	});

module.exports = mongoose.model('UserType', userTypeSchema);