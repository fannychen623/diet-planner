const { Schema, model } = require('mongoose');


const profileSchema = new Schema(
    {
    age: {
        type: Number,
        required: true,
    },
    sex: {
        type: String, 
        required: true,
    },
    height: {
        type: Number,
        required: true, 
    },
    weight: {
        type: Number,
        required: true,
    },
    goalWeight: {
        type: Number, 
        required: true,
    },
    activityLevel: {
        type: Number, 
        required: true,
    },
    calories: {
        type: Number,
        required: true
    },
    carbs: {
        type: Number,
        required: true
    },
    fat: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    sodium: {
        type: Number,
        required: true
    },
    sugar: {
        type: Number,
        required: true
    }
}
);

const Profile = model('Profile', profileSchema)

module.exports = Profile; 