const express = require('express')
const app = express()
const http = require('http')
require('dotenv').config()
const port = process.env.PORT || 3080;
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const cors = require('cors')

app.use(cors())
app.use(express.json({limit:'10kb'}))
app.use(express.urlencoded({extended:true,limit:'10kb'}))
const server = http.createServer((req, res) => {
  console.log('hellow world')
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
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
    profile_pic : String,
    authorized:Boolean,
    servers:[{
      server_name:String,
      server_pic:String,
      server_role:String,
      server_id:String
    }],
    incoming_reqs: [{
      id:String,
      username:String,
      profile_pic:String,
      tag:String,
      status:String
    }],
    outgoing_reqs:[{
      id:String,
      username:String,
      profile_pic:String,
      tag:String,
      status:String
    }],
    friends : [{
      id:String,
      username:String,
      profile_pic:String,
      tag:String
    }],
    blocked : [{
      id:String,
      username:String,
      profile_pic:String,
      tag:String
    }],
    verification : [{
      timestamp : Number,
      code:String
    }]
    
  },{ typeKey: '$type' })

  var user_name_details = new mongoose.Schema({
      name:String,
      count:Number
  })

  var servers = new mongoose.Schema({
    server_name:String,
    server_pic:String,
    users:[{
      user_name:String,
      user_profile_pic:String,
      user_tag:String,
      user_id:String,
      user_role:String
    }],
    categories:[{
      category_name:String,
      channels:[{
        channel_name:String,
        channel_type:String
      }]
    }],
    active:Boolean
  })
  
  // user
  var user = mongoose.model('discord_user', user_details);
  var username_details = mongoose.model('discord_username', user_name_details);
  var servers = mongoose.model('discord_server', servers);


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
  var digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 4; i++ ) {
      otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

function isusername_available(username){
  return new Promise ((resolve,reject)=>{
    console.log('inside username')
    username_details.find({name:username},function(err,data){
      var count_value = 0;
      if(err){
         console.log('here is the error')
       }
       else{
         if(data.length==0){
          console.log('inside conidtion onww')
          //  var add_user_name = { $push: {user_name:[{name:username , count:1}]}}
           var count_value = 1
           var add_new_username = new username_details({name:username , count:1});
    
          // here we saved users details
          add_new_username.save(function (err_2, data_2) {
            if (err_2) return console.error(err_2);
            else {console.log(data_2) }
          });
          //  username_details.updateOne({_id:process.env.username_id},add_user_name,function(err,result){
          //    if (err) console.log(err)
          //    else{
          //     console.log(result)
          //    }
          //  })
         }
         else{
          console.log('else')
           var count_value = data[0].count+1
           var add_user_name = { $set: {name:username , count:count_value}}
           username_details.updateOne({name:username},add_user_name,function(err,result){
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
        // this if condition validates the form in case js is off in some browser it also checks if password length is less than 7
        if(username== '' || email=='' || password =='' || dob==''){
          console.log('entries wrong')
          const response = {message:'wrong input', status : 204};
          resolve(response) ;
        }
        else if(password.length<7){
          console.log('password length not enough')
          const response = {message:'password length', status : 400};
          resolve(response) ;
        }
        else{
          const response = {message:true};
          resolve (response);
        }
      }
      else {
        if(data[0].authorized == true){
          console.log('user already exists')
          const response = {message:'user already exists', status : 202};
          resolve(response) ;
          // res.status(202).json({message:'user already exists' , status : 202})
        }
        else{
          current_time_stamp =  data[0].verification[0].timestamp
          if(data[0].username != username && ((Date.now())-current_time_stamp ) < 120000){
            // TLE = time limit exceeded
            const response = {message:'not_TLE' , otp:data[0].verification[0].code};
            resolve(response) ;
          }
  
          //updated account creds without changing otp because otp is not expired yet and someone tried to fill the form again with same email address
          else if( data[0].username == username && ((Date.now())-current_time_stamp ) < 120000){
            const response = {message:'not_TLE_2' , otp:data[0].verification[0].code , tag: data[0].tag};
            resolve (response) ;
          }
  
          //updated account creds with changing otp because otp is expired and someone tried to fill the form again with same email address
          else if( data[0].username == username && ((Date.now())-current_time_stamp ) > 120000){
            const response = {message:'TLE' , tag: data[0].tag};
            resolve (response) ;
          }
  
          else if( data[0].username != username && ((Date.now())-current_time_stamp ) > 120000){
            const response = {message:'TLE_2'};
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
  var default_value = '0000'
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
  }
}

app.post('/verify_route' , authToken,(req,res) =>{
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
    var new_user = new user({ username: username, tag: final_tag , profile_pic:process.env.default_profile_pic  , email: email,password:password, dob: dob,authorized:authorized,verification : [{
      timestamp : Date.now(),
      code:otp
    }] });

    // if the user doesnot exist we send a verification code to verify that the email entered is not fake 
    send_mail(otp,email,username)

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
            const token = jwt.sign({id:data[0].id , username:data[0].username ,tag:data[0].tag, profile_pic:data[0].profile_pic},process.env.ACCESS_TOKEN)
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

function check_req(ids , user_id){
  if(ids.length!=0){
    for(let i=0 ; i<ids.length;i++){
      if(user_id == ids[i].id){
        return true
      }
      else{
        return false
      }
    }
  }
  else{
    return false
  }
}

function add_friend(user_data , friend_data){
  const{friend_id , friend_username , friend_tag , friend_profile_pic} = friend_data
  const {id , username , tag , profile_pic} = user_data

  return new Promise((resolve,reject)=>{
    console.log('adding friend....')
    let user_friends_list = { $push: {friends:[{
      id:friend_id,
      username: friend_username,
      profile_pic: friend_profile_pic,
      tag: friend_tag,
    }]} };

    let friend_friends_list = { $push: {friends:[{
      id:id,
      username: username,
      profile_pic: profile_pic,
      tag: tag,
    }]} };

      // for reciever's db delete request from incoming field
    let delete_incoming =  { $pull: {incoming_reqs: {id:friend_id}} };

    // for sender's db delete request from outgoing field
    let delete_outgoing =  { $pull: {outgoing_reqs: {id:id}} };

    let param_arr=  [user_friends_list , friend_friends_list]
    let param_arr_2 = [delete_incoming , delete_outgoing]
    let id_arr = [id , friend_id]

    for(let i = 0 ; i<2 ; i++){
      user.updateOne({ _id: id_arr[i] }, param_arr[i], function (err, result) {
        if (err){
          reject({message:'something went wrong' , status:404})
          throw err;
        } 
        });

      user.updateOne({_id:id_arr[i]},param_arr_2[i],function(err,result){
        if (err){
          reject({message:'something went wrong' , status:404})
          console.log(err)
        } 
      })
    }
    resolve({message:'friend added' , status:200})
  })
}


app.post('/add_friend',async function(req,res){
  let friend = req.body.friend
  let friend_length = friend.length
  let hash_index = friend.indexOf("#");
  if(hash_index==-1){
    res.status(400).json({message:'Invalid Input',status:400});
  }
  else{
    let name = friend.slice(0,hash_index)
    let user_tag = friend.slice(hash_index+1,friend_length)
    const authHeader = req.headers['x-auth-token']
    const user_id = jwt.verify(authHeader, process.env.ACCESS_TOKEN);

    const {id , username , tag , profile_pic} = user_id

    const isuserexists  = new Promise((resolve,reject)=>{
      user.find({username:name, tag:user_tag},function(err,data){
        if(err){
          reject(err,'something wrong in add_friend endpoint')
        }
        else{
          if(data.length==0){
            resolve(false)
          }
          else{
            // console.log(data[0].incoming_reqs)
            resolve({response:true,friend_id:data[0].id , friend_username : data[0].username , friend_tag: data[0].tag , friend_profile_pic:data[0].profile_pic , outgoing_reqs:data[0].outgoing_reqs , incoming_reqs:data[0].incoming_reqs,
            friends:data[0].friends})
          }
        }
      }).clone()
    })
    
    let result = await isuserexists

    const{incoming_reqs , outgoing_reqs , friends , response , friend_id , friend_username , friend_tag , friend_profile_pic} = result
    

    if(response == false){
      res.status(404).json({message:'User Not found',status:404});
    }
    else{
      const friend_list = check_req(friends , id)

      if(friend_list == true){
        console.log('already friends')
        res.status(201).json({message:'You are already friends with this user',status:201});
      }
      else{
        const outgoing_list = check_req(outgoing_reqs , id)
        if(outgoing_list==true){
          const response = await add_friend(user_id , result)
          console.log('friends now')
          // here we will add that user to friend list and not send the request again , this message is only for user simplicity
          res.status(201).json({message:'Request sent successfully',status:201});
        }
        else{
          const incoming_list = check_req(incoming_reqs , id)
          if(incoming_list == true){
            console.log('request alreay sent')
            res.status(202).json({message:'Request already sent',status:202});
          }
          else{
            let sending_req = { $push: {'incoming_reqs':[{
              // got these after destructuring the object user_id
              id: id,
              username: username,
              profile_pic: profile_pic,
              tag: tag,
              status:'incoming'
            }]} };
    
            let sending_req_2 = { $push: {'outgoing_reqs':[{
              id:friend_id,
              username: friend_username,
              profile_pic: friend_profile_pic,
              tag: friend_tag,
              status:'outgoing'
            }]} };
    
    
            if(response == true){
              // this update will be done in the data of the receiveing user
              user.updateOne({ _id: friend_id }, sending_req, function (err, result) {
                if (err) throw err;
                else {
                  console.log('request sent')
                }
              });
    
              // this update will be done in the data of the sending user
              user.updateOne({ _id: id }, sending_req_2, function (err, result) {
                if (err) throw err;
              });
            }
            res.status(203).json({message:'Request sent successfully',status:203});
          }
        }
      }
    }
    }
  
})

app.get('/user_relations', async function(req,res){
  const authHeader = req.headers['x-auth-token']
  const user_id = jwt.verify(authHeader, process.env.ACCESS_TOKEN);
  const result = await user.find({_id:user_id.id})
  const {incoming_reqs , outgoing_reqs , friends , servers} = result[0];
  res.status(201).json({incoming_reqs:incoming_reqs , outgoing_reqs:outgoing_reqs , friends: friends , servers:servers});

})

app.post('/process_req',async function(req,res){
  const {message , friend_data} = req.body
  const {id , profile_pic , tag , username} = friend_data
  final_friend_data = {friend_id:id , friend_profile_pic:profile_pic , friend_tag:tag , friend_username:username}
  // had to transfer the friend data to final friend data because in the function add_friend i am using destructuring and keys have to be according to that

  const authHeader = req.headers['x-auth-token']
  const user_id = jwt.verify(authHeader, process.env.ACCESS_TOKEN);
  if(message == 'Accept'){
    const result = await add_friend(user_id , final_friend_data)
    const {message , status} = result
    res.status(status).json({message:message , status:status});
  }
  else if(message == 'Ignore'){
    console.log('will do something about ignore')
  }
  else if(message == 'Unblock'){
    console.log('will do something about Unblock')
  }
  else if(message == 'Cancel'){
    console.log('will do something about Cancel')
  }
})

function template(user_details , server_details){
  return new Promise((resolve,reject)=>{
    const {name , type , image  , key , role} = server_details
    const {id , username , tag , profile_pic} = user_details

    let server_template = ''
  
     if(key==2){
      server_template = new servers({
        server_name:name,
        server_pic:image,
        users:[{
          user_name: username,
          user_profile_pic: profile_pic,
          user_tag: tag,
          user_role:role
        }],
        categories:[{
          category_name:'Text Channels',
          channels:[{
            channel_name:'general',
            channel_type:'text'
          },
        {
          channel_name:'Clips and Highlights',
          channel_type:'text'
        }]
        } , 
        {
          category_name:'Voice Channels',
          channels:[{
            channel_name:'Lobby',
            channel_type:'voice'
          },
        {
          channel_name:'Gaming',
          channel_type:'voice'
        }]
        }
      ]
      })
     }
     
     else if(key==3){
      server_template = new servers({
        server_name:name,
        server_pic:image,
        users:[{
          user_name: username,
          user_profile_pic: profile_pic,
          user_tag: tag,
          user_role:role
        }],
        categories:[{
          category_name:'INFORMATION',
          channels:[{
            channel_name:'welcome and rules',
            channel_type:'text'
          },
        {
          channel_name:'announcements',
          channel_type:'text'
        },
        {
          channel_name:'resources',
          channel_type:'text'
        },
        {
          channel_name:'qwerty',
          channel_type:'text'
        }]
        } , 
        {
          category_name:'Voice Channels',
          channels:[{
            channel_name:'Lounge',
            channel_type:'voice'
          },
        {
          channel_name:'Meeting Room 1',
          channel_type:'voice'
        },
        {
          channel_name:'Meeting Room 2',
          channel_type:'voice'
        }]
        },
        {
          category_name:'TEXT CHANNELS',
          channels:[{
            channel_name:'general',
            channel_type:'text'
          },
          {
            channel_name:'meeting-plan',
            channel_type:'text'
          },
          {
            channel_name:'off-topic',
            channel_type:'text'
          }]
        }
      ]
      })
     }

     else{
      server_template = new servers({
        server_name:name,
        server_pic:image,
        users:[{
          user_name: username,
          user_profile_pic: profile_pic,
          user_tag: tag,
          user_role:role
        }],
        categories:[{
          category_name:'Text Channels',
          channels:[{
            channel_name:'general',
            channel_type:'text'
          }]
        } , 
        {
          category_name:'Voice Channels',
          channels:[{
            channel_name:'general',
            channel_type:'voice'
          }]
        }
      ]
      })
    }
  
    server_template.save(function (err_2, data_2) {
      if (err_2) return console.error(err_2);
      else { 
        resolve({server_name:name , server_pic:image , server_id:data_2._id})
      }
    });


  })
  
}

function add_server_to_user(id , server_details , server_role){
  return new Promise((resolve, reject)=>{

    const{server_name, server_pic , server_id} = server_details

    var update_user_details = {$push:{
      servers:[{server_name:server_name ,server_pic:server_pic , server_role:server_role , server_id:server_id}]
    }}

    user.updateOne({_id:id}, update_user_details , function(err,data){
      if(err) console.log(err)
      else{
        resolve(true)
      }
    })


  })
}

app.post('/create_server',  async function(req,res){
  const {name , type , image  , key , role} = req.body.server_details
  const authHeader = req.headers['x-auth-token']
  const user_id = jwt.verify(authHeader, process.env.ACCESS_TOKEN);

  // create a server in the servers collection
  const server_template = await template(user_id , req.body.server_details)

  // adds server details in user document
  const add_server = await add_server_to_user(user_id.id , server_template , role)
  

  if(add_server==true){
    res.json({status:200 , message:'Server Created'})
  }
  else{
    res.json({status:500 , message:'Somethig Went Wrong'})
  }
})



app.post('/server_info' , async function(req,res){
  const server_id = req.body.server_id
  const server_info = await servers.find({_id:new mongoose.Types.ObjectId(server_id) })
  res.json(server_info)
})

app.post('/add_new_channel' , async function(req,res){
  const {category_id , channel_name , channel_type , server_id} = req.body
  var new_channel = {$push:{'categories.$.channels':{channel_name:channel_name , channel_type:channel_type}
  }}

  servers.updateOne({_id:new mongoose.Types.ObjectId(server_id) , 'categories._id':new mongoose.Types.ObjectId(category_id)} , new_channel,  function(err,data){
    if(err) console.log(err)
    else{
      if(data.modifiedCount>0){
        res.json({status:200})
      }
    }
  })
})


app.post('/add_new_category', async function(req,res){
  const {category_name , server_id} = req.body
  var new_category = {$push:{'categories':{category_name:category_name , channels:[]}
  }}

  servers.updateOne({_id:new mongoose.Types.ObjectId(server_id)} , new_category , function(err,data){
    if(err) console.log(err)
    else{
      if(data.modifiedCount>0){
        res.json({status:200})
      }
    }
  })

})