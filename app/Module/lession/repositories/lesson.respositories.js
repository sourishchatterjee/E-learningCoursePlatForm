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

// pushLessonTOCourse
async pushLessonTOCourse(courseId,lessonId){
  try {
    const course = await courseModel.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    course.lessons.push(lessonId);
    return await course.save();

  } catch (error) {
    throw new Error(error.message);
  }
}

// delete Lesson From Course

async deleteLessonFromCourse(lessonId) {
  return await courseModel.updateMany(
    { lessons: lessonId },
    { $pull: { lessons: lessonId } }
  );
}


}

module.exports=new lessonRepositories();