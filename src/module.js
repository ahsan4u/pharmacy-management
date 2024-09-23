const mongoose = require('mongoose');

const Bills = mongoose.model('bills', mongoose.Schema({
    username:{type: String, default: 'unknown'},
    totalAmount: {type: String},
    pendingAmount: {type: String},
    products: [],
}));

const expirationSchema = new mongoose.Schema({
    qty: {type: String, required: true},
    price: {type: String, required: true},
    exp: {type: String, required: true}
});
const Medicines = mongoose.model('medicines', mongoose.Schema({
    name: {type: String, required: true},
    formula: {type: String, required: true},
    date: [expirationSchema]
}));

module.exports = {Medicines, Bills};