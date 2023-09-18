import { gql } from '@apollo/client'

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      profile {
        _id
        age
        sex
        weight
        height
        goalWeight
        calories
        activityLevel
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
        weight
      }
    }
  }
`;

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
        weight
        height
        goalWeight
        calories
        activityLevel
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
        weight
      }
    }
  }
`;

export const QUERY_MYPROFILE = gql`
  query myProfile {
    myProfile {
      _id
      age
      sex
      height
      weight
      goalWeight
      activityLevel
      calories
      carbs
      fat
      protein
      sodium
      sugar
    }
  }
`;

export const QUERY_PROFILES = gql`
  query allProfiles {
    profiles {
      _id
      age
      sex
      height
      weight
      goalWeight
      activityLevel
      calories
      carbs
      fat
      protein
      sodium
      sugar
    }
  }
`;

export const QUERY_SINGLE_PROFILE = gql`
  query singleProfile($profileId: ID!) {
    profile(profileId: $profileId) {
      _id
      age
      sex
      height
      weight
      goalWeight
      activityLevel
      calories
      carbs
      fat
      protein
      sodium
      sugar
    }
}
`
