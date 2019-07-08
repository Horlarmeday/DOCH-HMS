const router = require('express').Router();
const async = require('async');
const User = require('../models/user');
const mongoose = require('mongoose');
const Department = require('../models/department');
const Appointment = require('../models/appointment');
const Consultation = require('../models/consultation');
const SMS = require('../models/sms');
const NurseReport = require('../models/nurseReport')
const Theater = require('../models/theater')
const Service = require('../models/service')
const Vendor = require('../models/vendor')
const Payment = require('../models/payments')
const Imaging = require('../models/imaging')
const ANC = require('../models/anc')
const Request = require('../models/request')
// const Counter = require('../models/counters')
const labItem = require('../models/labitem')
const PharmacyItem = require('../models/pharmacyItem')
const PharmDispense = require('../models/pharmDispense')
const LabDispense = require('../models/labDispense')
const HMO = require('../models/hmo')
const Drug = require('../models/drug')
const Test = require('../models/test')
const Invoice = require('../models/invoice')
const Visit = require('../models/visit')
const Lab = require('../models/lab')
const sgMail = require('@sendgrid/mail');
const multer = require('multer');
const fs = require('fs');
const middleware = require("../middleware");
const Triage = require('../models/triage');
const upload = require('./upload');
const bcrypt = require('bcrypt-nodejs')
const Notification = require('../models/notifications')
const uuidv1 = require('uuid/v4');
var unirest = require('unirest')

const patient = 8

/*********************/
// ROUTES
/**********************/

//Counters Function
// function getValueForNextSequence(sequenceOfName){
//    var sequencedoc = db.counters.findOneAndUpdate({
//         query:{ id: sequenceOfName },
//         update: {$inc:{sequence_value:1}},
//         new:true
//     })
//     return sequencedoc.sequence_value;
// }

//DASHBOARD ROUTE
router.get('/dashboard', middleware.isLoggedIn, (req, res, next)=>{
    //ADMIN
    if(req.user.role === 1){
        User.find({})
        .sort('-createdAt')
        .exec((err, users)=>{
            if(err) return next (err)
            const allUsers = [];

            Appointment.find({})
            .populate('doctor')
            .populate('patient')
            .exec((err, appointments)=>{
                if(err) return next (err)
                let appointmentIsEmpty = true;
                if (appointments.length > 0) {
                    appointmentIsEmpty = false;
                }
                users.forEach((user)=>{
                allUsers.push({
                    'firstname': user.firstname,
                    'lastname': user.lastname,
                    'address': user.address,
                    'phone': user.phonenumber,
                    'email': user.email,
                    'status': user.status,
                    'role': user.role,
                    'city': user.city,
                    'country': user.country,
                    'created': user.createdAt.toDateString(),
                })
            })
                res.render('app/dashboard', {allUsers, appointments, appointmentIsEmpty})
            }) 
        })
    }else if(req.user.role === 3){
        //NURSE
        User.find({})
        .sort('-createdAt')
        .exec((err, users)=>{
            if(err) return next (err)
            Appointment.find({}, (err, appointments)=>{
                if(err) return next (err)
                const allPatients = []
                users.forEach((user)=>{
                    if(user.role === 8){
                        allPatients.push({
                            'patientid': user.patientId,
                            'id': user._id,
                            'birthday': user.birthday,
                            'firstname': user.firstname,
                            'lastname': user.lastname,
                            'address': user.address,
                            'phone': user.phonenumber,
                            'email': user.email,
                            'status': user.status,
                            'role': user.role,
                            'city': user.city,
                            'country': user.country,
                            'created': user.createdAt.toDateString(),
                        })
                    }
                })
                res.render('app/dashboard1', {allPatients, appointments})
            })
        })
    }else if(req.user.role === 2){
        //DOCTORS
        User.find({})
        .sort('-createdAt')
        .exec((err, users)=>{
            if(err) return next (err)
            var allUsers = []
            
            Appointment.find({})
            .populate('doctor')
            .populate('patient')
            .exec((err, appointments)=>{
                if(err) return next (err)
                var appointmentIsEmpty = true;
                if (appointments.length > 0) {
                    appointmentIsEmpty = false;
                }
                users.forEach((user)=>{
                allUsers.push({
                    'firstname': user.firstname,
                    'lastname': user.lastname,
                    'address': user.address,
                    'phone': user.phonenumber,
                    'email': user.email,
                    'status': user.status,
                    'role': user.role,
                    'city': user.city,
                    'country': user.country,
                    'created': user.createdAt.toDateString(),
                })
            })
                res.render('app/dashboard2', {allUsers, appointments, appointmentIsEmpty})
            }) 
        })
    }else if(req.user.role === 7){
        //RECEPTIONIST
        User.find({}, (err, users)=>{
            if(err) return next (err)
            var allPatients = []
            users.forEach((user)=>{
                var birthday = new Date(user.birthday)
                var today = new Date()
                var age = today.getFullYear() - birthday.getFullYear()
                if(today.getMonth() < birthday.getMonth()){
                    age
                }
                if(today.getMonth() == birthday.getMonth() && today.getDate() < birthday.getDate()){
                    age
                }
                if(user.role == 8){
                    allPatients.push({
                        'id': user._id,
                        'patientId': user.patientId,
                        'firstname': user.firstname,
                        'paid': user.account.paid,
                        'lastname': user.lastname,
                        'address': user.address,
                        'phone': user.phonenumber,
                        'email': user.email,
                        'status': user.status,
                        'age': age
                    })
                }
            })
            res.render('app/dashboard3', { allPatients })
        })
    }else if(req.user.role === 9){
        //MEDICAL RECORDS
        User.find({})
        .sort('-createdAt')
        .exec((err, users)=>{
            if(err) return next (err)
            var allUsers = []
            var usersIsEmpty = true;
            if (users.length > 0) {
                usersIsEmpty = false;
            }
            Appointment.find({}, (err, appointments)=>{
                if(err) return next (err)
                users.forEach((user)=>{
                    var birthday = new Date(user.birthday)
                    var today = new Date()
                    var age = today.getFullYear() - birthday.getFullYear()
                    if(today.getMonth() < birthday.getMonth()){
                        age
                    }
                    if(today.getMonth() == birthday.getMonth() && today.getDate() < birthday.getDate()){
                        age
                    }
                    if(user.role == 8){
                        allUsers.push({
                            'createdby': user.createdby,
                            'id': user._id,
                            'patientId': user.patientId,
                            'paid': user.account.paid,
                            'firstname': user.firstname,
                            'lastname': user.lastname,
                            'address': user.address,
                            'phone': user.phonenumber,
                            'email': user.email,
                            'status': user.status,
                            'role': user.role,
                            'city': user.city,
                            'age': age,
                            'country': user.country,
                            'created': user.createdAt.toDateString(),
                        })
                    }
                })
                res.render('app/dashboard4', {allUsers, users, usersIsEmpty, appointments})
            })
        })
    }else if(req.user.role === 4){
        //LABORATORIST
        User.find({}, (err, users)=>{
            if(err) return next (err)
            Consultation.find({})
            .populate('doctor')
            .populate('patient')
            .populate('labtestObject')
            .deepPopulate('labtestObject.lab')
            .exec((err, consultations)=>{
                if(err) return next (err)
                Appointment.find({}, (err, appointments)=>{
                    if(err) return next (err)
                    res.render('app/dashboard5', { consultations, users, appointments })
                })
            })
        })
    }else if(req.user.role === 5){
        //PHARMACIST
        User.find({}, (err, users)=>{
            if(err) return next (err)
            Appointment.find({})
            .populate('doctor')
            .populate('patient')
            .exec((err, appointments)=>{
                if(err) return next (err)
                Consultation.find({})
                .populate('patient')
                .populate('doctor')
                // .populate('drugsObject')
                .deepPopulate('drugsObject.drugs')
                .exec((err, consultations)=>{
                    if(err) return next (err)
                    res.render('app/dashboard6', { appointments, users, consultations })
                })
                
            })
        })
    }else if(req.user.role === 6){
        //ACCOUNTS
        User.find({}, (err, users)=>{
            if(err) return next (err)
            Consultation.find({})
            .sort('-created')
            .deepPopulate('drugsObject.drugs')
            .populate('labtestObject')
            .populate('patient')
            .exec((err, consultations)=>{
                if(err) return next (err)
                res.render('app/dashboard7', { users, consultations })
            })
        }).sort('-createdAt')
    }else if(req.user.role === 10){
        //EMERGENCY
        User.find({})
        .sort('-createdAt')
        .exec((err, users)=>{
            if(err) return next (err)
            var allUsers = []
            var usersIsEmpty = true;
            if (users.length > 0) {
                usersIsEmpty = false;
            }
            Appointment.find({}, (err, appointments)=>{
                if(err) return next (err)
                users.forEach((user)=>{
                    var birthday = new Date(user.birthday)
                    var today = new Date()
                    var age = today.getFullYear() - birthday.getFullYear()
                    if(today.getMonth() < birthday.getMonth()){
                        age
                    }
                    if(today.getMonth() == birthday.getMonth() && today.getDate() < birthday.getDate()){
                        age
                    }
                    if(user.role == 8){
                        allUsers.push({
                            'createdby': user.createdby,
                            'id': user._id,
                            'patientId': user.patientId,
                            'paid': user.account.paid,
                            'firstname': user.firstname,
                            'lastname': user.lastname,
                            'address': user.address,
                            'phone': user.phonenumber,
                            'email': user.email,
                            'status': user.status,
                            'role': user.role,
                            'city': user.city,
                            'age': age,
                            'country': user.country,
                            'created': user.createdAt.toDateString(),
                        })
                    }
                    console.log(allUsers)
                })
                res.render('app/dashboard8', {allUsers, users, usersIsEmpty, appointments})
            })
        })
    }else if(req.user.role === 11){
        //FINANCE OFFICER
        User.find({}, (err, users)=>{
            if(err) return next (err)
            Consultation.find({})
            .populate('patient')
            .exec((err, consultations)=>{
                if(err) return next (err)
                Payment.find({})
                .sort('-createdAt')
                .populate('patient')
                .exec((err, payments)=>{
                    if(err) return next (err)
                    res.render('app/dashboard9', { users, consultations, payments })
                })
            })
        })
    }else if(req.user.role === 12){
        //NHIS
        User.find({}, (err, users)=>{
            if(err) return next (err)
            Appointment.find({})
            .populate('patient')
            .exec((err, appointments)=>{
                if(err) return next (err)
                res.render('app/dashboard10', { users, appointments })
            })
        })
    }else if(req.user.role === 13){
        //PHARMACY INVENTORY
        PharmacyItem.find({}, (err, items)=>{
            if(err) return next (err)
            Appointment.find({})
            .populate('patient')
            .exec((err, appointments)=>{
                if(err) return next (err)
                User.find({}, (err, users)=>{
                    if(err) return next (err)
                    Request.find({})
                    .populate('requestedby')
                    .exec((err, requests)=>{
                        if(err) return next (err)
                        res.render('app/dashboard11', { items, appointments, users, requests})
                    })
                })
            })
        })
    }else if(req.user.role === 14){
        //LAB INVENTORY
        labItem.find({}, (err, items)=>{
            if(err) return next (err)
            Appointment.find({})
            .populate('patient')
            .exec((err, appointments)=>{
                if(err) return next (err)
                User.find({}, (err, users)=>{
                    if(err) return next (err)
                    Request.find({})
                    .populate('requestedby')
                    .exec((err, requests)=>{
                        if(err) return next (err)
                        res.render('app/dashboard12', { items, appointments, users, requests})
                    })
                })
            })
        })
    }else if(req.user.role === 15){
        //IMAGING
        Consultation.find({}, (err, consultations)=>{
            if(err) return next (err)
            Appointment.find({})
            .populate('patient')
            .exec((err, appointments)=>{
                if(err) return next (err)
                User.find({}, (err, users)=>{
                    if(err) return next (err)
                    res.render('app/dashboard13', { consultations, appointments, users })
                })
            })
        })
    }
    else if(req.user.role === 16){
        //ANC
        Consultation.find({}, (err, consultations)=>{
            if(err) return next (err)
            Appointment.find({})
            .populate('patient')
            .exec((err, appointments)=>{
                if(err) return next (err)
                var appointmentIsEmpty = true;
                if (appointments.length > 0) {
                    appointmentIsEmpty = false;
                }
                User.find({}, (err, users)=>{
                    if(err) return next (err)
                    res.render('app/dashboard14', { consultations, appointments, users, appointmentIsEmpty })
                })
            })
        })
    }
})

