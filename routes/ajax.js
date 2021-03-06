const router = require("express").Router();
const async = require("async");
const User = require("../models/user");
const mongoose = require("mongoose");
const Department = require("../models/department");
const Appointment = require("../models/appointment");
const Consultation = require("../models/consultation");
const Paid = require("../models/paid");
const SMS = require("../models/sms");
const Total = require("../models/total");
const NurseReport = require("../models/nurseReport");
const Theater = require("../models/theater");
const Vendor = require("../models/vendor");
const Payment = require("../models/payments");
const Imaging = require("../models/imaging");
const Investigations = require("../models/investigations");
const LocalInventory = require("../models/localinventory");
const Inpatient = require("../models/inPatientInventory");
const NhisOpdInventory = require('../models/nhisOpdInventory')
const NhisIpdInventory = require('../models/nhisIpdInventory')
const ANC = require("../models/anc");
const Request = require("../models/request");
// const Counter = require('../models/counters')
const labItem = require("../models/labitem");
const PharmacyItem = require("../models/pharmacyItem");
const PharmDispense = require("../models/pharmDispense");
const LabDispense = require("../models/labDispense");
const HMO = require("../models/hmo");
const Service = require("../models/service");
const Drug = require("../models/drug");
const Test = require("../models/test");
const Invoice = require("../models/invoice");
const Visit = require("../models/visit");
const Lab = require("../models/lab");
const sgMail = require("@sendgrid/mail");
const multer = require("multer");
const fs = require("fs");
const middleware = require("../middleware");
const Triage = require("../models/triage");
const upload = require("./upload");
const bcrypt = require("bcrypt-nodejs");
const Notification = require("../models/notifications");
const uuidv1 = require("uuid/v4");
var unirest = require("unirest");

//get the corresponding hmo enrolle
router.post("/get-hmo", middleware.isLoggedIn, (req, res, next) => {
  const hmoid = req.body.hmoid;
  var mysort = { hmoname: 1 };
  HMO.findOne({ _id: hmoid })
  .sort(mysort)
  .exec((err, hmo) => {
    if (err) return next(err);
    var enrolless = [];
    hmo.hmoenrols.forEach(hmo => {
      enrolless.push(hmo.hmoenrollee);
    });
    console.log(enrolless)
    res.json(enrolless);
  });
});

//get patient age
router.post("/get-patient-age", middleware.isLoggedIn, (req, res, next) => {
  const userid = req.body.userid;
  User.findOne({ _id: userid }, (err, user) => {
    if (err) return next(err);
    var birthday = new Date(user.birthday);
    var today = new Date();
    var age = today.getFullYear() - birthday.getFullYear();
    if (today.getMonth() < birthday.getMonth()) {
      age;
    }
    if (
      today.getMonth() == birthday.getMonth() &&
      today.getDate() < birthday.getDate()
    ) {
      age;
    }

    res.json(age);
  });
});

//get billings total amount
router.post("/get-total-amount", middleware.isLoggedIn, (req, res, next) => {
  const theservice = req.body.theservice;
  Service.find({ _id: theservice }, (err, service) => {
    if (err) return next(err);
    function getSum(total, num) {
      return total + num;
    }
    const totalBillingPrice = service.map(amount => {
      const rPrice = amount.price;
      return rPrice;
    });
    console.log(totalBillingPrice);
    var totalAmount;
    if (totalBillingPrice === undefined || totalBillingPrice.length == 0) {
      totalAmount = 0;
    } else {
      totalAmount = totalBillingPrice.reduce(getSum);
    }

    res.json(totalAmount);
  });
});

//get drugs prescriptions
router.post("/get-drug-info", middleware.isLoggedIn, (req, res, next) => {
  const drugId = req.body.drugId;
  PharmacyItem.findOne({ _id: drugId }).exec((err, drug) => {
    if (err) return next(err);
    res.json({
      price: drug.sellprice,
      rquantity: drug.rquantity,
      quantity: drug.quantity,
      code: drug.productcode
    });
  });
});

