// import packages
import React, { useEffect, useMemo, useState } from 'react';

// importy query and mutation
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { UPDATE_FOOD } from '../utils/mutations';

// import package components
import {
  Box, Button, Text,
  Input, InputGroup, InputLeftAddon, InputRightAddon,
  Drawer, DrawerBody, DrawerFooter, DrawerHeader,
  DrawerOverlay, DrawerContent, DrawerCloseButton,
} from '@chakra-ui/react'

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

// functional component/drawer to edit food
// pass in food information and state of drawer
const EditFood = ({ editDetails, editId, editOpenState }) => {

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
  // map through data to get array of food titles
  const foodTitles = useMemo(() => foods.map(food => food.title) || [], [foods]);

  // set drawer open state, default false
  const [drawerState, setDrawerState] = useState(false)

  // set the state of the food information to be edited, default empty
  const [editState, setEditState] = useState({
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
    // if drawer openState passed into component is true, set the drawer state as true
    // set the food details
    if (editOpenState) {
      setDrawerState(true)
      setEditState(
        {
          ...editState,
          title: editDetails.title,
          servingSize: editDetails.servingSize,
          servingUnit: editDetails.servingUnit,
          calories: editDetails.calories,
          carbs: editDetails.carbs,
          fat: editDetails.fat,
          protein: editDetails.protein,
          sodium: editDetails.sodium,
          sugar: editDetails.sugar,
        }
      )
    }
    // call function on change of passed state and details
  }, [editOpenState, editDetails])

  // define update food mutation and error message, default blank
  const [updateFood, { updateError, updateData }] = useMutation(UPDATE_FOOD);
  const [errorMessage, setErrorMessage] = useState('')

  // function to update food
  const handleUpdateFood = async (event) => {
    event.preventDefault();
    const { id } = event.target;

    // check if all values have inputs
    let formComplete = !Object.values(editState).some(item => item === 0 || item.length === 0);
    // call to update food in database
    try {
      const { updateData } = await updateFood({
        variables: {
          foodId: id,
          title: editState.title,
          servingSize: +parseFloat(editState.servingSize).toFixed(2),
          servingUnit: editState.servingUnit,
          calories: +parseFloat(editState.calories).toFixed(2),
          carbs: +parseFloat(editState.carbs).toFixed(2),
          fat: +parseFloat(editState.fat).toFixed(2),
          protein: +parseFloat(editState.protein).toFixed(2),
          sodium: +parseFloat(editState.sodium).toFixed(2),
          sugar: +parseFloat(editState.sugar).toFixed(2),
        },
      });

      // set drawer state to false to close the drawer
      setDrawerState(false)
      // on error, based on the error, set the error message
    } catch (e) {
      console.error(e);
      if (!formComplete) { setErrorMessage('Error: Missing fields') }
      if (isNaN(editState.servingSize)) { setErrorMessage('Error: Invalid serving size input') }
      if (/\d/.test(editState.servingUnit)) { setErrorMessage('Error: Invalid serving unit input') }
      if (isNaN(editState.calories)) { setErrorMessage('Error: Invalid calories input') }
      if (isNaN(editState.carbs)) { setErrorMessage('Error: Invalid carbs input') }
      if (isNaN(editState.fat)) { setErrorMessage('Error: Invalid fat input') }
      if (isNaN(editState.protein)) { setErrorMessage('Error: Invalid protein input') }
      if (isNaN(editState.sodium)) { setErrorMessage('Error: Invalid sodium input') }
      if (isNaN(editState.sugar)) { setErrorMessage('Error: Invalid sugar input') }
      if (foodTitles.includes(editState.title)) { setErrorMessage('Error: Duplicate food name') }
    }
  };

  return (
    <Box>
      <Drawer
        isOpen={drawerState}
        placement='right'
        onClose={() => { setDrawerState(false) }}
      >
        <DrawerOverlay />
        <DrawerContent className='edit-food' overflowX='auto' maxW='35%'>
          <DrawerCloseButton />
          <DrawerHeader>
            Edit
            <span>
              {editState.title}
            </span>
          </DrawerHeader>
          <DrawerBody>
            <Box>
              <InputGroup>
                <InputLeftAddon children='Name' />
                <Input
                  value={editState.title}
                  onChange={(e) => { setEditState({ ...editState, title: toTitleCase(e.target.value) }) }}
                />
              </InputGroup>
              <InputGroup>
                <InputLeftAddon children='Serving Size' />
                <Input
                  borderTopRightRadius='0'
                  borderBottomRightRadius='0'
                  value={editState.servingSize}
                  onChange={(e) => { setEditState({ ...editState, servingSize: e.target.value }) }}
                />
                <Input
                  value={editState.servingUnit}
                  onChange={(e) => { setEditState({ ...editState, servingUnit: e.target.value.toLowerCase() }) }}
                />
              </InputGroup>
              <InputGroup>
                <InputLeftAddon children='Calories' />
                <Input
                  value={editState.calories}
                  onChange={(e) => { setEditState({ ...editState, calories: e.target.value }) }}
                />
                <InputRightAddon children='kcal' />
              </InputGroup>
              <InputGroup>
                <InputLeftAddon children='Carbs' />
                <Input
                  value={editState.carbs}
                  onChange={(e) => { setEditState({ ...editState, carbs: e.target.value }) }}
                />
                <InputRightAddon children='g' />
              </InputGroup>
              <InputGroup>
                <InputLeftAddon children='Fat' />
                <Input
                  value={editState.fat}
                  onChange={(e) => { setEditState({ ...editState, fat: e.target.value }) }}
                />
                <InputRightAddon children='g' />
              </InputGroup>
              <InputGroup>
                <InputLeftAddon children='Protein' />
                <Input
                  value={editState.protein}
                  onChange={(e) => { setEditState({ ...editState, protein: e.target.value }) }}
                />
                <InputRightAddon children='g' />
              </InputGroup>
              <InputGroup>
                <InputLeftAddon children='Sodium' />
                <Input
                  value={editState.sodium}
                  onChange={(e) => { setEditState({ ...editState, sodium: e.target.value }) }}
                />
                <InputRightAddon children='mg' />
              </InputGroup>
              <InputGroup>
                <InputLeftAddon children='Sugar' />
                <Input
                  value={editState.sugar}
                  onChange={(e) => { setEditState({ ...editState, sugar: e.target.value }) }}
                />
                <InputRightAddon children='g' />
              </InputGroup>
            </Box>
            <Text textAlign='center'>{errorMessage}</Text>
          </DrawerBody>
          <DrawerFooter>
            <Button onClick={() => { setDrawerState(false) }}>
              Cancel
            </Button>
            <Button
              id={editId}
              onClick={handleUpdateFood}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box >
  );
}

export default EditFood;