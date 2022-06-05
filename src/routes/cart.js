const express = require ('express');
const router  = express.Router();

const { createCart, getCart, updateCart} =  require('../controller/cart');

router.post('/', createCart);
router.get('/id/:id', getCart);
router.get('/categories/:category', updateCart);


// router.patch('/:id', updateProduct);
// router.patch('/:id/likePost', likeProduct)


module.exports = router;


