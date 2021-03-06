const router = require('express').Router();
const async = require('async');
const fs = require('fs');
const mime = require('mime');
const User = require('../models/user');
const mongoose = require('mongoose');
const Department = require('../models/department');
const Appointment = require('../models/appointment');
const Consultation = require('../models/consultation');
const SMS = require('../models/sms');
const NurseReport = require('../models/nurseReport')
const Theater = require('../models/theater')
const Service = require('../models/service')
const Paid = require('../models/paid')
const Supply = require('../models/supply')
const Payment = require('../models/payments')
const Imaging = require('../models/imaging')
const LocalInventory = require('../models/localinventory')
const NhisOpdInventory = require('../models/nhisOpdInventory')
const NhisIpdInventory = require('../models/nhisIpdInventory')
const Discharge = require('../models/discharge')
const Investigations = require('../models/investigations')
const Donor = require('../models/donor')
const ANC = require('../models/anc')
const NurseNote = require('../models/nursenote')
const Request = require('../models/request')
const WardRound = require('../models/wardRound')
const Careplan = require('../models/careplan')
const Treatment = require('../models/treatment')
const InPatient = require('../models/inPatientInventory')
const LabInventory = require('../models/labLocalInventory')
const Consentform = require('../models/consentform')
const Assessment = require('../models/assessment')
const Immunization = require('../models/immunization')
const ManagerRequest = require('../models/managerRequest')
const Iochart = require('../models/iochart')
const WardInventory = require('../models/wardinventory')
const labItem = require('../models/labitem')
const PharmacyItem = require('../models/pharmacyItem')
const PharmDispense = require('../models/pharmDispense')
const LabDispense = require('../models/labDispense')
const HMO = require('../models/hmo')
const File = require('../models/file')
const Drug = require('../models/drug')
const Test = require('../models/test')
const Invoice = require('../models/invoice')
const Visit = require('../models/visit')
const Lab = require('../models/lab')
const sgMail = require('@sendgrid/mail');
const multer = require('multer');
const cron = require('node-cron');
const middleware = require("../middleware");
const Triage = require('../models/triage');
const upload = require('./upload');
const bcrypt = require('bcrypt-nodejs')
const Notification = require('../models/notifications')
const uuidv1 = require('uuid/v4');
var unirest = require('unirest')
const session = require('express-session');
const { check, validationResult } = require('express-validator');

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



// function loggout() {
//     router.get('*', (req, res, next)=>{
//         if(req.user){
//             req.session.destroy()
//             res.redirect('/login')
//         }else{

//         }
//     })
// }

// const job = cron.schedule('*/2 * * * *', () => {
//     loggout()
//     console.log('User logged Out!')
// });
// job.stop()


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
                Payment.find({}, (err, payments)=>{
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
                res.render('app/dashboard', {allUsers, appointments, appointmentIsEmpty, payments})
                })
            }) 
        })
    }else if(req.user.role === 3){
        //NURSE
        User.find({})
        .sort('-createdAt')
        .populate('triages')
        .populate('retainershipname')
        .exec((err, users)=>{
            if(err) return next (err)
            Appointment.find({})
            .sort('-appointmentdate')
            .populate('patient')
            .exec((err, appointments)=>{
                var appointmentIsEmpty = true
                if(appointmentIsEmpty > 0){
                    appointmentIsEmpty = false
                }
                if(err) return next (err)
                res.render('app/dashboard1', { appointments, users, appointmentIsEmpty})              
            })
        })
    }else if(req.user.role === 2){
        //DOCTORS
        User.find({})
        .sort('-createdAt')
        .exec((err, users)=>{
            if(err) return next (err)
            var allUsers = []
            
            Appointment.find({doctor: req.user._id})
            .populate('doctor')
            .populate('patient')
            .exec((err, appointments)=>{
                if(err) return next (err)
                Triage.find({})
                .sort('created')
                .populate('patient')
                .deepPopulate('patient.retainershipname')
                .exec((err, triages)=>{
                    if(err) return next (err)
                    var allTriages = []
                    triages.forEach((triage)=>{
                        if(triage.patient !== null){
                            var birthday = new Date(triage.patient.birthday)
                            var today = new Date()
                            var age = today.getFullYear() - birthday.getFullYear()
                            if(today.getMonth() < birthday.getMonth()){
                                age
                            }
                            if(today.getMonth() == birthday.getMonth() && today.getDate() < birthday.getDate()){
                                age
                            }
                            allTriages.push({
                                'firstname': triage.patient.firstname,
                                'lastname': triage.patient.lastname,
                                'id': triage.patient._id,
                                'age': age,
                                'seen': triage.seen,
                                'taken': triage.taken,
                                'qms': triage.qms,
                                'retainershipname': triage.patient.retainershipname
                            })
                        }

                    })
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
                res.render('app/dashboard2', {allUsers, appointments, appointmentIsEmpty, allTriages})
            })
            }) 
        })
    }else if(req.user.role === 7){
        //RECEPTIONIST
        User.find({})
        .populate('triages')
        .exec((err, users)=>{
            if(err) return next (err)
            Appointment.find({})
                .sort('-created')
                .populate('patient')
                .populate('doctor')
                .exec((err, appointments)=>{
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
                                'triages': user.triages.length,
                                'id': user._id,
                                'patientId': user.patientId,
                                'firstname': user.firstname,
                                'paid': user.account.paid,
                                'lastname': user.lastname,
                                'address': user.address,
                                'phone': user.phonenumber,
                                'email': user.email,
                                'addmitted': user.addmitted,
                                'discharge': user.discharge,
                                'status': user.status,
                                'age': age
                            })
                        }
                    })
                    res.render('app/dashboard3', { allPatients, appointments })
                })
        })
    }else if(req.user.role === 9){
        //MEDICAL RECORDS
        User.find({})
        .sort('-createdAt')
        .populate('registeredby')
        .populate('retainershipname')
        .exec((err, users)=>{
            if(err) return next (err)
            var allUsers = []
            var usersIsEmpty = true;
            if (users.length > 0) {
                usersIsEmpty = false;
            }
            Appointment.find({}, (err, appointments)=>{
                if(err) return next (err)
               
                    //Patients registered today
                    User.find({
                        "createdAt": {
                            $lt: new Date(new Date().setHours(23, 59, 59)),
                            $gte: new Date(new Date().setHours(00, 00, 00))
                        }
                    })
                    .sort('-createdAt')
                    .populate('retainershipname')
                    .populate('registeredby')
                    .exec((err, usersToday) => {
                        if(err) return next(err)
                        //Patients registered this week
                        User.find({
                            "createdAt" : { 
                                $lt: new Date(), 
                                $gte: new Date(new Date().setDate(new Date().getDate()-7))
                              } 
                        })
                        .sort('-createdAt')
                        .populate('registeredby')
                        .populate('retainershipname')
                        .exec((err, userThisWeek)=>{
                            if(err) return next(err)
                            //Patients registered last 30 days
                            User.find({
                                "createdAt" : { 
                                    $lt: new Date(), 
                                    $gte: new Date(new Date().setDate(new Date().getDate()-30))
                                  } 
                            })
                            .sort('-createdAt')
                            .populate('registeredby')
                            .populate('retainershipname')
                            .exec((err, usersLast30Days)=>{
            
                                users.forEach((user) => {
                                    var birthday = new Date(user.birthday);
                                    var today = new Date();
                                    var age = today.getFullYear() - birthday.getFullYear();
                                    if (today.getMonth() < birthday.getMonth()) {
                                        age;
                                    }
                                    if (today.getMonth() == birthday.getMonth() && today.getDate() < birthday.getDate()) {
                                        age;
                                    }
                                    if (user.role == 8) {
                                        //All registered users
                                        allUsers.push({
                                            'retainershipname': user.retainershipname,
                                            'registeredby': user.registeredby,
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
                                            'created': user.createdAt.toLocaleString(),
                                        });
                                    }
                                });
                                res.render('app/dashboard4', { allUsers, users, usersIsEmpty, appointments, usersToday, userThisWeek, usersLast30Days });
                            })
                        })
                    })
            })
        })
    }else if(req.user.role === 4){
        //LABORATORIST
        User.find({}, (err, users)=>{
            if(err) return next (err)
            Consultation.find({})
            .populate('doctor')
            .populate('patient')
            .deepPopulate(['labtestObject.lab', 'labtestObject.tests', 'labtestObject.tests.lab', 'patient.retainershipname'])
            .exec((err, consultations)=>{
                if(err) return next (err)
                Appointment.find({}, (err, appointments)=>{
                    if(err) return next (err)
                    ANC.find({})
                        .populate('labtest')
                        .populate('creator')
                        .populate('patient')
                        .deepPopulate('labtest.lab')
                        .exec((err, ancs)=>{
                            if(err) return next (err)
                         res.render('app/dashboard5', { consultations, users, appointments, ancs })
                    })
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
                .deepPopulate([
                    'drugsObject.drugs',
                    'patient.retainershipname',
                    'drugsObject.prescribedBy',
                    'drugsObject.drugs.name.pharmname',
                    "drugsObject.nhisdrugs.name.pharmname",
                ])
                .exec((err, consultations)=>{
                    if(err) return next (err)
                    LocalInventory.find({})
                        .deepPopulate('name.pharmname')
                        .exec((err, drugs)=>{
                            ANC.find({})
                                .populate('labtest')
                                .populate('creator')
                                .exec((err, ancs)=>{
                                    Request.find({requestedby: req.user._id}, (err, requests)=>{
                                        res.render('app/dashboard6', { appointments, users, consultations, drugs, ancs, requests })
                                    })
                                })
                        })
                })
                
            })
        })
    }else if(req.user.role === 6){
        //ACCOUNTS
        User.find({})
        .sort('-createdAt')
        .populate('retainershipname')
        .exec((err, users)=>{
            if(err) return next (err)
            Consultation.find({})
            .sort('-created')
            .populate('patient')
            .populate('payment')
            .deepPopulate([
                'drugsObject.drugs', 'labtestObject.tests', 'labtestObject.paid', 'drugsObject.paid',
                'patient.retainershipname', 'payment.drugs', 'payment.lab', 'payment.imaging', 'imaging.images',
                'imaging.investigation', 'drugsObject.drugs.name.pharmname',  "drugsObject.nhisdrugs.name.pharmname",
            ])
            .exec((err, consultations)=>{
                if(err) return next (err)
                Appointment.find({}, (err, appointments)=>{
                    if(err) return next (err)
                    Payment.find({})
                    .populate('patient')
                    .populate('initiator')
                    .deepPopulate(['patient.retainershipname'])
                    .populate('services')
                    .populate('drugs')
                    .populate('lab')
                    .exec((err, payments)=>{
                        if(err) return next (err)
                        res.render('app/dashboard7', { users, consultations, appointments, payments })
                    })

                })
            })
        })
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
                .populate('services')
                .exec((err, payments)=>{
                    if(err) return next (err)
                    res.render('app/dashboard9', { users, consultations, payments })
                })
            })
        })
    }else if(req.user.role === 12){
        //NHIS
        User.find({})
        .populate('retainershipname')
        .exec((err, users)=>{
            if(err) return next (err)
            Appointment.find({})
            .populate('patient')
            .exec((err, appointments)=>{
                if(err) return next (err)
                Consultation.find({})
                .sort('-created')
                .populate('patient')
                .populate('doctor')
                .deepPopulate(['drugsObject.drugs', 'drugsObject.paid', 'patient.retainershipname'])
                .populate('labtestObject.tests')
                .populate('imaging')
                .exec((err, consultations)=>{
                    res.render('app/dashboard10', { users, appointments, consultations })
                })
            })
        })
    }else if(req.user.role === 13){
        //PHARMACY INVENTORY
        PharmacyItem.find({})
        .populate('pharmname')
        .exec((err, items)=>{
            if(err) return next (err)
            Appointment.find({})
            .populate('patient')
            .exec((err, appointments)=>{
                if(err) return next (err)
                User.find({}, (err, users)=>{
                    if(err) return next (err)
                    Request.find({})
                    .populate('requestedby')
                    .deepPopulate('pharmitem.pharmname')
                    .exec((err, requests)=>{
                        if(err) return next (err)
                        res.render('app/dashboard11', { items, appointments, users, requests})
                    })
                })
            })
        })
    }else if(req.user.role === 14){
        //LAB INVENTORY
        labItem.find({})
        .populate('dispensehistory')
        .exec((err, items)=>{
            if(err) return next (err)
            Appointment.find({})
            .populate('patient')
            .exec((err, appointments)=>{
                if(err) return next (err)
                User.find({}, (err, users)=>{
                    if(err) return next (err)
                    Request.find({})
                    .populate('requestedby')
                    .populate('labitem')
                    .exec((err, requests)=>{
                        if(err) return next (err)
                        res.render('app/dashboard12', { items, appointments, users, requests})
                    })
                })
            })
        })
    }else if(req.user.role === 15){
        //IMAGING
        Consultation.find({})
        .populate('patient')
        .deepPopulate('imaging.investigation')
        .exec((err, consultations)=>{
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
    }else if(req.user.role === 16){
        //MIDWIFE
        ANC.find({})
        .sort('-created')
        .populate('patient')
        .exec((err, ancs)=>{
            if(err) return next (err)
            Appointment.find({})
            .sort('created')
            .populate('patient')
            .exec((err, appointments)=>{
                if(err) return next (err)
                var appointmentIsEmpty = true;
                if (appointments.length > 0) {
                    appointmentIsEmpty = false;
                }
                User.find({}, (err, users)=>{
                    if(err) return next (err)
                    res.render('app/dashboard14', { ancs, appointments, users, appointmentIsEmpty })
                })
            })
        })
    }else if(req.user.role === 17){
        //VENDOR
        Supply.find({creator: req.user._id})
        .sort('-created')
        .populate('pharmname')
        .exec((err, supplies)=>{
            if(err) return next (err)
            Appointment.find({})
            .sort('created')
            .populate('patient')
            .exec((err, appointments)=>{
                if(err) return next (err)
                var supplyIsEmpty = true;
                if (supplies.length > 0) {
                    supplyIsEmpty = false;
                }
                User.find({}, (err, users)=>{
                    if(err) return next (err)
                    res.render('app/dashboard16', { supplies, appointments, users, supplyIsEmpty })
                })
            })
        })
    }else if(req.user.role === 18){
        //MANAGER
        PharmacyItem.find({})
        .sort('-created')
        .exec((err, items)=>{
            if(err) return next (err)
            Appointment.find({})
            .sort('created')
            .populate('patient')
            .exec((err, appointments)=>{
                if(err) return next (err)
                User.find({}, (err, users)=>{
                    if(err) return next (err)
                    ManagerRequest.find({})
                    .populate('requestedby')
                    .exec((err, managerrequests)=>{
                        res.render('app/dashboard17', { items, appointments, users, managerrequests })
                    })
                })
            })
        })
        
    }else if(req.user.role === 19){
        //THEATER
        Theater.find({})
        .sort('-created')
        .populate('patient')
        .exec((err, theaters)=>{
            if(err) return next (err)
            Appointment.find({})
            .sort('created')
            .populate('patient')
            .exec((err, appointments)=>{
                if(err) return next (err)
                User.find({}, (err, users)=>{
                    if(err) return next (err)
                    ManagerRequest.find({})
                    .populate('requestedby')
                    .exec((err, managerrequests)=>{
                        res.render('app/dashboard18', { theaters, appointments, users, managerrequests })
                    })
                })
            })
        })
    }else if(req.user.role === 22){
        //HOD PHARMACY
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
                .deepPopulate(['drugsObject.drugs', 'patient.retainershipname', 'drugsObject.prescribedBy', 'drugsObject.drugs.name.pharmname'])
                .exec((err, consultations)=>{
                    if(err) return next (err)
                    PharmacyItem.find({})
                        .exec((err, drugs)=>{
                            ANC.find({})
                                .populate('labtest')
                                .populate('creator')
                                .exec((err, ancs)=>{
                                    Request.find({})
                                    .populate('requestedby')
                                    .exec((err, requests)=>{
                                        res.render('app/dashboard19', { appointments, users, consultations, drugs, ancs, requests })
                                    })
                                })
                        })
                })
                
            })
        })
    }else if (req.user.role == 20){
        //HOD LABORATORY
        User.find({}, (err, users)=>{
            if(err) return next (err)
            Consultation.find({})
            .populate('doctor')
            .populate('patient')
            .populate('labtestObject')
            .deepPopulate(['labtestObject.lab', 'labtestObject.tests', 'labtestObject.tests.lab', 'patient.retainershipname'])
            .exec((err, consultations)=>{
                if(err) return next (err)
                Appointment.find({}, (err, appointments)=>{
                    if(err) return next (err)
                    ANC.find({})
                        .populate('labtest')
                        .populate('creator')
                        .populate('patient')
                        .deepPopulate('labtest.lab')
                        .exec((err, ancs)=>{
                            if(err) return next (err)
                            Request.find({})
                            .populate('requestedby')
                            .exec((err, requests)=>{
                                if(err) return next (err)
                                res.render('app/dashboard20', { consultations, users, appointments, ancs, requests })
                            })
                    })
                })
            })
        })
    }else if (req.user.role == 21){
        // HOD NURSE
        User.find({})
        .sort('-createdAt')
        .populate('triages')
        .exec((err, users)=>{
            if(err) return next (err)
            Appointment.find({})
            .populate('patient')
            .exec((err, appointments)=>{
                var appointmentIsEmpty = true
                if(appointmentIsEmpty > 0){
                    appointmentIsEmpty = false
                }
                if(err) return next (err)
                res.render('app/dashboard21', { appointments, users, appointmentIsEmpty})              
            })
        })
    }else if(req.user.role == 23){
        // INPATIENT PHARMACY
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
                .deepPopulate([
                 'drugsObject.drugs',
                 'patient.retainershipname', 'drugsObject.prescribedBy',
                  'drugsObject.drugs.name.pharmname',
                 "drugsObject.nhisdrugs.name.pharmname",
                ])
                .exec((err, consultations)=>{
                    if(err) return next (err)
                    LocalInventory.find({})
                    .deepPopulate('name.pharmname')
                        .exec((err, drugs)=>{
                            ANC.find({})
                                .populate('labtest')
                                .populate('creator')
                                .exec((err, ancs)=>{
                                    Request.find({requestedby: req.user._id}, (err, requests)=>{
                                        res.render('app/dashboard22', { appointments, users, consultations, drugs, ancs, requests })
                                    })
                                })
                        })
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

// Convert Numbers to month
function changeToMonth(arr){
    var err = []
    for (let index = 0; index < arr.length; index++) {
        if(arr[index] === 1){
            err.push('Jan')
        }else if(arr[index] === 2){
            err.push('Feb')
        }else if(arr[index] === 3){
            err.push('Mar')
        }else if(arr[index] === 4){
            err.push('Apr')
        }else if(arr[index] === 5){
            err.push('May')
        }else if(arr[index] === 6){
            err.push('Jun')
        }else if(arr[index] === 7){
            err.push('Jul')
        }else if(arr[index] === 8){
            err.push('Aug')
        }else if(arr[index] === 9){
            err.push('Sep')
        }else if(arr[index] === 10){
            err.push('Oct')
        }else if(arr[index] === 11){
            err.push('Nov')
        }else if(arr[index] === 12){
            err.push('Dec')
        }
    }
    return err
   
}

//ANAlYTICS
router.get('/analytics-page', middleware.isLoggedIn, (req, res, next)=>{
   
        Payment.aggregate([
            {
                
                  $group : { 
                        _id : { year: { $year : "$createdAt" }, month: { $month : "$createdAt" }}, 
                        totalAmount : { $sum : {$add: '$amount'}},
                        count: {$sum: 1}
                   }
            },
            { $sort: { '_id.month': 1 } },
        ], function(err, result) {
            const response = result.map(counts=>{
                const rCount = counts.totalAmount
                return Number(rCount.toFixed(1));
            })
            const allmonths = result.map(count=>{
                const rMonth = count._id.month;
                return rMonth;
            })

            const allyear = result.map(count=>{
                const rYear = count._id.year;
                return rYear;
            })

            if (err) {
                res.status(500).json({data: err});
            } else {
                // res.json(result);
                res.status(200).json({
                    data: response,
                    sample: allyear,
                    months: changeToMonth(allmonths)
                });
            }
        });

})



router.get('/user-registrations', middleware.isLoggedIn, (req, res, next)=>{
        User.aggregate([
            { $match: { role: 8 } },
            {
                $group : { 
                    _id : {year: { $year : "$createdAt" }, month: { $month : "$createdAt" }}, 
                    // totalAmount : { $sum : {$add: '$amount'}},
                    count: {$sum: 1}
                }
            },
            { $sort: { '_id.month': 1 } },
        ], function(err, result) {
            const response = result.map(counts=>{
                const rCount = counts.count
                return rCount;
            })
            const allmonths = result.map(count=>{
                const rMonth = count._id.month
                return rMonth;
            })
            
            if (err) {
                res.status(500).json({data: err});
            } else {
                // res.json(result);
                res.status(200).json({
                    data: response,
                    months: changeToMonth(allmonths)
                });
            }
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
    })
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
        .deepPopulate([
            'drugsObject.drugs', 'labtestObject.tests', 'labtestObject.paid', 'drugsObject.paid',
            'patient.retainershipname', 'payment.drugs', 'payment.lab', 'payment.imaging', 'imaging.images',
            'imaging.investigation', 'drugsObject.drugs.name.pharmname',
        ])
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

        .populate('labtestObject')
        .populate('patient')
        .sort('-created')
        .deepPopulate([
            'drugsObject.drugs', 'labtestObject.tests', 'labtestObject.paid', 'drugsObject.paid',
            'patient.retainershipname', 'payment.drugs', 'payment.lab', 'payment.imaging', 'imaging.images',
            'imaging.investigation', 'drugsObject.drugs.name.pharmname',
        ])
        .exec((err, consultations)=>{
            if(err) return next (err)
            res.render('app/view/pharm_fee', { users, consultations })
        })
    })
})

//IMAGING FEE
router.get('/imaging-fees', middleware.isLoggedIn, (req, res, next)=>{
    User.find({}, (err, users)=>{
        if(err) return next (err)
        Consultation.find({})
        .populate('drugsObject')
        .populate('labtestObject')
        .populate('patient')
        .sort('-created')
        .deepPopulate([
            'drugsObject.drugs', 'labtestObject.tests', 'labtestObject.paid', 'drugsObject.paid',
            'patient.retainershipname', 'payment.drugs', 'payment.lab', 'payment.imaging', 'imaging.images',
            'imaging.investigation', 'drugsObject.drugs.name.pharmname',
        ])
        .exec((err, consultations)=>{
            if(err) return next (err)
            res.render('app/view/imaging_fee', { users, consultations })
        })
    })
})

//CREATE VENDOR
router.route('/add-vendor')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        res.render('app/add/add_vendor')
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        // const country = 'Nigeria';
        User.findOne({username: req.body.username}, (err, existingUsername)=>{
            if(err) {return next (err)}
            if(existingUsername){
                req.flash('error',  'Account with that username already exists.');
                return res.redirect('/add-vendor');
            }else{
                User.findOne({ phonenumber: req.body.phone }, function(err, existingUserPhone){
                    if (existingUserPhone){
                        req.flash('error',  'Account with that phone number already exists.');
                        return res.redirect('/add-vendor');
                    }
                })
                uniq = uuidv1()
                var stamp = uniq.substr(uniq.length - 7);
                const vendor = new User();
                const { username, fname, lname, email, password, phone, role, address, company } = req.body;
                if(!fname || !lname || !username || !email || !password || !phone || !role || !address ){
                    req.flash('error',  'Please enter input fields');
                    return res.redirect('/add-vendor')
                }
                vendor.vendorId = stamp;
                vendor.firstname = fname;
                vendor.lastname = lname;
                vendor.username = username;
                vendor.company = company;
                vendor.email = email;
                vendor.isVerified = true;
                vendor.phonenumber = phone;
                vendor.password = password;
                vendor.address = address;
                vendor.role = role;
                //vendor.status = true;
                vendor.photo = vendor.gravatar();
                vendor.save((err) => {
                    if (err) { return next(err) }
                    req.flash('success', 'Vendor has been created')
                    res.redirect('/vendors');
                })
            }
        })   
    })

