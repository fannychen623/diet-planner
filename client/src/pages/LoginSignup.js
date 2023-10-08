// import packages
import React from 'react';
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive';

// import local components
import Login from '../components/Login';
import Signup from '../components/Signup';

// import pacakge components
import {
  Box, Tabs, TabList, TabPanels, Tab, TabPanel,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, useDisclosure,
} from '@chakra-ui/react'

// import local stylesheet
import '../styles/LoginSignup.css';

// functional component for the login and signup modal
const LoginSignup = () => {

  // chakra function to open modal and set to default open
  // opens on navigation to path withoutevent listener (button click)
  const { isOpen } = useDisclosure({ defaultIsOpen: true })

  const isMobile = useMediaQuery({ query: `(max-width: 480px)` });

  //  function to navigate to different paths, set to navigate back to home
  const navigate = useNavigate();
  const returnToHome = () => navigate('/');

  return (
    <Box>
      {/* link modal open status to respective functions */}
      <Modal isOpen={isOpen} onClose={returnToHome} size={isMobile ? 'xs':'md'}>
        <ModalOverlay />
        <ModalContent className='login-signup-modal'>
          {/* tabs fill entire modal width and default tab to the first tab */}
          <Tabs isFitted variant='enclosed' defaultIndex={0}>
            <ModalHeader>
              <TabList>
                {/* style the tab when selected */}
                <Tab>
                  Login
                </Tab>
                <Tab>
                  Signup
                </Tab>
              </TabList>
            </ModalHeader>
            <TabPanels>
              {/* first tab populated with the login component */}
              <TabPanel>
                <Login />
              </TabPanel>
              {/* second tab populated with the the signup component */}
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default LoginSignup;