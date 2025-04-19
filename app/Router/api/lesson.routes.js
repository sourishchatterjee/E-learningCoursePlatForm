const lessonVideoController=require('../../Module/lession/controller/lesson.controller');
const express = require('express');
const router = express.Router();
const videoUpload = require('../../Helper/uploadVideos');


router.post('/add_lesson/:courseId',videoUpload.single('video'),lessonVideoController.addLession);
router.post('/update_lesson/:lessonId',videoUpload.single('video'),lessonVideoController.updateLesson);
router.get('/delete_lesson/:lessonId',lessonVideoController.lessonDelete);
router.get('/show_lesson',lessonVideoController.showLession);



module.exports=router;