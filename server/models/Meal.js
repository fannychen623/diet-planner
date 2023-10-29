const { Schema, model } = require('mongoose');

const mealSchema = new Schema(
    {
        title: {
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
        content: [
            {
                _id: false,
                servings: {
                    type: Number,
                    require: true,
                },
                food: {
                    type: Schema.Types.ObjectId,
                    _id: false,
                    ref: 'Food',
                },
            },
        ],
    }
)

const Meal = model('Meal', mealSchema);

module.exports = Meal;