//Create ID Card
router.get('/issue-card/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id}, (err, user)=>{
        if(err) return next (err)
        res.render('app/add/issue_card', {user})
    })
})

//ANAlYTICS
router.get('/analytics', middleware.isLoggedIn, (req, res, next)=>{
    User.find({role: 8}, (err, users)=>{
        if(err) return next (err)
        res.send({users})
    })
})

//ANAlYTICS
router.get('/analytics-page', middleware.isLoggedIn, (req, res, next)=>{
    User.find({role: 8}, (err, users)=>{
        if(err) return next (err)
        // var femalepatients = []
        // users.forEach((user)=>{
        //     femalepatients.push({
        //         'created': user.createdAt.getTime()
        //     })
        // })
        
        Payment.aggregate([
            {
                
                  $group : { 
                        _id : { year: { $year : "$createdAt" }, month: { $month : "$createdAt" },day: { $dayOfMonth : "$createdAt" }}, 
                        totalAmount : { $sum : {$add: '$amount'}},
                        count: {$sum: 1}
                   }
            }
        ], function(err, result) {
            if (err) {
                next(err);
            } else {
                // res.json(result);
                res.render('app/view/analytics', {users, result});
            }
        });
 
      });
    })


//REGISTRATION FEE
router.get('/registration-fees', middleware.isLoggedIn, (req, res, next)=>{
    User.find({}, (err, users)=>{
        if(err) return next (err)
        Consultation.find({})
        .populate('drugsObject')
        .populate('labtestObject')
        .populate('patient')
        
        .exec((err, consultations)=>{
            if(err) return next (err)
            res.render('app/view/reg_fee', { users, consultations })
        })
    }).sort('-createdAt')
})

//LABORATORY FEE
router.get('/laboratory-fees', middleware.isLoggedIn, (req, res, next)=>{
    User.find({}, (err, users)=>{
        if(err) return next (err)
        Consultation.find({})
        .populate('drugsObject')
        .populate('labtestObject')
        .populate('patient')
        .sort('-created')
        .exec((err, consultations)=>{
            if(err) return next (err)
            res.render('app/view/lab_fee', { users, consultations })
        })
    })
})

//LABORATORY FEE
router.get('/pharmacy-fees', middleware.isLoggedIn, (req, res, next)=>{
    User.find({}, (err, users)=>{
        if(err) return next (err)
        Consultation.find({})
        .deepPopulate('drugsObject.drugs')
        .populate('labtestObject')
        .populate('patient')
        .sort('-created')
        .exec((err, consultations)=>{
            if(err) return next (err)
            res.render('app/view/pharm_fee', { users, consultations })
        })
    })
})

//CREATE VENDOR
router.route('/add-vendor')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        res.render('app/add/add_vendor')
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const vendor = new Vendor({
            name: req.body.name,
            location: req.body.location
        })
        vendor.save((err)=>{
            if(err) return next (err)
            req.flash('success', 'Vendor was added successfully')
            res.redirect('/add-vendor')
        })
    })

//ADD IMAGING INVESTIGATION
router.route('/add-imaging-investigation')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        res.render('app/add/add_investigation')
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const imaging = new Imaging({
            name: req.body.investigation,
            description: req.body.description,
            status: true,
            price: req.body.price
        })
        imaging.save((err)=>{
            if(err) return next (err)
            req.flash('success', 'Investion was added successfully')
            res.redirect('/add-imaging-investigation')
        })
    })

//INVESTIGATIONS
router.get('/investigation-list', middleware.isLoggedIn, (req, res, next)=>{
    Imaging.find({}, (err, imaging)=>{
        if(err) return next(err)
        res.render('app/view/investigations', {imaging})
    })
})

//IMAGING REQUESTS
router.get('/patient-imaging-requests', middleware.isLoggedIn, (req, res, next)=>{
    Consultation.find({})
    .populate('patient')
    .populate('imaging')
    .exec((err, consultations)=>{
        if(err) return next(err)
        Imaging.find({}, (err, imaging)=>{
            if(err) return next(err)
            res.render('app/view/imaging_request', {imaging, consultations})
        })
    })
})

//VENDORS
router.get('/vendors', middleware.isLoggedIn, (req, res, next)=>{
    Vendor.find({}, (err, vendors)=>{
        if(err) return next(err)
        res.render('app/view/vendor', {vendors})
    })
})



//ADD A PATIENT
router.route('/add-patient')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        HMO.find({}, (err, hmos)=>{
            if(err) return next (err)
            // var nHIS = []
            // var fHSS = []
            // var privateHMO = []
            // var retainership = []
            // //FHSS
            // hmos[0].hmoenrols.forEach((name)=>{
            //   fHSS.push({
            //     'name': name.hmoenrollee
            //   })
            // })
            // //NHIS
            // hmos[1].hmoenrols.forEach((name)=>{
            //     nHIS.push({
            //       'name': name.hmoenrollee
            //     })
            // })
            // //PRIVATE HMO
            // hmos[2].hmoenrols.forEach((name)=>{
            //     privateHMO.push({
            //       'name': name.hmoenrollee
            //     })
            // })
            // //RETAINERSHIP
            // hmos[3].hmoenrols.forEach((name)=>{
            //     retainership.push({
            //       'name': name.hmoenrollee
            //     })
            // })
            User.countDocuments({role: 8})
            .exec((err, count)=>{
                var counter = count + 1
                if(err) return next (err)
                res.render('app/add/add_patient', {hmos, counter})
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        User.countDocuments({ role: 8 })
        .exec((err, count)=>{
            if(err) return next (err)
            User.findOne({ phonenumber: req.body.phone }, function(err, existingUserPhone){
                if (existingUserPhone){
                    req.flash('error',  'Account with that phone number already exists.');
                    return res.redirect('/add-patient');
                }else{
                    const user = new User()
                    user.patientId = `DOCH/000000${count + 1}`
                    user.email = req.body.email;
                    user.creator = req.user._id;
                    user.firstname = req.body.fname;
                    user.lastname = req.body.lname;
                    user.oldpatientId = req.body.oldpatientID;
                    user.createdby = 1;
                    user.isVerified = true;
                    user.religion = req.body.religion;
                    user.gender = req.body.gender;
                    user.mstatus = req.body.mstatus;
                    user.phonenumber = req.body.phone;
                    user.lga = req.body.lga;
                    user.birthday = req.body.birthday;
                    user.role = patient;
                    user.address = req.body.address;
                    user.retainership = req.body.retainership;
                    user.nextofkinname = req.body.nextofkinname;
                    user.nextofkinphone = req.body.nextofkinphone;
                    user.nextofkinaddress = req.body.nextofkinaddress;
                    user.relationship = req.body.relationship;
                    user.city = req.body.city;
                    user.state = req.body.state;
                    user.country = req.body.country;
                    user.retainershipname = user.retainershipname;
                    user.hmoname = user.hmoname;
                    user.patientcode = user.patientcode;
                    user.account = {
                        registration: req.body.registration,
                        consultation: req.body.consultation,
                    };
                    // user.family = {
                    //     family1: req.body.family1,
                    //     familydate2: req.body.familydate2,
                    // };
                    // var dependantdate = req.body.familydate2
                    // var newdate = dependantdate.map(s => Date(s))
                    // console.log(newdate[1])
                    user.family.push({
                        family1: req.body.family1,
                        familydate2: req.body.familydate2,
                    });
                    user.hmodependant.dependant1 = {
                        name: req.body.dependantname1,
                        dateofbirth: req.body.dateofbirth1
                    },
                    user.hmodependant.dependant2 = {
                        name: req.body.dependantname2,
                        dateofbirth: req.body.dateofbirth2
                    },
                    user.hmodependant.dependant3 = {
                        name: req.body.dependantname3,
                        dateofbirth: req.body.dateofbirth3
                    }
                    user.photo = user.gravatar();
                    user.save((err) => {
                        if (err) { return next(err) }
                        unirest.post( 'https://api.smartsmssolutions.com/smsapi.php')
                            .header({'Accept' : 'application/json'})
                            .send({
                                'username': process.env.SMSSMARTUSERNAME,
                                'password': process.env.SMSSMARTPASSWORD,
                                'sender': process.env.SMSSMARTSENDERID,
                                'recipient' : `234${user.phonenumber}`,
                                'message' : `Dear ${user.firstname}, Thanks for your patronage, your health is important to us. Your user ID is ${user.patientId}`,
                                'routing': 4,
                            })
                            .end(function (response) {
                                console.log(response.body);
                            });
                        req.flash('success', 'Patient has been created')
                        res.redirect('/dashboard');
                    })
                }
            })
        })
    })

//ADD EMERENCY PATIENT
// router.route('/add-emerggency-patient')
//     .get(middleware.isLoggedIn, (req, res, next)=>{
//         res.render('app/add/emergency')
//     })

//ADD EMERGENCY PATIENT
router.route('/add-emergency-patient')
.get(middleware.isLoggedIn, (req, res, next)=>{
        HMO.find({}, (err, hmos)=>{
            if(err) return next (err)
         
            User.countDocuments({role: 8})
            .exec((err, count)=>{
                var counter = count + 1
                if(err) return next (err)
                res.render('app/add/emergency', {hmos, counter})
            })
        })
})
.post(middleware.isLoggedIn, (req, res, next)=>{
    async.waterfall([
        function (done){
            User.countDocuments({ role: 8 })
                .exec((err, count)=>{
                    if(err) return next (err)
                User.findOne({ phonenumber: req.body.phone }, function(err, existingUserPhone){
                    if (existingUserPhone){
                        req.flash('error',  'Account with that phone number already exists.');
                        return res.redirect('/add-patient');
                    }else{
                        const user = new User()
                        user.patientId = `DOCH/000000${count + 1}`
                        user.email = req.body.email;
                        user.creator = req.user._id;
                        user.firstname = req.body.fname;
                        user.lastname = req.body.lname;
                        user.oldpatientId = req.body.oldpatientID;
                        user.createdby = 2;
                        user.isVerified = true;
                        user.religion = req.body.religion;
                        user.gender = req.body.gender;
                        user.mstatus = req.body.mstatus;
                        user.phonenumber = req.body.phone;
                        user.lga = req.body.lga;
                        user.birthday = req.body.birthday;
                        user.role = patient;
                        user.address = req.body.address;
                        user.retainership = req.body.retainership;
                        user.nextofkinname = req.body.nextofkinname;
                        user.nextofkinphone = req.body.nextofkinphone;
                        user.nextofkinaddress = req.body.nextofkinaddress;
                        user.relationship = req.body.relationship;
                        user.city = req.body.city;
                        user.state = req.body.state;
                        user.country = req.body.country;
                        user.retainershipname = user.retainershipname;
                        user.hmoname = user.hmoname;
                        user.patientcode = user.patientcode;
                        user.account = {
                            registration: req.body.registration,
                            consultation: req.body.consultation,
                        };
                        
                        user.photo = user.gravatar();
                        user.save((err) => {
                            if (err) { return next(err) }
                            done(err, user)
                        })
                    }
                })
            })
        }, 
        function(user, done){
            const triage = new Triage()
            triage.creator = req.user._id;
            triage.patient = user._id;
            triage.weight = req.body.weight;
            triage.height = req.body.height;
            triage.bmi = req.body.bmi;
            triage.rvs = req.body.rvs;
            triage.pulse = req.body.pulse;
            triage.respiration = req.body.respiration;
            triage.temperature = req.body.temperature;
            triage.heartrate = req.body.heartrate;
            triage.dystolic = req.body.dystolic;
            triage.systolic = req.body.systolic;
            triage.muac = req.body.muac;
            triage.save((err) => {
                if (err) { return next (err) }
                unirest.post( 'https://api.smartsmssolutions.com/smsapi.php')
                    .header({'Accept' : 'application/json'})
                    .send({
                        'username': process.env.SMSSMARTUSERNAME,
                        'password': process.env.SMSSMARTPASSWORD,
                        'sender': process.env.SMSSMARTSENDERID,
                        'recipient' : `234${user.phonenumber}`,
                        'message' : `Dear ${user.firstname}, Thanks for your patronage, your health is important to us. Your user ID is ${user.patientId}`,
                        'routing': 4,
                    })
                    .end(function (response) {
                        console.log(response.body);
                    });
            })
            User.update(
                {
                    _id: triage.patient
                },
                {
                    $push: { triages: triage._id }
                }, function (err, count) {
                    if (err) { return next(err) }
                    req.flash('success', ' Patient was created successfully')
                    res.redirect('/dashboard')
                }
            );

        }
    ])
    
})

//CREATE DOCTOR SCHEDULE
router.route('add-schedule')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        res.render('app/add/add_schedule')
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{

    })

//CREATE AN EMPLOYEE
router.route('/add-employee')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        Department.find({}, (err, departments)=>{
            if(err) return next (err)
            res.render('app/add/add_employee', {departments})
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const country = 'Nigeria';
        User.findOne({email: req.body.email}, (err, existingEmail)=>{
            if(err) {return next (err)}
            if(existingEmail){
                req.flash('error',  'Account with that email address already exists.');
                return res.redirect('/add-employee');
            }else{
                User.findOne({ phonenumber: req.body.phone }, function(err, existingUserPhone){
                    if (existingUserPhone){
                        req.flash('error',  'Account with that phone number already exists.');
                        return res.redirect('/add-employee');
                    }
                })
                uniq = uuidv1()
                var stamp = uniq.substr(uniq.length - 7);
                const user = new User();
                const { username, fname, lname, email, password, phone, role, address, department, birthday } = req.body;
                if(!fname || !lname || !username || !email || !password || !phone || !role || !address || !birthday){
                    req.flash('error',  'Please enter input fields');
                    return res.redirect('/add-employee')
                }
                user.workerId = stamp;
                user.firstname = fname;
                user.lastname = lname;
                user.username = username;
                user.email = email;
                user.isVerified = true;
                user.phonenumber = phone;
                user.birthday = birthday;
                user.password = password;
                user.department = department;
                user.address = address;
                user.country = country;
                user.role = role;
                //user.status = true;
                user.photo = user.gravatar();
                user.save((err) => {
                if (err) { return next(err) }
                req.flash('success', 'Employee has been created')
                res.redirect('/employees');
                })
            }
        })   
})

//CREATE NEW DEPARTMENT
router.route('/add-department')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        res.render('app/add/add_department')
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const department = new Department();
            department.name = req.body.name;
            department.status = true;
            department.description = req.body.description;
        department.save((err) => {
            if (err) { return next(err) }
            req.flash('success', 'Department has been created')
            res.redirect('/departments');
        })
})

