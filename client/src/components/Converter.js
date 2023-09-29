// import packages
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

// import package components
import {
  Box, Select, Input, PopoverContent,
  PopoverHeader, PopoverBody, PopoverFooter,
  PopoverArrow, PopoverCloseButton,
} from '@chakra-ui/react'

// import icons
import { FiArrowDown } from 'react-icons/fi';

// import local style sheet
import '../styles/Converter.css';

// functional component to create routines modal
const Converter = () => {

  const [unitType, setUnitType] = useState('')
  const [unit1, setUnit1] = useState('')
  const [unit2, setUnit2] = useState('')
  const [values, setValues] = useState({ val1: '', val2: '' })
  const [conversionFactor, setConversionFactor] = useState('')

  useEffect(() => {
    if (unitType !== '' && unit1 !== '' && unit2 !== '') {
      let factor = 0
      if (unit1 === unit2) {
        factor = 1
      } else {
        if (unitType === 'Weight') {
          if (unit1 === 'gram' && unit2 === 'kilogram') {
            factor = 0.001
          } else if (unit1 === 'gram' && unit2 === 'milligram') {
            factor = 1000
          } else if (unit1 === 'gram' && unit2 === 'microgram') {
            factor = 1e6
          } else if (unit1 === 'gram' && unit2 === 'pound') {
            factor = 0.00220462
          } else if (unit1 === 'gram' && unit2 === 'ounce') {
            factor = 0.035274
          } else if (unit1 === 'gram' && unit2 === 'jin') {
            factor = 0.002
          } else if (unit1 === 'kilogram' && unit2 === 'gram') {
            factor = 1000
          } else if (unit1 === 'kilogram' && unit2 === 'milligram') {
            factor = 1e6
          } else if (unit1 === 'kilogram' && unit2 === 'microgram') {
            factor = 1e9
          } else if (unit1 === 'kilogram' && unit2 === 'pound') {
            factor = 2.20462
          } else if (unit1 === 'kilogram' && unit2 === 'ounce') {
            factor = 35.274
          } else if (unit1 === 'kilogram' && unit2 === 'jin') {
            factor = 2
          } else if (unit1 === 'milligram' && unit2 === 'gram') {
            factor = 352740
          } else if (unit1 === 'milligram' && unit2 === 'kilogram') {
            factor = 1e-6
          } else if (unit1 === 'milligram' && unit2 === 'microgram') {
            factor = 1000
          } else if (unit1 === 'milligram' && unit2 === 'pound') {
            factor = 2.2046e-6
          } else if (unit1 === 'milligram' && unit2 === 'ounce') {
            factor = 3.5274e-5
          } else if (unit1 === 'milligram' && unit2 === 'jin') {
            factor = 2e-6
          } else if (unit1 === 'microgram' && unit2 === 'gram') {
            factor = 1e-6
          } else if (unit1 === 'microgram' && unit2 === 'kilogram') {
            factor = 1e-9
          } else if (unit1 === 'microgram' && unit2 === 'milligram') {
            factor = 0.001
          } else if (unit1 === 'microgram' && unit2 === 'pound') {
            factor = 2.2046e-9
          } else if (unit1 === 'microgram' && unit2 === 'ounce') {
            factor = 3.5274e-8
          } else if (unit1 === 'microgram' && unit2 === 'jin') {
            factor = 2e-9
          } else if (unit1 === 'pound' && unit2 === 'gram') {
            factor = 453.592
          } else if (unit1 === 'pound' && unit2 === 'kilogram') {
            factor = 0.453592
          } else if (unit1 === 'pound' && unit2 === 'milligram') {
            factor = 453592
          } else if (unit1 === 'pound' && unit2 === 'microgram') {
            factor = 4.536e+8
          } else if (unit1 === 'pound' && unit2 === 'ounce') {
            factor = 16
          } else if (unit1 === 'pound' && unit2 === 'jin') {
            factor = 0.90718474
          } else if (unit1 === 'ounce' && unit2 === 'gram') {
            factor = 28.3495
          } else if (unit1 === 'ounce' && unit2 === 'kilogram') {
            factor = 0.0283495
          } else if (unit1 === 'ounce' && unit2 === 'milligram') {
            factor = 28349.5
          } else if (unit1 === 'ounce' && unit2 === 'microgram') {
            factor = 2.835e+7
          } else if (unit1 === 'ounce' && unit2 === 'pound') {
            factor = 0.0625
          } else if (unit1 === 'ounce' && unit2 === 'jin') {
            factor = 0.05669904625
          } else if (unit1 === 'jin' && unit2 === 'gram') {
            factor = 500
          } else if (unit1 === 'jin' && unit2 === 'kilogram') {
            factor = 0.5
          } else if (unit1 === 'jin' && unit2 === 'milligram') {
            factor = 500000
          } else if (unit1 === 'jin' && unit2 === 'microgram') {
            factor = 5e8
          } else if (unit1 === 'jin' && unit2 === 'pound') {
            factor = 1.1023113109244
          } else if (unit1 === 'jin' && unit2 === 'ounce') {
            factor = 17.63698097479
          }
        } else if (unitType === 'Energy') {
          if (unit1 === 'joule' && unit2 === 'kilojoule') {
            factor = 0.001
          } else if (unit1 === 'joule' && unit2 === 'calorie') {
            factor = 0.239006
          } else if (unit1 === 'joule' && unit2 === 'kilocalorie') {
            factor = 0.000239006
          } else if (unit1 === 'kilojoule' && unit2 === 'joule') {
            factor = 1000
          } else if (unit1 === 'kilojoule' && unit2 === 'calorie') {
            factor = 239.006
          } else if (unit1 === 'kilojoule' && unit2 === 'kilocalorie') {
            factor = 0.239006
          } else if (unit1 === 'calorie' && unit2 === 'joule') {
            factor = 4.184
          } else if (unit1 === 'calorie' && unit2 === 'kilojoule') {
            factor = 0.004184
          } else if (unit1 === 'calorie' && unit2 === 'kilocalorie') {
            factor = 0.001
          } else if (unit1 === 'kilocalorie' && unit2 === 'joule') {
            factor = 4184
          } else if (unit1 === 'kilocalorie' && unit2 === 'kilojoule') {
            factor = 4.184
          } else if (unit1 === 'kilocalorie' && unit2 === 'calorie') {
            factor = 1000
          }
        }
      }
      setValues({ ...values, val2: +parseFloat(values.val1 * factor).toFixed(9) })
      setConversionFactor(+parseFloat(factor).toFixed(9))
    }
  }, [values])

  return (
    <Box className='converter'>
      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader>Convert Units</PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody>
          <Box alignContent='center'>
            <Select
              placeholder='Select Type'
              borderColor={unitType ? ('var(--shade5)') : ('red')}
              value={unitType}
              onChange={(e) => { setUnitType(e.target.value); setUnit1(''); setUnit2(''); setValues({ val1: '', val2: '' }) }}>
              <option value='Weight'>Weight</option>
              <option value='Energy'>Energy</option>
            </Select>
          </Box>
          <Box display='flex'>
            <Input value={values.val1} onChange={(e) => { setValues({ ...values, val1: e.target.value }) }} />
            {unitType === 'Weight' ? (
              <Select
                placeholder='Unit'
                borderColor={unit1 ? ('var(--shade5)') : ('red')}
                value={unit1}
                onChange={(e) => { setUnit1(e.target.value) }}>
                <option value='gram'>gram (g)</option>
                <option value='kilogram'>kilogram (kg)</option>
                <option value='milligram'>milligram (mg)</option>
                <option value='microgram'>microgram (ug)</option>
                <option value='pound'>pound (lb)</option>
                <option value='ounce'>ounce (oz)</option>
                <option value='jin'>jin</option>
              </Select>
            ) : (
              <Select
                placeholder='Unit'
                borderColor={unit1 ? ('var(--shade5)') : ('red')}
                value={unit1}
                onChange={(e) => { setUnit1(e.target.value) }}>
                <option value='joule'>joule (J)</option>
                <option value='kilojoule'>kilojoule (kJ)</option>
                <option value='calorie'>calorie (C)</option>
                <option value='kilocalorie'>kilocalorie (kcal)</option>
              </Select>
            )}
          </Box>
          <Box textAlign='-webkit-center'>
            <FiArrowDown />
          </Box>
          <Box display='flex'>
            <Input isDisabled value={values.val2} />
            {unitType === 'Weight' ? (
              <Select
                placeholder='Unit'
                borderColor={unit2 ? ('var(--shade5)') : ('red')}
                value={unit2}
                onChange={(e) => { setUnit2(e.target.value) }}>
                <option value='gram'>gram (g)</option>
                <option value='kilogram'>kilogram (kg)</option>
                <option value='milligram'>milligram (mg)</option>
                <option value='microgram'>microgram (ug)</option>
                <option value='pound'>pound (lb)</option>
                <option value='ounce'>ounce (oz)</option>
                <option value='jin'>jin</option>
              </Select>
            ) : (
              <Select
                placeholder='Unit'
                borderColor={unit2 ? ('var(--shade5)') : ('red')}
                value={unit2}
                onChange={(e) => { setUnit2(e.target.value) }}>
                <option value='joule'>joule (J)</option>
                <option value='kilojoule'>kilojoule (kJ)</option>
                <option value='calorie'>calorie (C)</option>
                <option value='kilocalorie'>kilocalorie (kcal)</option>
              </Select>
            )}
          </Box>
        </PopoverBody>
        <PopoverFooter>Multiply by {conversionFactor || '...'}</PopoverFooter>
      </PopoverContent>
    </Box>
  );
}

export default Converter;