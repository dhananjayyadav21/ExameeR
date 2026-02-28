import jwt from 'jsonwebtoken';

const AuthToken_Secrate = process.env.AUTHTOKEN_SECRATE;

export const verifyUser = (req) => {
    try {
        const token = req.headers.get('AuthToken');
        if (!token) {
            return null;
        }
        const data = jwt.verify(token, AuthToken_Secrate);
        return data;
    } catch (error) {
        return null;
    }
};
