// import packages
import React from 'react';
import { Link } from 'react-router-dom'

// importy query
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';

// // import local component
// import FoodCards from '../components/FoodCards';

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
const Food = () => {

  // query all data associated with the signed in user
  const { loading, data } = useQuery(QUERY_ME);

  // extract the routines from the query data
  const foods = data?.me.foods || [];

  return (
    <Box className='food-page'>
      <Flex mb='5'>
        <Box>
          <Heading size='2xl'>Meals</Heading>
        </Box>
        <Spacer />
        <Box>
          {/* button to create new routine, embedded with link to the createRoutines component */}
          {/* alternative, can use navigate onClick to achieve the same results */}
          <Button variant='solid'><Link to='/routines/createRoutine'>New Meal</Link></Button>
        </Box>
      </Flex>
      {/* populate page only once data loads */}
      {loading ? (
        <Box m='auto' mb='10'>
          <Link to='/'><Spinner /> Loading...</Link>
        </Box>
      ) : (
        // populate with food data once loaded
        <div>
          <Accordion allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex='1' textAlign='left'>
                    Meal Name
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <TableContainer width='fit-content' m='auto'>
                  <Table variant='simple' size='md'>
                    <Thead>
                      <Tr>
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
                    <Tbody>
                      <Tr>
                        <Td>Tomato</Td>
                        <Td isNumeric>1</Td>
                        <Td>1 med</Td>
                        <Td isNumeric>22</Td>
                        <Td isNumeric>4.8</Td>
                        <Td isNumeric>0.2</Td>
                        <Td isNumeric>1.1</Td>
                        <Td isNumeric>6.2</Td>
                        <Td isNumeric>3.2</Td>
                      </Tr>
                      <Tr>
                        <Td>Corn</Td>
                        <Td isNumeric>2</Td>
                        <Td>100 gram</Td>
                        <Td isNumeric>86</Td>
                        <Td isNumeric>18.7</Td>
                        <Td isNumeric>1.4</Td>
                        <Td isNumeric>3.3</Td>
                        <Td isNumeric>15</Td>
                        <Td isNumeric>6.3</Td>
                      </Tr>
                      <Tr>
                        <Td>2% American Cheese</Td>
                        <Td isNumeric>2</Td>
                        <Td>1 slice</Td>
                        <Td isNumeric>45</Td>
                        <Td isNumeric>2</Td>
                        <Td isNumeric>2.5</Td>
                        <Td isNumeric>4</Td>
                        <Td isNumeric>210</Td>
                        <Td isNumeric>2</Td>
                      </Tr>
                      <Tr>
                        <Td>Total</Td>
                        <Td></Td>
                        <Td></Td>
                        <Td isNumeric>45</Td>
                        <Td isNumeric>2</Td>
                        <Td isNumeric>2.5</Td>
                        <Td isNumeric>4</Td>
                        <Td isNumeric>210</Td>
                        <Td isNumeric>2</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </Box>
  );
}

export default Food;