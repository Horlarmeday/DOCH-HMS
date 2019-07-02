const mongoose =  require('mongoose');

const hmoSchema = new mongoose.Schema({
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    hmostatus: {type: Boolean, default: true},
    hmoname: String,
    hmoenrols:[
       { 
         hmocode: String,
         hmoenrollee: String,
       }
    ],
    hmoservices:[
      { 
        service: String,
        price: Number,
      }
    ],
   hmodrugs:[
    { 
      drug: String,
      price: Number,
    }
   ],
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('HMO', hmoSchema);