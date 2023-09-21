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
    title: String!
    numberOfServing: Int!
    content: [Content]
  }

  type Content {
    servings: Int!
    food: [Food]
  }
  
  type Planner {
    _id: ID!
    date: String!
    diet: [Diet]
    weight: Int
  }

  type Diet {
    _id: ID!
    title: String!
    numberOfServing: Int!
    content: [Content]
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
      servingSize: Int!, 
      servingUnit: String!, 
      calories: Int!, 
      carbs: Int!, 
      fat: Int!, 
      protein: Int!, 
      sodium: Int!, 
      sugar: Int!
    ): Food

    updateFood(
      foodId: ID!, 
      title: String!, 
      servingSize: Int!, 
      servingUnit: String!, 
      calories: Int!, 
      carbs: Int!, 
      fat: Int!, 
      protein: Int!, 
      sodium: Int!, 
      sugar: Int!
    ): Food

    removeFood(
      foodId: ID!
    ): Food

    addMeal(
      title: String!, 
      numberOfServing: Int!
    ): Meal

    addMealFood(
      mealId: ID!, 
      servings: Int!, 
      food: ID!
    ): Meal

    updateMeal(
      mealId: ID!, 
      title: String!, 
      numberOfServing: Int!, 
      content: [[Float]]
    ): Meal

    updateMealFood(
      mealId: ID!, 
      servings: Int!, 
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
      numberOfServing: Int!,
    ): Planner

    addDietFood(
      dietId: ID!, 
      servings: Int!, 
      food: ID!
    ): Planner
    removeDietFood(
      plannerId: ID!
      dietId: ID!
    ): Planner

    addWeight(
      plannerId: ID!, 
      weight: Int!
    ): Planner
    
    updateDiet(
      dietId: ID!, 
      numberOfServing: Int!, 
      meal: String!
    ): Planner
    removeDiet(
      plannerId: ID!, 
      dietId: ID!
    ): Planner
    
  }
`;

module.exports = typeDef;