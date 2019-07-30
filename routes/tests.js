const router = require('express').Router();
const async = require('async');
const User = require('../models/user')
const mongoose = require('mongoose')
const Department = require('../models/department')
const Appointment = require('../models/appointment')
const Consultation = require('../models/consultation')
const SMS = require('../models/sms')
const ANC = require('../models/anc')
const Theater = require('../models/theater')
const Vendor = require('../models/vendor')
const Imaging = require('../models/imaging')
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


//**************** *******/
// MICROBIOLOGY TEST RESLUTS
//**************** ********/
//Microbiology
router.get('/microbiology-result/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[user.consultations.length -1]._id}, (err, consultation)=>{
            let result = Object.keys(consultation.labresult);
            console.log(result)
            // console.log(consultation)
            res.render('app/add/form', {user, consultation})
        }) 
    })
})


//URINE TEST
router.post('/urine-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[user.consultations.length -1]._id}, (err, consultation)=>{
            
            consultation.labresult.urine = {
                // type: req.body.type,
                epitheliaresult: req.body.epitheliaresult,
                epitheliahsv: req.body.epitheliahsv,
                pusresult: req.body.pusresult,
                pushsv: req.body.pushsv,
                vaginalisresult: req.body.vaginalisresult,
                vaginalishsv: req.body.vaginalishsv,
                yeastresult: req.body.yeastresult,
                yeasthsv: req.body.yeasthsv,
                rbcresult: req.body.rbcresult,
                rbchsv: req.body.rbchsv,
                castresult: req.body.castresult,
                castshsv: req.body.castshsv,
                crystalsresult: req.body.crystalsresult,
                crystalshsv: req.body.crystalshsv,
                parasitesresult: req.body.parasitesresult,
                parasiteshsv: req.body.parasiteshsv,
                othersresult: req.body.othersresult,
                othershsv: req.body.othershsv
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Urine test result submitted successfully!')
                res.redirect('/microbiology-result/' + req.params.id)
            })
        }) 
    })
})

//URINALYSIS
router.post('/urinalysis-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            consultation.labresult.urinalysis = {
                appearance: req.body.appearance,
                leukocytes: req.body.leukocytes,
                protein: req.body.protein,
                glucose: req.body.glucose,
                blood: req.body.blood,
                ph: req.body.ph,
                ascorbicacid: req.body.ascorbicacid,
                urobilinogen: req.body.urobilinogen,
                ketones: req.body.ketones,
                sgravity: req.body.sgravity,
                bilirubin: req.body.bilirubin,
                nitrite: req.body.nitrite,
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Urinalysis test result submitted successfully!')
                res.redirect('/microbiology-result/' + req.params.id)
            })
        }) 
    })
})

//STOOL ANALYSIS
router.post('/stool-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            consultation.labresult.stool = {
                appearance: req.body.appearance,
                puscells: req.body.puscells,
                rbc: req.body.rbc,
                ova: req.body.ova,
                food: req.body.food,
                schistosoma: req.body.schistosoma,
                fob: req.body.fob,
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Stool test result submitted successfully!')
                res.redirect('/microbiology-result/' + req.params.id)
            })
        }) 
    })
})

//CULTURE
router.post('/culture/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            consultation.labresult.culture = {
                sputum: req.body.sputum,
                appearance: req.body.appearance,
                culture: req.body.culture,
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Culture result submitted successfully!')
                res.redirect('/microbiology-result/' + req.params.id)
            })
        }) 
    })
})

