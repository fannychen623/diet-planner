// import packages
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive';
import env from 'react-dotenv';
import Client from "fooddata-central";
// import fetch from 'node-fetch';


// import package components and icon
import {
    Button, Center, SimpleGrid, Card, CardFooter, CardHeader, Heading,
    Box, Tabs, TabList, TabPanels, Tab, TabPanel,
    InputGroup, Input, InputRightElement, IconButton,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
    ModalCloseButton, useDisclosure,
} from '@chakra-ui/react'

import { FiSearch } from 'react-icons/fi';

// import local style sheet
// import '../styles/Playlists.css'

// const fetch = require('node-fetch');

// functional component for playlist page
const Search = () => {
    // chakra function to open modal and set to default open
    // opens on navigation to path withoutevent listener (button click)
    const { isOpen } = useDisclosure({ defaultIsOpen: true })

    //  function to navigate to different paths, set to navigate back to home
    const navigate = useNavigate();
    const returnToHome = () => navigate('/');

    // define the array of playlists, default to empty
    const [searchValue, setSearchValue] = useState('')

    // fetch from spotify API
    const getNutritionFacts = async () => {
        const apiKey = env.USDA_API_KEY
        const result = await fetch(
            `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchValue,
                    // dataType: ["RC Legacy", "Foundation"],
                    pageNumber: 1,
                }),
            },
        )
        const response = await result.json()
        console.log(response)

        // const params = {
        //         api_key: env.USDA_API_KEY,
        //         query: 'banana',
        //         dataType: ["Survey (FNDDS)"],
        //         pagesize: 5,
        //     }
        // const response = await fetch(
        //     `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${params.api_key}&query=${params.query}&dataType=${params.dataType}&pagesize=${params.pagesize}`
        //    );
        //    const dataGrabbed = await response.json();
        //    console.log(dataGrabbed)
        // const params = {
        //     api_key: env.USDA_API_KEY,
        //     query: 'banana',
        //     dataType: ["Survey (FNDDS)"],
        //     pagesize: 5,
        // }

        // const usdaURL = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${env.USDA_API_KEY}&query=${searchValue}`

        // function getData() {
        //     return fetch(usdaURL)
        //     .then(response => response.json())
        // }

        // getData().then(data => console.log(data))
        // try {
        //     const usdaURL = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${env.USDA_API_KEY}&query=${searchValue}`
        //     const response = await fetch(usdaURL, {
        //         method: 'GET'
        //     })
        //     const data = await response.json()
        //     console.log(data)
        //     // .then(response => response.json())

        //     // console.log(response)

        //     // // define API url and client keys
        //     // const usdaURL = 'https://accounts.spotify.com/api/token'
        //     // const clientId = env.REACT_APP_CLIENT_ID;
        //     // const clientSecret = env.REACT_APP_CLIENT_SECRET;

        //     // // fetch from API
        //     // const response = await fetch(spotfiyURL, {
        //     //     method: 'POST',
        //     //     headers: {
        //     //         'Content-Type': 'application/x-www-form-urlencoded',
        //     //     },
        //     //     body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`

        //     // });
        //     // const data = await response.json()
        //     // // define url for workout playlists
        //     // const url = `https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFAXlCG6QvYQ4/playlists`
        //     // const getPlaylists = await fetch(url, {
        //     //     method: 'GET',
        //     //     headers: {
        //     //         Authorization: `Bearer ${data.access_token}`
        //     //     },
        //     // })
        //     // // populate playlist array upon fetch completion
        //     // const playlistData = await getPlaylists.json()
        //     // setPlaylists(
        //     //     playlistData.playlists.items.map((playlist) => ({
        //     //         name: playlist.name,
        //     //         link: playlist.external_urls.spotify,
        //     //     }))
        //     // )
        // } catch (error) {
        //     console.error(error)
        // }
    }

    return (
        <Box className='loginSignup-modal'>
            {/* link modal open status to respective functions */}
            <Modal isOpen={isOpen} onClose={returnToHome}>
                <ModalOverlay />
                <ModalContent >
                    <ModalHeader>
                        Search Nutrition Facts
                    </ModalHeader>
                    <ModalBody>
                        <InputGroup>
                            <Input placeholder='i.e. strawberry' onChange={(e) => { setSearchValue(e.target.value) }} />
                        </InputGroup>
                        <Button onClick={() => { getNutritionFacts() }}>Search</Button>
                    </ModalBody>
                    <ModalCloseButton />
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default Search;

