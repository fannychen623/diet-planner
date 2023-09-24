// import package and local auth
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Auth from '../utils/auth';
import { format } from 'date-fns';

// import package components
import {
  Flex, Box, Tooltip, Image, IconButton,
} from '@chakra-ui/react';

// import icons
import {
  RiFridgeLine, RiRestaurantLine, RiPhoneFindLine,
  RiCalendarEventLine, RiLineChartLine, RiAccountCircleLine,
  RiLoginBoxLine, RiLogoutBoxLine,
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
    <Box>
      {/* check that user is logged in and token is not expired */}
      {Auth.loggedIn() && !Auth.isTokenExpired() ? (
        // if user is logged in, display all linked icon buttons and logout button
        <nav className='navBar' separator='   '>
          <Flex alignItems='center'>
            <Box width='50vw' display='flex'>
              {/* <Link to='/'>
                  <Tooltip label='Home' bg='var(--shade6)' color='white'>
                    <Image src='./logo.png' alt='Step It Up' width='70px' mr='1vw' />
                  </Tooltip>
                </Link> */}
              <Link to='/food'>
                <Tooltip label='Food' bg='var(--shade6)' color='white'>
                  <IconButton variant='link' px='1vw' aria-label='Food' icon={<RiFridgeLine p='100%'/>} />
                </Tooltip>
              </Link>
              <Link to='/meal'>
                <Tooltip label='Meals' bg='var(--shade6)' color='white'>
                  <IconButton variant='link' px='1vw' aria-label='Meals' icon={<RiRestaurantLine p='100%'/>} />
                </Tooltip>
              </Link>
              <Link to='/search'>
                <Tooltip label='Search Food' bg='var(--shade6)' color='white'>
                  <IconButton variant='link' px='1vw' aria-label='Search Food' icon={<RiPhoneFindLine p='100%'/>} />
                </Tooltip>
              </Link>
            </Box>
            <Box width='50vw' textAlign='end' pr='1vw'>
              <Tooltip label='Calendar' bg='var(--shade6)' color='white'>
                <IconButton variant='link' px='1vw' aria-label='Calendar' icon={<RiCalendarEventLine p='100%'/>} onClick={() => { navigate(`/calendar/${format(new Date(), 'MM_dd_yyyy')}`) }} />
              </Tooltip>
              <Link to='/progress'>
                <Tooltip label='Progress' bg='var(--shade6)' color='white'>
                  <IconButton variant='link' px='1vw' aria-label='Tracker' icon={<RiLineChartLine p='100%'/>} />
                </Tooltip>
              </Link>
              <Link to='/profile'>
                <Tooltip label='Profile' bg='var(--shade6)' color='white'>
                  <IconButton variant='link' px='1vw' aria-label='Profile' icon={<RiAccountCircleLine p='100%'/>} />
                </Tooltip>
              </Link>
              <Tooltip label='Logout' bg='var(--shade6)' color='white'>
                <IconButton variant='link' px='1vw' aria-label='Profile' icon={<RiLogoutBoxLine p='100%'/>} onClick={logout} />
              </Tooltip>
            </Box>
          </Flex>
        </nav>
      ) : (
        // if user is not logged in or token is expired
        // only display logo (to home) and login/signup icon
        <nav className='navBar' separator='   '>
          <Flex alignItems='center'>
            <Box width='50vw'>
              {/* <Link to='/'>
                  <Tooltip label='Home' bg='var(--shade6)' color='white'>
                    <Image src='./logo.png' alt='Step It Up' width='60px' mr='2' />
                  </Tooltip>
                </Link> */}
            </Box>
            <Box width='50vw' textAlign='end' pr='5'>
              <Link to='/loginSignup'>
                <Tooltip label='Login/Signup' bg='var(--shade6)' color='white'>
                  <IconButton variant='link' px='1vw' aria-label='Login' icon={<RiLoginBoxLine p='100%'/>} />
                </Tooltip>
              </Link>
            </Box>
          </Flex>
        </nav>
      )}
    </Box>
  );
}

export default Header;