//ANTIBIOTIC SUGGESTIONS
router.post('/antibiotic/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            consultation.labresult.antibiotic = {
                ciprofloxacin1: req.body.ciprofloxacin1,
                ciprofloxacin2: req.body.ciprofloxacin2,
                ampiciline1: req.body.ampiciline1,
                ampiciline2: req.body.ampiciline2,
                Sparfloxacin1: req.body.Sparfloxacin1,
                Sparfloxacin2: req.body.Sparfloxacin2,
                Erythromycin1: req.body.Erythromycin1,
                Erythromycin2: req.body.Erythromycin2,
                Streptomycin1: req.body.Streptomycin1,
                Streptomycin2: req.body.Streptomycin2,
                Gentamycin1: req.body.Gentamycin1,
                Gentamycin2: req.body.Gentamycin2,
                Pefloxacin1: req.body.Pefloxacin1,
                Pefloxacin2: req.body.Pefloxacin2,
                Cotrimoxacole1: req.body.Cotrimoxacole1,
                Cotrimoxacole2: req.body.Cotrimoxacole2,
                Chloramphenicol1: req.body.Chloramphenicol1,
                Chloramphenicol2: req.body.Chloramphenicol2,
                Ampiclox1: req.body.Ampiclox1,
                Ampiclox2: req.body.Ampiclox2,
                Amoxicillin1: req.body.Amoxicillin1,
                Amoxicillin2: req.body.Amoxicillin2,
                Clavulanic1: req.body.Clavulanic1,
                Clavulanic2: req.body.Clavulanic2,
                Ofloxacin1: req.body.Ofloxacin1,
                Ofloxacin2: req.body.Ofloxacin2,
                Cefuroxime1: req.body.Cefuroxime1,
                Cefuroxime2: req.body.Cefuroxime2,
                Ceftriaxone1: req.body.Ceftriaxone1,
                Ceftriaxone2: req.body.Ceftriaxone2,
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Antibiotic suggestions result submitted successfully!')
                res.redirect('/microbiology-result/' + req.params.id)
            })
        }) 
    })
})

//SEMEN ANALYSIS
router.post('/semen-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            consultation.labresult.semenanalysis = {
                tproduced: req.body.tproduced,
                treceived: req.body.treceived,
                tofanalysis: req.body.tofanalysis,
                pabstinence: req.body.pabstinence,
                colour: req.body.colour,
                viscosity: req.body.viscosity,
                liquefaction: req.body.liquefaction,
                spillage: req.body.spillage,
                volume: req.body.volume,
                odour: req.body.odour,
                ph: req.body.ph,
                puscells: req.body.puscells,
                rbc: req.body.rbc,
                celluladebris: req.body.celluladebris,
                spermatozoan: req.body.spermatozoan,
                epithelialcells: req.body.epithelialcells,
                active: req.body.active,
                sluggish: req.body.sluggish,
                nonprogressive: req.body.nonprogressive,
                deadcells: req.body.deadcells,
                normalcells: req.body.normalcells,
                abnormalcells: req.body.abnormalcells,
                spermcount: req.body.spermcount,
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Semen analysis result submitted successfully!')
                res.redirect('/microbiology-result/' + req.params.id)
            })
        }) 
    })
})

//**************** *******/
// HAEMATOLOGY TEST RESLUTS
//**************** ********/

//Haematology and serology
router.get('/haematology-result/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            // console.log(consultation)
            res.render('app/add/form1', {user, consultation})
        }) 
    })
})

//FBC1 TEST
router.post('/fbcone-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            consultation.labresult.fbc1 = {
                wbc: req.body.wbc,
                rbc: req.body.rbc,
                hgb: req.body.hgb,
                hct: req.body.hct,
                mcv: req.body.mcv,
                mch: req.body.mch,
                mchc: req.body.mchc,
                rdw: req.body.rdw,
                plt: req.body.plt,
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'FBC test result submitted successfully!')
                res.redirect('/haematology-result/' + req.params.id)
            })
        }) 
    })
})

//FBC2 TEST
router.post('/fbctwo-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            consultation.labresult.fbc2 = {
                Neutrophils: req.body.Neutrophils,
                Bands: req.body.Bands,
                Lymphocytes: req.body.Lymphocytes,
                atypical: req.body.atypical,
                Monocytes: req.body.Monocytes,
                Eosinophils: req.body.Eosinophils,
                Basophils: req.body.Basophils,
                text1: req.body.text1,
                text2: req.body.text2,
                text3: req.body.text3,
                text4: req.body.text4,
                text5: req.body.text5,
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'FBC test result submitted successfully!')
                res.redirect('/haematology-result/' + req.params.id)
            })
        }) 
    })
})

//TESTS
router.post('/tests-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            consultation.labresult.tests = {
                pcv: req.body.pcv,
                esr: req.body.esr,
                xmatching: req.body.xmatching,
                bleedingtime: req.body.bleedingtime,
                clottingtime: req.body.clottingtime,
                genotype: req.body.genotype,
                bloodgroup: req.body.bloodgroup,
                prothrombintime: req.body.prothrombintime,
                rvs: req.body.rvs,
                mp: req.body.mp,
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Tests result submitted successfully!')
                res.redirect('/haematology-result/' + req.params.id)
            })
        }) 
    })
})

