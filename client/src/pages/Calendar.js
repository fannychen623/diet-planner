// import packages
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns';

// import queries and mutations
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from '../utils/queries';
import {
  ADD_PLANNER, ADD_DIET, ADD_DIET_FOOD,
  REMOVE_DIET, ADD_CUSTOM_DIET, UPDATE_CUSTOM_DIET,
  REMOVE_CUSTOM_DIET, ADD_WEIGHT
} from '../utils/mutations';

// import local components/stylesheet and pacakge components/stylesheet
// import CalendarList from '../components/CalendarList';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Calendar.css';

// import package components and icons
import {
  Grid, GridItem, Box, Spacer, Stack, Flex,
  IconButton, Spinner, Text, Button, SimpleGrid,
  InputGroup, InputLeftAddon, InputRightAddon,
  Card, CardHeader, CardBody, Checkbox,
  Input, CircularProgress, CircularProgressLabel,
  Accordion, AccordionItem,
  AccordionButton, AccordionPanel, AccordionIcon,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Popover, PopoverTrigger, PopoverArrow, PopoverContent,
  PopoverCloseButton, PopoverHeader, PopoverBody, PopoverFooter,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
} from '@chakra-ui/react'

import {
  FiCheck, FiSave, FiInfo, FiPlus, FiEdit2, FiEdit3, FiTrash2,
  FiEdit, FiPlusSquare, FiMinusSquare, FiMinus
} from 'react-icons/fi';

function divide(a, b) {
  return ((a / b) * 100).toFixed(0);
}

