// import packages
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom'

// importy query and mutation
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_MEAL } from '../utils/mutations';

// // import local component
import MealContent from '../components/MealContent';

// import package components
import {
  Box, Spacer, Spinner, Heading, Text, Button, IconButton,
  InputGroup, InputLeftElement, Input,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  AlertDialog, AlertDialogBody, AlertDialogFooter,
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
} from '@chakra-ui/react'

// import icons
import { FiSearch, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

// import local style sheet
import '../styles/Meal.css';

// functional component for the meal page
const Meal = () => {

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

  // extract the routines from the query data
  const foods = data?.me.foods || [];
  const meals = data?.me.meals || [];

  // define states
  const [mealList, setMealList] = useState([...meals])
  const [displayState, setDisplayState] = useState(Array(mealList.length).fill(true))
  const [searchValue, setSearchValue] = useState('')
  const [alertState, setAlertState] = useState({ open: false, id: '' })

  // navigate for the new meal button
  const navigate = useNavigate();

  // call on render and defined state changes
  useEffect(() => {
    // set meal list on data render complete
    if (mealList.length === 0) {
      setMealList(meals)
    }
    // set display state base on search value
    setDisplayState(Array(mealList.length).fill(true))
    for (let i = 0; i < mealList.length; i++) {
      if (mealList[i].title.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
        displayState[i] = true
      } else {
        displayState[i] = false
      }
    }
    setDisplayState({ ...displayState })

    refetch();
  }, [foods, meals, mealList, searchValue])

  // mutation and function to remove meal
  const [removeMeal, { removeError, removeData }] = useMutation(REMOVE_MEAL);
  const handleRemoveMeal = async (id) => {
    if (id !== '') {
      try {
        const { removeData } = await removeMeal({
          variables: { mealId: id },
        });
        refetch();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // if no meals exist in database, render message
  if (!meals.length) {
    return (
      <Box className='meal-page'>
        {isMobile ? (
          <Box>
            <Box display='flex'>
              <Text>MEALS</Text>
              <Spacer />
              <Link to='/meal/new'><IconButton icon={<FiPlus strokeWidth='3' p='100%' />} /></Link>
            </Box>
            <Heading>No meals yet. Click [ + ] to get started!</Heading>
          </Box>
        ) : (
          <Box display='flex'>
            <Heading>No meals yet. Click [New Meal] to get started!</Heading>
            <Spacer />
            <Button variant='solid'><Link to='/meal/new'>New Meal</Link></Button>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box className='meal-page'>
      {isMobile ? (<></>) : (
        <Box display='flex'>
          <Heading>Meals</Heading>
          <Spacer />
          <Button variant='solid'><Link to='/meal/new'>New Meal</Link></Button>
        </Box>
      )}
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
          {isMobile ? (
            <Box display='flex'>
              <Text>MEALS</Text>
              <Spacer />
              <Link to='/meal/new'><IconButton icon={<FiPlus strokeWidth='3' p='100%' />} /></Link>
            </Box>
          ) : (<></>)}
          {mealList.map((meal, index) => (
            <div key={meal._id}>
              {displayState[`${index}`] ? (
                <Accordion key={meal._id} allowMultiple className='accordian'>
                  {isMobile ? (
                    <AccordionItem>
                      <Box display='flex' alignItems='center'>
                        <AccordionButton justifyContent='spaced-between'>
                          {meal.title}
                          <Spacer />
                          <AccordionIcon />
                        </AccordionButton>
                      </Box>
                      <AccordionPanel>
                        <MealContent contents={meal.content} foods={foods} />
                        <Box display='flex' justifyContent='space-between'>
                          <Button onClick={() => { navigate(`/meal/edit/${meal._id}`) }}><FiEdit />Edit</Button>
                          <Button onClick={() => { setAlertState({ ...alertState, open: true, id: meal._id }) }}><FiTrash2 />Delete</Button>
                        </Box>
                      </AccordionPanel>
                    </AccordionItem>
                  ) : (
                    <AccordionItem>
                      <Box display='flex' alignItems='center'>
                        <AccordionButton justifyContent='spaced-between'>
                          {meal.title}
                          <Spacer />
                        </AccordionButton>
                        <Box display='flex'>
                          <IconButton onClick={() => { navigate(`/meal/edit/${meal._id}`) }} size='md' icon={<FiEdit p='100%' />} />
                          <IconButton onClick={() => { setAlertState({ ...alertState, open: true, id: meal._id }) }} size='md' icon={<FiTrash2 p='100%' />} />
                        </Box>
                        <AccordionIcon />
                      </Box>
                      <AccordionPanel>
                        <MealContent contents={meal.content} foods={foods} />
                      </AccordionPanel>
                    </AccordionItem>
                  )}
                </Accordion>
              ) : (
                <></>
              )}
            </div>
          ))}
          <AlertDialog
            isCentered
            isOpen={alertState.open}
            onClose={() => { setAlertState({ ...alertState, open: false }) }}
          >
            <AlertDialogOverlay>
              <AlertDialogContent className='meal-alert' maxW={isMobile ? '75%' : '30%'}>
                <AlertDialogHeader>
                  Confirm Delete
                </AlertDialogHeader>
                <AlertDialogBody>
                  {alertState.id !== '' ?
                    meals[meals.findIndex((meal) => meal._id === alertState.id)].title
                    : ''}
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button onClick={() => { setAlertState({ ...alertState, open: false }) }}>
                    Cancel
                  </Button>
                  <Button onClick={() => { handleRemoveMeal(alertState.id) }}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Box>
      )}
    </Box>
  );
}

export default Meal;