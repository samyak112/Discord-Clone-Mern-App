const express = require('express')
const app = express()
const http = require('http')
require('dotenv').config()
const body_parser = require('body-parser');
const port = process.env.PORT || 3080;
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
const server = http.createServer((req, res) => {
  console.log('hellow world')
})

// mogoose config
const mongoose = require('mongoose');
const { stringify } = require('querystring');
const { receiveMessageOnPort } = require('worker_threads');
const { count } = require('console');
const { response } = require('express');
const { timingSafeEqual } = require('crypto');
mongoose.connect(process.env.MONGO_URI);

// user modal
var user_details = new mongoose.Schema({
    username: String,
    tag:String,
    email: String,
    password: String,
    dob: String,
    authorized:Boolean,
    verification : [{
      timestamp : Number,
      code:String
    }],
    verification : [{
      timestamp : Number,
      code:String
    }]
    
  },{ typeKey: '$type' })

  var user_name_details = new mongoose.Schema({
    user_name:[{
      name:String,
      count:Number
    }]
  })
  
  // user
  var user = mongoose.model('discord_user', user_details);
  var username_details = mongoose.model('discord_username', user_name_details);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// making transporter to send email
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.user,
    pass: process.env.password
  }
});

// this function is for sending mail
function send_mail(otp,mail_value,name_value){
  var mailOptions = {
    from: process.env.user,
    to: mail_value,
    subject: 'Email for Verification',
    text: `Hello ${name_value}
    You registered an account on Discord Clone, Here is your otp for verification - ${otp}
    Kind Regards, Samyak`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {console.log(error);} 
    else {console.log('Email sent: ' + info.response);}
  });
}