//ADD AN APPOINTMENT
router.route('/add-appointment')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.find({}, (err, users)=>{
            if(err) return next (err)
            Department.find({}, (err, departments)=>{
                if(err) return next (err)
                res.render('app/add/add_appointment', {users, departments})
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        async.waterfall([
            function (done) {
                uniq = uuidv1()
                var stamp = uniq.substr(uniq.length - 7);
                const appointment = new Appointment()
                appointment.uniqueid = stamp
                appointment.creator = req.user._id;
                appointment.department = req.body.department;
                appointment.doctor = req.body.doctor;
                appointment.type = req.body.type;
                appointment.patient = req.body.patient;
                appointment.status = true;
                appointment.problem = req.body.problem;
                appointment.appointmentdate = req.body.appointment;
                appointment.appointmenttime = req.body.time;
                appointment.save((err) => {
                if (err) { return next(err) }
                    done(err, appointment)

                })
            },
            function (appointment, done) {
                User.findById(appointment.doctor, (err, user) => {
                    if (err) return next(err);
                    User.update(
                        {
                            _id: user._id
                        },
                        {
                            $push: { appointments: appointment._id }
                        },
                        function (err, count) {
                            if (err) return next(err);
                            done(err, appointment)
                        }      
                    )
                    
                })
            },
            function (appointment, done) {
                User.update(
                    {
                        _id: appointment.patient
                    },
                    {
                        $push: { appointments: appointment._id }
                    },
                    function (err, count) {
                        if (err) return next(err);
                        req.flash('success', 'Appointment has been created')
                        res.redirect('/appointments'); 
                    }      
                )
            }
        ]) 
    })

//ADD AN APPOINTMENT
router.route('/add-appointment/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({ _id: req.params.id }, (err, user)=>{
            if(err) return next (err)
            Department.find({}, (err, departments)=>{
                if(err) return next (err)
                User.find({}, (err, users)=>{
                    if(err) return next (err) 
                    res.render('app/add/add_patient_appointment', {user, users, departments})
                })
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        async.waterfall([
            function (done) {
                uniq = uuidv1()
                var stamp = uniq.substr(uniq.length - 7);
                const appointment = new Appointment()
                appointment.uniqueid = stamp
                appointment.creator = req.user._id;
                appointment.department = req.body.department;
                appointment.doctor = req.body.doctor;
                appointment.patient = req.body.patient;
                appointment.status = true;
                appointment.problem = req.body.problem;
                appointment.type = req.body.type;
                appointment.appointmentdate = req.body.appointment;
                appointment.appointmenttime = req.body.time;
                appointment.save((err) => {
                if (err) { return next(err) }
                    done(err, appointment)
                    
                })
            },
            function (appointment, done) {
                User.findById(appointment.doctor, (err, user) => {
                    if (err) return next(err);
                    User.update(
                        {
                            _id: user._id
                        },
                        {
                            $push: { appointments: appointment._id }
                        },
                        function (err, count) {
                            if (err) return next(err);
                            done(err, appointment)
                        }      
                    )
                    
                })
            },
            function (appointment, done) {
                User.update(
                    {
                        _id: appointment.patient
                    },
                    {
                        $push: { appointments: appointment._id }
                    },
                    function (err, count) {
                        if (err) return next(err);
                        req.flash('success', 'Appointment has been created')
                        res.redirect('/appointments'); 
                    }      
                )
            }
        ]) 
    })


//ADD NuRSE TRIAGES
router.route('/add-triage')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.find({}, (err, users)=>{
            if(err) return next (err)
            res.render('app/add/add_triage', {users})
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        
        const triage = new Triage()
            triage.creator = req.user._id;
            triage.patient = req.body.patient;
            triage.weight = req.body.weight;
            triage.height = req.body.height;
            triage.bmi = req.body.bmi;
            triage.rvs = req.body.rvs;
            triage.pulse = req.body.pulse;
            triage.respiration = req.body.respiration;
            triage.temperature = req.body.temperature;
            triage.heartrate = req.body.heartrate;
            triage.blood = req.body.blood;
            triage.dystolic = req.body.dystolic;
            triage.systolic = req.body.systolic;
            triage.muac = req.body.muac;
            triage.save((err) => {
                if (err) { return next (err) }
            })
        User.update(
            {
                _id: triage.patient
            },
            {
                $push: { triages: triage._id }
            }, function (err, count) {
                if (err) { return next(err) }
                req.flash('success', ' Patient triage was created successfully')
                res.redirect('/triages')
            }
        );
    })

//ADD HMOS
router.route('/add-retainership')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        res.render('app/add/add_hmo')
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const hmo = new HMO()
            hmo.creator = req.user._id;
            hmo.hmoname = req.body.hmoname;
            hmo.save((err) => {
                if (err) { return next (err) }
                req.flash('success', 'HMO successfully added')
                res.redirect('/retainerships')
            })
    })

//VIEW  ALL HMOS
router.get('/retainerships', middleware.isLoggedIn, (req, res, next)=>{
    HMO.find({}, (err, hmos)=>{
        if(err) return next (err)
        res.render('app/view/hmos', {hmos})
    })
})

//NHIS
router.route('/nhis')
.get(middleware.isLoggedIn, (req, res, next)=>{
    HMO.find({}, (err, hmos)=>{
        if(err) return next (err)
        res.render('app/view/nhis', { hmos })
    })
})
.post(middleware.isLoggedIn, (req, res, next)=>{
    HMO.findOne({_id: req.params.id}, (err, foundhmo)=>{
        if(err) return next (err)
        foundhmo.hmoenrols.push({
            hmoenrollee: req.body.hmoenrollee,
            hmocode: req.body.hmocode
        })
        foundhmo.save((err)=>{
            if(err) return (err)
            req.flash('success', 'HMO Name was added Successfully!')
            res.redirect('back')
        })
    })
})

//cONSENT FORM
router.route('/patient-consent-form')
.get(middleware.isLoggedIn, (req, res, next)=>{
    User.find({}, (err, users)=>{
        if(err) return next (err)
        res.render('app/add/consent_form', {users})
    })
})
.post(middleware.isLoggedIn, (req, res, next)=>{
    const theater = new Theater({
        patient: req.body.patient,
        operation: req.body.operation,
        doctorsign: req.body.doctorsign,
        doctorsigndate: req.body.doctorsigndate,
        interpretersign: req.body.interpretersign,
        interpreterdate: req.body.interpreterdate,
        interpretername: req.body.interpretername,
        guardianname: req.body.guardianname,
        of: req.body.of,
        upon: req.body.upon,
        surgeon: req.body.surgeon,
        guardiansign: req.body.guardiansign,
        guardianaddress: req.body.guardianaddress,
        guardiandate: req.body.guardiandate,
    })
    theater.save((err)=>{
        if (err) return next (err)
        req.flash('success', 'Consent form saved successfully')
        res.redirect('/consent-form/' + theater._id)
    })
})

//CONSENT FORM FILLED
router.get('/consent-form/:id', middleware.isLoggedIn, (req, res, next)=>{
    Theater.findOne({_id: req.params.id})
    .populate('patient')
    .populate('surgeon')
    .exec((err, theater)=>{
          if(err) return next (err)
        res.render('app/view/consent_form_filled', {theater})
    })
})

// VIEW ONE HMO PAGE
router.route('/hmo/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        HMO.findOne({ _id: req.params.id }, (err, hmo)=>{
            if(err) return next (err)
            res.render('app/view/hmo_view', { hmo })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        HMO.findOne({_id: req.params.id}, (err, foundhmo)=>{
            if(err) return next (err)
            foundhmo.hmoenrols.push({
                hmoenrollee: req.body.hmoenrollee,
                hmocode: req.body.hmocode
            })
            foundhmo.save((err)=>{
                if(err) return (err)
                req.flash('success', 'HMO Name was added Successfully!')
                res.redirect('back')
            })
        })
    })

//HMO SERVICES
router.post('/hmo-service/:id', middleware.isLoggedIn, (req, res, next)=>{
    HMO.findOne({ _id: req.params.id }, (err, gottenhmo)=>{
        if(err) return next (err)
        gottenhmo.hmoservices.push({
            service: req.body.service,
            price: req.body.price
        })
        gottenhmo.save((err)=>{
            if(err) return (err)
            req.flash('success', 'HMO Service was added Successfully!')
            res.redirect('back')
        })
    })
})

//SEND SMS
router.route('/send-sms')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.find({}, (err, users)=>{
            var allUsers = []
            if(err) return next (err)
            users.forEach((user)=>{
                if(user.role === 8){
                    allUsers.push({
                        'firstname': user.firstname,
                        'lastname': user.lastname,
                        'phone': user.phonenumber,
                    })
                }
            })
            res.render('app/add/add_sms', { allUsers })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        async.waterfall([
            function (done) {
                User.findOne({ _id: req.user._id }, function (err, user) {
                    const sms =  new SMS()
                    sms.owner = req.user._id;
                    // sms.recepient = user._id,
                    sms.phone.push(req.body.patient),
                    sms.message = req.body.message;
                    sms.status = true;
                    sms.save(function (err) {
                        done(err, sms)
                    })
                    unirest.post( 'https://api.smartsmssolutions.com/smsapi.php')
                    .header({'Accept' : 'application/json'})
                    .send({
                        'username': process.env.SMSSMARTUSERNAME,
                        'password': process.env.SMSSMARTPASSWORD,
                        'sender': process.env.SMSSMARTSENDERID,
                        'recipient' : `[234${req.body.patient}]`,
                        'message' : req.body.message,
                        'routing': 4,
                    })
                    .end(function (response) {
                        console.log(response.body);
                    });
                })
            },
            function (sms, user, done) {
                User.update(
                    {
                        _id: user._id
                    },
                    {
                        $push: { sms: sms._id }
                    }, function (err, count) {
                        if (err) { return next(err) }
                        req.flash('success', 'Your sms was sent successfully')
                        res.redirect('back')
                    }
                );
            } 
        ])
    })

