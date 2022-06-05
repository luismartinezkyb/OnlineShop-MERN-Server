const express = require ('express');
const router  = express.Router();

const { getPaymentsByUser, getPaymentTypes, createPaymentMethod, deletePaymentMethod, getOnePaymentMethod} =  require('../controller/payments');


router.get('/payment_id/:paymentId', getOnePaymentMethod);
router.get('/user_id/:userId', getPaymentsByUser);
router.post('/', createPaymentMethod);
router.delete('/delete/:paymentId', deletePaymentMethod);

//typesMethods
router.get('/types', getPaymentTypes);

// router.patch('/:id', updateProduct);



module.exports = router;


