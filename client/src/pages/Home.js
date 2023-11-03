// import package
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

// import package components
import {
  Box, Grid, GridItem, Center, Heading, Text, Button
} from '@chakra-ui/react';

// import icons
import {
  IoNutritionOutline, IoFastFoodOutline, IoSearchOutline, IoPersonCircleOutline,
  IoCalendarNumberOutline, IoBarChartOutline, IoFitnessOutline, IoScaleOutline, IoColorPaletteOutline,
} from 'react-icons/io5';
import {
  BsArrowUp, BsArrowDown, BsArrowLeft, BsArrowRight,
  BsArrowDownLeft, BsArrowUpRight, BsArrowDownRight,
} from "react-icons/bs";

// import local style sheet
import '../styles/Home.css';

// component for the home page
export default function Home() {

  const isMobile = useMediaQuery({ query: `(max-width: 820px)` });

  // navigate for the calendar button
  const navigate = useNavigate();

  return (
    <Box className='home-page'>
      <Heading>Diet the scientific way!</Heading>
      <Text>Calculate your personal metabolic rate and track your daily caloric intake.{'\n'}Add your own foods and custom meals. Record and track your progress.{'\n'}Start your diet diary at <b>DIETRY</b>  !</Text>
      {isMobile ? (
      <Center>
      <Button leftIcon={<IoCalendarNumberOutline />} onClick={() => { navigate(`/calendar/${format(new Date(), 'MM_dd_yyyy')}`) }} >
        Record Meal
      </Button>
  </Center>
  ):(
      <Grid
        templateRows='repeat(5, 1fr)'
        templateColumns='repeat(8, 1fr)'
      >
        <GridItem rowSpan='1' colSpan='2' m='auto'>
          <Center>
              <Button leftIcon={<IoCalendarNumberOutline />} onClick={() => { navigate(`/calendar/${format(new Date(), 'MM_dd_yyyy')}`) }} >
                Record Meals
              </Button>
          </Center>
        </GridItem>
        <GridItem rowSpan='1' colSpan='1' m='auto'><BsArrowLeft className='arrow-icon' /></GridItem>
        <GridItem rowSpan='1' colSpan='2' m='auto'>
          <Center>
            <Link to='/meal'>
              <Button leftIcon={<IoFastFoodOutline />}>
                Create Meals
              </Button>
            </Link>
          </Center>
        </GridItem>
        <GridItem rowSpan='1' colSpan='1' m='auto'><BsArrowLeft className='arrow-icon' /></GridItem>
        <GridItem rowSpan='1' colSpan='2' m='auto'>
          <Center>
            <Link to='/food'>
              <Button leftIcon={<IoNutritionOutline />}>
                Add Foods
              </Button>
            </Link>
          </Center>
        </GridItem>
        <GridItem rowSpan='1' colSpan='2' m='auto'><BsArrowDown className='arrow-icon' /></GridItem>
        <GridItem rowSpan='1' colSpan='1' m='auto'></GridItem>
        <GridItem rowSpan='1' colSpan='2' m='auto'></GridItem>
        <GridItem rowSpan='1' colSpan='1' m='auto'><BsArrowUpRight className='arrow-icon' /></GridItem>
        <GridItem rowSpan='1' colSpan='2' m='auto'><BsArrowUp className='arrow-icon' /></GridItem>
        <GridItem rowSpan='1' colSpan='2' m='auto'>
          <Center>
            <Link to='/progress'>
              <Button leftIcon={<IoBarChartOutline />}>
                Track Progress
              </Button>
            </Link>
          </Center>
        </GridItem>
        <GridItem rowSpan='1' colSpan='1' m='auto'></GridItem>
        <GridItem rowSpan='1' colSpan='2' m='auto'>
          <Center>
            <Link to='/profile'>
              <Button leftIcon={<IoPersonCircleOutline />}>
                Create Profile
              </Button>
            </Link>
          </Center>
        </GridItem>
        <GridItem rowSpan='1' colSpan='1' m='auto'><BsArrowRight className='arrow-icon' /></GridItem>
        <GridItem rowSpan='1' colSpan='2' m='auto'>
          <Center>
            <Link to='/search'>
              <Button leftIcon={<IoSearchOutline />}>
                Search Foods
              </Button>
            </Link>
          </Center>
        </GridItem>
        <GridItem rowSpan='1' colSpan='2' m='auto'><BsArrowUp className='arrow-icon' /></GridItem>
        <GridItem rowSpan='1' colSpan='1' m='auto'><BsArrowDownLeft className='arrow-icon' /></GridItem>
        <GridItem rowSpan='1' colSpan='2' m='auto'><BsArrowDown className='arrow-icon' /></GridItem>
        <GridItem rowSpan='1' colSpan='1' m='auto'><BsArrowDownRight className='arrow-icon' /></GridItem>
        <GridItem rowSpan='1' colSpan='2' m='auto'></GridItem>
        <GridItem rowSpan='1' colSpan='2' m='auto'>
          <Center>
              <Button leftIcon={<IoScaleOutline />} onClick={() => { navigate(`/calendar/${format(new Date(), 'MM_dd_yyyy')}`) }} >
                Record Weight
              </Button>
          </Center>
        </GridItem>
        <GridItem rowSpan='1' colSpan='1' m='auto'></GridItem>
        <GridItem rowSpan='1' colSpan='2' m='auto'>
          <Center>
            <Link to='/profile'>
              <Button leftIcon={<IoFitnessOutline />}>
                Calculate BMR
              </Button>
            </Link>
          </Center>
        </GridItem>
        <GridItem rowSpan='1' colSpan='1' m='auto'></GridItem>
        <GridItem rowSpan='1' colSpan='2' m='auto'>
          <Center>
            <Link to='/profile'>
              <Button leftIcon={<IoColorPaletteOutline />}>
                Set Theme
              </Button>
            </Link>
          </Center>
        </GridItem>
      </Grid>
)}
    </Box>
  );
}