//ALL SENT SMS
router.get('/sent-sms', (req, res, next)=>{
    SMS.find({})
    .populate('owner')
    .exec( function (err, sentSms) {
        if(err) return next (err)
        res.render('app/view/sent_sms', {sentSms})
    })
})


//HMO DRUGS
router.post('/hmo-drugs/:id', middleware.isLoggedIn, (req, res, next)=>{
    HMO.findOne({ _id: req.params.id }, (err, hmo)=>{
        if(err) return next (err)
        hmo.hmodrugs.push({
            drug: req.body.drug,
            price: req.body.price
        })
        hmo.save((err)=>{
            if(err) return (err)
            req.flash('success', 'HMO Drug was added Successfully!')
            res.redirect('back')
        })
    })
})



//ADD NuRSE TRIAGES
router.route('/triage/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({ _id: req.params.id}, (err, user)=>{
            if(err) return next (err)
            res.render('app/add/add_patient_triage', { user })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const triage = new Triage()
            triage.creator = req.user._id;
            triage.patient = req.params.id
            triage.weight = req.body.weight;
            triage.height = req.body.height;
            triage.bmi = req.body.bmi;
            triage.rvs = req.body.rvs;
            triage.pulse = req.body.pulse;
            triage.respiration = req.body.respiration;
            triage.temperature = req.body.temperature;
            triage.heartrate = req.body.heartrate;
            triage.blood = req.body.blood;
            triage.dystolic = req.body.dystolic;
            triage.systolic = req.body.systolic;
            triage.muac = req.body.muac;
            triage.save((err) => {
                if (err) { return next (err) }
            })
        User.update(
            {
                _id: triage.patient
            },
            {
                $push: { triages: triage._id }
            }, function (err, count) {
                if (err) { return next(err) }
                req.flash('success', ' Patient triage was created successfully')
                res.redirect('/add-appointment')
            }
        );
    })

//DAILY NURSE REPORT
router.route('/add-daily-report')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.find({}, function (err, users) {
            if(err) return next (err)
            res.render('app/add/daily_report', { users })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const nurseReport = new NurseReport();
        nurseReport.comment = req.body.comment;
        nurseReport.observation = req.body.observation;
        nurseReport.t = req.body.t;
        nurseReport.p = req.body.p;
        nurseReport.r = req.body.r;
        nurseReport.bp = req.body.bp;
        // nurseReport.input = req.body.input;
        // nurseReport.output = req.body.output;
        nurseReport.initial = req.body.initial;
        nurseReport.creator = req.user._id;
        nurseReport.patient = req.body.patient;
        nurseReport.save((err) => {
            if (err) { return next(err) }
        })
        User.update(
            { _id: nurseReport.patient },
            { $push: { reports: nurseReport._id }},
            function (err, count) {
                if(err) return next (err)
                req.flash('success', 'New Report has been created')
                res.redirect('/add-daily-report');
            }
        )
    })

//DAILY NURSE REPORT
router.get('/nurse-daily-report', middleware.isLoggedIn, (req, res, next)=>{
    NurseReport.find({})
    .populate('patient')
    .exec((err, nursereports)=>{
        if(err) return next (err)
        res.render('app/view/nurse_reports', { nursereports })
    })
})


