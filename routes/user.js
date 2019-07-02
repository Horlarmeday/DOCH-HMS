const router = require('express').Router();
const crypto = require("crypto");
const async = require("async");
const sgMail = require('@sendgrid/mail');
const passportConfig = require('../config/passport');
const User = require('../models/user');
const UserDetails = require('../models/userdetails');
const Token = require('../models/token');
const Code = require('../models/code');
const multer = require('multer')
const middleware = require("../middleware")
const upload = require('./upload')
const Notification = require('../models/notifications')
const unirest = require('unirest')




// SMS VERIFICATION
router.route('/sms-verification')
  .get(middleware.isLoggedIn, (req, res, next) => {
    User.findOne({ _id: req.user._id }, function (err, user) {
      if (err) return next(err)
      console.log(user)
      res.render('web/sms_verification', { user })
    })
  })
  .post(middleware.isLoggedIn, (req, res, next) => {
    Code.findOne({ code: req.body.verification }, function (err, code) {
      if (err) return next(err);
      // Checking if code exists
      if (!code) {
        req.flash('error', 'Code does not exists, or may have expired')
        return res.redirect('/sms-verification')
      }

      User.findOne({ _id: code._userId }, function (err, user) {
        // Checking if user owns code
        if (!user) {
          req.flash('error', 'We were unable to find a user for this code.')
          return res.redirect('/sms-verification')
        }

        //Checking if user is verified already 
        if (user.isVerified === true) {
          req.flash('error', 'This user has already been verified.');
          return res.redirect('/sms-verification')
        }

        user.isVerified = true;
        user.save(function (err) {
          if (err) return next(err);
          console.log(user)
          req.flash('success', 'Successfully login!');
          return res.redirect('/dashboard');
        });
      })

    })
  })

// RESEND VERIFICATION CODE
// router.post('/code-resend', middleware.isLoggedIn, (req, res, next) => {
//   User.findOne({ _id: req.user._id }, function (err, user) {
//     if (err) return next(err)
//     if (!user) {
//       req.flash('error', 'We were unable to find user with this credentials')
//       res.redirect('/sms-verification')
//     }

//     if (user.isVerified) {
//       req.flash('error', 'User has already been verified')
//       res.redirect('/sms-verification')
//     }

//     //Create an 8 random number
//     var code = new Code({ _userId: user._id, code: getRandom(6) });

//     // Save the code
//     code.save(function (err) {
//       if (err) { req.flash('error', err.message) }

//       unirest.post( 'https://v2.sling.com.ng/api/v1/send-sms')
//       .header({'Accept' : 'application/json', 'Authorization' : 'Bearer sling_sjalccx24mwklh2nmkma0pwczk9tsjytofl3ntzii7bh8b17moopvv'})
//       .send({
//         'to' : `234${user.phonenumber}`,
//         'message' : `Your BoroMe registration is received, Use this code ${code.code} to verify your BoroMe account, DO NOT reply to this message`,
//         'channel' : 1001
//       })
//       .end(function (response) {
//           console.log(response.body);
//       });

//       // const AfricasTalking = new africastalking({
//       //   apiKey: process.env.AFRICASTALKING_KEY,
//       //   username: process.env.AFRICASTALKING_USERNAME
//       // }, { debug: true })

//       // //Initialize a service e.g. SMS
//       // const sms = AfricasTalking.SMS
//       // //Send code to user
//       // sms.send({
//       //   to: `+234${user.phonenumber}`,
//       //   message: `Use this code to verify your BoroMe account ${code.code}`,
//       //   from: 'BOROME ID',
//       // },
//       //   function (err, response) {
//       //     if (err) console.log(err)
//       //     console.log(response)
//       //     req.flash('success', 'Code has been resent')
//       //     res.redirect('/sms-verification')
//       //   })
//     })
//   })
// })

//TOKEN CONFIRMATION 
// router.get('/confirmation/:token_id', (req, res, next) => {
//   // Find a matching token
//   Token.findOne({ token: req.params.token_id }, function (err, token) {
//     if (!token) {
//       req.flash('error', 'We were unable to find a valid token. Your token may have expired, <a href=\"/resend\">Click here to resend token</a>')
//       return res.redirect('/auth/login')
//     }

//     // If we found a token, find a matching user
//     User.findOne({ _id: token._userId }, function (err, user) {
//       if (!user) {
//         req.flash('error', 'We were unable to find a user for this token.')
//         return res.redirect('/auth/login')
//       }

//       if (user.isEmailVerified) {
//         req.flash('error', 'This users email has already been verified.');
//         return res.redirect('/auth/login')
//       }

//       // Verify and save the user
//       user.isEmailVerified = true;
//       user.save(function (err) {
//         if (err) return next(err);
//         console.log(user)
//         req.flash('success', 'Your account has been verified. Please log in.');
//         return res.redirect('/auth/login');
//       });
//     });
//   });
// });

// FORGOTTEN PASSWORD
router.post('/forgot', (req, res, next) => {
  async.waterfall([

    function (done) {
      crypto.randomBytes(16, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },

    function (token, done) {
      User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
          done(err, token, user);
        });
      });
    },

    function (token, user, done) {
      sgMail.setApiKey(process.env.SENDGRID_MAIL);
      const msg = {
        to: user.email,
        from: 'BoroMe <noreply@borome.ng>',
        subject: 'Password Reset',
        html: '<p>' + 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' + 'If you did not request this, please ignore this email and your password will remain unchanged.\n </p>',
      }
      sgMail.send(msg, function (err) {
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      })
    }
  ],

    function (err) {
      if (err) return next(err);
      res.redirect('/forgot');
    })
})

