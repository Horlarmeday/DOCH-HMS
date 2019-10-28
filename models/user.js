const mongoose = require("mongoose");
const deepPopulate = require('mongoose-deep-populate')(mongoose)
const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
    email:{type: String, lowercase: true},
    username: {type: String, unique: true},
    isVerified: {type: Boolean, default: false},
    createdby: Number,
    firstname: String,
    cardtype: String,
    lastname: String,
    password: String,
    mstatus: String,
    phonenumber: {type: Number, unique: true},
    gender: String,
    religion: String,
    address: String,
    lga: String,
    nextofkinname: String,
    nextofkinphone: String,
    nextofkinaddress: String,
    relationship: String,
    allergies: [],
    state: String,
    thestate: String,
    country: String,
    ward: String,
    department: String,
    birthday: {type: Date},
    workerId: String,
    vendorId: String,
    company: String,
    patientId: String,
    oldpatientId: String,
    passwordResetToken: String,
    account:{
        paid: {type: Boolean, default: false},
        registration: {type: Number, default: 0},
        consultation: {type: Number, default: 0},
    },
    family: [
        
    ],
    hmodependant:[
       
    ],
    passwordResetExpires: Date,
    photo: String,
    status: {type: Boolean, default: true},
    addmitted: {type: Boolean, default: false},
    discharge: {type: Boolean, default: false},
    emergency: {type: Boolean, default: false},
    retainership: String,
    
    patientcode: String,
    hmoname: String,
    role: Number,
    appointments: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Appointment"
    }],
    userdetails:[{
        type: mongoose.Schema.Types.ObjectId, ref: "UserDetails"
    }],
    triages:[{
        type: mongoose.Schema.Types.ObjectId, ref: "Triage"
    }],
    consultations:[{
        type: mongoose.Schema.Types.ObjectId, ref: "Consultation"
    }],
    reports:[{
        type: mongoose.Schema.Types.ObjectId, ref: "Report"
    }],
    visits:[{
        type: mongoose.Schema.Types.ObjectId, ref: "Visit"
    }],
    sms:[{
        type: mongoose.Schema.Types.ObjectId, ref: "SMS"
    }],
    payments:[{
        type: mongoose.Schema.Types.ObjectId, ref: "Payment"
    }],
    ancs:[{
        type: mongoose.Schema.Types.ObjectId, ref: "ANC"
    }],
    treatments:[{
        type: mongoose.Schema.Types.ObjectId, ref: "Treatment"
    }],
    theaters:[{
        type: mongoose.Schema.Types.ObjectId, ref: "Theater"
    }],
    assessments:[{
        type: mongoose.Schema.Types.ObjectId, ref: "Assessment"
    }],
    immunizations:[{
        type: mongoose.Schema.Types.ObjectId, ref: "Immunization"
    }],
    iocharts:[{
        type: mongoose.Schema.Types.ObjectId, ref: "Iochart"
    }],
    supplies:[{
        type: mongoose.Schema.Types.ObjectId, ref: "Supply"
    }],
    wardrounds:[{
        type: mongoose.Schema.Types.ObjectId, ref: "WardRound"
    }],
    registeredby:{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    retainershipname:{
        type: mongoose.Schema.Types.ObjectId, ref: "HMO"
    }
}, { timestamps: true });

UserSchema.pre("save", function (next) {
    var user = this;
    if(!user.isModified("password")) return next();
    if(user.password){
        bcrypt.genSalt(10, function(err, salt) {
            if(err) return next();
            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if(err) return next();
                user.password = hash;
                next(err);
            });
        });
    }
});



//Schema to associate user image to email
UserSchema.methods.gravatar = function(size) {
    if(!size) size = 200;
    if(!this.email) return "https://gravatar.com/avatar/?s=" + size + "&d=retro";
    var md5 = crypto.createHash("md5").update(this.email).digest("hex");
    return "https://gravatar.com/avatar/" + md5 + "?s=" + size + "&d=retro";
};

//Schema to comparing user inputed Password and the passsword in the DB
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}
//Populates schema to any level
UserSchema.plugin(deepPopulate)
module.exports = mongoose.model("User", UserSchema);