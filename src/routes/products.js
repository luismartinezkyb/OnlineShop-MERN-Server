const express = require ('express');
const router  = express.Router();

const { getProduct, getProductById, getProductByCategory, getCategories} =  require('../controller/products');

router.get('/', getProduct);
router.get('/id/:id', getProductById);
router.get('/categories/:category', getProductByCategory);

//categories
router.get('/categories', getCategories);

// router.patch('/:id', updateProduct);
// router.patch('/:id/likePost', likeProduct)


module.exports = router;


