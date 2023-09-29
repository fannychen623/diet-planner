// import package
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'

// importy query
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { UPDATE_MEAL, UPDATE_MEAL_FOOD } from '../utils/mutations';

// // import local component
// import FoodCards from '../components/FoodCards';

// import package components
import {
  chakra, Flex, Box, Spacer, Heading, Button, Spinner, IconButton,
  Input, InputGroup, InputLeftElement, InputLeftAddon, InputRightAddon, Text, Tooltip,
  Checkbox, useCheckbox, useCheckboxGroup,
  Popover, PopoverTrigger, PopoverContent, PopoverHeader,
  PopoverBody, PopoverFooter, PopoverArrow,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  NumberInput, NumberInputField,
  NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
} from '@chakra-ui/react'

// import icons
import {
  FiSearch, FiPlusSquare, FiMinusSquare, FiInfo,
} from 'react-icons/fi';

// import local style sheet
import '../styles/NewEditMeal.css';

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

// functional component for the foods page
const EditMeal = () => {

  // emulates a fetch (useQuery expects a Promise)
  // used to re-query data and re-render page on event listener/change
  const emulateFetch = _ => {
    return new Promise(resolve => {
      resolve([{ data: 'ok' }]);
    });
  };

  // query all data associated with the signed in user
  const { loading, data, refetch } = useQuery(QUERY_ME, emulateFetch, {
    refetchOnWindowFocus: false,
    // enabled set to true allows query to run on page initialization
    enabled: true
  });

  // define the postId from the url parameter
  const { mealId } = useParams();

  // define add routine mutation
  const [updateMeal, { mealError, mealData }] = useMutation(UPDATE_MEAL);
  const [updateMealFood, { mealFoodError, mealFoodData }] = useMutation(UPDATE_MEAL_FOOD);

  const [errorMessage, setErrorMessage] = useState('')

  const { isOpen, onOpen, onClose } = useDisclosure()

  // extract the foods from the query data
  const foods = data?.me.foods || [];
  const meals = data?.me.meals || [];
  const meal = meals[meals.findIndex(meal => meal._id === mealId)]

  // set state of combined preview text
  const [foodPreview, setFoodPreview] = useState('')

  const [mealDetails, setMealDetails] = useState({ title: meal.title, numberOfServing: meal.numberOfServing })

  const [total, setTotal] = useState({
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
    sodium: 0,
    sugar: 0,
  });

  const getMealFood = () => {
    let mealContent = meal.content
    let mealFoodServings = mealContent.map(thisMeal => thisMeal.servings)
    let mealFoodIds = mealContent.map(thisMeal => thisMeal.food[0]._id)
    let mealFoodAdded = []
    for (let i = 0; i < mealContent.length; i++) {
      let foodIndex = foods.findIndex(food => food._id === mealFoodIds[i])
      mealFoodAdded.push({
        id: mealFoodIds[i],
        title: foods[foodIndex].title,
        servingSizeUnit: foods[foodIndex].servingSize + ' ' + foods[foodIndex].servingUnit,
        servings: mealFoodServings[i],
        calories: foods[foodIndex].calories,
        carbs: foods[foodIndex].carbs,
        fat: foods[foodIndex].fat,
        protein: foods[foodIndex].protein,
        sodium: foods[foodIndex].sodium,
        sugar: foods[foodIndex].sugar,
      })
    }
    return mealFoodAdded
  }

  const [foodAdded, setFoodAdded] = useState(getMealFood())

  const getFoodList = () => {
    let mealContent = meal.content
    let mealFoodIds = mealContent.map(thisMeal => thisMeal.food[0]._id)
    let mealFoodAdded = foods
    for (let i = 0; i < mealFoodIds.length; i++) {
      mealFoodAdded = mealFoodAdded.filter((food) => food._id != mealFoodIds[i])
    }
    return mealFoodAdded
  }

  const [foodsList, setFoodList] = useState(getFoodList())
  const [displayState, setDisplayState] = useState(Array(foodsList.length).fill(true))
  const [searchValue, setSearchValue] = useState('')

  const [checkedState, setCheckedState] = useState(Array(foodsList.length).fill(false))

  useEffect(() => {

    setDisplayState(Array(foodsList.length).fill(true))
    for (let i = 0; i < foodsList.length; i++) {
      if (foodsList[i].title.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
        displayState[i] = true
      } else {
        displayState[i] = false
      }
    }

    setDisplayState({ ...displayState })

    let newTotal = { calories: 0, carbs: 0, fat: 0, protein: 0, sodium: 0, sugar: 0 }

    for (let i = 0; i < foodAdded.length; i++) {
      newTotal.calories += foods[foods.findIndex(food => food._id === foodAdded[i].id)].calories
      newTotal.carbs += foods[foods.findIndex(food => food._id === foodAdded[i].id)].carbs
      newTotal.fat += foods[foods.findIndex(food => food._id === foodAdded[i].id)].fat
      newTotal.protein += foods[foods.findIndex(food => food._id === foodAdded[i].id)].protein
      newTotal.sodium += foods[foods.findIndex(food => food._id === foodAdded[i].id)].sodium
      newTotal.sugar += foods[foods.findIndex(food => food._id === foodAdded[i].id)].sugar
    }

    setTotal({
      calories: +parseFloat(newTotal.calories).toFixed(2),
      carbs: +parseFloat(newTotal.carbs).toFixed(2),
      fat: +parseFloat(newTotal.fat).toFixed(2),
      protein: +parseFloat(newTotal.protein).toFixed(2),
      sodium: +parseFloat(newTotal.sodium).toFixed(2),
      sugar: +parseFloat(newTotal.sugar).toFixed(2)
    })
  }, [foodAdded, foodsList, foods, searchValue]);

  const handleChangeState = (event) => {
    event.preventDefault()
    const { value } = event.target

    let checkboxStates = []
    for (var i = 0; i < foodsList.length; i++) {
      if (foodsList[i].title === value) {
        checkboxStates.push(!checkedState[i])
      } else {
        checkboxStates.push(checkedState[i])
      }
    };

    setCheckedState(checkboxStates)
  }

  // function to add workout to combined routine text
  const getFoodPreview = (index) => {
    setFoodPreview(
      'Serving Size: ' + foods[index].servingSize + ' ' + foods[index].servingUnit + '\n' +
      'Calories (kcal): ' + foods[index].calories + '\n' +
      'Carbs (g): ' + foods[index].carbs + '\n' +
      'Fat (g): ' + foods[index].fat + '\n' +
      'Protein (g): ' + foods[index].protein + '\n' +
      'Sodium (mg): ' + foods[index].sodium + '\n' +
      'Sugar (g): ' + foods[index].sugar
    )
    return foodPreview
  };

  const handleAddFoods = async (event) => {
    event.preventDefault()

    // loop through all the checked routines to add
    for (let i = 0; i < checkedState.length; i++) {
      if (checkedState[i]) {
        let foodIndex = foods.findIndex(food => food.title === foodsList[i].title)
        if (foodAdded.indexOf(foods[foodIndex]._id) === -1) {
          foodAdded.push({
            id: foods[foodIndex]._id,
            title: foods[foodIndex].title,
            servingSizeUnit: foods[foodIndex].servingSize + ' ' + foods[foodIndex].servingUnit,
            servings: 1,
            calories: foods[foodIndex].calories,
            carbs: foods[foodIndex].carbs,
            fat: foods[foodIndex].fat,
            protein: foods[foodIndex].protein,
            sodium: foods[foodIndex].sodium,
            sugar: foods[foodIndex].sugar,
          })
        }
        checkedState[i] = false
        setFoodList(foods => foods.filter((food) => food.title != foodsList[i].title))
      }
    }

    onClose()
  };

  const handleUpdateServings = async (event) => {
    event.preventDefault()
    const { id, value } = event.target

    if (value) {
      for (let i = 0; i < foodAdded.length; i++) {
        if (foodAdded[i].id === id) {
          foodAdded[i].servings = parseFloat(value);
          foodAdded[i].calories = foods[foods.findIndex(food => food._id === id)].calories * value;
          foodAdded[i].carbs = foods[foods.findIndex(food => food._id === id)].carbs * value;
          foodAdded[i].fat = foods[foods.findIndex(food => food._id === id)].fat * value;
          foodAdded[i].protein = foods[foods.findIndex(food => food._id === id)].protein * value;
          foodAdded[i].sodium = foods[foods.findIndex(food => food._id === id)].sodium * value;
          foodAdded[i].sugar = foods[foods.findIndex(food => food._id === id)].sugar * value
        }
      }
      let newTotal = { calories: 0, carbs: 0, fat: 0, protein: 0, sodium: 0, sugar: 0 }

      for (let i = 0; i < foodAdded.length; i++) {
        newTotal.calories += foods[foods.findIndex(food => food._id === foodAdded[i].id)].calories * foodAdded[i].servings
        newTotal.carbs += foods[foods.findIndex(food => food._id === foodAdded[i].id)].carbs * foodAdded[i].servings
        newTotal.fat += foods[foods.findIndex(food => food._id === foodAdded[i].id)].fat * foodAdded[i].servings
        newTotal.protein += foods[foods.findIndex(food => food._id === foodAdded[i].id)].protein * foodAdded[i].servings
        newTotal.sodium += foods[foods.findIndex(food => food._id === foodAdded[i].id)].sodium * foodAdded[i].servings
        newTotal.sugar += foods[foods.findIndex(food => food._id === foodAdded[i].id)].sugar * foodAdded[i].servings
      }

      setTotal({
        calories: +parseFloat(newTotal.calories).toFixed(2),
        carbs: +parseFloat(newTotal.carbs).toFixed(2),
        fat: +parseFloat(newTotal.fat).toFixed(2),
        protein: +parseFloat(newTotal.protein).toFixed(2),
        sodium: +parseFloat(newTotal.sodium).toFixed(2),
        sugar: +parseFloat(newTotal.sugar).toFixed(2)
      })

    }
  };

  const handleRemoveFood = async (event) => {
    event.preventDefault()
    const { id } = event.target

    if (id !== '') {
      foodsList.push(foods[foods.findIndex(food => food._id === id)])
      setFoodAdded(foodAdded.filter((item) => item.id !== id))
    }
  };

  const handleUpdateMeal = async (event) => {
    event.preventDefault()

    let error = false
    if (foodAdded.length === 0) {
      setErrorMessage('Error: Must add at least 1 food');
      error = true
    }
    for (let i = 0; i < foodAdded.length; i++) {
      if (foodAdded[i].servings <= 0 || isNaN(foodAdded[i].servings)) {
        setErrorMessage('Error: Invalid/Missing specific servings of food');
        error = true
      }
    }

    if (!error) {
      try {
        // add routine with variables routineNanem and routine
        const { mealData } = await updateMeal({
          variables: { mealId, title: mealDetails.title, numberOfServing: parseFloat(mealDetails.numberOfServing), content: [] },

          onCompleted(mealData) {
            handleUpdateMealFood()
          }
        });

      } catch (e) {
        console.error(e);
        if (mealDetails.title === '') { setErrorMessage('Error: Missing meal name') }
        if (mealDetails.numberOfServing <= 0) { setErrorMessage('Error: Invalid number of serving input') }
      }
    }
  };

  const handleUpdateMealFood = async () => {
    for (let i = 0; i < foodAdded.length; i++) {
      let servings = parseFloat(foodAdded[i].servings)
      let food = foodAdded[i].id

      try {
        // add routine with variables routineNanem and routine
        const { mealFoodData } = await updateMealFood({
          variables: { mealId, servings, food },
        });

      } catch (e) {
        console.error(e)
      }
    }
    // redirect back to the routines page
    window.location.assign('/meal');
  };

  return (
    <Box className='edit-meal-page'>
      <Heading>Modify Meal</Heading>
      <Flex>
        <Box>
          <InputGroup>
            <InputLeftAddon children='Meal Name' />
            <Input
              type='text'
              name='title'
              placeholder='i.e. Protein Shake'
              value={mealDetails.title}
              onChange={(e) => { setMealDetails({ ...mealDetails, title: toTitleCase(e.target.value) }) }}
            />
          </InputGroup>
        </Box>
        <Spacer />
        <Box>
          <InputGroup>
            <InputLeftAddon children='Number of Serving' />
            <NumberInput
              defaultValue={mealDetails.numberOfServing}
              min={0.25}
              precision={2}
              step={0.25}
              width='100%'
              onChange={(e) => { setMealDetails({ ...mealDetails, numberOfServing: e }) }}
            >
              <NumberInputField />
              <NumberInputStepper >
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </InputGroup>
        </Box>
      </Flex>
      <Box>
        <TableContainer width='fit-content' m='auto'>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th></Th>
                <Th text>Food</Th>
                <Th isNumeric># of Serving</Th>
                <Th>Serving Size</Th>
                <Th isNumeric>Calories (kcal)</Th>
                <Th isNumeric>Carbs (g)</Th>
                <Th isNumeric>Fat (g)</Th>
                <Th isNumeric>Protein (g)</Th>
                <Th isNumeric>Sodium (mg)</Th>
                <Th isNumeric>Sugar (g)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {foodAdded.map((addFood, index) => (
                <Tr>
                  <Td>
                    <IconButton
                      size='md'
                      icon={<FiMinusSquare p='100%' />}
                      id={addFood.id}
                      onClick={handleRemoveFood}
                    />
                  </Td>
                  <Td>{addFood.title}</Td>
                  <Td isNumeric>
                    <Input
                      width='auto'
                      textAlign='center'
                      defaultValue={addFood.servings}
                      id={addFood.id}
                      onChange={handleUpdateServings}
                    />
                  </Td>
                  <Td>{addFood.servingSizeUnit}</Td>
                  <Td isNumeric>{+parseFloat(addFood.calories).toFixed(2)}</Td>
                  <Td isNumeric>{+parseFloat(addFood.carbs).toFixed(2)}</Td>
                  <Td isNumeric>{+parseFloat(addFood.fat).toFixed(2)}</Td>
                  <Td isNumeric>{+parseFloat(addFood.protein).toFixed(2)}</Td>
                  <Td isNumeric>{+parseFloat(addFood.sodium).toFixed(2)}</Td>
                  <Td isNumeric>{+parseFloat(addFood.sugar).toFixed(2)}</Td>
                </Tr>
              ))}
              <Tr>
                <Td>
                  <IconButton
                    size='md'
                    icon={<FiPlusSquare p='100%' />}
                    onClick={onOpen}
                  />
                </Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
              <Tr className='meal-total'>
                <Td></Td>
                <Td>Total</Td>
                <Td></Td>
                <Td></Td>
                <Td isNumeric>{total.calories}</Td>
                <Td isNumeric>{total.carbs}</Td>
                <Td isNumeric>{total.fat}</Td>
                <Td isNumeric>{total.protein}</Td>
                <Td isNumeric>{total.sodium}</Td>
                <Td isNumeric>{total.sugar}</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Text textAlign='center'>{errorMessage}</Text>
      </Box>
      <Box textAlign='center'>
        <Button variant='solid' onClick={handleUpdateMeal}>Update Meal</Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className='meal-modal'>
          <ModalHeader>
            My Foods
            <Box>
              <InputGroup>
                <InputLeftElement pointerEvents='none'>
                  <FiSearch color='var(--shade5)' />
                </InputLeftElement>
                {/* <Input onChange={(e) => { setSearchValue(e.target.value) }} /> */}
              </InputGroup>
            </Box>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY='auto' maxHeight='50vh' >
            {foodsList.map((food, index) => (
              <>
              {displayState[`${index}`] ? (
              <Flex key={food._id}
                justifyContent='space-between'
                alignItems='center'
              >
                <Box>
                  <Checkbox
                    value={food.title}
                    isChecked={checkedState[index]}
                    onChange={handleChangeState}
                  >
                    {food.title}
                  </Checkbox>
                </Box>
                <Box>
                  <Popover onOpen={() => { getFoodPreview(index) }}>
                    <PopoverTrigger>
                      <IconButton
                        aria-label={food.title}
                        icon={<FiInfo p='100%' />}
                      />
                    </PopoverTrigger>
                    <PopoverContent width='fit-content' border='none'>
                      <PopoverBody>{foodPreview}</PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Box>
              </Flex>
              ):(
                <></>
              )}
              </>
            ))}
          </ModalBody>
          <ModalFooter justifyContent='spaced-between'>
            <Button onClick={onClose}>
              Close
            </Button>
            <Spacer />
            <Button
              onClick={handleAddFoods}
            >
              Add Food(s)
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default EditMeal;