//WIDAL REACTION TEST
router.post('/widal-reaction-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            consultation.labresult.widalreaction = {
                salmonellaO: req.body.salmonellaO,
                salmonellaH: req.body.salmonellaH,
                paratyphiAO: req.body.paratyphiAO,
                paratyphiAH: req.body.paratyphiAH,
                paratyphiBO: req.body.paratyphiBO,
                paratyphiBH: req.body.paratyphiBH,
                paratyphiCO: req.body.paratyphiCO,
                paratyphiCH: req.body.paratyphiCH,
                signtitre: req.body.signtitre,
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Widal reaction test result submitted successfully!')
                res.redirect('/haematology-result/' + req.params.id)
            })
        }) 
    })
})

//SEROLOGY TEST
router.post('/serology-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            consultation.labresult.serologytests = {
                pylori: req.body.pylori,
                rf: req.body.rf,
                chlamydia: req.body.chlamydia,
                pgt: req.body.pgt,
                hbsag: req.body.hbsag,
                hcv: req.body.hcv,
                vdrl: req.body.vdrl,
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Serology tests result submitted successfully!')
                res.redirect('/haematology-result/' + req.params.id)
            })
        }) 
    })
})


//**************** *******/
// CHEMICAL PATHOLOGY RESLUTS
//**************** ********/


//Chemical pathology
router.get('/chemical-pathology-result/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            // console.log(consultation)
            res.render('app/add/form2', {user, consultation})
        }) 
    })
})

//S/E/U/Cr TEST
router.post('/seucranalysis-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            consultation.labresult.seucranalysis = {
                Na: req.body.Na,
                K: req.body.K,
                Cl: req.body.Cl,
                HCO: req.body.HCO,
                urea: req.body.urea,
                Cr: req.body.Cr,
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'S/E/U/Cr test result submitted successfully!')
                res.redirect('/chemical-pathology-result/' + req.params.id)
            })
        }) 
    })
})

//LIPID PROFILE TEST
router.post('/lipid-profile-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            consultation.labresult.lipiprofile = {
                chol: req.body.chol,
                vldl: req.body.vldl,
                hdl: req.body.hdl,
                tg: req.body.tg,
                ldl: req.body.ldl,
                Cr: req.body.Cr,
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Lipid Profile test result submitted successfully!')
                res.redirect('/chemical-pathology-result/' + req.params.id)
            })
        }) 
    })
})

//LFT TEST
router.post('/lft-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            consultation.labresult.lft = {
                ast: req.body.ast,
                alt: req.body.alt,
                alp: req.body.alp,
                tp: req.body.tp,
                alb: req.body.alb,
                tb: req.body.tb,
                db: req.body.db,
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'LFT test result submitted successfully!')
                res.redirect('/chemical-pathology-result/' + req.params.id)
            })
        }) 
    })
})

//SERUM TEST
router.post('/serum-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            consultation.labresult.serum = {
                totalca2: req.body.totalca2,
                uricacid: req.body.uricacid,
                po42: req.body.po42,
                mg2: req.body.mg2,
                iron: req.body.iron,
                tibc: req.body.tibc,
                hbac: req.body.hbac,
                ionizedca2: req.body.ionizedca2,
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Serum test result submitted successfully!')
                res.redirect('/chemical-pathology-result/' + req.params.id)
            })
        }) 
    })
})

//ANALYTE TEST
router.post('/analyte-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            consultation.labresult.analyte = {
                urineprotein: req.body.urineprotein,
                csfglucose: req.body.csfglucose,
                csfprotein: req.body.csfprotein,
                asciticfluid: req.body.asciticfluid,
                glucose: req.body.glucose,
                asciticfluidtotal: req.body.asciticfluidtotal,
                proteinfirst: req.body.proteinfirst,
                csfchloride: req.body.csfchloride,
                thoururine: req.body.thoururine,
                proteinsecond: req.body.proteinsecond,
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Analyte test result submitted successfully!')
                res.redirect('/chemical-pathology-result/' + req.params.id)
            })
        }) 
    })
})

//GLUCOSE TEST
router.post('/glucose-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            consultation.labresult.glucose = {
                fastingglu: req.body.fastingglu,
                randomglu: req.body.randomglu,
                hrpp: req.body.hrpp,
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Glucose test result submitted successfully!')
                res.redirect('/chemical-pathology-result/' + req.params.id)
            })
        }) 
    })
})