function generateOTP() {
  console.log('generating otp')
  var digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 4; i++ ) {
      otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

function isusername_available(username){
  return new Promise ((resolve,reject)=>{
    username_details.find({"user_name.name":username},function(err,data){
      var count_value = 0;
      console.log('inside username function')
      if(err){
         console.log('here is the error')
       }
       else{
         if(data.length==0){
           var add_user_name = { $push: {user_name:[{name:username , count:1}]}}
           var count_value = 1
           username_details.updateOne({_id:process.env.username_id},add_user_name,function(err,result){
             if (err) console.log(err)
             else{
             }
           })
         }
         else{
           var count_value = data[0].user_name[0].count+1
           var add_user_name = { $set: {user_name:[{name:username , count:count_value}]}}
           username_details.updateOne({_id:process.env.username_id},add_user_name,function(err,result){
             if (err) console.log(err)
             else{
             }
           })
         }
         const final_tag = generatetag(count_value)
        
       // res.redirect('/verify')
       // res.status(201).json({message:'data saved',status:201});
         const value = {message : 'data saved' , status:201 , final_tag:final_tag}
         resolve(value);
   
       }
     })
  })
 
 }

function signup(email,username,password,dob){
  return new Promise((resolve,reject)=>{
    user.find({ email: email }, function (err, data) {
      if (data.length == 0) {
        console.log('inside signup')
        // this if condition validates the form in case js is off in some browser it also checks if password length is less than 7
        if(username== '' || email=='' || password =='' || dob==''){
          console.log('entries wrong')
          response = {message:'wrong input', status : 204};
          resolve(response) ;
        }
        else if(password.length<7){
          console.log('password length not enough')
          response = {message:'password length', status : 400};
          resolve(response) ;
        }
        else{
          let response = {message:true};
          console.log(response,'new user')
          resolve (response);
        }
      }
      else {
        if(data[0].authorized == true){
          console.log('user already exists')
          response = {message:'user already exists', status : 202};
          resolve(response) ;
          // res.status(202).json({message:'user already exists' , status : 202})
        }
        else{
          current_time_stamp =  data[0].verification[0].timestamp
          if(data[0].username != username && ((Date.now())-current_time_stamp ) < 120000){
            // TLE = time limit exceeded
            let response = {message:'not_TLE' , otp:data[0].verification[0].code};
            resolve(response) ;
          }
  
          //updated account creds without changing otp because otp is not expired yet and someone tried to fill the form again with same email address
          else if( data[0].username == username && ((Date.now())-current_time_stamp ) < 120000){
            let response = {message:'not_TLE_2' , otp:data[0].verification[0].code , tag: data[0].tag};
            resolve (response) ;
          }
  
          //updated account creds with changing otp because otp is expired and someone tried to fill the form again with same email address
          else if( data[0].username == username && ((Date.now())-current_time_stamp ) > 120000){
            let response = {message:'TLE' , tag: data[0].tag};
            resolve (response) ;
          }
  
          else if( data[0].username != username && ((Date.now())-current_time_stamp ) > 120000){
            let response = {message:'TLE_2'};
            resolve (response) ;
          }
        }
      }
    })
  })  
  
}

function updating_creds(account_creds,otp,email,username){
  return new Promise((resolve,reject)=>{
    user.updateOne({ email: email }, account_creds, function (err, result) {
      console.log('inside updating function')
      if (err) throw err;
      else {
        console.log('going to verification')
      }
      send_mail(otp,email,username)
      const response = {message : 'updated' , status:201}
      resolve (response)
    });
  })
  
}

function generatetag(count_value){
  console.log('generating tag')
  var default_value = '0000'
  console.log(count_value,'here i am')
  var count_value_str =  count_value.toString();
  var count_length = count_value_str.length;
  var final_str_1 = default_value.slice(0,default_value.length-count_length)
  var final_str = final_str_1 + count_value_str;
  return final_str;
}

const authToken = async(req,res,next)=>{
  try {
    const authHeader = req.headers['x-auth-token']
    const verified = jwt.verify(authHeader, process.env.ACCESS_TOKEN);
    next()
    
  } catch (err) {
    res.status(400).json({message:'not right',status:400});
    console.log('not authorized')
  }
}

app.post('/verify_route' , authToken,(req,res) =>{
  console.log('authorizing routes')
  // console.log('kitni baar chla ye getdata')
  res.status(201).json({message:'authorized',status:201});
})

app.post('/signup',async (req,res)=>{
  const {email , username , password, dob} = req.body
  authorized = false;

  let response = await signup(email,username,password,dob);

  if(response.status == 204 || response.status == 400 || response.status == 202){
    let status = response.status
    res.status(status).json({message:response.message , status : status})
  }

  // new user
  else if(response.message == true){
    const otp = generateOTP();
    let username_response = await isusername_available(username)
    let final_tag = username_response.final_tag

    // here we saved those values in the new user to be saved in database 
    var new_user = new user({ username: username, tag: final_tag , email: email,password:password, dob: dob,authorized:authorized,verification : [{
      timestamp : Date.now(),
      code:otp
    }] });

    // if the user doesnot exist we send a verification code to verify that the email entered is not fake 
    send_mail(otp,email,username)
    console.log('in saving')

    // here we saved users details
    new_user.save(function (err_2, data_2) {
      if (err_2) return console.error(err_2);
      else { }
    });
    res.status(201).json({message:'data saved',status:201});
  }

  else if(response.message == 'not_TLE' || response.message == 'TLE_2'){
    let username_response = isusername_available(username)
    let tag = username_response.final_tag
    var account_creds = { $set: { username: username, tag: tag, email: email, password: password, dob: dob,authorized:authorized} };
    var otp = 0;
    // username not equal and tl not exceeded
    if(response.message == 'not_TLE'){
      var otp = response.otp
    }
    
    // username not equal and tl exceeded
    else{
      var otp = generateOTP()
    }

    let new_response = await updating_creds(account_creds,otp,email,username)
    let status = new_response.status
    res.status(status).json({message:new_response.message , status : status})
  }

  else if(response.message == 'not_TLE_2' || response.message == 'TLE'){
    let tag = response.tag;
    var otp = 0;

    // username equal and tl not exceeded
    if(response.message == 'not_TLE_2'){
      var account_creds = { $set: { username: username, tag:tag, email: email, password: password, dob: dob,authorized:authorized} };
      var otp = response.otp
    }

    // username equal and tl exceeded
    else{
      var otp = generateOTP()
      var account_creds = { $set: { username: username,email: email, tag:tag,password: password, dob: dob,authorized:authorized ,verification:[{
        timestamp:Date.now(),
        code: otp
      }]} };
    }
    
    let new_response = await updating_creds(account_creds , otp , email , username)
    let status = new_response.status
    res.status(status).json({message:new_response.message , status : status})
  }


})

app.post('/verify', function (req, res) {
  const {email,otp} = req.body
  // const email = req.body.email
  // const otp = req.body.otp_value
  user.find({email:email},function(err,data_2){
    if(err){
      console.log(err)
    }
    else{
      console.log('verification done')
      // if current time minus the time when user got the otp is less than 12000(2 minutes) then we check otp is correct or not
      current_time_stamp = data_2[0].verification[0].timestamp
      if (((Date.now())-current_time_stamp ) < 120000) {
        if(req.body.otp_value == data_2[0].verification[0].code){
          // here we update authorized value to true in our database so next time if someone tries to sign up with this email we can tell that user already exists
          var new_val = { $set: { authorized: true } };
          user.updateOne({ email: email }, new_val, function (err, result) {
          if (err) throw err;
          else {res.status(201).json({message:'Congrats you are verified now' , status:201})}
          });
        }
        // wrong otp go back to main page
        else{
          console.log('incorrect')
          res.status(432).json({error:'incorrect passowrd' , status:432})
          }
      }
      // now we come to this else condition only if the current time minus the time when user got the otp is greater than 2min which is the time to expire our otp 
      // so we change the otp now
      else {
        // updating time stamp value and generating new otp
        const otp = generateOTP()
        var new_val = { $set: { verification: [{
          timestamp:Date.now(),
          code:otp
        }]}};
        user.updateOne({ email: email }, new_val, function (err, result) {
        if (err) throw err;
        else {send_mail(otp,email,username)
        console.log('otp sent again')
        res.status(442).json({error:'otp changed' , status:442})}
      });
      }
    }
  })
})

app.post('/signin', function (req, res) {
  // console.log(req.body.email)
  user.find({ email: req.body.email }, function (err, data) {
    if (data.length == 0) {
      res.status(442).json({error:'invalid username or password',status:442})
      console.log('invalid username or password')
    }
    else {
      if (req.body.password == data[0].password) {
          if (data[0].authorized == true) {
            const token = jwt.sign({id:data[0].id , username:data[0].username},process.env.ACCESS_TOKEN)
            res.status(201).json({message:'you are verified',status:201 , token:token});
            console.log('you are verified')
          }
          else {
            res.status(422).json({error:'you are not verified yet',status:422});
            console.log('you are not verified yet')
          }
      }
      else {
        res.status(442).json({error:'invalid username or password',status:442});
        console.log('invalid username or password')
      }
    }
  })
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

