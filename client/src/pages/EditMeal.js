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
  Input, InputGroup, InputLeftAddon, InputRightAddon, Text, Tooltip,
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
  FiCheck, FiX, FiEdit, FiTrash2,
  FiPlusSquare, FiMinusSquare, FiInfo,
  FiExternalLink, FiEye, FiEdit3
} from 'react-icons/fi';

// import local style sheet
import '../styles/Meal.css';

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

  const [checkedState, setCheckedState] = useState(Array(foodsList.length).fill(false))

  useEffect(() => {
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
      calories: newTotal.calories,
      carbs: newTotal.carbs,
      fat: newTotal.fat,
      protein: newTotal.protein,
      sodium: newTotal.sodium,
      sugar: newTotal.sugar
    })
  }, [foodAdded, foodsList, foods]);

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
          foodAdded[i].servings = parseInt(value);
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
        calories: newTotal.calories,
        carbs: newTotal.carbs,
        fat: newTotal.fat,
        protein: newTotal.protein,
        sodium: newTotal.sodium,
        sugar: newTotal.sugar
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
          variables: { mealId, ...mealDetails, content: [] },

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
      let servings = parseInt(foodAdded[i].servings)
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
    <Box className='new-meal-page'>
      <Heading size='2xl' mb='5vh'>Modify Meal</Heading>
      <Flex mb='5'>
        <Box>
          <InputGroup size='lg' width='65vw' borderWidth='2px' borderColor='var(--shade5)' borderRadius='10'>
            <InputLeftAddon children='Meal Name' bg='var(--shade3)' />
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
          <InputGroup size='lg' width='25vw' borderWidth='2px' borderColor='var(--shade5)' borderRadius='10'>
            <InputLeftAddon children='Number of Serving' bg='var(--shade3)' />
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
      <Box mt='5vh'>
        <TableContainer width='fit-content' m='auto'>
          <Table variant='simple' size='md'>
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
            <Tbody fontSize='1.75vw'>
              {foodAdded.map((addFood, index) => (
                <Tr>
                  <Td>
                    <IconButton
                      size='md'
                      bg='var(--shade1)'
                      color='var(--shade5)'
                      _hover={{ bg: 'var(--shade6)', color: 'var(--shade2)' }}
                      icon={<FiMinusSquare p='100%' />}
                      id={addFood.id}
                      onClick={handleRemoveFood}
                    />
                  </Td>
                  <Td>{addFood.title}</Td>
                  <Td isNumeric>
                    <Input
                      htmlSize={4}
                      width='auto'
                      textAlign='center'
                      defaultValue={1}
                      id={addFood.id}
                      onChange={handleUpdateServings}
                    />
                  </Td>
                  <Td>{addFood.servingSizeUnit}</Td>
                  <Td isNumeric>{addFood.calories}</Td>
                  <Td isNumeric>{addFood.carbs}</Td>
                  <Td isNumeric>{addFood.fat}</Td>
                  <Td isNumeric>{addFood.protein}</Td>
                  <Td isNumeric>{addFood.sodium}</Td>
                  <Td isNumeric>{addFood.sugar}</Td>
                </Tr>
              ))}
              <Tr>
                <Td>
                  <IconButton
                    size='md'
                    bg='var(--shade1)'
                    color='var(--shade5)'
                    _hover={{ bg: 'var(--shade6)', color: 'var(--shade2)' }}
                    icon={<FiPlusSquare />}
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
              <Tr bg='var(--shade6)' color='white'>
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
        <Text textAlign='center' mt='2vh' fontSize='2vw'>{errorMessage}</Text>
      </Box>
      <Box textAlign='center' my='3vh'>
        <Button variant='solid' onClick={handleUpdateMeal}>Update Meal</Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color='var(--shade5)'>My Foods</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY='auto' maxHeight='75vh' >
            {foodsList.map((food, index) => (
              <Flex key={food._id}
                justifyContent='space-between'
                alignItems='center'
                my='3'
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
                        bg='var(--shade2)'
                        color='var(--shade6)'
                        _hover={{ bg: 'var(--shade4)' }}
                        icon={<FiInfo />}
                      />
                    </PopoverTrigger>
                    <PopoverContent width='fit-content' border='none'>
                      <PopoverBody whiteSpace='pre-line' p='1vw' bg='var(--shade3)' color='var(--shade6)'>{foodPreview}</PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Box>
              </Flex>
            ))}
          </ModalBody>

          <ModalFooter justifyContent='spaced-between'>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Spacer />
            <Button bg='var(--shade5)'
              color='var(--shade1)'
              _hover={{ bg: 'var(--shade3)', color: 'var(--shade6)' }}
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