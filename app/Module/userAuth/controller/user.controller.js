// controllers/userController.js
const bcrypt = require('bcryptjs');
const { Validator } = require('node-input-validator');
const userRepositories = require('../repositories/user.repositories');
const { hashpassword } = require('../../../Middleware/userAuth');
const { sendRegistrationMail } = require('../../../Helper/sendRegistrationMail');
const { log } = require('node:console');
const jwt=require('jsonwebtoken');
const sendmailverificationotp = require('../../../Helper/sendOtpVerificationMail');


// user registration
class userController{
    async registerUser(req,res){
        try{
            const v = new Validator(req.body, {
                name: 'required|string|minLength:3',
                email: 'required|email',
                password: 'required|string|minLength:6',
              
              });
            
              const matched = await v.check();
            
              if (!matched) {
                return res.status(422).json({ errors: v.errors });
              }
            
              if (!req.file || !req.file.path) {
                return res.status(400).json({ message: 'Image is required' });
              }
              const { name, email, password} = req.body;
            
              try {
                const existingUser = await userRepositories.findUserByEmail(email);
                if (existingUser&&existingUser.isDeleted==false) {
                  return res.status(409).json({ message: 'Email is already registered.' });
                }
            
                const hashedPassword = await hashpassword(password);
                const image = req.file.path;
                if(!image){
                    return res.status(400).json({
                        message:"Image is"
                    })
                }
                if (existingUser && existingUser.isDeleted == true) {
                   
                    const updatedUser = await userRepositories.updateUser(existingUser._id, {
                        name,
                        email,
                        image,
                        password: hashedPassword,
                        isDeleted: false,
                        enrolledCourses: [],
                        progress: []
                      });
                      await sendRegistrationMail(req, updatedUser);
                      return res.status(200).json({ message: 'User registered successfully.', user: updatedUser });
                    }
                
                const userData=await userRepositories.createUser({
                  name,
                  email,
                  image,
                  password: hashedPassword,
                  enrolledCourses: [],
                  progress: []
                });
                await sendRegistrationMail(req, userData);
            
                return res.status(201).json({ message: 'User registered successfully.',data:userData });
              } catch (error) {
                console.error('Register Error:', error);
                return res.status(500).json({ message: 'Internal server error.' });
              }
        }catch(err){
            return res.status(400).json({
                message: "User registration failed",
                error: err.message || err,
            });
        }
       
    }



    // for user login
    async userLogin(req, res) {
        try {
            const v = new Validator(req.body, {
                email: 'required|email',
                password: 'required'
            });

            const matched = await v.check();

            if (!matched) {
                return res.status(400).json({ errors: v.errors });
            }

            const { email, password } = req.body;

            // Fetch user from the database
            const existUser = await userRepositories.findUserByEmail(email);
            if(!existUser){
                return res.status(409).json({ message: 'user is not exist' });

            }

            if (!existUser || existUser.isDeleted) {
                return res.status(400).json({
                    message: "User does not exist or is deleted",
                });
            }

            // Check if passwords match
            const isMatch = await bcrypt.compare(password,existUser.password);
            console.log(isMatch);
            
            if (!isMatch) {
                return res.status(400).json({
                    message: "Password does not match",
                });
            }

            // Generate JWT token
            const token = jwt.sign({
                id: existUser._id,
                name: existUser.name,
                email: existUser.email,
                image: existUser.image,
                isDeleted:existUser.isDeleted,
            }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Send the token in response
            res.cookie('userToken', token);
            return res.status(200).json({
                message: "User login successful!",
                token,
                existUser
            });

        } catch (err) {
            return res.status(400).json({
                message: "User login failed",
                error: err.message || err,
            });
        }
    }


    
    // update user
    async updateUser(req,res){
        try{
            
            const v = new Validator(req.body, {
                name: 'string|minLength:3',
                
            });
        
            const matched = await v.check();
        
            if (!matched) {
                return res.status(400).json({ errors: v.errors });
            }
            const id = req.user.id;
            console.log((id));
            
            const findUser=await userRepositories.findUserById(id);
            if(!findUser){
                return res.status(404).json({ message: "User not found" });
            }
            
            let image = findUser.image; 
            if (req.file) {
                image = req.file.path; 
            }
            const{name}=req.body;            
            if(name===findUser.name && !req.file){
                return res.status(400).json({
                    message:"No data is detected to upadate"
                })
            }
            const updateData = {name}
            const updateUser = await userRepositories.updateUserData(id,updateData)

            if(updateUser){
                res.status(200).json({
                    message: "user update successfully",
                    data: updateUser
                })
            } 

        }catch(err){
            res.status(400).json({
                message: "user update failled",
                error:err.message||err
            })
        }
    }


    // user delete account

    async deleteAccount(req,res){
        try{

            const v = new Validator(req.body,{
                email:'required|email'
            })
            const matched = await v.check();
        
            if (!matched) {
                return res.status(400).json({ errors: v.errors });
            }
            
            const { email } = req.body;

            const matcEmail=await userRepositories.findUserByEmail(email);
            if(!matcEmail || matcEmail.isDeleted==true){
                return res.status(409).json({ message: 'User is not exist!!' });
            }
           

            const updateuser = await userRepositories.updateisDelete(email);

            if(updateuser){
                res.clearCookie('userToken');
                res.status(200).json({
                    message: "user account has been deleted successfully"
                })
            }
           
           
        }catch(err){
            res.status(400).json({
                message: "user account delete failled",
                error:err.message||err
            })
        }
    }


    // changed password
    async changePassword(req, res) {
        try {
            const v = new Validator(req.body, {
              currentPassword: 'required|string|minLength:6',
              newPassword: 'required|string|minLength:6',
              confirm_Newpassword: 'required|string|same:newPassword'
            });
        
            const matched = await v.check();
        
            if (!matched) {
              return res.status(422).json({ message: 'Validation failed', errors: v.errors });
            }
        
            const { currentPassword,newPassword } = req.body;
            const email = req.user.email; 
        
            const existUser = await userRepositories.findUserByEmail(email);
            if (!existUser) {
              return res.status(404).json({ message: 'User does not exist' });
            }
        
            const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, existUser.password);
            if (!isCurrentPasswordCorrect) {
              return res.status(400).json({ message: 'Current password is incorrect' });
            }
        
            const isSamePassword = await bcrypt.compare(newPassword, existUser.password);
            if (isSamePassword) {
              return res.status(400).json({
                message: 'New password must be different from the current password'
              });
            }
        
            const hashedPassword = await hashpassword(newPassword);
            const updatePassword = await userRepositories.changedPassword(email, hashedPassword);
        
            if (updatePassword) {
              return res.status(200).json({ message: 'Password has been changed successfully' });
            } else {
              return res.status(500).json({ message: 'Password update failed' });
            }
        
          } catch (err) {
            return res.status(500).json({
              message: 'Something went wrong',
              error: err.message || err
            });
          }
    }


