const nodemailer = require("nodemailer");

const mailSender = async (email,title,body)=>{
    try{
        console.log(email);
        const transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
                  port: 587, // Use 587 for STARTTLS

            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })
    
        let mailSend = await transporter.sendMail({
            from:"UpLyft",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`,
        })
        console.log("Sent mail : ",mailSend)

    }catch(err){
        console.log(err.message);
    }
}

module.exports = mailSender;