router.post("/get-drug-price", middleware.isLoggedIn, (req, res, next) => {
  const drugword = req.body.drugword;
  Paid.findOne({ _id: drugword }).exec((err, paid) => {
    if (err) return next(err);
    paid.checked = true;
    paid.save(err => {
      if (err) return next(err);
      const total = new Total();
      total.all += paid.price;
      total.save(err => {
        if (err) return next(err);
        Total.find({}, (err, alltotal) => {
          function getSum(total, num) {
            return total + num;
          }
          const DrugPrice = alltotal.map(amount => {
            const rPrice = amount.all;
            return rPrice;
          });

          var drugAmount;
          if (DrugPrice === undefined || DrugPrice.length == 0) {
            drugAmount = 0;
          } else {
            drugAmount = DrugPrice.reduce(getSum);
          }
          res.json(drugAmount);
        });
      });
    });
  });
});

router.post("/get-pharmacy-price", middleware.isLoggedIn, (req, res, next) => {
  const drugCode = req.body.itemCode;
  PharmacyItem.findOne({ _id: drugCode }).exec((err, drug) => {
    if (err) return next(err);
    res.json({
      price: drug.sellprice,
      code: drug.productcode
    });
  });
});

router.post("/emergency-patient", middleware.isLoggedIn, (req, res, next) => {
  const patientIdentity = req.body.patientIdentity;
  User.findOne({ _id: patientIdentity }).exec((err, user) => {
    user.emergency = true;
    user.save(err => {
      if (err) return next(err);
      res.json(user);
    });
  });
});

router.post(
  "/make-patient-emergency",
  middleware.isLoggedIn,
  (req, res, next) => {
    const Identity = req.body.Identity;
    User.findOne({ _id: Identity }).exec((err, user) => {
      user.emergency = true;
      user.save(err => {
        if (err) return next(err);
        res.json(user);
      });
    });
  }
);

router.post("/get-imaging", middleware.isLoggedIn, (req, res, next) => {
  const image = req.body.image;
  Imaging.findOne({ _id: image })
    .populate("investigation")
    .exec((err, image) => {
      if (err) return next(err);
      var investigations = [];
      image.investigation.forEach(images => {
        investigations.push({
          id: images._id,
          images: images.name
        });
      });
      res.json(investigations);
    });
});

router.post("/get-imaging-price", middleware.isLoggedIn, (req, res, next) => {
  const price = req.body.price;
  Investigations.findOne({ _id: price }).exec((err, investigate) => {
    if (err) return next(err);
    res.json(investigate.price);
  });
});

router.post(
  "/get-dispensory-price",
  middleware.isLoggedIn,
  (req, res, next) => {
    const drugCode = req.body.itemCode;
    LocalInventory.findOne({ _id: drugCode }).exec((err, drug) => {
      if (err) return next(err);
      res.json({
        price: drug.price,
        balance: drug.balance,
        quantity: drug.quantity
      });
    });
  }
);

router.post(
  "/get-nhis-drug-price",
  middleware.isLoggedIn,
  (req, res, next) => {
    const drugCode = req.body.nhisItem;
    NhisOpdInventory.findOne({ _id: drugCode }).exec((err, drug) => {
      if (err) return next(err);
      res.json({
        price: drug.price,
        balance: drug.balance,
        quantity: drug.quantity
      });
    });
  }
);

router.post("/remove-drug", middleware.isLoggedIn, (req, res, next) => {
  const indexClicked = req.body.indexClicked;
  const clickedConsultation = req.body.clickedConsultation;
  Consultation.findOne({ _id: clickedConsultation }).exec((err, drug) => {
    drug.drugsObject[indexClicked].remove();
    drug.save(err => {
      if (err) return next(err);
      res.redirect("back");
    });
  });
});

router.post("/change-status-paid", middleware.isLoggedIn, (req, res, next) => {
  const drugChoosen = req.body.drugChoosen;
  const ChoosenConsultation = req.body.ChoosenConsultation;
  Consultation.findOne({ _id: ChoosenConsultation }).exec((err, drug) => {
    drug.drugsObject[drugChoosen].checked = true;
    drug.drugspicked.push(drug.drugsObject[drugChoosen].price);

    drug.save(err => {
      if (err) return next(err);
      const arr = drug.drugspicked;
      const add = (a, b) => a + b;
      var thesum;
      if (arr === undefined || arr.length == 0) {
        thesum = 0;
      } else {
        thesum = arr.reduce(add);
      }
      res.status(200).json({
        status: drug.drugsObject[drugChoosen],
        amount: thesum
      });
    });
  });
});