//ADD CONSULTATIONS
router.route('/add-consultation')
    .get(middleware.isLoggedIn, (req, res, next) => {
        Lab.find({}, (err, labs) => {
            if (err) { return next(err) }
            Drug.find({}, (err, drugs)=>{
                if (err) { return next(err) }
                Test.find({}, (err, tests)=>{
                    if (err) { return next(err) }
                    Imaging.find({}, (err, imaging)=>{
                        if (err) { return next(err) }
                        res.render('app/add/add_consultation', { labs, drugs, tests, imaging })
                    })
                })
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next) => {
        const consultation = new Consultation({
            visit: req.body.visit,
            physical: {
                observation: req.body.observation,
                chest: req.body.chest,
                cvs: req.body.cvs,
                abdomen: req.body.abdomen,
                mss: req.body.mss,
                other: req.body.other
            },
            diagnosis: req.body.diagnosis,
            treatment: req.body.treatment
        })
        consultation.save((err)=>{
            if(err) return next(err)
            req.flash('success', 'Patient Consultation saved Successfully!')
            res.redirect('/consultations')
        })
    })


//ADD GENERIC DRUGS
router.route('/add-drug')
    .get(middleware.isLoggedIn, (req, res, next) => {
        Drug.find({}, (err, drugs)=>{
            if(err) return next (err)
            res.render('app/add/add_drug', {drugs})
        })
    })
    .post(middleware.isLoggedIn, (req, res, next) => {
        Drug.findOne({ code: req.body.code }, function(err, existingCode){
            if (existingCode){
              req.flash('error',  'Drug with that code already exists.');
              return res.redirect('/add-drug');
            }else{
                const drug = new Drug({
                    generic: req.body.generic,
                    code: req.body.code
                })
                drug.save((err)=>{
                    if(err) return next(err)
                    req.flash('success', 'Generic Drug added successfully!')
                    res.redirect('/add-drug')
                })
            }
        })
        
    })

//ADD DRUGS BRAND
router.route('/add-brand-name')
    .get(middleware.isLoggedIn, (req, res, next) => {
        Drug.find({}, (err, drugs)=>{
            if(err) return next (err)
            res.render('app/add/add_brand', { drugs })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next) => {
        Drug.findOne({ _id: req.body.drugId }, function(err, existingDrug){
            if (existingDrug){
                existingDrug.druginfo.push({
                    brandname: req.body.brand,
                    litre: req.body.type,
                    drugname: req.body.drugname,
                    price: req.body.price
                })
                existingDrug.save((err)=>{
                    if(err) return next (err)
                    req.flash('success', 'Drug Brand name was added successfully')
                    res.redirect('/add-brand-name')
                })
            }else{
                req.flash('error', 'Could not find generic drug')
                res.redirect('/add-brand-name')
            }
        })
        
    })



//VIEW ALL BRAND NAMES
router.get('/brand-names', middleware.isLoggedIn, (req, res, next)=>{
    Drug.find({}, (err, drugs)=>{
        if(err) return next (err)
        var brandNames = []
        drugs.forEach((drug)=>{
            drug.druginfo.forEach((info)=>{
                brandNames.push({
                    'generic': drug.generic,
                    'brandname': info.brandname,
                    'drugname': info.drugname,
                    'price': info.price,
                    'litre': info.litre
                })
            })
        })
        res.render('app/view/brand_name', { drugs, brandNames })
    })
})


//VIEW ALL DRUGS
router.get('/drugs', middleware.isLoggedIn, (req, res, next)=>{
    Drug.find({}, (err, drugs)=>{
        if(err) return next (err)
        res.render('app/view/drugs', { drugs })
    })
})

//ADD SERVICE
router.route('/add-service')
    .get(middleware.isLoggedIn, (req, res, next) => {
        res.render('app/add/add_service')
    })
    .post(middleware.isLoggedIn, (req, res, next) => {
        const service = new Service({
            creator: req.user._id,
            service: req.body.service,
            price: req.body.price
        })
        service.save((err)=>{
            if(err) return next(err)
            req.flash('success', 'Service added successfully!')
            res.redirect('/add-service')
        })
    })


//ADD BILLING
router.route('/add-billing')
    .get(middleware.isLoggedIn, (req, res, next) => {
        Service.find({}, (err, services)=>{
            if(err) return next (err)
            User.find({}, (err, users)=>{
                if(err) return next (err)
                res.render('app/add/add_billing', {services, users})
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next) => {
        const payment = new Payment()
            payment.patient = req.body.patient;
            payment.initiator = req.user._id;
            payment.amount = req.body.totalamount;
            var services = req.body.service;
            var allservices = services.map(s => mongoose.Types.ObjectId(s))
            payment.services = allservices;
            modeofpayment = req.body.modeofpayment;
            comment = req.body.comment;
            
        payment.save((err)=>{
            if(err) return next(err)
        })
        User.update(
            {
                _id: payment.patient
            },
            {
                $push: {payments: payment._id}
            },
            function(err, count){
                if(err) return next(err)
                req.flash('success', 'Billing added successfully!')
                res.redirect('/billings')
            }
        )
    })


//VIEW ALL BILLINGS
router.get('/billings', middleware.isLoggedIn, (req, res, next)=>{
    Payment.find({})
    .populate('patient')
    .populate('initiator')
    .populate('services')
    .sort('-createdAt')
    .exec((err, payments)=>{
        if(err) return next (err)
        res.render('app/view/billings', {payments })
    })
})

//VIEW SERVICES
router.get('/services', middleware.isLoggedIn, (req, res, next)=>{
    Service.find({})
    .sort('-created')
    .populate('creator')
    .exec((err, services)=>{
        if(err) return next (err)
        res.render('app/view/services', {services })
    })
})

//VIEW ALL LAB REQUESTS
router.get('/lab-requests', middleware.isLoggedIn, (req, res, next)=>{
    Consultation.find({})
    .populate('patient')
    .populate('labtestObject')
    .exec((err, consultations)=>{
        if(err) return next (err)
        res.render('app/view/lab_requests', { consultations })
    })
})



//ADD LAB RESULT
// router.route('/result/:id/:consultID')
// .get(middleware.isLoggedIn, (req, res, next) => {
//     User.findOne({ _id: req.params.id })
//     .populate('consultations')
//     .exec((err, user)=>{
//         if (err) { return next(err) }
//         Consultation.findOne({ _id: req.params.consultID }, (err, consultation) => {
//             if (err) { return next(err) }
//             res.render('app/add/add_lab_result', { consultation, user })
//         })
//     })
// })
// .post(middleware.isLoggedIn, (req, res, next) => {
//     Consultation.findOne({ _id: req.params.consultID }, (err, consultation)=>{
//         if (err) { return next(err) }
//         if(req.body.result) consultation.labresult = req.body.result;
//         if(req.body.notes) consultation.notes = req.body.notes;
//         consultation.labtestfinish = true;
//         consultation.labResultDate = Date.now
//         consultation.save((err)=>{
//             if(err){
//                 req.flash('error', 'Error sending result')
//                 return res.redirect('/result/req.params.id/req.params.consultID')
//             }else{
//                 req.flash('success', 'Lab result sent successfully')
//                 res.redirect('/lab-requests')
//             }
//         })
//     })
// })


//ALLERGIES
router.post('/allergies/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne( { _id: req.params.id }, (err, user)=>{
        if(err) {
            req.flash('error', 'Cannot find User!')
            res.redirect('/patient/' + req.params.id)
        }
        if(user){
            if(req.body.allergies) user.allergies.push(req.body.allergies)
            user.save((err)=>{
                if(err){
                    req.flash('error', err.message)
                    res.redirect('/patient/' + req.params.id)
                }else{
                    req.flash('success', `${user.firstname} allergy was saved successfully`)
                    res.redirect('/patient/' + req.params.id)
                }
            })
        }
    })
})

//ADD LAB RESULT
// router.route('/dosage/:id/:consultID')
// .get(middleware.isLoggedIn, (req, res, next) => {
//     User.findOne({ _id: req.params.id })
//     .populate('consultations')
//     .exec((err, user)=>{
//         if (err) { return next(err) }
//         Consultation.findOne({ _id: req.params.consultID }, (err, consultation) => {
//             if (err) { return next(err) }
//             res.render('app/add/add_prescription', { consultation, user })
//         })
//     })
// })
// .post(middleware.isLoggedIn, (req, res, next) => {
//     Consultation.findOne({ _id: req.params.consultID }, (err, consultation)=>{
//         if (err) { return next(err) }
//         consultation.prescription = {
//             dose: req.body.dose,
//             duration: req.body.duration,
//             frequency: req.body.frequency,
//             direction: req.body.direction
//         }
//         consultation.pharmacystatus = true;
//         consultation.save((err)=>{
//             if(err){
//                 req.flash('error', 'Error sending result')
//                 return res.redirect('/dosage/req.params.id/req.params.consultID')
//             }else{
//                 req.flash('success', 'Patient dosage was prescribed successfully')
//                 res.redirect('/dashboard')
//             }
//         })re
//     })
// })


//ADD LAB TESTS
router.route('/add-lab-tests')
    .get(middleware.isLoggedIn, (req, res, next) => {
        Lab.find({}, (err, labs)=>{
            if(err) return next(err)
            res.render('app/add/add_lab_test', {labs})
        })
    })
    .post(middleware.isLoggedIn, (req, res, next) => {
        async.waterfall([
            function(done){
                Test.findOne({ code: req.body.code }, function(err, existingCode){
                    if (existingCode){
                      req.flash('error',  'Test with that code already exists.');
                      return res.redirect('/add-lab-tests');
                    }else{
                        const test = new Test({
                            name: req.body.name,
                            price: req.body.price,
                            code: req.body.code,
                            lab: req.body.lab
                        })
                        test.save((err)=>{
                            if(err) return next(err)
                            done(err, test)
                        })
                    }
                })
            },
            function (test, done) {
                Lab.update(
                    {
                        _id: test.lab
                    },
                    {
                        $push: {tests: test._id}
                    },function (err, count) {
                        if(err) return next(err)
                        req.flash('success', 'Lab Test added successfully!')
                        res.redirect('/add-lab-tests')
                    }
                )
            }
        ])
           
    })

//VIEW ALL LAB TESTS
router.get('/lab-tests', middleware.isLoggedIn, (req, res, next)=>{
    Test.find({})
    .populate('lab')
    .exec( (err, tests)=>{
        if(err) return next (err)
        res.render('app/view/lab_test', { tests })
    })
})


//ADD PATIENT CONSULTATION
router.route('/consultation/:id')
.get(middleware.isLoggedIn, (req, res, next) => {
    Lab.find({}, (err, labs) => {
        if (err) { return next(err) }
        User.findOne({ _id: req.params.id })
        .populate('triages')
        .populate('consultations')
        .populate('appointments')
        .deepPopulate('consultations.drugsObject.drugs')
        .exec((err, user)=>{
            if (err) { return next(err) }
            PharmacyItem.find({}, (err, drugs)=>{
                if (err) { return next(err) }
                Lab.find({})
                .populate('tests')
                .exec((err, labs)=>{
                    var serology = []
                    var chemical = []
                    var micro = []
                    if (err) { return next(err) }
                    labs.forEach((lab)=>{
                        lab.tests.forEach((test)=>{
                            serology.push({
                                'name': test.name,
                                'id': test._id
                            })
                        })
                    })
                    // //SEROLOGY
                    // labs[0].tests.forEach((test)=>{
                    //     serology.push({
                    //         'name': test.name
                    //     })
                    // })
                    // //MICROBILOGY
                    // labs[1].tests.forEach((test)=>{
                    //     micro.push({
                    //         'name': test.name
                    //     })
                    // })
                    // //CHEMICAL PATHOLOGY
                    // labs[2].tests.forEach((test)=>{
                    //     chemical.push({
                    //         'name': test.name
                    //     })
                    // })
                    Appointment.findOne({_id: user.appointments[user.appointments.length -1]._id}, function (err, appointment) {
                        if (err) { return next(err) }
                       
                        Imaging.find({}, (err, imaging)=>{
                            if (err) { return next(err) }
                            // if(appointment.taken){
                            //     req.flash('error', 'Appointment already taken')
                            //     return res.redirect('/dashboard')
                            // }else{
                               appointment.taken = true;
                               appointment.save((err)=>{
                                   if(err){
                                      return next (err)
                                   }
                                   res.render('app/add/add_patient_consultation', 
                                   { labs, user, drugs, imaging, serology })
                               })
                            //}
                        })
                        
                    })
                })
            })
        })
    })
})
.post(middleware.isLoggedIn, (req, res, next) => {
    const consultation = new Consultation({
        doctor: req.user._id,
        patient: req.params.id,
        visit: req.body.visit,
        physical:{
            observation: req.body.observation,
            chest: req.body.chest,
            cvs: req.body.cvs,
            abdomen: req.body.abdomen,
            mss: req.body.mss,
            other: req.body.other
        },
        // labtype: req.body.labtype,
        // labtest: req.body.labtest,
        diagnosis: req.body.diagnosis,
        treatment: req.body.treatment
    })
    consultation.save((err)=>{
        if(err) return next(err)
    })
    User.updateOne(
        {
            _id: req.params.id
        },
        {
            $push:{consultations: consultation._id}
        },function (err, count) {
            if(err) {return next (err)}
            req.flash('success', 'Patient Consultation saved Successfully!')
            res.redirect('/consultation/' + req.params.id)
        }
    )
})

//ADD PATIENT LAB TEST
router.post('/labtest/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({ _id: req.params.id })
        .populate('consultations')
        .exec((err, user)=>{
            if(err) return next (err)
            Consultation.findOne({ _id: user.consultations[0]._id }, (err, consultation)=>{
                if(err) return next (err)
                if(req.body.labtype) consultation.labtype = req.body.labtype;
                // if(req.body.labtest) consultation.labtest.push(req.body.labtest);
                var tests = req.body.labtest
                var alltests = tests.map(s => mongoose.Types.ObjectId(s))
                consultation.labtestObject = alltests;
                consultation.labstatus = true;
                consultation.save((err)=>{
                    if(err) return next (err)
                    res.redirect('/dashboard')
                })
            })
        })
})

//ADD PATIENT PRESCRIPTION
router.post('/prescription/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({ _id: req.params.id })
        .populate('consultations')
        .exec((err, user)=>{
            if(err) return next (err)
            Consultation.findOne({ _id: user.consultations[0]._id }, (err, theconsultation)=>{
                if(err) return next (err)
                // // if(req.body.drug_brand) consultation.drug.push(req.body.drug_brand);
                // if(req.body.drug_name) consultation.drugname = req.body.drug_name;
                if(req.body){
                    theconsultation.drugsObject.push({
                        drugs: req.body.drug_brand,
                        startingdate: req.body.startingdate,
                        quantity: req.body.quantity,
                        medicineunit: req.body.medicineunit,
                        unit: req.body.unit,
                        dose: req.body.dose,
                        time: req.body.time,
                        notes: req.body.notes,
                        direction: req.body.direction
                    })
                    theconsultation.prescriptionDate = Date.now()
                    theconsultation.pharmacystatus = true;
                    theconsultation.status = true;
                    // var drugs = req.body.drug_brand
                    // var alldrugs = drugs.map(s => mongoose.Types.ObjectId(s))
                    // consultation.drugsObject = alldrugs;
                    // consultation.status = true;
                    // consultation.prescriptionDate = Date.now()
                    // consultation.pharmacystatus = true;
                    // consultation.prescription = {
                    //     dose: req.body.dose,
                    //     duration: req.body.duration,
                    //     frequency: req.body.frequency,
                    //     direction: req.body.direction
                    // }
                }
                theconsultation.save((err)=>{
                    if(err) return next (err)
                    res.redirect('/consultation/' + req.params.id)
                })
            })
        })
})

//ADD PATIENT IMAGING
router.post('/imaging/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({ _id: req.params.id })
        .populate('consultations')
        .exec((err, user)=>{
            if(err) return next (err)
            Consultation.findOne({ _id: user.consultations[0]._id }, (err, consultation)=>{
                if(err) return next (err)
                if(req.body.image) consultation.imaging.push(req.body.image);
                consultation.imagingdate = Date.now
                consultation.imagingstatus = true;
                consultation.save((err)=>{
                    if(err) return next (err)
                    res.redirect('/consultations')
                })
            })
        })
})


//DRUGS PRESCRIBED BY PHARMACY
router.post('/prescribed', middleware.isLoggedIn, (req, res, next)=>{
    let prescribe = req.body.prescribe
    Consultation.findOne({_id: prescribe}, (err, consultation)=>{
        if(err) return next (err)
        consultation.pharmacyfinish = true;
        consultation.save((err)=>{
            if(err) return next (err)
            res.redirect('back')
        })
    })
})

//LAB TEST FINISHED
router.post('/labtest-finish', middleware.isLoggedIn, (req, res, next)=>{
    let test = req.body.test
    Consultation.findOne({_id: test}, (err, consultation)=>{
        if(err) return next (err)
        consultation.labtestfinish = true;
        consultation.labResultDate = Date.now()
        consultation.save((err)=>{
            if(err) return next (err)
            res.redirect('back')
        })
    })
})

//ADD LABORATORY
router.route('/add-laboratory')
    .get(middleware.isLoggedIn, (req, res, next) => {
        res.render('app/add/add_laboratory')
    })
    .post(middleware.isLoggedIn, (req, res, next) => {
        const lab = new Lab()
        lab.name = req.body.name;
        lab.status = true;
        lab.description = req.body.description;
        lab.save((err)=>{
            if(err) return next (err)
            req.flash('success', 'Lab has been created')
            res.redirect('/laboratories');
        })
    })

//VIEW ALL LABORATORIES
router.get('/laboratories', middleware.isLoggedIn, (req, res, next)=>{
    Lab.find({})
    .populate('tests')
    .exec((err, laboratories)=>{
        if(err) return next (err)
        res.render('app/view/laboratories', { laboratories })
    })
})

//VIEW ALL PATIENTS
router.get('/patients', middleware.isLoggedIn, (req, res, next)=>{
    User.find({})
    .sort('-createdAt')
    .exec((err, users)=>{
        if(err) return next (err)
        var allPatients = []
        users.forEach((user)=>{
            var birthday = new Date(user.birthday)
            var today = new Date()
            var age = today.getFullYear() - birthday.getFullYear()
            if(today.getMonth() < birthday.getMonth()){
                age
            }
            if(today.getMonth() == birthday.getMonth() && today.getDate() < birthday.getDate()){
                age
            }
            if(user.role == 8){
                allPatients.push({
                    'createdby': user.createdby,
                    'patientId': user.patientId,
                    'id': user._id,
                    'firstname': user.firstname,
                    'role': user.role,
                    'lastname': user.lastname,
                    'address': user.address,
                    'phone': user.phonenumber,
                    'email': user.email,
                    'status': user.status,
                    'age': age,
                    'addmitted': user.addmitted
                })
            }
        })
        res.render('app/view/patients', { allPatients })
    })
})


//VIEW ALL PATIENTS
router.get('/doctors', middleware.isLoggedIn, (req, res, next)=>{
    User.find({}, (err, users)=>{
        if(err) return next (err)
        var allDoctors = []
        users.forEach((user)=>{
            var birthday = new Date(user.birthday)
            var today = new Date()
            var age = today.getFullYear() - birthday.getFullYear()
            if(today.getMonth() < birthday.getMonth()){
                age
            }
            if(today.getMonth() == birthday.getMonth() && today.getDate() < birthday.getDate()){
                age
            }
            if(user.role == 2){
                allDoctors.push({
                    'id': user._id,
                    'firstname': user.firstname,
                    'lastname': user.lastname,
                    'address': user.address,
                    'phone': user.phonenumber,
                    'email': user.email,
                    'status': user.status,
                    'age': age
                })
            }
        })
        res.render('app/view/doctors', { allDoctors })
    })
})

//VIEW ALL EMPLOYEES
router.get('/employees', middleware.isLoggedIn, (req, res, next)=>{
    User.find({}, (err, users)=>{
        if(err) return next (err)
        res.render('app/view/employees', {users})
    })
})

//VIEW ALL DOCTORS
router.get('/doctors', middleware.isLoggedIn, (req, res, next)=>{
    User.find({}, (err, users)=>{
        if(err) return next (err)
        res.render('app/view/doctors', {users})
    })
})

//VIEW ALL TRIAGES
router.get('/triages', middleware.isLoggedIn, (req, res, next)=>{
    Triage.find({})
        .populate('patient')
        .exec((err, triages)=>{
            if(err) return next (err)
            res.render('app/view/triages', { triages })
        })
})

//VIEW ALL CONSULTATIONS
router.get('/consultations', middleware.isLoggedIn, (req, res, next)=>{
    Consultation.find({}) 
    .populate('patient')
    .populate('labtestObject')
    // .populate('drugsObject')
    .deepPopulate('drugsObject.drugs')
    .exec((err, consultations)=>{
        if(err) return next (err)
        res.render('app/view/consultations', { consultations })
    })
})

//TAKE PICTURES
// router.route('/take-picture')
// .get(middleware.isLoggedIn, (req, res, next)=>{
//     res.render('app/add/add_image_sample.ejs')
// })
// .post(middleware.isLoggedIn, (req, res, next)=>{
//     const encoded_data = req.body.myData
//     console.log(encoded_data)
//     const binary_data = Buffer.from(encoded_data, 'base64')
//     // var binary_data = new Buffer(req.body.data_uri, 'base64')
//     // var decoded_data = binary_data.toString()
//     fs.writeFile('./public/files/webcam.png', binary_data, 'base64', function (err) {
//         if(err) return next (err)
//         console.log("file created")
//         req.flash('success', 'Your profile picture have been successfully uploaded')
//         res.redirect('/patients')
//     })
//     // upload(req, res, (err) => {
//     //     if (err instanceof multer.MulterError) {
//     //       req.flash('error', 'Your file is too large, try reducing the size')
//     //       return res.redirect('/take-picture')
//     //     }
//     //     else if (err) {
//     //       return next(err)
//     //     }
//     //     else if (req.files == undefined) {
//     //       console.log('file is undefined')
//     //     }
//     //       else {
//     //         /** Create new record in mongoDB*/
//     //         var fullPath = newFile
//     //         var document = {
//     //             photo: fullPath,
//     //             email: req.body.email,
//     //             firstname: req.body.fname,
//     //             lastname: req.body.lname,
//     //             username: req.body.username,
//     //             status: true,
//     //             isVerified: true,
//     //             religion: req.body.religion,
//     //             gender: req.body.gender,
//     //             phonenumber: req.body.phone,
//     //             birthday: req.body.birthday,
//     //             role: patient,
//     //             address: req.body.address,
//     //             city: req.body.city,
//     //             state: req.body.state,
//     //             country: req.body.country,
//     //         }
//     //         const user = new User(document)
//     //         user.save(function (err) {
//     //             if(err) return next (err)
//     //           req.flash('success', 'Your profile picture have been successfully uploaded')
//     //           res.redirect('/take-picture')
//     //         });
//     //     }
//     // })
// })


//VIEW ALL APPOINTMENTS
router.get('/appointments', middleware.isLoggedIn, (req, res, next)=>{
    Appointment.find({})
     .populate('doctor')
     .populate('patient')
     .populate('creator')
     .sort('-created')
     .exec((err, appointments)=>{
        if(err) return next (err)
        res.render('app/view/appointments', { appointments })
    })
})

//VIEW ALL DEPARTMENTS
router.get('/departments', middleware.isLoggedIn, (req, res, next)=>{
    Department.find({}, (err, departments)=>{
        if(err) {return next (err)}
        res.render('app/view/departments', { departments })
    })
})

//ADDMITTED PATIENTS
router.get('/addmitted-patients', middleware.isLoggedIn, (req, res, next)=>{
    User.find({}, (err, users)=>{
        if(err) {return next (err)}
        res.render('app/view/addmitted_patient', { users })
    })
})

//USER PROFILE
router.get('/patient/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({ _id: req.params.id})
        .populate('appointments')
        .populate('consultations')
        .populate('payments')
        .populate('triages')
        .populate('visits')
        .deepPopulate([
            'appointments.doctor',
            'consultations.drusObject',
            'consultations.doctor',
            'consultations.labtestObject',
            'consultations.drugsObject.drugs',
            'payments.services'
        ])
        .exec((err, patient)=>{
        if(err) {return next (err)}
        var birthday = new Date(patient.birthday)
        var today = new Date()
        var age = today.getFullYear() - birthday.getFullYear()
        if(today.getMonth() < birthday.getMonth()){
            age
        }
        if(today.getMonth() == birthday.getMonth() && today.getDate() < birthday.getDate()){
            age
        }
        res.render('app/view/user_profile', { patient, age })
    })
})

//VIEW LAB RESULT
router.get('/lab-result', middleware.isLoggedIn, (req, res, next)=>{
    Consultation.findOne({_id: req.params.id})
    .populate('labtestObject')
    .exec((err, consultation)=>{
        if(err) return next (err)
        res.render('app/view/lab_result', { consultation })
    })
})

//VISITS
router.route('/visit/:id')
    .get(middleware.isLoggedIn, (req, res, next) => {
        User.findOne({ _id: req.params.id })
            .populate('appointments')
            .deepPopulate('appointments.doctor')
            .exec((err, patient)=>{
            if(err) {return next (err)}
            User.find({}, function (err, users) {
                if(err) {return next (err)}
                var birthday = new Date(patient.birthday)
                var today = new Date()
                var age = today.getFullYear() - birthday.getFullYear()
                if(today.getMonth() < birthday.getMonth()){
                    age
                }
                if(today.getMonth() == birthday.getMonth() && today.getDate() < birthday.getDate()){
                    age
                }
                res.render('app/add/add_visit', { patient, age, users })
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({ _id: req.params.id }, function (err, patient) {
            if(err) {return next (err)}
            const visit = new Visit()
            visit.admissiondate = req.body.admission;
            visit.dischargedate = req.body.discharge;
            visit.visittype = req.body.visit;
            visit.doctor = req.body.doctor;
            visit.reason = req.body.reason;
            visit.save((err)=>{
                if(err) return next (err)
            })
            User.update(
                {
                    _id: patient._id
                },
                {
                    $push:{visits: visit._id}
                },function (err, count) {
                    if(err) {return next (err)}
                    req.flash('success', 'Patient Sucessfully Checked In!')
                    res.redirect('/addmitted-patients')
                }
            )
        })
    })

//MAKING REQUESTS
router.route('/make-request')
    .get(middleware.isLoggedIn, (req, res, next) => {
        PharmacyItem.find({})
            .exec((err, pharmitems)=>{
            if(err) {return next (err)}
            labItem.find({}, (err, labitems)=> {
                if(err) {return next (err)}
                Department.find({}, (err, departments)=>{
                    if(err) {return next (err)}
                    res.render('app/add/make_request', { pharmitems, labitems,departments })
                })
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const request = new Request({
            item: req.body.item,
            unit: req.body.unit,
            quantity: req.body.quantity,
            department: req.body.department,
            requestedby: req.user._id,

        })
        request.save((err)=>{
            if(err) return next (err)
            req.flash('success', 'Request was sent successfully')
            res.redirect('/dashboard')
        })
    })

//APPROVING REQUEST
router.post('/approve-request', middleware.isLoggedIn, (req, res, next)=>{
    const approve = req.body.approve 
    Request.findOne({_id: approve}, (err, request)=>{
        if(err) return next (err)
        request.granted = true;
    })
    request.save((err)=>{
        if(err) return next (err)
        req.flash('success', 'Request was granted successfully')
        res.redirect('/dashboard')
    })
})

//DECL:INING REQUEST
router.post('/decline-request', middleware.isLoggedIn, (req, res, next)=>{
    const decline = req.body.decline 
    Request.findOne({_id: decline}, (err, request)=>{
        if(err) return next (err)
        request.declined = true;
    })
    request.save((err)=>{
        if(err) return next (err)
        req.flash('success', 'Request was declined successfully')
        res.redirect('/dashboard')
    })
})

//ADD LAB ITEMS
router.route('/add-lab-items')
   .get(middleware.isLoggedIn, (req, res, next)=>{
       Vendor.find({}, (err, vendors)=>{
        if(err) return next (err)
        res.render('app/add/add_lab_item', {vendors})
       })
   }) 
   .post(middleware.isLoggedIn, (req, res, next)=>{
        labItem.countDocuments({})
        .exec((err, count)=>{
            if(err) return next (err)
       const item = new labItem()
       item.itemDigit = count +1;
       item.creator = req.user._id;
       item.name = req.body.name;
       item.description = req.body.description;
       item.price = req.body.price;
       item.unit = req.body.unit;
       item.quantity = req.body.quantity;
       item.cost = req.body.cost;
       item.income = req.body.income;
       item.sellprice = req.body.sell_price;
       item.expiration = req.body.expiration;
       item.vendor = req.body.vendor;
       item.serialnum = req.body.snum;
       item.location = req.body.location;
       item.received = req.body.received;
       item.save((err)=>{
           if(err){
               req.flash('error', err.message)
               console.log(err)
            return res.redirect('/add-lab-items')
           }
           req.flash('success', 'Item was added!')
           res.redirect('/lab-items')
       })
    })
   })

//LAB DISPENSE BY ID
router.route('/lab-dispense/:id')
   .get(middleware.isLoggedIn, (req, res, next)=>{
       labItem.findOne({_id: req.params.id}, (err, item)=>{
        if(err) return next(err)
            Department.find({}, (err, departments)=>{
                if(err) return next(err)
                User.find({}, (err, users)=>{
                    if(err) return next(err)
                    res.render('app/add/lab_dispense', {item, departments, users})
                })
            })
       })
   }) 
   .post(middleware.isLoggedIn, (req, res, next)=>{
    async.waterfall([
        function (done) {
            const labDispense = new LabDispense()
            labDispense.creator = req.user._id;
            labDispense.quantity = req.body.quantity;
            labDispense.name = req.body.name;
            labDispense.unit = req.body.unit;
            labDispense.rquantity = req.body.rquantity;
            labDispense.dispenseTo = req.body.dispenseTo;
            labDispense.expiry = req.body.expiry;
            labDispense.receivedBy = req.body.received;
            labDispense.dateReceived = req.body.dateReceived;
            labDispense.dateDispensed = Date.now();
            labDispense.save((err)=>{
                if(err) return next(err)
                done(err, labDispense)
            })
        },
        function (labDispense, done) {
            labItem.findOne({_id: req.params.id}, (err, item)=>{
                if(err) return next(err)
                item.rquantity = (item.quantity - labDispense.quantity)
                item.save((err)=>{
                  if(err) return next(err)
                  done(err, labItem)
                })
            })
            //update the item dispensed
            labItem.update(
                {
                    _id: req.params.id
                },
                {
                    $push:{dispensehistory: labDispense._id}
                },
                function (err, count) {
                    if(err) {return next (err)}
                    req.flash('success', 'Item was dispensed!')
                    res.redirect('/lab-items')
                }
            )
        }
        
    ])
    
   })

//LAB DISPENSE
// router.route('/lab-issue-out')
//    .get(middleware.isLoggedIn, (req, res, next)=>{
//        labItem.find({}, (err, items)=>{
//         if(err) return next(err)
//         res.render('app/add/lab_dispense', {items})
//        })
//    }) 
//    .post(middleware.isLoggedIn, (req, res, next)=>{
//        const item = new labItem()
//        item.id = getValueForNextSequence("itemid")
//        item.name = req.body.name;
//        item.description = req.body.description;
//        item.price = req.body.price;
//        item.unit = req.body.unit;
//        item.quantity = req.body.quantity;
//        item.cost = req.body.cost;
//        item.labitem = true;
//        item.type = req.body.type;
//        item.expiration = req.body.expiration;
//        item.vendor = req.body.vendor;
//        item.serialnum = req.body.snum;
//        item.location = req.body.location;
//        item.received = req.body.received;
//        item.save((err)=>{
//            if(err) return next(err)
//            req.flash('success', 'Item was added!')
//            res.redirect('/lab-items')
//        })
//    })

//PHARMACY DISPENSE BY ID
router.route('/pharmacy-dispense/:id')
   .get(middleware.isLoggedIn, (req, res, next)=>{
    PharmacyItem.findOne({_id: req.params.id}, (err, item)=>{
        if(err) return next(err)
            Department.find({}, (err, departments)=>{
                if(err) return next(err)
                User.find({}, (err, users)=>{
                    if(err) return next(err)
                    res.render('app/add/pharmacy_dispense', {item, departments, users})
                })
            })
       })
   }) 
   .post(middleware.isLoggedIn, (req, res, next)=>{
    async.waterfall([
        function (done) {
            const pharmDispense = new PharmDispense()
            pharmDispense.creator = req.user._id;
            pharmDispense.name = req.body.name;
            pharmDispense.quantity = req.body.quantity;
            pharmDispense.unit = req.body.unit;
            pharmDispense.rquantity = req.body.rquantity;
            pharmDispense.dispenseTo = req.body.dispenseTo;
            pharmDispense.expiry = req.body.expiry;
            pharmDispense.receivedBy = req.body.received;
            pharmDispense.dateReceived = req.body.dateReceived;
            pharmDispense.dateDispensed = Date.now();
            pharmDispense.save((err)=>{
                if(err) return next(err)
                done(err, pharmDispense)
            })
        },
        function (pharmDispense, done) {
            PharmacyItem.findOne({_id: req.params.id}, (err, item)=>{
                if(err) return next(err)
                item.rquantity = (item.quantity - pharmDispense.quantity)
                item.save((err)=>{
                  if(err) return next(err)
                  done(err, item)
                })
            })
            //update the item dispensed
            PharmacyItem.update(
                {
                    _id: req.params.id
                },
                {
                    $push:{dispensehistory: pharmDispense._id}
                },
                function (err, count) {
                    if(err) {return next (err)}
                    req.flash('success', 'Item was dispensed!')
                    res.redirect('/pharmacy-items')
                }
            )
        }
        
    ])
   })

//PHARMACY DISPENSE HISTORY
router.get('/dispense-history/:id', middleware.isLoggedIn, (req, res, next)=>{
    PharmacyItem.findOne({_id: req.params.id})
    .populate('dispensehistory')
    .deepPopulate('dispensehistory.receivedBy')
    .exec((err, history)=>{
        console.log(history)
        if(err) return next(err)
        res.render('app/view/pharm_history', { history })
    })
})

//PHARMACY DISPENSE HISTORY
router.get('/pharmacy-requests', middleware.isLoggedIn, (req, res, next)=>{
    Consultation.find({})
    .populate('patient')
    .populate('drugsObject')
    .exec((err, consultations)=>{
        if(err) return next(err)
        res.render('app/view/pharm_request', { consultations })
    })
})

//LAB DISPENSE HISTORY
router.get('/lab-dispense-history/:id', middleware.isLoggedIn, (req, res, next)=>{
    labItem.findOne({_id: req.params.id})
    .populate('dispensehistory')
    .deepPopulate('dispensehistory.receivedBy')
    .exec((err, history)=>{
        console.log(history)
        if(err) return next(err)
        res.render('app/view/lab_history', { history })
    })
})

//ADD PHARMACY  ITEMS
router.route('/add-pharmacy-items')
   .get(middleware.isLoggedIn, (req, res, next)=>{
    Drug.find({}, (err, drugs)=>{
        if(err) return next (err)
        Vendor.find({}, (err, vendors)=>{
            if(err) return next (err)
            res.render('app/add/add_pharmacy_item', {drugs, vendors})
        })
    })
   }) 
   .post(middleware.isLoggedIn, (req, res, next)=>{
        PharmacyItem.countDocuments({})
        .exec((err, count)=>{
        if(err) return next (err)
        const item = new PharmacyItem()
        item.itemDigit = count +1
        item.creator = req.user._id;
        item.name = req.body.name;
        item.description = req.body.description;
        item.price = req.body.price;
        item.unit = req.body.unit;
        item.quantity = req.body.quantity;
        item.cost = req.body.cost;
        item.income = req.body.income;
        item.expiration = req.body.expiration;
        item.vendor = req.body.vendor;
        item.serialnum = req.body.snum;
        item.sellprice = req.body.sell_price;
        item.location = req.body.location;
        item.received = req.body.received;
        item.save((err)=>{
            if(err) return next(err)
            req.flash('success', 'Item was added!')
            res.redirect('/add-pharmacy-items')
        })
    })
   })


//ADD OPERATION NOTE
router.route('/add-operation-note')
   .get(middleware.isLoggedIn, (req, res, next)=>{
        User.find({}, (err, users)=>{
            if(err) return next (err)
            res.render('app/add/add_theater_note', {users})
        })
   })
   .post(middleware.isLoggedIn, (req, res, next)=>{
       const theater = new Theater({
           patient: req.body.patient,
           surgery: req.body.surgery,
           indications: req.body.indications,
           anaesthesia: req.body.anaesthesia,
           anaesthetist: req.body.anaesthetist,
           surgeon: req.body.surgeon,
           assistance: req.body.assistance,
           findings: req.body.findings,
           procedure: req.body.procedure,
           order: req.body.order
       })
       theater.save((err)=>{
           if(err) return next(err)
           req.flash('success', 'Operation Notes saved Successfully!')
           res.redirect('/operation-notes')
       })
   })

//ADD ACCOUNT
router.route('/accounts')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.find({}, (err, users)=>{
            if(err) return next (err)
            Consultation.find({})
            .populate('patient')
            .deepPopulate('drugsObject.drugs')
            .populate('labtestObject')
            .exec((err, consultations)=>{
                if(err) return next (err)
                res.render('app/view/account', { users, consultations })
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        let patientID = req.body.patientId
        User.findOne({ _id: patientID }, function (err, user) {
            if (err) return next(err)
            user.account.paid = true
            user.save((err)=>{
                if (err) return next(err)
                const payment = new Payment({
                    patient: user._id,
                    amount: req.body.regamount,
                    type: 'Registration & Consultation Fee',
                    initiator: req.user._id,
                    status: true
                })
                payment.save((err)=>{
                    if (err) return next(err)
                    
                    sgMail.setApiKey(process.env.SENDGRID_MAIL);
                    const msg = {
                        to: 'admin@doch.com.ng',
                        from: 'DOCH Account<noreply@doch.com.ng>',
                        subject: 'New Payment Made',
                        html: `<p>Hello Admin,\n\n  A new patient ${user.firstname} ${user.lastname} has just made the sum of &#8358;${payment.amount} for registration and consultation payment, Thank You.\n</p>`,
                    };
                    sgMail.send(msg);
                    User.update(
                        {
                            _id: user._id
                        },
                        {
                            $push:{payments: payment._id}
                        }, function (err, count) {
                            if (err) return next(err)
                            req.flash('success', 'Payment Made Approved')
                            res.redirect('back')
                        }
                    )
                })
                
            })
        })
    })

//APPROVINg BILIING PAYMENT
router.post('/approve-billing', middleware.isLoggedIn, (req, res, next)=>{
    let approve = req.body.approve
    Payment.findOne({_id: approve}, (err, payment)=>{
        if(err) return next (err)
        payment.status = true
        payment.save((err)=>{
            if(err) return next (err)
            res.redirect('back')
        })
    })
})

//LAB TESTS PAYMENT
router.post('/lab-test-payment', middleware.isLoggedIn, (req, res, next)=>{
    let consultID = req.body.consultationId
    let labamount = req.body.labamount
    Consultation.findOne({ _id: consultID })
    .populate('patient')
    .exec(function (err, consult) {
        if (err) return next(err)
        consult.labpaid = true
        consult.save((err)=>{
            if (err) return next(err)
            const payment = new Payment({
                patient: consult.patient,
                amount: req.body.labamount,
                type: 'Lab Test Payment',
                initiator: req.user._id,
                status: true
            })
            payment.save((err)=>{
                if (err) return next(err)
                sgMail.setApiKey(process.env.SENDGRID_MAIL);
                const msg = {
                    to: 'admin@doch.com.ng',
                    from: 'DOCH Account<noreply@doch.com.ng>',
                    subject: 'New Payment Made',
                    html: `<p>Hello Admin,\n\n  A new patient (${consult.patient.firstname} ${consult.patient.lastname}) has just made payment of &#8358;${payment.labamount} for his/her Lab tests , Thank You.\n</p>`,
                };
                sgMail.send(msg);
                User.update(
                    {
                        _id: consult.patient
                    },
                    {
                        $push:{payments: payment._id}
                    },
                    function (err, count) {
                        if (err) return next(err)
                        req.flash('success', 'Payment Made Approved')
                        res.redirect('/dashboard')
                    }
                )
            })
        })
    })
})

//PHARMACY PAYMENT
router.post('/pharmacy-payment', middleware.isLoggedIn, (req, res, next)=>{
    let pharmId = req.body.pharmId
    let amount = req.body.amount
    Consultation.findOne({ _id: pharmId })
    .populate('patient')
    .exec(function (err, consult) {
        if (err) return next(err)
        consult.pharmacypaid = true
        consult.save((err)=>{
            if (err) return next(err)
            const payment = new Payment({
                patient: consult.patient,
                amount: req.body.amount,
                type: 'Drugs Payment',
                initiator: req.user._id,
                status: true
            })
            payment.save((err)=>{
                if (err) return next(err)
                sgMail.setApiKey(process.env.SENDGRID_MAIL);
                const msg = {
                    to: 'admin@doch.com.ng',
                    from: 'DOCH Account<noreply@doch.com.ng>',
                    subject: 'New Payment Made',
                    html: `<p>Hello Admin,\n\n  A new patient (${consult.patient.firstname} ${consult.patient.lastname}) has just made the payment of &#8358;${payment.amount} for his/her drugs, Thank You.\n</p>`,
                };
                sgMail.send(msg);
                User.update(
                    {
                        _id: consult.patient
                    },
                    {
                        $push:{payments: payment._id}
                    },
                    function (err, count) {
                        if (err) return next(err)
                        req.flash('success', 'Payment Made Approved')
                        res.redirect('/dashboard')
                    }
                )
            })
            
        })
    })
})

//OPERATION NOTES
router.get('/operation-notes', middleware.isLoggedIn, (req, res, next)=>{
    Theater.find({}, (err, theaters)=>{
        if (err) { return next(err) }
        res.render('app/view/theater', {theaters})
    })
})

//LAB ITEMS
router.get('/lab-items', middleware.isLoggedIn, (req, res, next) => {
    labItem.find({}, (err, items) => {
        if (err) { return next(err) }
        res.render('app/view/lab_items', { items })
    })
});

//PHARMACY ITEMS
router.get('/pharmacy-items', middleware.isLoggedIn, (req, res, next) => {
    PharmacyItem.find({})
    .populate('dispensehistory')
    .exec( (err, items) => {
        if (err) { return next(err) }
        res.render('app/view/pharmacy_items', { items })
    })
});


//Generating Registration invoice
router.get('/invoice/:id', middleware.isLoggedIn, (req, res, next) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) { return next(err) }
        res.render('app/view/invoice', { user })
    })
});

//Lab Test Invoice
router.get('/labtest-invoice/:id', middleware.isLoggedIn, (req, res, next) => {
    Consultation.findOne({ _id: req.params.id})
        .populate('patient')
        .populate('drugsObject')
        .populate('labtestObject')
        .exec((err, consultation)=>{
            if(err) return next (err)
            res.render('app/view/labinvoice', { consultation })
        })
});

//Pharmacy  Invoice
router.get('/pharmacy-invoice/:id', middleware.isLoggedIn, (req, res, next) => {
    Consultation.findOne({ _id: req.params.id})
    .populate('patient')
    .populate('drugsObject')
    .populate('labtestObject')
    .exec((err, consultation)=>{
        if(err) return next (err)
        res.render('app/view/pharminvoice', { consultation })
    })
});

//Pharmacy  Invoice
router.get('/billing-invoice/:id', middleware.isLoggedIn, (req, res, next) => {
    Payment.findOne({ _id: req.params.id})
    .populate('patient')
    .populate('services')
    .exec((err, payment)=>{
        if(err) return next (err)
        res.render('app/view/billinginvoice', { payment })
    })
});

//ACCEPTING APPOINTMENTS
// router.post('/takeup-appointment', (req, res, next)=>{
//     const appointId = req.body.app_id
//     Appointment.findOne({ _id: appointId })
//         .populate('patient')
//         .exec((err, appointment) => {
//             if(err) return next (err)
//             appointment.taken = true;
//             appointment.save((err)=>{
//                 if(err) return next (err)
//                 res.redirect('/consultation/' + appointment.patient._id)
//             })
//         })
// })

//REISTER ANTE NATAL PATIENT
router.route('/create-ante-natal-patient/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        ANC.countDocuments({}, (err, count)=>{
            if (err) return next (err)
            User.findOne({_id: req.params.id}, (err, user)=>{
                if (err) return next (err)
                Appointment.findOne({_id: user.appointments[user.appointments.length -1]._id}, function (err, appointment) {
                    if (err) return next (err)
                    let antenatalCounter = count + 1
                    var birthday = new Date(user.birthday)
                    var today = new Date()
                    var age = today.getFullYear() - birthday.getFullYear()
                    if(today.getMonth() < birthday.getMonth()){
                        age
                    }
                    if(today.getMonth() == birthday.getMonth() && today.getDate() < birthday.getDate()){
                        age
                    }
                    if(appointment.taken){
                        req.flash('error', 'Appointment already taken')
                        return res.redirect('back')
                    }else{
                       appointment.taken = true;
                       appointment.save((err)=>{
                           if(err){
                               req.flash('error', "Error taking the appointment")
                               return res.redirect('back')
                           }
                           res.render('app/add/register_ante_natal', { antenatalCounter, user, age})
                       })
                    }
                })
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const anc = new ANC()
            anc.creator = req.user._id,
            anc.patient = req.body.patient,
            anc.ancId = req.body.ancId,
            anc.age = req.body.age,
            anc.gravida = req.body.gravida,
            anc.parity = req.body.parity,
            anc.lmp = req.body.lmp,
            anc.edd = req.body.edd,
            anc.medicalhistory = req.body.medicalhistory,
            anc.surgicalhistory = req.body.surgicalhistory,
            anc.bloodtransfusion = req.body.bloodtransfusion,
            anc.familyhistory = req.body.familyhistory,
            // anc.taken = true,
            anc.previouspregnancy.push({
                year: req.body.year,
                deliveryplace: req.body.deliveryplace,
                maturity: req.body.maturity,
                duration: req.body.duration,
                delivery: req.body.delivery,
                weight: req.body.weight,
                sex: req.body.sex,
                fate: req.body.fate,
                puerperium: req.body.puerperium,
            })
        anc.save((err)=>{
            if(err) return next (err)
        })
        User.update(
            {
                _id: anc.patient
            },
            {
                $push:{ ancs: anc._id}
            },function(err, count){
                req.flash('success', 'Patient account was created successfully')
                res.redirect('/ante-natal/' + req.params.id)
            }
        )
    })

//ANTENATAL
router.route('/ante-natal/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({_id: req.params.id}, (err, user)=>{
            if(err) return next (err)
            Appointment.findOne({_id: user.appointments[user.appointments.length -1]._id}, function (err, appointment) {
                if (err) return next (err)
                if(appointment.taken){
                    req.flash('error', 'Appointment already taken')
                    return res.redirect('back')
                }else{
                   appointment.taken = true;
                   appointment.save((err)=>{
                       if(err){
                           req.flash('error', "Error taking the appointment")
                           return res.redirect('back')
                       }
                       res.render('app/add/add_anc', {user})
                   })
                }
            })
           
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({_id: req.params.id}, (err, user)=>{
            ANC.findOne({_id: user.ancs[0]._id}, (err, anc)=>{
                if(err) {
                    req.flash('error', 'Patient ANC record cannot be found')
                    return res.redirect('back')
                }
                anc.presentpregnancy.push({
                    thedate: req.body.thedate,
                    weight:  req.body.weight,
                    urinalysis: req.body.urinalysis,
                    bp: req.body.bp,
                    pallor: req.body.pallor,
                    maturity: req.body.maturity,
                    fundalheight: req.body.fundalheight,
                    presentation: req.body.presentation,
                    fetalheartrate: req.body.fetalheartrate,
                    oedema: req.body.oedema,
                    comments: req.body.comments,
                    tcadate: req.body.tcadate,
                    initial: req.body.initial
                })
            })
        })
        anc.save((err)=>{
            if(err) return next (err)
            req.flash('success', 'Details saved successfully')
            res.redirect('back')
        })
    })

router.post('/clinical-notes/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('ancs')
    .exec((err, user)=>{
        if(err) return next (err)
        ANC.findOne({_id: user.ancs[0]._id}, (err, anc)=>{
            if(err) {
                req.flash('error', 'Patient ANC record cannot be found')
                return res.redirect('back')
            }
            anc.clinicalnotes.push(req.body.clinicalnotes)
            
            anc.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Clinical Notes was saved successfully')
                res.redirect('back')
            })
        }) 
    })

})

//ANTENATAL LAB TESTS
router.post('/antenatal-lab-tests/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('ancs')
    .exec((err, user)=>{
        if(err) return next (err)
        ANC.findOne({_id: user.ancs[0]._id}, (err, anc)=>{
            if(err) {
                req.flash('error', 'Patient ANC record cannot be found')
                return res.redirect('back')
            }
            anc.labtests.push({
                hb: req.body.hb,
                hbdate: req.body.hbdate,
                bloodgroup: req.body.bloodgroup,
                bloodgroupdate:  req.body.bloodgroupdate,
                mps: req.body.mps,
                mpsdate: req.body.mpsdate,
                vdrl: req.body.vdrl,
                vdrldate: req.body.vdrldate,
                serology: req.body.serology,
                serologydate: req.body.serologydate,
                urinalysis: req.body.urinalysis,
                urinalysisdate: req.body.urinalysisdate,
            })
            anc.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Lab test was saved successfully')
                res.redirect('back')
            })
        }) 
    })

})

//ANTENATAL Treatment and Immunization
router.post('/treatment-and-immunization/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('ancs')
    .exec((err, user)=>{
        if(err) return next (err)
        ANC.findOne({_id: user.ancs[0]._id}, (err, anc)=>{
            if(err) {
                req.flash('error', 'Patient ANC record cannot be found')
                return res.redirect('back')
            }
            anc.treatment.push({
                tt1: req.body.tt1,
                tt1next: req.body.tt1next,
                tt2: req.body.tt2,
                tt2next: req.body.tt2next,
                tt3: req.body.tt3,
                tt3next: req.body.tt3next,
                tt4: req.body.tt4,
                tt4next: req.body.tt4next,
                tt5: req.body.tt5,
                tt5next: req.body.tt5next,
                malariaipt1: req.body.malariaipt1,
                malariaipt1next: req.body.malariaipt1next,
                malariaipt2: req.body.malariaipt2,
                malariaipt2next: req.body.malariaipt2next
            })
            anc.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Treatment and Immunization result was saved successfully')
                res.redirect('back')
            })
        }) 
    })

})

