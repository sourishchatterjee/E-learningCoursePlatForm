const express=require('express');
const router=express.Router();
const userdashboardController = require('../../Module/userAuth/controller/dashboardContoller');
const {AuthCheck} = require('../../Middleware/userAuth');


router.get('/dashboard',AuthCheck,userdashboardController.dashboard);







module.exports=router;