// PASSWORD RESET
router.route('/reset/:token')
  .get((req, res) => {
    User.findOne({
      passwordResetToken: req.params.token,
      passwordResetExpires: {
        $gt: Date.now()
      }
    }, function (err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('web/reset', {
        user: req.user
      });
    });
  })
  .post((req, res) => {
    async.waterfall([
      function (done) {
        User.findOne({
          passwordResetToken: req.params.token,
          passwordResetExpires: {
            $gt: Date.now()
          }
        }, function (err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }

          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function (err) {
            req.logIn(user, function (err) {
              done(err, user);
            });
          });
        });
      },
      function (user, done) {
        sgMail.setApiKey(process.env.SENDGRID_MAIL);
        const msg = {
          to: user.email,
          from: 'BoroMe <noreply@borome.ng>',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        sgMail.send(msg, function (err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function (err) {
      res.redirect('/reset/' + req.params.token);
    });
  });


//RESEND EMAIL CONFIRMATION TOKEN
// router.route('/resend')
//   .get((req, res, next) => {
//     res.render('web/token_resender')
//   })
//   .post((req, res, next) => {
//     User.findOne({ email: req.body.email }, function (err, user) {
//       if (!user) {
//         req.flash('error', 'We were unable to find a user with that email.')
//         return res.redirect('/resend')
//       }
//       if (user.isVerified) {
//         req.flash('success', 'This account has already been verified. Please log in.')
//         return res.redirect('/auth/login')
//       }

//       // Create a verification token, save it, and send email
//       var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

//       // Save the verification token
//       token.save(function (err) {
//         if (err) { req.flash('error', err.message); }

//         sgMail.setApiKey(process.env.SENDGRID_MAIL);
//         const msg = {
//           to: user.email,
//           from: 'BoroMe <noreply@borome.ng>',
//           subject: 'Account Verification Token',
//           html: '<p>Hello,\n\n' + 'Please verify your account by clicking this link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n</p>',
//         }
//         sgMail.send(msg)
//         req.flash('success', 'A verification email has been sent to ' + user.email + '.')
//         return res.redirect('/resend')
//       })
//     })
//   })

// USER DETAILS
router.get('/notification/:id', (req, res, next) => {
  Notification.findById({ _id: req.params.id }, function (err, notification) {
    console.log(notification)
    if (err) throw err;
    if (notification) {
      var notificationObj = {}
      notification.read = true
      notification.save(function (err) {
        Loan.findById({ _id: notification.loan }, (err, loan) => {
          notificationObj.content = notification.content;
          notificationObj.amount = loan.amount;
          console.log(notificationObj)
          res.render('customer/view_notification', { notification: notificationObj })
        })
        // res.redirect('/transactions')
      })
    }
  })
})

// USER DETAILS
router.get('/notification/all/:id', (req, res, next) => {
  Notification.find({ recepient: req.params.id }, function (err, notifications) {
    console.log(notifications)
    if (err) throw err;
    if (notifications) {
      notifications.forEach((notification) => {
        notification.read = true
        notification.save(function (err) {

        })
      })
      res.redirect('/transactions')
    }
  })
})


/* USER PROFILE ROUTE */
router.route('/profile')
  .get(passportConfig.isAuthenticated, (req, res, next) => {
    if (req.user.role !== 2) {
      User.findOne({ _id: req.user._id })
        .populate('userdetails')
        .exec(function (err, user) {
          console.log(user)
          res.render('admin/profile', { user });
        })
    } else {
      User.findOne({ _id: req.user._id })
        .populate('userdetails')
        .exec(function (err, user) {
          console.log(user)
          Notification.find({ recepient: req.user._id }, (err, notificatons) => {
            if (user.userdetails.length === 0) {
              console.log('here')
              res.render('customer/edit_profile', { user: user, Notifications: notificatons });
            } else {
              res.render('customer/profile', { user: user, Notifications: notificatons });
            }
          })
        })
    }
  })
  .post((req, res, next) => {
    User.findOne({ _id: req.user._id }, function (err, user) {
      if (err) throw err;
      if (user) {
        if (req.body.fullname) user.fullname = req.body.fullname;
        if (req.body.phonenumber) user.phonenumber = req.body.phonenumber;
        if (req.body.email) user.email = req.body.email;
        user.save(function (err) {
          req.flash('success', 'Your details have been successfully updated')
          res.redirect('/profile')
        })
      }
    })
  });



//PROFILE PICTURE
// router.post('/upload', (req, res) => {
//   User.findOne({ _id: req.user._id }, function (err, user) {
//     upload(req, res, (err) => {
//       if (err instanceof multer.MulterError) {
// 		req.flash('error', 'Your file is too large, try reducing the size')
// 		return res.redirect('/user-registration')
//       }
// 	  else if (err) {
// 		return next(err)
// 	  }
// 	  else if (req.files == undefined) {
// 		console.log('file is undefined')
// 	  }
//         else {
//           /** Create new record in mongoDB*/
//           var fullPath = req.files[0].filename;
//           user.photo = fullPath;
//           user.save(function (err) {
//             req.flash('success', 'Your profile picture have been successfully uploaded')
//             res.redirect('/dashboard')
//           });
//         }
//       })
//     })
//   })


//LOGOUT ROUTE
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});


module.exports = router;