router.post(
  "/change-status-unpaid",
  middleware.isLoggedIn,
  (req, res, next) => {
    const drugChoosen = req.body.drugChoosen;
    const ChoosenConsultation = req.body.ChoosenConsultation;
    Consultation.findOne({ _id: ChoosenConsultation }).exec((err, drug) => {
      drug.drugsObject[drugChoosen].checked = false;
      drug.drugspicked.pull(drug.drugsObject[drugChoosen].price);
      drug.save(err => {
        if (err) return next(err);
        const arr = drug.drugspicked;
        const add = (a, b) => a + b;
        var sum;
        if (arr === undefined || arr.length == 0) {
          sum = 0;
        } else {
          sum = arr.reduce(add);
        }
        res.status(200).json({
          status: drug.drugsObject[drugChoosen],
          amount: sum
        });
      });
    });
  }
);

router.post("/get-lab", middleware.isLoggedIn, (req, res, next) => {
  const lab = req.body.lab;
  Lab.findOne({ _id: lab })
    .populate("tests")
    .exec((err, lab) => {
      if (err) return next(err);
      var tests = [];
      lab.tests.forEach(test => {
        tests.push({
          id: test._id,
          tests: test.name
        });
      });

      res.json(tests);
    });
});

router.post("/get-tests-price", middleware.isLoggedIn, (req, res, next) => {
  const price = req.body.price;
  Test.findOne({ _id: price }).exec((err, test) => {
    if (err) return next(err);
    res.json(test.price);
  });
});

router.post(
  "/change-lab-status-paid",
  middleware.isLoggedIn,
  (req, res, next) => {
    const testChoosen = req.body.testChoosen;
    const ChoosenConsultation = req.body.ChoosenConsultation;
    Consultation.findOne({ _id: ChoosenConsultation }).exec((err, test) => {
      test.labtestObject[testChoosen].status = true;
      test.testpicked.push(test.labtestObject[testChoosen].price);

      test.save(err => {
        if (err) return next(err);
        const arr = test.testpicked;
        const add = (a, b) => a + b;
        var thesum;
        if (arr === undefined || arr.length == 0) {
          thesum = 0;
        } else {
          thesum = arr.reduce(add);
        }
        console.log(test.labtestObject[testChoosen]);
        res.status(200).json({
          status: test.labtestObject[testChoosen],
          amount: thesum
        });
      });
    });
  }
);

router.post(
  "/change-lab-status-unpaid",
  middleware.isLoggedIn,
  (req, res, next) => {
    const testChoosen = req.body.testChoosen;
    const ChoosenConsultation = req.body.ChoosenConsultation;
    Consultation.findOne({ _id: ChoosenConsultation }).exec((err, test) => {
      test.labtestObject[testChoosen].status = false;
      test.testpicked.pull(test.labtestObject[testChoosen].price);
      test.save(err => {
        if (err) return next(err);
        const arr = test.testpicked;
        const add = (a, b) => a + b;
        var sum;
        if (arr === undefined || arr.length == 0) {
          sum = 0;
        } else {
          sum = arr.reduce(add);
        }
        res.status(200).json({
          status: test.labtestObject[testChoosen],
          amount: sum
        });
      });
    });
  }
);

router.post("/get-consultation", middleware.isLoggedIn, (req, res, next) => {
  const index = req.body.index;
  const consultation = req.body.consultation;
  Consultation.findOne({ _id: consultation })
    .populate("prescribedBy")
    .deepPopulate([
      "drugsObject.prescribedBy",
      "patient.retainershipname",
      "drugsObject.drugs.name.pharmname",
      "drugsObject.drugs.name",
      "drugsObject.nhisdrugs.name.pharmname"
    ])
    .exec((err, found) => {
      
      var clickedConsultation = [];
      found.drugsObject.forEach(drug => {
        if(found.patient.retainershipname){
          clickedConsultation.push({
            index: index,
            consultationId: found._id,
            id: drug._id,
            fname: found.patient.firstname,
            nhisname: found.patient.retainershipname.hmoname,
            patientId: found.patient._id,
            lname: found.patient.lastname,
            date: drug.startingdate.toLocaleDateString(),
            nhisdrugs: drug.nhisdrugs.name.name,
            nhisthedrug: drug.nhisdrugs.name.pharmname,
            dose: drug.time,
            status: drug.status,
            frequency: drug.direction,
            duration: drug.duration,
            total: drug.quantity,
            price: drug.price,
            note: drug.notes,
            docfirst: drug.prescribedBy.firstname,
            docsecond: drug.prescribedBy.lastname
          });
        }else{
          clickedConsultation.push({
            index: index,
            consultationId: found._id,
            id: drug._id,
            fname: found.patient.firstname,
            patientId: found.patient._id,
            lname: found.patient.lastname,
            date: drug.startingdate.toLocaleDateString(),
            drugs: drug.drugs.name.name,
            thedrug: drug.drugs.name.pharmname,
            dose: drug.time,
            status: drug.status,
            frequency: drug.direction,
            duration: drug.duration,
            total: drug.quantity,
            price: drug.price,
            note: drug.notes,
            docfirst: drug.prescribedBy.firstname,
            docsecond: drug.prescribedBy.lastname
          });
        }
      });
      res.status(200).json(clickedConsultation);
    });
});

