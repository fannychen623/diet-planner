// import packages
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

// importy query and mutation
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { ADD_FOOD } from '../utils/mutations';

// import package components
import {
  Box, SimpleGrid, Spacer, Text, Button,
  Input, InputGroup, InputLeftAddon, InputRightAddon,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton,
  AlertDialog, AlertDialogBody, AlertDialogFooter,
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
  AlertDialogCloseButton, useDisclosure,
} from '@chakra-ui/react'

// import icons
import { IoCloseOutline } from 'react-icons/io5';

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

// functional component/modal to add food
// pass in food information from search page if applicable and state of modal
const AddFood = ({ addDetails, addOpenState }) => {

  const isMobile = useMediaQuery({ query: `(max-width: 480px)` });

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
  const foods = data?.me.foods || []
  // map through data to get array of food titles
  const foodTitles = foods.map(food => food.title) || []

  // set modal open state, default false
  const [modalState, setModalState] = useState(false)

  // set the state of the food information to be added, default empty
  const [addState, setAddState] = useState({
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

  // call on render and defined state changes
  useEffect(() => {
    // if modal openState passed into component is true, set the modal state as true
    if (addOpenState) {
      setModalState(true)
      // if details are passed, set the food information state
      if (addDetails.length !== 0) {
        setAddState(
          {
            ...addState,
            title: addDetails.title,
            servingSize: addDetails.servingSize,
            servingUnit: addDetails.servingUnit,
            calories: addDetails.calories,
            carbs: addDetails.carbs,
            fat: addDetails.fat,
            protein: addDetails.protein,
            sodium: addDetails.sodium,
            sugar: addDetails.sugar,
          }
        )
      }
    }
    // call function on change of passed state and details
  }, [addOpenState, addDetails])


  // functions to toggle the alert dialog
  const { isOpen, onOpen, onClose } = useDisclosure()

  // define add food mutation and error message, default blank
  const [addFood, { addFoodError, addFoodData }] = useMutation(ADD_FOOD);
  const [errorMessage, setErrorMessage] = useState('')

  // function to add food
  const handleAddFood = async (event) => {
    event.preventDefault();

    // check if all values have inputs
    let formComplete = !Object.values(addState).some(item => item === 0 || item.length === 0);
    // call to add food to database
    try {
      const { addFoodData } = await addFood({
        variables: {
          title: addState.title,
          servingSize: +parseFloat(addState.servingSize).toFixed(2),
          servingUnit: addState.servingUnit,
          calories: +parseFloat(addState.calories).toFixed(2),
          carbs: +parseFloat(addState.carbs).toFixed(2),
          fat: +parseFloat(addState.fat).toFixed(2),
          protein: +parseFloat(addState.protein).toFixed(2),
          sodium: +parseFloat(addState.sodium).toFixed(2),
          sugar: +parseFloat(addState.sugar).toFixed(2),
        },
      });

      // set modal state to false to close the modal
      setModalState(false)
      // determine the pathname to either open the alert dialog or reload the page
      if (window.location.pathname === '/search') {
        onOpen()
      } else if (window.location.pathname === '/food') {
        window.location.reload();
      }
      // on error, based on the error, set the error message
    } catch (e) {
      console.error(e);
      if (!formComplete) { setErrorMessage('Error: Missing fields') }
      if (isNaN(addState.servingSize)) { setErrorMessage('Error: Invalid serving size input') }
      if (/\d/.test(addState.servingUnit)) { setErrorMessage('Error: Invalid serving unit input') }
      if (isNaN(addState.calories)) { setErrorMessage('Error: Invalid calories input') }
      if (isNaN(addState.carbs)) { setErrorMessage('Error: Invalid carbs input') }
      if (isNaN(addState.fat)) { setErrorMessage('Error: Invalid fat input') }
      if (isNaN(addState.protein)) { setErrorMessage('Error: Invalid protein input') }
      if (isNaN(addState.sodium)) { setErrorMessage('Error: Invalid sodium input') }
      if (isNaN(addState.sugar)) { setErrorMessage('Error: Invalid sugar input') }
      if (foodTitles.includes(addState.title)) { setErrorMessage('Error: Duplicate food name') }
    }
  };

  return (
    <Box>
      <Modal isOpen={modalState} onClose={() => { setModalState(false) }} isCentered >
        <ModalOverlay />
        <ModalContent className='add-food' overflowY='auto' maxW={isMobile ? '75%' : '50%'} >
          <ModalHeader>New Food<Spacer /><IoCloseOutline onClick={() => { setModalState(false) }} /></ModalHeader>
          <ModalBody>
            {isMobile ? (
              <Box>
                <Box>
                  <Text textAlign='center'>Name</Text>
                  <Input
                    borderTopLeftRadius='0'
                    borderTopRightRadius='0'
                    value={addState.title}
                    onChange={(e) => { setAddState({ ...addState, title: toTitleCase(e.target.value) }) }}
                  />
                </Box>
                <Text textAlign='center' marginTop='0.75em'>Serving Size</Text>
                <InputGroup marginTop='0'>
                  <Input
                    borderRadius='0'
                    borderBottomLeftRadius='0.375rem'
                    value={addState.servingSize}
                    onChange={(e) => { setAddState({ ...addState, servingSize: e.target.value }) }}
                  />
                  <Input
                    borderRadius='0'
                    borderBottomRightRadius='0.375rem'
                    value={addState.servingUnit}
                    onChange={(e) => { setAddState({ ...addState, servingUnit: e.target.value }) }}
                  />
                </InputGroup>
              </Box>
            ) : (
              <Box>
                <InputGroup>
                  <InputLeftAddon children='Name' />
                  <Input value={addState.title} onChange={(e) => { setAddState({ ...addState, title: toTitleCase(e.target.value) }) }} />
                </InputGroup>
                <SimpleGrid columns='2' spacingX='5'>
                  <Box>
                    <InputGroup>
                      <InputLeftAddon children='Serving Size' />
                      <Input value={addState.servingSize} onChange={(e) => { setAddState({ ...addState, servingSize: e.target.value }) }} />
                    </InputGroup>
                  </Box>
                  <Box>
                    <Input placeholder='Unit' value={addState.servingUnit} onChange={(e) => { setAddState({ ...addState, servingUnit: e.target.value.toLowerCase() }) }} />
                  </Box>
                </SimpleGrid>
              </Box>
            )}
            <SimpleGrid columns={isMobile ? 1 : 2} spacingX='5'>
              <Box>
                <InputGroup>
                  <InputLeftAddon children='Calories' />
                  <Input value={addState.calories} onChange={(e) => { setAddState({ ...addState, calories: e.target.value }) }} />
                  <InputRightAddon children='kcal' />
                </InputGroup>
              </Box>
              <Box>
                <InputGroup>
                  <InputLeftAddon children='Carbs' />
                  <Input value={addState.carbs} onChange={(e) => { setAddState({ ...addState, carbs: e.target.value }) }} />
                  <InputRightAddon children='g' />
                </InputGroup>
              </Box>
              <Box>
                <InputGroup>
                  <InputLeftAddon children='Fat' />
                  <Input value={addState.fat} onChange={(e) => { setAddState({ ...addState, fat: e.target.value }) }} />
                  <InputRightAddon children='g' />
                </InputGroup>
              </Box>
              <Box>
                <InputGroup>
                  <InputLeftAddon children='Protein' />
                  <Input value={addState.protein} onChange={(e) => { setAddState({ ...addState, protein: e.target.value }) }} />
                  <InputRightAddon children='g' />
                </InputGroup>
              </Box>
              <Box>
                <InputGroup>
                  <InputLeftAddon children='Sodium' />
                  <Input value={addState.sodium} onChange={(e) => { setAddState({ ...addState, sodium: e.target.value }) }} />
                  <InputRightAddon children='mg' />
                </InputGroup>
              </Box>
              <Box>
                <InputGroup>
                  <InputLeftAddon children='Sugar' />
                  <Input value={addState.sugar} onChange={(e) => { setAddState({ ...addState, sugar: e.target.value }) }} />
                  <InputRightAddon children='g' />
                </InputGroup>
              </Box>
            </SimpleGrid>
            <Text textAlign='center'>{errorMessage}</Text>
          </ModalBody>
          <ModalFooter justifyContent='space-between'>
            <Button colorScheme='gray' onClick={() => { setModalState(false) }}>Cancel</Button>
            <Button onClick={handleAddFood}>
              Add Food
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        motionPreset='slideInBottom'
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Food Added</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Continue search or view foods?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onClose}>
              Continue Search
            </Button>
            <Button onClick={() => { window.location.assign('/food') }}>
              View Foods
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box >
  );
}

export default AddFood;