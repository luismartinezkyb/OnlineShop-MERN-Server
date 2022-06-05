const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');

const getProduct = async (req, res) => {
	try {
		const products = await Product.aggregate([
            {
                $lookup:
                {
                    from: "Categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "Category"
                }
            },
            {
                $lookup:
                {
                    from: "Suppliers",
                    localField: "supplier",
                    foreignField: "_id",
                    as: "Supplier"
                }
            },
            {
                $project:
                {   
                    "Category._id": 0,
                    "Supplier._id": 0,
                    "Supplier.description": 0,
                    "Supplier.address": 0,
                    "Supplier.levelAccount": 0,
                    "Supplier.image": 0,
                    "Supplier.category": 0
                }
            }
        ]);
		res.status(200).json(products);

	} catch(e) {
		res.status(404).json({message: e.message});
		console.log(e);
	}
	
}
const getProductById = async (req, res) => {
	const id = parseInt(req.params.id);
	try {
		const product = await Product.aggregate([
            {
                $match: {
                    "id_product": id
                }
            },
            {
                $lookup:
                {
                    from: "Categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "Category"
                }
            },
            {
            	$lookup:
                {
                    from: "Suppliers",
                    localField: "supplier",
                    foreignField: "_id",
                    as: "Supplier"
                }
            },
            {
                $project:
                {	
                	"Category._id": 0,
                	"Supplier._id": 0,
                	"Supplier.category": 0
                }
            }
        ]);
        
        if (product.length === 0) {
        	return res.status(404).json({message:'Sorry, there is not products with that id'});
        }
        else{
        	res.status(200).json(product);
        }
        
		
	} catch(e) {
		res.status(409).json({message:e.message})
		console.log(e);
	}

}

const getProductByCategory = async (req, res) => {
    const category = req.params.category;
    try {
        const products = await Product.aggregate([
            {
                $lookup:
                {
                    from: "Categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "Category"
                }
            },
            {
                $lookup:
                {
                    from: "Suppliers",
                    localField: "supplier",
                    foreignField: "_id",
                    as: "Supplier"
                }
            },{
                $match: {
                    "Category.name": category
                }
            },
            {
                $project:
                {   
                    "Category._id": 0,
                    "Supplier._id": 0,
                    "Supplier.description": 0,
                    "Supplier.address": 0,
                    "Supplier.levelAccount": 0,
                    "Supplier.image": 0,
                    "Supplier.category": 0
                }
            }
        ]);
        
        if (products.length === 0) {
            return res.status(404).json({message:'Sorry, this category does not exists'});
        }
        else{
            res.status(200).json(products);
        }

    } catch(e) {
        res.status(404).json({message: e.message});
        console.log(e);
    }
    
}
const getCategories = async(req, res) =>{
    try {
        const categories = await Category.find()
        res.status(200).json(categories);

    } catch(e) {
        res.status(404).json({message: e.message});
        console.log(e);
    }
}

// const createPost = async (req, res) => {
// 	const post = req.body;
// 	const newPost = new PostMessage(post)
// 	try {
// 		await newPost.save();
// 		res.status(201).json(newPost);
// 	} catch(e) {
// 		res.status(409).json({message:e.message})
// 		console.log(e);
// 	}
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

// const deletePost = async (req, res) =>{
// 	const { id } = req.params
// 	if (!mongoose.Types.ObjectId.isValid(id)) {
// 		return res.status(404).send('No post with that id')
// 	}
// 	await PostMessage.findByIdAndRemove(id);
// 	res.json({message: 'Post deleted succesfully'})
// }

// const likePost = async (req, res) =>{
// 	const { id } = req.params;
// 	if (!mongoose.Types.ObjectId.isValid(id)) {
// 		return res.status(404).send('No post with that id')
// 	}
// 	const post = await PostMessage.findById(id);
// 	const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1}, { new:true })
// 	res.json(updatedPost);
// } 
module.exports = {getProduct, getProductById, getProductByCategory, getCategories};