router.post("/dispense-drug", middleware.isLoggedIn, (req, res, next) => {
  const index = req.body.index;
  const consultationId = req.body.id;
  Consultation.findOne({ _id: consultationId })
    .deepPopulate(["drugsObject.drugs.name", "patient.retainershipname", "drugsObject.nhisdrugs.name",])
    .exec((err, consultation) => {
      if (req.user.role == 5) {
        if(consultation.patient.retainershipname){
          NhisOpdInventory.findOne(
            { _id: consultation.drugsObject[index].nhisdrugs },
            (err, foundDrug) => {
              if (foundDrug) {
                if (foundDrug.balance <= 0 || foundDrug.balance < consultation.drugsObject[index].quantity) {
                  return res
                    .status(400)
                    .json("Sorry, the balance in the dispensary is Zero or not upto quantity to be dispensed");
                } else {
                  foundDrug.balance =
                    foundDrug.quantity - consultation.drugsObject[index].dispense;
                  foundDrug.consumed +=
                    consultation.drugsObject[index].quantity;
                  foundDrug.save(err => {
                    if (err) return next(err);
                  });
  
                  consultation.drugsObject[index].status = true;
                  consultation.save(err => {
                    if (err) return next(err);
                    const complete = consultation.drugsObject.map(status =>{
                      const rStatus = status.status
                      return rStatus;
                    })
                    let truthLength = complete.filter(v => v).length
                    if(truthLength === consultation.drugsObject.length){
                      consultation.pharmacyfinish = true;
                      consultation.save();
                      return res
                      .status(200)
                      .json({
                          data: consultation.drugsObject[index].status,
                          message: 'All drugs dispensed!'
                      })
                    }else{
                      return res
                      .status(200)
                      .json({
                          data: consultation.drugsObject[index].status,
                          message: "Drug dispensed successfully"
                      });
                    }
                  });
                }
              } else {
                res
                  .status(404)
                  .json("Drug not found in the NHIS Outpatient Inventory");
              }
            }
          );
        }else{
          LocalInventory.findOne(
            { _id: consultation.drugsObject[index].drugs },
            (err, foundDrug) => {
              if (foundDrug) {
                if (foundDrug.balance <= 0 || foundDrug.balance < consultation.drugsObject[index].quantity) {
                  return res
                    .status(400)
                    .json("Sorry, the balance in the dispensary is Zero or not upto quantity to be dispensed");
                } else {
                  foundDrug.balance =
                    foundDrug.quantity - consultation.drugsObject[index].dispense;
                  foundDrug.consumed +=
                    consultation.drugsObject[index].quantity;
                  foundDrug.save(err => {
                    if (err) return next(err);
                  });
  
                  consultation.drugsObject[index].status = true;
                  consultation.save(err => {
                    if (err) return next(err);
                    const complete = consultation.drugsObject.map(status =>{
                      const rStatus = status.status
                      return rStatus;
                    })
                    let truthLength = complete.filter(v => v).length
                    if(truthLength === consultation.drugsObject.length){
                      consultation.pharmacyfinish = true;
                      consultation.save();
                      return res
                      .status(200)
                      .json({
                          data: consultation.drugsObject[index].status,
                          message: 'All drugs dispensed!'
                      })
                    }else{
                      return res
                      .status(200)
                      .json({
                          data: consultation.drugsObject[index].status,
                          message: "Drug dispensed successfully"
                      });
                    }
                  });
                }
              } else {
                res
                  .status(404)
                  .json("Drug not found in the Outpatient Inventory");
              }
            }
          );
        }
      } else if (req.user.role == 23) {
        if(consultation.patient.retainershipname){
          NhisIpdInventory.findOne(
            { name: consultation.drugsObject[index].nhisdrugs.name },
            (err, foundDrug) => {
              if (foundDrug) {
                if (foundDrug.balance <= 0 || foundDrug.balance < consultation.drugsObject[index].quantity) {
                  return res
                    .status(400)
                    .json("Sorry, the balance in the dispensary is Zero or not upto quantity to be dispensed");
                } else {
                  foundDrug.balance =
                    foundDrug.quantity - consultation.drugsObject[index].dispense;
                  foundDrug.consumed +=
                    consultation.drugsObject[index].quantity;
                  foundDrug.save(err => {
                    if (err) return next(err);
                  });
  
                  consultation.drugsObject[index].status = true;
                  consultation.save(err => {
                    if (err) return next(err);
                    const complete = consultation.drugsObject.map(status =>{
                      const rStatus = status.status
                      return rStatus;
                    })
                    let truthLength = complete.filter(v => v).length
                    if(truthLength === consultation.drugsObject.length){
                      consultation.pharmacyfinish = true;
                      consultation.save();
                      return res
                      .status(200)
                      .json({
                          data: consultation.drugsObject[index].status,
                          message: 'All drugs dispensed!'
                      })
                    }else{
                      return res
                      .status(200)
                      .json({
                          data: consultation.drugsObject[index].status,
                          message: "Drug dispensed successfully"
                      });
                    }
                  });
                }
              } else {
                res
                  .status(404)
                  .json("Drug not found in the NHIS Inpatient Inventory");
              }
            }
          );
        }else{
          Inpatient.findOne(
            { name: consultation.drugsObject[index].drugs.name },
            (err, gottenDrug) => {
              if (gottenDrug) {
                if (gottenDrug.balance <= 0 || gottenDrug.balance < consultation.drugsObject[index].quantity) {
                  return res
                    .status(400)
                    .json("Sorry, the balance in the dispensary is Zero or less than the quantity to be dispensed");
                } else {
                  gottenDrug.balance =
                    foundDrug.quantity - consultation.drugsObject[index].dispense;
                  gottenDrug.consumed +=
                    consultation.drugsObject[index].quantity;
                  gottenDrug.save(err => {
                    if (err) return next(err);
                  });
  
                  consultation.drugsObject[index].status = true;
                  consultation.save(err => {
                    if (err) return next(err);
                    const complete = consultation.drugsObject.map(status =>{
                      const rStatus = status.status
                      return rStatus;
                    })
                    let truthLength = complete.filter(v => v).length
                    if(truthLength === consultation.drugsObject.length){
                      consultation.pharmacyfinish = true;
                      consultation.save();
                      return res
                      .status(200)
                      .json({
                          data: consultation.drugsObject[index].status,
                          message: 'All drugs dispensed!'
                      })
                    }else{
                      return res
                      .status(200)
                      .json({
                          data: consultation.drugsObject[index].status,
                          message: "Drug dispensed successfully"
                      });
                    }
                  });
                }
              } else {
                res.status(404).json("Drug not found in the Inpatient Inventory");
              }
            }
          );
        }
      } else {
        return res.status(400).json("You are not allowed to dispense drugs!");
      }
    });
});