//DATES GIVEN
router.post('/dates-given/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('ancs')
    .exec((err, user)=>{
        if(err) return next (err)
        ANC.findOne({_id: user.ancs[0]._id}, (err, anc)=>{
            if(err) {
                req.flash('error', 'Patient ANC record cannot be found')
                return res.redirect('back')
            }
            anc.datesgiven.push({
                ironfolate: req.body.ironfolate,
                multivitamin: req.body.multivitamin,
            })
            anc.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Dates given was saved successfully')
                res.redirect('back')
            })
        }) 
    })

})

//Registred Ante natal patients
router.get('/all-antenatal', middleware.isLoggedIn, (req, res, next)=>{
    ANC.find({})
        .populate('patient')
        .exec((err, ancs)=>{
            if(err) return next (err)
            res.render('app/view/antenatals', {ancs})
        })
})

//DELIVERY
router.route('/patient-delivery-information/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({_id: req.params.id}, (err, patient)=>{
            if(err) return next (err)
            User.find({}, (err, users)=>{
                if(err) return next (err)
                res.render('app/add/add_delivery', {users, patient})
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        ANC.findOne({_id: user.ancs[0]._id}, (err, anc)=>{
            if(err) {
                req.flash('error', 'Patient ANC record cannot be found')
                return res.redirect('back')
            }
            anc.delivery = {
                modeofdelivery: req.body.modeofdelivery,
                dateofdelivery: req.body.dateofdelivery,
                duration: req.body.duration,
                conditionofmother: req.body.conditionofmother,
                onemin: req.body.onemin,
                tenmin: req.body.tenmin,
                fivemin: req.body.fivemin,
                birthweight: req.body.birthweight,
                sex: req.body.sex,
                conditionofbaby: req.body.conditionofbaby,
                placeofdelivery: req.body.placeofdelivery,
                conducted: req.body.conducted,
                vitaminAmother: req.body.vitaminAmother,
                vitaminAbaby: req.body.vitaminAbaby,
                immunizationdate: req.body.immunizationdate,
                bcg: req.body.bcg,
                opvo: req.body.opvo,
                notifieddate: req.body.notifieddate
            }
            anc.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Patient Delivery Info was saved successfully')
                res.redirect('/all-antenatal')
            })
        }) 
    })

