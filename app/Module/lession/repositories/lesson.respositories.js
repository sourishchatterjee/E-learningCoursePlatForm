const lessonModel=require('../model/lesson.model');
const courseModel=require('../../courses/model/courseModel');

class lessonRepositories{

    async createLession(data){
        const newLesson = new lessonModel(data);
        return await newLesson.save();
    }




  async findByIdIfNotDeleted(id) {
    return await lessonModel.findOne({ _id: id, isDeleted: false });
  }

  async updateById(id, data) {
    return await lessonModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteLesson(id){
    return await lessonModel.findByIdAndUpdate(id,{
        $set:{
            isDeleted:true
        }
    })
  }

  async findLesson(){
    return await lessonModel.find();
  }


  async findCourse(id){
    return await courseModel.findById(id);
  }

  async  findLessonByTitleAndCourse(title, courseId) {
    return lessonModel.findOne({ title, courseId });

  }


}

module.exports=new lessonRepositories();