// import packages
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import env from 'react-dotenv';

// import local component
import AddFood from '../components/AddFood';

// import package components
import {
  Box, SimpleGrid, Spinner, Heading, Text, Button, IconButton,
  Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody,
  Input, InputGroup, InputLeftElement, InputRightElement,
  Card, CardHeader, CardBody, CardFooter,
} from '@chakra-ui/react'

// import icons
import { FiSearch, FiInfo } from 'react-icons/fi';

// import local style sheet
import '../styles/Search.css';

// function to transform text to proper case
function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

// functional component for the search page
const Search = () => {

  const isMobile = useMediaQuery({ query: `(max-width: 820px)` });

  // define states
  const [searchValue, setSearchValue] = useState('')
  const [searchStatus, setSearchStatus] = useState(false)
  const [searchError, setSearchError] = useState(false)
  const [branded, setBranded] = useState([])
  const [foundation, setFoundation] = useState([])
  const [modalState, setModalState] = useState(false)
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

  // function to fetch data from USDA API
  const get_food_search = async () => {
    const apiKey = env.USDA_API_KEY
    let food = searchValue.replace(" ", "%20");
    let url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${food}`
    const response = await fetch(url, {
      method: 'GET'
    })
    const data = await response.json()
    return data
  }

  // function to extract nutrion data from json response
  const getNutritionValue = (nutrition, servingSize) => {
    // let nutrientId = { calories: 1008, carbs: 1005, fat: 1004, protein: 1003, sodium: 1093, sugar: 2000 }
    let nutrientId = [1008, 1005, 1004, 1003, 1093, 2000]
    // let nutritionFacts = { calories: 0, carbs: 0, fat: 0, protein: 0, sodium: 0, sugar: 0 }
    let nutritionFacts = [0, 0, 0, 0, 0, 0]
    for (let i = 0; i < nutrientId.length; i++) {
      if (nutrition[nutrition.findIndex(macro => macro.nutrientId === nutrientId[i])] === undefined) {
        nutritionFacts[i] = 'N/A'
      } else if (nutrition[nutrition.findIndex(macro => macro.nutrientId === nutrientId[i])].value !== 0) {
        nutritionFacts[i] = +parseFloat(nutrition[nutrition.findIndex(macro => macro.nutrientId === nutrientId[i])].value / 100 * servingSize).toFixed(2)
      } else if (nutrition[nutrition.findIndex(macro => macro.nutrientId === nutrientId[i])].value === 0) {
      }
    }
    return nutritionFacts
  }

  // function to search food
  const searchFood = () => {
    if (searchValue !== '') {
      setSearchStatus(true);
      setSearchError(false);
      get_food_search().then((response) => {
        let data = response.foods
        let brandedFood = []
        let foundationFood = []
        for (let i = 0; i < 49; i++) {
          let nutrition = data[i].foodNutrients
          let nutritionFacts = {
            calories: getNutritionValue(nutrition, data[i].servingSize || 100)[0],
            carbs: getNutritionValue(nutrition, data[i].servingSize || 100)[1],
            fat: getNutritionValue(nutrition, data[i].servingSize || 100)[2],
            protein: getNutritionValue(nutrition, data[i].servingSize || 100)[3],
            sodium: getNutritionValue(nutrition, data[i].servingSize || 100)[4],
            sugar: getNutritionValue(nutrition, data[i].servingSize || 100)[5],
          }
          if (data[i].dataType === 'Branded') {
            let foodInfo = {
              fdcId: data[i].fdcId,
              description: data[i].description,
              brand: data[i].brandName || data[i].brandOwner || 'N/A',
              category: data[i].foodCategory,
              servingSize: +parseFloat(data[i].servingSize).toFixed(2),
              servingUnit: data[i].servingSizeUnit,
              calories: nutritionFacts.calories,
              carbs: nutritionFacts.carbs,
              fat: nutritionFacts.fat,
              protein: nutritionFacts.protein,
              sodium: nutritionFacts.sodium,
              sugar: nutritionFacts.sugar,
            }
            brandedFood.push(foodInfo)
          }
          if (data[i].dataType === 'Foundation' || data[i].dataType === 'Survey (FNDDS)') {
            let foodInfo = {
              fdcId: data[i].fdcId,
              description: toTitleCase(data[i].description),
              category: data[i].foodCategory,
              servingSize: 100,
              servingUnit: 'g',
              calories: nutritionFacts.calories,
              carbs: nutritionFacts.carbs,
              fat: nutritionFacts.fat,
              protein: nutritionFacts.protein,
              sodium: nutritionFacts.sodium,
              sugar: nutritionFacts.sugar,
            }
            foundationFood.push(foodInfo)
          }
          // push searched data into arrays and set states to be rendered
          setBranded(brandedFood)
          setFoundation(foundationFood)
        }
        setSearchStatus(false)
      })
        .catch(error => setSearchError(true));
    }
  }

  // function to call search food when the enter key is pressed from the input field
  const handleKeyDown = (event) => {
    const { keyCode } = event
    if (keyCode === 13) {
      event.preventDefault();
      searchFood();
    }
  }

  return (
    <Box className='search-page'>
      <Heading>Search Nutrition Facts</Heading>
      {isMobile ? (
        <Box display='flex'>
          <InputGroup>
            <InputLeftElement>
              <Popover placement='bottom-start'>
                <PopoverTrigger>
                  <IconButton icon={<FiInfo />} bg='var(--trans)' />
                </PopoverTrigger>
                <PopoverContent maxW='fit-content'>
                  <PopoverHeader>Special Operators</PopoverHeader>
                  <PopoverBody whiteSpace='pre-line'>Exact Phrase: <span>"</span>food<span>"</span> {'\n'} Partial Match: <span>*</span>food {'\n'} Include Word: <span>+</span>food {'\n'} Exclude Word: <span>-</span>food</PopoverBody>
                </PopoverContent>
              </Popover>
            </InputLeftElement>
            <Input
              onKeyDown={handleKeyDown}
              onChange={(e) => { setSearchValue(e.target.value) }}
            />
          </InputGroup>
          <IconButton icon={<FiSearch />} onClick={searchFood} />
        </Box>
      ) : (
        <Box display='flex'>
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <FiSearch color='var(--shade5)' />
            </InputLeftElement>
            <Input
              onKeyDown={handleKeyDown}
              onChange={(e) => { setSearchValue(e.target.value); setSearchStatus(false); setSearchError(false) }}
            />
            <InputRightElement>
              <Popover trigger='hover' placement='bottom'>
                <PopoverTrigger>
                  <IconButton icon={<FiInfo />} bg='var(--trans)' />
                </PopoverTrigger>
                <PopoverContent maxW='fit-content'>
                  <PopoverHeader>Special Operators</PopoverHeader>
                  <PopoverBody whiteSpace='pre-line'>Exact Phrase: <span>"</span>food<span>"</span> {'\n'} Partial Match: <span>*</span>food {'\n'} Include Word: <span>+</span>food {'\n'} Exclude Word: <span>-</span>food</PopoverBody>
                </PopoverContent>
              </Popover>
            </InputRightElement>
          </InputGroup>
          <Button onClick={searchFood}>Search</Button>
        </Box>
      )}
      {searchStatus ? (
        <Box display='flex' alignItems='center' mt='1.25em'>
          {searchError ? (
            <Text><b>Invalid: </b>No nutrition facts found for <u>{searchValue}</u></Text>
          ) : (
            <Box display='flex'><Spinner mr='1em' /><Text>Searching...</Text></Box>
          )}
        </Box>
      ) : (
        <SimpleGrid templateColumns='repeat(auto-fill, minmax(20em, 1fr))'>
          {foundation.map((food, index) => (
            <Card key={index}>
              <CardHeader>
                <Heading size='md'>{toTitleCase(food.description)}</Heading>
              </CardHeader>
              <CardBody>
                <Text><b>Category: </b>{toTitleCase(food.category)}</Text>
                <Text><b>Serving: </b>{food.servingSize} {food.servingUnit}</Text>
                <br></br>
                <Text><b>Calorie: </b>{food.calories} kcal</Text>
                <Text><b>Carbs: </b>{food.carbs} g</Text>
                <Text><b>Fat: </b>{food.fat} g</Text>
                <Text><b>Protein: </b>{food.protein} g</Text>
                <Text><b>Sodium: </b>{food.sodium} g</Text>
                <Text><b>Sugar: </b>{food.sugar} g</Text>
              </CardBody>
              <CardFooter>
                <Button
                  onClick={() => {
                    setFormState({
                      ...formState,
                      title: toTitleCase(food.description),
                      servingSize: food.servingSize,
                      servingUnit: food.servingUnit,
                      calories: food.calories,
                      carbs: food.carbs,
                      fat: food.fat,
                      protein: food.protein,
                      sodium: food.sodium,
                      sugar: food.sugar,
                    });
                    setModalState(true);
                  }}
                >
                  Save Food
                </Button>
              </CardFooter>
            </Card>
          ))}
          {branded.map((food, index) => (
            <Card key={index}>
              <CardHeader>
                <Heading size='md'>{toTitleCase(food.description)}</Heading>
              </CardHeader>
              <CardBody>
                <Text><b>Brand: </b>{toTitleCase(food.brand)}</Text>
                <Text><b>Category: </b>{toTitleCase(food.category)}</Text>
                <Text><b>Serving: </b>{food.servingSize} {food.servingUnit}</Text>
                <br></br>
                <Text><b>Calorie: </b>{food.calories} kcal</Text>
                <Text><b>Carbs: </b>{food.carbs} g</Text>
                <Text><b>Fat: </b>{food.fat} g</Text>
                <Text><b>Protein: </b>{food.protein} g</Text>
                <Text><b>Sodium: </b>{food.sodium} g</Text>
                <Text><b>Sugar: </b>{food.sugar} g</Text>
              </CardBody>
              <CardFooter>
                <Button
                  onClick={() => {
                    setFormState({
                      ...formState,
                      title: toTitleCase(food.description),
                      servingSize: food.servingSize,
                      servingUnit: food.servingUnit,
                      calories: food.calories,
                      carbs: food.carbs,
                      fat: food.fat,
                      protein: food.protein,
                      sodium: food.sodium,
                      sugar: food.sugar,
                    });
                    setModalState(true);
                  }}
                >
                  Save Food
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
      <AddFood addOpenState={modalState} addDetails={formState} />
    </Box>
  );
}

export default Search;