const { Schema, model } = require('mongoose');

const foodSchema = new Schema(
    {
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 300,
        trim: true,
    },
    servingSize: {
        type: Number,
        required: true,
    },
    servingUnit: {
        type: String,
        required: true,
    },
    calories: {
        type: Number, 
        required: true,
    },
    carbs: {
        type: Number,
        required: true,
    },
    fat: {
        type: Number, 
        required: true,
    },
    protein: {
        type: Number,
        required: true,
    },
    sodium: {
        type: Number, 
        required: true,
    },
    sugar: {
        type: Number,
        required: true,
    },
}
);

const Food = model('Food', foodSchema)

module.exports = Food; 