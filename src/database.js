const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://luismartinez:2k74lfZJQ0YxvXQN@cluster0.wssr2.mongodb.net/onlineStore?retryWrites=true&w=majority', {
	useNewUrlParser:true,
}).then(db => console.log('Db is connected'))
	.catch(err => console.error(err));


