const router = require('express').Router();
const async = require('async');
const crypto = require("crypto");
const multer = require('multer')
const sgMail = require('@sendgrid/mail');
const User = require('../models/user')
const Code = require('../models/code');
const Token = require('../models/token');
const upload = require('./upload');
const middleware = require("../middleware")
const unirest = require('unirest')
const passport = require('passport')

const admin = 1;

//HOMEPAGE
router.get('/', (req, res, next)=>{
  res.redirect('/login')
})

/* SIGNUP ROUTE */
router.route('/register')
  .get((req, res, next) => {
    res.render('web/register');
  })
  .post((req, res, next) => {
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
        req.flash('error',  'Account with that email address already exists.');
        return res.redirect('/register');
      }else {
        User.findOne({ phonenumber: req.body.phone }, function(err, existingUserPhone){
          if (existingUserPhone){
            req.flash('error',  'Account with that phone number already exists.');
            return res.redirect('/register');
          }
        })
        const user = new User();
        const { username, fname, lname, email, password, phone } = req.body;
          if(!fname || !lname || !username || !email || !password || !phone ){
            req.flash('error',  'Please enter input fields');
            return res.redirect('/register')
          }
        user.firstname = fname;
        user.lastname = lname;
        user.username = username;
        user.email = email;
        user.phonenumber = phone;
        user.password = password;
        user.role = admin;
        user.photo = user.gravatar();
        user.save(function(err) {
          if (err) {
            req.flash('error', err.message);
            return next(err);
          }
        //Create an 8 random number
        var code = new Code({ _userId: user._id, code: getRandom(6) });
        
        // Save the code
        code.save(function(err){
          if (err) { req.flash('error', err.message) }
          unirest.post( 'https://api.smartsmssolutions.com/smsapi.php')
          .header({'Accept' : 'application/json'})
          .send({
              'username': process.env.SMSSMARTUSERNAME,
              'password': process.env.SMSSMARTPASSWORD,
              'sender': process.env.SMSSMARTSENDERID,
              'recipient' : `234${user.phonenumber}`,
              'message' : `Your DOCH registration is received, Use this code ${code.code} to verify your DOCH account, DO NOT reply to this message`,
              'routing': 4,
              
          })
          .end(function (response) {
              console.log(response.body);
          });
        })

          req.flash('success', 'A verification code has been sent to ' + user.phonenumber + '.')
          req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/sms-verification') 
          });
        });
      }
    });
  });

  
/* LOGIN ROUTE */
router.route('/login')
  .get((req, res, next) => {    
    if (req.user){
      return res.redirect('/dashboard');
    }
    res.render('web/login', { 'error': req.flash('loginMessage')});

  })
  .post(passport.authenticate('local-login', {
    successRedirect: '/dashboard', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));


//CHANGE PHONE NUMBER
router.post('/change-phone-number', (req, res, next) => {
    User.findOne({ _id: req.user._id }, function (err, user) {
        console.log(user)
        if (err) throw err;
        if (user) {
            if (req.body.phone_number) user.phonenumber = req.body.phone_number;
            user.save(function (err) {
                req.flash('success', 'Your phone number was changed successfully')
                res.redirect('/sms-verification')
            })
        }
    })
})


// Function to generate 8 digit numbers
function getRandom(length) {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
}

module.exports = router;