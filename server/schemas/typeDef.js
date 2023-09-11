const { gql } = require('apollo-server-express')

const typeDef = gql`

  type Auth {
    token: ID!
    user: User
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    profile: Profile
    foods: [Food]
    meals: [Meal]
    planner: [Planner]
  }

  type Profile {
    _id: ID!
    age: Int!
    sex: String!
    weight: Int!
    height: Int!
    goalWeight: Int!
    activityLevel: Float!
    calories: Int
  }

  type Food {
    _id: ID!
    name: String!
    servingSize: Int!
    servingUnit: String!
    calories: Int!
    carbs: Int!
    fat: Int!
    protein: Int!
    sodium: Int!
    sugar: Int!
  }

  type Meal {
    _id: ID
    name: String!
    numberOfServing: Int!
    food: [Food]
  }
  
  type Planner {
    _id: ID!
    date: String!
    diet: [Diet]
    weight: Int
  }

  type Diet {
    _id: ID
    type: String!
    numberOfServing: Int!
    meal: String!
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    myProfile: Profile
    profiles: [Profile]
    profile(profileId: ID!): Profile
    foods: [Food]
    meals: [Meal]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addProfile(age: Int!, sex: String!, weight: Int!, height: Int!, goalWeight: Int!, activityLevel: Float!, calories: Int): Profile
    updateProfile(profileId: ID!, age: Int, sex: String, weight: Int, height: Int, goalWeight: Int, activityLevel: Float, calories: Int): Profile
    addFood(name: String!, servingSize: Int!, servingUnit: String!, calories: Int!, carbs: Int!, fat: Int!, protein: Int!, sodium: Int!, sugar: Int!): Food
    removeFood(foodId: ID!): Food
    addMeal(name: String!, numberOfServing: Int!, food: String!): Meal
    updateMeal(mealId: ID!, name: String!, numberOfServing: Int!, food: String!): Meal
    removeMeal(mealId: ID!): Meal
    addPlanner(date: String!): Planner
    removePlanner(plannerId: ID!): Planner
    addDiet(plannerId: ID!, type: String!, numberOfServing: Int!, meal: String!): Planner
    updateDiet(dietId: ID!, type: String!, numberOfServing: Int!, meal: String!): Planner
    removeDiet(plannerId: ID!, dietId: ID!): Planner
    addWeight(plannerId: ID!, weight: Int!): Planner
    updateWeight(plannerId: ID!, weight: Int!): Planner
    removeWeight(plannerId: ID!, weight: ID!): Planner
  }
`;

module.exports = typeDef;