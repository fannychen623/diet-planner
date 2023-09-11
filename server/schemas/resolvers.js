const { Profile, User, Post, Routine, Planner } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');


const resolvers = {
  Query: {
    users: async () => {
      return User.find()
        .populate("profile")
        .populate("meals")
        .populate("foods")
        .populate("planner");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .populate("profile")
        .populate("meals")
        .populate("foods")
        .populate("planner");
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id })
          .populate("profile")
          .populate("meals")
          .populate("foods")
          .populate("planner");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    profiles: async () => {
      return await Profile.find({});
    },
    profile: async (parent, { profileId }) => {
      return Profile.findOne({ _id: profileId });
    },
    myProfile: async (parent, args, context) => {
      if (context.user) {
        return Profile.findOne({ _id: context.user._id })
      }
      throw new AuthenticationError("You need to be logged in!")
    },
    meals: async () => {
      return Meal.find().sort({ name: 1 });
    },
    meal: async (parent, { mealId }) => {
      return Meal.findOne({ _id: mealId });
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
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    addProfile: async (
      parent,
      { age, sex, weight, height, goalWeight, activityLevel, calories },
      context
    ) => {
      if (context.user) {
        const profile = await Profile.create(
          { age, sex, weight, height, goalWeight, activityLevel, calories });
        await User.updateOne({ _id: context.user._id }, { profile: profile._id })
        return profile
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    updateProfile: async (
      parent,
      { profileId, age, sex, weight, height, goalWeight, activityLevel, calories },
      context
    ) => {
      if (context.user) {
        return await Profile.findOneAndUpdate(
          { _id: profileId },
          { age, sex, weight, height, goalWeight, activityLevel, calories },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    addFood: async (parent, { name, servingSize, servingUnit, calories, carbs, fat, protein, sodium, sugar }, context) => {
      if (context.user) {
        const food = await Food.create({
          name, 
          servingSize, 
          servingUnit, 
          calories, 
          carbs, 
          fat, 
          protein, 
          sodium, 
          sugar,
        });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { foods: food._id } }
        );
        return food;
      }
      throw new AuthenticationError("You need to be logged in to add food!");
    },
    updateFood: async (parent, { name, servingSize, servingUnit, calories, carbs, fat, protein, sodium, sugar }, context) => {
      if (context.user) {
        return Food.findOneAndUpdate(
          { _id: foodId },
          { $set: { name: name, servingSize: servingSize, servingUnit: servingUnit, calories: calories, carbs: carbs, fat: fat, protein: protein, sodium: sodium, sugar: sugar } },
          { new: true }
        );
      }
    },
    removeFood: async (parent, { foodId }, context) => {
      if (context.user) {
        const food = await Food.findOneAndDelete({
          _id: foodId,
        });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { foods: food._id } }
        );
        return food;
      }
      throw new AuthenticationError(
        "You need to be logged in to delete a routine!"
      );
    },
    addMeal: async (parent, { name, numberOfServing, food }, context) => {
      if (context.user) {
        const meal = await Meal.create(
          { name, numberOfServing, food, });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { meals: meal._id } }
        );
        return meal;
      }
      throw new AuthenticationError("You need to be logged in add a meal!");
    },
    updateMeal: async (parent, { name, numberOfServing, food }, context) => {
      if (context.user) {
        return Meal.findOneAndUpdate(
          { _id: mealId },
          { $set: { name: name, numberOfServing: numberOfServing, food: food } },
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
        "You need to be logged in to remove a meal!"
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
      throw new AuthenticationError("You need to be logged in to start tracking!");
    },
    addDiet: async (parent, { plannerId, type, numberOfServing, meal }, context) => {
      if (context.user) {
        return Planner.findOneAndUpdate(
          { _id: plannerId },
          { $addToSet: { diet: { type: type, numberOfServing: numberOfServing, meal: meal }, }, },
          { new: true, runValidators: true }
        );
      }
      throw new AuthenticationError("You need to be logged in to update routine!");
    },
    updateDiet: async (parent, { dietId, type, numberOfServing, meal }, context) => {
      if (context.user) {
        return await Planner.findOneAndUpdate(
          { "diet._id": dietId },
          { $set: { "diet.$.type": type, "diet.$.numberOfServing": numberOfServing, "diet.$.meal": meal } },
          { new: true }
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
      throw new AuthenticationError(
        "You need to be logged in to remove a scheduled routine!"
      );
    },
    addWeight: async (parent, { plannerId, weight }, context) => {
      if (context.user) {
        return Planner.findOneAndUpdate(
          { _id: plannerId },
          { $addToSet: { weight: weight } },
          { new: true, runValidators: true }
        );
      }
      throw new AuthenticationError("You need to be logged in to update routine!");
    },
    updateWeight: async (parent, { plannerId, weight }, context) => {
      if (context.user) {
        return Planner.findOneAndUpdate(
          { _id: plannerId },
          { $set: { weight: weight } },
          { new: true }
        );
      }
    },
    removeWeight: async (parent, { plannerId, weightId }, context) => {
      if (context.user) {
        return Planner.findOneAndUpdate(
          { _id: plannerId },
          { $pull: { weight: { _id: weightId, }, }, }
        );
      }
      throw new AuthenticationError(
        "You need to be logged in to remove a scheduled routine!"
      );
    },
    removePlanner: async (parent, { plannerId }, context) => {
      if (context.user) {
        const planner = await Planner.findOneAndDelete({
          _id: plannerId,
        });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { planner: planner._id } }
        );
        return planner;
      }
      throw new AuthenticationError(
        "You need to be logged in to delete a track!"
      );
    },
  },
};

module.exports = resolvers;