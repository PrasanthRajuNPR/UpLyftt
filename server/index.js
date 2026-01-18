const express = require("express");
const app = express();

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

const PORT = process.env.PORT || 3000;
//connect to database
dbConnect();
//middlewares
app.use(express.json());

app.use(cookieParser());

app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true
    })
)
app.use(fileUpload({
    useTempFiles: true,   // This ensures the files are saved as temporary files
    tempFileDir: '/tmp'  
}));

//connect cloudinary
Cloud_connect();

//routes
app.use("/api/v1/auth",userRouter);
app.use("/api/v1/profile",ProfileRouter);
app.use("/api/v1/course",courseRouter);
app.use("/api/v1/reach",contactRouter);
app.use("/api/v1/payment",paymentsRouter);
app.use("/dummy",dummyRouter);

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"server is up",
    })
}); 
app.listen(PORT,()=>{
    console.log(`Server listening at port : ${PORT}`);
});