// Pharmacy drugs prescription
router.post('/json-prescription', middleware.isLoggedIn, (req, res, next)=>{
            const id = req.body.id
            Consultation.findOne({ _id: id })
                .populate('patient')
                .populate('doctor')
                .deepPopulate([
                    'drugsObject.drugs',
                    'patient.retainershipname',
                    'drugsObject.prescribedBy',
                    'drugsObject.drugs.name.pharmname'
                ])
             .exec((err, theconsultation)=>{
                if(err) return res.status(400).json('Error Prescribing, please create a consultation first!')
                const paid = new Paid({
                    drugs: req.body.drug_brand,
                    price: req.body.price,
                    patient: req.body.patientId
                })
                paid.save((err)=>{
                    if(err) return next (err)
                    if(req.body){
                        theconsultation.drugsObject.push({
                            paid: paid,
                            drugs: req.body.drug_brand,
                            startingdate: req.body.startingdate,
                            quantity: req.body.dosage,
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
                            return res.status(400).json(err.message)
                        }

                        return res.status(200).json({
                            data: theconsultation,
                            message: "Drugs added!"
                        })
                    })
                })
            })
        
})

// Liist of all consultations
router.get('/json-consultations', middleware.isLoggedIn, (req, res, next)=>{
    Consultation.find({})
    .sort('-updatedAt')
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
        if(err) return res.status(400).json(err.message)
        
        res.status(200).json(
            consultations
        )
    })
})

module.exports = router;
