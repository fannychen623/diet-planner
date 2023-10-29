// import packages
import React, { useEffect, useState, Fragment } from 'react';

// importy query and mutations
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { UPDATE_FOOD, REMOVE_FOOD } from '../utils/mutations';

// import local component
import AddFood from '../components/AddFood';

// import package components
import {
  Box, Flex, Spacer, Spinner, Heading, Text, ButtonGroup, Button, IconButton,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Input, InputGroup, InputLeftElement, InputLeftAddon, InputRightAddon,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody,
  AlertDialog, AlertDialogBody, AlertDialogFooter,
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react'

// import icons
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';

// import local style sheet
import '../styles/Food.css';

// function to transform text to proper case
function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

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
  const foodTitles = foods.map(food => food.title) || []

  // define states
  const [foodList, setFoodList] = useState([...foods])
  const [modalState, setModalState] = useState(false)
  const [editState, setEditState] = useState({ open: false, index: 0 })
  const [alertState, setAlertState] = useState({ open: false, index: 0 })
  const [deleteState, setDeleteState] = useState(false)
  const [associateMeal, setAssociateMeal] = useState([])
  const [deleteMessage, setDeleteMessage] = useState('')
  const [displayState, setDisplayState] = useState(Array(foodList.length).fill(true))
  const [searchValue, setSearchValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
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

  const getFoodAssociation = (id) => {
    let affectedMeals = []
    let associatedMealIds = []
    meals.forEach((meal) => {
      let content = meal.content
      for (let i = 0; i < content.length; i++) {
        if (content[i].food === id) {
          affectedMeals.push(meal.title)
          associatedMealIds.push(meal._id)
        }
      }
    })
    let response = ''
    if (affectedMeals.length !== 0) {
      setAssociateMeal(associatedMealIds)
      response =
        'The food will be removed from the following meal(s) and any associated diary entries.\n\n ' + affectedMeals.join('\n')
      setDeleteMessage(response)
      } else {
      setAssociateMeal([])
      response = 'The food will be removed from any associated diary entries.\n\n'
      setDeleteMessage(response)
    }
  }

  // call on render and defined state changes
  useEffect(() => {
    setFoodList(foods)
    // set display state base on search value
    setDisplayState(Array(foodList.length).fill(true))
    for (let i = 0; i < foodList.length; i++) {
      if (foodList[i].title.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
        displayState[i] = true
      } else {
        displayState[i] = false
      }
    }
    setDisplayState({ ...displayState })

    refetch();
  }, [foods, foodList, searchValue])

  // mutation and function to update food
  const [updateFood, { updateError, updateData }] = useMutation(UPDATE_FOOD);
  const handleUpdateFood = async (event) => {
    event.preventDefault();
    const { id } = event.target;

    // check if all values have inputs
    let formComplete = !Object.values(formState).some(item => item === 0 || item.length === 0);
    // call to update food in database
    try {
      const { updateData } = await updateFood({
        variables: {
          foodId: id,
          title: formState.title,
          servingSize: +parseFloat(formState.servingSize).toFixed(2),
          servingUnit: formState.servingUnit,
          calories: +parseFloat(formState.calories).toFixed(2),
          carbs: +parseFloat(formState.carbs).toFixed(2),
          fat: +parseFloat(formState.fat).toFixed(2),
          protein: +parseFloat(formState.protein).toFixed(2),
          sodium: +parseFloat(formState.sodium).toFixed(2),
          sugar: +parseFloat(formState.sugar).toFixed(2),
        },
      });

      // set edit modal state to false to close the modal
      setEditState({ ...editState, open: false })
      // on error, based on the error, set the error message
    } catch (e) {
      console.error(e);
      if (!formComplete) { setErrorMessage('Error: Missing fields') }
      if (isNaN(formState.servingSize)) { setErrorMessage('Error: Invalid serving size input') }
      if (/\d/.test(formState.servingUnit)) { setErrorMessage('Error: Invalid serving unit input') }
      if (isNaN(formState.calories)) { setErrorMessage('Error: Invalid calories input') }
      if (isNaN(formState.carbs)) { setErrorMessage('Error: Invalid carbs input') }
      if (isNaN(formState.fat)) { setErrorMessage('Error: Invalid fat input') }
      if (isNaN(formState.protein)) { setErrorMessage('Error: Invalid protein input') }
      if (isNaN(formState.sodium)) { setErrorMessage('Error: Invalid sodium input') }
      if (isNaN(formState.sugar)) { setErrorMessage('Error: Invalid sugar input') }
      if (foodTitles.includes(formState.title)) { setErrorMessage('Error: Duplicate food name') }
    }
  };

  // mutation and function to remove food
  const [removeFood, { removeError, removeData }] = useMutation(REMOVE_FOOD);
  const handleRemoveFood = async (id) => {
    if (id !== '') {
      try {
        const { removeData } = await removeFood({
          variables: { foodId: id },
        });
        refetch();
      } catch (e) {
        console.error(e);
      }
    }
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
        </Flex >
      </Box>
    );
  };

  return (
    <Box className='food-page'>
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
                    Foods
                    <IconButton
                      icon={<FiPlus strokeWidth='3' p='100%' />}
                      onClick={() => {
                        setModalState(true);
                        setTimeout(
                          function () {
                            setModalState(false)
                          }, 1000);
                      }}
                    />
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {foodList.map((food, index) => (
                  <Fragment key={food._id}>
                    {displayState[index] ? (
                      <Tr key={food._id} _hover={{ bg: 'var(--shade4)' }}>
                        <Td onClick={() => { setAlertState({ ...alertState, open: true, index: index }) }}>
                          {food.title}
                        </Td>
                      </Tr>
                    ) : (
                      <></>
                    )}
                  </Fragment>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <AddFood addOpenState={modalState} addDetails={[]} />
          <AlertDialog
            isCentered
            isOpen={alertState.open}
            onClose={() => { setAlertState({ ...alertState, open: false }); setDeleteState(false) }}
          >
            <AlertDialogOverlay>
              <AlertDialogContent className='food-alert' maxW='75%'>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                  {foods[alertState.index].title}
                </AlertDialogHeader>
                <AlertDialogBody>
                  {deleteState ? deleteMessage : (
                    <Box>
                      <Box display='flex' justifyContent='space-between'>
                        <Text>Serving Size</Text>
                        <Spacer />
                        <Text>{foods[alertState.index].servingSize} {foods[alertState.index].servingUnit}</Text>
                      </Box>
                      <Box display='flex' justifyContent='space-between'>
                        <Text>Calories</Text>
                        <Spacer />
                        <Text>{foods[alertState.index].calories} kcal</Text>
                      </Box>
                      <Box display='flex' justifyContent='space-between'>
                        <Text>Carbs</Text>
                        <Spacer />
                        <Text>{foods[alertState.index].carbs} g</Text>
                      </Box>
                      <Box display='flex' justifyContent='space-between'>
                        <Text>Fat</Text>
                        <Spacer />
                        <Text>{foods[alertState.index].fat} g</Text>
                      </Box>
                      <Box display='flex' justifyContent='space-between'>
                        <Text>Protein</Text>
                        <Spacer />
                        <Text>{foods[alertState.index].protein} g</Text>
                      </Box>
                      <Box display='flex' justifyContent='space-between'>
                        <Text>Sodium</Text>
                        <Spacer />
                        <Text>{foods[alertState.index].sodium} mg</Text>
                      </Box>
                      <Box display='flex' justifyContent='space-between'>
                        <Text>Sugar</Text>
                        <Spacer />
                        <Text>{foods[alertState.index].sugar} g</Text>
                      </Box>
                    </Box>
                  )}
                </AlertDialogBody>
                <AlertDialogFooter>
                  {deleteState ? (
                    <ButtonGroup>
                      <Button
                        onClick={() => {
                          setModalState(false);
                          setAlertState({ ...alertState, open: false });
                          setDeleteState(false)
                        }}
                      >
                        <FiX /> Cancel
                      </Button>
                      <Button onClick={() => { handleRemoveFood(foods[alertState.index]._id) }}>
                        <FiTrash2 />Delete
                      </Button>
                      </ButtonGroup>
                  ) : (
                    <ButtonGroup>
                      <Button
                        onClick={() => {
                          setFormState({
                            ...formState,
                            title: (foods[alertState.index].title),
                            servingSize: foods[alertState.index].servingSize,
                            servingUnit: foods[alertState.index].servingUnit,
                            calories: foods[alertState.index].calories,
                            carbs: foods[alertState.index].carbs,
                            fat: foods[alertState.index].fat,
                            protein: foods[alertState.index].protein,
                            sodium: foods[alertState.index].sodium,
                            sugar: foods[alertState.index].sugar,
                          });
                          setModalState(false);
                          setEditState({ ...editState, open: true, index: alertState.index });
                          setAlertState({ ...alertState, open: false });
                        }}
                      >
                        <FiEdit /> Edit
                      </Button>
                      <Button onClick={() => { setDeleteState(true); getFoodAssociation(foods[alertState.index]._id) }}>
                        <FiTrash2 />Delete
                      </Button>
                    </ButtonGroup>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>

          <Modal isCentered isOpen={editState.open} onClose={() => { setEditState({ ...editState, open: false }) }}>
            <ModalOverlay />
            <ModalContent className='edit-food' maxW='75%'>
              <ModalHeader>{foods[editState.index].title}</ModalHeader>
              <ModalBody>
                <Box>
                  <Box>
                    <Text textAlign='center'>Name</Text>
                    <Input
                      borderTopLeftRadius='0'
                      borderTopRightRadius='0'
                      value={formState.title}
                      onChange={(e) => { setFormState({ ...formState, title: toTitleCase(e.target.value) }) }}
                    />
                  </Box>
                  <Text textAlign='center' marginTop='0.75em'>Serving Size</Text>
                  <InputGroup marginTop='0'>
                    <Input
                      borderRadius='0'
                      borderBottomLeftRadius='0.375rem'
                      value={formState.servingSize}
                      onChange={(e) => { setFormState({ ...formState, servingSize: e.target.value }) }}
                    />
                    <Input
                      borderRadius='0'
                      borderBottomRightRadius='0.375rem'
                      value={formState.servingUnit}
                      onChange={(e) => { setFormState({ ...formState, servingUnit: e.target.value.toLowerCase() }) }}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon children='Calories' />
                    <Input
                      value={formState.calories}
                      onChange={(e) => { setFormState({ ...formState, calories: e.target.value }) }}
                    />
                    <InputRightAddon children='kcal' />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon children='Carbs' />
                    <Input
                      value={formState.carbs}
                      onChange={(e) => { setFormState({ ...formState, carbs: e.target.value }) }}
                    />
                    <InputRightAddon children='g' />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon children='Fat' />
                    <Input
                      value={formState.fat}
                      onChange={(e) => { setFormState({ ...formState, fat: e.target.value }) }}
                    />
                    <InputRightAddon children='g' />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon children='Protein' />
                    <Input
                      value={formState.protein}
                      onChange={(e) => { setFormState({ ...formState, protein: e.target.value }) }}
                    />
                    <InputRightAddon children='g' />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon children='Sodium' />
                    <Input
                      value={formState.sodium}
                      onChange={(e) => { setFormState({ ...formState, sodium: e.target.value }) }}
                    />
                    <InputRightAddon children='mg' />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon children='Sugar' />
                    <Input
                      value={formState.sugar}
                      onChange={(e) => { setFormState({ ...formState, sugar: e.target.value }) }}
                    />
                    <InputRightAddon children='g' />
                  </InputGroup>
                </Box>
                <Text textAlign='center'>{errorMessage}</Text>
              </ModalBody>
              <ModalFooter>
                <Button onClick={() => { setEditState({ ...editState, open: false }) }}>
                  Cancel
                </Button>
                <Button
                  id={foods[editState.index]._id}
                  onClick={handleUpdateFood}
                >
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      )}
    </Box>
  );
}

export default Food;