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
    height: Float!
    weight: Float!
    activityLevel: String!
    goal: String!
    calories: Int!
    carbs: Int!
    fat: Int!
    protein: Int!
  }

  type Food {
    _id: ID!
    title: String!
    servingSize: Float!
    servingUnit: String!
    calories: Float!
    carbs: Float!
    fat: Float!
    protein: Float!
    sodium: Float!
    sugar: Float!
  }
  
  type Meal {
    _id: ID
    title: String!
    numberOfServing: Float!
    content: [Content]
  }

  type Content {
    servings: Float!
    food: [Food]
  }
  
  type Planner {
    _id: ID!
    date: String!
    diet: [Diet]
    customDiet: [customDiet]
    weight: Float
  }

  type Diet {
    _id: ID!
    title: String!
    numberOfServing: Float!
    content: [Content]
  }

  type customDiet {
    _id: ID!
    title: String!
    calories: Float!
    carbs: Float
    fat: Float
    protein: Float
    sodium: Float
    sugar: Float
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    myProfile: Profile
    profiles: [Profile]
    profile(profileId: ID!): Profile
    foods: [Food]
    food: [Food]
    meals: [Meal]
    meal: [Meal]
  }

  type Mutation {
    addUser(
      username: String!, 
      email: String!, 
      password: String!
    ): Auth

    login(
      email: String!, 
      password: String!
    ): Auth

    addProfile(
      age: Int!, 
      sex: String!, 
      height: Float!, 
      weight: Float!,
      activityLevel: String!, 
      goal: String!,
      calories: Int!,
      carbs: Int!,
      fat: Int!,
      protein: Int!
    ): Profile

    updateProfile(
      profileId: ID!, 
      age: Int!, 
      sex: String!, 
      height: Float!, 
      weight: Float!,
      activityLevel: String!, 
      goal: String!,
      calories: Int!,
      carbs: Int!,
      fat: Int!,
      protein: Int!
    ): Profile

    addFood(
      title: String!, 
      servingSize: Float!, 
      servingUnit: String!, 
      calories: Float!, 
      carbs: Float!, 
      fat: Float!, 
      protein: Float!, 
      sodium: Float!, 
      sugar: Float!
    ): Food

    updateFood(
      foodId: ID!, 
      title: String!, 
      servingSize: Float!, 
      servingUnit: String!, 
      calories: Float!, 
      carbs: Float!, 
      fat: Float!, 
      protein: Float!, 
      sodium: Float!, 
      sugar: Float!
    ): Food

    removeFood(
      foodId: ID!
    ): Food

    addMeal(
      title: String!, 
      numberOfServing: Float!
    ): Meal

    addMealFood(
      mealId: ID!, 
      servings: Float!, 
      food: ID!
    ): Meal

    updateMeal(
      mealId: ID!, 
      title: String!, 
      numberOfServing: Float!, 
      content: [[Float]]
    ): Meal

    updateMealFood(
      mealId: ID!, 
      servings: Float!, 
      food: ID!
    ): Meal

    removeMeal(
      mealId: ID!
    ): Meal

    addPlanner(
      date: String!
    ): Planner

    removePlanner(
      plannerId: ID!
    ): Planner

    addDiet(
      plannerId: ID!, 
      title: String!, 
      numberOfServing: Float!,
    ): Planner

    addDietFood(
      dietId: ID!, 
      servings: Float!, 
      food: ID!
    ): Planner

    updateDiet(
      dietId: ID!, 
      title: String!, 
      numberOfServing: Float!, 
      content: [[Float]]
    ): Planner

    updateDietFood(
      dietId: ID!, 
      servings: Float!, 
      food: ID!
    ): Planner

    removeDiet(
      plannerId: ID!,
      dietId: ID!
    ): Planner

    addCustomDiet(
      plannerId: ID!
      title: String!
      calories: Float
      carbs: Float
      fat: Float,
      protein: Float,
      sodium: Float,
      sugar: Float
    ): Planner

    updateCustomDiet(
      customDietId: ID!
      title: String!
      calories: Float
      carbs: Float
      fat: Float,
      protein: Float,
      sodium: Float,
      sugar: Float
    ): Planner

    removeCustomDiet(
      plannerId: ID!,
      customDietId: ID!
    ): Planner

    addWeight(
      plannerId: ID!, 
      weight: Float!
    ): Planner
    
  }
`;

module.exports = typeDef;