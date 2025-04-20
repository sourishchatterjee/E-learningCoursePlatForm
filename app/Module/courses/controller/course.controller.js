const courseRepository = require("../repositories/course.repositories");
const { Validator } = require('node-input-validator');

class courseController {


  // create course
  async createCourse(req, res) {
    try {

      const v = new Validator(req.body, {
        title: 'required|string|minLength:3',
        category: 'required|string|minLength:3',
        description: 'required|string|minLength:10',
        price: 'required|integer|min:0',
      });
  
      const matched = await v.check();
      if (!matched) {
        return res.status(422).json({
          message: 'Validation failed',
          errors: v.errors,
        });
      }
  
      const courseData = req.body;

      // Add image path from uploaded file
      if (req.file) {
        courseData.image = req.file.path.replace(/\\/g, '/'); 
      } else {
        return res.status(400).json({ message: 'Image file is required' });
      }

      const findCourse=await courseRepository.checkCourseTitle(courseData.title);
      if(findCourse){
        return res.status(400).json({
          message:"This course is already exist"
        })
      }
      const newCourse = await courseRepository.createCourse(courseData);
      
      res.status(200).json({
        message: "Course created successfully",
        data: newCourse,
      });
    } catch (err) {
      res.status(400).json({
        message: "Course creation failed",
        error: err.message,
      });
    }
  }

  // update course
  async updateCourse(req, res) {
    try {
      const id = req.params.id;


      const validation = new Validator(req.body, {
        title: 'string|minLength:3|maxLength:80',
        category: 'string|minLength:3|maxLength:100',
        description: 'string|minLength:5|maxLength:1000',
        price: 'numeric|min:40|max:9000',
      });
  
      const matched = await validation.check();
  
      if (!matched) {
        return res.status(422).json({
          message: 'Validation failed',
          errors: validation.errors,
        });
      }

      const findCourse = await courseRepository.findCourseById(id);

      if (!findCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      const updateData = req.body;

      if (req.file) {
        const oldImagePath = findCourse.image;
        if (oldImagePath && fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
  
        updateData.image = req.file.path;  
      }

      const updatedCourse = await courseRepository.updateCourse(id, updateData);

      res.status(200).json({
        message: "Course updated successfully",
        data: updatedCourse,
      });
    } catch (err) {
      res.status(400).json({
        message: "Course update failed",
        error: err.message,
      });
    }
  }

  // get course by id
  async getCourseById(req, res) {
    try {
      const id = req.params.id;
      const course = await courseRepository.findCourseById(id);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // findLessonOfcourse

      const findLessonOfcourse = await courseRepository.findCourseWithLessons(id);

      res.status(200).json({
        success: true,
        message: "Course found successfully",
        data: findLessonOfcourse,
      });
    } catch (err) {
      res.status(400).json({
        message: "Failed to fetch course",
        error: err.message,
      });
    }
  }


// // get All courses
async getAllCourse(req, res) {
  try {

    const allCourse = await courseRepository.findAllcourses();

    if (!allCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      message: "All Course found successfully",
      data: allCourse,
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to fetch course",
      error: err.message,
    });
  }
}

  // delete course
  async deleteCourse(req, res) {
    try {
      const id = req.params.id;
      const findCourse = await courseRepository.findCourseById(id);

      if (!findCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      await courseRepository.courseisDelete(id);

      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
        data: findCourse,
      });
    } catch (err) {
      res.status(400).json({
        message: "Course deletion failed",
        error: err.message,
      });
    }
  }
}

module.exports = new courseController();
