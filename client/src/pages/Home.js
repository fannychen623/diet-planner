// import package
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

// import package components
import {
  Box, Grid, GridItem, SimpleGrid, Center, Button
} from '@chakra-ui/react';

// import icons
import {
  IoNutritionOutline, IoFastFoodOutline, IoSearchOutline, IoRepeatSharp,
  IoCalendarNumberOutline, IoBarChartOutline, IoFitnessOutline, IoExitOutline,
} from 'react-icons/io5';

// import local style sheet
import '../styles/Home.css';

// component for the home page
export default function Home() {

  const isMobile = useMediaQuery({ query: `(max-width: 480px)` });

  return (
    <Box className='home-page'>
      <SimpleGrid columns='3'>
        <Center>
        <Link to='/food'>
            <Button leftIcon={<IoNutritionOutline />}>
              Create Profile
            </Button>
            </Link>
        </Center>
        </SimpleGrid>
      {/* <Grid
        templateRows='repeat(3, 1fr)'
        templateColumns='repeat(3, 1fr)'
        gap='10'
      >
        <GridItem rowSpan='3' colSpan='1'>
        </GridItem>
        <GridItem colSpan='1'>
          <Center>
          <Link to='/food'>
            <Button leftIcon={<IoNutritionOutline />}>
              My Foods
            </Button>
            </Link>
          </Center>
        </GridItem>
      </Grid> */}
    </Box>
  );
}
