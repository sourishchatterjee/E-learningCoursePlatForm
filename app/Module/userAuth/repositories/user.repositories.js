// repositories/userRepository.js
const User = require('../model/user.model');
const otpModel=require('../model/otp.Model');
const userModel = require('../model/user.model');

class userRepository {

  // find user by email
    async findUserByEmail(email){
        return await User.findOne({ email });

    }
   
    // create user
      async createUser(userData){
        const newUser = new User(userData);
        return await newUser.save();
      }
      
      async updateUser(id,updateData){
        return await User.findByIdAndUpdate(id, updateData, { new: true });

      }
     
      async findUserById(id){
        return await User.findById(id);
      }

      async updateUserData(id,data){
        return await User.findByIdAndUpdate(id,data);
      }

      async updateisDelete(id){
        try{
            return await User.findByIdAndUpdate(id,{
                isDeleted: true
            })
        }catch(err){
            throw new Error('User Account is not deleted: ' +err.message);

        }
    }

     // changedPassword
     async changedPassword(email,updatepassword){
            return await User.findOneAndUpdate({email},
               {
                $set: {
                    password: updatepassword
                }
               }
            )
    }

    
        // otpVerification
        async otpVerification(userid,otp){
         
                return await otpModel.findOne({userid,otp});
           
        }

        // get All User
        async getAllUser(){
          return await userModel.find();
        }
}

module.exports=new userRepository();

