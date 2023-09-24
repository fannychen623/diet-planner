// import packages and local auth
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';

// import queries and mutations
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { ADD_PROFILE, UPDATE_PROFILE } from '../utils/mutations';

// import package components
import {
  Box, Grid, GridItem, Heading, Text, Stack,
  Button, Select, SimpleGrid, RadioGroup, Radio,
  Input, InputGroup, InputLeftAddon, InputRightAddon,
  Card, CardHeader, CardBody, CardFooter,
  FormControl, FormLabel, FormHelperText,
} from '@chakra-ui/react';

// import local style sheet
import '../styles/Profile.css';

// component to view or create profile
const Profile = () => {

  // emulates a fetch (useQuery expects a Promise)
  // used to re-query data and re-render page on event listener/change
  const emulateFetch = _ => {
    return new Promise(resolve => {
      resolve([{ data: 'ok' }]);
    });
  };

  // query all data associated with the signed in user
  const { loading, data, refetch } = useQuery(QUERY_ME, emulateFetch, {
    refetchOnWindowFocus: false,
    // enabled set to true allows query to run on page initialization
    enabled: true,
  });

  // extract the profile data 
  const profile = data?.me.profile;

  // set the form state, default empty
  const [formState, setFormState] = useState({
    age: '',
    sex: '',
    height: '',
    weight: '',
    activityLevel: '',
    goal: '',
    calories: '',
    carbs: '',
    fat: '',
    protein: '',
  });

  const [profileId, setProfileId] = useState('')
  const [unit, setUnit] = useState('US Units')
  const [height, setHeight] = useState({ feet: '', inches: '' })
  const [weight, setWeight] = useState({ US: '', Metric: '' })
  const [BMR, setBMR] = useState('')
  // set state of calorie intake display, default to false
  const [showCalories, setShowCalories] = useState(false);

  // if user already has a profile, set the states of the field to existing data
  useEffect(() => {
    if (!profile) {
      return;
    } else {
      setProfileId(profile._id)
      setFormState({
        age: profile.age,
        sex: profile.sex,
        height: profile.height,
        weight: profile.weight,
        activityLevel: profile.activityLevel,
        goal: profile.goal,
        calories: profile.calories,
        carbs: profile.carbs,
        fat: profile.fat,
        protein: profile.protein,
      })
      setWeight({ US: (profile.weight * 2.2046).toFixed(2), Metric: profile.weight })
      setHeight({
        feet: Math.floor(profile.height / 30.48).toFixed(0),
        inches: (profile.height / 2.54) - (Math.floor(profile.height / 30.48).toFixed(0) * 12)
      })
      if (profile.sex === 'Male') {
        setBMR(((10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5).toFixed(0))
      } else if (profile.sex === 'Female') {
        setBMR(((10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161).toFixed(0))
      }
    }
  }, [profile]);

  const calculateMacros = () => {
    if (
      formState.age !== '' &&
      formState.height !== '' &&
      formState.weight !== '' &&
      formState.activityLevel !== '' &&
      formState.goal !== ''
    ) {
      let BMRCal = 0
      if (formState.sex === 'Male') {
        BMRCal = (10 * formState.weight) + (6.25 * formState.height) - (5 * formState.age) + 5
      } else {
        BMRCal = (10 * formState.weight) + (6.25 * formState.height) - (5 * formState.age) - 161
      }
      setBMR(BMRCal.toFixed(0))

      let maintain = { calories: 0, carbs: 0, protein: 0, fat: 0 }
      if (formState.activityLevel === 'Sedentary (little or no exercise)') {
        maintain.calories = BMRCal * 1.2
      } else if (formState.activityLevel === 'Light (exercise 1-3 times/week)') {
        maintain.calories = BMRCal * 1.375
      } else if (formState.activityLevel === 'Moderate (exercise 4-5 times/week)') {
        maintain.calories = BMRCal * 1.465
      } else if (formState.activityLevel === 'Active (daily exercise or intense exercise 3-4 times/week)') {
        maintain.calories = BMRCal * 1.55
      } else if (formState.activityLevel === 'Very Active (intense exercise 6-7 times/week)') {
        maintain.calories = BMRCal * 1.725
      } else if (formState.activityLevel === 'Extra Active (very intense exercise daily or physical job)') {
        maintain.calories = BMRCal * 1.9
      }

      let carbsUpper = (0.45 * maintain.calories) / 4
      let carbsLower = (0.65 * maintain.calories) / 4
      maintain.carbs = (carbsUpper + carbsLower) / 2

      let proteinUpper = (0.1 * maintain.calories) / 4
      let proteinLower = (0.35 * maintain.calories) / 4
      maintain.protein = (proteinUpper + proteinLower) / 2

      let fatUpper = (0.2 * maintain.calories) / 9
      let fatLower = (0.35 * maintain.calories) / 9
      maintain.fat = (fatUpper + fatLower) / 2

      let factor = 1
      if (formState.goal === 'Maintain Weight') {
        factor = 1
      } else if (formState.goal === 'Mild Weight Loss (0.5 lb/week)') {
        factor = 0.9
      } else if (formState.goal === 'Weight Loss (1 lb/week)') {
        factor = 0.79
      } else if (formState.goal === 'Extreme Weight Loss (2 lbs/week)') {
        factor = 0.58
      } else if (formState.goal === 'Mild Weight Gain (0.5 lb/week)') {
        factor = 1.1
      } else if (formState.goal === 'Weight Gain (1 lb/week)') {
        factor = 1.21
      } else if (formState.goal === 'Fast Weight Gain (2 lbs/week)') {
        factor = 1.42
      }

      let macroCal = {
        calories: (factor * maintain.calories).toFixed(0),
        carbs: (factor * maintain.carbs).toFixed(0),
        fat: (factor * maintain.fat).toFixed(0),
        protein: (factor * maintain.protein).toFixed(0),
      }
      setFormState({
        ...formState,
        calories: parseInt(macroCal.calories),
        carbs: parseInt(macroCal.carbs),
        fat: parseInt(macroCal.fat),
        protein: parseInt(macroCal.protein),
      })
    }
  };

  // on title/text change
  const handleChange = (name, value) => {
    // set the form state to the new values
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleAddHeightWeight = (name, value) => {
    let metricHeight = 0
    if (name === 'feet') {
      setHeight({ ...height, feet: value })
      metricHeight = ((30.48 * value) + (2.54 * height.inches)).toFixed(2)
      setFormState({ ...formState, height: parseFloat(metricHeight) })
    } else if (name === 'inches') {
      setHeight({ ...height, inches: value })
      metricHeight = ((30.48 * height.feet) + (2.54 * value)).toFixed(2)
      setFormState({ ...formState, height: parseFloat(metricHeight) })
    } else if (name === 'weight') {
      if (unit === 'US Units') {
        setWeight({ ...weight, US: value, Metric: (value / 2.2046).toFixed(2) })
        setFormState({ ...formState, weight: parseFloat((value / 2.2046).toFixed(2)) })
      } else {
        setWeight({ ...weight, US: (value * 2.2046).toFixed(2), Metric: value })
        setFormState({ ...formState, weight: parseFloat(value.replace(/,/g, ".")).toFixed(2) })
      }
    };
  };

  // mutation to update profile, pass in the id of the current user
  const [addProfile, { addError, addData }] = useMutation(ADD_PROFILE);

  // update profile on submit
  const handleAddProfile = async () => {
    try {
      const { addData } = addProfile({
        // pass in set fields
        variables: { ...formState },
      });

      // reload page on success
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  // mutation to update profile, pass in the id of the current user
  const [updateProfile, { updateError, updateData }] = useMutation(UPDATE_PROFILE);

  // update profile on submit
  const handleUpdateProfile = async () => {
    try {
      const { updateData } = updateProfile({
        // pass in set fields
        variables: { profileId, ...formState },
      });

      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box className='profile-page'>
      <Grid templateColumns='repeat(10, 1fr)' gap='6'>
        <GridItem colSpan='5'>
          <Card className='profile'>
            <CardHeader>
              <Heading textAlign='center'>Profile</Heading>
            </CardHeader>
            <CardBody>
              <Select
                width='fit-content'
                borderColor='var(--shade4)'
                name='unit'
                defaultValue={'US Units'}
                value={unit}
                onChange={(e) => { setUnit(e.target.value) }}
              >
                <option value='US Units'>US Units</option>
                <option value='Metric Units'>Metric Units</option>
              </Select>
              <InputGroup mt='1em'>
                <InputLeftAddon
                  children='Age'
                />
                <Input
                  name='age'
                  value={formState.age}
                  onBlur={calculateMacros}
                  onChange={(e) => { handleChange(e.target.name, parseInt(e.target.value)) }}
                />
              </InputGroup>
              <InputGroup alignItems='center'>
                <InputLeftAddon
                  children='Sex (at birth)'
                />
                <RadioGroup
                  name='sex'
                  value={formState.sex}
                  onChange={(e) => { setFormState({ ...formState, sex: e }) }}
                >
                  <Radio value='Male'>Male</Radio>
                  <Radio value='Female'>Female</Radio>
                </RadioGroup>
              </InputGroup>
              {unit === 'US Units' ? (
                <InputGroup>
                  <InputLeftAddon
                    children='Height'
                  />
                  <Input
                    name='feet'
                    value={height.feet}
                    onBlur={calculateMacros}
                    onChange={(e) => { handleAddHeightWeight(e.target.name, e.target.value) }}
                  />
                  <InputRightAddon
                    children='feet'
                  />
                  <Input
                    name='inches'
                    value={height.inches}
                    onBlur={calculateMacros}
                    onChange={(e) => { handleAddHeightWeight(e.target.name, e.target.value) }}
                  />
                  <InputRightAddon
                    children='inches'
                  />
                </InputGroup>
              ) : (
                <InputGroup>
                  <InputLeftAddon
                    children='Height'
                  />
                  <Input
                    name='height'
                    value={formState.height}
                    onBlur={calculateMacros}
                    onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                  />
                  <InputRightAddon
                    children='cm'
                  />
                </InputGroup>
              )}
              <InputGroup>
                <InputLeftAddon
                  children='Weight'
                />
                <Input
                  name='weight'
                  value={unit === 'US Units' ? (weight.US) : (weight.Metric)}
                  onBlur={calculateMacros}
                  onChange={(e) => { handleAddHeightWeight(e.target.name, e.target.value) }}
                />
                <InputRightAddon
                  children={unit === 'US Units' ? ('lbs') : ('kg')}
                />
              </InputGroup>
              <InputGroup>
                <InputLeftAddon
                  children='Activity Level'
                />
                <Select
                  placeholder='Select option'
                  name='activityLevel'
                  value={formState.activityLevel}
                  onBlur={calculateMacros}
                  onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                >
                  <option value='Sedentary (little or no exercise)'>Sedentary (little or no exercise)</option>
                  <option value='Light (exercise 1-3 times/week)'>Light (exercise 1-3 times/week)</option>
                  <option value='Moderate (exercise 4-5 times/week)'>Moderate (exercise 4-5 times/week)</option>
                  <option value='Active (daily exercise or intense exercise 3-4 times/week)'>Active (daily exercise or intense exercise 3-4 times/week)</option>
                  <option value='Very Active (intense exercise 6-7 times/week)'>Very Active (intense exercise 6-7 times/week)</option>
                  <option value='Extra Active (very intense exercise daily or physical job)'>Extra Active (very intense exercise daily or physical job)</option>
                </Select>
              </InputGroup>
              <InputGroup>
                <InputLeftAddon
                  children='Goal'
                />
                <Select
                  placeholder='Select option'
                  name='goal'
                  value={formState.goal}
                  onBlur={calculateMacros}
                  onChange={(e) => { handleChange(e.target.name, e.target.value) }}
                >
                  <option value='Maintain Weight'>Maintain Weight</option>
                  <option value='Mild Weight Loss (0.5 lb/week)'>Mild Weight Loss (0.5 lb/week)</option>
                  <option value='Weight Loss (1 lb/week)'>Weight Loss (1 lb/week)</option>
                  <option value='Extreme Weight Loss (2 lbs/week)'>Extreme Weight Loss (2 lbs/week)</option>
                  <option value='Mild Weight Gain (0.5 lb/week)'>Mild Weight Gain (0.5 lb/week)</option>
                  <option value='Weight Gain (1 lb/week)'>Weight Gain (1 lb/week)</option>
                  <option value='Fast Weight Gain (2 lbs/week)'>Fast Weight Gain (2 lbs/week)</option>
                </Select>
              </InputGroup>
            </CardBody>
            <CardFooter>
              {profile ? (
                <Button onClick={handleUpdateProfile}>Update Profile</Button>
              ) : (
                <Button onClick={handleAddProfile}>Add Profile</Button>
              )}
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem colSpan='5'>
          <Card className='metabolicStats'>
            <CardHeader>
              <Heading textAlign='center'>Metabolic Statistics</Heading>
            </CardHeader>
            <CardBody>
              {profile ? (
                <Box>
                  <Box display='flex'>
                  <Heading>Basal Metabolic Rate (BMR)</Heading>
                  <Text className='statsValue'>{BMR} <span>kcal/day</span></Text>
                  </Box>
                  <Box display='flex'>
                    <Heading>Calories</Heading>
                    <Text className='statsValue'>{formState.calories} <span>g/day</span></Text>
                  </Box>
                  <Box display='flex'>
                    <Heading>Carbohydrates</Heading>
                    <Text className='statsValue'>{formState.carbs} <span>g/day</span></Text>
                  </Box>
                  <Box display='flex'>
                    <Heading>Fat</Heading>
                    <Text className='statsValue'>{formState.fat} <span>g/day</span></Text>
                  </Box>
                  <Box display='flex'>
                    <Heading>Protein</Heading>
                    <Text className='statsValue'>{formState.protein} <span>g/day</span></Text>
                  </Box>
                  <Box display='flex'>
                    <Heading>Sodium</Heading>
                    <Text className='statsValue'>&lt; 2300<span>g/day</span></Text>
                  </Box>
                  <Box display='flex'>
                    <Heading>Sugar</Heading>
                    <Text className='statsValue'>{formState.sex === 'Male' ? ('< 36'):('< 24')} <span>g/day</span></Text>
                  </Box>
                </Box>
              ) : (
                <Text class='createProfileText'>Complete your personal profile to calculate your BMR and daily nutrition levels.</Text>
              )}
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Profile;