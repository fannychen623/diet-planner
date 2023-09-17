// import packages
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { useStateWithCallbackInstant, useStateWithCallbackLazy } from 'use-state-with-callback';
import { format, formatISO } from 'date-fns';

// import queries and mutations
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from '../utils/queries';
import { ADD_PLANNER, ADD_DIET } from '../utils/mutations';

// import local components/stylesheet and pacakge components/stylesheet
// import CalendarList from '../components/CalendarList';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Calendar.css';

// import package components and icons
import {
  Grid, GridItem, Box, Spacer, Stack, Flex,
  IconButton, Spinner, Text, Button,
  Card, CardHeader, CardBody, Checkbox,
  Input, CircularProgress, CircularProgressLabel,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Popover, PopoverTrigger, PopoverContent, PopoverBody,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
} from '@chakra-ui/react'

import { FiCheck, FiSave, FiInfo, FiEdit, FiPlusSquare, FiMinusSquare, FiMinus } from 'react-icons/fi';


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

  const [date, setDate] = useState(format(new Date(), 'MM/dd/yyyy'))

  const convertToISO = () => {
    let darr = date.split('/');
    let dobj = new Date(parseInt(darr[2]), parseInt(darr[0]) - 1, parseInt(darr[1]));
    return new Date(dobj.toISOString())
  }

  // const getPlannerId = () => {
  //   let plannerDates = planners.map(planner => planner.date)
  //   if (plannerDates.includes(date)) {
  //     return planners[planners.findIndex(planner => planner.date === date)]._id
  //   } else {
  //     return 'n/a'
  //   }
  // }

  // const [plannerDates, setPlannerDates] = useState (planners.map(planner => planner.date))
  const [plannerId, setPlannerId] = useState('n/a')

  const [currentPlanner, setCurrentPlanner] = useState([])

  useEffect(() => {
    if (!data) {
      return;
    } else {
      let plannerDates = planners.map(planner => planner.date)
      let plannerIds = planners.map(planner => planner._id)
      let planId = 'n/a'
      if (plannerDates.length !== 0) {
        let planId = plannerIds[plannerDates.findIndex(plannerDate => plannerDate === date)]
        setPlannerId(planId)
      }
      let dietInfo = []
      let plannerInfo = planners[plannerDates.findIndex(plannerDate => plannerDate === date)]
      if (plannerInfo) {
        for (let i = 0; i < plannerInfo.diet.length; i++) {
          dietInfo.push({ title: plannerInfo.diet[i].title, numberOfServing: plannerInfo.diet[i].numberOfServing })
        }
      }
      setCurrentPlanner(dietInfo)
      console.log(plannerId)
      console.log(currentPlanner)
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
    console.log(type)
    if (type === 'diet') {
      try {
        const { plannerData } = await addPlanner({
          // pass in the selected date to add new tracking data
          variables: { date: date },

          onCompleted(plannerData) {
            setPlannerId(plannerData.addPlanner._id)
            handleAddDiet(plannerData.addPlanner._id)
          }
        });

      } catch (e) {
        console.error(e);
      }
    } else if (type === 'weight') {

    }
  };

  const [addDiet, { dietError, dietData }] = useMutation(ADD_DIET);

  const handleAddDiet = async (method) => {
    let planId = plannerId
    if (method === 'initialization') {
      // getPlannerId();
      planId = plannerId
    } else {
      planId = method
    }

    if (planId !== 'n/a') {
      for (let i = 0; i < checkedState.length; i++) {
        if (checkedState[i]) {
          try {
            const { dietData } = await addDiet({
              // pass in the selected date to add new tracking data
              variables: { plannerId: planId, title: meals[i].title, numberOfServing: 1, content: [] },

              onCompleted(dietData) {
                console.log(dietData)
                // handleAddMeals(plannerData.addPlanner._id)
              }
            });

            // set the storedDare in the local storage to the new date
            // localStorage.setItem('storedDate', date);

            // re-render the components to show the tracking list
            // refetch();
          } catch (e) {
            console.error(e);
          }
          checkedState[i] = false
        }
      }
    } else {
      let type = 'diet'
      handleAddPlanner(type);
    }

    onClose()
  };

  // const handleAddMeals = async (event) => {
  //   event.preventDefault()

  //   // loop through all the checked routines to add
  //   for (let i = 0; i < checkedState.length; i++) {
  //     if (checkedState[i]) {
  //       let foodIndex = foods.findIndex(food => food.title === foodsList[i].title)
  //       if (foodAdded.indexOf(foods[foodIndex]._id) === -1) {
  //         foodAdded.push({
  //           id: foods[foodIndex]._id,
  //           title: foods[foodIndex].title,
  //           servingSizeUnit: foods[foodIndex].servingSize + ' ' + foods[foodIndex].servingUnit,
  //           servings: 1,
  //           calories: foods[foodIndex].calories,
  //           carbs: foods[foodIndex].carbs,
  //           fat: foods[foodIndex].fat,
  //           protein: foods[foodIndex].protein,
  //           sodium: foods[foodIndex].sodium,
  //           sugar: foods[foodIndex].sugar,
  //         })
  //       }
  //       checkedState[i] = false
  //       setFoodList(foods => foods.filter((food) => food.title != foodsList[i].title))
  //     }
  //   }

  //   onClose()
  // };

  // set state and instantly run the callback functions
  // if a storedDate exist in local storage, set it as the initial date on render, otherwise, set it to today's date
  // all dates stored in millisecond (.getTime()) format for consistency and match functions
  // const [date, setDate] = useStateWithCallbackInstant(new Date(localStorage.getItem('storedDate')).getTime() || new Date().getTime(), newDate => {

  //   localStorage.setItem('storedDate', date);
  // });

  // // define the millisecond conversion of the selected date
  // const dateTime = new Date(date).getTime()

  // on date change (on the calendar)
  // const handleChangeDate = (e) => {

  //   setDate(e)
  // };



  // // function to add tracker on click


  // // mutation to remove tracker
  // const [removeTracker, { removeTrackerData }] = useMutation(REMOVE_TRACKER);

  // // function to remove tracker on click
  // const handleRemoveTracker = async (event) => {
  //   event.preventDefault();

  //   try {
  //     const { removeTrackerData } = await removeTracker({
  //       // pass in the trackerId of the current selected date
  //       variables: { trackerId: tracker[trackerIndex]._id },
  //     });

  //     // hide the tracking list
  //     setShowList(false)
  //     setTracked(false)
  //     // re-render the components to hide the tracking list
  //     refetch();
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  // define add routine mutation


  return (
    <Box className='calendar-page'>
      <Grid templateColumns='repeat(10, 1fr)' gap={6}>
        <GridItem colSpan={5}>
          <Box className='calendar'>
            <Box className='calendar-container'>
              {/* react calendar component */}
              <Calendar
                value={convertToISO()}
                defaultValue={new Date()}
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
                    icon={<FiPlusSquare />}
                    onClick={onOpen}
                  />
                  <Text>Add meal</Text>
                </Box>
                <Spacer />
                <Box display='flex' alignItems='center'>
                  <Text mr='2' >Weight:</Text>
                  <Input />
                  <IconButton
                    ml='3'
                    size='md'
                    bg='var(--shade5)'
                    color='white'
                    _hover={{ bg: 'var(--shade3)', color: 'var(--shade6)' }}
                    icon={<FiSave />}

                  />
                </Box>
              </Box>
              {/* if tracked and query is complete */}
              {loading ? (
                <Box m='auto' mb='5'>
                  <Link to='/'><Spinner /> Loading...</Link>
                </Box>
              ) : (
                <Box>
                  {currentPlanner.length <= 0 ? (
                    <Box></Box>
                  ) : (
                    <Box>
                      <TableContainer>
                        <Table size='md'>
                          <Thead bg='var(--shade5)'>
                            <Tr>
                              <Th width='5%'></Th>
                              <Th width='5%'></Th>
                              <Th color='white'>Meal</Th>
                              <Th isNumeric color='white'>Servings</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {currentPlanner.map((planner) => (
                              <Tr>
                                <Td pl='0'>
                                  <IconButton
                                    size='md'
                                    ml='0'
                                    bg='var(--shade5)'
                                    color='white'
                                    _hover={{ bg: 'var(--shade3)', color: 'var(--shade6)' }}
                                    icon={<FiMinusSquare />}
                                  />
                                </Td>
                                <Td pl='0'>
                                  <IconButton
                                    size='md'
                                    ml='0'
                                    bg='var(--shade5)'
                                    color='white'
                                    _hover={{ bg: 'var(--shade3)', color: 'var(--shade6)' }}
                                    icon={<FiEdit />}
                                  />
                                </Td>
                                <Td>{planner.title}</Td>
                                <Td isNumeric>{planner.numberOfServing}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                      <TableContainer variant='unstyled'>
                        <Table size='md'>
                          <Tbody>
                            <Tr>
                              <Td fontSize='2.5vw' mr='3' color='var(--shade5)'>Calories</Td>
                              <Td>
                                <CircularProgress value={40} color='green.400' size='7vw' >
                                  <CircularProgressLabel>40%</CircularProgressLabel>
                                </CircularProgress>
                              </Td>
                              <Td fontSize='2.5vw' ml='3' color='var(--shade5)'>1025/1400 kcal</Td>
                            </Tr>
                            <Tr>
                              <Td fontSize='2.5vw' mr='3' color='var(--shade5)'>Carbs</Td>
                              <Td>
                                <CircularProgress value={70} color='blue.400' size='7vw' >
                                  <CircularProgressLabel>70%</CircularProgressLabel>
                                </CircularProgress>
                              </Td>
                              <Td fontSize='2.5vw' ml='3' color='var(--shade5)'>1025/1400 g</Td>
                            </Tr>
                            <Tr>
                              <Td fontSize='2.5vw' mr='3' color='var(--shade5)'>Fat</Td>
                              <Td>
                                <CircularProgress value={30} color='orange.400' size='7vw' >
                                  <CircularProgressLabel>30%</CircularProgressLabel>
                                </CircularProgress>
                              </Td>
                              <Td fontSize='2.5vw' ml='3' color='var(--shade5)'>1025/1400 g</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TableContainer>
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
              value={'initialization'}
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