//POST NATAL EXAMINATION
router.route('/post-natal-examination/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({_id: req.params.id}, (err, patient)=>{
            if(err) return next (err)
            res.render('app/add/add_post_delivery', {patient})
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        ANC.findOne({_id: user.ancs[0]._id}, (err, anc)=>{
            if(err) {
                req.flash('error', 'Patient ANC record cannot be found')
                return res.redirect('back')
            }
            anc.postnatal = {
                bp: req.body.bp,
                temp: req.body.temp,
                pulse: req.body.pulse,
                respiration: req.body.respiration,
                generalcondition: req.body.generalcondition,
                involutionofuterus: req.body.involutionofuterus,
                lochia: req.body.lochia,
                episotomy: req.body.episotomy,
                pelvicexam: req.body.pelvicexam,
                smeardate: req.body.smeardate,
                result: req.body.result,
                hb: req.body.hb,
                babycondition: req.body.babycondition,
                wt: req.body.wt,
                reflexes: req.body.reflexes,
                feeding: req.body.feeding,
                umbilicalcord: req.body.umbilicalcord,
            }
            anc.status = false;
            anc.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Patient Delivery Info was saved successfully')
                res.redirect('/all-antenatal')
            })
        }) 
    })

//EMAIL USERS
router.route('/email-users')
	.get(middleware.isLoggedIn, (req, res, next) => {
		User.find({}, function(err, users){
			res.render('admin/email', { users: users })
		})
    })
	.post(middleware.isLoggedIn, (req, res, next) => {
		// User.findOne({}, function(err, user){
			sgMail.setApiKey(process.env.SENDGRID_MAIL);
			const msg = {
				to: req.body.customer,
				from: 'BoroMe <noreply@borome.ng>',
				subject: req.body.subject,
                text: req.body.message,
                templateId: 'd-0207f06170464cf1980f668b8e930aa8',
                        dynamic_template_data: {
                            message: req.body.message,
                            subject: req.body.subject
                        }
			};
			sgMail.send(msg);
        // })
        req.flash('success', 'Your mail sent successfully')
		res.redirect('back')
    })


