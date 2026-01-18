const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto")
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;
        const validUser = await User.findOne({ email });

        if (!validUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const resetPassToken = crypto.randomUUID(); // No await needed for UUID

        validUser.resetPassToken = resetPassToken;
        validUser.resetTokenExpires = Date.now() + 5 * 60 * 1000;
        await validUser.save();

        const url = `${process.env.BASE_URL}/update-password/${resetPassToken}`;

        // --- APPLY THE LOGIC HERE ---
        console.log("Attempting to send email to:", email);
        
        const emailResponse = await mailSender(
            email,
            "Password reset token",
            `Password reset link: ${url}`
        );
        
        console.log("Email sent result:", emailResponse);

        return res.status(200).json({
            success: true,
            message: "Password reset link sent successfully"
        });
        // ----------------------------

    } catch (err) {
        console.error("RESET PASSWORD TOKEN ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong during token generation or email sending",
            error: err.message
        });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, resetPassToken } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        const user = await User.findOne({ resetPassToken });

        // CRITICAL: Added 'return' to stop execution
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Token"
            });
        }

        // CRITICAL: Added 'return' to stop execution
        if (user.resetTokenExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token expired"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        // Update password and clear the token so it can't be used again
        await User.findOneAndUpdate(
            { resetPassToken },
            { 
                password: hashPassword,
                resetPassToken: null, // Security: Clear the token after use
                resetTokenExpires: null 
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Password Updated Successfully",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting the password",
            error: err.message
        });
    }
}