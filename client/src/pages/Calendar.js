// import packages
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStateWithCallbackInstant, useStateWithCallbackLazy } from 'use-state-with-callback';
import { format } from 'date-fns';

// import queries and mutations
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from '../utils/queries';
import { ADD_PLANNER, ADD_DIET, ADD_DIET_FOOD, REMOVE_DIET_FOOD, ADD_WEIGHT } from '../utils/mutations';

// import local components/stylesheet and pacakge components/stylesheet
// import CalendarList from '../components/CalendarList';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Calendar.css';

// import package components and icons
import {
  Grid, GridItem, Box, Spacer, Stack, Flex,
  IconButton, Spinner, Text, Button, SimpleGrid,
  Card, CardHeader, CardBody, Checkbox,
  Input, CircularProgress, CircularProgressLabel,
  Accordion, AccordionItem,
  AccordionButton, AccordionPanel, AccordionIcon,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Popover, PopoverTrigger, PopoverContent, PopoverBody,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
} from '@chakra-ui/react'

import {
  FiCheck, FiSave, FiInfo, FiPlus, FiEdit3, FiTrash2,
  FiEdit, FiPlusSquare, FiMinusSquare, FiMinus
} from 'react-icons/fi';


// functional component for the calendar page
const CalendarPage = () => {

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

  // const [plannerDates, setPlannerDates] = useState (planners.map(planner => planner.date))
  const [plannerId, setPlannerId] = useState('n/a')

  const [currentPlanner, setCurrentPlanner] = useState([])

  const [weight, setWeight] = useState('')

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
      let plannerInfo = planners[plannerDates.findIndex(plannerDate => plannerDate === date)]
      if (plannerInfo) {
        for (let i = 0; i < plannerInfo.diet.length; i++) {
          let dietContent = plannerInfo.diet[i].content.map(content => ({ servings: content.servings, food: content.food[0]._id }))
          // console.log(dietContent)
          dietInfo.push({
            id: plannerInfo.diet[i]._id,
            title: plannerInfo.diet[i].title,
            numberOfServing: plannerInfo.diet[i].numberOfServing,
            content: dietContent
          })
        }
        if (plannerInfo.weight) {
          setWeight(plannerInfo.weight)
        }
      } else {
        setWeight('')
      }
      setCurrentPlanner(dietInfo)
      // console.log(dietInfo)
    }


  }, [data, date, planners, plannerId]);

  const [checkedState, setCheckedState] = useState(Array(meals.length).fill(false))

  const handleChangeState = (event) => {
    event.preventDefault()
    const { value } = event.target

    let checkboxStates = []
    for (var i = 0; i < meals.length; i++) {
      if (meals[i].title === value) {
        checkboxStates.push(!checkedState[i])
      } else {
        checkboxStates.push(checkedState[i])
      }
    };

    setCheckedState(checkboxStates)
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
      const setDietData = ( a, b ) => {
        dietId = a
        dietMeals = b
      }
      for (let i = 0; i < checkedState.length; i++) {
        if (checkedState[i]) {
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
          checkedState[i] = false
        }
      }
      handleAddDietContent(dietMeals, dietId)
    }
  };

  const [addDietFood, { dietFoodError, dietFoodData }] = useMutation(ADD_DIET_FOOD);

  const handleAddDietContent = (dietMeals, planId) => {
    dietMeals.forEach((meal) => {
      let dietId = meal._id
      let title = meal.title
      let mealItem = meals[meals.findIndex(meal => meal.title === title)].content
      console.log(mealItem)
      mealItem.forEach((food) => {
        let servings = food.servings
        let id = food.food[0]._id
        console.log(foods[foods.findIndex(food => food._id === id)].title)
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

    refetch();
    onClose()
  };

  const [removeDietFood, { removeFoodError, removeFoodData }] = useMutation(REMOVE_DIET_FOOD);

  const handleRemoveDietFood = async (event) => {
    event.preventDefault()
    const { id } = event.target
    if (id !== '') {
      try {
        // add routine with variables routineNanem and routine
        const { removeFoodData } = await removeDietFood({
          variables: { plannerId, dietId: id },

          onCompleted(removeFoodData) {
            refetch();
          }
        });

      } catch (e) {
        console.error(e)
      }
    }

    onClose()
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
          variables: { plannerId: planId, weight: parseInt(weight) },

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
      <Grid templateColumns='repeat(10, 1fr)' gap={6}>
        <GridItem colSpan={5}>
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
        <GridItem colSpan={5}>
          <Card>
            <CardHeader>
              {/* header with selected date in string format */}
              <Text fontSize='2.75vw' color='var(--shade5)'>{format(new Date(date), 'MMMM do, yyyy')}</Text>
            </CardHeader>
            <CardBody>
              <Box display='flex' justifyContent='space-between' mb='5'>
                <Box display='flex' alignItems='center'>
                  <IconButton
                    mr='3'
                    size='md'
                    bg='var(--shade5)'
                    color='white'
                    _hover={{ bg: 'var(--shade3)', color: 'var(--shade6)' }}
                    icon={<FiPlus />}
                    onClick={onOpen}
                  />
                  <Text>Add meal</Text>
                </Box>
                <Spacer />
                <Box display='flex' alignItems='center'>
                  <Text mr='3'>Weight:</Text>
                  <Input defaultValue={weight} onChange={(e) => { setWeight(parseInt(e.target.value)) }} />
                  {weight ? (
                    <IconButton
                      ml='3'
                      size='md'
                      bg='var(--shade5)'
                      color='white'
                      _hover={{ bg: 'var(--shade3)', color: 'var(--shade6)' }}
                      value={plannerId}
                      icon={<FiCheck />}
                      onClick={(e) => { handleAddWeight(plannerId) }}
                    />
                  ) : (
                    <IconButton
                      ml='3'
                      size='md'
                      bg='var(--shade5)'
                      color='white'
                      _hover={{ bg: 'var(--shade3)', color: 'var(--shade6)' }}
                      value={plannerId}
                      icon={<FiPlus />}
                      onClick={(e) => { handleAddWeight(plannerId) }}
                    />
                  )}

                </Box>
              </Box>
              {/* if tracked and query is complete */}
              {loading ? (
                <Box ml='40%' mb='5' display='flex' alignItems='center'>
                  <Spinner mr='3' /><Text>Loading...</Text>
                </Box>
              ) : (
                <Box>
                  {currentPlanner.length <= 0 ? (
                    <Box></Box>
                  ) : (
                    <Box>
                      <Accordion allowToggle>
                        <AccordionItem bg='var(--shade5)' color='white'>
                          <h2>
                            <AccordionButton>
                              <Box as="span" flex='1' textAlign='left'>
                                <IconButton isDisabled size='md' mr='3' bg='var(--shade5)' _hover={{ bg: 'var(--shade5)' }} />
                                <IconButton isDisabled size='md' mr='3' bg='var(--shade5)' _hover={{ bg: 'var(--shade5)' }} />
                                Meal
                              </Box>
                              <Box as="span" flex='1' textAlign='right'>
                                Serving
                              </Box>
                            </AccordionButton>
                          </h2>
                        </AccordionItem>
                        {currentPlanner.map((planner) => (
                          <AccordionItem>
                            <h2>
                              <AccordionButton _hover={{ bg: 'var(--shade3)' }}>
                                <Box as="span" flex='1' textAlign='left'>
                                  <IconButton
                                    size='md'
                                    mr='3'
                                    bg='var(--shade5)'
                                    color='white'
                                    _hover={{ bg: 'var(--shade3)', color: 'var(--shade6)' }}
                                    icon={<FiMinusSquare />}
                                    id={planner.id}
                                    onClick={handleRemoveDietFood}
                                  />
                                  <IconButton
                                    size='md'
                                    mr='3'
                                    bg='var(--shade5)'
                                    color='white'
                                    _hover={{ bg: 'var(--shade3)', color: 'var(--shade6)' }}
                                    icon={<FiEdit />}
                                  />
                                  {planner.title}
                                </Box>
                                <Box as="span" flex='1' textAlign='right'>
                                  {planner.numberOfServing}
                                </Box>
                                <AccordionIcon ml='3' />
                              </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                              {planner.content.map((content) => (
                                <Text>{foods[foods.findIndex(food => food._id === content.food)].title} {content.servings}</Text>
                              ))}
                            </AccordionPanel>
                          </AccordionItem>
                        ))}
                      </Accordion>
                      <Accordion allowToggle defaultIndex={[0]} mt='4'>
  <AccordionItem>
    <h2>
      <AccordionButton color='var(--shade5)' _hover={{ bg:'var(--shade3)'}} _expanded={{bg:'var(--shade5)', color:'white'}}>
      <AccordionIcon />
        <Box as="span" flex='1' textAlign='center' fontSize='2vw' _expanded={{color:'white'}}>
          Daily Stats
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
    <SimpleGrid columns={4} pt='5' spacingX='20px' spacingY='20px' textAlign='center'>
                        <Box p='2'>
                          <Stack>
                            <Text fontSize='2vw' color='var(--shade5)'>Calories</Text>
                            <Text fontSize='1.15vw' color='var(--shade5)'>1025/1400 kcal</Text>
                          </Stack>
                        </Box>
                        <Box pt='2'>
                          <CircularProgress value={40} color='#a7d489' size='7vw' >
                            <CircularProgressLabel>40%</CircularProgressLabel>
                          </CircularProgress>
                        </Box>
                        <Box p='2'>
                          <Stack>
                            <Text fontSize='2vw' color='var(--shade5)'>Carbs</Text>
                            <Text fontSize='1.15vw' color='var(--shade5)'>102/140 g</Text>
                          </Stack>
                        </Box>
                        <Box pt='2'>
                          <CircularProgress value={20} color='#6baee1' size='7vw' >
                            <CircularProgressLabel>20%</CircularProgressLabel>
                          </CircularProgress>
                        </Box>
                        <Box p='2'>
                          <Stack>
                            <Text fontSize='2vw' color='var(--shade5)'>Fat</Text>
                            <Text fontSize='1.15vw' color='var(--shade5)'>125/400 g</Text>
                          </Stack>
                        </Box>
                        <Box pt='2'>
                          <CircularProgress value={73} color='#ffef85' size='7vw' >
                            <CircularProgressLabel>73%</CircularProgressLabel>
                          </CircularProgress>
                        </Box>
                        <Box p='2'>
                          <Stack>
                            <Text fontSize='2vw' color='var(--shade5)'>Protein</Text>
                            <Text fontSize='1.5vw' color='var(--shade5)'>1067/1460 g</Text>
                          </Stack>
                        </Box>
                        <Box pt='2'>
                          <CircularProgress value={60} color='#f6ac69' size='7vw' >
                            <CircularProgressLabel>60%</CircularProgressLabel>
                          </CircularProgress>
                        </Box>
                        <Box p='2'>
                          <Stack>
                            <Text fontSize='2vw' color='var(--shade5)'>Sodium</Text>
                            <Text fontSize='1.15vw' color='var(--shade5)'>956/1230 mg</Text>
                          </Stack>
                        </Box>
                        <Box pt='2'>
                          <CircularProgress value={45} color='#ff6972' size='7vw' >
                            <CircularProgressLabel>45%</CircularProgressLabel>
                          </CircularProgress>
                        </Box>
                        <Box p='2'>
                          <Stack>
                            <Text fontSize='2vw' color='var(--shade5)'>Sugar</Text>
                            <Text fontSize='1.15vw' color='var(--shade5)'>15/100 g</Text>
                          </Stack>
                        </Box>
                        <Box pt='2'>
                          <CircularProgress value={30} color='#9f7dad' size='7vw' >
                            <CircularProgressLabel>30%</CircularProgressLabel>
                          </CircularProgress>
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color='var(--shade5)'>My Foods</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY='auto' maxHeight='75vh' >
            {meals.map((meal, index) => (
              <Flex key={meal._id}
                justifyContent='space-between'
                alignItems='center'
                my='3'
              >
                <Box>
                  <Checkbox
                    value={meal.title}
                    isChecked={checkedState[index]}
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
                        icon={<FiInfo />}
                      />
                    </PopoverTrigger>
                    <PopoverContent width='fit-content' border='none'>
                      <PopoverBody whiteSpace='pre-line' p='1vw' bg='var(--shade3)' color='var(--shade6)'>{mealPreview}</PopoverBody>
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
              value={plannerId}
              onClick={(e) => { handleAddDiet(e.target.value) }}
            >
              Add Meal(s)
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CalendarPage;