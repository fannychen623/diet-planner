// import packages
import React, { useEffect, useState } from 'react';
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
  Input, InputGroup, InputLeftElement, InputLeftAddon, InputRightAddon,
  Drawer, DrawerBody, DrawerFooter, DrawerHeader,
  DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure,
} from '@chakra-ui/react'

// import icons
import {
  FiChevronUp, FiChevronDown, FiSearch, FiEdit, FiTrash2,
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

  // extract the routines from the query data
  const foods = data?.me.foods || [];

  const [foodList, setFoodList] = useState([...foods])
  const [sortState, setSortState] = useState({
    field: 'title',
    title: true,
    servingSize: true,
    calories: true,
    carbs: true,
    fat: true,
    protein: true,
    sodium: true,
    sugar: true
  })

  const [displayState, setDisplayState] = useState(Array(foodList.length).fill(true))
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    setFoodList(foods)
    let sortFood = [...foods]
    if (sortState.field === 'title' && sortState.title) {
      sortFood.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
    } else if (sortState.field === 'title' && !sortState.title) {
      sortFood.sort((a, b) => (a.title < b.title) ? 1 : ((b.title < a.title) ? -1 : 0))
    } else if (sortState.field === 'servingSize' && sortState.servingSize) {
      sortFood.sort((a, b) => parseFloat(a.servingSize) - parseFloat(b.servingSize));
    } else if (sortState.field === 'servingSize' && !sortState.servingSize) {
      sortFood.sort((a, b) => parseFloat(b.servingSize) - parseFloat(a.servingSize));
    } else if (sortState.field === 'calories' && sortState.calories) {
      sortFood.sort((a, b) => parseFloat(a.calories) - parseFloat(b.calories));
    } else if (sortState.field === 'calories' && !sortState.calories) {
      sortFood.sort((a, b) => parseFloat(b.calories) - parseFloat(a.calories));
    } else if (sortState.field === 'carbs' && sortState.carbs) {
      sortFood.sort((a, b) => parseFloat(a.carbs) - parseFloat(b.carbs));
    } else if (sortState.field === 'carbs' && !sortState.carbs) {
      sortFood.sort((a, b) => parseFloat(b.carbs) - parseFloat(a.carbs));
    } else if (sortState.field === 'fat' && sortState.fat) {
      sortFood.sort((a, b) => parseFloat(a.fat) - parseFloat(b.fat));
    } else if (sortState.field === 'fat' && !sortState.fat) {
      sortFood.sort((a, b) => parseFloat(b.fat) - parseFloat(a.fat));
    } else if (sortState.field === 'protein' && sortState.protein) {
      sortFood.sort((a, b) => parseFloat(a.protein) - parseFloat(b.protein));
    } else if (sortState.field === 'protein' && !sortState.protein) {
      sortFood.sort((a, b) => parseFloat(b.protein) - parseFloat(a.protein));
    } else if (sortState.field === 'sodium' && sortState.sodium) {
      sortFood.sort((a, b) => parseFloat(a.sodium) - parseFloat(b.sodium));
    } else if (sortState.field === 'sodium' && !sortState.sodium) {
      sortFood.sort((a, b) => parseFloat(b.sodium) - parseFloat(a.sodium));
    } else if (sortState.field === 'sugar' && sortState.sugar) {
      sortFood.sort((a, b) => parseFloat(a.sugar) - parseFloat(b.sugar));
    } else if (sortState.field === 'sugar' && !sortState.sugar) {
      sortFood.sort((a, b) => parseFloat(b.sugar) - parseFloat(a.sugar));
    }

    setFoodList(sortFood)
    setDisplayState(Array(foodList.length).fill(true))
    for (let i = 0; i < sortFood.length; i++) {
      if (sortFood[i].title.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
        displayState[i] = true
      } else {
        displayState[i] = false
      }
    }

    setDisplayState({...displayState})

    refetch();
  }, [foods, searchValue, sortState])

  const [editIndex, setEditIndex] = useState(0);

  // set the form state, default empty
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
          variables: {
            foodId: id,
            title: formState.title,
            servingSize: parseFloat(formState.servingSize),
            servingUnit: formState.servingUnit,
            calories: parseFloat(formState.calories),
            carbs: parseFloat(formState.carbs),
            fat: parseFloat(formState.fat),
            protein: parseFloat(formState.protein),
            sodium: parseFloat(formState.sodium),
            sugar: parseFloat(formState.sugar)
          },
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
            <Heading>No food yet. Click [Add Food] to get started!</Heading>
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
        <Box textAlign='center'>
          <Spinner /> Loading...
        </Box>
      ) : (
        // populate with food data once loaded
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
                    <Button
                      display='flex'
                      alignItems='center'
                      id='title'
                      onClick={(e) => { setSortState({ ...sortState, field: e.target.id, title: !sortState.title }) }}
                    >
                      Name&nbsp;&nbsp;{sortState.title ? (<FiChevronDown stroke-width='4' />) : (<FiChevronUp stroke-width='4' />)}
                    </Button>
                  </Th>
                  <Th>
                    <Button
                      display='flex'
                      alignItems='center'
                      id='servingSize'
                      onClick={(e) => { setSortState({ ...sortState, field: e.target.id, servingSize: !sortState.servingSize }) }}
                    >
                      Serving Size&nbsp;&nbsp;{sortState.servingSize ? (<FiChevronDown stroke-width='4' />) : (<FiChevronUp stroke-width='4' />)}
                    </Button>
                  </Th>
                  <Th>
                    <Button
                      display='flex'
                      alignItems='center'
                    >
                      Unit
                    </Button>
                  </Th>
                  <Th>
                    <Button
                      display='flex'
                      alignItems='center'
                      id='calories'
                      onClick={(e) => { setSortState({ ...sortState, field: e.target.id, calories: !sortState.calories }) }}
                    >
                      Calories (kcal)&nbsp;&nbsp;{sortState.calories ? (<FiChevronDown stroke-width='4' />) : (<FiChevronUp stroke-width='4' />)}
                    </Button>
                  </Th>
                  <Th>
                    <Button
                      display='flex'
                      alignItems='center'
                      id='carbs'
                      onClick={(e) => { setSortState({ ...sortState, field: e.target.id, carbs: !sortState.carbs }) }}
                    >
                      Carbs (g)&nbsp;&nbsp;{sortState.carbs ? (<FiChevronDown stroke-width='4' />) : (<FiChevronUp stroke-width='4' />)}
                    </Button>
                  </Th>
                  <Th>
                    <Button
                      display='flex'
                      alignItems='center'
                      id='fat'
                      onClick={(e) => { setSortState({ ...sortState, field: e.target.id, fat: !sortState.fat }) }}
                    >
                      Fat (g)&nbsp;&nbsp;{sortState.fat ? (<FiChevronDown stroke-width='4' />) : (<FiChevronUp stroke-width='4' />)}
                    </Button>
                  </Th>
                  <Th>
                    <Button
                      display='flex'
                      alignItems='center'
                      id='protein'
                      onClick={(e) => { setSortState({ ...sortState, field: e.target.id, protein: !sortState.protein }) }}
                    >
                      Protein (g)&nbsp;&nbsp;{sortState.protein ? (<FiChevronDown stroke-width='4' />) : (<FiChevronUp stroke-width='4' />)}
                    </Button>
                  </Th>
                  <Th>
                    <Button
                      display='flex'
                      alignItems='center'
                      id='sodium'
                      onClick={(e) => { setSortState({ ...sortState, field: e.target.id, sodium: !sortState.sodium }) }}
                    >
                      Sodium (mg)&nbsp;&nbsp;{sortState.sodium ? (<FiChevronDown stroke-width='4' />) : (<FiChevronUp stroke-width='4' />)}
                    </Button>
                  </Th>
                  <Th>
                    <Button
                      display='flex'
                      alignItems='center'
                      id='sugar'
                      onClick={(e) => { setSortState({ ...sortState, field: e.target.id, sugar: !sortState.sugar }) }}
                    >
                      Sugar (g)&nbsp;&nbsp;{sortState.sugar ? (<FiChevronDown stroke-width='4' />) : (<FiChevronUp stroke-width='4' />)}
                    </Button>
                  </Th>
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {foodList.map((food, index) => (
                  <>
                  {displayState[`${index}`] ? (
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
                        servingSize: (`${food.servingSize}`),
                        servingUnit: (`${food.servingUnit}`),
                        calories: (`${food.calories}`),
                        carbs: (`${food.carbs}`),
                        fat: (`${food.fat}`),
                        protein: (`${food.protein}`),
                        sodium: (`${food.sodium}`),
                        sugar: (`${food.sugar}`),
                      }); onOpen()
                    }}
                      size='sm' icon={<FiEdit p='100%' />} /></Td>
                    <Td><IconButton onClick={() => { handleRemoveFood(`${food._id}`) }} size='sm' icon={<FiTrash2 p='100%' />} /></Td>
                  </Tr>
                  ):(
                    <></>
                  )}
                  </>
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
            <DrawerContent className='edit-food' overflowX='auto'>
              <DrawerCloseButton />
              <DrawerHeader>
                Edit
                <span>
                  {foods[editIndex].title}
                </span>
              </DrawerHeader>
              <DrawerBody>
                <Box>
                  <InputGroup>
                    <InputLeftAddon
                      children='Name'
                    />
                    <Input
                      name='title'
                      value={formState.title}
                      onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon
                      children='Serving Size'
                    />
                    <Input
                      borderTopRightRadius='0'
                      borderBottomRightRadius='0'
                      name='servingSize'
                      value={formState.servingSize}
                      onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                    />
                    <Input
                      name='servingUnit'
                      value={formState.servingUnit}
                      onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon
                      children='Calories'
                    />
                    <Input
                      name='calories'
                      value={formState.calories}
                      onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                    />
                    <InputRightAddon
                      children='kcal'
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon
                      children='Carbs'
                    />
                    <Input
                      name='carbs'
                      value={formState.carbs}
                      onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                    />
                    <InputRightAddon
                      children='g'
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon
                      children='Fat'
                    />
                    <Input
                      name='fat'
                      value={formState.fat}
                      onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                    />
                    <InputRightAddon
                      children='g'
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon
                      children='Protein'
                    />
                    <Input
                      name='protein'
                      value={formState.protein}
                      onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                    />
                    <InputRightAddon
                      children='g'
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon
                      children='Sodium'
                    />
                    <Input
                      name='sodium'
                      value={formState.sodium}
                      onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                    />
                    <InputRightAddon
                      children='mg'
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon
                      children='Sugar'
                    />
                    <Input
                      name='sugar'
                      value={formState.sugar}
                      onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                    />
                    <InputRightAddon
                      children='g'
                    />
                  </InputGroup>
                </Box>
              </DrawerBody>
              <DrawerFooter>
                <Button variant='outline' onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  id={foods[editIndex]._id}
                  onClick={handleUpdateFood}
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