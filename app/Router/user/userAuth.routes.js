const express=require('express');
const router=express.Router();
const userImageUpload=require('../../Helper/uploadImage');
const userController = require('../../Module/userAuth/controller/user.controller');
const {AuthCheck} = require('../../Middleware/userAuth');


router.post('/register',userImageUpload.single('image'),userController.registerUser);
router.post('/login',userController.userLogin);
router.post('/update_profile/:id',AuthCheck,userImageUpload.single('image'),userController.updateUser);
router.get('/delete_account/:id',AuthCheck,userController.deleteAccount);
router.post('/changePassword',AuthCheck,userController.changePassword);
router.post('/sendOtp',userController.sendotp);
router.post('/verifyotp',userController.verifyotp);
router.get('/getAllUser',userController.getAllUser);


module.exports=router;