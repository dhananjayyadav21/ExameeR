const userModel = require('../model/User');

const getUser = async (req, res)=>{
    try {
        let userId = req.user._id;

        const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode -_id');

        return res.status(200).json({
            success:true,
            message: 'User details fetch successfully',
            user
         })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Getting user details failed'
        });
    }
}

module.exports = getUser