const PaymentMethod = require('../models/PaymentMethod');
const PaymentType = require('../models/PaymentType');
const mongoose = require('mongoose');
//628065e63a63fe2ac7d4b6bd
const getOnePaymentMethod = async(req, res) =>{
    const id = req.params.paymentId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send({message: 'Invalid Id, please try again with another paymentMehodID'})
    }
    try {
        const method = await PaymentMethod.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(id) }
            },
            {
                $lookup:
                {
                    from: "Users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "User"
                }
            },
            {
                $lookup:
                {
                    from: "PaymentType",
                    localField: "paymentType",
                    foreignField: "_id",
                    as: "PaymentType"
                }
            },
            {
                $project:
                {   
                    "User._id": 0,
                    "PaymentType._id": 0,
                }
            }
        ]);
        if (method.length === 0) {
            return res.status(404).json({message:'Sorry, there is not payment methods with that Id'});
        }
        else{
            res.status(200).json(method);
        }
        
        
    } catch(e) {
        res.status(409).json({message:e.message})
        console.log(e);
    }
}

const getPaymentsByUser = async (req, res) => {
    const {userId} = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).send({message: 'Invalid User ID, please try again with another User ID'})
    }
	try {
		const methods = await PaymentMethod.aggregate([
            {
                $lookup:
                {
                    from: "Users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "User"
                }
            },
            {
                $lookup:
                {
                    from: "PaymentType",
                    localField: "paymentType",
                    foreignField: "_id",
                    as: "PaymentType"
                }
            },{
                $match: {
                    "user_id": mongoose.Types.ObjectId(userId)
                }
            },
            {
                $project:
                {   
                    "PaymentType._id": 0,
                    "UserType._id": 0,
                }
            }
        ]);
        if (methods.length === 0) {
            return res.status(404).json({message:'Sorry, this user has not payment methods in his account'});
        }
        else{
            res.status(200).json(methods);
        }
		

	} catch(e) {
		res.status(404).json({message: e.message});
		console.log(e);
	}
	
}

const getPaymentTypes = async (req, res) =>{
    try {
        const types = await PaymentType.find({});
        res.status(200).json(types);
    } catch(e) {
        // statements
        console.log(e);
    }

} 

const createPaymentMethod = async(req, res) =>{
    const {user_id, paymentType, card_name, street, city, state, postal_code, country, card_number, moth, year, cvv}= req.body;
    //verification ObjectId
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return res.status(404).send({message: 'Invalid user_id, please try again with another id'})
    }
    if (!mongoose.Types.ObjectId.isValid(paymentType)) {
        return res.status(404).send({message: 'Invalid paymentType, please try again with another id'})
    }
    //verification of lenght of card or cvv
    if (card_number.length!==16) {
        return res.status(404).send({message: 'The card number is invalid, please, try again'})
    }
    if (cvv.length!==3) {
        return res.status(404).send({message: 'The number of characters of the cvv is invalid, please, try again'})
    }

    newPaymentMethod = new PaymentMethod({
        user_id:                    mongoose.Types.ObjectId(req.body.user_id),
        paymentType:                mongoose.Types.ObjectId(req.body.paymentType),
        card_name:                  req.body.card_name,
        card_address: {
            street:                 req.body.card_name,
            city:                   req.body.city,
            state:                  req.body.state,
            postal_code:            req.body.postal_code,
            country:                req.body.country
        },
        card_number:                req.body.card_number,
        expiration_date : {
            month:                  req.body.month,
            year:                   req.body.year
        },
        cvv:                        req.body.cvv
    });

    try {
        await newPaymentMethod.save();
        res.status(201).json(newPaymentMethod);
        
    } catch(e) {
        res.status(409).json({message:e.message})
        console.log(e);
    }
}

const deletePaymentMethod = async(req, res) =>{
    const id = req.params.paymentId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send({message: 'Invalid Id, please try again with another paymentMehodID'})
    }
    try {
        await PaymentMethod.findByIdAndRemove(id);
        res.json({message: 'Payment Method deleted succesfully'})
    } catch(e) {
        res.status(409).json({message:e.message})
        console.log(e);
    }
}


module.exports = { getOnePaymentMethod, getPaymentsByUser, getPaymentTypes, createPaymentMethod, deletePaymentMethod};
