// import packages
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

// importy query
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_MEAL } from '../utils/mutations';

// // import local component
import MealContent from '../components/MealContent';

// import package components
import {
  Flex, Box, Spacer, Heading, Button, Spinner, IconButton,
  Accordion, AccordionItem,
  AccordionButton, AccordionPanel, AccordionIcon,
  InputGroup, InputLeftElement, Input,
} from '@chakra-ui/react'

// import icons
import {
  FiSearch, FiEdit, FiTrash2,
} from 'react-icons/fi';

// import local style sheet
import '../styles/Meal.css';

// functional component for the routines page
const Meal = () => {

  // navigate for the edit post button
  const navigate = useNavigate();
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

  const [mealList, setMealList] = useState([...meals])

  const [displayState, setDisplayState] = useState(Array(mealList.length).fill(true))
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    if (mealList.length === 0) {
      setMealList(meals)
    } 

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

  // define add routine mutation
  const [removeMeal, { removeError, removeData }] = useMutation(REMOVE_MEAL);

  // on click to remove food (delete button)
  const handleRemoveMeal = async (id) => {
    console.log(id)

    // if id is not blank
    if (id !== '') {
      try {
        // remove comment with variables postId and commentId
        const { removeData } = await removeMeal({
          variables: { mealId: id },
        });

        // re-render the page
        refetch();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // if not routines were passed, return message
  if (!meals.length) {
    console.log(meals)
    return (
      <Box className='meal-page'>
        <Flex>
          <Box>
            <Heading>No meals yet. Click [New Meal] to get started!</Heading>
          </Box>
          <Spacer />
          <Box>
            {/* button to create new routine, embedded with link to the createRoutines component */}
            {/* alternative, can use navigate onClick to achieve the same results */}
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
          {/* button to create new routine, embedded with link to the createRoutines component */}
          {/* alternative, can use navigate onClick to achieve the same results */}
          <Button variant='solid'><Link to='/meal/new'>New Meal</Link></Button>
        </Box>
      </Flex>
      {/* populate page only once data loads */}
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
            <>
              {displayState[`${index}`] ? (
                <Accordion allowMultiple className='accordian'>
                  <AccordionItem>
                    <AccordionButton
                      _hover={{ bg: 'var(--shade4)' }}
                      _expanded={{ bg: 'var(--shade4)' }}
                    >
                      <Box as="span" flex='1' textAlign='left'>
                        {meal.title}
                      </Box>
                      <Spacer />
                      <Box>
                        <IconButton onClick={() => { navigate(`/meal/edit/${meal._id}`) }} size='md' icon={<FiEdit p='100%' />} />
                        <IconButton onClick={() => { handleRemoveMeal(`${meal._id}`) }} size='md' icon={<FiTrash2 p='100%' />} />
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                      <MealContent contents={meal.content} foods={foods} />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              ) : (
                <></>
              )}
            </>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default Meal;