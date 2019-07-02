const mongoose =  require('mongoose');

const userDetailsSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    title: String,
    gender: String,
    dateofbirth: {type: Date},
    marital: String,
    education: String,
    state: String,
    lga: String,
    city: String,
    street: String,
    houseNo: String,
    address: String,
    personalInfoFilled: {type: Boolean, default: false},
    identity: String,
    upload: String,
    nextofkinname: String,
    relationship: String,
    nextofkinemail: String,
    nextofkinaddress: String,
    nextofkincity: String,
    nextofkinstreet: String,
    nextofkinhouseNo: String,
    nextofkinstate: String,
    nextofkinphone: Number,
    nextofkinFilled: {type: Boolean, default: false},
    employmentstatus: String,
    passport: String,
    employername: String,
    income: Number,
    industry: String,
    self_employed: String,
    occupation: String,
    bizname: String,
    bizaddress: String,
    altphone: Number,
    companyaddress: String,
    companyemail: String,
    companyphone: Number,
    workStatus: Boolean,
    estatus: String,
    workInformationFilled: {type: Boolean, default: false},
    accountnumber: String,
    accountname: String,
    bvn: String,
    bankname: String,
    backDetailsFilled: {type: Boolean, default: false},
    facebook: String,
    instagram: String
});

module.exports = mongoose.model('UserDetails', userDetailsSchema);