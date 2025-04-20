
const courseModel = require('../model/courseModel');
const mongoose = require('mongoose');

class courseRepository {
    //create
    async createCourse(courseData){
        const newCourse = new courseModel(courseData);
        return await newCourse.save();
    }
        
    async updateCourse(id, updateData){
        return await courseModel.findByIdAndUpdate(id, updateData, { new: true });
    }
        

    // findCourseWithLessons
    async findCourseWithLessons(courseId){
        return await courseModel.aggregate([
            {
              $match: {
                _id: new mongoose.Types.ObjectId(courseId),
                isDeleted: false
              }
            },
            {
              $lookup: {
                from: 'lessonvideos', // Must match MongoDB collection name
                localField: 'lessons',
                foreignField: '_id',
                as: 'lessons',
                pipeline: [
                  { $match: { isDeleted: false } },
                  {
                    $project: {
                      _id :1,
                      title: 1,
                      video: 1,
                      duration: 1,
                      createdAt: 1,
                      updatedAt: 1
                    }
                  }
                ]
              }
            },
            {
              $project: {
                title: 1,
                category: 1,
                description: 1,
                price: 1,
                image: 1,
                quizzes: 1,
                lessons: 1,
                createdAt: 1,
                updatedAt: 1
              }
            }
          ]);
    }





    async findCourseById(id){
        return await courseModel.findById(id);

    }




        async findAllcourses() {
            return await courseModel.find({ isDeleted: { $ne: true } });
            
        }
    async courseisDelete(id){
        try{
            return await courseModel.findByIdAndUpdate(id, {
                isDeleted: true
            });
        } catch(err){
            throw new Error('Course is not deleted: ' + err.message);
        }
    }

    async checkCourseTitle(title){
        return await courseModel.findOne({title})
    }
}

module.exports = new courseRepository();