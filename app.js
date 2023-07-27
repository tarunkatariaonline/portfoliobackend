const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config({path:'./config.env'})
const port = process.env.PORT

app.use(cors({
  origin:"*",
  credentials:true
}))




const mongoose = require('mongoose');
const { chownSync } = require('fs')
const sendMail = require('./utils/nodemailer')
const { Schema } = mongoose;

// const sendMail = require('./utils/nodemailer')

mongoose.connect('mongodb+srv://tarunkataria:kataria@cluster0.zchwraz.mongodb.net/portfolio').then(()=>{
    console.log("MongoDB Connected.")
}).catch((err)=>{
console.log("MongoDB is Not Connected.")
});

const contachSchema = new Schema({
    username:String,
    useremail:String,
    phonenumber:Number,
    usermessage:String
})


const Contact = mongoose.model('Contact', contachSchema);

app.get('/',(req,res)=>{
  res.send("I am a Working server")
})
app.get('/api/v1/user/contact',async (req, res) => {
//   res.send('Hello World!')
  const {useremail,usermessage,phonenumber,username} = req.body;
 
  if(!useremail|| !username || !phonenumber || !usermessage){
  return  res.status(406).json({
        message:"Invalid"
    })
  }





  const data = await Contact.create(req.body)

  const email = req.body.useremail 
  const adminEmail = "tarunkatariaonline@gmail.com"
//   console.log(emails)

const mail = `Dear ${username},
<br/>
<br/>
I would like to express my sincere gratitude for meeting with us to discuss your query regarding our portfolio. Your time and interest are greatly appreciated.
<br/>
<br/>
Once again, thank you for your interest in our portfolio and for granting us the opportunity to meet with you. We are eagerly looking forward to our upcoming meeting and working together to achieve outstanding outcomes.
<br/>
<br/>
Should you have any questions or require any further information in the meantime, please do not hesitate to reach out. We are always available to assist you.
<br/>
<br/>
Best regards,
<br/>
<br/>
Tarun Kataria 🚀
`
try{
    
   
  await sendMail(email,mail,"Thank You for Your Portfolio Query")
  await sendMail(adminEmail,usermessage,"Contact From Portfolio")
    }catch(err){
         res.status(406).json({
            message:"Error in Message Send"
        })
    }
   res.status(200).json({
    message:"Your Message Sended Sucessfully."
   })



})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})