const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
	name: 					{type:String, required: true}, 
	email: 					{type:String, required: true},
	password: 				{type:String, required: true},
	confirm_password: 		{type:String, required: true},
	phone: 					{type:String, required: true},
	address: 				[String],
	userType: 	{
		type: mongoose.Schema.Types.ObjectId,
		ref:'UserType',
		required: true
	},
},{
	collection:'Users'
});
//, default: ''

userSchema.pre('save', async function(next) {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
})

userSchema.statics.login = async function(email, password) {
	const user = await this.findOne({email});
	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		if (auth){
			return user;

		}
		throw Error('Incorrect Password');

	}
	throw Error('Incorrect Email');
}
module.exports = mongoose.model('User', userSchema);



