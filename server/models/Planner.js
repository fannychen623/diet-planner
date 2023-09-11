const { Schema, model } = require('mongoose');

const plannerSchema = new Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  diet: [
    {
      type: {
        type: String,
        require: false,
      },
      numberOfServing: {
        type: Number,
        required: false,
      },
      meal: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Meal',
        }
      ],
    },
  ],
  weight: {
    type: Number,
    required: false,
  },
});

const Planner = model('Planner', plannerSchema)

module.exports = Planner; 