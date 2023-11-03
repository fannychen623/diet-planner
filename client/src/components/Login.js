// import packages and local auth
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Auth from '../utils/auth';

// import mutation
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';

// import package components
import {
  Box, Heading, Button, IconButton, Spinner, Input, 
  InputGroup, InputLeftAddon, InputLeftElement, InputRightElement,
} from '@chakra-ui/react'

// import icons
import { FiMail, FiEyeOff, FiEye, FiLock } from 'react-icons/fi';

// functional component for the login tab
const Login = () => {

  const isMobile = useMediaQuery({ query: `(max-width: 820px)` });

  // define the form state, default empty
  const [formState, setFormState] = useState({ email: '', password: '' });
  // define mutation
  const [login, { error, data }] = useMutation(LOGIN_USER);

  // on email/password change
  const handleChange = (event) => {
    const { name, value } = event.target;

    // set the form state to the new values
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // on submitting the form (click login)
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await login({
        variables: { ...formState },
      });

      // authenticate user login, set to redirect to home page
      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // clear the form
    setFormState({
      email: '',
      password: '',
    });
  };

  // set state of show password as text
  const [show, setShow] = useState(false)

  // function to call login when the enter key is pressed from the password input field
  const handleKeyDown = (event) => {
    const { keyCode } = event
    if (keyCode === 13) {
      event.preventDefault();
      handleFormSubmit(event);
    }
  }

  return (
    <Box m='auto'>
      <Heading>Login</Heading>
      {data ? (
        <Box textAlign='center'>
          <Spinner /> Logging in...
        </Box>
      ) : (
        <Box>
          {isMobile ? (
            <Box>
              <InputGroup>
                <InputLeftElement>
                  <span style={{ color: 'red' }}>*</span>
                  <FiMail />
                </InputLeftElement>
                <Input
                  type='email'
                  name='email'
                  placeholder='email'
                  value={formState.email}
                  onChange={handleChange}
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement>
                  <span style={{ color: 'red' }}>*</span>
                  <FiLock />
                </InputLeftElement>
                <Input
                  type={show ? 'text' : 'password'}
                  name='password'
                  placeholder='password'
                  value={formState.password}
                  onKeyDown={handleKeyDown}
                  onChange={handleChange}
                />
                <InputRightElement>
                  <IconButton
                    variant='ghost'
                    onClick={() => setShow(!show)}
                    icon={show ? <FiEye /> : <FiEyeOff />}
                  />
                </InputRightElement>
              </InputGroup>
            </Box>
          ) : (
            <Box>
              <InputGroup>
                <InputLeftAddon>
                  <span style={{ color: 'red' }}>*</span>
                  Email
                </InputLeftAddon>
                <Input
                  type='email'
                  name='email'
                  value={formState.email}
                  onChange={handleChange}
                />
                <InputRightElement>
                  <FiMail />
                </InputRightElement>
              </InputGroup>
              <InputGroup>
                <InputLeftAddon>
                  <span style={{ color: 'red' }}>*</span>
                  Password
                </InputLeftAddon>
                <Input
                  type={show ? 'text' : 'password'}
                  name='password'
                  value={formState.password}
                  onKeyDown={handleKeyDown}
                  onChange={handleChange}
                />
                <InputRightElement>
                  <Button
                    variant='ghost'
                    onClick={() => setShow(!show)}
                  >
                    {show ? <FiEye /> : <FiEyeOff />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>
          )}
        </Box>
      )}
      {error && (
        <Box className='login-signup-error'>
          {error.message}
        </Box>
      )}
      <Box textAlign='right'>
        <Button type='submit' onClick={handleFormSubmit}>
          Login
        </Button>
      </Box>
    </Box >
  );
}

export default Login;