//OGTT TEST
router.post('/ogtt-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('consultations')
    .exec((err, user)=>{
        if(err) return next (err)
        Consultation.findOne({_id: user.consultations[0]._id}, (err, consultation)=>{
            consultation.labresult.ogtt = {
                zeromin: req.body.zeromin,
                sixtymin: req.body.sixtymin,
                onetwentymin: req.body.onetwentymin,
                fasting: req.body.fasting,
                fastingdegree1: req.body.fastingdegree1,
                fastingdegree2: req.body.fastingdegree2,
                fastingdegree3: req.body.fastingdegree3,
                sixtymins: req.body.sixtymins,
                sixtyminsdegree1: req.body.sixtyminsdegree1,
                sixtyminsdegree2: req.body.sixtyminsdegree2,
                sixtyminsdegree3: req.body.sixtyminsdegree3,
                onetwentymins: req.body.onetwentymins,
                onetwentyminsdegree1: req.body.onetwentyminsdegree1,
                onetwentyminsdegree2: req.body.onetwentyminsdegree2,
                onetwentyminsdegree3: req.body.onetwentyminsdegree3,
                ageindaystotal: req.body.ageindaystotal,
                ageindaysdirect: req.body.ageindaysdirect,
                ageindaystotalrange: req.body.ageindaystotalrange,
                ageindaysdirectrange: req.body.ageindaysdirectrange,
                zeroto1daytotal: req.body.zeroto1daytotal,
                zeroto1daydirect: req.body.zeroto1daydirect,
                twoto3daystotal: req.body.twoto3daystotal,
                twoto3daysdirect: req.body.twoto3daysdirect,
                threeto5daystotal: req.body.threeto5daystotal,
                threeto5daysdirect: req.body.threeto5daysdirect,
                above5daystotal: req.body.above5daystotal,
                above5daysdirect: req.body.above5daysdirect,
            }
            consultation.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Serum test result submitted successfully!')
                res.redirect('/chemical-pathology-result/' + req.params.id)
            })
        }) 
    })
})

//**************** *******/
// ANC TEST RESLUTS
//**************** ********/
//ANC LAB TESTS
router.get('/anc-result/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('ancs')
    .exec((err, user)=>{
        if(err) return next (err)
        ANC.findOne({_id: user.ancs[user.ancs.length -1]._id}, (err, anc)=>{
            // console.log(consultation)
            res.render('app/add/add_anc_lab_result', {user, anc})
        }) 
    })
})


//URINALYSIS ANC TEST
router.post('/anc-urinalysis-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('ancs')
    .exec((err, user)=>{
        if(err) return next (err)
        ANC.findOne({_id: user.ancs[0]._id}, (err, anc)=>{
            anc.labresult.urinalysis = {
                appearance: req.body.appearance,
                leukocytes: req.body.leukocytes,
                protein: req.body.protein,
                glucose: req.body.glucose,
                blood: req.body.blood,
                ph: req.body.ph,
                ascorbicacid: req.body.ascorbicacid,
                urobilinogen: req.body.urobilinogen,
                ketones: req.body.ketones,
                sgravity: req.body.sgravity,
                bilirubin: req.body.bilirubin,
                nitrite: req.body.nitrite,
            }
            anc.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Urinalysis test result submitted successfully!')
                res.redirect('/anc-result/' + req.params.id)
            })
        }) 
    })
})

//TESTS
router.post('/anc-tests/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('ancs')
    .exec((err, user)=>{
        if(err) return next (err)
        ANC.findOne({_id: user.ancs[0]._id}, (err, anc)=>{
            anc.labresult.tests = {
                pcv: req.body.pcv,
                genotype: req.body.genotype,
                bloodgroup: req.body.bloodgroup,
                mp: req.body.mp,
            }
            anc.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Tests result submitted successfully!')
                res.redirect('/anc-result/' + req.params.id)
            })
        }) 
    })
})

//ANC SEROLOGY TEST
router.post('/anc-serology-test/:id', middleware.isLoggedIn, (req, res, next)=>{
    User.findOne({_id: req.params.id})
    .populate('ancs')
    .exec((err, user)=>{
        if(err) return next (err)
        ANC.findOne({_id: user.ancs[0]._id}, (err, anc)=>{
            anc.labresult.serologytests = {
                pylori: req.body.pylori,
                rf: req.body.rf,
                chlamydia: req.body.chlamydia,
                pgt: req.body.pgt,
                hbsag: req.body.hbsag,
                hcv: req.body.hcv,
                vdrl: req.body.vdrl,
            }
            anc.save((err)=>{
                if(err) return next (err)
                req.flash('success', 'Serology tests result submitted successfully!')
                res.redirect('/anc-result/' + req.params.id)
            })
        }) 
    })
})
module.exports = router