//CREATE VENDOR SUPPLY
router.route('/add-vendor-supply')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.find({}, (err, users)=>{
            Drug.find({}, (err, drugs)=>{
                res.render('app/add/add_supply', {users, drugs})
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const supply = new Supply({
            pharmname: req.body.item,
            creator: req.user._id,
            description: req.body.description,
            price: req.body.price,
            unit: req.body.unit,
            quantity: req.body.quantity,
            cost: req.body.cost,
            expiration: req.body.expiration,
            serialnum: req.body.snum,
        })
        supply.save((err)=>{
            if(err) return next (err)
            req.flash('success', 'Item was added successfully')
            res.redirect('back')
        })
    })

//ADD BLOOD DONORS
router.route('/add-donor')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        Donor.countDocuments({}, (err, donors)=>{
            if(err) return next (err)
            User.find({}, (err, users)=>{
                let donorNumber = donors + 1
                res.render('app/add/add_donor', { donorNumber, users })
            })
        })
        
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        Donor.countDocuments({}, (err, donors)=>{
            const donor = new Donor({
                donornumber: `DONOR/00${donors + 1}`,
                name: req.body.name,
                age: req.body.age,
                patient: req.body.patient,
                creator: req.user._id,
                sex: req.body.sex,
                history: req.body.history,
                phone: req.body.phone,
                bloodtype: req.body.bloodtype,
                hivtest: req.body.hivtest,
                hcvtest: req.body.hcvtest,
                hbsagtest: req.body.hbsagtest,
                vdrltest: req.body.vdrltest,
            })
            donor.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Donor was added successfully')
                res.redirect('back')
            })
        })
    })

//VIEW DONORS
router.get('/blood-donors', middleware.isLoggedIn, (req, res, next)=>{
    Donor.find({})
        .populate('creator')
        .populate('patient')
        .exec((err, donors)=>{
            if(err) return next (err)
            res.render('app/view/donors', {donors})
        })
})

//VIEW SUPPLIES
router.get('/vendor-supplies', middleware.isLoggedIn, (req, res, next)=>{
    Supply.find({})
        .populate('creator')
        .exec((err, supplies)=>{
            if(err) return next (err)
            res.render('app/view/supplies', {supplies})
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

//ADD IMAGING INVESTIGATION
router.route('/add-investigation/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        Imaging.findOne({_id: req.params.id}, (err, imaging)=>{
            res.render('app/add/add_imaging_investigation', { imaging })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const investigations = new Investigations({
            name: req.body.investigation,
            imaging: req.params.id,
            status: true,
            price: req.body.price
        })
        investigations.save((err)=>{
            if(err) return next (err)
            Imaging.updateOne(
                {
                    _id: investigations.imaging
                },
                {
                    $push: {investigation: investigations._id}
                }, function(err, count){
                    req.flash('success', 'Investion was added successfully')
                    res.redirect('back')
                }
            )
        })
    })

//INVESTIGATIONS
router.get('/investigation-list', middleware.isLoggedIn, (req, res, next)=>{
    Imaging.find({})
    .populate('investigation')
    .exec((err, imaging) =>{
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
    User.find({}, (err, users)=>{
        if(err) return next(err)
        res.render('app/view/vendor', {users})
    })
})

// test camera capture
router.route('/capture-image/:id')
.get(middleware.isLoggedIn, (req, res, next)=>{
        User.findById(req.params.id, (err, user)=>{
            res.render('app/view/camera', {user})
        })
})

.post(middleware.isLoggedIn, function(req, res, next) {
    var matches = req.body.base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {}
    if(matches.length !== 3){
        return res.status(400).json('invalid base64 string')
    }

    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    let extension = mime.extension(type);
    let fileName = 'image' + Date.now() + '.' + extension;

   
	fs.writeFile(`./public/uploads/${fileName}`, imageBuffer, 'utf8', function(err) {
		if(err){
			  res.status(400).json(err.message);
			}else{
            User.findById(req.params.id, (err, user) =>{
                user.photo = fileName;
                user.save((err)=>{
                    if(err) return next (err)
                    res.status(200).json('User picture taken successfully')
                })
            })            
		}
	});
});

// router.post('/test-patient', middleware.isLoggedIn, [
//     check('email').custom(value => {
//         return User.findByEmail(value).then(user => {
//           if (user) {
//             return Promise.reject('E-mail already in use');
//           }
//         });
//     }),

// ], (req, res, next)=>{
//     User.countDocuments({role: 8})
//         .exec((err, count)=>{
//             const user = new User()
//         })
// })

//ADD A PATIENT
router.route('/add-patient')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        var mysort = { hmoname: 1 };
        HMO.find({})
        .sort(mysort)
        .exec((err, hmos)=>{
            if(err) return next (err)
            
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
                    
                        upload(req, res, (err) => {
                            if (err instanceof multer.MulterError) {
                                req.flash('error', 'Your file is too large, try reducing the size')
                                return res.redirect('back')
                            }
                            else if (err) {
                                return next(err)
                            }
                            else if (req.files == undefined) {
                                req.flash('error',  'File is undefined.');
                                return res.redirect('back')
                            }
                                else {
                                async.waterfall([
                                    function (done) {
                                        const user = new User()
                                        user.patientId = `DOCH/00000${count + 1}`;
                                        user.username = `PATIENT/0${count + 1}`;
                                        user.registeredby = req.user._id;
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
                                        user.cardtype = req.body.type;
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
                                        user.retainershipname = req.body.retainershipname;
                                        user.hmoname = req.body.hmoname;
                                        user.patientcode = req.body.patientcode;
                                        user.account = {
                                            registration: req.body.registration,
                                            consultation: req.body.consultation,
                                        };
                                    
                                        if(req.body.type === 'Family'){
                                            user.family.push({
                                                names: req.body.family1,
                                                dob: req.body.familydate2,
                                            });
                                        }
                                        
                                        if(req.body.retainership === 'Yes'){
                                            user.hmodependant.push({
                                                names: req.body.dependantname,
                                                dob: req.body.dependantdate,
                                                files:  req.files.filename
                                            });
                                        }
                                        user.photo = user.gravatar();
                                        user.save((err) => {
                                            if (err) { return next(err) }
                                            done(err, user)
                                        })
                                    },
                                    function name(user, done) {
                                        
                                        if(req.files.length > 0){
                                            const fullpath = req.files
                                            const document = {
                                                name: fullpath,
                                                creator: req.user._id,
                                                patient: user._id
                                            }
                                            const file = new File(document)
                                            file.save((err)=> {
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
                                                    });
                                                User.updateOne(
                                                    {
                                                        _id: user._id
                                                    },
                                                    {
                                                        $push:{files: file._id}
                                                    },function (err, count) {
                                                        req.flash('success', 'Patient has been created')
                                                        return res.redirect('/capture-image/' + user._id);
                                                    }
                                                )
                                            })
                                        }else{
                                            req.flash('success', 'Patient has been created')
                                            return res.redirect('/capture-image/' + user._id);
                                        }
                                    }
                                ])
                               
                                
                            }
                        })
                    
                }
            })
        })
    })


