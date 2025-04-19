const transporter = require('../Config/emailConfig');


const sendRegistrationMail = async (req, user) => {


    try {  
      console.log(user);
      
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "Your registration has been done",
            html:` <p>Dear ${user.firstname},</p>

            <p>We are excited to welcome you to the <strong>HomeCare E-Learning Platform</strong>!</p>
        
            <p><strong>Your account has been successfully registered.</strong></p>
        
            <p>Here's what you can do now:</p>
            <ul>
              <li>Explore available courses tailored for your interests</li>
              <li>Track your learning progress</li>
              <li>Connect with instructors and fellow learners</li>
            </ul>
        
            <p><strong>Login with your registered email:</strong> ${user.email}</p>
        
            <p>If you have any questions or need help getting started, feel free to reach out to our support team.</p>
        
            <p>We’re thrilled to have you onboard!</p>
        
            <p>Best regards,<br>
            The HomeCare E-Learning Team</p>
          `
          
        });
        
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, message: 'Failed to send email', error };
    }

}


module.exports={sendRegistrationMail}