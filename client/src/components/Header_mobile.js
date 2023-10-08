// import packages and local auth
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Auth from '../utils/auth';

// import local component
import Converter from './Converter';

// import package components
import {
  Box, Stack, Tooltip, Image, IconButton,
  Popover, PopoverTrigger, Spacer,
  Drawer, DrawerBody, DrawerFooter, DrawerHeader,
  DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure
} from '@chakra-ui/react';

// import icons
import {
  IoMenuOutline, IoNutritionOutline, IoFastFoodOutline, IoSearchOutline,
  IoRepeatSharp, IoCalendarNumberOutline, IoBarChartOutline,
  IoFitnessOutline, IoEnterOutline, IoExitOutline, IoCloseOutline,
} from 'react-icons/io5';

// import local style sheet
import '../styles/Header.css';

// page header/navigation bar
function Header() {

  // function to logout
  const logout = (event) => {
    event.preventDefault()
    Auth.logout()
  }

  // navigate for the calendar button
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box className='nav-bar'>
      {/* check that user is logged in and token is not expired */}
      {Auth.loggedIn() && !Auth.isTokenExpired() ? (
        <Box display='flex' justifyContent='space-between'>
          <Link to='/'>
            <Image src='./logo.png' alt='Dietry' />
          </Link>
          <IconButton icon={<IoMenuOutline />} onClick={onOpen}></IconButton>
          <Drawer onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent className='header-drawer' maxW='60%'>
              <DrawerHeader>Menu<Spacer /><IoCloseOutline onClick={onClose}/></DrawerHeader>
              <DrawerBody>
                <Stack>
                  <Link to='/food' onClick={onClose}>
                    <Box display='flex' alignItems='center'>
                      <IoNutritionOutline />
                      Foods
                    </Box>
                  </Link>
                  <Link to='/meal' onClick={onClose}>
                    <Box display='flex' alignItems='center'>
                      <IoFastFoodOutline />
                      Meals
                    </Box>
                  </Link>
                  <Link to='/search' onClick={onClose}>
                    <Box display='flex' alignItems='center'>
                      <IoSearchOutline />
                      Search
                    </Box>
                  </Link>
                  <Link to='/'>
                    <Box display='flex' alignItems='center'>
                      <IoRepeatSharp />
                      Converter
                    </Box>
                  </Link>
                  <Link onClick={() => { navigate(`/calendar/${format(new Date(), 'MM_dd_yyyy')}`); onClose() }}>
                    <Box display='flex' alignItems='center'>
                      <IoCalendarNumberOutline />
                      Planner
                    </Box>
                  </Link>
                  <Link to='/progress' onClick={onClose}>
                    <Box display='flex' alignItems='center'>
                      <IoBarChartOutline />
                      Progress
                    </Box>
                  </Link>
                  <Link to='/profile' onClick={onClose}>
                    <Box display='flex' alignItems='center'>
                      <IoFitnessOutline />
                      Profile
                    </Box>
                  </Link>
                </Stack>
              </DrawerBody>
              <DrawerFooter justifyContent='left'>
                <Link onClick={logout}>
                  <Box display='flex' alignItems='center'>
                    <IoExitOutline />
                    Logout
                  </Box>
                </Link>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Box>
      ) : (
        // if user is not logged in or token is expired
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Link to='/'>
            <Image src='./logo.png' alt='Dietry' />
          </Link>
          <Link to='/loginSignup'>
            <IconButton variant='link' aria-label='Login/Signup' icon={<IoEnterOutline p='100%' />} />
          </Link>
        </Box>
      )}
    </Box>
  );
}

export default Header;
