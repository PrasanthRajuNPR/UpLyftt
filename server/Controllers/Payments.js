const crypto = require("node:crypto");
const User = require("../models/User");
const Course = require("../models/Course");
const { instance } = require("../config/razorPay");
const mailSender = require("../utils/mailSender");
const { paymentSuccessEmail } = require("../mail/paymentSuccessEmail");
const mongoose = require('mongoose');
const CourseProgress = require("../models/CourseProgress");

exports.capturePayment = async (req, res) => {
    const { courseIds } = req.body;  // Array of selected course IDs
    const userId = req.user.id;

    try {
        // Fetch all courses' data using the provided IDs
        const courses = await Course.find({ '_id': { $in: courseIds } });
        if (!courses.length) {
            return res.status(400).json({
                success: false,
                message: "Courses not found",
            });
        }

        // Calculate the total amount for all selected courses
        const amount = courses.reduce((total, course) => total + course.price, 0);
        const currency = "INR";

        // Razorpay order options
        const options = {
            amount: amount * 100,  // Razorpay works with paise (1 INR = 100 paise)
            currency: "INR",
            notes: {
                courseIds: courseIds.join(','),  // Send all course IDs
                userId: userId,
            },
            receipt: `rcpt_${Date.now()}`,
        };

        // Create Razorpay order
        const paymentResponse = await instance.orders.create(options);
        console.log("Created Razorpay payment order: ", paymentResponse);

        res.status(200).json({
            success: true,
            data: paymentResponse,
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

exports.verifySignature = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseIds, userDetails } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseIds || !userDetails) {
        return res.status(400).json({ success: false, message: "Invalid payment details" });
    }

    // Validate Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (razorpay_signature === expectedSignature) {
        try {
            console.log("Payment successfully authorized");

            // Enroll user in all selected courses
            const enrolledCourses = await Course.updateMany(
                { '_id': { $in: courseIds } },
                { $push: { studentsEnrolled: userDetails._id } }
            );

            if (!enrolledCourses) {
                return res.status(400).json({
                    success: false,
                    message: "Courses not found or could not update enrollment",
                });
            }

            // Add courses to the user's profile
            const updateUser = await User.findByIdAndUpdate(
                { _id: userDetails._id },
                { $push: { courses: { $each: courseIds } } },
                { new: true }
            );

            // Create course progress for each course
            const progressPromises = courseIds.map(courseId =>
                CourseProgress.create({
                    courseID: courseId,
                    userId: userDetails._id,
                    completedVideos: [],
                })
            );
            await Promise.all(progressPromises);

            // Send success email to user
            const sendMail = await mailSender(
                updateUser.email,
                `Courses Enrolled Successfully`,
                paymentSuccessEmail(
                    `${updateUser.firstName} ${updateUser.lastName}`,
                    razorpay_payment_id,
                    razorpay_order_id
                )
            );

            res.status(200).json({
                success: true,
                message: "User enrolled in courses successfully",
            });

        } catch (err) {
            console.error("Error processing payment verification:", err);
            res.status(400).json({
                success: false,
                message: err.message,
            });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: "Invalid payment signature",
        });
    }
};




exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({ success: false, message: "Please provide all the details" });
    }

    try {
        const enrolledStudent = await User.findById(userId);

        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount / 100, // Convert back to INR from paise
                orderId,
                paymentId
            )
        );
        res.status(200).json({ success: true, message: "Payment success email sent" });

    } catch (error) {
        console.log("Error in sending payment success email", error);
        return res.status(400).json({ success: false, message: "Could not send email" });
    }
};
