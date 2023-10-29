// import package
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

// import package components
import {
    Box, Popover, PopoverTrigger, PopoverContent, PopoverBody,
    Table, Thead, Tbody, Tr, Th, Td, TableContainer,
} from '@chakra-ui/react'

// import icons
import { FiInfo } from 'react-icons/fi';

// import local style sheet
import '../styles/Meal.css';

// functional component for the tables in the accordian panel on the meal page
// pass in the meal contents and food information
const MealContent = ({ contents, foods }) => {

    const isMobile = useMediaQuery({ query: `(max-width: 480px)` });

    const [foodPreview, setFoodPreview] = useState('')

    // function to get food information for each meal content
    const foodInfo = (id, servings) => {
        let foodIndex = foods.findIndex(food => food._id === id);
        let info = { title: '', serving: '', calories: 0, carbs: 0, fat: 0, protein: 0, sodium: 0, sugar: 0 };
        info.title = foods[foodIndex].title;
        info.serving = foods[foodIndex].servingSize + ' ' + foods[foodIndex].servingUnit;
        info.calories = +parseFloat(foods[foodIndex].calories * servings).toFixed(2);
        info.carbs = +parseFloat(foods[foodIndex].carbs * servings).toFixed(2);
        info.fat = +parseFloat(foods[foodIndex].fat * servings).toFixed(2);
        info.protein = +parseFloat(foods[foodIndex].protein * servings).toFixed(2);
        info.sodium = +parseFloat(foods[foodIndex].sodium * servings).toFixed(2);
        info.sugar = +parseFloat(foods[foodIndex].sugar * servings).toFixed(2);
        return info
    }

    // function to calculate the total nutritional value
    const getTotal = () => {
        let total = { calories: 0, carbs: 0, fat: 0, protein: 0, sodium: 0, sugar: 0 }
        for (let i = 0; i < contents.length; i++) {
            total.calories += foods[foods.findIndex(food => food._id === contents[i].food)].calories * contents[i].servings;
            total.carbs += foods[foods.findIndex(food => food._id === contents[i].food)].carbs * contents[i].servings;
            total.fat += foods[foods.findIndex(food => food._id === contents[i].food)].fat * contents[i].servings;
            total.protein += foods[foods.findIndex(food => food._id === contents[i].food)].protein * contents[i].servings;
            total.sodium += foods[foods.findIndex(food => food._id === contents[i].food)].sodium * contents[i].servings;
            total.sugar += foods[foods.findIndex(food => food._id === contents[i].food)].sugar * contents[i].servings;
        }
        return (
            <Tr bg='var(--shade5)' color='var(--shade1)' fontWeight='bold'>
                <Td>Total</Td>
                <Td></Td>
                <Td></Td>
                <Td isNumeric>{+parseFloat(total.calories).toFixed(2)}</Td>
                <Td isNumeric>{+parseFloat(total.carbs).toFixed(2)}</Td>
                <Td isNumeric>{+parseFloat(total.fat).toFixed(2)}</Td>
                <Td isNumeric>{+parseFloat(total.protein).toFixed(2)}</Td>
                <Td isNumeric>{+parseFloat(total.sodium).toFixed(2)}</Td>
                <Td isNumeric>{+parseFloat(total.sugar).toFixed(2)}</Td>
            </Tr>
        )
    }

    // function to get food preview viewd in modal
    const getFoodPreview = (id) => {
        let index = foods.findIndex((food) => food._id === id)
        setFoodPreview(
            'Serving Size: ' + foods[index].servingSize + ' ' + foods[index].servingUnit + '\n' +
            'Calories: ' + foods[index].calories + ' kcal \n' +
            'Carbs: ' + foods[index].carbs + ' g \n' +
            'Fat: ' + foods[index].fat + ' g \n' +
            'Protein: ' + foods[index].protein + ' g \n' +
            'Sodium: ' + foods[index].sodium + ' mg \n' +
            'Sugar: ' + foods[index].sugar + ' g'
        )
        return foodPreview
    };

    // function to calculate the total nutritional value
    const getTotalMobile = () => {
        let total = { calories: 0, carbs: 0, fat: 0, protein: 0, sodium: 0, sugar: 0 }
        for (let i = 0; i < contents.length; i++) {
            total.calories += foods[foods.findIndex(food => food._id === contents[i].food)].calories * contents[i].servings;
            total.carbs += foods[foods.findIndex(food => food._id === contents[i].food)].carbs * contents[i].servings;
            total.fat += foods[foods.findIndex(food => food._id === contents[i].food)].fat * contents[i].servings;
            total.protein += foods[foods.findIndex(food => food._id === contents[i].food)].protein * contents[i].servings;
            total.sodium += foods[foods.findIndex(food => food._id === contents[i].food)].sodium * contents[i].servings;
            total.sugar += foods[foods.findIndex(food => food._id === contents[i].food)].sugar * contents[i].servings;
        }
        total.calories = +parseFloat(total.calories).toFixed(2)
        total.carbs = +parseFloat(total.carbs).toFixed(2)
        total.fat = +parseFloat(total.fat).toFixed(2)
        total.protein = +parseFloat(total.protein).toFixed(2)
        total.sodium = +parseFloat(total.sodium).toFixed(2)
        total.sugar = +parseFloat(total.sugar).toFixed(2)
        let totalText =
            'Calories: ' + total.calories + ' kcal \n' +
            'Carbs: ' + total.carbs + ' g \n' +
            'Fat: ' + total.fat + ' g \n' +
            'Protein: ' + total.protein + ' g \n' +
            'Sodium: ' + total.sodium + ' mg \n' +
            'Sugar: ' + total.sugar + ' g'

        return (
            <Tr className='total'>
                <Popover isLazy>
                    <PopoverTrigger>
                        <Td>View Total</Td>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverBody whiteSpace='pre-line'>
                            {totalText}
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </Tr>
        )
    }

    return (
        <Box>
            {isMobile ? (
                <TableContainer width='100%' m='auto'>
                    <Table variant='unstyled' size='md'>
                        <Tbody>
                            {/* map through content, add a table line for each food */}
                            {contents.map((content) => (
                                <Tr key={content.food}>
                                    <Popover isLazy trigger='hover' onOpen={() => { getFoodPreview(content.food) }}>
                                        <PopoverTrigger>
                                            <Td>{foodInfo(content.food, content.servings).title}</Td>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <PopoverBody whiteSpace='pre-line'>{foodPreview}</PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                </Tr>
                            ))}
                            {/* calculate and render the total nutritional value */}
                            {getTotalMobile()}
                        </Tbody>
                    </Table>
                </TableContainer>
            ) : (
                <TableContainer width='100%' m='auto'>
                    <Table variant='unstyled' size='md'>
                        <Thead>
                            <Tr>
                                <Th>Food</Th>
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
                            {/* map through content, add a table line for each food */}
                            {contents.map((content) => (
                                <Tr key={content.food}>
                                    <Td>{foodInfo(content.food, content.servings).title}</Td>
                                    <Td isNumeric>{content.servings}</Td>
                                    <Td>{foodInfo(content.food, content.servings).serving}</Td>
                                    <Td isNumeric>{foodInfo(content.food, content.servings).calories}</Td>
                                    <Td isNumeric>{foodInfo(content.food, content.servings).carbs}</Td>
                                    <Td isNumeric>{foodInfo(content.food, content.servings).fat}</Td>
                                    <Td isNumeric>{foodInfo(content.food, content.servings).protein}</Td>
                                    <Td isNumeric>{foodInfo(content.food, content.servings).sodium}</Td>
                                    <Td isNumeric>{foodInfo(content.food, content.servings).sugar}</Td>
                                </Tr>
                            ))}
                            {/* calculate and render the total nutritional value */}
                            {getTotal()}
                        </Tbody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default MealContent;
