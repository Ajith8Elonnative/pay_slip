const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    empId: {
        type: String,
        required: true
    },
    empName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    empDesignation: {
        type: String,
        required: true
    },
    accountNo: {
        type: String
    },
    bankName: {
        type: String
    },
    branch: {
        type: String
    },
    ifscCode: {
        type: String
    }
})
const result = new mongoose.model('elonEmployee', schema)
module.exports = result