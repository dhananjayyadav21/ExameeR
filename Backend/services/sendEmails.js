const transporter = require('./Email.config')
const {VerificationEmail_Template,WelcomeEmail_Template,ForgotPasswordEmail_Template} = require('./emailTemplate');
const MyEmail = process.env.EMAIL;

const sendVerificationEamil = async (Email, VerificationCode) => {
    try {
        const response = await transporter.sendMail({
            from: `"Examee" <${MyEmail}>`,
            to: Email,
            subject: "Verify your Email",
            text: `Your verification code is: ${VerificationCode}.`,
            html: VerificationEmail_Template(Email, VerificationCode), 
        });
        console.log('Verification Email sent Successfully', response);
    } catch (error) {
        console.log('Verification Email error', error);
    }
};

const sendWelcomeEmail= async(Email,Username)=>{
    try {
     const response=   await transporter.sendMail({
            from: `"Examee" <${MyEmail}>`,
            to: Email, 
            subject: "Welcome In Examee",
            text: "Welcome In Examee",
            html: WelcomeEmail_Template.replace("{{USERNAME}}",Username)
        })
        console.log('Welcome Email send Successfully',response)
    } catch (error) {
        console.log('Welcome Email error',error)
    }
}

const sendForgotPasswordEmail = async (Email, ForgotPasswordCode) => {
    try {
      const response = await transporter.sendMail({
        from: `"Examee" <${MyEmail}>`,
        to: Email,
        subject: "Reset Your Password",
        text: `Your forgot password verification code is: ${ForgotPasswordCode}`,
        html: ForgotPasswordEmail_Template(ForgotPasswordCode), 
      });
      console.log('Forgot Password Email sent Successfully', response);
    } catch (error) {
      console.log('Forgot Password Email error', error);
    }
  };


module.exports = {
    sendVerificationEamil,
    sendWelcomeEmail,
    sendForgotPasswordEmail
};