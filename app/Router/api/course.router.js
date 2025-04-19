

const express = require('express');
const router = express.Router();
const courseImageUpload=require('../../Helper/uploadImage');
const courseController = require('../../Module/courses/controller/course.controller');


router.post('/createcourse',courseImageUpload.single('image'), courseController.createCourse);
router.get('/getcourse/:id', courseController.getCourseById);
router.post('/updatecourse/:id', courseImageUpload.single('image'),courseController.updateCourse);
router.get('/deletecourse/:id', courseController.deleteCourse);
router.get('/getallcourses',courseController.getAllCourse);

module.exports = router;