// import package and local auth
import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';

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

  return (
    <div>
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
                    <IconButton variant='link' px='1vw' aria-label='Food' icon={<RiFridgeLine />} />
                  </Tooltip>
                </Link>
                <Link to='/meal'>
                  <Tooltip label='Meals' bg='var(--shade6)' color='white'>
                    <IconButton variant='link' px='1vw' aria-label='Meals' icon={<RiRestaurantLine />} />
                  </Tooltip>
                </Link>
                <Link to='/'>
                  <Tooltip label='Search Food' bg='var(--shade6)' color='white'>
                    <IconButton variant='link' px='1vw' aria-label='Search Food' icon={<RiPhoneFindLine />} />
                  </Tooltip>
                </Link>
            </Box>
            <Box width='50vw' textAlign='end' pr='1vw'>
                <Link to='/calendar'>
                  <Tooltip label='Calendar' bg='var(--shade6)' color='white'>
                    <IconButton variant='link' px='1vw' aria-label='Calendar' icon={<RiCalendarEventLine />} />
                  </Tooltip>
                </Link>
                <Link to='/'>
                  <Tooltip label='Tracker' bg='var(--shade6)' color='white'>
                    <IconButton variant='link' px='1vw' aria-label='Tracker' icon={<RiLineChartLine />} />
                  </Tooltip>
                </Link>
                <Link to='/'>
                  <Tooltip label='Profile' bg='var(--shade6)' color='white'>
                    <IconButton variant='link' px='1vw' aria-label='Profile' icon={<RiAccountCircleLine />} />
                  </Tooltip>
                </Link>
                <Tooltip label='Logout' bg='var(--shade6)' color='white'>
                  <IconButton variant='link' px='1vw' aria-label='Profile' icon={<RiLogoutBoxLine />} onClick={logout} />
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
                    <IconButton variant='link' px='1vw' aria-label='Login' icon={<RiLoginBoxLine />} />
                  </Tooltip>
                </Link>
            </Box>
          </Flex>
        </nav>
      )}
    </div>
  );
}

export default Header;
