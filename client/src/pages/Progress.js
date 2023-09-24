// import package
import React, { useState, useEffect } from 'react';
import { Link, useParams, useRouter } from 'react-router-dom';
import { useStateWithCallbackInstant } from 'use-state-with-callback';
import { format } from 'date-fns';

// import queries
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries'

// import local component
import LineGraph from '../components/LineGraph';

// import package components
import {
  Grid, GridItem, Box, Select,
  Input, InputGroup, InputLeftAddon,
  Stat, StatLabel, StatNumber,
  StatHelpText, StatGroup,
  Heading, Text, Spacer
} from '@chakra-ui/react'

// import local style sheet
import '../styles/Progress.css';

// functional component for the progress page
const Progress = () => {
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

  // extract the progress information from the query data
  const foods = data?.me.foods || [];
  const planner = data?.me.planner || [];
  const plannerDates = planner.map(entry => entry.date)

  const [rangeType, setRangeType] = useState('')
  const [graphType, setGraphType] = useState('')
  const [plannerRange, setPlannerRange] = useState({ start: plannerDates[0], end: plannerDates[plannerDates.length - 1] })
  const [date, setDate] = useState({ start: '', end: '' })

  const convertDateFormat = (dateValue) => {
    if (!dateValue) return;
    if (dateValue.includes('-')) {
      let darr = dateValue.split('-');
      let dobj = darr[1] + '/' + darr[2] + '/' + darr[0]
      return dobj;
    }
    if (dateValue.includes('/')) {
      let darr = dateValue.split('/');
      let dobj = darr[2] + '-' + darr[0] + '-' + darr[1]
      return dobj;
    }
  }

  const getProgressRecords = () => {
    let weight = []
    let nutrition = []
    planner.forEach((plan) => {
      if (plan.weight) {
        weight.push({ date: plan.date, weight: plan.weight })
      }
      if (plan.diet.length !== 0) {
        let mealTotal = { calories: 0, carbs: 0, fat: 0, protein: 0, sodium: 0, sugar: 0 }
        let diet = plan.diet
        diet.forEach((meal) => {
          let content = meal.content
          content.forEach((item) => {
            mealTotal.calories += foods[foods.findIndex(food => food._id === item.food[0]._id)].calories * item.servings * meal.numberOfServing
            mealTotal.carbs += foods[foods.findIndex(food => food._id === item.food[0]._id)].carbs * item.servings * meal.numberOfServing
            mealTotal.fat += foods[foods.findIndex(food => food._id === item.food[0]._id)].fat * item.servings * meal.numberOfServing
            mealTotal.protein += foods[foods.findIndex(food => food._id === item.food[0]._id)].protein * item.servings * meal.numberOfServing
            mealTotal.sodium += foods[foods.findIndex(food => food._id === item.food[0]._id)].sodium * item.servings * meal.numberOfServing
            mealTotal.sugar += foods[foods.findIndex(food => food._id === item.food[0]._id)].sugar * item.servings * meal.numberOfServing
          })
        })
        nutrition.push({
          date: plan.date,
          calories: +parseFloat(mealTotal.calories).toFixed(2),
          carbs: +parseFloat(mealTotal.carbs).toFixed(2),
          fat: +parseFloat(mealTotal.fat).toFixed(2),
          protein: +parseFloat(mealTotal.protein).toFixed(2),
          sodium: +parseFloat(mealTotal.sodium).toFixed(2),
          sugar: +parseFloat(mealTotal.sugar).toFixed(2)
        })
      }
    })
    return { weight: weight, nutrition: nutrition };
  }

  const setQuickDateRange = (range) => {
    if (range !== 'Custom Range') {
      let startDate = plannerRange.start
      let endDate = plannerRange.end
      if (range === 'All Time') {
        startDate = plannerRange.start
        endDate = plannerRange.end
      } else if (range === 'This Year') {
        startDate = format(new Date(new Date().getFullYear(), 0, 1), 'MM/dd/yyyy')
        endDate = format(new Date(new Date().getFullYear(), 11, 31), 'MM/dd/yyyy')
      } else if (range === 'This Month') {
        startDate = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'MM/dd/yyyy')
        endDate = format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'MM/dd/yyyy')
      } else if (range === 'This Week') {
        startDate = format(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7), 'MM/dd/yyyy')
        endDate = format(new Date(), 'MM/dd/yyyy')
      } else if (range === 'Last 2 Months') {
        startDate = format(new Date(new Date().getFullYear(), new Date().getMonth() - 2, new Date().getDate()), 'MM/dd/yyyy')
        endDate = format(new Date(), 'MM/dd/yyyy')
      } else if (range === 'Last 3 Months') {
        startDate = format(new Date(new Date().getFullYear(), new Date().getMonth() - 3, new Date().getDate()), 'MM/dd/yyyy')
        endDate = format(new Date(), 'MM/dd/yyyy')
      }
      setDate({ ...date, start: startDate, end: endDate })
    }
    setGraphType('')
  }

  useEffect(() => {
    if (!data) {
      return;
    } else {
      setPlannerRange({ ...plannerRange, start: plannerDates[0], end: plannerDates[plannerDates.length - 1] })
      console.log(date)
    }
  }, [data, date, rangeType, graphType])


  return (
    <Box className='progress-page'>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        {/* select field to set date range or show custom date range fields */}
        <Box>
          <Select
            placeholder='Select Date Range'
            value={rangeType}
            onChange={(e) => { setQuickDateRange(e.target.value); setRangeType(e.target.value) }}>
            <option value='All Time'>All Time</option>
            <option value='This Year'>This Year</option>
            <option value='This Month'>This Month</option>
            <option value='This Week'>This Week</option>
            <option value='Last 2 Months'>Last 2 Months</option>
            <option value='Last 3 Months'>Last 3 Months</option>
            <option value='Custom Range'>Custom Range</option>
          </Select>
        </Box>
        <Box display='flex' alignItems='center'>
          <InputGroup>
            <InputLeftAddon>Start Date</InputLeftAddon>
            <Input
              type='date'
              name='startDate'
              value={convertDateFormat(date.start) || new Date()}
              onChange={(e) => { setRangeType('Custom Range'); setDate({ ...date, start: convertDateFormat(e.target.value) }) }}
            />
          </InputGroup>
          <InputGroup>
            <InputLeftAddon>End Date</InputLeftAddon>
            <Input
              type='date'
              name='endDate'
              value={convertDateFormat(date.end) || new Date()}
              onChange={(e) => { setRangeType('Custom Range'); setDate({ ...date, end: convertDateFormat(e.target.value) }) }}
            />
          </InputGroup>
        </Box>
        <Spacer />
        <Box>
          <Select
            placeholder='Select Graph'
            value={graphType}
            onChange={(e) => { setGraphType(e.target.value) }}>
            <option value='Weight'>Weight</option>
            <option value='Calorie'>Calorie</option>
            <option value='Carbohydrate'>Carbohydrate</option>
            <option value='Fat'>Fat</option>
            <option value='Protein'>Protein</option>
            <option value='Sodium'>Sodium</option>
            <option value='Sugar'>Sugar</option>
            <option value='Weight + Calorie'>Weight + Calorie</option>
            <option value='Weight + Macronutrients'>Weight + Macronutrients</option>
            <option value='Calorie + Macronutrients'>Calorie + Macronutrients</option>
            <option value='Macronutrients'>Macronutrients</option>
          </Select>
        </Box>
      </Box>
      <LineGraph data={getProgressRecords()} date={date} graphType={graphType}/>
    </Box>
  );
}

export default Progress;