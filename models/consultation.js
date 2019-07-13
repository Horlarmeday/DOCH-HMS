const mongoose =  require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose)
const consultationSchema = new mongoose.Schema({
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    drugsObject: [{
        drugs: {type: mongoose.Schema.Types.ObjectId, ref: "PharmacyItem"},
        startingdate: Date,
        quantity: String,
        medicineunit: String,
        unit: String,
        dose: String,
        time: String,
        notes: String,
        direction: String
    }],
    imaging: [{type: mongoose.Schema.Types.ObjectId, ref: "Imaging"}],
    visit: String,
    physical: {
        observation: String,
        chest: String,
        cvs: String,
        abdomen: String,
        mss: String,
        other: String
    },
    drugbrand: [],
    drugname: String,
    // prescription:{
    //     dose: String,
    //     duration: String,
    //     frequency: String,
    //     direction: String
    // },
    labpaid: {type: Boolean, default: false},
    pharmacypaid: {type: Boolean, default: false},
    imagingpaid: {type: Boolean, default: false},
    diagnosis: String,
    notes: String,
    labtestObject: [{type: mongoose.Schema.Types.ObjectId, ref: "Test"}],
    labresult: {
        //MICROBIOLOGY
        urine: {
            epitheliaresult: String,
            epitheliahsv: String,
            pusresult: String,
            pushsv: String,
            vaginalisresult: String,
            vaginalishsv: String,
            yeastresult: String,
            yeasthsv: String,
            rbcresult: String,
            rbchsv: String,
            castresult: String,
            castshsv: String,
            crystalsresult: String,
            crystalshsv: String,
            parasitesresult: String,
            parasiteshsv: String,
            othersresult: String,
            othershsv: String
        },
        urinalysis:{
            leukocytes: String,
            protein: String,
            glucose: String,
            blood: String,
            ph: String,
            ascorbicacid: String,
            urobilinogen: String,
            ketones: String,
            sgravity: String,
            bilirubin: String,
            nitrite: String,
        },
        stool:{
            puscells: String,
            rbc: String,
            ova: String,
            food: String,
            schistosoma: String,
            fob: String,
        },
        culture:{
            sputum: String,
            appearance: String,
            culture: String,
        },
        antibiotic:{
            ciprofloxacin1: String,
            ciprofloxacin2: String,
            ampiciline1: String,
            ampiciline2: String,
            Sparfloxacin1: String,
            Sparfloxacin2: String,
            Erythromycin1: String,
            Erythromycin2: String,
            Streptomycin1: String,
            Streptomycin2: String,
            Gentamycin1: String,
            Gentamycin2: String,
            Pefloxacin1: String,
            Pefloxacin2: String,
            Cotrimoxacole1: String,
            Cotrimoxacole2: String,
            Chloramphenicol1: String,
            Chloramphenicol2: String,
            Ampiclox1: String,
            Ampiclox2: String,
            Amoxicillin1: String,
            Amoxicillin2: String,
            Clavulanic1: String,
            Clavulanic2: String,
            Ofloxacin1: String,
            Ofloxacin2: String,
            Cefuroxime1: String,
            Cefuroxime2: String,
            Ceftriaxone1: String,
            Ceftriaxone2: String,
        },
        semenanalysis:{
            tproduced: {type: Date},
            treceived: {type: Date},
            tofanalysis: {type: Date},
            pabstinence: String,
            colour: String,
            viscosity: String,
            liquefaction: String,
            spillage: String,
            volume: String,
            odour: String,
            ph: String,
            puscells: String,
            rbc: String,
            celluladebris: String,
            spermatozoan: String,
            epithelialcells: String,
            active: String,
            sluggish: String,
            nonprogressive: String,
            deadcells: String,
            normalcells: String,
            abnormalcells: String,
            spermcount: String,
        },

        //HAEMATOLOGY AND SEROLOGY
        fbc1:{
            wbc: String,
            rbc: String,
            hgb: String,
            hct: String,
            mcv: String,
            mch: String,
            mchc: String,
            rdw: String,
            plt: String,
        },
        fbc2:{
            Neutrophils: String,
            Bands: String,
            Lymphocytes: String,
            atypical: String,
            Monocytes: String,
            Eosinophils: String,
            Basophils: String,
            text1: String,
            text2: String,
            text3: String,
            text4: String,
            text5: String,
        },
        tests:{
            pcv: String,
            esr: String,
            xmatching: String,
            bleedingtime: String,
            clottingtime: String,
            genotype: String,
            bloodgroup: String,
            prothrombintime: String,
            rvs: String,
            mp: String,
        },
        widalreaction:{
            salmonellaO: String,
            salmonellaH: String,
            paratyphiAO: String,
            paratyphiAH: String,
            paratyphiBO: String,
            paratyphiBH: String,
            paratyphiCO: String,
            paratyphiCH: String,
            signtitre: String,
        },
        serologytests:{
            pylori: String,
            rf: String,
            chlamydia: String,
            pgt: String,
            hbsag: String,
            hcv: String,
            vdrl: String,
        },

        //CHEMICAL PATHOLOGY
        seucranalysis:{
            Na: String,
            K: String,
            Cl: String,
            HCO: String,
            urea: String,
            Cr: String,
        },
        lipiprofile:{
            chol: String,
            vldl: String,
            hdl: String,
            tg: String,
            ldl: String,
            Cr: String,
        },
        lft:{
            ast: String,
            alt: String,
            alp: String,
            tp: String,
            alb: String,
            tb: String,
            db: String,
        },
        serum:{
            totalca2: String,
            uricacid: String,
            po42: String,
            mg2: String,
            iron: String,
            tibc: String,
            hbac: String,
            ionizedca2: String,
        },
        analyte:{
            urineprotein: String,
            csfglucose: String,
            csfprotein: String,
            asciticfluid: String,
            glucose: String,
            asciticfluidtotal: String,
            proteinfirst: String,
            csfchloride: String,
            thoururine: String,
            proteinsecond: String,
        },
        glucose:{
            fastingglu: String,
            randomglu: String,
            hrpp: String,
        },
        ogtt:{
            zeromin: String,
            sixtymin: String,
            onetwentymin: String,
            fasting: String,
            fastingdegree1: String,
            fastingdegree2: String,
            fastingdegree3: String,
            sixtymins: String,
            sixtyminsdegree1: String,
            sixtyminsdegree2: String,
            sixtyminsdegree3: String,
            onetwentymins: String,
            onetwentyminsdegree1: String,
            onetwentyminsdegree2: String,
            onetwentyminsdegree3: String,
            ageindaystotal: String,
            ageindaysdirect: String,
            ageindaystotalrange: String,
            ageindaysdirectrange: String,
            zeroto1daytotal: String,
            zeroto1daydirect: String,
            twoto3daystotal: String,
            twoto3daysdirect: String,
            threeto5daystotal: String,
            threeto5daysdirect: String,
            above5daystotal: String,
            above5daysdirect: String,
        },
    },
    // imaging: String,
    labtype: String,
    radiology: String,
    treatment: String,
    labstatus: {type: Boolean, default: false},
    pharmacystatus: {type: Boolean, default: false},
    imagingstatus: {type: Boolean, default: false},
    labtestfinish: {type: Boolean, default: false},
    pharmacyfinish: {type: Boolean, default: false},
    imagingfinish: {type: Boolean, default: false},
    status: {type: Boolean, default: false},
    prescriptionDate: {type: Date},
    imagingdate: {type: Date},
    labResultDate: {type: Date},
    created: {type: Date, default: Date.now}
});
//Populates schema to any level
consultationSchema.plugin(deepPopulate)
module.exports = mongoose.model('Consultation', consultationSchema);