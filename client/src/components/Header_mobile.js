// import packages and local auth
import React, { useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Auth from '../utils/auth';

// import query and mutations
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';

// import local component
import LoginSignup from './LoginSignup';
import Converter from './Converter';

// import package components
import {
  Box, Stack, Spacer, Image, 
  IconButton, Modal, ModalOverlay,
  Drawer, DrawerBody, DrawerFooter, DrawerHeader,
  DrawerOverlay, DrawerContent, useDisclosure
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
  
  // query all data associated with the signed in user
  const { loading, data } = useQuery(QUERY_ME);

  // extract the profile data 
  const profileTheme = useMemo(() => data?.me.profile.theme, [data]);
  
  useEffect(() => {
    if (!profileTheme) {
      return;
    } else {
      document.documentElement.setAttribute('theme', profileTheme)
    }
  }, [profileTheme]);

  const { isOpen: drawerIsOpen, onOpen: drawerOnOpen, onClose: drawerOnClose } = useDisclosure()
  const { isOpen: modalIsOpen, onOpen: modalOnOpen, onClose: modalOnClose } = useDisclosure()

  return (
    <Box>
      {/* check that user is logged in and token is not expired */}
      {Auth.loggedIn() && !Auth.isTokenExpired() ? (
        <Box className='nav-bar' display='flex' justifyContent='space-between'>
          <Link to='/'>
            <Image src={`./logo_${profileTheme}.png`} alt='Dietry' />
          </Link>
          <IconButton icon={<IoMenuOutline />} onClick={drawerOnOpen}></IconButton>
          <Drawer onClose={drawerOnClose} isOpen={drawerIsOpen}>
            <DrawerOverlay />
            <DrawerContent className='header-drawer' maxW='60%'>
              <DrawerHeader>Menu<Spacer /><IoCloseOutline onClick={drawerOnClose} /></DrawerHeader>
              <DrawerBody>
                <Stack>
                  <Link to='/food' onClick={drawerOnClose}>
                    <Box display='flex' alignItems='center'>
                      <IoNutritionOutline />
                      Foods
                    </Box>
                  </Link>
                  <Link to='/meal' onClick={drawerOnClose}>
                    <Box display='flex' alignItems='center'>
                      <IoFastFoodOutline />
                      Meals
                    </Box>
                  </Link>
                  <Link to='/search' onClick={drawerOnClose}>
                    <Box display='flex' alignItems='center'>
                      <IoSearchOutline />
                      Search
                    </Box>
                  </Link>
                  <Box display='flex' alignItems='center' onClick={() => { modalOnOpen(); drawerOnClose() }}>
                    <IoRepeatSharp />
                    Converter
                  </Box>
                  <Box display='flex' alignItems='center' onClick={() => { navigate(`/calendar/${format(new Date(), 'MM_dd_yyyy')}`); drawerOnClose() }}>
                    <IoCalendarNumberOutline />
                    Planner
                  </Box>
                  <Link to='/progress' onClick={drawerOnClose}>
                    <Box display='flex' alignItems='center'>
                      <IoBarChartOutline />
                      Progress
                    </Box>
                  </Link>
                  <Link to='/profile' onClick={drawerOnClose}>
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
          <Modal isOpen={modalIsOpen} onClose={modalOnClose} isCentered>
            <ModalOverlay />
            <Converter />
          </Modal>
        </Box>
      ) : (
        // if user is not logged in or token is expired
        <LoginSignup />
      )}
    </Box>
  );
}

export default Header;