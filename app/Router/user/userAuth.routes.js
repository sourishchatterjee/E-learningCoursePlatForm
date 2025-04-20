const express=require('express');
const router=express.Router();
const userImageUpload=require('../../Helper/uploadImage');
const userController = require('../../Module/userAuth/controller/user.controller');
const {AuthCheck} = require('../../Middleware/userAuth');

// Custom middleware to handle multer errors
function multerErrorHandler(req, res, next) {
    userImageUpload.single('image')(req, res, function (err) {
        if (err) {
            return res.status(400).json({
                message: err.message
            });
        }
        next();
    });
}


router.post('/register',multerErrorHandler,userController.registerUser);
router.post('/login',userController.userLogin);
router.post('/update_profile',AuthCheck,multerErrorHandler,userController.updateUser);
router.get('/delete_account',AuthCheck,userController.deleteAccount);
router.post('/changePassword',AuthCheck,userController.changePassword);
router.post('/sendOtp',userController.sendotp);
router.post('/verifyotp',userController.verifyotp);


router.get('/getAllUser',userController.getAllUser);


module.exports=router;