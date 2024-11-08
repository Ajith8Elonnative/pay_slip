const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    salary:{
        type:String,
        required:true
    },
    payPeriod: {
        type: String
    },
    paymentDate: {
        type: String
    },
    paidDays: {
        type: String
    },
    lossOfPayDaysAndHour: {
        type: String
    },
    incomeTax: {
        type: String
    },
    loss: {
        type: String
    },
    pf: {
        type: String
    },
    performanceAndSpecialAllowens: {
        type: String
    },
    totalAmount: {
        type: String
    }
})

const payment = new mongoose.model('payment', schema)
module.exports = payment
