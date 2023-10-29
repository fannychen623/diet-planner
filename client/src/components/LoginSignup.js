// import packages
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

// import local components
import Login from './Login';
import Signup from './Signup';

// import pacakge components
import {
  Box, SimpleGrid, Center, Image, Button,
} from '@chakra-ui/react'

// import icons
import { FiArrowRight } from 'react-icons/fi';

// import local stylesheet
import '../styles/LoginSignup.css';

// functional component for the login and signup modal
const LoginSignup = () => {

  const isMobile = useMediaQuery({ query: `(max-width: 480px)` });
  const [page, setPage] = useState('login')

  return (
    <Box className='login-signup'>
      <SimpleGrid columns={isMobile ? 1 : 2}>
        <Center height={isMobile ? '40vh' : '100vh'}>
          <Image src='./Logo.gif' alt='Dietry' m='auto' />
        </Center>
        <Center bg='var(--shade1)' height={isMobile ? '60vh' : '100vh'}>
          {page === 'login' ? (
            <Box className='login' width='75%'>
              <Login />
              <Button id="navigate-signup" variant='ghost' onClick={() => {setPage('signup')}} >
                Signup<FiArrowRight />
              </Button>
            </Box>
          ) : (
            <Box className='signup' width='75%'>
              <Signup />
              <Button id="navigate-login" variant='ghost' onClick={() => {setPage('login')}}>
                Login<FiArrowRight />
              </Button>
            </Box>
          )}
        </Center>
      </SimpleGrid>
    </Box>
  );
}

export default LoginSignup;