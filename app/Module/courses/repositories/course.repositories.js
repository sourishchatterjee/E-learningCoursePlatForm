
const courseModel = require('../model/courseModel');

class courseRepository {
    //create
    async createCourse(courseData){
        const newCourse = new courseModel(courseData);
        return await newCourse.save();
    }
        
    async updateCourse(id, updateData){
        return await courseModel.findByIdAndUpdate(id, updateData, { new: true });
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