// import package
import React, { useEffect, useMemo, useState, Fragment } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router-dom'

// importy query and mutations
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { UPDATE_MEAL, UPDATE_MEAL_FOOD } from '../utils/mutations';

// import package components
import {
  Box, Flex, Spacer, Grid, GridItem, SimpleGrid, Heading, Text, 
  Input, InputGroup, InputLeftElement, InputLeftAddon, InputRightAddon,
  Button, IconButton, Checkbox, NumberInput, NumberInputField,
  NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
} from '@chakra-ui/react'

// import icons
import { FiSearch, FiPlusSquare, FiMinusSquare, FiInfo } from 'react-icons/fi';

// import local style sheet
import '../styles/NewEditMeal.css';

// function to transform text to proper case
function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

// functional component for the edit meal page
const EditMeal = () => {

  // determine if the viewport size is mobile
  const isMobile = useMediaQuery({ query: `(max-width: 820px)` });

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

  // extract the foods from the query data
  const foods = useMemo(() => data?.me.foods, [data]);
  const meals = useMemo(() => data?.me.meals, [data]);

  // map through data to get array of food titles
  const mealTitles = useMemo(() => meals.map(meal => meal.title) || [], [meals]);

  // get meal id from url
  const { mealId } = useParams();

  // get specified meal
  const meal = meals[meals.findIndex(meal => meal._id === mealId)]

  // functions to toggle modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  // function to get food for the meal
  const getMealFood = () => {
    let mealContent = meal.content
    let mealFoodServings = mealContent.map(thisMeal => thisMeal.servings)
    let mealFoodIds = mealContent.map(thisMeal => thisMeal.food)
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

  // function to get list of food not added to meal
  const getFoodList = () => {
    let mealContent = meal.content
    let mealFoodIds = mealContent.map(thisMeal => thisMeal.food)
    let mealFoodAdded = foods
    for (let i = 0; i < mealFoodIds.length; i++) {
      mealFoodAdded = mealFoodAdded.filter((food) => food._id !== mealFoodIds[i])
    }
    return mealFoodAdded
  }

  // function to get food preview viewed in modal
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

  // define states
  const [mealDetails, setMealDetails] = useState({ title: meal.title, numberOfServing: meal.numberOfServing })
  const [foodAdded, setFoodAdded] = useState(getMealFood())
  const [foodsList, setFoodList] = useState(getFoodList())
  const [checkedState, setCheckedState] = useState(Array(foodsList.length).fill(false))
  const [displayState, setDisplayState] = useState(Array(foodsList.length).fill(true))
  const [searchValue, setSearchValue] = useState('')
  const [foodPreview, setFoodPreview] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [total, setTotal] = useState({
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
    sodium: 0,
    sugar: 0,
  });

  // call on render and defined state changes
  useEffect(() => {
    // set displayed food in modal based on search value
    setDisplayState(Array(foodsList.length).fill(true))
    for (let i = 0; i < foodsList.length; i++) {
      if (foodsList[i].title.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
        displayState[i] = true
      } else {
        displayState[i] = false
      }
    }
    setDisplayState({ ...displayState })

    // calculate total meal nutritional value at each food/serving size change
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

  // function to get values of food checked in modal
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

  // function to add food from modal to page
  const handleAddFoods = async (event) => {
    event.preventDefault()
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
        setFoodList(foods => foods.filter((food) => food.title !== foodsList[i].title))
      }
    }
    onClose()
  };

  // function to update individual food servings and total nutritional value
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

  // function to remove food from meal page and add it back to modal food list
  const handleRemoveFood = async (event) => {
    event.preventDefault()
    const { id } = event.target
    if (id !== '') {
      foodsList.push(foods[foods.findIndex(food => food._id === id)])
      setFoodAdded(foodAdded.filter((item) => item.id !== id))
    }
  };

  // mutation and function to update meal
  const [updateMeal, { mealError, mealData }] = useMutation(UPDATE_MEAL);
  const handleUpdateMeal = async (event) => {
    event.preventDefault()
    // check that at least one food is added with valid serving value
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
    // update meal in database
    if (!error) {
      try {
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
        if (mealTitles.includes(mealDetails.title)) { setErrorMessage('Error: Duplicate meal name') }
      }
    }
  };

  // mutation and function to update meal food
  const [updateMealFood, { mealFoodError, mealFoodData }] = useMutation(UPDATE_MEAL_FOOD);
  const handleUpdateMealFood = async () => {
    for (let i = 0; i < foodAdded.length; i++) {
      let servings = parseFloat(foodAdded[i].servings)
      let food = foodAdded[i].id
      try {
        const { mealFoodData } = await updateMealFood({
          variables: { mealId, servings, food },
        });
      } catch (e) {
        console.error(e)
      }
    }
    // redirect back to the meal page
    window.location.assign('#/meal');
  };

  return (
    <Box className='edit-meal-page'>
      <Heading>Modify Meal</Heading>
      <Box display={isMobile ? 'block' : 'flex'} justifyContent='space-between'>
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
        {isMobile ? (<></>) : (<Spacer />)}
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
      </Box>
      {isMobile ? (
        <Box>
          <Grid
            templateColumns='repeat(5, 1fr)'
          >
            <GridItem colSpan='5' textAlign='center'>Food</GridItem>
            {foodAdded.map((addFood, index) => (
              <GridItem colSpan='5' key={addFood.id}>
                <Grid
                  templateRows='repeat(2, 1fr)'
                  templateColumns='repeat(5, 1fr)'
                >
                  <GridItem rowSpan='2' colSpan='1' my='auto'>
                    <IconButton
                      size='md'
                      icon={<FiMinusSquare p='100%' />}
                      id={addFood.id}
                      onClick={handleRemoveFood}
                    />
                  </GridItem>
                  <GridItem colSpan='4'>{addFood.title}</GridItem>
                  <GridItem colSpan='4' display='flex' alignItems='center' justifyContent='space-between'>
                    <Text># of Serving:</Text>
                    <InputGroup>
                      <Input
                        width='auto'
                        textAlign='center'
                        defaultValue={1}
                        id={addFood.id}
                        onChange={handleUpdateServings}
                      />
                      <Popover isLazy placement='left'>
                        <PopoverTrigger>
                          <InputRightAddon>
                            <FiInfo />
                          </InputRightAddon>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverBody whiteSpace='pre-line'>
                            Serving Size: {addFood.servingSizeUnit}{'\n'}
                            Calories: {+parseFloat(addFood.calories).toFixed(2)} kcal {'\n'}
                            Carbs: {+parseFloat(addFood.carbs).toFixed(2)} g {'\n'}
                            Fat: {+parseFloat(addFood.fat).toFixed(2)} g {'\n'}
                            Protein: {+parseFloat(addFood.protein).toFixed(2)} g {'\n'}
                            Sodium: {+parseFloat(addFood.sodium).toFixed(2)} mg {'\n'}
                            Sugar: {+parseFloat(addFood.sugar).toFixed(2)} g {'\n'}
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </InputGroup>
                  </GridItem>
                </Grid>
              </GridItem>
            ))}
            <GridItem colSpan='1'>
              <IconButton
                size='md'
                icon={<FiPlusSquare p='100%' />}
                onClick={onOpen}
              />
            </GridItem>
            <GridItem colSpan='4' textAlign='center'> </GridItem>
          </Grid>
          {foodAdded.length > 0 ? (
            <Box>
              <Text m='auto'>Total Nutrition</Text>
              <SimpleGrid columns='2'>
                <Box>Calories</Box>
                <Box textAlign='end'>{total.calories} kcal</Box>
                <Box>Carbs</Box>
                <Box textAlign='end'>{total.carbs} g</Box>
                <Box>Fat</Box>
                <Box textAlign='end'>{total.fat} g</Box>
                <Box>Protein</Box>
                <Box textAlign='end'>{total.protein} g</Box>
                <Box>Sodium</Box>
                <Box textAlign='end'>{total.sodium} mg</Box>
                <Box>Sugar</Box>
                <Box textAlign='end'>{total.sugar} g</Box>
              </SimpleGrid>
            </Box>
          ) : (<></>)}
          <Text textAlign='center'>{errorMessage}</Text>
        </Box>
      ) : (
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
                <Tr key={addFood.id}>
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
      )}
      <Box textAlign='center'>
        <Button variant='solid' onClick={handleUpdateMeal}>Update Meal</Button>
      </Box>
      <Modal isCentered isOpen={isOpen} onClose={() => { onClose(); setSearchValue('') }}>
        <ModalOverlay />
        <ModalContent className='meal-modal' maxW={isMobile ? '85%' : '30%'}>
          <ModalHeader>
            My Foods
            <Box>
              <InputGroup>
                <InputLeftElement pointerEvents='none'>
                  <FiSearch />
                </InputLeftElement>
                <Input onChange={(e) => { setSearchValue(e.target.value) }} />
              </InputGroup>
            </Box>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY='auto' maxHeight='50vh' >
            {foodsList.map((food, index) => (
              <Fragment key={food._id}>
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
                      <Popover onOpen={() => { getFoodPreview(index) }} placement={isMobile ? 'bottom' : 'right'}>
                        <PopoverTrigger>
                          <IconButton
                            aria-label={food.title}
                            icon={<FiInfo p='100%' />}
                          />
                        </PopoverTrigger>
                        <PopoverContent width='fit-content' border='none'>
                        <PopoverArrow />
                          <PopoverBody>{foodPreview}</PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Box>
                  </Flex>
                ) : (
                  <></>
                )}
              </Fragment>
            ))}
          </ModalBody>
          <ModalFooter justifyContent='spaced-between'>
            <Button onClick={onClose}>
              Close
            </Button>
            <Spacer />
            <Button onClick={handleAddFoods}>
              Add Food(s)
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default EditMeal;