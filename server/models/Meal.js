const { Schema, model } = require('mongoose');

const mealSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 300,
            trim: true,
        },
        numberOfServing: {
            type: Number,
            required: false,
        },
        food: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Food',
            }
        ],
    }
)

const Meal = model('Meal', mealSchema);

module.exports = Meal;