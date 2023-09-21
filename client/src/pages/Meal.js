// import packages
import React from 'react';
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
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  NumberInput, NumberInputField,
  NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
} from '@chakra-ui/react'

// import icons
import {
  FiCheck, FiX, FiEdit, FiTrash2,
  FiPlusSquare, FiMinusSquare,
  FiExternalLink, FiEye, FiEdit3
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
  const meals = data?.me.meals || [];
  const foods = data?.me.foods || [];

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
            <Heading>You don't have any meals yet. Click 'New Meal' to get started!</Heading>
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
        <Box m='auto' mb='10'>
          <Link to='/'><Spinner /> Loading...</Link>
        </Box>
      ) : (
        <Box>
          {meals.map((meal, index) => (
            <Accordion allowMultiple className='accordian'>
              <AccordionItem>
                <AccordionButton 
                _hover={{ bg: 'var(--shade4)'}}
                _expanded={{ bg: 'var(--shade4)'}}
                >
                  <Box as="span" flex='1' textAlign='left'>
                    {meal.title}
                  </Box>
                  <Spacer />
                  <Box>
                  <IconButton onClick={() => { navigate(`/meal/edit/${meal._id}`) }} size='md' icon={<FiEdit />} />
                  <IconButton onClick={() => { handleRemoveMeal(`${meal._id}`) }} size='md' icon={<FiTrash2 />} />
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb='4'>
                <MealContent contents={meal.content} foods={foods} />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default Meal;