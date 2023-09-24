import { gql } from '@apollo/client'

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }

    }
  }
`;

export const ADD_PROFILE = gql`
  mutation addProfile($age: Int!, $sex: String!, $height: Float!, $weight: Float!, $activityLevel: String!, $goal: String!, $calories: Int!, $carbs: Int!, $fat: Int!, $protein: Int!) {
    addProfile(age: $age, sex: $sex, weight: $weight, height: $height, activityLevel: $activityLevel, goal: $goal, calories: $calories, carbs: $carbs, fat: $fat, protein: $protein) {
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
}
`;

export const UPDATE_PROFILE = gql`
  mutation updateProfile($profileId: ID!, $age: Int!, $sex: String!, $height: Float!, $weight: Float!, $activityLevel: String!, $goal: String!, $calories: Int!, $carbs: Int!, $fat: Int!, $protein: Int!) {
    updateProfile(profileId: $profileId, age: $age, sex: $sex, height: $height, weight: $weight, activityLevel: $activityLevel, goal: $goal, calories: $calories, carbs: $carbs, fat: $fat, protein: $protein) {
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
  }
`;

export const ADD_FOOD = gql`
  mutation addFood($title: String!, $servingSize: Float!, $servingUnit: String!, $calories: Float!, $carbs: Float!, $fat: Float!, $protein: Float!, $sodium: Float!, $sugar: Float!) {
    addFood(title: $title, servingSize: $servingSize, servingUnit: $servingUnit, calories: $calories, carbs: $carbs, fat: $fat, protein: $protein, sodium: $sodium, sugar: $sugar) {
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
  }
`;

export const UPDATE_FOOD = gql`
  mutation updateFood($foodId: ID!, $title: String!, $servingSize: Float!, $servingUnit: String!, $calories: Float!, $carbs: Float!, $fat: Float!, $protein: Float!, $sodium: Float!, $sugar: Float!) {
    updateFood(foodId: $foodId, title: $title, servingSize: $servingSize, servingUnit: $servingUnit, calories: $calories, carbs: $carbs, fat: $fat, protein: $protein, sodium: $sodium, sugar: $sugar) {
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
  }
`;

export const REMOVE_FOOD = gql`
    mutation removeFood($foodId: ID!) {
      removeFood(foodId: $foodId) {
        _id
      }
    }
`;

export const ADD_MEAL = gql`
  mutation addMeal($title: String!, $numberOfServing: Float!) {
    addMeal(title: $title, numberOfServing: $numberOfServing) {
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
  }
`;

export const ADD_MEAL_FOOD = gql`
  mutation addMealFood($mealId: ID!, $servings: Float!, $food: ID!) {
    addMealFood(mealId: $mealId, servings: $servings, food: $food) {
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
  }
`;

export const UPDATE_MEAL = gql`
  mutation updateMeal($mealId: ID!, $title: String!, $numberOfServing: Float!, $content: [[Float]]) {
    updateMeal(mealId: $mealId, title: $title, numberOfServing: $numberOfServing, content: $content) {
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
  }
`;

export const UPDATE_MEAL_FOOD = gql`
  mutation updateMealFood($mealId: ID!, $servings: Float!, $food: ID!) {
    updateMealFood(mealId: $mealId, servings: $servings, food: $food) {
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
  }
`;

export const REMOVE_MEAL = gql`
    mutation removeMeal($mealId: ID!){
      removeMeal(mealId: $mealId){
        _id
      }
    }
`;

export const ADD_PLANNER = gql`
  mutation addPlanner($date: String!) {
    addPlanner(date: $date) {
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
`;

export const ADD_DIET = gql`
  mutation addDiet($plannerId: ID!, $title: String!, $numberOfServing: Float!) {
    addDiet(plannerId: $plannerId, title: $title, numberOfServing: $numberOfServing) {
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
`;

export const ADD_DIET_FOOD = gql`
  mutation addDietFood($dietId: ID!, $servings: Float!, $food: ID!) {
    addDietFood(dietId: $dietId, servings: $servings, food: $food) {
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
`;

export const UPDATE_DIET = gql`
  mutation updateDiet($dietId: ID!, $title: String!, $numberOfServing: Float!, $content: [[Float]]) {
    updateDiet(dietId: $dietId, title: $title, numberOfServing: $numberOfServing, content: $content) {
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
`;

export const UPDATE_DIET_FOOD = gql`
  mutation updateDietFood($dietId: ID!, $servings: Float!, $food: ID!) {
    updateDietFood(dietId: $dietId, servings: $servings, food: $food) {
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
`;

export const REMOVE_DIET = gql`
    mutation removeDiet($plannerId: ID!, $dietId: ID!) {
      removeDiet(plannerId: $plannerId, dietId: $dietId) {
        _id
      }
    }
`;

export const ADD_WEIGHT = gql`
  mutation addWeight($plannerId: ID!, $weight: Float!) {
    addWeight(plannerId: $plannerId, weight: $weight) {
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
`;

export const ADD_POST = gql`
    mutation addPost($title: String!, $text: String!){
        addPost(title: $title, text: $text){
            _id
            title
            text
            author
            createdAt
        }
    }
`

export const UPDATE_POST = gql`
    mutation updatePost($postId: ID!, $title: String!, $text: String!){
      updatePost(postId: $postId, title: $title, text: $text){
        _id
        title
        text
      }
    }
`
export const REMOVE_POST = gql`
    mutation removePost($postId: ID!){
      removePost(postId: $postId){
        _id
      }
    }
`;

export const ADD_COMMENT = gql`
    mutation addComment($postId: ID!, $commentText: String!){
        addComment(postId: $postId, commentText: $commentText){
            _id
            title
            text
            comments {
                _id
                commentText
                commentAuthor
                commentCreatedAt
            }
        }
    }
`

export const REMOVE_COMMENT = gql`
    mutation removeComment($postId: ID!, $commentId: ID!){
      removeComment(postId: $postId, commentId: $commentId){
        _id
      }
    }
`

export const ADD_LIKE = gql`
    mutation addLike($postId: ID!){
      addLike(postId: $postId){
        _id
        likes{
          _id
        }
      }
    }
`
export const REMOVE_LIKE = gql`
    mutation removeLike($postId: ID!){
      removeLike(postId: $postId){
        _id
      }
    }
`;

export const ADD_TRACKER = gql`
  mutation addTracker($date: String!) {
    addTracker(date: $date) {
      _id
      date
      scheduledRoutines {
        _id
        routineName
        complete
      }
      weight
      calorie
    }
  }
`;

export const UPDATE_TRACKER = gql`
  mutation updateTracker($trackerId: ID!, $weight: Int, $calorie: Int) {
    updateTracker(trackerId: $trackerId, weight: $weight, calorie: $calorie) {
      _id
      weight
      calorie
    }
  }
`;

export const REMOVE_TRACKER = gql`
  mutation removeTracker($trackerId: ID!) {
    removeTracker(trackerId: $trackerId) {
      _id
    }
  }
`;

export const ADD_SCHEDULED_ROUTINES = gql`
  mutation addScheduledRoutines($trackerId: ID!, $routineName: String!) {
    addScheduledRoutines(trackerId: $trackerId, routineName: $routineName) {
      _id
      date
      scheduledRoutines {
        _id
        routineName
        complete
      }
      weight
      calorie
    }
  }
`;

export const UPDATE_SCHEDULED_ROUTINES = gql`
  mutation updateScheduledRoutines($scheduledRoutinesId: ID!, $complete: Boolean!) {
    updateScheduledRoutines(scheduledRoutinesId: $scheduledRoutinesId, complete: $complete) {
      _id
      scheduledRoutines {
        _id
        routineName
        complete
      }
    }
  }
`;

export const REMOVE_SCHEDULED_ROUTINES = gql`
  mutation removeScheduledRoutines($trackerId: ID!, $scheduledRoutinesId: ID!) {
    removeScheduledRoutines(trackerId: $trackerId, scheduledRoutinesId: $scheduledRoutinesId) {
      _id
    }
  }
`;