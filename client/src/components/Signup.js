// import package and local auth
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive';
import Auth from '../utils/auth';

// import mutation
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

// import package component and icon
import {
  Box, Button, FormControl, Spinner, Input,
  InputGroup, InputLeftAddon, InputRightElement,
  ModalFooter, ModalBody,
} from '@chakra-ui/react'

import { FiUser, FiMail, FiEyeOff, FiEye, FiLock, FiUnlock  } from 'react-icons/fi';

// import local style sheet
import '../styles/LoginSignup.css';

// functional component for the signup tab
const Signup = () => {

  const isMobile = useMediaQuery({ query: `(max-width: 768px)` });

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

  // navigate to home on page close
  const navigate = useNavigate();
  const returnToHome = () => navigate('/');
  // set state of show password as text
  const [show, setShow] = React.useState(false)

  return (
    <Box className='signup-modal'>
      {data ? (
        <Box textAlign='center'>
          <Spinner /> Signup success! Logging in...
        </Box>
      ) : (
        <Box>
          <ModalBody>
            <FormControl isRequired>
            {isMobile ? (
              <Box>
              <InputGroup>
                <InputLeftAddon>
                  <span style={{ color: 'red' }}>*</span>
                  <FiUser />
                </InputLeftAddon>
                <Input
                  type='name'
                  name='username'
                  placeholder='username'
                  value={formState.name}
                  onChange={handleChange}
                />
              </InputGroup>
              <InputGroup>
                <InputLeftAddon>
                  <span style={{ color: 'red' }}>*</span>
                  <FiMail />
                </InputLeftAddon>
                <Input
                  type='email'
                  name='email'
                  placeholder='email'
                  value={formState.email}
                  onChange={handleChange}
                />
              </InputGroup>
              <InputGroup>
                <InputLeftAddon>
                  <span style={{ color: 'red' }}>*</span>
                  <Button
                    variant='ghost'
                    color='white'
                    onClick={() => setShow(!show)}
                  >
                    {show ? <FiUnlock /> : <FiLock />}
                  </Button>
                </InputLeftAddon>
                <Input
                  type={show ? 'text' : 'password'}
                  name='password'
                  placeholder='password'
                  value={formState.password}
                  onChange={handleChange}
                />
              </InputGroup>
              </Box>
            ):(
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
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={returnToHome} >
              Close
            </Button>
            <Button type='submit' onClick={handleFormSubmit}>
              Signup
            </Button>
          </ModalFooter>
        </Box>
      )}
      {error && (
        <Box m='5' p='3'>
          {error.message}
        </Box>
      )}
    </Box>
  );
}

export default Signup;