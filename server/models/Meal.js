const { Schema, model } = require('mongoose');

const mealSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 300,
            trim: true,
            unique: true,
        },
        numberOfServing: {
            type: Number,
            required: false,
        },
        content: [
            {
                servings: {
                    type: Number,
                    require: true,
                },
                food: [
                    {
                        type: Schema.Types.ObjectId,
                        ref: 'Food',
                    }
                ],
            },
        ],
    }
)

const Meal = model('Meal', mealSchema);

module.exports = Meal;