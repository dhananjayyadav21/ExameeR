import transporter from './Email.config';
import { VerificationEmail_Template, WelcomeEmail_Template, SupportEmail_Template, ForgotPasswordEmail_Template } from './emailTemplate';

const MyEmail = process.env.EMAIL;

export const sendVerificationEamil = async (Email, VerificationCode) => {
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

export const sendWelcomeEmail = async (Email, Username) => {
    try {
        const response = await transporter.sendMail({
            from: `"Examee" <${MyEmail}>`,
            to: Email,
            subject: "Welcome In Examee",
            text: "Welcome In Examee",
            html: WelcomeEmail_Template.replace("{{USERNAME}}", Username)
        })
        console.log('Welcome Email send Successfully', response)
    } catch (error) {
        console.log('Welcome Email error', error)
    }
}

export const sendForgotPasswordEmail = async (Email, ForgotPasswordCode) => {
    try {
        const response = await transporter.sendMail({
            from: `"Examee" <${MyEmail}>`,
            to: Email,
            subject: "Reset Your Password",
            text: `Your forgot password verification code is: ${ForgotPasswordCode}`,
            html: ForgotPasswordEmail_Template(ForgotPasswordCode),
        });
        return response;
    } catch (error) {
        console.log('Forgot Password Email error', error);
        throw error;
    }
};

export const sendSupportEmail = async (name, email, subject, body) => {
    try {
        const response = await transporter.sendMail({
            from: `"Examee" <${MyEmail}>`,
            to: `youaretopperofficial+exameesupport@gmail.com`,
            subject: subject,
            text: `Examee User Support : ${subject}`,
            html: SupportEmail_Template(name, email, subject, body),
        });
        return response;
    } catch (error) {
        console.log('Support Email error', error);
        throw error;
    }
};

export const announceMentEmail = async (Email, subject, emailBody) => {
    try {
        const response = await transporter.sendMail({
            from: `"Examee" <${MyEmail}>`,
            to: Email,
            subject: subject,
            text: `Examee Announce : ${subject}`,
            html: emailBody,
        });
        return response;
    } catch (error) {
        console.log('Announce Email error', error);
        throw error;
    }
};
