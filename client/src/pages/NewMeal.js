// import package
import React, { useState, useEffect } from 'react';
import { useStateWithCallbackInstant } from 'use-state-with-callback';
import { Link } from 'react-router-dom'

// importy query
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { ADD_MEAL } from '../utils/mutations';

// // import local component
// import FoodCards from '../components/FoodCards';

// import package components
import {
  chakra, Flex, Box, Spacer, Heading, Button, Spinner, IconButton,
  Input, InputGroup, InputLeftAddon, InputRightAddon, Text, Tooltip,
  Checkbox, useCheckbox, useCheckboxGroup,
  Popover, PopoverTrigger, PopoverContent, PopoverHeader,
  PopoverBody, PopoverFooter, PopoverArrow,
  PopoverCloseButton, PopoverAnchor,
  Accordion, AccordionItem,
  AccordionButton, AccordionPanel, AccordionIcon,
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

// functional component for the foods page
const NewMeal = () => {

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

  // define add routine mutation
  const [addMeal, { error, mealData }] = useMutation(ADD_MEAL);

  const { isOpen, onOpen, onClose } = useDisclosure()

  // extract the foods from the query data
  const foods = data?.me.foods || [];

  const [foodsList, setFoodList] = useState(foods)

  // set state of combined preview text
  const [foodPreview, setFoodPreview] = useState('')

  const [mealDetails, setMealDetails] = useState({ title: '', numberOfServing: 1 })

  const [total, setTotal] = useState({
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
    sodium: 0,
    sugar: 0,
  });

  const [checkedState, setCheckedState] = useState(Array(foodsList.length).fill(false))

  const [foodAdded, setFoodAdded] = useState([])

  useEffect(() => {
      let newTotal = { calories: 0, carbs: 0, fat: 0, protein: 0, sodium: 0, sugar: 0 }
  
      for (let i = 0; i < foodAdded.length; i++) {
        newTotal.calories += foods[foods.findIndex(food => food._id === foodAdded[i])].calories
        newTotal.carbs += foods[foods.findIndex(food => food._id === foodAdded[i])].carbs
        newTotal.fat += foods[foods.findIndex(food => food._id === foodAdded[i])].fat
        newTotal.protein += foods[foods.findIndex(food => food._id === foodAdded[i])].protein
        newTotal.sodium += foods[foods.findIndex(food => food._id === foodAdded[i])].sodium
        newTotal.sugar += foods[foods.findIndex(food => food._id === foodAdded[i])].sugar
      }
  
      setTotal({
        calories: newTotal.calories,
        carbs: newTotal.carbs,
        fat: newTotal.fat,
        protein: newTotal.protein,
        sodium: newTotal.sodium,
        sugar: newTotal.sugar
      })
  });

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

    let foodIds = foodAdded
    // loop through all the checked routines to add
    for (let i = 0; i < checkedState.length; i++) {
      if (checkedState[i]) {
        let foodIndex = foods.findIndex(food => food.title === foodsList[i].title)
        if (foodIds.indexOf(foods[foodIndex]._id) === -1) {
          foodIds.push(foods[foodIndex]._id)
        }
        checkedState[i] = false
        setFoodList(foods => foods.filter((food) => food.title != foodsList[i].title))
      }
    }

    onClose()
  };

  const handleRemoveFood = async (event) => {
    event.preventDefault()
    const { id } = event.target

    foodsList.push(foods[foods.findIndex(food => food._id === id)])
    setFoodAdded(foodAdded.filter((item) => item !== id))
  };

  const handleAddMeal = async (event) => {
    event.preventDefault()

    console.log(mealDetails)
    // try {
    //   // add routine with variables routineNanem and routine
    //   const { mealData } = await addFood({
    //     variables: { ...formState },
    //   });

    //   // redirect back to the routines page
    //   window.location.assign('/meal');
    // } catch (e) {
    //   console.error(e);
    // }
  };

  return (
    <Box className='new-meal-page'>
      <Heading size='2xl' mb='5vh'>Create a New Meal</Heading>
      <Flex mb='5'>
        <Box>
          <InputGroup size='lg' width='65vw' borderWidth='2px' borderColor='var(--shade5)' borderRadius='10'>
            <InputLeftAddon children='Meal Name' bg='var(--shade3)' />
            <Input 
            type='text' 
            name='title' 
            placeholder='i.e. Protein Shake'
            onChange={(e) => {setMealDetails({...mealDetails, title: e.target.value})}}
            />
          </InputGroup>
        </Box>
        <Spacer />
        <Box>
          <InputGroup size='lg' width='25vw' borderWidth='2px' borderColor='var(--shade5)' borderRadius='10'>
            <InputLeftAddon children='Number of Serving' bg='var(--shade3)' />
            <NumberInput defaultValue={1} precision={2} step={0.25} width='100%'>
              <NumberInputField onChange={(e) => {setMealDetails({...mealDetails, numberOfServing: e.target.value})}}/>
              <NumberInputStepper>
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
              {foodAdded.map((id) => (
                <Tr>
                  <Td>
                    <IconButton
                      size='md'
                      bg='var(--shade1)'
                      color='var(--shade5)'
                      _hover={{ bg: 'var(--shade6)', color: 'var(--shade2)' }}
                      icon={<FiMinusSquare p='100%' />}
                      id={id}
                      onClick={handleRemoveFood}
                    />
                  </Td>
                  <Td>{foods[foods.findIndex(food => food._id === id)].title}</Td>
                  <Td isNumeric><Input htmlSize={4} width='auto' textAlign='center' /></Td>
                  <Td>{foods[foods.findIndex(food => food._id === id)].servingSize} {foods[foods.findIndex(food => food._id === id)].servingUnit}</Td>
                  <Td isNumeric>{foods[foods.findIndex(food => food._id === id)].calories}</Td>
                  <Td isNumeric>{foods[foods.findIndex(food => food._id === id)].carbs}</Td>
                  <Td isNumeric>{foods[foods.findIndex(food => food._id === id)].fat}</Td>
                  <Td isNumeric>{foods[foods.findIndex(food => food._id === id)].protein}</Td>
                  <Td isNumeric>{foods[foods.findIndex(food => food._id === id)].sodium}</Td>
                  <Td isNumeric>{foods[foods.findIndex(food => food._id === id)].sugar}</Td>
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
      </Box>
      <Box textAlign='center' my='5vh'>
        <Button variant='solid' onClick={handleAddMeal}>Add Meal</Button>
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

export default NewMeal;