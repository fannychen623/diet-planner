import { gql } from '@apollo/client'

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      profile {
        _id
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
          food {
            _id
          }
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
            food {
              _id
            }
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