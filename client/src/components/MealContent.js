// import package
import React, { useState } from 'react';

// import query and mutation
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_POST } from '../utils/queries';
import { REMOVE_COMMENT } from '../utils/mutations';

// import package components and icon
import {
    Box, Flex, Spacer, IconButton, Text,
    Table, Thead, Tbody, Tr, Th, Td, TableContainer,
} from '@chakra-ui/react'

import { FiMinusSquare } from 'react-icons/fi';

// import local style sheet
import '../styles/Meal.css';

// functional component for the comment section of each post on the post page
const MealContent = ({ contents, foods }) => {

    const getTotal = () => {
        let calories = 0
        let carbs = 0
        let fat = 0
        let protein = 0
        let sodium = 0
        let sugar = 0
        for (let i = 0; i < contents.length; i++) {
            calories += foods[foods.findIndex(food => food._id === contents[i].food[0]._id)].calories;
            carbs += foods[foods.findIndex(food => food._id === contents[i].food[0]._id)].carbs;
            fat += foods[foods.findIndex(food => food._id === contents[i].food[0]._id)].fat;
            protein += foods[foods.findIndex(food => food._id === contents[i].food[0]._id)].protein;
            sodium += foods[foods.findIndex(food => food._id === contents[i].food[0]._id)].sodium;
            sugar += foods[foods.findIndex(food => food._id === contents[i].food[0]._id)].sugar;
        }

        return (
            <Tr bg='var(--shade5)' color='white'>
                <Td>Total</Td>
                <Td></Td>
                <Td></Td>
                <Td isNumeric>{calories}</Td>
                <Td isNumeric>{carbs}</Td>
                <Td isNumeric>{fat}</Td>
                <Td isNumeric>{protein}</Td>
                <Td isNumeric>{sodium}</Td>
                <Td isNumeric>{sugar}</Td>
            </Tr>
        )
    }

    const foodName = (id) => {
        let foodIndex = foods.findIndex(food => food._id === id)
        return foods[foodIndex].title
    }
    const foodServing = (id) => {
        let foodIndex = foods.findIndex(food => food._id === id)
        let serving = foods[foodIndex].servingSize + ' ' + foods[foodIndex].servingUnit
        return serving
    }
    const foodCalories = (id) => {
        let foodIndex = foods.findIndex(food => food._id === id)
        return foods[foodIndex].calories
    }
    const foodCarbs = (id) => {
        let foodIndex = foods.findIndex(food => food._id === id)
        return foods[foodIndex].carbs
    }
    const foodFat = (id) => {
        let foodIndex = foods.findIndex(food => food._id === id)
        return foods[foodIndex].fat
    }
    const foodProtein = (id) => {
        let foodIndex = foods.findIndex(food => food._id === id)
        return foods[foodIndex].protein
    }
    const foodSodium = (id) => {
        let foodIndex = foods.findIndex(food => food._id === id)
        return foods[foodIndex].sodium
    }
    const foodSugar = (id) => {
        let foodIndex = foods.findIndex(food => food._id === id)
        return foods[foodIndex].sugar
    }

    // if not comment exist for post
    if (!contents.length) {
        console.log(contents[0].food[0]._id)
        return;
    };

    return (
        <Box>
            <TableContainer width='100%' m='auto'>
                <Table variant='unstyled' size='md'>
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
                        {/* map through comment, create a flex text line for each comment */}
                        {contents.map((content, index) => (
                            <Tr>
                                <Td>{foodName(content.food[0]._id)}</Td>
                                <Td isNumeric>{content.servings}</Td>
                                <Td>{foodServing(content.food[0]._id)}</Td>
                                <Td isNumeric>{foodCalories(content.food[0]._id)}</Td>
                                <Td isNumeric>{foodCarbs(content.food[0]._id)}</Td>
                                <Td isNumeric>{foodFat(content.food[0]._id)}</Td>
                                <Td isNumeric>{foodProtein(content.food[0]._id)}</Td>
                                <Td isNumeric>{foodSodium(content.food[0]._id)}</Td>
                                <Td isNumeric>{foodSugar(content.food[0]._id)}</Td>
                            </Tr>
                        ))}
                        {getTotal()}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default MealContent;
