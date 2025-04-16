const transporter = require('./Email.config')
const {VerificationEmail_Template,WelcomeEmail_Template} = require('./emailTemplate');
const MyEmail = process.env.EMAIL;

export const sendVerificationEamil= async(Email,VerificationCode)=>{
    try {
     const response=   await transporter.sendMail({
            from: `"Examee" <${MyEmail}>`,

            to: Email,
            subject: "Verify your Email", 
            text: "Verify your Email", 
            html: VerificationEmail_Template.replace("{{VERIFICATION_CODE}}",VerificationCode)
        })
        console.log('Verification Email send Successfully',response)
    } catch (error) {
        console.log('Verification Email error',error)
    }
}

export const sendWelcomeEmail= async(Email,Username)=>{
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