// functional component for the calendar page
const CalendarPage = () => {

  // navigate for the edit post button
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure()

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
    enabled: true,
  });

  // extract the tracker information from the query data
  const planners = data?.me.planner || [];
  const profile = data?.me.profile || [];
  const foods = data?.me.foods || [];
  const meals = data?.me.meals || [];

  // define the postId from the url parameter
  const { fetchDate } = useParams();

  const [date, setDate] = useState(fetchDate.replace(/_/g, '/'))

  const convertToISO = () => {
    let darr = date.split('/');
    let dobj = new Date(parseInt(darr[2]), parseInt(darr[0]) - 1, parseInt(darr[1]));
    return new Date(dobj.toISOString())
  }

  const [plannerId, setPlannerId] = useState('n/a')

  const [currentPlannerDiet, setCurrentPlannerDiet] = useState([])

  const [currentPlannerCustomDiet, setCurrentPlannerCustomDiet] = useState([])

  const [weight, setWeight] = useState('')

  const [tabIndex, setTabIndex] = useState(0)

  const [editCustom, setEditCustom] = useState('')

  const [customDiet, setCustomDiet] = useState({
    name: '',
    calories: '',
    carbs: '',
    fat: '',
    protein: '',
    sodium: '',
    sugar: '',
  });

  const handleChange = (name, value) => {
    // set the form state to the new values
    setCustomDiet({
      ...customDiet,
      [name]: value,
    });
  };

  useEffect(() => {
    if (!data) {
      return;
    } else {
      setWeight('')
      let plannerDates = planners.map(planner => planner.date)
      let plannerIds = planners.map(planner => planner._id)
      if (plannerDates.length !== 0) {
        let planId = plannerIds[plannerDates.findIndex(plannerDate => plannerDate === date)]
        if (planId) {
          setPlannerId(planId)
        } else {
          setPlannerId('n/a')
        }
      } else {
        setPlannerId('n/a')
      }
      let dietInfo = []
      let customDietInfo = []
      let plannerInfo = planners[plannerDates.findIndex(plannerDate => plannerDate === date)]
      if (plannerInfo) {
        for (let i = 0; i < plannerInfo.diet.length; i++) {
          let dietContent = plannerInfo.diet[i].content.map(content => ({ servings: content.servings, food: content.food[0]._id }))
          dietInfo.push({
            id: plannerInfo.diet[i]._id,
            title: plannerInfo.diet[i].title,
            numberOfServing: plannerInfo.diet[i].numberOfServing,
            content: dietContent
          })
        }
        for (let i = 0; i < plannerInfo.customDiet.length; i++) {
          customDietInfo.push({
            id: plannerInfo.customDiet[i]._id,
            title: plannerInfo.customDiet[i].title,
            calories: plannerInfo.customDiet[i].calories,
            carbs: plannerInfo.customDiet[i].carbs,
            fat: plannerInfo.customDiet[i].fat,
            protein: plannerInfo.customDiet[i].protein,
            sodium: plannerInfo.customDiet[i].sodium,
            sugar: plannerInfo.customDiet[i].sugar
          })
        }
        if (plannerInfo.weight) {
          setWeight(plannerInfo.weight)
        }
      } else {
        setWeight('')
      }
      setCurrentPlannerDiet(dietInfo)
      setCurrentPlannerCustomDiet(customDietInfo)
      // console.log(dietInfo)
      console.log(plannerInfo)
      console.log(currentPlannerCustomDiet)
    }


  }, [data, date, planners, plannerId]);

  const [mealCheckedState, setMealCheckedState] = useState(Array(meals.length).fill(false))
  const [foodCheckedState, setFoodCheckedState] = useState(Array(foods.length).fill(false))

  const handleChangeState = (event) => {
    event.preventDefault()
    const { value } = event.target

    let mealCheckboxStates = []
    for (var i = 0; i < meals.length; i++) {
      if (meals[i].title === value) {
        mealCheckboxStates.push(!mealCheckedState[i])
      } else {
        mealCheckboxStates.push(mealCheckedState[i])
      }
    };
    setMealCheckedState(mealCheckboxStates)

    let foodCheckboxStates = []
    for (var j = 0; j < foods.length; j++) {
      if (foods[j].title === value) {
        foodCheckboxStates.push(!foodCheckedState[j])
      } else {
        foodCheckboxStates.push(foodCheckedState[j])
      }
    };
    setFoodCheckedState(foodCheckboxStates)
  }

  // set state of combined preview text
  const [mealPreview, setMealPreview] = useState('')

  // function to add workout to combined routine text
  const getMealPreview = (id) => {
    let index = meals.findIndex(meal => meal._id === id)
    let mealTotal = { calories: 0, carbs: 0, fat: 0, protein: 0, sodium: 0, sugar: 0 }

    for (let i = 0; i < meals[index].content.length; i++) {
      mealTotal.calories += foods[foods.findIndex(food => food._id === meals[index].content[i].food[0]._id)].calories * meals[index].content[i].servings
      mealTotal.carbs += foods[foods.findIndex(food => food._id === meals[index].content[i].food[0]._id)].carbs * meals[index].content[i].servings
      mealTotal.fat += foods[foods.findIndex(food => food._id === meals[index].content[i].food[0]._id)].fat * meals[index].content[i].servings
      mealTotal.protein += foods[foods.findIndex(food => food._id === meals[index].content[i].food[0]._id)].protein * meals[index].content[i].servings
      mealTotal.sodium += foods[foods.findIndex(food => food._id === meals[index].content[i].food[0]._id)].sodium * meals[index].content[i].servings
      mealTotal.sugar += foods[foods.findIndex(food => food._id === meals[index].content[i].food[0]._id)].sugar * meals[index].content[i].servings
    }

    setMealPreview(
      'Serving Size: ' + meals[index].numberOfServing + '\n' +
      'Calories (kcal): ' + mealTotal.calories + '\n' +
      'Carbs (g): ' + mealTotal.carbs + '\n' +
      'Fat (g): ' + mealTotal.fat + '\n' +
      'Protein (g): ' + mealTotal.protein + '\n' +
      'Sodium (mg): ' + mealTotal.sodium + '\n' +
      'Sugar (g): ' + mealTotal.sugar
    )
    return mealPreview
  };

  const [foodPreview, setFoodPreview] = useState('')

  // function to add workout to combined routine text
  const getFoodPreview = (id) => {
    let index = foods.findIndex(food => food._id === id)

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

  const getMealTotals = (mealFoods) => {
    let foodContent = mealFoods.content
    let total = { calories: 0, carbs: 0, fat: 0, protein: 0, sodium: 0, sugar: 0 }
    foodContent.forEach((content) => {
      total.calories += foods[foods.findIndex(item => item._id === content.food)].calories * content.servings
      total.carbs += foods[foods.findIndex(item => item._id === content.food)].carbs * content.servings
      total.fat += foods[foods.findIndex(item => item._id === content.food)].fat * content.servings
      total.protein += foods[foods.findIndex(item => item._id === content.food)].protein * content.servings
      total.sodium += foods[foods.findIndex(item => item._id === content.food)].sodium * content.servings
      total.sugar += foods[foods.findIndex(item => item._id === content.food)].sugar * content.servings
    })
    total.calories = +parseFloat(total.calories * mealFoods.numberOfServing).toFixed(2)
    total.carbs = +parseFloat(total.carbs * mealFoods.numberOfServing).toFixed(2)
    total.fat = +parseFloat(total.fat * mealFoods.numberOfServing).toFixed(2)
    total.protein = +parseFloat(total.protein * mealFoods.numberOfServing).toFixed(2)
    total.sodium = +parseFloat(total.sodium * mealFoods.numberOfServing).toFixed(2)
    total.sugar = +parseFloat(total.sugar * mealFoods.numberOfServing).toFixed(2)

    return total;
  }

  const getDailyStats = () => {
    let daily = { calories: 0, carbs: 0, fat: 0, protein: 0, sodium: 0, sugar: 0 }
    currentPlannerDiet.forEach((diet) => {
      daily.calories += getMealTotals(diet).calories
      daily.carbs += getMealTotals(diet).carbs
      daily.fat += getMealTotals(diet).fat
      daily.protein += getMealTotals(diet).protein
      daily.sodium += getMealTotals(diet).sodium
      daily.sugar += getMealTotals(diet).sugar
    })
    currentPlannerCustomDiet.forEach((diet) => {
      daily.calories += diet.calories
      daily.carbs += diet.carbs
      daily.fat += diet.fat
      daily.protein += diet.protein
      daily.sodium += diet.sodium
      daily.sugar += diet.sugar
    })

    daily.calories = +parseFloat(daily.calories).toFixed(0)
    daily.carbs = +parseFloat(daily.carbs).toFixed(0)
    daily.fat = +parseFloat(daily.fat).toFixed(0)
    daily.protein = +parseFloat(daily.protein).toFixed(0)
    daily.sodium = +parseFloat(daily.sodium).toFixed(0)
    daily.sugar = +parseFloat(daily.sugar).toFixed(0)

    return daily;
  }

  // mutation to add tracker
  const [addPlanner, { plannerData }] = useMutation(ADD_PLANNER);

  const handleAddPlanner = async (type) => {
    try {
      const { plannerData } = await addPlanner({
        // pass in the selected date to add new tracking data
        variables: { date: date },

        onCompleted(plannerData) {
          setPlannerId(plannerData.addPlanner._id)
          if (type === 'diet') {
            handleAddDiet(plannerData.addPlanner._id)
          } else if (type === 'weight') {
            handleAddWeight(plannerData.addPlanner._id)
          } else if (type === 'customDiet') {
            handleAddCustomDiet(plannerData.addPlanner._id)
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const [addDiet, { dietError, dietData }] = useMutation(ADD_DIET);

  const handleAddDiet = async (id) => {
    const planId = id

    if (planId === 'n/a') {
      let type = 'diet'
      handleAddPlanner(type);
    } else {
      let dietId = ''
      let dietMeals = []
      let dietType = ''
      const setDietData = (a, b) => {
        dietId = a
        dietMeals = b
      }
      for (let i = 0; i < mealCheckedState.length; i++) {
        if (mealCheckedState[i]) {
          dietType = 'Meals'
          try {
            const { dietData } = await addDiet({
              // pass in the selected date to add new tracking data
              variables: { plannerId: planId, title: meals[i].title, numberOfServing: 1, content: [] },

              onCompleted(dietData) {
                setDietData(dietData.addDiet._id, dietData.addDiet.diet)
              }
            });
          } catch (e) {
            console.error(e);
          }
          mealCheckedState[i] = false
        }
      }
      handleAddDietContent(dietMeals, dietId, dietType)

      for (let j = 0; j < foodCheckedState.length; j++) {
        if (foodCheckedState[j]) {
          dietType = 'Foods'
          try {
            const { dietData } = await addDiet({
              // pass in the selected date to add new tracking data
              variables: { plannerId: planId, title: foods[j].title, numberOfServing: 1, content: [] },

              onCompleted(dietData) {
                setDietData(dietData.addDiet._id, dietData.addDiet.diet)
              }
            });
          } catch (e) {
            console.error(e);
          }
          foodCheckedState[j] = false
        }
      }

      handleAddDietContent(dietMeals, dietId, dietType)
    }
  };

  const [addDietFood, { dietFoodError, dietFoodData }] = useMutation(ADD_DIET_FOOD);

  const handleAddDietContent = (dietMeals, planId, dietType) => {
    if (dietType === 'Meals') {
      dietMeals.forEach((meal) => {
        let dietId = meal._id
        let title = meal.title
        let mealItem = meals[meals.findIndex(meal => meal.title === title)].content
        mealItem.forEach((food) => {
          let servings = food.servings
          let id = food.food[0]._id
          try {
            // add routine with variables routineNanem and routine
            const { dietFoodData } = addDietFood({
              variables: { dietId, servings, food: id },
            });

          } catch (e) {
            console.error(e)
          }
        });
      });
    } else if (dietType === 'Foods') {
      dietMeals.forEach((meal) => {
        if (meal.content.length === 0) {
          let dietId = meal._id
          let id = foods[foods.findIndex(item => item.title === meal.title)]._id
          let servings = 1
          try {
            // add routine with variables routineNanem and routine
            const { dietFoodData } = addDietFood({
              variables: { dietId, servings, food: id },
            });

          } catch (e) {
            console.error(e)
          }
        }
      });
    }

    refetch();
    onClose()
  };

  const [removeDiet, { removeDietError, removeDietData }] = useMutation(REMOVE_DIET);

  const handleRemoveDiet = async (event) => {
    event.preventDefault()
    const { id } = event.target
    if (id !== '') {
      try {
        // add routine with variables routineNanem and routine
        const { removeDietData } = await removeDiet({
          variables: { plannerId, dietId: id },

          onCompleted(removeDietData) {
            refetch();
          }
        });

      } catch (e) {
        console.error(e)
      }
    }
  };

  const [addCustomDiet, { customDietError, customDietData }] = useMutation(ADD_CUSTOM_DIET);

  const handleAddCustomDiet = async (id) => {
    const planId = id

    mealCheckedState.forEach((state, index, array) => array[index] = false)
    foodCheckedState.forEach((state, index, array) => array[index] = false)
    if (planId === 'n/a') {
      let type = 'customDiet'
      handleAddPlanner(type)
    } else {
      try {
        const { customDietData } = await addCustomDiet({
          // pass in the selected date to add new tracking data
          variables: {
            plannerId: planId,
            title: customDiet.title,
            calories: parseFloat(customDiet.calories),
            carbs: parseFloat(customDiet.carbs) || 0,
            fat: parseFloat(customDiet.fat) || 0,
            protein: parseFloat(customDiet.protein) || 0,
            sodium: parseFloat(customDiet.sodium) || 0,
            sugar: parseFloat(customDiet.sugar) || 0,
          },

          onCompleted(customDietData) {
            // redirect to posts page
          }
        });
      } catch (e) {
        console.error(e);
      }
    }

    refetch()
    onClose()
  };

  const [updateCustomDiet, { updateCustomDietError, updateCustomDietData }] = useMutation(UPDATE_CUSTOM_DIET);

  const handleUpdateCustomDiet = async (id) => {

    if (id !== '') {
      try {
        const { updateCustomDietData } = await updateCustomDiet({
          // pass in the selected date to add new tracking data
          variables: {
            customDietId: id,
            title: customDiet.title,
            calories: parseFloat(customDiet.calories),
            carbs: parseFloat(customDiet.carbs) || 0,
            fat: parseFloat(customDiet.fat) || 0,
            protein: parseFloat(customDiet.protein) || 0,
            sodium: parseFloat(customDiet.sodium) || 0,
            sugar: parseFloat(customDiet.sugar) || 0,
          },

          onCompleted(customDietData) {
            setEditCustom('');
            setCustomDiet({
              ...customDiet,
              name: '',
              calories: '',
              carbs: '',
              fat: '',
              protein: '',
              sodium: '',
              sugar: '',
            })
          }
        });
      } catch (e) {
        console.error(e);
      }

      refetch()
    };
  };

  const [removeCustomDiet, { removeCustomDietError, removeCustomDietData }] = useMutation(REMOVE_CUSTOM_DIET);

  const handleRemoveCustomDiet = async (event) => {
    event.preventDefault()
    const { id } = event.target
    if (id !== '') {
      try {
        // add routine with variables routineNanem and routine
        const { removeCustomDietData } = await removeCustomDiet({
          variables: { plannerId, customDietId: id },

          onCompleted(removeCustomDietData) {
            refetch();
          }
        });

      } catch (e) {
        console.error(e)
      }
    }
  };

  const [addWeight, { addWeightError, addWeightData }] = useMutation(ADD_WEIGHT);

  const handleAddWeight = async (id) => {
    const planId = id

    if (planId === 'n/a') {
      let type = 'weight'
      handleAddPlanner(type)
    } else {
      try {
        const { addWeightData } = await addWeight({
          // pass in the selected date to add new tracking data
          variables: { plannerId: planId, weight: parseFloat(weight) },

          onCompleted(weightData) {
            // redirect to posts page
            window.location.assign(`/calendar/${date.replace(/\//g, '_')}`);
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <Box className='calendar-page'>
      <Grid templateColumns='repeat(10, 1fr)' gap='6'>
        <GridItem colSpan='5'>
          <Box className='calendar'>
            <Box className='calendar-container'>
              {/* react calendar component */}
              <Calendar
                value={convertToISO()}
                defaultValue={convertToISO()}
                onClickDay={(e) => { setDate(format(e, 'MM/dd/yyyy')) }}
                calendarType='US' />
            </Box>
          </Box>
        </GridItem>
        <GridItem colSpan='5'>
          <Card>
            <CardHeader>
              {/* header with selected date in string format */}
              <Text>{format(new Date(date), 'MMMM do, yyyy')}</Text>
            </CardHeader>
            <CardBody>
              <Box display='flex' justifyContent='spaced-between'>
                <Box display='flex' alignItems='center'>
                  <IconButton
                    size='md'
                    icon={<FiPlus p='100%' />}
                    onClick={onOpen}
                  />
                  <Text ml='0.5em'>Add Item(s)</Text>
                </Box>
                <Spacer />
                <Box display='flex' alignItems='center' justifiyContent='spaced-between'>
                  <Spacer />
                  <Text mr='0.5em'>Weight:</Text>
                  <InputGroup>
                    <Input defaultValue={weight} onChange={(e) => { setWeight(parseFloat(e.target.value)) }} />
                    <InputRightAddon children='lbs' />
                  </InputGroup>
                  {weight ? (
                    <IconButton
                      size='md'
                      value={plannerId}
                      icon={<FiCheck p='100%' />}
                      onClick={(e) => { handleAddWeight(plannerId) }}
                    />
                  ) : (
                    <IconButton
                      size='md'
                      value={plannerId}
                      icon={<FiPlus p='100%' />}
                      onClick={(e) => { handleAddWeight(plannerId) }}
                    />
                  )}
                </Box>
              </Box>
              {/* if tracked and query is complete */}
              {loading ? (
                <Box display='flex' alignItems='center' mt='1em'>
                  <Spinner mr='1em' /><Text>Loading...</Text>
                </Box>
              ) : (
                <Box>
                  {currentPlannerDiet.length <= 0 ? (
                    <Box></Box>
                  ) : (
                    <Box>
                      <Accordion allowToggle>
                        <AccordionItem bg='var(--shade5)' color='white'>
                          <h2>
                            <AccordionButton>
                              <Box as="span" flex='1' textAlign='left'>
                                <IconButton isDisabled size='md' bg='var(--shade5)' _hover={{ bg: 'var(--shade5)' }} />
                                <IconButton isDisabled size='md' mr='2em' bg='var(--shade5)' _hover={{ bg: 'var(--shade5)' }} />
                                Meal
                              </Box>
                              <Box as="span" flex='1' textAlign='right'>
                                Serving
                              </Box>
                            </AccordionButton>
                          </h2>
                        </AccordionItem>
                        {currentPlannerDiet.map((planner) => (
                          <AccordionItem>
                            <h2>
                              <AccordionButton _hover={{ bg: 'var(--shade2)' }} _expanded={{ bg: 'var(--shade2)', fontWeight: 'bold' }}>
                                <Grid templateColumns='repeat(10, 1fr)' gap='4'>
                                  <GridItem colSpan='9' alignItems='center'>
                                    <Box textAlign='left'>
                                      <IconButton
                                        size='md'
                                        icon={<FiMinus p='100%' />}
                                        id={planner.id}
                                        onClick={handleRemoveDiet}
                                      />
                                      <IconButton
                                        mx='1em'
                                        size='md'
                                        icon={<FiEdit3 p='100%' />}
                                        onClick={() => { navigate('/calendar/edit/meal', { state: { planner, date } }) }}
                                      />
                                      {planner.title}
                                    </Box>
                                  </GridItem>
                                  <GridItem colSpan='1' display='flex' alignItems='center'>
                                    <Box textAlign='right'>
                                      {planner.numberOfServing}
                                    </Box>
                                    <AccordionIcon />
                                  </GridItem>
                                </Grid>
                              </AccordionButton>
                            </h2>
                            <AccordionPanel>
                              <Grid templateColumns='repeat(10, 1fr)' gap='4'>
                                <GridItem colSpan='6'>
                                  <Text as='b'>Contains: </Text>
                                  {planner.content.map((content) => (
                                    <Text>{content.servings}{content.servings <= 1 ? (' serving of ') : (' servings of ')}{foods[foods.findIndex(food => food._id === content.food)].title}</Text>
                                  ))}
                                </GridItem>
                                <GridItem colSpan='4'>
                                  <Text as='b'>Nutrition Value: </Text>
                                  <Box display='flex'>
                                    <Text>Calories: </Text>
                                    <Spacer />
                                    <Text>{getMealTotals(planner).calories} kcal</Text>
                                  </Box>
                                  <Box display='flex'>
                                    <Text>Carbs: </Text>
                                    <Spacer />
                                    <Text>{getMealTotals(planner).carbs} g</Text>
                                  </Box>
                                  <Box display='flex'>
                                    <Text>Fat: </Text>
                                    <Spacer />
                                    <Text>{getMealTotals(planner).fat} g</Text>
                                  </Box>
                                  <Box display='flex'>
                                    <Text>Protein: </Text>
                                    <Spacer />
                                    <Text>{getMealTotals(planner).protein} g</Text>
                                  </Box>
                                  <Box display='flex'>
                                    <Text>Sodium: </Text>
                                    <Spacer />
                                    <Text>{getMealTotals(planner).sodium} g</Text>
                                  </Box>
                                  <Box display='flex'>
                                    <Text>Sugar: </Text>
                                    <Spacer />
                                    <Text>{getMealTotals(planner).sugar} g</Text>
                                  </Box>
                                </GridItem>
                              </Grid>
                            </AccordionPanel>
                          </AccordionItem>
                        ))}
                        {currentPlannerCustomDiet.map((planner) => (
                          <AccordionItem>
                            {({ isExpanded }) => (
                              <>
                                <h2>
                                  <AccordionButton _hover={{ bg: 'var(--shade2)' }} _expanded={{ bg: 'var(--shade2)', fontWeight: 'bold' }}>
                                    <Grid templateColumns='repeat(10, 1fr)' gap='4'>
                                      <GridItem colSpan='9' alignItems='center'>
                                        <Box textAlign='left'>
                                          <IconButton
                                            size='md'
                                            icon={<FiMinus p='100%' />}
                                            id={planner.id}
                                            onClick={handleRemoveCustomDiet}
                                          />
                                          {editCustom === planner.id ? (
                                            <IconButton
                                              mx='1em'
                                              size='md'
                                              icon={<FiCheck p='100%' />}
                                              onClick={() => { handleUpdateCustomDiet(planner.id) }}
                                            />
                                          ) : (
                                            <IconButton
                                              mx='1em'
                                              size='md'
                                              icon={<FiEdit3 p='100%' />}
                                              isDisabled={isExpanded ? (true) : (false)}
                                              onClick={() => {
                                                setEditCustom(planner.id);
                                                setCustomDiet({ ...customDiet, title: planner.title, calories: planner.calories, carbs: planner.carbs, fat: planner.fat, protein: planner.protein, sodium: planner.sodium, sugar: planner.sugar })
                                              }}
                                            />
                                          )}
                                          {planner.title}
                                        </Box>
                                      </GridItem>
                                      <GridItem colSpan='1' display='flex' alignItems='center'>
                                        <Box textAlign='right'>1</Box>
                                        <AccordionIcon />
                                      </GridItem>
                                    </Grid>
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel>
                                  {editCustom === planner.id ? (
                                    <Box>
                                      <InputGroup alignItems='center' mb='0.5em'>
                                        <Text mr='1em' width='25%'>Name: </Text>
                                        <Input
                                          name='title'
                                          value={customDiet.title}
                                          onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                        />
                                      </InputGroup>
                                      <InputGroup alignItems='center' mb='0.5em'>
                                        <Text mr='1em' width='25%'>Calories (kcal) : </Text>
                                        <Input
                                          name='calories'
                                          value={customDiet.calories}
                                          onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                        />
                                      </InputGroup>
                                      <InputGroup alignItems='center' mb='0.5em'>
                                        <Text mr='1em' width='25%'>Carbs (g) : </Text>
                                        <Input
                                          name='carbs'
                                          value={customDiet.carbs}
                                          onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                        />
                                      </InputGroup>
                                      <InputGroup alignItems='center' mb='0.5em'>
                                        <Text mr='1em' width='25%'>Fat (g) : </Text>
                                        <Input
                                          name='fat'
                                          value={customDiet.fat}
                                          onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                        />
                                      </InputGroup>
                                      <InputGroup alignItems='center' mb='0.5em'>
                                        <Text mr='1em' width='25%'>Protein (g) : </Text>
                                        <Input
                                          name='protein'
                                          value={customDiet.protein}
                                          onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                        />
                                      </InputGroup>
                                      <InputGroup alignItems='center' mb='0.5em'>
                                        <Text mr='1em' width='25%'>Sodium (mg) : </Text>
                                        <Input
                                          name='sodium'
                                          value={customDiet.sodium}
                                          onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                        />
                                      </InputGroup>
                                      <InputGroup alignItems='center'>
                                        <Text mr='1em' width='25%'>Sugar (g) : </Text>
                                        <Input
                                          name='sugar'
                                          value={customDiet.sugar}
                                          onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                                        />
                                      </InputGroup>
                                    </Box>
                                  ) : (
                                    <Box>
                                      <Text as='b'>Nutrition Value: </Text>
                                      <Box display='flex'>
                                        <Text>Calories: </Text>
                                        <Spacer />
                                        <Text>{planner.calories} kcal</Text>
                                      </Box>
                                      <Box display='flex'>
                                        <Text>Carbs: </Text>
                                        <Spacer />
                                        <Text>{planner.carbs} g</Text>
                                      </Box>
                                      <Box display='flex'>
                                        <Text>Fat: </Text>
                                        <Spacer />
                                        <Text>{planner.fat} g</Text>
                                      </Box>
                                      <Box display='flex'>
                                        <Text>Protein: </Text>
                                        <Spacer />
                                        <Text>{planner.protein} g</Text>
                                      </Box>
                                      <Box display='flex'>
                                        <Text>Sodium: </Text>
                                        <Spacer />
                                        <Text>{planner.sodium} g</Text>
                                      </Box>
                                      <Box display='flex'>
                                        <Text>Sugar: </Text>
                                        <Spacer />
                                        <Text>{planner.sugar} g</Text>
                                      </Box>
                                    </Box>
                                  )}
                                </AccordionPanel>
                              </>
                            )}
                          </AccordionItem>
                        ))}
                      </Accordion>
                      <Accordion allowToggle defaultIndex={[0]}>
                        <AccordionItem>
                          <h2>
                            <AccordionButton _hover={{ bg: 'var(--shade5)' }}>
                              <AccordionIcon />
                              <Box as="span" flex='1' textAlign='center'>
                                Daily Stats
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel borderBottom='none'>
                            <SimpleGrid columns='4' spacingY='1em' textAlign='center' alignItems='center'>
                              <Box>
                                <Stack>
                                  <Text class='statTitle'>Calories</Text>
                                  <Text class='statValue'>{getDailyStats().calories}/{profile.calories} kcal</Text>
                                </Stack>
                              </Box>
                              <Box>
                                <CircularProgress value={divide(getDailyStats().calories, profile.calories)} color='#a7d489'>
                                  <CircularProgressLabel>{divide(getDailyStats().calories, profile.calories)} %</CircularProgressLabel>
                                </CircularProgress>
                              </Box>
                              <Box>
                                <Stack>
                                  <Text class='statTitle'>Carbs</Text>
                                  <Text class='statValue'>{getDailyStats().carbs}/{profile.carbs} g</Text>
                                </Stack>
                              </Box>
                              <Box>
                                <CircularProgress value={divide(getDailyStats().carbs, profile.carbs)} color='#6baee1'>
                                  <CircularProgressLabel>{divide(getDailyStats().carbs, profile.carbs)} %</CircularProgressLabel>
                                </CircularProgress>
                              </Box>
                              <Box>
                                <Stack>
                                  <Text class='statTitle'>Fat</Text>
                                  <Text class='statValue'>{getDailyStats().fat}/{profile.fat} g</Text>
                                </Stack>
                              </Box>
                              <Box>
                                <CircularProgress value={divide(getDailyStats().fat, profile.fat)} color='#ffef85'>
                                  <CircularProgressLabel>{divide(getDailyStats().fat, profile.fat)} %</CircularProgressLabel>
                                </CircularProgress>
                              </Box>
                              <Box>
                                <Stack>
                                  <Text class='statTitle'>Protein</Text>
                                  <Text class='statValue'>{getDailyStats().protein}/{profile.protein} g</Text>
                                </Stack>
                              </Box>
                              <Box>
                                <CircularProgress value={divide(getDailyStats().protein, profile.protein)} color='#f6ac69'>
                                  <CircularProgressLabel>{divide(getDailyStats().protein, profile.protein)} %</CircularProgressLabel>
                                </CircularProgress>
                              </Box>
                              <Box>
                                <Stack>
                                  <Text class='statTitle'>Sodium</Text>
                                  <Text class='statValue'>{getDailyStats().sodium}/2300 mg</Text>
                                </Stack>
                              </Box>
                              <Box>
                                <CircularProgress value={divide(getDailyStats().sodium, 2300)} color='#ff6972'>
                                  <CircularProgressLabel>{divide(getDailyStats().sodium, 2300)} %</CircularProgressLabel>
                                </CircularProgress>
                              </Box>
                              <Box>
                                <Stack>
                                  <Text class='statTitle'>Sugar</Text>
                                  <Text class='statValue'>{getDailyStats().sugar}/{profile.sex === 'Male' ? (36) : (24)} g</Text>
                                </Stack>
                              </Box>
                              <Box>
                                {profile.sex === 'Male' ? (
                                  <CircularProgress value={divide(getDailyStats().sugar, 36)} color='#9f7dad'>
                                    <CircularProgressLabel>{divide(getDailyStats().sugar, 36)} %</CircularProgressLabel>
                                  </CircularProgress>
                                ) : (
                                  <CircularProgress value={divide(getDailyStats().sugar, 24)} color='#9f7dad'>
                                    <CircularProgressLabel>{divide(getDailyStats().sugar, 24)} %</CircularProgressLabel>
                                  </CircularProgress>
                                )}
                              </Box>
                            </SimpleGrid>
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    </Box>
                  )}
                </Box>
              )}
              <Box></Box>
            </CardBody>
          </Card>
          <Box></Box>
        </GridItem>
      </Grid>
      <Modal isOpen={isOpen} onClose={() => { onClose(); setTabIndex(0) }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Item(s)</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY='auto' maxHeight='50vh' >
            <Tabs isFitted variant='line' onChange={(index) => setTabIndex(index)}>
              <TabList>
                <Tab _selected={{ color: 'white', bg: 'var(--shade5)' }}>Meals</Tab>
                <Tab _selected={{ color: 'white', bg: 'var(--shade5)' }}>Food</Tab>
                <Tab _selected={{ color: 'white', bg: 'var(--shade5)' }}>Custom</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {meals.map((meal, index) => (
                    <Flex key={meal._id}
                      justifyContent='space-between'
                      alignItems='center'
                      my='3'
                    >
                      <Box>
                        <Checkbox
                          value={meal.title}
                          isChecked={mealCheckedState[index]}
                          onChange={handleChangeState}
                        >
                          {meal.title}
                        </Checkbox>
                      </Box>
                      <Box>
                        <Popover onOpen={() => { getMealPreview(meal._id) }}>
                          <PopoverTrigger>
                            <IconButton
                              aria-label={meal.title}
                              bg='var(--shade2)'
                              color='var(--shade6)'
                              _hover={{ bg: 'var(--shade4)' }}
                              icon={<FiInfo p='100%' />}
                            />
                          </PopoverTrigger>
                          <PopoverContent width='fit-content' border='none'>
                            <PopoverBody whiteSpace='pre-line' p='1vw' bg='var(--shade3)' color='var(--shade6)'>{mealPreview}</PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Box>
                    </Flex>
                  ))}
                </TabPanel>
                <TabPanel>
                  {foods.map((food, index) => (
                    <Flex key={food._id}
                      justifyContent='space-between'
                      alignItems='center'
                      my='3'
                    >
                      <Box>
                        <Checkbox
                          value={food.title}
                          isChecked={foodCheckedState[index]}
                          onChange={handleChangeState}
                        >
                          {food.title}
                        </Checkbox>
                      </Box>
                      <Box>
                        <Popover onOpen={() => { getFoodPreview(food._id) }}>
                          <PopoverTrigger>
                            <IconButton
                              aria-label={food.title}
                              bg='var(--shade2)'
                              color='var(--shade6)'
                              _hover={{ bg: 'var(--shade4)' }}
                              icon={<FiInfo p='100%' />}
                            />
                          </PopoverTrigger>
                          <PopoverContent width='fit-content' border='none'>
                            <PopoverBody whiteSpace='pre-line' p='1vw' bg='var(--shade3)' color='var(--shade6)'>{mealPreview}</PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Box>
                    </Flex>
                  ))}
                </TabPanel>
                <TabPanel>
                  <Box>
                    <Text mb='1em'><b>Required: </b>Meal Name and Calories</Text>
                    <Text mb='1em'>Enter by Serving Size of <b>1</b></Text>
                    <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                      <InputLeftAddon
                        children='Name'
                        width='25%'
                        bg='var(--shade3)'
                      />
                      <Input
                        name='title'
                        value={customDiet.title}
                        onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                      />
                    </InputGroup>
                    <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                      <InputLeftAddon
                        children='Calories'
                        width='25%'
                        bg='var(--shade3)'
                      />
                      <Input
                        name='calories'
                        value={customDiet.calories}
                        onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                      />
                      <InputRightAddon
                        children='kcal'
                        width='20%'
                        bg='var(--shade3)'
                      />
                    </InputGroup>
                    <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                      <InputLeftAddon
                        children='Carbs'
                        width='25%'
                        bg='var(--shade2)'
                      />
                      <Input
                        name='carbs'
                        value={customDiet.carbs}
                        onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                      />
                      <InputRightAddon
                        children='g'
                        width='20%'
                        bg='var(--shade2)'
                      />
                    </InputGroup>
                    <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                      <InputLeftAddon
                        children='Fat'
                        width='25%'
                        bg='var(--shade2)'
                      />
                      <Input
                        name='fat'
                        value={customDiet.fat}
                        onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                      />
                      <InputRightAddon
                        children='g'
                        width='20%'
                        bg='var(--shade2)'
                      />
                    </InputGroup>
                    <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                      <InputLeftAddon
                        children='Protein'
                        width='25%'
                        bg='var(--shade2)'
                      />
                      <Input
                        name='protein'
                        value={customDiet.protein}
                        onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                      />
                      <InputRightAddon
                        children='g'
                        width='20%'
                        bg='var(--shade2)'
                      />
                    </InputGroup>
                    <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                      <InputLeftAddon
                        children='Sodium'
                        width='25%'
                        bg='var(--shade2)'
                      />
                      <Input
                        name='sodium'
                        value={customDiet.sodium}
                        onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                      />
                      <InputRightAddon
                        children='mg'
                        width='20%'
                        bg='var(--shade2)'
                      />
                    </InputGroup>
                    <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                      <InputLeftAddon
                        children='Sugar'
                        width='25%'
                        bg='var(--shade2)'
                      />
                      <Input
                        name='sugar'
                        value={customDiet.sugar}
                        onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                      />
                      <InputRightAddon
                        children='g'
                        width='20%'
                        bg='var(--shade2)'
                      />
                    </InputGroup>
                    <Text mt='1em'>Empty values will default to 0</Text>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter justifyContent='spaced-between'>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Spacer />
            {tabIndex === 2 ? (
              <Button bg='var(--shade5)'
                color='var(--shade1)'
                _hover={{ bg: 'var(--shade3)', color: 'var(--shade6)' }}
                value={plannerId}
                onClick={(e) => { handleAddCustomDiet(e.target.value) }}
              >
                Add Custom Meal
              </Button>
            ) : (
              <Button bg='var(--shade5)'
                color='var(--shade1)'
                _hover={{ bg: 'var(--shade3)', color: 'var(--shade6)' }}
                value={plannerId}
                onClick={(e) => { handleAddDiet(e.target.value) }}
              >
                Add Items(s)
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CalendarPage;