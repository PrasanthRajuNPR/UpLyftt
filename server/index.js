const express = require("express");
const app = express();
const cloudConnect=require("./config/cloudinary")
const userRouter = require("./routes/User");
const ProfileRouter = require("./routes/Profile");
const courseRouter = require("./routes/Course");
const dbConnect = require("./config/database");
const contactRouter = require("./routes/Contact")
const paymentsRouter = require("./routes/Payment");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const Cloud_connect = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const dummyRouter = require("./routes/dummy");
dotenv.config();

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

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"server is up",
    })
}); 
app.listen(PORT,()=>{
    console.log(`Server listening at port : ${PORT}`);
});
