import { gql } from '@apollo/client'

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      profile {
        _id
        theme
        age
        sex
        height
        weight
        activityLevel
        goal
        calories
        carbs
        fat
        protein
      }
      foods {
        _id
        title
        servingSize
        servingUnit
        calories
        carbs
        fat
        protein
        sodium
        sugar
      }
      meals {
        _id
        title
        numberOfServing
        content {
          servings
          food
        }
      }
      planner {
        _id
        date
        diet {
          _id
          title
          numberOfServing
          content {
            servings
            title
            servingSize
            servingUnit
            calories
            carbs
            fat
            protein
            sodium
            sugar
          }
        }
        customDiet {
          _id
          title
          calories
          carbs
          fat
          protein
          sodium
          sugar
        }
        weight
      }
    }
  }
`;