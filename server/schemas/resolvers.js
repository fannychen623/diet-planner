const { Profile, User, Food, Meal, Planner } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id })
          .populate("profile")
          .populate({ path: 'meals', options: { sort: { title: 1 } } })
          .populate({ path: 'foods', options: { sort: { title: 1 } } })
          .populate({ path: 'planner', options: { sort: { date: 1 } } });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect email or password");
      }
      const token = signToken(user);
      return { token, user };
    },

    addProfile: async (parent, { age, sex, height, weight, activityLevel, goal, calories, carbs, fat, protein }, context) => {
      if (context.user) {
        const profile = await Profile.create(
          { age, sex, height, weight, activityLevel, goal, calories, carbs, fat, protein });
        await User.updateOne(
          { _id: context.user._id },
          { profile: profile._id }
        )
        return profile
      }
    },

    updateProfile: async (parent, { profileId, age, sex, height, weight, activityLevel, goal, calories, carbs, fat, protein }, context) => {
      if (context.user) {
        return await Profile.findOneAndUpdate(
          { _id: profileId },
          { age, sex, height, weight, activityLevel, goal, calories, carbs, fat, protein },
          { new: true }
        );
      }
    },

    addFood: async (parent, { title, servingSize, servingUnit, calories, carbs, fat, protein, sodium, sugar }, context) => {
      if (context.user) {
        const food = await Food.create(
          { title, servingSize, servingUnit, calories, carbs, fat, protein, sodium, sugar });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { foods: food._id } }
        );
        return food;
      }
    },

    updateFood: async (parent, { foodId, title, servingSize, servingUnit, calories, carbs, fat, protein, sodium, sugar }, context) => {
      if (context.user) {
        return Food.findOneAndUpdate(
          { _id: foodId },
          { title, servingSize, servingUnit, calories, carbs, fat, protein, sodium, sugar },
          { new: true }
        );
      }
    },

    removeFood: async (parent, { foodId }, context) => {
      if (context.user) {
        const food = await Food.findOneAndDelete(
          { _id: foodId });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { foods: food._id } }
        );
        return food;
      }
    },

    addMeal: async (parent, { title, numberOfServing }, context) => {
      if (context.user) {
        const meal = await Meal.create(
          { title, numberOfServing });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { meals: meal._id } }
        );
        return meal;
      }
    },

    addMealFood: async (parent, { mealId, servings, food }, context) => {
      if (context.user) {
        return Meal.findOneAndUpdate(
          { _id: mealId },
          { $addToSet: { content: { servings, food }, }, },
          { new: true, runValidators: true }
        );
      }
    },

    updateMeal: async (parent, { mealId, title, numberOfServing, content }, context) => {
      if (context.user) {
        return Meal.findOneAndUpdate(
          { _id: mealId },
          { title, numberOfServing, content },
          { new: true }
        );
      }
    },

    updateMealFood: async (parent, { mealId, servings, food }, context) => {
      if (context.user) {
        return Meal.findOneAndUpdate(
          { _id: mealId },
          { $addToSet: { content: { servings, food }, }, },
          { new: true }
        );
      }
    },

    removeMeal: async (parent, { mealId }, context) => {
      if (context.user) {
        const meal = await Meal.findOneAndDelete({
          _id: mealId,
        });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { meals: meal._id } }
        );
        return meal;
      }
      throw new AuthenticationError(
      );
    },

    addPlanner: async (parent, { date }, context) => {
      if (context.user) {
        const planner = await Planner.create({
          date,
        });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { planner: planner._id } }
        );
        return planner;
      }
    },

    addDiet: async (parent, { plannerId, title, numberOfServing }, context) => {
      if (context.user) {
        return Planner.findOneAndUpdate(
          { _id: plannerId },
          { $addToSet: { diet: { title: title, numberOfServing: numberOfServing }, }, },
          { new: true, runValidators: true }
        );
      }
    },

    addDietFood: async (parent, { dietId, servings, food }, context) => {
      if (context.user) {
        return Planner.findOneAndUpdate(
          { "diet._id": dietId },
          { $addToSet: { "diet.$.content": { servings, food }, }, },
          { new: true, runValidators: true }
        );
      }
    },

    updateDiet: async (parent, { dietId, title, numberOfServing, content }, context) => {
      if (context.user) {
        return Planner.findOneAndUpdate(
          { "diet._id": dietId },
          { "diet.$": { _id: dietId, title, numberOfServing, content } },
          { new: true },
        );
      }
    },

    updateDietFood: async (parent, { dietId, servings, food }, context) => {
      if (context.user) {
        return Planner.findOneAndUpdate(
          { "diet._id": dietId },
          { $addToSet: { "diet.$.content": { servings, food }, }, },
        );
      }
    },

    removeDiet: async (parent, { plannerId, dietId }, context) => {
      if (context.user) {
        return Planner.findOneAndUpdate(
          { _id: plannerId },
          { $pull: { diet: { _id: dietId, }, }, }
        );
      }
    },

    addCustomDiet: async (parent, { plannerId, title, calories, carbs, fat, protein, sodium, sugar }, context) => {
      if (context.user) {
        return Planner.findOneAndUpdate(
          { _id: plannerId },
          { $addToSet: { customDiet: { title, calories, carbs, fat, protein, sodium, sugar }, }, },
          { new: true, runValidators: true }
        );
      }
    },

    updateCustomDiet: async (parent, { customDietId, title, calories, carbs, fat, protein, sodium, sugar }, context) => {
      if (context.user) {
        return Planner.findOneAndUpdate(
          { "customDiet._id": customDietId },
          { "customDiet.$": { _id: customDietId, title, calories, carbs, fat, protein, sodium, sugar } },
          { new: true },
        );
      }
    },

    removeCustomDiet: async (parent, { plannerId, customDietId }, context) => {
      if (context.user) {
        return Planner.findOneAndUpdate(
          { _id: plannerId },
          { $pull: { customDiet: { _id: customDietId, }, }, }
        );
      }
    },

    addWeight: async (parent, { plannerId, weight }, context) => {
      if (context.user) {
        return Planner.findOneAndUpdate(
          { _id: plannerId },
          { $set: { weight: weight } },
          { new: true, runValidators: true }
        );
      }
    },

    removePlanner: async (parent, { plannerId }, context) => {
      if (context.user) {
        const planner = await Planner.findOneAndDelete(
          { _id: plannerId });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { planner: planner._id } }
        );
        return planner;
      }
    },
  },
};

module.exports = resolvers;