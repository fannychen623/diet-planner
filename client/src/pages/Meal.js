// import packages
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

// importy query and mutation
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_MEAL } from '../utils/mutations';

// // import local component
import MealContent from '../components/MealContent';

// import package components
import {
  Box, Flex, Spacer, Spinner, Heading, Button, IconButton,
  InputGroup, InputLeftElement, Input,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
} from '@chakra-ui/react'

// import icons
import { FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';

// import local style sheet
import '../styles/Meal.css';

// functional component for the meal page
const Meal = () => {

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
        <Flex>
          <Box>
            <Heading>No meals yet. Click [New Meal] to get started!</Heading>
          </Box>
          <Spacer />
          <Box>
            <Button variant='solid'><Link to='/meal/new'>New Meal</Link></Button>
          </Box>
        </Flex >
      </Box>
    );
  };

  return (
    <Box className='meal-page'>
      <Flex>
        <Box>
          <Heading>Meals</Heading>
        </Box>
        <Spacer />
        <Box>
          <Button variant='solid'><Link to='/meal/new'>New Meal</Link></Button>
        </Box>
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
          {mealList.map((meal, index) => (
            <div key={meal._id}>
              {displayState[`${index}`] ? (
                <Accordion key={meal._id} allowMultiple className='accordian'>
                  <AccordionItem>
                    <Box display='flex' alignItems='center'>
                      <AccordionButton justifyContent='spaced-between'>
                        {meal.title}
                        <Spacer />
                      </AccordionButton>
                      <Box display='flex'>
                        <IconButton onClick={() => { navigate(`/meal/edit/${meal._id}`) }} size='md' icon={<FiEdit p='100%' />} />
                        <IconButton onClick={() => { handleRemoveMeal(`${meal._id}`) }} size='md' icon={<FiTrash2 p='100%' />} />
                      </Box>
                      <AccordionIcon />
                    </Box>
                    <AccordionPanel>
                      <MealContent contents={meal.content} foods={foods} />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              ) : (
                <></>
              )}
            </div>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default Meal;