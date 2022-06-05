const express = require ('express');
const router  = express.Router();

const { getUsers, getUserById, createUser, getUserTypes, loginUser } =  require('../controller/users');
const { checkUser} =require('../Middlewares/AuthMiddlewares');
router.get('/', getUsers);
router.get('/id/:id', getUserById);
router.post('/', createUser);
router.post('/login', loginUser);
router.post('/check', checkUser);

//types
router.get('/types', getUserTypes);
// router.patch('/:id', updateUser);
// router.delete('/:id', deleteProduct);



module.exports = router;