    // send otp
    async sendotp(req, res) {
        try{
            const v = new Validator(req.body,{
                email:'required|email'
            })
            const matched = await v.check();
        
            if (!matched) {
                return res.status(400).json({ errors: v.errors });
            }
    
            const { email } = req.body;
    
            const existUser = await userRepositories.findUserByEmail(email);
            if(!existUser){
                return res.status(409).json({ message: 'user is not exist' });

            }
            if (!existUser) {
                return res.status(400).json({
                    message: "user not exist",
                })
            }
    
            await sendmailverificationotp(req, existUser);
            res.status(200).json({
                message:"otp send successfully to your email"
            })
    
        }catch(err){
            res.status(400).json({
                message: "otp sending failed",
                error:err.message||err

            })
        }
      
    }

     // verify otp

     async verifyotp(req, res) {
        try{
            const v = new Validator(req.body, {
                otp: "required",
                email: "required|email",
                password: "required|minLength:6",
                confirm_password: "required|minLength:6|same:password"
            });
    
            const matched = await v.check();
            if (!matched) {
                return res.status(400).json({ errors: v.errors });
            }
            const { otp, email, password} = req.body;
    
    
            const existinguser = await userRepositories.findUserByEmail(email);
            if(!existinguser){
                return res.status(409).json({ message: 'user is not exist' });

            }
            
            const userid=existinguser._id;
            
            const otpMatched = await userRepositories.otpVerification(userid,otp);
            if (!otpMatched) {
                return res.status(400).json({
                    message: "Invalid otp",
                })
            }
    
            const currentTime = new Date();
            // 15 * 60 * 1000 calculates the expiration period in milliseconds(15 minutes).
            const expirationTime = new Date(otpMatched.createAt.getTime() + 15 * 60 * 1000);
            console.log(expirationTime);
            
            if (currentTime > expirationTime) {
                // OTP expired, send new OTP
                return res.status(400).json({
                    message: "otp expire!!",
                })
            }
    
    
            const bcryptPassword = await hashpassword(password);
            
            const changedPassword=await userRepositories.changedPassword(email,bcryptPassword);
            
            if(changedPassword){
                return res.status(200).json({
                    message: "Password changed successfully!!",
                })
            }
        }catch(err){
            res.status(400).json({
                message: "otp Verification failed",
                error:err.message||err

            })
            
        }

    }




























    async getAllUser(req,res){
        try{
            const getUser=await userRepositories.getAllUser();
            if(!getUser){
                return res.status(400).json({
                    message:"No user is available!!"
                })
            }

            return res.status(200).json({
                message: "User fetches successful!!",
                data: getUser
            })
        }catch(err){
            res.status(400).json({
                message: "User fetch faield",
                error:err.message||err

            })
        }
    }

}


module.exports = new userController();