//SMS USERS
// router.route('/sms-users')
// 	.get(middleware.isLoggedIn, (req, res, next) => {
// 		User.find({}, function(err, users){
// 			res.render('admin/sms', { users: users })
// 		})
//     })
// 	.post(middleware.isLoggedIn, (req, res, next) => {
//             unirest.post( 'https://v2.sling.com.ng/api/v1/send-sms')
//             .header({'Accept' : 'application/json', 'Authorization' : 'Bearer sling_sjalccx24mwklh2nmkma0pwczk9tsjytofl3ntzii7bh8b17moopvv'})
//             .send({
//                 'to' : `234${req.body.customer}`,
//                 'message' : req.body.message,
//                 'channel' : 1001
//             })
//             .end(function (response) {
//                 console.log(response.body);
//             });
    
//         // })
//         req.flash('success', 'Your sms was sent successfully')
// 		res.redirect('back')
//     })


//ADMIN SECURITY
router.route('/security')
    .get(middleware.isLoggedIn, (req, res, next) => {
        User.findOne({ _id: req.user._id }, function (err, user) {
            res.render('app/view/security', { user});
        })
    })
    .post(middleware.isLoggedIn, (req, res, next) => {
        User.findById({ _id: req.user._id }, (err, user) => {
            console.log(user)
            if (req.body.newPassword !== req.body.confirmNewPassword) {
                req.flash('error', 'New password does not equal Confirm password')
                return res.redirect('/settings')
            } else {
                var isSame = bcrypt.compareSync(req.body.oldPassword, user.password)
                if (!isSame) {
                    if (err) { next(err) }
                } else {
                    user.password = req.body.newPassword;
                }
                user.save(function (err) {
                    if (err) { return next(err) }
                    else {
                        req.flash('success', 'Your password have been successfully updated')
                        res.redirect('/dashboard');
                    }
                })
            }
        })
    })



// FORGOTTEN PASSWORD
router.route('/forgot')
.get((req, res, next)=>{
    res.render('web/forgot')
})
.post((req, res, next) => {
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
        res.redirect('/login');
      });
    });


function formatDate(date) {
    var d = (date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear().toString();
        year = year.substr(year.length - 2);
        time = '' + (d.getTime() + 1)

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

module.exports = router;