// import packages
import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive';

// importy query
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { UPDATE_FOOD, REMOVE_FOOD } from '../utils/mutations';

// // import local component
// import FoodCards from '../components/FoodCards';

// import package components
import {
  Flex, Box, Spacer, Heading, Button, Spinner, IconButton,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Input, InputGroup, InputLeftAddon, InputRightAddon,
  Drawer, DrawerBody, DrawerFooter, DrawerHeader,
  DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure,
} from '@chakra-ui/react'

// import icons
import {
  FiCheck, FiX, FiEdit, FiTrash2,
  FiPlusSquare, FiMinusSquare,
  FiExternalLink, FiEye, FiEdit3
} from 'react-icons/fi';

// import local style sheet
import '../styles/Food.css';

// functional component for the routines page
const Food = () => {

  const { isOpen, onOpen, onClose } = useDisclosure()

  const isMobile = useMediaQuery({ query: `(max-width: 768px)` });

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

  const [editIndex, setEditIndex] = useState(0);

  // extract the routines from the query data
  const foods = data?.me.foods || [];

  // set the form state, default empty
  const [formState, setFormState] = useState({
    name: '',
    servingSize: '',
    servingUnit: '',
    calories: '',
    carbs: '',
    fat: '',
    protein: '',
    sodium: '',
    sugar: '',
  });

  // on title/text change
  const handleChange = (name, value) => {
    // set the form state to the new values
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // define add routine mutation
  const [updateFood, { updateError, updateData }] = useMutation(UPDATE_FOOD);

  // define add routine mutation
  const [removeFood, { removeError, removeData }] = useMutation(REMOVE_FOOD);

  // on click (update post button)
  const handleUpdateFood = async (event) => {
    event.preventDefault();
    const { id } = event.target;

    // check that both title and text are not empty
    if (formState.title !== '' &&
      formState.servingSize !== '' &&
      formState.servingUnit !== '' &&
      formState.calories !== '' &&
      formState.carbs !== '' &&
      formState.fat !== '' &&
      formState.protein !== '' &&
      formState.sodium !== '' &&
      formState.sugar !== ''
    ) {
      try {
        // update post with variables postId and formstates
        const { updateData } = await updateFood({
          variables: { foodId: id, ...formState },
        });

        // redirect to posts page
        window.location.assign('/food');
      } catch (e) {
        console.error(e);
      }
    }
  };

  // on click to remove food (delete button)
  const handleRemoveFood = async (id) => {
    console.log(id)

    // if id is not blank
    if (id !== '') {
      try {
        // remove comment with variables postId and commentId
        const { removeData } = await removeFood({
          variables: { foodId: id },
        });

        // re-render the page
        refetch();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // if not routines were passed, return message
  if (!foods.length) {
    return (
      <Box className='food-page'>
        <Flex>
          <Box>
            <Heading>You don't have any foods yet. Click 'Add Food' to get started!</Heading>
          </Box>
          <Spacer />
          <Box>
            {/* button to create new routine, embedded with link to the createRoutines component */}
            {/* alternative, can use navigate onClick to achieve the same results */}
            <Button variant='solid'><Link to='/food/add'>Add Food</Link></Button>
          </Box>
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
          {/* button to create new routine, embedded with link to the createRoutines component */}
          {/* alternative, can use navigate onClick to achieve the same results */}
          <Button variant='solid'><Link to='/food/add'>Add Food</Link></Button>
        </Box>
      </Flex>
      {/* populate page only once data loads */}
      {loading ? (
        <Box m='auto' mb='10'>
          <Link to='/'><Spinner /> Loading...</Link>
        </Box>
      ) : (
        // populate with food data once loaded
        <Box>
          <TableContainer>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th text>Name</Th>
                  <Th isNumeric>Serving Size</Th>
                  <Th>Unit</Th>
                  <Th isNumeric>Calories (kcal)</Th>
                  <Th isNumeric>Carbs (g)</Th>
                  <Th isNumeric>Fat (g)</Th>
                  <Th isNumeric>Protein (g)</Th>
                  <Th isNumeric>Sodium (mg)</Th>
                  <Th isNumeric>Sugar (g)</Th>
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {foods.map((food, index) => (
                  <Tr key={index} _hover={{ bg: 'var(--shade4)' }}>
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
                      setEditIndex(`${index}`);
                      setFormState({
                        ...formState,
                        title: (`${food.title}`),
                        servingSize: parseInt(`${food.servingSize}`),
                        servingUnit: (`${food.servingUnit}`),
                        calories: parseInt(`${food.calories}`),
                        carbs: parseInt(`${food.carbs}`),
                        fat: parseInt(`${food.fat}`),
                        protein: parseInt(`${food.protein}`),
                        sodium: parseInt(`${food.sodium}`),
                        sugar: parseInt(`${food.sugar}`),
                      }); onOpen()
                    }}
                      size='sm' icon={<FiEdit p='100%' />} /></Td>
                    <Td><IconButton onClick={() => { handleRemoveFood(`${food._id}`) }} size='sm' icon={<FiTrash2 p='100%' />} /></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Drawer
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
            size={isMobile ? 'xs' : 'md'}
          >
            <DrawerOverlay />
            <DrawerContent overflowX='auto'>
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth='1vh' mb='2vh'>
                Edit
                <span style={{ color: 'var(--shade4)', marginLeft: '1.5%' }}>
                  {foods[editIndex].title}
                </span>
              </DrawerHeader>
              <DrawerBody>
                <Box>
                  <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                    <InputLeftAddon
                      children='Name'
                      width='40%'
                      bg='var(--shade5)'
                      color='white'
                    />
                    <Input
                      name='title'
                      value={formState.title}
                      onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                    />
                  </InputGroup>
                  <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                    <InputLeftAddon
                      children='Serving Size'
                      width='40%'
                      bg='var(--shade5)'
                      color='white'
                    />
                    <Input
                      width='50%'
                      name='servingSize'
                      value={formState.servingSize}
                      onChange={(e) => { handleChange(e.target.name, parseInt(e.target.value)) }}
                    />
                    <Input textAlign='end'
                      width='40%'
                      name='servingUnit'
                      value={formState.servingUnit}
                      onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                    />
                  </InputGroup>
                  <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                    <InputLeftAddon
                      children='Calories'
                      width='40%'
                      bg='var(--shade5)'
                      color='white'
                    />
                    <Input
                      name='calories'
                      value={formState.calories}
                      onChange={(e) => { handleChange(e.target.name, parseInt(e.target.value)) }}
                    />
                    <InputRightAddon
                      children='kcal'
                      width='20%'
                      bg='var(--shade2)'
                      color='var(--shade6)'
                    />
                  </InputGroup>
                  <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                    <InputLeftAddon
                      children='Carbs'
                      width='40%'
                      bg='var(--shade5)'
                      color='white'
                    />
                    <Input
                      name='carbs'
                      value={parseInt(formState.carbs)}
                      onChange={(e) => { handleChange(e.target.name, parseInt(e.target.value)) }}
                    />
                    <InputRightAddon
                      children='g'
                      width='20%'
                      bg='var(--shade2)'
                      color='var(--shade6)'
                    />
                  </InputGroup>
                  <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                    <InputLeftAddon
                      children='Fat'
                      width='40%'
                      bg='var(--shade5)'
                      color='white'
                    />
                    <Input
                      name='fat'
                      value={formState.fat}
                      onChange={(e) => { handleChange(e.target.name, parseInt(e.target.value)) }}
                    />
                    <InputRightAddon
                      children='g'
                      width='20%'
                      bg='var(--shade2)'
                      color='var(--shade6)'
                    />
                  </InputGroup>
                  <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                    <InputLeftAddon
                      children='Protein'
                      width='40%'
                      bg='var(--shade5)'
                      color='white'
                    />
                    <Input
                      name='protein'
                      value={formState.protein}
                      onChange={(e) => { handleChange(e.target.name, parseInt(e.target.value)) }}
                    />
                    <InputRightAddon
                      children='g'
                      width='20%'
                      bg='var(--shade2)'
                      color='var(--shade6)'
                    />
                  </InputGroup>
                  <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                    <InputLeftAddon
                      children='Sodium'
                      width='40%'
                      bg='var(--shade5)'
                      color='white'
                    />
                    <Input
                      name='sodium'
                      value={formState.sodium}
                      onChange={(e) => { handleChange(e.target.name, parseInt(e.target.value)) }}
                    />
                    <InputRightAddon
                      children='mg'
                      width='20%'
                      bg='var(--shade2)'
                      color='var(--shade6)'
                    />
                  </InputGroup>
                  <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                    <InputLeftAddon
                      children='Sugar'
                      width='40%'
                      bg='var(--shade5)'
                      color='white'
                    />
                    <Input
                      name='sugar'
                      value={formState.sugar}
                      onChange={(e) => { handleChange(e.target.name, parseInt(e.target.value)) }}
                    />
                    <InputRightAddon
                      children='g'
                      width='20%'
                      bg='var(--shade2)'
                      color='var(--shade6)'
                    />
                  </InputGroup>
                </Box>
              </DrawerBody>

              <DrawerFooter borderTopWidth='1px' justifyContent='space-between'>
                <Button variant='outline' mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  id={foods[editIndex]._id}
                  onClick={handleUpdateFood}
                  bg='var(--shade5)'
                  color='var(--shade1)'
                  _hover={{ bg: 'var(--shade3)', color: 'var(--shade6)' }}
                >
                  Submit
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Box>
      )}
    </Box>
  );
}

export default Food;