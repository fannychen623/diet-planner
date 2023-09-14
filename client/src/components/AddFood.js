// import packages
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive';

// import mutation
import { useMutation } from '@apollo/client';
import { ADD_FOOD } from '../utils/mutations';

// import package components
import {
  SimpleGrid, Stack, Box, Divider, Text, Button,
  Card, CardHeader, CardBody, CardFooter,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Input, InputGroup, InputLeftAddon, InputRightAddon,
  Radio, RadioGroup, Checkbox, Select, IconButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  NumberInput, NumberInputField,
  NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
} from '@chakra-ui/react'

// import icons
import { FiSearch } from 'react-icons/fi';

// import local style sheet
import '../styles/Food.css';


// functional component to create routines modal
const AddFood = () => {

  // set modal to open on default
  const { isOpen } = useDisclosure({ defaultIsOpen: true })
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

  const isMobile = useMediaQuery({ query: `(max-width: 768px)` });

  // navigate back to routines on close
  const navigate = useNavigate();
  const redirectFood = () => navigate('/food');

  // define add routine mutation
  const [addFood, { error, data }] = useMutation(ADD_FOOD);

  // on click to add routine
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // add routine with variables routineNanem and routine
      const { data } = await addFood({
        variables: { ...formState },
      });

      // redirect back to the routines page
      window.location.assign('/food');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box className='food-modal'>
      <Modal isOpen={isOpen} onClose={redirectFood} isCentered >
        <ModalOverlay />
        <ModalContent mt={isMobile ? '25%' : 'auto'}  maxW={isMobile ? '75vw' : '50vw'} maxH={isMobile ? '80vh' : 'fit-content'} overflowY='auto' >
          <ModalHeader fontSize='3xl' color='var(--shade6)'>New Food</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              {isMobile ? (
                <Box>
                  <Text as='b' color='var(--shade5)' fontSize='5vw'>Search Database:</Text>
                  <Input type='text' placeholder='i.e. tomato' my='1vh' width='100%' />
                  <IconButton aria-label='Search database' bg='var(--shade2)' color='var(--shade5)' width='100%' icon={<FiSearch />} />
                </Box>
              ) : (
                <Box display='flex'>
                  <Text as='b' color='var(--shade5)' my='auto' fontSize='1.75vw'>Search Database:</Text>
                  <Input type='text' placeholder='i.e. tomato' ml='1vw' width='70%' />
                  <IconButton aria-label='Search database' bg='var(--shade2)' color='var(--shade5)' icon={<FiSearch />} />
                </Box>
              )}
              <Divider borderWidth='3px' borderColor='var(--shade5)' my='5' />
              <Text as='b' color='var(--shade5)' fontSize={isMobile ? '5vw' : '1.75vw'}>Customize:</Text>
              <FormControl isRequired>
                <InputGroup size='md' my='5' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                  <InputLeftAddon
                    children='Name'
                    width={isMobile ? '40%' : '20%'}
                    bg='var(--shade5)'
                    color='white'
                  />
                  <Input placeholder='--' onChange={(e) => { setFormState({ ...formState, title: e.target.value }) }} />
                </InputGroup>
                <SimpleGrid columns={isMobile ? '1' : '2'} spacing={3}>
                  <Box>
                    <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                      <InputLeftAddon
                        children='Serving Size'
                        width='40%'
                        bg='var(--shade5)'
                        color='white'
                      />
                      <Input placeholder='--' onChange={(e) => { setFormState({ ...formState, servingSize: parseInt(e.target.value) }) }} />
                    </InputGroup>
                  </Box>
                  <Box>
                    <Input placeholder='serving unit' 
                    borderWidth='2px' 
                    borderColor='var(--shade5)' 
                    borderRadius='10' 
                    onChange={(e) => { setFormState({ ...formState, servingUnit: e.target.value }) }} />
                  </Box>
                  <Box>
                    <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                      <InputLeftAddon
                        children='Calories'
                        width='40%'
                        bg='var(--shade5)'
                        color='white'
                      />
                      <Input placeholder='--' onChange={(e) => { setFormState({ ...formState, calories: parseInt(e.target.value) }) }} />
                      <InputRightAddon
                        children='kcal'
                        width='20%'
                        bg='var(--shade2)'
                        color='var(--shade6)'
                      />
                    </InputGroup>
                  </Box>
                  <Box>
                    <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                      <InputLeftAddon
                        children='Carbs'
                        width='40%'
                        bg='var(--shade5)'
                        color='white'
                      />
                      <Input placeholder='--' onChange={(e) => { setFormState({ ...formState, carbs: parseInt(e.target.value) }) }} />
                      <InputRightAddon
                        children='g'
                        width='20%'
                        bg='var(--shade2)'
                        color='var(--shade6)'
                      />
                    </InputGroup>
                  </Box>
                  <Box>
                    <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                      <InputLeftAddon
                        children='Fat'
                        width='40%'
                        bg='var(--shade5)'
                        color='white'
                      />
                      <Input placeholder='--' onChange={(e) => { setFormState({ ...formState, fat: parseInt(e.target.value) }) }} />
                      <InputRightAddon
                        children='g'
                        width='20%'
                        bg='var(--shade2)'
                        color='var(--shade6)'
                      />
                    </InputGroup>
                  </Box>
                  <Box>
                    <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                      <InputLeftAddon
                        children='Protein'
                        width='40%'
                        bg='var(--shade5)'
                        color='white'
                      />
                      <Input placeholder='--' onChange={(e) => { setFormState({ ...formState, protein: parseInt(e.target.value) }) }} />
                      <InputRightAddon
                        children='g'
                        width='20%'
                        bg='var(--shade2)'
                        color='var(--shade6)'
                      />
                    </InputGroup>
                  </Box>
                  <Box>
                    <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                      <InputLeftAddon
                        children='Sodium'
                        width='40%'
                        bg='var(--shade5)'
                        color='white'
                      />
                      <Input placeholder='--' onChange={(e) => { setFormState({ ...formState, sodium: parseInt(e.target.value) }) }} />
                      <InputRightAddon
                        children='mg'
                        width='20%'
                        bg='var(--shade2)'
                        color='var(--shade6)'
                      />
                    </InputGroup>
                  </Box>
                  <Box>
                    <InputGroup size='md' mb='1vh' borderWidth='1px' borderColor='var(--shade5)' borderRadius='10'>
                      <InputLeftAddon
                        children='Sugar'
                        width='40%'
                        bg='var(--shade5)'
                        color='white'
                      />
                      <Input placeholder='--' onChange={(e) => { setFormState({ ...formState, sugar: parseInt(e.target.value) }) }} />
                      <InputRightAddon
                        children='g'
                        width='20%'
                        bg='var(--shade2)'
                        color='var(--shade6)'
                      />
                    </InputGroup>
                  </Box>
                </SimpleGrid>
              </FormControl>
            </Box>
          </ModalBody>

          <ModalFooter justifyContent='space-between'>
            <Button colorScheme='gray' mr={3} onClick={redirectFood}>Close</Button>
            <Button onClick={handleFormSubmit}
              bg='var(--shade5)'
              color='var(--shade1)'
              _hover={{ bg: 'var(--shade3)', color: 'var(--shade6)' }}
            >
              Add Food
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default AddFood;