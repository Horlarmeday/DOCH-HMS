const router = require('express').Router();
const async = require('async');
const User = require('../models/user');
const mongoose = require('mongoose');
const Department = require('../models/department');
const Appointment = require('../models/appointment');
const Consultation = require('../models/consultation');
const Paid = require('../models/paid')
const SMS = require('../models/sms');
const Total = require('../models/total');
const NurseReport = require('../models/nurseReport')
const Theater = require('../models/theater')
const Vendor = require('../models/vendor')
const Payment = require('../models/payments')
const Imaging = require('../models/imaging')
const Investigations = require('../models/investigations')
const LocalInventory = require('../models/localinventory')
const ANC = require('../models/anc')
const Request = require('../models/request')
// const Counter = require('../models/counters')
const labItem = require('../models/labitem')
const PharmacyItem = require('../models/pharmacyItem')
const PharmDispense = require('../models/pharmDispense')
const LabDispense = require('../models/labDispense')
const HMO = require('../models/hmo')
const Service = require('../models/service')
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

//get patient age
router.post('/get-patient-age', middleware.isLoggedIn, (req, res, next)=>{
    const userid = req.body.userid
    User.findOne({_id: userid}, (err, user)=>{
        if(err) return next(err)
        var birthday = new Date(user.birthday)
        var today = new Date()
        var age = today.getFullYear() - birthday.getFullYear()
        if(today.getMonth() < birthday.getMonth()){
            age
        }
        if(today.getMonth() == birthday.getMonth() && today.getDate() < birthday.getDate()){
            age
        }
        
        res.json(age)
    })
})


//get billings total amount
router.post('/get-total-amount', middleware.isLoggedIn, (req, res, next)=>{
    const theservice = req.body.theservice
    Service.find({_id: theservice}, (err, service)=>{
        if(err) return next(err)
        function getSum(total, num) {
            return total + num;
        }
        const totalBillingPrice = service.map(amount =>{
            const rPrice = amount.price
            return rPrice;
        })
        console.log(totalBillingPrice)
        var totalAmount;
        if(totalBillingPrice === undefined || totalBillingPrice.length == 0){
            totalAmount = 0
        }else{
            totalAmount = totalBillingPrice.reduce(getSum)
        }
        
        res.json(totalAmount)
    })
})

//get drugs prescriptions
router.post('/get-drug-info', middleware.isLoggedIn, (req, res, next)=>{
    
    const drugId = req.body.drugId
    PharmacyItem.findOne({_id: drugId})
    .exec((err, drug)=>{
        if(err) return next (err)
        res.json({
            price: drug.sellprice,
            rquantity: drug.rquantity,
            quantity: drug.quantity,
            code: drug.productcode
        })
        
    })
})

router.post('/get-drug-price', middleware.isLoggedIn, (req, res, next)=>{
    const drugword = req.body.drugword
    Paid.findOne({_id: drugword})
    .exec((err, paid)=>{
        if(err) return next (err)
        paid.checked = true;
        paid.save((err)=>{
            if(err) return next (err)
            const total = new Total()
            total.all += paid.price
            total.save((err)=>{
                if(err) return next(err)
                Total.find({}, (err, alltotal)=>{
                    function getSum(total, num) {
                        return total + num;
                    }
                    const DrugPrice = alltotal.map(amount =>{
                        const rPrice = amount.all
                        return rPrice;
                    })
             
                    var drugAmount;
                    if(DrugPrice === undefined || DrugPrice.length == 0){
                        drugAmount = 0
                    }else{
                        drugAmount = DrugPrice.reduce(getSum)
                    }
                    res.json(drugAmount)
                })
            })
        })
    })
})

router.post('/get-pharmacy-price', middleware.isLoggedIn, (req, res, next)=>{
    const drugCode = req.body.itemCode
    PharmacyItem.findOne({_id: drugCode})
    .exec((err, drug)=>{
        if(err) return next (err)
        res.json({
            price: drug.sellprice,
            code: drug.productcode
        })
    })
})

