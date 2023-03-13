const express = require('express');
const router = express.Router();

const { 
    signup, 
    activateAccount,
    getUser,
    deleteUser,
    updateUser
} = require('../controllers/auth');

//for creating your account 
router.post('/signup', signup);

//to activate your account by providing the token
router.post('/email-activate', activateAccount);

//get single user
router.get('/getUser/:id', getUser);

//update user email
router.put('/update/:id', updateUser)

//delete the user email
router.post('/deleteUser', deleteUser);


module.exports = router;