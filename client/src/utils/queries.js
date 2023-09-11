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
        name
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
        name
        numberOfServing
        food {
          _id
        }
      }
      planner {
        _id
        date
        diet {
          _id
          type
          numberOfServing
          meal
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
        name
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
        name
        numberOfServing
        food {
          _id
        }
      }
      planner {
        _id
        date
        diet {
          _id
          type
          numberOfServing
          meal
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
      weight
      height
      goalWeight
      calories
      activityLevel
    }
  }
`;

export const QUERY_PROFILES = gql`
  query allProfiles {
    profiles {
        _id
        age
        sex
        weight
        height
        goalWeight
        activityLevel
        calories
    }
  }
`;

export const QUERY_SINGLE_PROFILE = gql`
  query singleProfile($profileId: ID!) {
    profile(profileId: $profileId) {
       _id
        age
        sex
        weight
        height
        goalWeight
        calories
        activityLevel

    }
}
`