router.post('/emergency-patient', middleware.isLoggedIn, (req, res, next)=>{
    const patientIdentity = req.body.patientIdentity
    User.findOne({_id: patientIdentity})
    .exec((err, user)=>{
        user.emergency = true;
        user.save((err)=>{
            if(err) return next (err)
            res.json(user)
        })
    })
})

router.post('/make-patient-emergency', middleware.isLoggedIn, (req, res, next)=>{
    const Identity = req.body.Identity
    User.findOne({_id: Identity})
    .exec((err, user)=>{
        user.emergency = true;
        user.save((err)=>{
            if(err) return next (err)
            res.json(user)
        })
    })
})

router.post('/get-imaging', middleware.isLoggedIn, (req, res, next)=>{
    const image = req.body.image
    Imaging.findOne({_id: image})
    .populate('investigation')
    .exec((err, image)=>{
        if(err) return next(err)
        var investigations = []
        image.investigation.forEach((images)=>{
            investigations.push({
                id: images._id,
                images: images.name,
            })
        })
        res.json(investigations)
    })
})

router.post('/get-imaging-price', middleware.isLoggedIn, (req, res, next)=>{
    const price = req.body.price
    Investigations.findOne({_id: price})
    .exec((err, investigate)=>{
        if(err) return next(err)
        res.json(investigate.price)
    })
})

router.post('/get-dispensory-price', middleware.isLoggedIn, (req, res, next)=>{
    const drugCode = req.body.itemCode
    LocalInventory.findOne({_id: drugCode})
    .exec((err, drug)=>{
        if(err) return next (err)
        res.json({
            price: drug.price,
            balance: drug.balance
        })
    })
})

router.post('/remove-drug', middleware.isLoggedIn, (req, res, next)=>{
    const indexClicked = req.body.indexClicked
    const clickedConsultation = req.body.clickedConsultation
    Consultation.findOne({_id: clickedConsultation})
    .exec((err, drug)=>{
       drug.drugsObject[indexClicked].remove()
       drug.save((err)=>{
           if(err) return next (err)
           res.redirect('back')
       })
    })
})

router.post('/change-status-paid', middleware.isLoggedIn, (req, res, next)=>{
    const drugChoosen = req.body.drugChoosen
    const ChoosenConsultation = req.body.ChoosenConsultation
    Consultation.findOne({_id: ChoosenConsultation})
    .exec((err, drug)=>{
       drug.drugsObject[drugChoosen].checked = true
       drug.picked.push(drug.drugsObject[drugChoosen].price)
       
       drug.save((err)=>{
           if(err) return next (err)
           const arr = drug.picked
           const add = (a, b) => a + b;
           var thesum;
            if(arr === undefined || arr.length == 0){
                thesum = 0
            }else{
                thesum = arr.reduce(add)
            }
           res.status(200).json({
               status: drug.drugsObject[drugChoosen],
               amount: thesum
           })
       })
    })
})

router.post('/change-status-unpaid', middleware.isLoggedIn, (req, res, next)=>{
    const drugChoosen = req.body.drugChoosen
    const ChoosenConsultation = req.body.ChoosenConsultation
    Consultation.findOne({_id: ChoosenConsultation})
    .exec((err, drug)=>{
       drug.drugsObject[drugChoosen].checked = false
       drug.picked.pull(drug.drugsObject[drugChoosen].price)
       drug.save((err)=>{
           if(err) return next (err)
           const arr = drug.picked
           const add = (a, b) => a + b;
           var sum;
            if(arr === undefined || arr.length == 0){
                sum = 0
            }else{
                sum = arr.reduce(add)
            }
           res.status(200).json({
               status:drug.drugsObject[drugChoosen],
               amount: sum
           })
       })
    })
})


module.exports = router