// import package and local auth
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Auth from '../utils/auth';

// import mutation
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

// import package component and icon
import {
  Box, Heading, Button, IconButton, Spinner, Input,
  InputGroup, InputLeftAddon, InputLeftElement, InputRightElement,
} from '@chakra-ui/react'

import { FiUser, FiMail, FiEyeOff, FiEye, FiLock } from 'react-icons/fi';

// functional component for the signup tab
const Signup = () => {

  const isMobile = useMediaQuery({ query: `(max-width: 820px)` });

  // define the form state, default empty
  const [formState, setFormState] = useState({ username: '', email: '', password: '', });
  // define mutation
  const [addUser, { error, data }] = useMutation(ADD_USER);

  // on username/email/password change
  const handleChange = (event) => {
    const { name, value } = event.target;

    // set the form state to the new values
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // on submitting the form (click submit)
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      // authenticate user signup, set to redirect to home page
      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  // set state of show password as text
  const [show, setShow] = React.useState(false)

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
      <Heading>Signup</Heading>
      {data ? (
        <Box textAlign='center'>
          <Spinner /> Signing up and logging in...
        </Box>
      ) : (
        <Box>
          {isMobile ? (
            <Box>
              <InputGroup>
                <InputLeftElement>
                  <span style={{ color: 'red' }}>*</span>
                  <FiUser />
                </InputLeftElement>
                <Input
                  type='name'
                  name='username'
                  placeholder='username'
                  value={formState.name}
                  onChange={handleChange}
                />
              </InputGroup>
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
                  Username
                </InputLeftAddon>
                <Input
                  type='name'
                  name='username'
                  value={formState.name}
                  onChange={handleChange}
                />
                <InputRightElement>
                  <FiUser />
                </InputRightElement>
              </InputGroup>
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
          Signup
        </Button>
      </Box>
    </Box>
  );
}

export default Signup;