//ADD A PATIENT
router.route('/edit-patient-dependant/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        var mysort = { hmoname: 1 };
        HMO.find({})
        .sort(mysort)
        .populate('retainershipname')
        .exec((err, hmos)=>{
            if(err) return next (err)
            
            User.findOne({_id: req.params.id})
            .exec((err, patient)=>{
                if(err) return next (err)
                res.render('app/add/add_dependants', {hmos, patient})
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({ _id: req.params.id }, function(err, user){
            if(err) return next (err)
            if(req.body.retainershipname) user.retainershipname = req.body.retainershipname
            if(req.body.hmoname) user.hmoname = req.body.hmoname
            if(req.body.patientcode) user.patientcode = req.body.patientcode
            user.hmodependant.push({
                names: req.body.dependantname,
                dob: req.body.dependantdate,
            });
            user.save((err) => {
                if (err) { return next(err) }
                req.flash('success', 'Info updated')
                res.redirect('back')
            })    
        })

    })

// EDIT PATIENT

router.route('/edit-patient/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({_id: req.params.id }, (err, user)=>{
            HMO.find({}, (err, hmos)=>{
                if(err) return next (err)
                User.countDocuments({role: 8})
                .exec((err, count)=>{
                    var counter = count + 1
                    if(err) return next (err)
                    res.render('app/add/edit_add_patient', { hmos, counter, user })
                })
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({ _id: req.params.id }, function(err, user){
            if (user){
                if (req.body.email) user.email = req.body.email;
                if (req.body.fname) user.firstname = req.body.fname;
                if (req.body.lname) user.lastname = req.body.lname;
                if (req.body.oldpatientID) user.oldpatientId = req.body.oldpatientID;
                if (req.body.religion) user.religion = req.body.religion;
                if (req.body.gender) user.gender = req.body.gender;
                if (req.body.mstatus) user.mstatus = req.body.mstatus;
                if (req.body.phone) user.phonenumber = req.body.phone;
                if (req.body.address) user.address = req.body.address;
                if (req.body.retainership) user.retainership = req.body.retainership;
                if (req.body.nextofkinname) user.nextofkinname = req.body.nextofkinname;
                if (req.body.nextofkinphone) user.nextofkinphone = req.body.nextofkinphone;
                if (req.body.nextofkinaddress) user.nextofkinaddress = req.body.nextofkinaddress;
                if (req.body.relationship) user.relationship = req.body.relationship;
                if (req.body.city) user.city = req.body.city;
                if (req.body.retainershipname) user.retainershipname = req.body.retainershipname;
                if (req.body.hmoname) user.hmoname = req.body.hmoname;
                if (req.body.patientcode) user.patientcode = req.body.patientcode;
                user.save((err) => {
                    if (err) { return next(err) }
                    req.flash('success', 'Patient has been created')
                    res.redirect('back');
                })
            }
        })
    })

// UPLOAD DEPENDANTS PICS
router.route('/take-dependants-pictures/:id')
.get(middleware.isLoggedIn, (req, res, next)=>{
    User.findById(req.params.id, (err, user)=>{
        res.render('app/add/add_dependant_picture', {user})
    })
})
.post(middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id}, (err, user)=>{
        var matches = req.body.base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {}
        if(matches.length !== 3){
            return res.status(400).json('invalid base64 string')
        }
    
        response.type = matches[1];
        response.data = Buffer.from(matches[2], 'base64');
        let decodedImg = response;
        let imageBuffer = decodedImg.data;
        let type = decodedImg.type;
        let extension = mime.extension(type);
        let fileName = 'image' + Date.now() + '.' + extension;
    
       
        fs.writeFile(`./public/uploads/${fileName}`, imageBuffer, 'utf8', function(err) {
            if(err){
                  res.status(400).json(err.message);
                }else{
                const file = new File({
                    name: fileName,
                    creator: req.user._id,
                    patient: user._id
                })
                file.save((err)=>{
                    if(err) return res.status(500).json({message: 'Error saving picture'})
                    User.updateOne(
                        {
                            _id: req.params.id
                        },
                        {
                            $push: {files: file._id}
                        },
                        function(err, count){
                            if(err) return res.status(500).json({message: 'Error saving picture'})
                            res.status(200).json({message: 'Picture taken successfully'})
                        }
                    )
                })
            }
        });
    })
})

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
                        return res.redirect('back');
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
        User.findOne({username: req.body.username}, (err, existingUsername)=>{
            if(err) {return next (err)}
            if(existingUsername){
                req.flash('error',  'Account with that username already exists.');
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
        User.findOne({_id: req.body.patient}, (err, user)=>{
            if(err) return next (err)
            if(user.triages.length < 1){
                req.flash('error', 'Error creating appointment, Patient doesn\'t have any triage record');
                return res.redirect('back')
            }else{
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
                        User.findById(appointment.doctor)
                            .exec((err, user) => {
                            if (err) return next(err);
                            User.update(
                                {
                                    _id: appointment.doctor
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
                                Appointment.findOne(appointment)
                                    .populate('patient')
                                    .deepPopulate('doctor')
                                    .exec((err, appointment)=>{
                                        unirest.post( 'https://api.smartsmssolutions.com/smsapi.php')
                                        .header({'Accept' : 'application/json'})
                                        .send({
                                            'username': process.env.SMSSMARTUSERNAME,
                                            'password': process.env.SMSSMARTPASSWORD,
                                            'sender': process.env.SMSSMARTSENDERID,
                                            'recipient' : `234${appointment.doctor.phonenumber}`,
                                            'message' : `Dear Dr ${appointment.doctor.firstname} ${appointment.doctor.lastname}, you have an appointment with ${appointment.patient.firstname} ${appointment.patient.lastname} on ${appointment.appointmentdate.toDateString()} by ${appointment.appointmenttime.toLocaleTimeString()}. Best regards`,
                                            'routing': 4,
                                            
                                        })
                                        .end(function (response) {
                                   
                                        });
                                    req.flash('success', 'Appointment has been created')
                                    res.redirect('/appointments'); 
                                })
                            }      
                        )
                    }
                ]) 
            }
        })
        
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
        User.findOne({_id: req.params.id}, (err, user)=>{
            if(err) return next (err)
            if(user.triages.length < 1){
                req.flash('error', 'Error creating appointment, Patient doesn\'t have any triage record')
                return res.redirect('back')
            }else{
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
                        User.findById(appointment.doctor)
                        .exec((err, user) => {
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
                                Appointment.findOne(appointment)
                                    .populate('patient')
                                    .deepPopulate('doctor')
                                    .exec((err, appointment)=>{
                         
                                        unirest.post( 'https://api.smartsmssolutions.com/smsapi.php')
                                        .header({'Accept' : 'application/json'})
                                        .send({
                                            'username': process.env.SMSSMARTUSERNAME,
                                            'password': process.env.SMSSMARTPASSWORD,
                                            'sender': process.env.SMSSMARTSENDERID,
                                            'recipient' : `234${appointment.doctor.phonenumber}`,
                                            'message' : `Dear Dr ${appointment.doctor.firstname} ${appointment.doctor.lastname}, you have an appointment with ${appointment.patient.firstname} ${appointment.patient.lastname} on ${appointment.appointmentdate.toDateString()} by ${appointment.appointmenttime.toLocaleTimeString()}. Best regards`,
                                            'routing': 4,
                                            
                                        })
                                        .end(function (response) {
                                       
                                        });
                                    req.flash('success', 'Patient Appointment has been created')
                                    res.redirect('/dashboard'); 
                                })
                            }      
                        )
                    }
                ]) 
            }
        })
       
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
            triage.fheartrate = req.body.fheartrate;
            triage.save((err) => {
                if (err) { return next (err) }
            })
        User.update(
            {
                _id: triage.patient
            },
            {
                $push: { triages: triage._id },
               
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
    const consentform = new Consentform({
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
    consentform.save((err)=>{
        if (err) return next (err)
        req.flash('success', 'Consent form saved successfully')
        res.redirect('/consent-form/' + consentform._id)
    })
})

//CONSENT FORM FILLED
router.get('/consent-form/:id', middleware.isLoggedIn, (req, res, next)=>{
    Consentform.findOne({_id: req.params.id})
    .populate('patient')
    .populate('surgeon')
    .exec((err, theater)=>{
          if(err) return next (err)
        res.render('app/view/consent_form_filled', { theater })
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


//SEND SMS TO SPECIFIC USER
router.route('/sms-patient/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({_id: req.params.id}, (err, user)=>{
            if(err) return next(err)
            res.render('app/add/sms_patient', { user })
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
                        'recipient' : `234${req.body.patient}`,
                        'message' : req.body.message,
                        'routing': 4,
                    })
                    .end(function (response) {
                     
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
            var birthday = new Date(user.birthday)
            var today = new Date()
            var age = today.getFullYear() - birthday.getFullYear()
            if(today.getMonth() < birthday.getMonth()){
                age
            }
            if(today.getMonth() == birthday.getMonth() && today.getDate() < birthday.getDate()){
                age
            }
            res.render('app/add/add_patient_triage', { user, age })
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
            triage.fheartrate = req.body.fheartrate;
            triage.spo2 = req.body.spo2;
            triage.qms = req.body.qms;
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
                res.redirect('/dashboard')
            }
        );
    })

//DAILY NURSE REPORT
router.route('/add-daily-report')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.find({}, function (err, users) {
            if(err) return next (err)
            User.findOne({_id: req.params.id}, (err, user)=>{
                if(err) return next (err)
                res.render('app/add/daily_report', { users, user })
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const nurseReport = new NurseReport();
        nurseReport.comment = req.body.comment;
        nurseReport.observation = req.body.observation;
        nurseReport.weight = req.body.weight;
        nurseReport.height = req.body.height;
        nurseReport.bmi = req.body.bmi;
        nurseReport.rvs = req.body.rvs;
        nurseReport.pulse = req.body.pulse;
        nurseReport.respiration = req.body.respiration;
        nurseReport.temperature = req.body.temperature;
        nurseReport.heartrate = req.body.heartrate;
        nurseReport.blood = req.body.blood;
        nurseReport.dystolic = req.body.dystolic;
        nurseReport.systolic = req.body.systolic;
        nurseReport.muac = req.body.muac;
        nurseReport.fheartrate = req.body.fheartrate;
        nurseReport.spo2 = req.body.spo2;
        nurseReport.ward = req.body.ward;
        // nurseReport.input = req.body.input;
        // nurseReport.output = req.body.output;
        // nurseReport.initial = req.body.initial;
        nurseReport.creator = req.user._id;
        nurseReport.patient = req.body.patient;
        //nurseReport.doctor = req.body.doctor;
       // nurseReport.wardround = req.body.wardround;
        nurseReport.status = true;
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

//WARD ROUND
router.route('/ward-round/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({_id: req.params.id})
            .exec((err, user)=>{
                if(err) return next (err)
                User.find({}, (err, users)=>{
                    res.render('app/add/ward_round', {user, users})
                })
            })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const wardround = new WardRound({
            creator: req.user._id,
            patient: req.body.patient,
            doctor: req.body.doctor,
            wardround: req.body.wardround
        })
        wardround.save((err)=>{
            if(err) return next (err)
            User.updateOne(
                {
                    _id: req.params.id
                },
                {
                    $push: {wardrounds: wardround._id}
                },function(err, count){
                    req.flash('success', 'Ward round details saved successfully!')
                    res.redirect('back')
                }
            )
        })
    })

//DAILY NURSE REPORT
router.route('/add-daily-report/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.find({}, function (err, users) {
            if(err) return next (err)
            User.findOne({_id: req.params.id}, (err, user)=>{
                if(err) return next (err)
                res.render('app/add/add_patient_daily_report', { users, user })
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const nurseReport = new NurseReport();
        nurseReport.comment = req.body.comment;
        nurseReport.observation = req.body.observation;
        nurseReport.weight = req.body.weight;
        nurseReport.height = req.body.height;
        nurseReport.bmi = req.body.bmi;
        nurseReport.rvs = req.body.rvs;
        nurseReport.pulse = req.body.pulse;
        nurseReport.respiration = req.body.respiration;
        nurseReport.temperature = req.body.temperature;
        nurseReport.heartrate = req.body.heartrate;
        nurseReport.blood = req.body.blood;
        nurseReport.dystolic = req.body.dystolic;
        nurseReport.systolic = req.body.systolic;
        nurseReport.muac = req.body.muac;
        nurseReport.fheartrate = req.body.fheartrate;
        nurseReport.spo2 = req.body.spo2;
        // nurseReport.t = req.body.t;
        // nurseReport.p = req.body.p;
        // nurseReport.r = req.body.r;
        // nurseReport.bp = req.body.bp;
        nurseReport.ward = req.body.ward;
        // nurseReport.input = req.body.input;
        // nurseReport.output = req.body.output;
        // nurseReport.initial = req.body.initial;
        nurseReport.creator = req.user._id;
        nurseReport.patient = req.params.id;
        //nurseReport.doctor = req.body.doctor;
        //nurseReport.wardround = req.body.wardround;
        nurseReport.status = true;
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
    .sort('-created')
    .populate('patient')
    .populate('creator')
    .populate('doctor')
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

//EDIT DRUGS BRAND
router.route('/edit-generic-drug/:id')
    .get(middleware.isLoggedIn, (req, res, next) => {
        Drug.findOne({_id: req.params.id}, (err, drug)=>{
            if(err) return next (err)
            res.render('app/add/edit_generic_drug', { drug })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next) => {
        Drug.findOne({ _id: req.params.id }, function(err, drug){
            if (drug){
                if(req.body.generic) drug.generic = req.body.generic;
                drug.save((err)=>{
                    if(err) return next (err)
                    req.flash('success', 'Generic name edited successfully')
                    res.redirect('/drugs')
                })
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

//DELETE GENERIC DRUGS
router.post('/delete-drugs/:id', middleware.isLoggedIn, (req, res, next)=>{
    const localItem = req.body.localItem
    LocalInventory.deleteOne({_id: localItem}, (err, drug)=>{
        if(err) {
            req.flash('error', err.message)
            res.redirect('back')
        }else{
            req.flash('success', 'Item deleted successfully')
            res.redirect('back')
        }
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

//ADD NURSE NOTE
router.route('/add-nurse-note')
    .get(middleware.isLoggedIn, (req, res, next) => {
        User.find({}, (err, users)=>{
            if(err) return next(err)
            res.render('app/add/add_nurse_note', {users})
        })
    })
    .post(middleware.isLoggedIn, (req, res, next) => {
        const nursenote = new NurseNote({
            creator: req.user._id,
            patient: req.body.patient,
            name: req.body.name,
            note: req.body.note
        })
        nursenote.save((err)=>{
            if(err) return next(err)
            req.flash('success', 'Note added successfully!')
            res.redirect('/add-nurse-note')
        })
        
    })

//VIEW NURSIN NOTES
router.get('/nursing-notes', middleware.isLoggedIn, (req, res, next)=>{
    NurseNote.find({})
    .populate('patient')
    .populate('creator')
    .exec((err, nursenotes)=>{
        if(err) return next (err)
        res.render('app/view/nursing_note', { nursenotes })
    })
})

//ADD NURSE CARE PLAN
router.route('/add-nursing-care-plan')
    .get(middleware.isLoggedIn, (req, res, next) => {
        User.find({}, (err, users)=>{
            if(err) return next(err)
            res.render('app/add/add_nursing_care_plan', {users})
        })
    })
    .post(middleware.isLoggedIn, (req, res, next) => {
        const careplan = new Careplan({
            creator: req.user._id,
            patient: req.body.patient,
            diagnosis: req.body.diagnosis,
            objective: req.body.objective,
            action: req.body.action,
            scientificprinciple: req.body.scientificprinciple,
            evaluation: req.body.evaluation,
        })
        careplan.save((err)=>{
            if(err) return next(err)
            req.flash('success', 'Nursin care plan added successfully!')
            res.redirect('back')
        })
        
    })

//NURSING CARE PLANS
router.get('/nursing-care-plan', middleware.isLoggedIn, (req, res, next)=>{
    Careplan.find({})
    .populate('creator')
    .exec((err, careplans)=>{
        if(err) return next (err)
        res.render('app/view/nursing_care_plan', { careplans })
    })
})

//INTAKE AND OUTPUT CHART
router.route('/ward-inventory')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        WardInventory.find({})
        .populate('creator')
        .exec((err, wardInventory)=>{
            if(err) return next(err)
            res.render('app/add/ward_inventory', {wardInventory})
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const wardinventory = new WardInventory({
            creator: req.user._id,
            item: req.body.item,
            quantity: req.body.quantity,
            consumed: req.body.consumed,
            balance: req.body.balance,
            comments: req.body.comments,
            status: true
        })
        wardinventory.save((err)=>{
            if(err) return next(err)
            req.flash('success', 'Inventory saved successfully')
            res.redirect('back')
        })
    })


//WARD INVENTORY
//INTAKE AND OUTPUT CHART
router.route('/intake-output-chart/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({_id: req.params.id}, (err, user)=>{
            if(err) return next(err)
            res.render('app/add/io_chart', {user})
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const iochart = new Iochart({
            creator: req.user._id,
            patient: req.body.patient,
            oral: req.body.oral,
            rectal: req.body.rectal,
            intraveneous: req.body.intraveneous,
            insulin: req.body.insulin,
            intotal: req.body.intotal,
            urine: req.body.urine,
            gastricContents: req.body.gastricContents,
            fistula: req.body.fistula,
            total: req.body.total,
            notes: req.body.notes,
            status: true
        })
        iochart.save((err)=>{
            if(err) return next(err)
            User.updateOne(
                {
                    _id: iochart.patient
                },
                {
                    $push: {iocharts: iochart._id}
                },function(err, count){
                    if(err) return next(err)
                    req.flash('success', 'Intake & Output chart saved successfully')
                    res.redirect('/addmitted-patients')
                }
            )
        })
    })


//ADD TREATMENT RECORD
router.route('/treatment-records')
    .get(middleware.isLoggedIn, (req, res, next) => {
        Treatment.find({})
        .populate('patient')
        .populate('creator')
        .populate('drugs')
        .exec((err, treatments)=>{
            if(err) return next(err)
            User.find({}, (err, users)=>{
                if(err) return next(err)
                Drug.find({}, (err, drugs)=>{
                    if(err) return next(err)
                    res.render('app/add/add_treatment_record', {users, treatments, drugs})
                })
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next) => {
        const treatment = new Treatment({
            creator: req.user._id,
            patient: req.body.patient,
            dosage: req.body.dosage,
            drugs: req.body.drug,
            treatmenttype: req.body.treatment,
            description: req.body.description,
        })
        treatment.save((err)=>{
            if(err) return next(err)
           
            User.updateOne(
                {
                    _id: treatment.patient
                },
                {
                    $push: {treatments: treatment._id}
                }, function (err, count) {
                    if(err) return next(err)
                    req.flash('success', 'Treatment record added successfully!')
                    res.redirect('back')
                }
            )
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
            if (Array.isArray(req.body.service)){
                var services = req.body.service;
                var allservices = services.map(s => mongoose.Types.ObjectId(s))
                payment.services = allservices;
            }else{
                payment.services = req.body.service;
            }
            payment.modeofpayment = req.body.modeofpayment;
            payment.comment = req.body.comment;
            
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

//ATTENDING TO PATIENT NOT ON APPOINTMENT
router
  .route("/attending-to-patient/:id")
  .get(middleware.isLoggedIn, (req, res, next) => {
    Lab.find({}, (err, labs) => {
      if (err) {
        return next(err);
      }
      User.findOne({ _id: req.params.id })
        .populate("triages")
        .populate("consultations")
        .populate("appointments")
        .populate("retainershipname")
        .exec((err, user) => {
          if (err) {
            return next(err);
          }

          res.render("app/add/attending_to_patient", {
            user,
          });
        });
    });
  })
  .post(middleware.isLoggedIn, (req, res, next) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
      if (err) {
        return next(err);
      }
      Triage.findOne({ _id: user.triages[user.triages.length - 1] }, function(
        err,
        triage
      ) {
        if (err) {
          return next(err);
        }
        const consultation = new Consultation({
          doctor: req.user._id,
          patient: req.params.id,
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
        });
        consultation.save(err => {
          if (err) return next(err);
          triage.taken = true;
          triage.save();
          User.updateOne(
            {
              _id: req.params.id
            },
            {
              $push: { consultations: consultation._id }
            },
            function(err, count) {
              if (err) {
                return next(err);
              }
              req.flash("success", "Patient Investiation saved Successfully!");
              res.redirect("/edit-consultation/" + consultation._id);
            }
          );
        });
      });
    });
  });


//ADD PATIENT CONSULTATION
router
  .route("/consultation/:id")
  .get(middleware.isLoggedIn, (req, res, next) => {
    User.findOne({ _id: req.params.id })
      .populate("triages")
      .populate("consultations")
      .populate("appointments")
      .populate("retainershipname")
      .exec((err, user) => {
        if (err) {
          return next(err);
        }
        res.render("app/add/add_patient_consultation", {
          user
        });
      });
  })
  .post(middleware.isLoggedIn, (req, res, next) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
      if (err) return next(err);
      Appointment.findOne(
        { _id: user.appointments[user.appointments.length - 1]._id },
        function(err, appointment) {
          if (err) return next(err);
          const consultation = new Consultation({
            doctor: req.user._id,
            patient: req.params.id,
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
          });
          consultation.save(err => {
            if (err) return next(err);
            appointment.taken = true;
            appointment.save();
          });
          User.updateOne(
            {
              _id: req.params.id
            },
            {
              $push: { consultations: consultation._id }
            },
            function(err, count) {
              if (err) {
                return next(err);
              }
              req.flash("success", "Patient Consultation saved Successfully!");
              res.redirect("/edit-consultation/" + consultation._id);
            }
          );
        }
      );
    });
  });

//Editing consultation
router
  .route("/edit-consultation/:id")
  .get(middleware.isLoggedIn, (req, res, next) => {
    Consultation.findOne({ _id: req.params.id })
      .deepPopulate([
        "drugsObject.drugs.name.pharmname",
        "drugsObject.nhisdrugs.name.pharmname",
        "drugsObject.prescribedBy",
        "labtestObject.tests.lab",
        "labtestObject.tests",
        "imaging.images",
        "imaging.investigation",
        "patient.triages",
        "patient.retainershipname",
      ])
      .exec((err, consultation) => {
          Lab.find({})
            .populate("tests")
            .exec((err, labs) => {
              let alltests = [];
              labs.forEach(lab => {
                lab.tests.forEach(tetest => {
                  alltests.push({
                    name: tetest.name,
                    id: tetest._id
                  });
                });
              });
              Imaging.find({}, (err, imaging) => {
                User.findOne({ _id: consultation.patient })
                  .populate("triages")
                  .populate("consultations")
                  .populate("retainership")
                  .exec((err, user) => {
                    var mysort = { name: -1 };
                    LocalInventory.find({})
                      .sort(mysort)
                      .deepPopulate("name.pharmname")
                      .exec((err, locals) => {
                        NhisOpdInventory.find({})
                        .sort(mysort)
                        .deepPopulate("name.pharmname")
                        .exec((err, nhisDrugs)=>{
                            res.render("app/add/edit_consultation", {
                              consultation,
                              labs,
                              imaging,
                              alltests,
                              user,
                              locals,
                              nhisDrugs
                            });
                        })
                      });
                  });
              });
            });
      });
  })
  .post(middleware.isLoggedIn, (req, res, next) => {
    Consultation.findOne({ _id: req.params.id }, (err, foundConsultation) => {
      if (req.body.visit) foundConsultation.visit = req.body.visit;
      if (req.body.diagnosis) foundConsultation.diagnosis = req.body.diagnosis;
      if (req.bodytreatment) foundConsultation.treatment = req.body.treatment;
      if (req.body.observation)
        foundConsultation.physical.observation = req.body.observation;
      if (req.body.chest) foundConsultation.physical.chest = req.body.chest;
      if (req.body.cvs) foundConsultation.physical.cvs = req.body.cvs;
      if (req.body.abdomen)
        foundConsultation.physical.abdomen = req.body.abdomen;
      if (req.body.mss) foundConsultation.physical.mss = req.body.mss;
      if (req.body.other) foundConsultation.physical.abdomen = req.body.other;
      foundConsultation.save(err => {
        if (err) {
          req.flash("error", "Error saving patient examination");
          return res.redirect("back");
        } else {
          req.flash("success", "Successfully saved patient examination");
          return res.redirect("back");
        }
      });
    });
  });


//ADD PATIENT LAB TEST
router.post('/labtest/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({ _id: req.params.id })
        .populate('consultations')
        .exec((err, user)=>{
            if(err) return next (err)
            Consultation.findOne({ _id: user.consultations[user.consultations.length -1]._id }, (err, foundconsultation)=>{
                if(err) {
                    req.flash('error', 'Error, please create a consultation first!')
                    return res.redirect('back')
                }
                const paid = new Paid({
                    lab: req.body.labtest,
                    patient: req.params.id
                })
                paid.save((err)=>{
                    if(err) return next(err)
                    if(req.body.labtype) foundconsultation.labtype = req.body.labtype;
                    if(req.body){
                        foundconsultation.labtestObject.push({
                            tests: req.body.labtest,
                            price: req.body.price,
                            labtype: req.body.labtype,
                            paid: paid
                        })
                    }
                    foundconsultation.labstatus = true;
                    foundconsultation.save((err)=>{
                        if(err) {
                            req.flash('error', err.message)
                            return res.redirect('back')
                        }
                        req.flash('success', 'Patient sent for test successfully')
                        res.redirect('back')
                    })
                })
                    // var tests = req.body.labtest
                    // var alltests = tests.map(s => mongoose.Types.ObjectId(s))
                    // consultation.labtestObject.push(req.body.labtest);
           
                // consultation.labtestObject.push(req.body.labtest)
            })
        })
})



//ADD PATIENT PRESCRIPTION
router.post('/prescription/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({ _id: req.params.id })
        .populate('consultations')
        .exec((err, user)=>{
            if(err) return next (err)
            Consultation.findOne({ _id: user.consultations[user.consultations.length -1]._id }, (err, theconsultation)=>{
                if(err) {
                    req.flash('error', 'Error Prescribing, please create a consultation first!')
                    return res.redirect('back')
                }
                // // if(req.body.drug_brand) consultation.drug.push(req.body.drug_brand);
                // if(req.body.drug_name) consultation.drugname = req.body.drug_name;
                const paid = new Paid({
                    drugs: req.body.drug_brand,
                    price: req.body.price,
                    patient: req.params.id
                })
                paid.save((err)=>{
                    if(err) return next (err)
                    if(req.body){
                        theconsultation.drugsObject.push({
                            paid: paid,
                            drugs: req.body.drug_brand,
                            nhisdrugs: req.body.nhis_drug_brand,
                            startingdate: req.body.startingdate,
                            quantity: req.body.quantity,
                            dispense: req.body.dispense,
                            medicineunit: req.body.medicineunit,
                            unit: req.body.unit,
                            dose: req.body.dose,
                            time: req.body.time,
                            notes: req.body.notes,
                            direction: req.body.direction,
                            duration: req.body.duration,
                            price: req.body.price,
                            prescribedBy: req.user._id,
                        })
                        theconsultation.prescriptionDate = Date.now()
                        theconsultation.pharmacystatus = true;
                        theconsultation.status = true;
                    }
                    theconsultation.save((err)=>{
                        if(err) {
                            req.flash('error', err.message)
                            return res.redirect('back')
                        }
                        res.redirect('back')
                    })
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
            Consultation.findOne({ _id: user.consultations[user.consultations.length -1]._id }, (err, consultation)=>{
                if(err) {
                    req.flash('error', 'Error, please create a consultation first!')
                    return res.redirect('back')
                }
                const paid = new Paid({
                    imaging: req.body.image,
                    patient: req.params.id
                })
                paid.save((err)=>{
                    if(err) return next(err)
                    // if (Array.isArray(req.body.image)){
                    //     let images = req.body.image;
                    //     let allImaging = images.map(v => mongoose.Types.ObjectId(v))
                    //     consultation.imaging = allImaging
                    // }else{
                    //     consultation.imaging = req.body.image
                    // }
                    if(req.body){
                        consultation.imaging.push({
                            images: req.body.image,
                            paid: paid,
                            investigation: req.body.investigation,
                            price: req.body.price
                        })
                    }
                    consultation.imagingdate = Date.now()
                    consultation.imagingstatus = true;
                    consultation.save((err)=>{
                        if(err) return next (err)
                        res.redirect('back')
                    })
                })
            })
        })
})

router.get('/test', middleware.isLoggedIn, (req, res)=>{
    res.render('app/add/test')
})

//Add Pharmacy Prescription
router.get('/pharmacy-prescription/:id', middleware.isLoggedIn, (req, res, next)=>[
    User.findOne({_id: req.params.id})
        .exec((err, user)=>{
            LocalInventory.find({})
                .deepPopulate('name.pharmname')
                .exec((err, drugs)=>{
                    res.render('app/add/pharmacy_prescription', {drugs, user})
                })
        })
])


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

//DRUGS PRESCRIBED BY PHARMACY
router.post('/imaging-done', middleware.isLoggedIn, (req, res, next)=>{
    let imaging = req.body.imaging
    let comment = req.body.comment
    Consultation.findOne({_id: imaging}, (err, consultation)=>{
        if(err) return next (err)
        consultation.imagingfinish = true;
        consultation.imagingresult = comment;
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
    .populate('retainershipname')
    .populate('registeredby')
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
                    'id': user._id,
                    'retainershipname': user.retainershipname,
                    'registeredby': user.registeredby,
                    'gender': user.gender,
                    'photo': user.photo,
                    'religion': user.religion,
                    'birthday': user.birthday,
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
    }).sort('-createdAt')
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
        .populate('creator')
        .exec((err, triages)=>{
            if(err) return next (err)
            res.render('app/view/triages', { triages })
        })
})

//VIEW ALL CONSULTATIONS
router.get('/consultations', middleware.isLoggedIn, (req, res, next)=>{
    Consultation.find({}) 
    .sort('-updatedAt')
    .populate('patient')
    .populate('labtestObject.tests')
    // .populate('drugsObject')
    .deepPopulate([
        'drugsObject.drugs', 
        'drugsObject.prescribedBy', 
        'drugsObject.drugs.name.pharmname',
        "drugsObject.nhisdrugs.name.pharmname",
        'imaging.investigation', 
        'patient.retainershipname'
    ])
    .exec((err, consultations)=>{
        console.log(consultations)
        if(err) return next (err)
        res.render('app/view/consultations', { consultations })
    })
})

//VIEW WARD TRIAGE
router.get('/nurse-report-triage/:id', middleware.isLoggedIn, (req, res, next)=>{
    NurseReport.find({_id: req.params.id})
    .sort('-created')
    .populate('patient')
    .exec((err, nursereports)=>{
        if(err) return next (err)
        res.render('app/view/patient_ward_triage', { nursereports })
    })
})

//IMMUNIZATION
router.route('/add-immunization/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({_id: req.params.id})
        .populate('appointments')
        .exec((err, user)=>{
            if(err) return next(err)
            // Appointment.findOne({_id: user.appointments[ user.appointments.length -1]._id}, (err, appointment)=>{
            //     appointment.taken = true;
                // appointment.save((err)=>{
                //     if(err) return next(err)
                    res.render('app/add/add_immunization', {user})
                // })
            // })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({_id: req.params.id}, (err, user)=>{
            Appointment.findOne({_id: user.appointments[ user.appointments.length -1]._id}, (err, appointment)=>{
                const immunization = new Immunization({
                    patient: req.body.patient,
                    creator: req.user._id,
                    name: req.body.name,
                    dateofbirth: req.body.dateofbirth,
                    birthweight: req.body.birthweight,
                    placeofbirth: req.body.placeofbirth,
                    address: req.body.address,
                    atBirth: req.body.atBirth,
                    at6weeks: req.body.at6weeks,
                    at10weeks: req.body.at10weeks,
                    at14weeks: req.body.at14weeks,
                    at6months: req.body.at6months,
                    at9months: req.body.at9months,
                    at1year: req.body.at1year,
                    at15months: req.body.at15months,
                    at2years: req.body.at2years,
                })
                immunization.save((err)=>{
                    if(err) return next (err)
                    appointment.taken = true;
                    appointment.save()
                    User.updateOne(
                        {
                            _id: immunization.patient
                        },
                        {
                            $push: { immunizations: immunization._id }
                        },function (err, count) {
                            if(err) return next (err)
                            req.flash('success', 'Patient Immunization saved successfully!')
                            res.redirect('back')
                        }
        
                    )
                    
                })
            })
        })
        
    })

//VIEW IMMUNIZATION
router.get('/immunizations', middleware.isLoggedIn, (req, res, next)=>{
    Immunization.find({})
        .sort('-created')
        .populate('patient')
        .exec((err, immunizations)=>{
            if(err) return next (err)
            res.render('app/view/immunizations', {immunizations})
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
//     //         var fullPath = req.files.filename
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

router.get('/profile-test/:id', (req, res, next)=>{
        User.findOne({ _id: req.params.id})
        .populate('appointments')
        .populate('consultations')
        .populate('payments')
        .populate('triages')
        .populate('visits')
        .populate('reports')
        .populate('ancs')
        .populate('wardrounds')
        .populate('immunizations')
        .populate('retainershipname')
    
        .deepPopulate([
            'appointments.doctor',
            'consultations.drusObject',
            'consultations.doctor',
            'consultations.labtestObject',
            'consultations.drugsObject.drugs',
            'consultations.drugsObject.drugs.name.pharmname',
            'payments.services',
            'ancs.delivery.midwife',
            'ancs.postnatal.nurse',
            'reports.doctor',
            'reports.creator',
            'wardrounds.doctor',
            'wardrounds.creator'
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

//ADDMITTED PATIENTS
router.get('/addmitted-patients', middleware.isLoggedIn, (req, res, next)=>{
    User.find({}, (err, users)=>{
        if(err) {return next (err)}
        
        res.render('app/view/addmitted_patient', { users })
    }).sort('-updatedAt')
})

//DISCHARGED PATIENTS
router.get('/discharged-patients', middleware.isLoggedIn, (req, res, next)=>{
    User.find({}, (err, users)=>{
        if(err) {return next (err)}
        res.render('app/view/discharged_patient', { users })
    }).sort('-updatedAt')
})

//DISCHARGE FORM
router.route('/patient-discharge/:id')
.get(middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id}, (err, user)=>{
        User.find({}, (err, users)=>{
            if(err) {return next (err)}
            res.render('app/add/discharge_patient', { users, user })
        })
    })
    
})
.post(middleware.isLoggedIn, (req, res, next)=>{
    const discharge = new Discharge({
        patient: req.params.id,
        dischargetype: req.body.dischargetype,
        thedate: req.body.thedate,
        time: req.body.time,
        nurse: req.body.nurse,
        comment: req.body.comments,
        ward: req.body.ward,
        transferto: req.body.transferto
    })
    discharge.save((err)=>{
        if(err){
            req.flash('error', 'Error saving discharge form')
            return res.redirect('back')
        }
       
        User.update(
            {
                _id: req.params.id
            },
            {
                $set: {
                    discharge: true,
                },
                
            },
            function(err, count){
                req.flash('success', 'Discharge form saved successfully!')
                res.redirect('/addmitted-patients')
            }
        )
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
        .populate('reports')
        .populate('ancs')
        .populate('files')
        .populate('wardrounds')
        .populate('immunizations')
        .populate('retainershipname')
       
        .deepPopulate([
            'appointments.doctor',
            'consultations.drusObject',
            'consultations.doctor',
            'consultations.labtestObject',
            'consultations.drugsObject.drugs',
            'consultations.drugsObject.drugs.name.pharmname',
            'payments.services',
            'ancs.delivery.midwife',
            'ancs.postnatal.nurse',
            'reports.doctor',
            'reports.creator',
            'wardrounds.doctor',
            'wardrounds.creator'
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
        res.render('app/view/profile_updated', { patient, age })
    })
})

//VIEW LAB RESULT
router.get('/lab-result/:id', middleware.isLoggedIn, (req, res, next)=>{
    Consultation.findOne({_id: req.params.id})
    .populate('patient')
    .populate('labtestObject')
    .exec((err, consultation)=>{
        if(err) return next (err)
        res.render('app/view/lab_result', { consultation })
    })
})

// VIEW IMAGING RESULT

router.get('/imaging-result/:id', middleware.isLoggedIn, (req, res, next)=>{
    Consultation.findOne({_id: req.params.id})
    .populate('patient')
    .exec((err, consultation)=>{
        if(err) return next (err)
        res.render('app/view/imaging_result', { consultation })
    })
})

//VIEW ANTENATAL LAB RESULT
router.get('/antenatal-lab-result/:id', middleware.isLoggedIn, (req, res, next)=>{
    ANC.findOne({_id: req.params.id})
    .populate('patient')
    .populate('labtest')
    .exec((err, ancs)=>{
        if(err) return next (err)
        res.render('app/view/antenatal_lab_result', { ancs })
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
            visit.ward = req.body.ward;
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
                    $push:{visits: visit._id},
                    $set: {addmitted: true, ward: visit.ward}
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
            .populate('pharmname')
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
            labitem: req.body.item,
            pharmitem: req.body.pitem,
            // item: req.body.item,
            unit: req.body.unit,
            quantity: req.body.quantity,
            department: req.body.department,
            requestedby: req.user._id,
            comment: req.body.comment,
        })
        request.save((err)=>{
            if(err) return next (err)
            req.flash('success', 'Request was sent successfully')
            res.redirect('back')
        })
    })

//MAKING REQUEST TO MANAGER 
router.route('/make-manager-request')
    .get(middleware.isLoggedIn, (req, res, next) => {
        PharmacyItem.find({})
            .exec((err, pharmitems)=>{
            if(err) {return next (err)}
            labItem.find({}, (err, labitems)=> {
                if(err) {return next (err)}
                Department.find({}, (err, departments)=>{
                    if(err) {return next (err)}
                    ManagerRequest.find({requestedby: req.user._id})
                    .populate('requestedby')
                    .exec((err, managerrequests)=>{
                        res.render('app/add/make_manager_request', { pharmitems, labitems, departments, managerrequests })
                    })
                })
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const managerrequest = new ManagerRequest({
            item: req.body.item,
            unit: req.body.unit,
            quantity: req.body.quantity,
            department: req.body.department,
            requestedby: req.user._id,
            comment: req.body.comment,
        })
        managerrequest.save((err)=>{
            if(err) return next (err)
            req.flash('success', 'Request was sent successfully')
            res.redirect('back')
        })
    })

//MAKING Card REQUEST TO MANAGER 
router.route('/make-card-request')
    .get(middleware.isLoggedIn, (req, res, next) => {
        
        ManagerRequest.find({requestedby: req.user._id})
        .populate('requestedby')
        .exec((err, managerrequests)=>{
            res.render('app/add/make_card_request', { managerrequests })
        })
        
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const managerrequest = new ManagerRequest({
            item: req.body.item,
            quantity: req.body.quantity,
            leftover: req.body.leftover,
            requestedby: req.user._id,
            comment: req.body.comment,
        })
        managerrequest.save((err)=>{
            if(err) return next (err)
            req.flash('success', 'Request was sent successfully')
            res.redirect('back')
        })
    })

//APPROVING MANAGER REQUEST
router.post('/manager-approve-request', middleware.isLoggedIn, (req, res, next)=>{
    const approval = req.body.approval

    ManagerRequest.findOne({ _id: approval}, (err, request)=>{
        if(err) return next (err)
        request.granted = true;
        request.save((err)=>{
            if(err) {
                req.flash('error', 'Error granting request')
                res.redirect('back')
            }
            req.flash('success', 'Request was granted successfully')
            res.redirect('back')
        })
    })
})

//DECLINING MANAGER REQUEST
router.post('/manager-decline-request', middleware.isLoggedIn, (req, res, next)=>{
    const denial = req.body.denial
    ManagerRequest.findOne({_id: denial}, (err, request)=>{
        if(err) return next (err)
        request.declined = true;
        request.save((err)=>{
            if(err) return next (err)
            req.flash('success', 'Request was declined successfully')
            res.redirect('/dashboard')
        })
    })
})

//APPROVING REQUEST
router.post('/approve-request', middleware.isLoggedIn, (req, res, next)=>{
    const approve = req.body.approve 
    Request.findOne({ _id: approve }, (err, request)=>{
            request.granted = true;
            request.save((err)=>{
                if(err) {
                    req.flash('error', 'Error granting request')
                    res.redirect('back')
                }
                req.flash('success', 'Request was granted successfully')
                res.redirect('/dashboard')
            })
    })
})

//DECLINING REQUEST
router.post('/decline-request', middleware.isLoggedIn, (req, res, next)=>{
    const decline = req.body.decline 
    Request.findOne({_id: decline}, (err, request)=>{
        if(err) return next (err)
        request.declined = true;
        request.save((err)=>{
            if(err) return next (err)
            req.flash('success', 'Request was declined successfully')
            res.redirect('/dashboard')
        })
    })
})

//ADD LAB ITEMS
router.route('/add-lab-items')
   .get(middleware.isLoggedIn, (req, res, next)=>{
       User.find({}, (err, users)=>{
        if(err) return next (err)
        res.render('app/add/add_lab_item', {users})
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
       item.productcode = req.body.productcode;
       item.shelf = req.body.shelf;
       item.shelfno = req.body.shelfno;
       item.voucher = req.body.voucher;
       item.batch = req.body.batch;
       item.loss = req.body.loss;
       item.batch = req.body.batch;
       item.balance = req.body.balance;
       item.remarks = req.body.remarks;
       item.expiration = req.body.expiration;
       item.vendor = req.body.vendor;
       item.received = req.body.received;
       item.save((err)=>{
           if(err){
               req.flash('error', err.message)
            return res.redirect('/add-lab-items')
           }
           req.flash('success', 'Item was added!')
           res.redirect('back')
       })
    })
})

// Edit Lab item

router.route('/edit-lab-item/:id')
   .get(middleware.isLoggedIn, (req, res, next)=>{
       labItem.findOne({ _id: req.params.id })
       .exec((err, item)=>{
               User.find({role: 17}, (err, users)=>{
                   if(err) return next (err)
                   res.render('app/add/edit_lab_item', {users, item})
               })
       })
   }) 
   .post(middleware.isLoggedIn, (req, res, next)=>{
        labItem.findOne({_id: req.params.id})
        .exec((err, item)=>{
        if(err) return next (err)
            if(item) {
                if (req.body.name) item.name = req.body.name;
                if (req.body.description) item.description = req.body.description;
                if (req.body.price) item.price = req.body.price;
                if (req.body.unit) item.unit = req.body.unit;
                if (req.body.quantity) item.quantity = req.body.quantity;
                if (req.body.cost) item.cost = req.body.cost;
                if (req.body.productcode) item.productcode = req.body.productcode;
                if (req.body.shelf) item.shelf = req.body.shelf;
                if (req.body.shelfno) item.shelfno = req.body.shelfno;
                if (req.body.voucher) item.voucher = req.body.voucher;
                if (req.body.batch) item.batch = req.body.batch;
                if (req.body.loss) item.loss = req.body.loss;
                if (req.body.batch) item.batch = req.body.batch;
                if (req.body.balance) item.balance = req.body.balance;
                if (req.body.remarks) item.remarks = req.body.remarks;
                if (req.body.expiration) item.expiration = req.body.expiration;
                if (req.body.vendor) item.vendor = req.body.vendor;
                if (req.body.received) item.received = req.body.received;
            }
            item.save((err)=>{
                if(err) return next(err)

                req.flash('success', 'Item was updated!')
                res.redirect('back') 
            })
        })
   })

// EDIT DRUGS TO LOCAL INVENTORY
router.route('/edit-inventory/:id')
   .get(middleware.isLoggedIn, (req, res, next)=>{
       PharmacyItem.find({}, (err, drugs)=>{
        if(err) return next (err)
            LocalInventory.findOne({_id: req.params.id })
            .populate('name') 
            .deepPopulate('name.pharmname') 
            .exec((err, item)=>{
                res.render('app/add/edit_local_inventory', { drugs, item })
            })
       })
   }) 
   .post(middleware.isLoggedIn, (req, res, next)=>{
    LocalInventory.findOne({_id: req.params.id }, (err, item)=>{
        if(item){
            if (req.body.name) item.name = req.body.name;
            if (req.body.price) item.price = req.body.price;
            if (req.body.unit) item.unit = req.body.unit;
            if (req.body.quantity) item.quantity = req.body.quantity;
            if (req.body.cost) item.cost = req.body.cost;
            if (req.body.productcode) item.productcode = req.body.productcode;
            if (req.body.shelf) item.shelf = req.body.shelf;
            if (req.body.shelfno) item.shelfno = req.body.shelfno;
            if (req.body.consumed) item.consumed = req.body.consumed;
            if (req.body.balance) item.balance = req.body.balance;
            if (req.body.comment) item.comment = req.body.comment;
            if (req.body.received) item.received = req.body.received;
            item.save((err)=>{
                if(err){
                    req.flash('error', err.message)
                 return res.redirect('back')
                }
                req.flash('success', 'Item was updated!')
                res.redirect('/inventory-list')
            })
        }
    })
    
   })

//    ADD DRUGGS TO LOCAL INVENTORY
   router.route('/add-to-inventory')
   .get(middleware.isLoggedIn, (req, res, next)=>{
       PharmacyItem.find({})
       .populate('pharmname')
       .exec((err, drugs)=>{
        if(err) return next (err)
        res.render('app/add/add_pharmacyitems_local_inventory', { drugs })
       })
   }) 
   .post(middleware.isLoggedIn, (req, res, next)=>{
       const item = new LocalInventory()
       item.creator = req.user._id;
       item.name = req.body.name;
       item.price = req.body.price;
       item.unit = req.body.unit;
       item.quantity = req.body.quantity;
       item.cost = req.body.cost;
       item.productcode = req.body.productcode;
       item.shelf = req.body.shelf;
       item.shelfno = req.body.shelfno;
       item.consumed = req.body.consumed;
       item.balance = req.body.balance;
       item.comment = req.body.comment;
       item.received = req.body.received;
       item.save((err)=>{
           if(err){
               req.flash('error', err.message)
            return res.redirect('back')
           }
           req.flash('success', 'Item was added!')
           res.redirect('back')
       })
    
   })

// PHARMACY LOCAL INVENTORY LIST
router.get('/inventory-list', middleware.isLoggedIn, (req, res, next)=>{
    LocalInventory.find({})
    .populate('creator')
    .populate('name')
    .deepPopulate('name.pharmname')
    .exec((err, items)=>{
        if(err){
            return next(err)
        }
        res.render('app/view/inventory_list', { items })
    })
})

//    ADD DRUGGS TO INPATIENT INVENTORY
router.route('/add-to-inpatient-inventory')
.get(middleware.isLoggedIn, (req, res, next)=>{
    PharmacyItem.find({})
    .populate('pharmname')
    .exec((err, drugs)=>{
     if(err) return next (err)
     res.render('app/add/add_pharmacyitems_inpatient_inventory', { drugs })
    })
}) 
.post(middleware.isLoggedIn, (req, res, next)=>{
    const item = new InPatient()
    item.creator = req.user._id;
    item.name = req.body.name;
    item.price = req.body.price;
    item.unit = req.body.unit;
    item.quantity = req.body.quantity;
    item.cost = req.body.cost;
    item.productcode = req.body.productcode;
    item.shelf = req.body.shelf;
    item.shelfno = req.body.shelfno;
    item.consumed = req.body.consumed;
    item.balance = req.body.balance;
    item.comment = req.body.comment;
    item.received = req.body.received;
    item.save((err)=>{
        if(err){
            req.flash('error', err.message)
         return res.redirect('back')
        }
        req.flash('success', 'Item was added!')
        res.redirect('back')
    })
 
})

// PHARMACY INPATIENT INVENTORY LIST
router.get('/inpatient-inventory-list', middleware.isLoggedIn, (req, res, next)=>{
    InPatient.find({})
    .populate('creator')
    .populate('name')
    .deepPopulate('name.pharmname')
    .exec((err, items)=>{
        if(err){
            return next(err)
        }
        res.render('app/view/inpatient_inventory_list', { items })
    })
})

// EDIT DRUGS TO LOCAL INVENTORY
router.route('/edit-inpatient-inventory/:id')
   .get(middleware.isLoggedIn, (req, res, next)=>{
       PharmacyItem.find({}, (err, drugs)=>{
        if(err) return next (err)
            InPatient.findOne({_id: req.params.id })
            .populate('name') 
            .deepPopulate('name.pharmname') 
            .exec((err, item)=>{
                res.render('app/add/edit_inpatient_inventory', { drugs, item })
            })
       })
   }) 
   .post(middleware.isLoggedIn, (req, res, next)=>{
    InPatient.findOne({_id: req.params.id }, (err, item)=>{
        if(item){
            if (req.body.name) item.name = req.body.name;
            if (req.body.price) item.price = req.body.price;
            if (req.body.unit) item.unit = req.body.unit;
            if (req.body.quantity) item.quantity = req.body.quantity;
            if (req.body.cost) item.cost = req.body.cost;
            if (req.body.productcode) item.productcode = req.body.productcode;
            if (req.body.shelf) item.shelf = req.body.shelf;
            if (req.body.shelfno) item.shelfno = req.body.shelfno;
            if (req.body.consumed) item.consumed = req.body.consumed;
            if (req.body.balance) item.balance = req.body.balance;
            if (req.body.comment) item.comment = req.body.comment;
            if (req.body.received) item.received = req.body.received;
            item.save((err)=>{
                if(err){
                    req.flash('error', err.message)
                 return res.redirect('back')
                }
                req.flash('success', 'Item was updated!')
                res.redirect('/inpatient-inventory-list')
            })
        }
    })
    
   })


//NHIS OUTPATIENT INVENTORY LIST
router.get('/nhis-outpatient-inventory-list', middleware.isLoggedIn, (req, res, next)=>{
    NhisOpdInventory.find({})
    .populate('creator')
    .populate('name')
    .deepPopulate('name.pharmname')
    .exec((err, items)=>{
        if(err){
            return next(err)
        }
        res.render('app/view/nhis_outpatient_inventory', { items })
    })
})

// EDIT DRUGS TO NHIS OUTPATIENT INVENTORY
router.route('/edit-nhis-outpatient-inventory/:id')
   .get(middleware.isLoggedIn, (req, res, next)=>{
       PharmacyItem.find({}, (err, drugs)=>{
        if(err) return next (err)
            NhisOpdInventory.findOne({_id: req.params.id })
            .populate('name') 
            .deepPopulate('name.pharmname') 
            .exec((err, item)=>{
                res.render('app/add/edit_nhis_outpatient_inventory', { drugs, item })
            })
       })
   }) 
   .post(middleware.isLoggedIn, (req, res, next)=>{
    NhisOpdInventory.findOne({_id: req.params.id }, (err, item)=>{
        if(item){
            if (req.body.name) item.name = req.body.name;
            if (req.body.price) item.price = req.body.price;
            if (req.body.unit) item.unit = req.body.unit;
            if (req.body.quantity) item.quantity = req.body.quantity;
            if (req.body.cost) item.cost = req.body.cost;
            if (req.body.productcode) item.productcode = req.body.productcode;
            if (req.body.shelf) item.shelf = req.body.shelf;
            if (req.body.shelfno) item.shelfno = req.body.shelfno;
            if (req.body.consumed) item.consumed = req.body.consumed;
            if (req.body.balance) item.balance = req.body.balance;
            if (req.body.comment) item.comment = req.body.comment;
            if (req.body.received) item.received = req.body.received;
            item.save((err)=>{
                if(err){
                    req.flash('error', err.message)
                 return res.redirect('back')
                }
                req.flash('success', 'Item was updated!')
                res.redirect('/nhis-outpatient-inventory-list')
            })
        }
    })
    
   })


//NHIS INPATIENT INVENTORY LIST
router.get('/nhis-inpatient-inventory-list', middleware.isLoggedIn, (req, res, next)=>{
    NhisIpdInventory.find({})
    .populate('creator')
    .populate('name')
    .deepPopulate('name.pharmname')
    .exec((err, items)=>{
        if(err){
            return next(err)
        }
        res.render('app/view/nhis_inpatient_inventory', { items })
    })
})

// EDIT DRUGS TO NHIS INPATIENT INVENTORY
router.route('/edit-nhis-inpatient-inventory/:id')
   .get(middleware.isLoggedIn, (req, res, next)=>{
       PharmacyItem.find({}, (err, drugs)=>{
        if(err) return next (err)
            NhisIpdInventory.findOne({_id: req.params.id })
            .populate('name') 
            .deepPopulate('name.pharmname') 
            .exec((err, item)=>{
                res.render('app/add/edit_nhis_inpatient_inventory', { drugs, item })
            })
       })
   }) 
   .post(middleware.isLoggedIn, (req, res, next)=>{
    NhisIpdInventory.findOne({_id: req.params.id }, (err, item)=>{
        if(item){
            if (req.body.name) item.name = req.body.name;
            if (req.body.price) item.price = req.body.price;
            if (req.body.unit) item.unit = req.body.unit;
            if (req.body.quantity) item.quantity = req.body.quantity;
            if (req.body.cost) item.cost = req.body.cost;
            if (req.body.productcode) item.productcode = req.body.productcode;
            if (req.body.shelf) item.shelf = req.body.shelf;
            if (req.body.shelfno) item.shelfno = req.body.shelfno;
            if (req.body.consumed) item.consumed = req.body.consumed;
            if (req.body.balance) item.balance = req.body.balance;
            if (req.body.comment) item.comment = req.body.comment;
            if (req.body.received) item.received = req.body.received;
            item.save((err)=>{
                if(err){
                    req.flash('error', err.message)
                 return res.redirect('back')
                }
                req.flash('success', 'Item was updated!')
                res.redirect('/nhis-inpatient-inventory-list')
            })
        }
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
                if(labDispense.dispenseTo === 'Laboratory'){
                    LabInventory.findOne({name: labDispense.name }, (err, labitem)=>{
                        if(!labitem){
                             const newItem = new LabInventory({
                                 creator: req.user._id,
                                 name: labDispense.name,
                                 productcode: item.productcode,
                                 received: Date.now(),
                                 price: item. price,
                                 unit: labDispense.unit,
                                 quantity: labDispense.quantity,
                                 cost: item.cost,
                                 expiration: item.expiration,
                             })
                             newItem.save((err)=>{
                                 if(err) return next(err)
                             })
                        }else{
                            labitem.quantity+= labDispense.quantity
                            labitem.save((err)=>{
                             if(err) return next(err)
                            })
                        }
                    })
                }
                item.rquantity = labDispense.rquantity
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


//    ADD ITEMS TO LOCAL LAB INVENTORY
router.route('/add-to-lab-inventory')
.get(middleware.isLoggedIn, (req, res, next)=>{
    labItem.find({})
    .exec((err, items)=>{
     if(err) return next (err)
     res.render('app/add/add_items_locallab_inventory', { items })
    })
}) 
.post(middleware.isLoggedIn, (req, res, next)=>{
    const item = new LabInventory()
    item.creator = req.user._id;
    item.name = req.body.name;
    item.price = req.body.price;
    item.unit = req.body.unit;
    item.quantity = req.body.quantity;
    item.cost = req.body.cost;
    item.productcode = req.body.productcode;
    item.shelf = req.body.shelf;
    item.shelfno = req.body.shelfno;
    item.consumed = req.body.consumed;
    item.balance = req.body.balance;
    item.comment = req.body.comment;
    item.received = req.body.received;
    item.save((err)=>{
        if(err){
            req.flash('error', err.message)
         return res.redirect('back')
        }
        req.flash('success', 'Item was added!')
        res.redirect('back')
    })
 
})

// LOCAL LAB INVENTORY LIST
router.get('/lablocal-inventory-list', middleware.isLoggedIn, (req, res, next)=>{
    LabInventory.find({})
    .populate('creator')
    .exec((err, items)=>{
        if(err){
            return next(err)
        }
        res.render('app/view/lablocal_inventory_list', { items })
    })
})

// EDIT ITEMS TO LAB LOCAL INVENTORY
router.route('/edit-lablocal-inventory/:id')
   .get(middleware.isLoggedIn, (req, res, next)=>{
       labItem.find({}, (err, drugs)=>{
        if(err) return next (err)
            LabInventory.findOne({_id: req.params.id })
            .exec((err, item)=>{
                res.render('app/add/edit_lablocal_inventory', { drugs, item })
            })
       })
   }) 
   .post(middleware.isLoggedIn, (req, res, next)=>{
    LabInventory.findOne({_id: req.params.id }, (err, item)=>{
        if(item){
            if (req.body.name) item.name = req.body.name;
            if (req.body.price) item.price = req.body.price;
            if (req.body.unit) item.unit = req.body.unit;
            if (req.body.quantity) item.quantity = req.body.quantity;
            if (req.body.cost) item.cost = req.body.cost;
            if (req.body.productcode) item.productcode = req.body.productcode;
            if (req.body.shelf) item.shelf = req.body.shelf;
            if (req.body.shelfno) item.shelfno = req.body.shelfno;
            if (req.body.consumed) item.consumed = req.body.consumed;
            if (req.body.balance) item.balance = req.body.balance;
            if (req.body.comment) item.comment = req.body.comment;
            if (req.body.received) item.received = req.body.received;
            item.save((err)=>{
                if(err){
                    req.flash('error', err.message)
                 return res.redirect('back')
                }
                req.flash('success', 'Item was updated!')
                res.redirect('/lablocal-inventory-list')
            })
        }
    })
    
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
    PharmacyItem.findOne({_id: req.params.id})
    .populate('pharmname')
    .exec((err, item)=>{
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
            pharmDispense.name = req.params.id;
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

                if(pharmDispense.dispenseTo ===  'Outpatient Pharmacy'){
                   LocalInventory.findOne({name: pharmDispense.name }, (err, drug)=>{
                       if(!drug){
                            const newDrug = new LocalInventory({
                                creator: req.user._id,
                                name: pharmDispense.name,
                                productcode: item.productcode,
                                received: Date.now(),
                                price: item.sellprice,
                                unit: pharmDispense.unit,
                                quantity: pharmDispense.quantity,
                                cost: item.cost,
                                expiration: item.expiration,
                            })
                            newDrug.save((err)=>{
                                if(err) return next(err)
                            })
                       }else{
                           drug.quantity+= pharmDispense.quantity
                           drug.save((err)=>{
                            if(err) return next(err)
                           })
                       }
                   })
                } else if(pharmDispense.dispenseTo ===  'Inpatient Pharmacy'){
                    InPatient.findOne({name: pharmDispense.name }, (err, inDrug)=>{
                        if(!inDrug){
                             const inNewDrug = new InPatient({
                                 creator: req.user._id,
                                 name: pharmDispense.name,
                                 productcode: item.productcode,
                                 received: Date.now(),
                                 price: item.sellprice,
                                 unit: pharmDispense.unit,
                                 quantity: pharmDispense.quantity,
                                 cost: item.cost,
                                 expiration: item.expiration,
                             })
                             inNewDrug.save((err)=>{
                                 if(err) return next(err)
                             })
                        }else{
                            inDrug.quantity+= pharmDispense.quantity
                            inDrug.save((err)=>{
                             if(err) return next(err)
                            })
                        }
                    })
                } else if(pharmDispense.dispenseTo ===  'NHIS Outpatient'){
                    NhisOpdInventory.findOne({name: pharmDispense.name }, (err, nhisDrug)=>{
                        if(!nhisDrug){
                             const newNhisDrug = new NhisOpdInventory({
                                 creator: req.user._id,
                                 name: pharmDispense.name,
                                 productcode: item.productcode,
                                 received: Date.now(),
                                 price: item.sellprice,
                                 unit: pharmDispense.unit,
                                 quantity: pharmDispense.quantity,
                                 cost: item.cost,
                                 expiration: item.expiration,
                             })
                             newNhisDrug.save((err)=>{
                                 if(err) return next(err)
                             })
                        }else{
                            nhisDrug.quantity+= pharmDispense.quantity
                            nhisDrug.save((err)=>{
                             if(err) return next(err)
                            })
                        }
                    })
                } else if(pharmDispense.dispenseTo ===  'NHIS Inpatient'){
                    NhisIpdInventory.findOne({name: pharmDispense.name }, (err, nhisInDrug)=>{
                        if(!nhisInDrug){
                             const newNhisInDrug = new NhisIpdInventory({
                                 creator: req.user._id,
                                 name: pharmDispense.name,
                                 productcode: item.productcode,
                                 received: Date.now(),
                                 price: item.sellprice,
                                 unit: pharmDispense.unit,
                                 quantity: pharmDispense.quantity,
                                 cost: item.cost,
                                 expiration: item.expiration,
                             })
                             newNhisInDrug.save((err)=>{
                                 if(err) return next(err)
                             })
                        }else{
                            nhisInDrug.quantity+= pharmDispense.quantity
                            nhisInDrug.save((err)=>{
                             if(err) return next(err)
                            })
                        }
                    })
                }
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
                    res.redirect('back')
                }
            )
        }
        
    ])
   })

//PHARMACY DISPENSE HISTORY
router.get('/dispense-history/:id', middleware.isLoggedIn, (req, res, next)=>{
    PharmacyItem.findOne({_id: req.params.id})
    .sort('-dispensehistory')
    .populate('dispensehistory')
    .populate('pharmname')
    .deepPopulate([
        'dispensehistory.receivedBy', 
        'dispensehistory.creator', 
        'dispensehistory.dispenseTo',
    ])
    .exec((err, history)=>{
        if(err) return next(err)
        res.render('app/view/pharm_history', { history })
    })
})

//PHARMACY DISPENSE HISTORY
router.get('/pharmacy-requests', middleware.isLoggedIn, (req, res, next)=>{
    Consultation.find({})
    .sort('-created')
    .populate('patient')
    .populate('doctor')
    .populate('drugsObject.drugs')
    .exec((err, consultations)=>{
        if(err) return next(err)
        res.render('app/view/pharm_request', { consultations })
    })
})

//LAB DISPENSE HISTORY
router.get('/lab-dispense-history/:id', middleware.isLoggedIn, (req, res, next)=>{
    labItem.findOne({_id: req.params.id})
    .populate('dispensehistory')
    .deepPopulate(['dispensehistory.receivedBy', 'dispensehistory.creator', 'dispensehistory.dispenseTo'])
        .exec((err, history)=>{
        if(err) return next(err)
        res.render('app/view/lab_history', { history })
    })
})

//ADD PHARMACY  ITEMS
router.route('/add-pharmacy-items')
   .get(middleware.isLoggedIn, (req, res, next)=>{
    Drug.find({}, (err, drugs)=>{
        if(err) return next (err)
        User.find({role: 17}, (err, users)=>{
            if(err) return next (err)
            res.render('app/add/add_pharmacy_item', {drugs, users})
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
        item.pharmname = req.body.pharmname;
        item.description = req.body.description;
        item.price = req.body.price;
        item.unit = req.body.unit;
        item.quantity = req.body.quantity;
        item.cost = req.body.cost;
        item.income = req.body.income;
        item.productcode = req.body.productcode;
        item.shelf = req.body.shelf;
        item.shelfno = req.body.shelfno;
        item.voucher = req.body.voucher;
        item.batch = req.body.batch;
        item.loss = req.body.loss;
        item.batch = req.body.batch;
        item.balance = req.body.balance;
        item.remarks = req.body.remarks;
        item.expiration = req.body.expiration;
        item.vendor = req.body.vendor;
        item.sellprice = req.body.sell_price;
        item.received = req.body.received;
        item.save((err)=>{
            if(err) return next(err)
            req.flash('success', 'Item was added!')
            res.redirect('/add-pharmacy-items')
        })
    })
   })

// Edit Pharmacy item

router.route('/edit-pharmacy-item/:id')
   .get(middleware.isLoggedIn, (req, res, next)=>{
       PharmacyItem.findOne({ _id: req.params.id })
       .exec((err, item)=>{
           Drug.find({}, (err, drugs)=>{
               if(err) return next (err)
               User.find({role: 17}, (err, users)=>{
                   if(err) return next (err)
                   res.render('app/add/edit_pharm_item', {drugs, users, item})
               })
            })
       })
   }) 
   .post(middleware.isLoggedIn, (req, res, next)=>{
        PharmacyItem.findOne({_id: req.params.id})
        .exec((err, item)=>{
        if(err) return next (err)
        if(item) {
            if (req.body.name) item.name = req.body.name;
            if (req.body.description) item.description = req.body.description;
            if (req.body.price) item.price = req.body.price;
            if (req.body.unit) item.unit = req.body.unit;
            if (req.body.quantity) item.quantity = req.body.quantity;
            if (req.body.cost) item.cost = req.body.cost;
            if (req.body.income) item.income = req.body.income;
            if (req.body.productcode) item.productcode = req.body.productcode;
            if (req.body.shelf) item.shelf = req.body.shelf;
            if (req.body.shelfno) item.shelf = req.body.shelfno;
            if (req.body.voucher) item.voucher = req.body.voucher;
            if (req.body.batch) item.batch = req.body.batch;
            if (req.body.loss) item.loss = req.body.loss;
            if (req.body.batch) item.batch = req.body.batch;
            if (req.body.balance) item.balance = req.body.balance;
            if (req.body.remarks) item.remarks = req.body.remarks;
            if (req.body.expiration) item.expiration = req.body.expiration;
            if (req.body.vendor) item.vendor = req.body.vendor;
            if (req.body.sell_price) item.sellprice = req.body.sell_price;
            if (req.body.received) item.received = req.body.received;
        }


        item.save((err)=>{
            if(err) return next(err)
            LocalInventory.findOne({name: req.params.id}, (err, drug)=>{
              
                if(drug){
                    drug.price = item.sellprice
                    drug.save((err)=>{
                        if(err) return next (err)
                    })
                }else{
                    req.flash('success', 'Item saved, but not found in the Outpatient Dsipensary, Please check!')
                    res.redirect('back') 
                }
                InPatient.findOne({name: req.params.id}, (err, inDrug)=>{
                    if(err) return next (err)
                    if(inDrug){
                        inDrug.price = item.sellprice
                        inDrug.save((err)=>{
                            if(err) return next (err)
                            req.flash('success', 'Item was updated!')
                            res.redirect('back') 
                        })
                    }else{
                        req.flash('success', 'Item saved, but not found in the Inpatient Dispensary, Please check!')
                        res.redirect('back') 
                    }
                })
            })
            
        })
    })
   })


//ADD OPERATION NOTE
router.route('/add-operation-note')
   .get(middleware.isLoggedIn, (req, res, next)=>{
        User.find({}, (err, users)=>{
            if(err) return next (err)
            PharmacyItem.find({}, (err, drugs)=>{
                if(err) return next (err)
                res.render('app/add/add_theater_note', {users, drugs})
            })
        })
   })
   .post(middleware.isLoggedIn, (req, res, next)=>{
       const theater = new Theater()
        theater.patient = req.body.patient;
        theater.surgery = req.body.surgery;
        theater.indications = req.body.indications;
        theater.anaesthesia = req.body.anaesthesia;
        theater.surgeon = req.body.surgeon;
        if (Array.isArray(req.body.assistance)){
            var assistances = req.body.assistance;
            var allassitances = assistances.map(t => mongoose.Types.ObjectId(t))
            theater.assistance = allassitances;
        }else{
            theater.assistance = req.body.assistance;
        }
        theater.scrubnurse = req.body.scrubnurse;
        theater.anesthetist = req.body.anesthetist;
        theater.findings = req.body.findings;
        theater.procedure = req.body.procedure;
        theater.order = req.body.order
       theater.save((err)=>{
           if(err) return next(err)
           User.updateOne(
               {
                   _id: theater.patient
               },
               {
                   $push: {theaters: theater._id}
               },function (err, count) {
                if(err) return next(err)
                req.flash('success', 'Operation Notes saved Successfully!')
                res.redirect('/theater-prescription/'+ theater._id)
               }
           )
       })
   })

//Medication for Theater
router.route('/theater-prescription/:id')
        .get(middleware.isLoggedIn, (req, res, next)=>{
            Theater.findOne({ _id: req.params.id })
                .populate('patient')
                .populate('surgeon')
                .populate('scrubnurse')
                .populate('anesthetist')
                .populate('assistance')
                .deepPopulate('drugsObject.drugs')
                .exec((err, theater)=>{
                    if(err) return next (err)
                    PharmacyItem.find({}, (err, drugs)=>{
                        res.render('app/add/add_patient_operation_note', {theater, drugs})
                    })
                })
        })
        .post(middleware.isLoggedIn, (req, res, next)=>{
            Theater.findOne({_id: req.params.id}, (err, theater)=>{
                if(err) return next (err)
                if(req.body){
                    theater.drugsObject.push({
                        drugs: req.body.drug_brand,
                        startingdate: req.body.startingdate,
                        quantity: req.body.quantity,
                        medicineunit: req.body.medicineunit,
                        unit: req.body.unit,
                        dose: req.body.dose,
                        time: req.body.time,
                        notes: req.body.notes,
                        direction: req.body.direction,
                        duration: req.body.duration,
                        price: req.body.price,
                        dateprescribed: Date.now()
                    })
                }
                theater.save((err)=>{
                    if(err) return next (err)
                    req.flash('success', 'Drugs precription saved successfully')
                    res.redirect('back')
                })
            })
        })


//ADD ACCOUNT
router.route('/accounts')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.find({}, (err, users)=>{
            if(err) return next (err)
            Consultation.find({})
            .populate('patient')
            .deepPopulate([
                'drugsObject.drugs', 'labtestObject.tests', 'labtestObject.paid', 'drugsObject.paid',
                'patient.retainershipname', 'payment.drugs', 'payment.lab', 'payment.imaging', 'imaging.images',
                'imaging.investigation', 'drugsObject.drugs.name.pharmname',
            ])
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
                    modeofpayment: req.body.modeofpayment,
                    status: true
                })
                payment.save((err)=>{
                    if (err) return next(err)
                    
                    sgMail.setApiKey(process.env.SENDGRID_MAIL);
                    const msg = {
                        to: 'admin@doch.com.ng',
                        from: 'DOCH Account<noreply@doch.com.ng>',
                        subject: 'New Payment Made',
                        html: `<p>Hello Admin,\n\n  A new patient ${user.firstname} ${user.lastname} has just made the sum of ₦${payment.amount} for registration and consultation payment, Thank You.\n</p>`,
                    };
                    sgMail.send(msg);
                    unirest.post( 'https://api.smartsmssolutions.com/smsapi.php')
                    .header({'Accept' : 'application/json'})
                    .send({
                        'username': process.env.SMSSMARTUSERNAME,
                        'password': process.env.SMSSMARTPASSWORD,
                        'sender': process.env.SMSSMARTSENDERID,
                        'recipient' : `234${payment.patient.phonenumber}`,
                        'message' : `Dear ${user.firstname} ${user.lastname}, your payment of ₦${payment.amount} was received. Thanks for patronizing us. Stay well and get better soon.`,
                        'routing': 4,
                        
                    })
                    .end(function (response) {
                    });
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
    Payment.findOne({_id: approve})
    .populate('patient')
    .exec((err, payment)=>{
        if(err) return next (err)
        payment.status = true
        payment.save((err)=>{
            if(err) return next (err)
            sgMail.setApiKey(process.env.SENDGRID_MAIL);
            const msg = {
                to: 'admin@doch.com.ng',
                from: 'DOCH Account<noreply@doch.com.ng>',
                subject: 'New Payment Made',
                html: `<p>Hello Admin,\n\n  A new patient (${payment.patient.firstname} ${payment.patient.lastname}) has just made payment of ₦${payment.amount} for his/her  billings, Thank You.\n</p>`,
            };
            sgMail.send(msg);
            unirest.post( 'https://api.smartsmssolutions.com/smsapi.php')
            .header({'Accept' : 'application/json'})
            .send({
                'username': process.env.SMSSMARTUSERNAME,
                'password': process.env.SMSSMARTPASSWORD,
                'sender': process.env.SMSSMARTSENDERID,
                'recipient' : `234${payment.patient.phonenumber}`,
                'message' : `Dear ${payment.patient.firstname} ${payment.patient.lastname}, your payment of ₦${payment.amount} was received. Thanks for patronizing us. Stay well and get better soon.`,
                'routing': 4,
                
            })
            .end(function (response) {
            });
            res.redirect('back')
        })
    })
})

// //LAB TESTS PAYMENT
// router.post('/lab-test-payment', middleware.isLoggedIn, (req, res, next)=>{
//     let consultID = req.body.consultationId
//     let labamount = req.body.labamount
//     let modeofpayment = req.body.modeofpayment
//     Payment.findOne({ _id: consultID })
//     .populate('patient')
//     .exec(function (err, payment) {
//         if (err) return next(err)
//         payment.paid = true;
//         payment.type = 'Lab Test Payment';
//         payment.modeofpayment =  modeofpayment;
//         payment.status = true;
//         payment.amount = labamount;
//         payment.initiator= req.user._id;
//         payment.save((err)=>{
//             if (err) return next(err)
//             //Send email
//             sgMail.setApiKey(process.env.SENDGRID_MAIL);
//             const msg = {
//                 to: 'admin@doch.com.ng',
//                 from: 'DOCH Account<noreply@doch.com.ng>',
//                 subject: 'New Payment Made',
//                 html: `<p>Hello Admin,\n\n  A new patient (${payment.patient.firstname} ${payment.patient.lastname}) has just made payment of &#8358;${payment.amount} for his/her Lab tests , Thank You.\n</p>`,
//             };
//             sgMail.send(msg);
//             //Send SMS
//             //Sending SMS
//             unirest.post( 'https://api.smartsmssolutions.com/smsapi.php')
//             .header({'Accept' : 'application/json'})
//             .send({
//                 'username': process.env.SMSSMARTUSERNAME,
//                 'password': process.env.SMSSMARTPASSWORD,
//                 'sender': process.env.SMSSMARTSENDERID,
//                 'recipient' : `234${payment.patient.phonenumber}`,
//                 'message' : `Dear ${payment.patient.firstname} ${payment.patient.lastname}, your payment of ₦${payment.amount} was received. Thanks for patronizing us. Stay well and get better soon.`,
//                 'routing': 4,
                
//             })
//             .end(function (response) {
//                 console.log(response.body);
//             });
//             User.update(
//                 {
//                     _id: payment.patient
//                 },
//                 {
//                     $push:{payments: payment._id}
//                 },
//                 function (err, count) {
//                     if (err) return next(err)
//                     req.flash('success', 'Payment Made Approved')
//                     res.redirect('/dashboard')
//                 }
//             )
//         })
//     })
// })

//LAB TESTS PAYMENT
router.post('/lab-test-payment', middleware.isLoggedIn, (req, res, next)=>{
    let consultID = req.body.consultationId
    let labamount = req.body.labamount
    let modeofpayment = req.body.modeofpayment
    Consultation.findOne({ _id: consultID })
    .populate('patient')
    .exec(function (err, consult) {
        if (err) return next(err)
        consult.labpaid = true
        consult.save((err)=>{
            if (err) return next(err)
            const payment = new Payment({
                patient: consult.patient,
                amount: labamount,
                type: 'Lab Test Payment',
                initiator: req.user._id,
                modeofpayment: modeofpayment,
                status: true
            })
            payment.save((err)=>{
                if (err) return next(err)
                sgMail.setApiKey(process.env.SENDGRID_MAIL);
                const msg = {
                    to: 'admin@doch.com.ng',
                    from: 'DOCH Account<noreply@doch.com.ng>',
                    subject: 'New Payment Made',
                    html: `<p>Hello Admin,\n\n  A new patient (${consult.patient.firstname} ${consult.patient.lastname}) has just made the payment of ₦${payment.amount} for his/her lab test, Thank You.\n</p>`,
                };
                sgMail.send(msg);
                //Send SMS
                //Sending SMS
                unirest.post( 'https://api.smartsmssolutions.com/smsapi.php')
                .header({'Accept' : 'application/json'})
                .send({
                    'username': process.env.SMSSMARTUSERNAME,
                    'password': process.env.SMSSMARTPASSWORD,
                    'sender': process.env.SMSSMARTSENDERID,
                    'recipient' : `234${consult.patient.phonenumber}`,
                    'message' : `Dear ${consult.patient.firstname} ${consult.patient.lastname}, your payment of ₦${payment.amount} was received. Thanks for patronizing us. Stay well and get better soon.`,
                    'routing': 4,
                    
                })
                .end(function (response) {
                    //console.log(response.body);
                });
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

//IMAGING PAYMENT
router.post('/imaging-payment', middleware.isLoggedIn, (req, res, next)=>{
    let imagingId = req.body.imagingId
    let imagingAmount = req.body.imagingAmount
    let modeofpayment = req.body.modeofpayment
    Consultation.findOne({ _id: imagingId })
    .populate('patient')
    .exec(function (err, consult) {
        if (err) return next(err)
        consult.imagingpaid = true
        consult.save((err)=>{
            if (err) return next(err)
            const payment = new Payment({
                patient: consult.patient,
                amount: imagingAmount,
                type: 'Imaging Payment',
                initiator: req.user._id,
                modeofpayment: modeofpayment,
                status: true
            })
            payment.save((err)=>{
                if (err) return next(err)
                sgMail.setApiKey(process.env.SENDGRID_MAIL);
                const msg = {
                    to: 'admin@doch.com.ng',
                    from: 'DOCH Account<noreply@doch.com.ng>',
                    subject: 'New Payment Made',
                    html: `<p>Hello Admin,\n\n  A new patient (${consult.patient.firstname} ${consult.patient.lastname}) has just made the payment of ₦${payment.amount} for his/her imaging payment, Thank You.\n</p>`,
                };
                sgMail.send(msg);
                //Send SMS
                //Sending SMS
                unirest.post( 'https://api.smartsmssolutions.com/smsapi.php')
                .header({'Accept' : 'application/json'})
                .send({
                    'username': process.env.SMSSMARTUSERNAME,
                    'password': process.env.SMSSMARTPASSWORD,
                    'sender': process.env.SMSSMARTSENDERID,
                    'recipient' : `234${consult.patient.phonenumber}`,
                    'message' : `Dear ${consult.patient.firstname} ${consult.patient.lastname}, your payment of ₦${payment.amount} was received. Thanks for patronizing us. Stay well and get better soon.`,
                    'routing': 4,
                    
                })
                .end(function (response) {
                    //console.log(response.body);
                });
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

// router.post('/pharmacy-payment', middleware.isLoggedIn, (req, res, next)=>{
//     let pharmId = req.body.pharmId
//     let amount = req.body.amount
//     let modeofpayment = req.body.modeofpayment
//     Payment.findOne({ _id: pharmId })
//     .populate('patient')
//     .exec(function (err, payment) {
//         if (err) return next(err)
//         payment.paid = true;
//         payment.type = 'Drugs Payment';
//         payment.amount = amount;
//         payment.status = true;
//         payment.initiator = req.user._id;
//         payment.modeofpayment = modeofpayment
//         payment.save((err)=>{
//             if (err) return next(err)
//                 sgMail.setApiKey(process.env.SENDGRID_MAIL);
//                 const msg = {
//                     to: 'admin@doch.com.ng',
//                     from: 'DOCH Account<noreply@doch.com.ng>',
//                     subject: 'New Payment Made',
//                     html: `<p>Hello Admin,\n\n  A new patient (${payment.patient.firstname} ${payment.patient.lastname}) has just made the payment of &#8358;${payment.amount} for his/her drugs, Thank You.\n</p>`,
//                 };
//                 sgMail.send(msg);
//                 //Send SMS
//                 //Sending SMS
//                 unirest.post( 'https://api.smartsmssolutions.com/smsapi.php')
//                 .header({'Accept' : 'application/json'})
//                 .send({
//                     'username': process.env.SMSSMARTUSERNAME,
//                     'password': process.env.SMSSMARTPASSWORD,
//                     'sender': process.env.SMSSMARTSENDERID,
//                     'recipient' : `234${payment.patient.phonenumber}`,
//                     'message' : `Dear ${payment.patient.firstname} ${payment.patient.lastname}, your payment of ₦${payment.amount} was received. Thanks for patronizing us. Stay well and get better soon.`,
//                     'routing': 4,
                    
//                 })
//                 .end(function (response) {
//                     //console.log(response.body);
//                 });
//                 User.update(
//                     {
//                         _id: payment.patient
//                     },
//                     {
//                         $push:{payments: payment._id}
//                     },
//                     function (err, count) {
//                         if (err) return next(err)
//                         req.flash('success', 'Payment Made Approved')
//                         res.redirect('/dashboard')
//                     }
//                 )
//         })
//     })
// })

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
                amount: amount,
                type: 'Drugs Payment',
                initiator: req.user._id,
                modeofpayment: req.body.modeofpayment,
                status: true
            })
            payment.save((err)=>{
                if (err) return next(err)
                sgMail.setApiKey(process.env.SENDGRID_MAIL);
                const msg = {
                    to: 'admin@doch.com.ng',
                    from: 'DOCH Account<noreply@doch.com.ng>',
                    subject: 'New Payment Made',
                    html: `<p>Hello Admin,\n\n  A new patient (${consult.patient.firstname} ${consult.patient.lastname}) has just made the payment of ₦${payment.amount} for his/her drugs, Thank You.\n</p>`,
                };
                sgMail.send(msg);
                //Send SMS
                //Sending SMS
                unirest.post( 'https://api.smartsmssolutions.com/smsapi.php')
                .header({'Accept' : 'application/json'})
                .send({
                    'username': process.env.SMSSMARTUSERNAME,
                    'password': process.env.SMSSMARTPASSWORD,
                    'sender': process.env.SMSSMARTSENDERID,
                    'recipient' : `234${consult.patient.phonenumber}`,
                    'message' : `Dear ${consult.patient.firstname} ${consult.patient.lastname}, your payment of ₦${payment.amount} was received. Thanks for patronizing us. Stay well and get better soon.`,
                    'routing': 4,
                    
                })
                .end(function (response) {
                    //console.log(response.body);
                });
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

//Imaging Payment
// router.post('/imaging-payment', middleware.isLoggedIn, (req, res, next)=>{
//     let imagingId = req.body.imagingId
//     let imagingAmount = req.body.imagingAmount
//     let modeofpayment = req.body.modeofpayment
//     Payment.findOne({ _id: imagingId })
//     .populate('patient')

//     .exec(function (err, payment) {
//         if (err) return next(err)
//         payment.paid = true;
//         payment.amount = imagingAmount;
//         payment.status = true;
//         payment.modeofpayment = modeofpayment;
//         payment.initiator = req.user._id;
//         payment.type = 'Imaging Payment';
//         payment.save((err)=>{
//             if (err) return next(err)
//             //Sending MAil
//             sgMail.setApiKey(process.env.SENDGRID_MAIL);
//             const msg = {
//                 to: 'admin@doch.com.ng',
//                 from: 'DOCH Account<noreply@doch.com.ng>',
//                 subject: 'New Payment Made',
//                 html: `<p>Hello Admin,\n\n  A new patient (${payment.patient.firstname} ${payment.patient.lastname}) has just made the payment of &#8358;${payment.amount} for his/her imaging, Thank You.\n</p>`,
//             };
//             sgMail.send(msg);

//             //Sending SMS
//             unirest.post( 'https://api.smartsmssolutions.com/smsapi.php')
//             .header({'Accept' : 'application/json'})
//             .send({
//                 'username': process.env.SMSSMARTUSERNAME,
//                 'password': process.env.SMSSMARTPASSWORD,
//                 'sender': process.env.SMSSMARTSENDERID,
//                 'recipient' : `234${payment.patient.phonenumber}`,
//                 'message' : `Dear ${payment.patient.firstname} ${payment.patient.lastname}, your payment of ₦${payment.amount} was received. Thanks for patronizing us. Stay well and get better soon.`,
//                 'routing': 4,
                
//             })
//             .end(function (response) {
//                 console.log(response.body);
//             });
//             User.update(
//                 {
//                     _id: payment.patient
//                 },
//                 {
//                     $push:{payments: payment._id}
//                 },
//                 function (err, count) {
//                     if (err) return next(err)
//                     req.flash('success', 'Payment Made Approved')
//                     res.redirect('/dashboard')
//                 }
//             )
            
//         })
//     })
// })

//NURSE ASSESSMENTS
router.route('/nurse-assessment/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({_id: req.params.id}, (err, user)=>{
            if(err) return next (err)
            res.render('app/add/nurse_assessment', {user})
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        const assessment = new Assessment({
            nurse: req.user._id,
            patient: req.params.id,
            immunization: req.body.immunization,
            lmp: req.body.lmp,
            presenthistory: req.body.presenthistory,
            pasthistory: req.body.pasthistory,
            nutrition: req.body.nutrition,
            elimination: req.body.elimination,
            activity: req.body.activity,
            sleep: req.body.sleep,
            communication: req.body.communication,
            perception: req.body.perception,
            socialstatus: req.body.socialstatus,
            sexuality: req.body.sexuality,
            copingwithstress: req.body.copingwithstress,
            values: req.body.values,
            others: req.body.others,
            valuesbrought: req.body.valuesbrought,
            temp: req.body.temp,
            height: req.body.height,
            weight: req.body.weight,
            respiration: req.body.respiration,
            pulse: req.body.pulse,
            bloodpressure: req.body.bloodpressure,
            urinalysis: req.body.urinalysis,
            general: req.body.general,
            palpitation: req.body.palpitation,
            percussion: req.body.percussion,
            auscultation: req.body.auscultation,
            labresult: req.body.labresult,
            nursingdiagnosis: req.body.nursingdiagnosis,
        })
        assessment.save((err)=>{
            if(err){
                req.flash('error', err.message)
                return res.redirect('back')
            }
            User.updateOne(
                {
                    _id: req.params.id
                },
                {
                    $push: { assessments: assessment._id}
                }, function (err, count) {
                    req.flash('success', 'Patient assessment was saved!')
                    return res.redirect('/dashboard')
                }
            )
        })
    })

//OPERATION NOTES
router.get('/operation-notes', middleware.isLoggedIn, (req, res, next)=>{
    Theater.find({})
    .sort('-created')
    .populate('patient')
    .populate('surgeon')
    .populate('anesthetist')
    .populate('scrubnurse')
    .exec((err, theaters)=>{
        if (err) { return next(err) }
        res.render('app/view/theater', {theaters})
    })
})

//LAB ITEMS
router.get('/lab-items', middleware.isLoggedIn, (req, res, next) => {
    labItem.find({})
    .populate('creator')
    .populate('vendor')
    .populate('dispensehistory')
    .exec((err, items) => {
        if (err) { return next(err) }
        res.render('app/view/lab_items', { items })
    })
});

//PHARMACY ITEMS
router.get('/pharmacy-items', middleware.isLoggedIn, (req, res, next) => {
    PharmacyItem.find({})
    .sort('-created')
    .populate('vendor')
    .populate('dispensehistory')
    .populate('pharmname')
    .exec( (err, items) => {
        if (err) { return next(err) }
        res.render('app/view/pharmacy_items', { items })
    })
});


//Generating Registration invoice
// router.get('/invoice/:id', middleware.isLoggedIn, (req, res, next) => {
//     User.findOne({ _id: req.params.id }, (err, user) => {
//         if (err) { return next(err) }
//         res.render('app/view/invoice', { user })
//     })
// });

//
router.get('/invoice/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id}, (err, user) => {

        res.render('app/view/reginvoice', {user})
    })
})

//NURSE SENT PATIENT  TO DOCTOR
router.post('/see-doctor', middleware.isLoggedIn, (req, res, next)=>{
    const seen = req.body.seen
    Triage.findOne({_id: seen}, (err, triage)=>{
        if(err) return next (err)
        triage.seen = true
        triage.save((err)=>{
            if(err) return next (err)
            req.flash('success', 'Patient sent to doctor')
            res.redirect('back')
        })
    })
})


//Lab Test Invoice
router.get('/labtest-invoice/:id', middleware.isLoggedIn, (req, res, next) => {
    Consultation.findOne({ _id: req.params.id})
        .populate('patient')
        .populate('drugsObject.drugs')
        .deepPopulate('labtestObject.tests')
        .exec((err, consultation)=>{
            if(err) return next (err)
            res.render('app/view/lab_invoice', { consultation })
        })
});

//Pharmacy  Invoice
router.get('/pharmacy-invoice/:id', middleware.isLoggedIn, (req, res, next) => {
    Consultation.findOne({ _id: req.params.id})
    .populate('patient')
    .populate('payment')
    .deepPopulate(['payment.drugs', 'drugsObject.drugs.name.pharmname', 'drugsObject.nhisdrugs.name.pharmname'])
    .populate('labtestObject')
    .exec((err, consultation)=>{
        if(err) return next (err)
        res.render('app/view/pharmacyinvoice', { consultation })
    })
});

//Imaing Invoice
router.get('/imaging-invoice/:id', middleware.isLoggedIn, (req, res, next) => {
    Consultation.findOne({ _id: req.params.id})
    .populate('patient')
    .populate('labtestObject')
    .deepPopulate('imaging.investigation')
    .exec((err, consultation)=>{
        if(err) return next (err)
        res.render('app/view/imaging_invoice', { consultation })
    })
});

//Billing  Invoice
router.get('/billing-invoice/:id', middleware.isLoggedIn, (req, res, next) => {
    Payment.findOne({ _id: req.params.id})
    .populate('patient')
    .populate('services')
    .exec((err, payment)=>{
        if(err) return next (err)
        res.render('app/view/billing_invoice', { payment })
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

//PAYMENT PAGE
router.get('/payments', middleware.isLoggedIn, (req, res, next)=>{
    //All payments made
    Payment.find({})
    .sort('-createdAt')
    .populate('services')
    .populate('patient')
    .populate('initiator')
    .exec((err, allpayments)=>{
        if(err) return next (err)
        //Payments made today
        Payment.find({
            'createdAt':{
                $lt: new Date(new Date().setHours(23, 59, 59)),
                $gte: new Date(new Date().setHours(00, 00, 00))
            }
        })
        .sort('-createdAt')
        .populate('services')
        .populate('patient')
        .populate('initiator')
        .exec((err, paymentToday)=>{
            if(err) return next (err)
            //Payemnt thhis week
            Payment.find({
                'createdAt':{
                    $lt: new Date(), 
                    $gte: new Date(new Date().setDate(new Date().getDate()-7))
                }
            })
            .sort('-createdAt')
            .populate('services')
            .populate('patient')
            .populate('initiator')
            .exec((err, paymentThisWeek)=>{
                if(err) return next (err)
                //Payment last 30 days
                Payment.find({
                    'createdAt':{
                        $lt: new Date(), 
                        $gte: new Date(new Date().setDate(new Date().getDate()-30))
                    }
                })
                .sort('-createdAt')
                .populate('services')
                .populate('patient')
                .populate('initiator')
                .exec((err, paymentLast30Days)=>{
                    if(err) return next (err)
                    res.render('app/view/payments', { allpayments, paymentToday, paymentThisWeek, paymentLast30Days })
                })
            })
        })
    })
})

//REISTER ANTE NATAL PATIENT
router.route('/create-ante-natal-patient/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        ANC.countDocuments({}, (err, count)=>{
            if (err) return next (err)
            User.findOne({_id: req.params.id}, (err, user)=>{
                if (err) return next (err)
                // Appointment.findOne({_id: user.appointments[user.appointments.length -1]._id}, function (err, appointment) {
                //     if (err) return next (err)
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
                    
                    //    appointment.taken = true;
                    //    appointment.save((err)=>{
                    //        if(err){
                    //            req.flash('error', "Error taking the appointment")
                    //            return res.redirect('back')
                    //        }
                           res.render('app/add/register_ante_natal', { antenatalCounter, user, age})
                    //    })
                    
                // })
            })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({_id: req.params.id}, (err, user)=>{
            Appointment.findOne({_id: user.appointments[user.appointments.length -1]}, function (err, appointment) {
                if (err) return next (err)
                const anc = new ANC()
                anc.creator = req.user._id
                anc.patient = req.body.patient
                anc.ancId = req.body.ancId
                anc.age = req.body.age
                anc.occupation = req.body.occupation
                anc.gravida = req.body.gravida
                anc.parity = req.body.parity
                anc.lmp = req.body.lmp
                anc.edd = req.body.edd
                anc.ecc = req.body.ecc
                anc.fetalage = req.body.fetalage
                anc.medicalhistory = req.body.medicalhistory
                anc.surgicalhistory = req.body.surgicalhistory
                anc.bloodtransfusion = req.body.bloodtransfusion
                anc.familyhistory = req.body.familyhistory
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
                    appointment.taken = true;
                    appointment.save()
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
            })
        })
            
    })

//ANTENATAL
router.route('/ante-natal/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({_id: req.params.id})
        .populate('ancs')
        .exec((err, user)=>{
            if(err) return next (err)
            // Appointment.findOne({_id: user.appointments[user.appointments.length -1]._id}, function (err, appointment) {
            //     if (err) return next (err)
            //        appointment.taken = true;
                //    appointment.save((err)=>{
                //        if(err){
                //            req.flash('error', "Error taking the appointment")
                //            return res.redirect('back')
                //        }
                       ANC.findOne({_id: user.ancs[user.ancs.length -1]._id})
                       .populate('labtest')
                       .deepPopulate('labtest.lab')
                       .exec((err, anc)=>{
                           if(err) return next (err)
                           Lab.find({}, (err, labs)=>{
                            if(err) return next (err)
                                Test.find({}, (err, alltests)=>{
                                    if(err) return next (err)
                                    res.render('app/add/add_anc', {user, anc, labs, alltests})
                                })
                           })
                       })
                //    })
                
            // })
           
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        User.findOne({_id: req.params.id})
        .populate('ancs')
        .exec((err, user)=>{
            ANC.findOne({_id: user.ancs[user.ancs.length -1]._id}, (err, anc)=>{
                if(err) {
                    req.flash('error', 'Patient ANC record cannot be found')
                    return res.redirect('back')
                }
                Appointment.findOne({_id: user.appointments[user.appointments.length -1]._id}, function (err, appointment) {
                    if (err) return next (err)
                       anc.presentpregnancy.push({
                        thedate: req.body.thedate,
                        weight:  req.body.weight,
                        height:  req.body.height,
                        bmi:  req.body.bmi,
                        urinalysisGlucose: req.body.urinalysisGlucose,
                        urinalysisProtein: req.body.urinalysisProtein,
                        bp: req.body.bp,
                        pallor: req.body.pallor,
                        maturity: req.body.maturity,
                        fundalheight: req.body.fundalheight,
                        presentation: req.body.presentation,
                        fetalheartrate: req.body.fetalheartrate,
                        oedema: req.body.oedema,
                        comments: req.body.comments,
                        tcadate: req.body.tcadate,
                        // initial: req.body.initial
                    })
                    anc.save((err)=>{
                        if(err) return next (err)
                        appointment.taken = true;
                        appointment.save()
                        req.flash('success', 'Details saved successfully')
                        res.redirect('back')
                    })
                })
            })
        })
        
    })

router.post('/clinical-notes/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('ancs')
    .exec((err, user)=>{
        if(err) return next (err)
        ANC.findOne({_id: user.ancs[user.ancs.length -1]._id}, (err, anc)=>{
            if(err) {
                req.flash('error', 'Patient ANC record cannot be found')
                return res.redirect('back')
            }
            anc.clinicalnotes.push({
                clinicalnotes: req.body.clinicalnotes
            })
            
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
        ANC.findOne({_id: user.ancs[user.ancs.length -1]._id}, (err, anc)=>{
            if(err) {
                req.flash('error', 'Patient ANC record cannot be found')
                return res.redirect('back')
            }
            anc.labtype = req.body.labtype
            anc.labtest.push(
                req.body.labtest
            )
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
        ANC.findOne({_id: user.ancs[user.ancs.length -1]._id}, (err, anc)=>{
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

//THEATER ITEMS
router.route('/theater-items/:id')
    .get(middleware.isLoggedIn, (req, res, next)=>{
        PharmacyItem.find({}, (err, drugs)=>{
            Theater.findOne({_id: req.params.id})
                .populate('patient')
                .populate('theaterItems.drugs')
                .exec((err, theater)=>{
                    res.render('app/add/theater_items', {drugs, theater})
                })
        })
    })
    .post(middleware.isLoggedIn, (req, res, next)=>{
        Theater.findOne({_id: req.params.id})
            .populate('patient')
            .exec((err, theater)=>{
            theater.theaterItems.push({
                drugs: req.body.drug,
                approvedqty: req.body.approvedqty,
                consumed: req.body.consumed,
                price: req.body.price,
                extraconsumed: req.body.extraconsumed,
                totalamount: req.body.totalamount
            })
            theater.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Theater items used for patient was saved successfully')
                res.redirect('back')
            })
        })
    })
//DATES GIVEN
router.post('/dates-given/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('ancs')
    .exec((err, user)=>{
        if(err) return next (err)
        ANC.findOne({_id: user.ancs[user.ancs.length -1]._id}, (err, anc)=>{
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
        User.findOne({_id: req.params.id})
            .populate('ancs')
            .exec((err, user)=>{
                ANC.findOne({_id: user.ancs[user.ancs.length -1]._id}, (err, anc)=>{
                    if(err) {
                        req.flash('error', 'Patient ANC record cannot be found')
                        return res.redirect('back')
                    }
                    anc.delivery.push({
                        modeofdelivery: req.body.modeofdelivery,
                        dateofdelivery: req.body.dateofdelivery,
                        timeofdelivery: req.body.timeofdelivery,
                        timeofsurgery: req.body.timeofsurgery,
                        timepatientleft: req.body.timepatientleft,
                        bloodloss: req.body.bloodloss,
                        liquor: req.body.liquor,
                        comment: req.body.comment,
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
                        hbv: req.body.hbv,
                        opvo: req.body.opvo,
                        notifieddate: req.body.notifieddate
                    })
                    anc.save((err)=>{
                        if(err) return next (err)
                        req.flash('success', 'Patient Delivery Info was saved successfully')
                        res.redirect('/all-antenatal')
                    })
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
        User.findOne({_id: req.params.id})
            .populate('ancs')
            .exec((err, user)=>{
            ANC.findOne({_id: user.ancs[user.ancs.length -1]._id}, (err, anc)=>{
                if(err) {
                    req.flash('error', 'Patient ANC record cannot be found')
                    return res.redirect('back')
                }
                anc.postnatal.push({
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
                })
                anc.status = false;
                anc.save((err)=>{
                    if(err) return next (err)
                    req.flash('success', 'Patient Delivery Info was saved successfully')
                    res.redirect('/all-antenatal')
                })
            }) 
        }) 
    })

//VIEW ANTENATAL RESULTS
router.get('/antenatal-results/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
        .populate('ancs')
        .sort('-created')
        .exec((err, user)=>{
            if(err) return next(err)
            if(user.ancs.length < 1){
                req.flash('error', 'Patient does not have previous ANC examinations')
                return res.redirect('back')
            }else{
                ANC.findOne({patient: user._id})
                    .exec((err, ancs)=>{
                    if(err) return next(err)
                    res.render('app/view/antenatal_results', {ancs, user})
                })
            }
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

//MEDICAL RECORDS STATS FUNCTION
// function statisticsFunc(users, allUsers, res, usersIsEmpty, appointments, usersToday, userThisWeek, usersLast30Days ) {
//         //Patients registered today
//         User.find({
//             "createdAt": {
//                 $lt: new Date(new Date().setHours(23, 59, 59)),
//                 $gte: new Date(new Date().setHours(00, 00, 00))
//             }
//         })
//         .sort('-createdAt')
//         .populate('registeredby')
//         .exec((err, usersToday) => {
//             if(err) return next(err)
//             //Patients registered this week
//             User.find({
//                 "createdAt" : { 
//                     $lt: new Date(), 
//                     $gte: new Date(new Date().setDate(new Date().getDate()-7))
//                   } 
//             })
//             .sort('-createdAt')
//             .populate('registeredby')
//             .exec((err, userThisWeek)=>{
//                 if(err) return next(err)
//                 //Patients registered last 30 days
//                 User.find({
//                     "createdAt" : { 
//                         $lt: new Date(), 
//                         $gte: new Date(new Date().setDate(new Date().getDate()-30))
//                       } 
//                 })
//                 .sort('-createdAt')
//                 .populate('registeredby')
//                 .exec((err, usersLast30Days)=>{

//                     users.forEach((user) => {
//                         var birthday = new Date(user.birthday);
//                         var today = new Date();
//                         var age = today.getFullYear() - birthday.getFullYear();
//                         if (today.getMonth() < birthday.getMonth()) {
//                             age;
//                         }
//                         if (today.getMonth() == birthday.getMonth() && today.getDate() < birthday.getDate()) {
//                             age;
//                         }
//                         if (user.role == 8) {
//                             //All registered users
//                             allUsers.push({
//                                 'registeredby': user.registeredby,
//                                 'id': user._id,
//                                 'patientId': user.patientId,
//                                 'paid': user.account.paid,
//                                 'firstname': user.firstname,
//                                 'lastname': user.lastname,
//                                 'address': user.address,
//                                 'phone': user.phonenumber,
//                                 'email': user.email,
//                                 'status': user.status,
//                                 'role': user.role,
//                                 'city': user.city,
//                                 'age': age,
//                                 'country': user.country,
//                                 'created': user.createdAt.toLocaleString(),
//                             });
//                         }
//                     });
//                     res.render('app/dashboard4', { allUsers, users, usersIsEmpty, appointments, usersToday, userThisWeek, usersLast30Days });
//                 })
//             })
//         })
// }

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