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

  return (
    <Box>
      {/* check that user is logged in and token is not expired */}
      {Auth.loggedIn() && !Auth.isTokenExpired() ? (
        <Box className='nav-bar' display='flex' justifyContent='space-between'>
          <Box display='flex' alignItems='center'>
            <Link to='/'>
              <Tooltip label='Home'>
                <Image src={`./logo_${profileTheme}.png`} alt='Dietry' />
              </Tooltip>
            </Link>
            <Link to='/food'>
              <Tooltip label='Foods'>
                <IconButton variant='link' aria-label='Foods' icon={<IoNutritionOutline p='100%' />} />
              </Tooltip>
            </Link>
            <Link to='/meal'>
              <Tooltip label='Meals'>
                <IconButton variant='link' aria-label='Meals' icon={<IoFastFoodOutline p='100%' />} />
              </Tooltip>
            </Link>
            <Link to='/search'>
              <Tooltip label='Search'>
                <IconButton variant='link' aria-label='Search' icon={<IoSearchOutline p='100%' />} />
              </Tooltip>
            </Link>
          </Box>
          <Spacer />
          <Box display='flex' alignItems='center'>
            <Popover>
              <Tooltip label='Converter'>
                <Box>
                  <PopoverTrigger>
                    <IconButton variant='link' aria-label='Converter' icon={<IoRepeatSharp p='100%' />} />
                  </PopoverTrigger>
                </Box>
              </Tooltip>
              <Converter />
            </Popover>
            <Tooltip label='Calendar'>
              <IconButton variant='link' aria-label='Calendar' icon={<IoCalendarNumberOutline p='100%' />} onClick={() => { navigate(`/calendar/${format(new Date(), 'MM_dd_yyyy')}`) }} />
            </Tooltip>
            <Link to='/progress'>
              <Tooltip label='Progress'>
                <IconButton variant='link' aria-label='Progress' icon={<IoBarChartOutline p='100%' />} />
              </Tooltip>
            </Link>
            <Link to='/profile'>
              <Tooltip label='Profile'>
                <IconButton variant='link' aria-label='Profile' icon={<IoFitnessOutline p='100%' />} />
              </Tooltip>
            </Link>
            <Tooltip label='Logout'>
              <IconButton variant='link' aria-label='Logout' icon={<IoExitOutline p='100%' />} onClick={logout} />
            </Tooltip>
          </Box>
        </Box>
      ) : (
        // if user is not logged in or token is expired
        <LoginSignup />
      )}
    </Box>
  );
}

export default Header;
