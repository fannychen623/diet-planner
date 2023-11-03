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
  Box, Tooltip, Image, IconButton,
  Popover, PopoverTrigger, Spacer,

} from '@chakra-ui/react';

// import icons
import {
  IoNutritionOutline, IoFastFoodOutline, IoSearchOutline, IoRepeatSharp,
  IoCalendarNumberOutline, IoBarChartOutline, IoFitnessOutline, IoExitOutline,
  IoArrowUpOutline,
} from 'react-icons/io5';

// import local style sheet
import '../styles/Header.css';

// show scroll to top button when paged is scrolled past 40px
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  let scrollTopButton = document.getElementById('scroll-top');
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    if (document.body.clientWidth > 820) {
      scrollTopButton.style.visibility = 'visible';
    }
  } else {
    if (document.body.clientWidth > 820) {
      scrollTopButton.style.visibility = 'hidden';
    }
  }
}

// function to scroll to the top of the page
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

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

  return (
    <Box>
      {/* check that user is logged in and token is not expired */}
      {Auth.loggedIn() && !Auth.isTokenExpired() ? (
        <Box className='nav-bar' display='flex' justifyContent='space-between'>
          <Box display='flex' alignItems='center'>
            <Link to='/home'>
              <Tooltip label='Home' color='var(--shade1)' bg='var(--shade6)'>
                <Image src={`./logo_${profileTheme}.png`} alt='Dietry' />
              </Tooltip>
            </Link>
            <Link to='/food'>
              <Tooltip label='Foods' color='var(--shade1)' bg='var(--shade6)'>
                <IconButton variant='link' aria-label='Foods' icon={<IoNutritionOutline p='100%' />} />
              </Tooltip>
            </Link>
            <Link to='/meal'>
              <Tooltip label='Meals' color='var(--shade1)' bg='var(--shade6)'>
                <IconButton variant='link' aria-label='Meals' icon={<IoFastFoodOutline p='100%' />} />
              </Tooltip>
            </Link>
            <Link to='/search'>
              <Tooltip label='Search' color='var(--shade1)' bg='var(--shade6)'>
                <IconButton variant='link' aria-label='Search' icon={<IoSearchOutline p='100%' />} />
              </Tooltip>
            </Link>
          </Box>
          <Spacer />
          <Box display='flex' alignItems='center'>
            <Popover>
              <Tooltip label='Converter' color='var(--shade1)' bg='var(--shade6)'>
                <Box>
                  <PopoverTrigger>
                    <IconButton variant='link' aria-label='Converter' icon={<IoRepeatSharp p='100%' />} />
                  </PopoverTrigger>
                </Box>
              </Tooltip>
              <Converter />
            </Popover>
            <Tooltip label='Calendar' color='var(--shade1)' bg='var(--shade6)'>
              <IconButton variant='link' aria-label='Calendar' icon={<IoCalendarNumberOutline p='100%' />} onClick={() => { navigate(`/calendar/${format(new Date(), 'MM_dd_yyyy')}`) }} />
            </Tooltip>
            <Link to='/progress'>
              <Tooltip label='Progress' color='var(--shade1)' bg='var(--shade6)'>
                <IconButton variant='link' aria-label='Progress' icon={<IoBarChartOutline p='100%' />} />
              </Tooltip>
            </Link>
            <Link to='/profile'>
              <Tooltip label='Profile' color='var(--shade1)' bg='var(--shade6)'>
                <IconButton variant='link' aria-label='Profile' icon={<IoFitnessOutline p='100%' />} />
              </Tooltip>
            </Link>
            <Tooltip label='Logout' color='var(--shade1)' bg='var(--shade6)'>
              <IconButton variant='link' aria-label='Logout' icon={<IoExitOutline p='100%' />} onClick={logout} />
            </Tooltip>
          </Box>
          <IconButton id='scroll-top' icon={<IoArrowUpOutline />} onClick={topFunction} />
        </Box>
      ) : (
        // if user is not logged in or token is expired
        <LoginSignup />
      )}
    </Box>
  );
}

export default Header;
