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


//get the corresponding hmo enrolle
router.post('/get-hmo', middleware.isLoggedIn, (req, res, next)=>{
    const hmoid = req.body.hmoid
    HMO.findOne({_id: hmoid}, (err, hmo)=>{
        if(err) return next(err)
        var enrolless = []
        hmo.hmoenrols.forEach((hmo)=>{
            enrolless.push(
               hmo.hmoenrollee
            )
        })
        res.json(enrolless)
    })
})

module.exports = router