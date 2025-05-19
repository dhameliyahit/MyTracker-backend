const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });


const TripSchema = new mongoose.Schema({  
    title: {
        type: String,
        required: true,
    },
    mobileNumber:{
        type:String,
        required:true,
        unique:true,
    },
    expenses: [ExpenseSchema],
 }, { timestamps: true });

const Trip = mongoose.model('Trip', TripSchema);

module.exports = Trip;
