// import package and local auth
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Auth from '../utils/auth';
import { format } from 'date-fns';

import Converter from './Converter';

// import package components
import {
  Flex, Box, Tooltip, Image, IconButton,
  Popover, PopoverTrigger, PopoverContent, PopoverHeader,
  PopoverBody, PopoverFooter, PopoverArrow, Spacer,
} from '@chakra-ui/react';

// import icons
import {
  RiFridgeLine, RiRestaurantLine, RiPhoneFindLine,
  RiCalendarEventLine, RiLineChartLine, RiAccountCircleLine,
  RiLoginBoxLine, RiLogoutBoxLine, RiArrowLeftRightFill,
} from 'react-icons/ri';

// import local style sheet
import '../styles/Header.css';

// page header/navigation bar
function Header() {

  // on click logout
  const logout = (event) => {
    event.preventDefault()
    // auth logout function
    Auth.logout()
  }

  // navigate for the edit post button
  const navigate = useNavigate();

  return (
    <Box className='nav-bar'>
      {/* check that user is logged in and token is not expired */}
      {Auth.loggedIn() && !Auth.isTokenExpired() ? (
        // if user is logged in, display all linked icon buttons and logout button
        <Box display='flex' justifyContent='space-between'>
            <Box>
              {/* <Link to='/'>
                  <Tooltip label='Home' bg='var(--shade6)' color='white'>
                    <Image src='./logo.png' alt='Step It Up' width='70px' mr='1vw' />
                  </Tooltip>
                </Link> */}
              <Link to='/food'>
                <Tooltip label='Food'>
                  <IconButton variant='link' aria-label='Food' icon={<RiFridgeLine p='100%' />} />
                </Tooltip>
              </Link>
              <Link to='/meal'>
                <Tooltip label='Meals'>
                  <IconButton variant='link' aria-label='Meals' icon={<RiRestaurantLine p='100%' />} />
                </Tooltip>
              </Link>
              <Link to='/search'>
                <Tooltip label='Search Food'>
                  <IconButton variant='link' aria-label='Search Food' icon={<RiPhoneFindLine p='100%' />} />
                </Tooltip>
              </Link>
            </Box>
            <Spacer />
            <Box display='flex'>
              <Popover>
                <Tooltip label='Converter'>
                  <Box>
                    <PopoverTrigger>
                      <IconButton variant='link' aria-label='Converter' icon={<RiArrowLeftRightFill p='100%' />} />
                    </PopoverTrigger>
                  </Box>
                </Tooltip>
                <Converter />
              </Popover>
              <Tooltip label='Calendar'>
                <IconButton variant='link' aria-label='Calendar' icon={<RiCalendarEventLine p='100%' />} onClick={() => { navigate(`/calendar/${format(new Date(), 'MM_dd_yyyy')}`) }} />
              </Tooltip>
              <Link to='/progress'>
                <Tooltip label='Progress'>
                  <IconButton variant='link' aria-label='Progress' icon={<RiLineChartLine p='100%' />} />
                </Tooltip>
              </Link>
              <Link to='/profile'>
                <Tooltip label='Profile'>
                  <IconButton variant='link' aria-label='Profile' icon={<RiAccountCircleLine p='100%' />} />
                </Tooltip>
              </Link>
              <Tooltip label='Logout'>
                <IconButton variant='link' aria-label='Logout' icon={<RiLogoutBoxLine p='100%' />} onClick={logout} />
              </Tooltip>
            </Box>
        </Box>
      ) : (
        // if user is not logged in or token is expired
        // only display logo (to home) and login/signup icon
        <nav className='navBar' separator='   '>
          <Box justifyContent='space-between'>
            <Box>
              {/* <Link to='/'>
                  <Tooltip label='Home' bg='var(--shade6)' color='white'>
                    <Image src='./logo.png' alt='Step It Up' width='60px' mr='2' />
                  </Tooltip>
                </Link> */}
            </Box>
            <Box textAlign='end'>
              <Link to='/loginSignup'>
                <Tooltip label='Login/Signup'>
                  <IconButton variant='link' aria-label='Login' icon={<RiLoginBoxLine p='100%' />} />
                </Tooltip>
              </Link>
            </Box>
          </Box>
        </nav>
      )}
    </Box>
  );
}

export default Header;
