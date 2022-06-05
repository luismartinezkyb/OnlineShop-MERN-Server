const User = require('../models/User');
const UserType = require('../models/UserType');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const maxAge =  3 * 24 * 60 * 60;

const createToken = (id) =>{
    return jwt.sign({id}, "Store super secret key", {
        expiresIn:maxAge,
    })
}

const handleErrors = (err) =>{
    let errors = {email:'', password:''};

    if  (err.message === "Incorrect Email"){
        errors.email = "That email is not registered, please, sign up";
    }

    if (err.message === "Incorrect Password"){
        errors.password = "That Password is incorrect, please try again";
    }


    if (err.code===11000) {
        errors.email = "email is already registered";
        return errors;        
    }
    if (err.message.includes("Users validation failed")){
        Object.values(err.erros).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

const getUsers = async (req, res) => {
	try {
		const users = await User.aggregate([
            {
                $lookup:
                {
                    from: "UserType",
                    localField: "userType",
                    foreignField: "_id",
                    as: "UserType"
                }
            },
            {
                $project:
                {   
                    
                    "UserType._id": 0,
                    "userType": 0,
                    
                }
            }
        ]);
		res.status(200).json(users);

	} catch(e) {
		res.status(404).json({message: e.message});
		console.log(e);
	}
	
}
const getUserById = async (req, res) => {
    


	const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send({message: 'Invalid ID, please try again with another ID'})
    }
    try {
        const user = await User.aggregate([
            {   
                $match: { _id: mongoose.Types.ObjectId(id) }
            },
            {
                $lookup:
                {
                    from: "UserType",
                    localField: "userType",
                    foreignField: "_id",
                    as: "UserType"
                }
            },
            {
                $project:
                {   
                    
                    "userType": 0,
                }
            }
        ]);
        
        if (user.length === 0) {
            return res.status(404).json({message:'Sorry, there is not users with that Id'});
        }
        else{
            res.status(200).json(user);
        }
        
        
    } catch(e) {
        res.status(409).json({message:e.message})
        console.log(e);
    }

}

const getUserTypes = async (req, res) =>{
    try {
        const types = await UserType.find({});
        res.status(200).json(types);
    } catch(e) {
        res.status(409).json({message:e.message})
        console.log(e);
    }
}

const createUser = async (req, res) =>{
    const { name, email, password, confirm_password, phone, userType} = req.body;
    var newUser;

    const emailVerification = await User.find({email:req.body.email})
    //verification of email
    if (emailVerification.length !== 0)  {
        return res.status(404).json({message:'This email is already in use'});
    }
    //verification of passwords
    if (password !== confirm_password) {
        return res.status(404).json({message:'!The password does not match!'});   
    }

    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "luismartinezjpg@gmail.com", // generated ethereal user
          pass: "gxwxkovtpunsxsxu", // generated ethereal password
        },
    });
    var mailOptions = {
        from: '"New Account 👻👻👻👻" <luismartinezjpg@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "New Account Registered ✔", // Subject line
        html: `
        <h1>Hi ${name}!</h1>

        <h4>You are now registered in our website <a href="http://localhost:3000/signin">online.shop.com</a></h4>

        <p>Let's shop together! <a href="http://localhost:3000/signin">Log In</a></p>

        `, // html body
    }

    try {

        const newUser = await User.create({
            name:               req.body.name,
            email:              req.body.email,
            password:           req.body.password,
            confirm_password:   req.body.confirm_password,
            phone:              req.body.phone,
            userType:           mongoose.Types.ObjectId(req.body.userType.id),
        });
        //console.log(newUser);
        const token = createToken(newUser._id);
        res.cookie('jwt', token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000,
        });
        transporter.sendMail(mailOptions, (e, info) =>{
            if (e) {
                res.status(409).json({message:e.message})
            }
            else {
                //console.log("email Enviado!");
                res.status(201).json(newUser);
            }
        });
        
    } catch(e) {
        console.log(e);
        const errors = handleErrors(e);
        res.status(409).json({errors, created:false})
    }
}

const loginUser = async (req, res) => {
    
    try {
        const { email, password} = req.body;
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000,
        });
        res.status(200).json({user:user._id, created:true})
    } catch(e) {
        // statements
        const errors = handleErrors(e);
        res.json({errors, created:false})
        console.log(errors);
    }
}

    // try {
    //     User.countDocuments({},function(error,numOfDocs){
    //         //console.log(numOfDocs);
    //         if(error){
    //             console.log("ERROR:"+error);
    //         }
    //         newUser = new User({
    //             id_user :           numOfDocs+1,
    //             name:               req.body.name,
    //             email:              req.body.email,
    //             password:           req.body.password,
    //             confirm_password:   req.body.confirm_password,
    //             phone:              req.body.phone,
    //             userType:           mongoose.Types.ObjectId(req.body.userType.id),
    //         });
    //         newUser.save();
    //         transporter.sendMail(mailOptions, (e, info) =>{
    //             if (e) {
    //                 res.status(409).json({message:e.message})
    //             }
    //             else {
    //                 //console.log("email Enviado!");
    //                 res.status(201).json(newUser);
    //             }
    //         })
    //     })
        
    // } catch(e) {
    //     res.status(409).json({message:e.message})
    //     console.log(e);
    // }



// const updatePost = async (req, res)=>{
// 	const { id: _id } = req.params;
// 	const post = req.body;
// 	if (!mongoose.Types.ObjectId.isValid(_id)) {
// 		return res.status(404).send('No post with that id')
// 	}
// 	const updatedPost =  await PostMessage.findByIdAndUpdate(_id, {...post, _id}, {new: true})
// 	res.json(updatedPost);
// }
// // {...post, _id}

// const likePost = async (req, res) =>{
// 	const { id } = req.params;
// 	if (!mongoose.Types.ObjectId.isValid(id)) {
// 		return res.status(404).send('No post with that id')
// 	}
// 	const post = await PostMessage.findById(id);
// 	const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1}, { new:true })
// 	res.json(updatedPost);
// } 
module.exports = {getUsers, getUserById, createUser, getUserTypes, loginUser};
