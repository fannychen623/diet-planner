// import package
import React from 'react';

// import package components
import {
    Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
} from '@chakra-ui/react'

// import local style sheet
import '../styles/Meal.css';

// functional component for the tables in the accordian panel on the meal page
// pass in the meal contents and food information
const MealContent = ({ contents, foods }) => {

    // function to calculate the total nutritional value
    const getTotal = () => {
        let total = { calories: 0, carbs: 0, fat: 0, protein: 0, sodium: 0, sugar: 0 }
        for (let i = 0; i < contents.length; i++) {
            total.calories += foods[foods.findIndex(food => food._id === contents[i].food[0]._id)].calories * contents[i].servings;
            total.carbs += foods[foods.findIndex(food => food._id === contents[i].food[0]._id)].carbs * contents[i].servings;
            total.fat += foods[foods.findIndex(food => food._id === contents[i].food[0]._id)].fat * contents[i].servings;
            total.protein += foods[foods.findIndex(food => food._id === contents[i].food[0]._id)].protein * contents[i].servings;
            total.sodium += foods[foods.findIndex(food => food._id === contents[i].food[0]._id)].sodium * contents[i].servings;
            total.sugar += foods[foods.findIndex(food => food._id === contents[i].food[0]._id)].sugar * contents[i].servings;
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

    // function to get food information for each meal content
    const foodInfo = (id, servings) => {
        let foodIndex = foods.findIndex(food => food._id === id);
        let info = { title: '', serving: '', calories: 0, carbs: 0, fat: 0, protein: 0, sodium: 0, sugar: 0 };
        info.title = foods[foodIndex].title;
        info.serving = foods[foodIndex].servingSize + ' ' + foods[foodIndex].servingUnit;
        info.calories = +parseFloat(foods[foodIndex].calories * servings).toFixed(2);
        info.carbs = +parseFloat(foods[foodIndex].calories * servings).toFixed(2);
        info.fat = +parseFloat(foods[foodIndex].calories * servings).toFixed(2);
        info.protein = +parseFloat(foods[foodIndex].calories * servings).toFixed(2);
        info.sodium = +parseFloat(foods[foodIndex].calories * servings).toFixed(2);
        info.sugar = +parseFloat(foods[foodIndex].calories * servings).toFixed(2);
        return info
    }

    return (
        <Box>
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
                            <Tr key={content.food[0]._id}>
                                <Td>{foodInfo(content.food[0]._id, content.servings).title}</Td>
                                <Td isNumeric>{content.servings}</Td>
                                <Td>{foodInfo(content.food[0]._id, content.servings).serving}</Td>
                                <Td isNumeric>{foodInfo(content.food[0]._id, content.servings).calories}</Td>
                                <Td isNumeric>{foodInfo(content.food[0]._id, content.servings).carbs}</Td>
                                <Td isNumeric>{foodInfo(content.food[0]._id, content.servings).fat}</Td>
                                <Td isNumeric>{foodInfo(content.food[0]._id, content.servings).protein}</Td>
                                <Td isNumeric>{foodInfo(content.food[0]._id, content.servings).sodium}</Td>
                                <Td isNumeric>{foodInfo(content.food[0]._id, content.servings).sugar}</Td>
                            </Tr>
                        ))}
                        {/* calculate and render the total nutritional value */}
                        {getTotal()}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default MealContent;
