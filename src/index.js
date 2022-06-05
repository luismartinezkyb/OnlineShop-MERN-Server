//Imports
const express =  require('express');
const bodyParser =  require('body-parser');
const cors =  require('cors');
const mongoose =  require('mongoose');
const cookieParser = require('cookie-parser');

//Initializations

const app = express();
require('./database');

//Settings

app.set('port', process.env.PORT ||  3001);

//Middlewares
app.use(cors({
	origin:['http://localhost;3000'],
	method: ['GET', 'POST'],
	credentials: true,
}));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));


//Global variables

//Routes

app.use(cookieParser());
//app.use(express.json())
app.use('/products', require('./routes/products'));
app.use('/users', require('./routes/users'));
app.use('/users/payments', require('./routes/payments'));
app.use('/cart', require('./routes/cart'));


//Server is listen
app.listen(app.get('port'), () => {
	console.log('Server on port', app.get('port'))
});



