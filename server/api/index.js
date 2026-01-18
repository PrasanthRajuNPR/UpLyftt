const express = require("express");
const app = express();

/* Load env only in local */
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

/* Routers */
const userRouter = require("../routes/User");
const profileRouter = require("../routes/Profile");
const courseRouter = require("../routes/Course");
const contactRouter = require("../routes/Contact");
const paymentsRouter = require("../routes/Payment");
const dummyRouter = require("../routes/dummy");

/* Config */
const dbConnect = require("../config/database");
const cloudConnect = require("../config/cloudinary");

/* Middleware */
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

/* Connect DB */
dbConnect();

/* Middlewares */
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp", // ✅ required for Vercel
  })
);

/* Cloudinary */
cloudConnect();

/* Routes */
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/reach", contactRouter);
app.use("/api/v1/payment", paymentsRouter);
app.use("/dummy", dummyRouter);

/* Health check */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "UpLyft backend running 🚀",
  });
});

/* Export for Vercel */
module.exports = app;
