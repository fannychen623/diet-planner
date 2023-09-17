const { Schema, model } = require('mongoose');
const { format } = require('date-fns');

const plannerSchema = new Schema({
  date: {
    type: Date,
    required: true,
    // unique: true,
    get: (date)=> format(date, 'MM/dd/yyyy')
  },
  diet: [
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
    },
  ],
  weight: {
    type: Number,
    required: false,
  },
});

const Planner = model('Planner', plannerSchema)

module.exports = Planner; 