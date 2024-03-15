// import packages
import React, { useEffect, useState, Fragment } from 'react';

// importy query and mutations
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_FOOD, REMOVE_MEAL_FOOD } from '../utils/mutations';

// import local component
import AddFood from '../components/AddFood';
import EditFood from '../components/EditFood';

// import package components
import {
  Box, Flex, Spacer, Spinner, Heading, Button, IconButton,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Input, InputGroup, InputLeftElement,
  AlertDialog, AlertDialogBody, AlertDialogFooter,
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react'

// import icons
import { FiChevronUp, FiChevronDown, FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';

// import local style sheet
import '../styles/Food.css';

// functional component for the food page
const Food = () => {

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

  // extract the routines from the query data
  const foods = data?.me.foods || [];
  const meals = data?.me.meals || [];

  // define states
  const [foodList, setFoodList] = useState([...foods])
  const [alertState, setAlertState] = useState({ open: false, id: '' })
  const [modalState, setModalState] = useState(false)
  const [drawerState, setDrawerState] = useState(false)
  const [displayState, setDisplayState] = useState(Array(foodList.length).fill(true))
  const [associatedMeal, setAssociatedMeal] = useState([])
  const [deleteMessage, setDeleteMessage] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [editIndex, setEditIndex] = useState(0);
  const [formState, setFormState] = useState({
    title: '',
    servingSize: '',
    servingUnit: '',
    calories: '',
    carbs: '',
    fat: '',
    protein: '',
    sodium: '',
    sugar: '',
  });
  const [sortState, setSortState] = useState({
    field: 'title',
    title: true,
    servingSize: true,
    calories: true,
    carbs: true,
    fat: true,
    protein: true,
    sodium: true,
    sugar: true
  })

  // call on render and defined state changes
  useEffect(() => {
    // set food list and sort based on sortState field
    setFoodList(foods)
    let sortFood = [...foods]
    if (sortState.field === 'title' && sortState.title) {
      sortFood.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
    } else if (sortState.field === 'title' && !sortState.title) {
      sortFood.sort((a, b) => (a.title < b.title) ? 1 : ((b.title < a.title) ? -1 : 0))
    } else if (sortState.field === 'servingSize' && sortState.servingSize) {
      sortFood.sort((a, b) => parseFloat(a.servingSize) - parseFloat(b.servingSize));
    } else if (sortState.field === 'servingSize' && !sortState.servingSize) {
      sortFood.sort((a, b) => parseFloat(b.servingSize) - parseFloat(a.servingSize));
    } else if (sortState.field === 'calories' && sortState.calories) {
      sortFood.sort((a, b) => parseFloat(a.calories) - parseFloat(b.calories));
    } else if (sortState.field === 'calories' && !sortState.calories) {
      sortFood.sort((a, b) => parseFloat(b.calories) - parseFloat(a.calories));
    } else if (sortState.field === 'carbs' && sortState.carbs) {
      sortFood.sort((a, b) => parseFloat(a.carbs) - parseFloat(b.carbs));
    } else if (sortState.field === 'carbs' && !sortState.carbs) {
      sortFood.sort((a, b) => parseFloat(b.carbs) - parseFloat(a.carbs));
    } else if (sortState.field === 'fat' && sortState.fat) {
      sortFood.sort((a, b) => parseFloat(a.fat) - parseFloat(b.fat));
    } else if (sortState.field === 'fat' && !sortState.fat) {
      sortFood.sort((a, b) => parseFloat(b.fat) - parseFloat(a.fat));
    } else if (sortState.field === 'protein' && sortState.protein) {
      sortFood.sort((a, b) => parseFloat(a.protein) - parseFloat(b.protein));
    } else if (sortState.field === 'protein' && !sortState.protein) {
      sortFood.sort((a, b) => parseFloat(b.protein) - parseFloat(a.protein));
    } else if (sortState.field === 'sodium' && sortState.sodium) {
      sortFood.sort((a, b) => parseFloat(a.sodium) - parseFloat(b.sodium));
    } else if (sortState.field === 'sodium' && !sortState.sodium) {
      sortFood.sort((a, b) => parseFloat(b.sodium) - parseFloat(a.sodium));
    } else if (sortState.field === 'sugar' && sortState.sugar) {
      sortFood.sort((a, b) => parseFloat(a.sugar) - parseFloat(b.sugar));
    } else if (sortState.field === 'sugar' && !sortState.sugar) {
      sortFood.sort((a, b) => parseFloat(b.sugar) - parseFloat(a.sugar));
    }
    setFoodList(sortFood)

    // set display state base on search value
    setDisplayState(Array(foodList.length).fill(true))
    for (let i = 0; i < sortFood.length; i++) {
      if (sortFood[i].title.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
        displayState[i] = true
      } else {
        displayState[i] = false
      }
    }
    setDisplayState({ ...displayState })

    refetch();
  }, [foods, searchValue, sortState])


  const getFoodAssociation = (id) => {
    let affectedMeals = []
    let mealIds = []
    meals.forEach((meal) => {
      let content = meal.content
      for (let i = 0; i < content.length; i++) {
        if (content[i].food === id) {
          affectedMeals.push(meal.title)
          mealIds.push(meal._id)
        }
      }
    })
    let response = ''
    if (affectedMeals.length !== 0) {
      setAssociatedMeal(mealIds)
      response =
        'The food will be removed from the following meal(s):\n\n ' + affectedMeals.join('\n')
      setDeleteMessage(response)
    } else {
      setAssociatedMeal([])
      response = 'You can not undo this action afterwards.'
      setDeleteMessage(response)
    }
  }

  // mutation and function to remove food
  const [removeMealFood, { removeMealFoodError, removeMealFoodData }] = useMutation(REMOVE_MEAL_FOOD);
  const handleRemoveMealFood = () => {
    if (associatedMeal.length !== 0) {
      associatedMeal.forEach((meal) => {
        try {
          const { removeMealFoodData } = removeMealFood({
            variables: { mealId: meal, foodId: alertState.id },
          });

        } catch (e) {
          console.error(e);
        }
      })
      handleRemoveFood(alertState.id)
    } else {
      handleRemoveFood(alertState.id)
    }
  };

  // mutation and function to remove food
  const [removeFood, { removeError, removeData }] = useMutation(REMOVE_FOOD);
  const handleRemoveFood = async (id) => {
    try {
      const { removeData } = await removeFood({
        variables: { foodId: id },
      });
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  // if no food exist in database, render message
  if (!foods.length) {
    return (
      <Box className='food-page'>
        <Flex>
          <Box>
            <Heading>No food yet. Click [Add Food] to get started!</Heading>
          </Box>
          <Spacer />
          <Box>
            <Button
              variant='solid'
              onClick={() => {
                setModalState(true);
                setTimeout(
                  function () {
                    setModalState(false)
                  }, 1000);
              }}
            >
              Add Food
            </Button>
          </Box>
          <AddFood addOpenState={modalState} addDetails={[]} />
        </Flex >
      </Box>
    );
  };

  return (
    <Box className='food-page'>
      <Flex>
        <Box>
          <Heading>Foods</Heading>
        </Box>
        <Spacer />
        <Box>
          <Button
            variant='solid'
            onClick={() => {
              setModalState(true);
              setTimeout(
                function () {
                  setModalState(false)
                }, 1000);
            }}
          >
            Add Food
          </Button>
        </Box>
        <AddFood addOpenState={modalState} addDetails={[]} />
      </Flex>
      {loading ? (
        <Box textAlign='center'>
          <Spinner /> Loading...
        </Box>
      ) : (
        <Box>
          <Box>
            <InputGroup>
              <InputLeftElement pointerEvents='none'>
                <FiSearch color='var(--shade5)' />
              </InputLeftElement>
              <Input onChange={(e) => { setSearchValue(e.target.value) }} />
            </InputGroup>
          </Box>
          <TableContainer>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>
                    <Button
                      display='flex'
                      alignItems='center'
                      id='title'
                      onClick={(e) => { setSortState({ ...sortState, field: e.target.id, title: !sortState.title }) }}
                    >
                      Name&nbsp;&nbsp;{sortState.title ? (<FiChevronDown strokeWidth='4' />) : (<FiChevronUp strokeWidth='4' />)}
                    </Button>
                  </Th>
                  <Th>
                    <Button
                      display='flex'
                      alignItems='center'
                      id='servingSize'
                      onClick={(e) => { setSortState({ ...sortState, field: e.target.id, servingSize: !sortState.servingSize }) }}
                    >
                      Serving Size&nbsp;&nbsp;{sortState.servingSize ? (<FiChevronDown strokeWidth='4' />) : (<FiChevronUp strokeWidth='4' />)}
                    </Button>
                  </Th>
                  <Th>
                    <Button
                      display='flex'
                      alignItems='center'
                    >
                      Unit
                    </Button>
                  </Th>
                  <Th>
                    <Button
                      display='flex'
                      alignItems='center'
                      id='calories'
                      onClick={(e) => { setSortState({ ...sortState, field: e.target.id, calories: !sortState.calories }) }}
                    >
                      Calories (kcal)&nbsp;&nbsp;{sortState.calories ? (<FiChevronDown strokeWidth='4' />) : (<FiChevronUp strokeWidth='4' />)}
                    </Button>
                  </Th>
                  <Th>
                    <Button
                      display='flex'
                      alignItems='center'
                      id='carbs'
                      onClick={(e) => { setSortState({ ...sortState, field: e.target.id, carbs: !sortState.carbs }) }}
                    >
                      Carbs (g)&nbsp;&nbsp;{sortState.carbs ? (<FiChevronDown strokeWidth='4' />) : (<FiChevronUp strokeWidth='4' />)}
                    </Button>
                  </Th>
                  <Th>
                    <Button
                      display='flex'
                      alignItems='center'
                      id='fat'
                      onClick={(e) => { setSortState({ ...sortState, field: e.target.id, fat: !sortState.fat }) }}
                    >
                      Fat (g)&nbsp;&nbsp;{sortState.fat ? (<FiChevronDown strokeWidth='4' />) : (<FiChevronUp strokeWidth='4' />)}
                    </Button>
                  </Th>
                  <Th>
                    <Button
                      display='flex'
                      alignItems='center'
                      id='protein'
                      onClick={(e) => { setSortState({ ...sortState, field: e.target.id, protein: !sortState.protein }) }}
                    >
                      Protein (g)&nbsp;&nbsp;{sortState.protein ? (<FiChevronDown strokeWidth='4' />) : (<FiChevronUp strokeWidth='4' />)}
                    </Button>
                  </Th>
                  <Th>
                    <Button
                      display='flex'
                      alignItems='center'
                      id='sodium'
                      onClick={(e) => { setSortState({ ...sortState, field: e.target.id, sodium: !sortState.sodium }) }}
                    >
                      Sodium (mg)&nbsp;&nbsp;{sortState.sodium ? (<FiChevronDown strokeWidth='4' />) : (<FiChevronUp strokeWidth='4' />)}
                    </Button>
                  </Th>
                  <Th>
                    <Button
                      display='flex'
                      alignItems='center'
                      id='sugar'
                      onClick={(e) => { setSortState({ ...sortState, field: e.target.id, sugar: !sortState.sugar }) }}
                    >
                      Sugar (g)&nbsp;&nbsp;{sortState.sugar ? (<FiChevronDown strokeWidth='4' />) : (<FiChevronUp strokeWidth='4' />)}
                    </Button>
                  </Th>
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {foodList.map((food, index) => (
                  <Fragment key={food._id}>
                    {displayState[index] ? (
                      <Tr key={food._id} _hover={{ bg: 'var(--shade4)' }}>
                        <Td>{food.title}</Td>
                        <Td isNumeric>{food.servingSize}</Td>
                        <Td>{food.servingUnit}</Td>
                        <Td isNumeric>{food.calories}</Td>
                        <Td isNumeric>{food.carbs}</Td>
                        <Td isNumeric>{food.fat}</Td>
                        <Td isNumeric>{food.protein}</Td>
                        <Td isNumeric>{food.sodium}</Td>
                        <Td isNumeric>{food.sugar}</Td>
                        <Td><IconButton onClick={() => {
                          setEditIndex(index);
                          setFormState({
                            ...formState,
                            title: (food.title),
                            servingSize: food.servingSize,
                            servingUnit: food.servingUnit,
                            calories: food.calories,
                            carbs: food.carbs,
                            fat: food.fat,
                            protein: food.protein,
                            sodium: food.sodium,
                            sugar: food.sugar,
                          });
                          setModalState(false);
                          setDrawerState(true);
                        }}
                          size='sm' icon={<FiEdit p='100%' />} /></Td>
                        <Td><IconButton onClick={() => { setAlertState({ ...alertState, open: true, id: food._id }); getFoodAssociation(food._id) }} size='sm' icon={<FiTrash2 p='100%' />} /></Td>
                      </Tr>
                    ) : (
                      <></>
                    )}
                  </Fragment>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <EditFood editOpenState={drawerState} editDetails={formState} editId={foods[editIndex]._id} />
          <AddFood addOpenState={modalState} addDetails={[]} />
        </Box>
      )}
      <AlertDialog
        isOpen={alertState.open}
        onClose={() => { setAlertState({ ...alertState, open: false }) }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent className='delete-food'>
            <AlertDialogHeader>
              Confirm Delete
              <span>
                {alertState.id === '' ? ('') : (foods[foods.findIndex((food) => food._id === alertState.id)].title)}
              </span>
            </AlertDialogHeader>
            <AlertDialogBody whiteSpace='pre-line'>
              {alertState.id === '' ? ('') : deleteMessage}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => { setAlertState({ ...alertState, open: false }) }}>
                Cancel
              </Button>
              <Button onClick={() => { handleRemoveMealFood() }}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default Food;