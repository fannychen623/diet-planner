// import packages
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { format } from 'date-fns';

// import query
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries'

// import local component
import Graph from '../components/Graph';

// import package components
import { Box, Select, Spacer, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'

// import local style sheet
import '../styles/Progress.css';

// functional component for the progress page
const Progress = () => {

  const isMobile = useMediaQuery({ query: `(max-width: 820px)` });

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
  // get all planner dates
  const plannerDates = planner.map(entry => entry.date) || []

  // define states
  const [rangeType, setRangeType] = useState('')
  const [graphType, setGraphType] = useState('')
  const [plannerRange, setPlannerRange] = useState({ start: plannerDates[0], end: plannerDates[plannerDates.length - 1] })
  const [date, setDate] = useState({ start: '', end: '' })

  // transform date based on initial format
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

  // function to get records from queried data
  const getProgressRecords = () => {
    let weight = []
    let nutrition = []
    // for each planner record
    planner.forEach((plan) => {
      // add date and weight if applicable
      if (plan.weight) {
        weight.push({ date: plan.date, weight: plan.weight })
      }
      let mealTotal = { calories: 0, carbs: 0, fat: 0, protein: 0, sodium: 0, sugar: 0 }
      // add date and calculate diet total if applicable
      if (plan.diet.length !== 0) {
        let diet = plan.diet
        diet.forEach((meal) => {
          let content = meal.content
          content.forEach((item) => {
            mealTotal.calories += item.calories * item.servings * meal.numberOfServing
            mealTotal.carbs += item.carbs * item.servings * meal.numberOfServing
            mealTotal.fat += item.fat * item.servings * meal.numberOfServing
            mealTotal.protein += item.protein * item.servings * meal.numberOfServing
            mealTotal.sodium += item.sodium * item.servings * meal.numberOfServing
            mealTotal.sugar += item.sugar * item.servings * meal.numberOfServing
          })
        })
      }
      // add date and calculate custom diet total if applicable
      if (plan.customDiet.length !== 0) {
        let diet = plan.customDiet
        diet.forEach((meal) => {
          mealTotal.calories += diet.calories
          mealTotal.carbs += diet.carbs
          mealTotal.fat += diet.fat
          mealTotal.protein += diet.protein
          mealTotal.sodium += diet.sodium
          mealTotal.sugar += diet.sugar
        })
      }
      if (plan.diet.length !== 0 || plan.customDiet.length !== 0) {
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

  // function to set date range based on range type
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

  // call on render and defined state changes
  useEffect(() => {
    if (!data) {
      return;
    } else {
      setPlannerRange({ ...plannerRange, start: plannerDates[0], end: plannerDates[plannerDates.length - 1] })
    }
  }, [data, date, rangeType, graphType])

  return (
    <Box className='progress-page'>
      <Box display={isMobile ? 'block' : 'flex'} justifyContent='space-between' alignItems='center'>
        <Box>
          <Select
            placeholder='Select Date Range'
            borderColor={rangeType ? ('var(--shade5)') : ('red')}
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
        <Box display={isMobile ? 'block' : 'flex'}  alignItems='center'>
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
            borderColor={graphType ? ('var(--shade5)') : ('red')}
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
      <Graph data={getProgressRecords()} date={date} graphType={graphType} />
    </Box>
  );
}

export default Progress;