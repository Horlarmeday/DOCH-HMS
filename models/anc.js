const mongoose =  require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose)

const ancSchema = new mongoose.Schema({
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ancId: String,
    occupation: String,
    age: Number,
    gravida: String,
    parity: String,
    lmp: Date,
    edd: Date,
    medicalhistory: String,
    surgicalhistory: String,
    bloodtransfusion: String,
    familyhistory: String,
    labtest: [{type: mongoose.Schema.Types.ObjectId, ref: "Test"}],
    labtype: String,
    delivery: {
        modeofdelivery: String,
        dateofdelivery: Date,
        duration: String,
        conditionofmother: String,
        onemin: String,
        tenmin: String,
        fivemin: String,
        birthweight: Number,
        sex: String,
        conditionofbaby: String,
        placeofdelivery: String,
        conducted: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        vitaminAmother: String,
        vitaminAbaby: String,
        immunizationdate: Date,
        bcg: String,
        opvo: String,
        notifieddate: Date
    },
    postnatal: {
        bp: String,
        temp: String,
        pulse: String,
        respiration: String,
        generalcondition: String,
        involutionofuterus: String,
        lochia: String,
        episotomy: String,
        pelvicexam: String,
        smeardate: Date,
        result: String,
        hb: String,
        babycondition: String,
        wt: String,
        reflexes: String,
        feeding: String,
        umbilicalcord: String,
    },
    previouspregnancy:[
        {
            year: String,
            deliveryplace: String,
            maturity: String,
            duration: String,
            delivery: String,
            weight: String,
            sex: String,
            fate: String,
            puerperium: String,
        }
    ],
    presentpregnancy:[{
        thedate: {type: Date},
        weight: Number,
        urinalysis: String,
        bp: String,
        pallor: String,
        maturity: String,
        fundalheight: String,
        presentation: String,
        fetalheartrate: String,
        oedema: String,
        comments: String,
        tcadate: {type: Date},
        initial: String,
        datetaken: {type: Date, default: Date.now}
    }],
    clinicalnotes: [
        {
            clinicalnotes: String,
            datetaken: {type: Date, default: Date.now}
       }
    ],
    
    treatment: [{
        tt1: {type: Date},
        tt1next: {type: Date},
        tt2: {type: Date},
        tt2next: {type: Date},
        tt3: {type: Date},
        tt3next: {type: Date},
        tt4: {type: Date},
        tt4next: {type: Date},
        tt5: {type: Date},
        tt5next: {type: Date},
        malariaipt1: {type: Date},
        malariaipt1next: {type: Date},
        malariaipt2: {type: Date},
        malariaipt2next: {type: Date},
        datetaken: {type: Date, default: Date.now}
    }],
    datesgiven:[{
        ironfolate: {type: Date},
        multivitamin: {type: Date},
        datetaken: {type: Date, default: Date.now}
    }],
    taken: {type: Boolean, default: false},
    ancpaid: {type: Boolean, default: false},
    status: {type: Boolean, default: true},
    created: {type: Date, default: Date.now}
});

//Populates schema to any level
ancSchema.plugin(deepPopulate)
module.exports = mongoose.model('ANC', ancSchema);