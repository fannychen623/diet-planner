// import packages
import React, { useEffect, useState } from 'react';

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

// functional component/popover to convert values
const Converter = () => {

  // define states
  const [unitType, setUnitType] = useState('')
  const [unit1, setUnit1] = useState('')
  const [unit2, setUnit2] = useState('')
  const [values, setValues] = useState({ val1: '', val2: '' })
  const [conversionFactor, setConversionFactor] = useState('')

  // define conversion factors based on units
  const conversionFactors = [
    { units: 'gram_kilogram', factor: 0.001 },
    { units: 'gram_milligram', factor: 1000 },
    { units: 'gram_microgram', factor: 1e6 },
    { units: 'gram_pound', factor: 0.00220462 },
    { units: 'gram_ounce', factor: 0.035274 },
    { units: 'gram_jin', factor: 0.002 },
    { units: 'kilogram_gram', factor: 1000 },
    { units: 'kilogram_milligram', factor: 1e6 },
    { units: 'kilogram_microgram', factor: 1e9 },
    { units: 'kilogram_pound', factor: 2.20462 },
    { units: 'kilogram_ounce', factor: 35.274 },
    { units: 'kilogram_jin', factor: 2 },
    { units: 'milligram_gram', factor: 352740 },
    { units: 'millogram_kilogram', factor: 1e-6 },
    { units: 'milligram_microgram', factor: 1000 },
    { units: 'milligram_pound', factor: 2.2046e-6 },
    { units: 'milligram_ounce', factor: 3.5274e-5 },
    { units: 'milligram_jin', factor: 2e-6 },
    { units: 'microgram_gram', factor: 1e-6 },
    { units: 'microgram_kilogram', factor: 1e-9 },
    { units: 'microgram_milligram', factor: 0.001 },
    { units: 'microgram_pound', factor: 2.2046e-9 },
    { units: 'microgram_ounce', factor: 3.5274e-8 },
    { units: 'microgram_jin', factor: 2e-9 },
    { units: 'pound_gram', factor: 453.592 },
    { units: 'pound_kilogram', factor: 0.453592 },
    { units: 'pound_milligram', factor: 453592 },
    { units: 'pound_microgram', factor: 4.536e+8 },
    { units: 'pound_ounce', factor: 16 },
    { units: 'pound_jin', factor: 0.90718474 },
    { units: 'ounce_gram', factor: 28.3495 },
    { units: 'ounce_kilogram', factor: 0.0283495 },
    { units: 'ounce_milligram', factor: 28349.5 },
    { units: 'ounce_microgram', factor: 2.835e+7 },
    { units: 'ounce_pound', factor: 0.0625 },
    { units: 'ounce_jin', factor: 0.05669904625 },
    { units: 'jin_gram', factor: 500 },
    { units: 'jin_kilogram', factor: 0.5 },
    { units: 'jin_milligram', factor: 500000 },
    { units: 'jin_microgram', factor: 5e8 },
    { units: 'jin_pound', factor: 1.1023113109244 },
    { units: 'jin_ounce', factor: 17.63698097479 },
    { units: 'joule_kilojoule', factor: 0.001 },
    { units: 'joule_calorie', factor: 0.239006 },
    { units: 'joule_kilocalorie', factor: 0.000239006 },
    { units: 'kilojoule_joule', factor: 1000 },
    { units: 'kilojoule_calorie', factor: 239.006 },
    { units: 'kilojoule_kilocalorie', factor: 0.239006 },
    { units: 'calorie_joule', factor: 4.184 },
    { units: 'calorie_kilojoule', factor: 0.004184 },
    { units: 'calorie_kilocalorie', factor: 0.001 },
    { units: 'kilocalorie_joule', factor: 4184 },
    { units: 'kilocalorie_kilojoule', factor: 4.184 },
    { units: 'kilocalorie_calorie', factor: 1000 },
  ]
  // call on render and state changes
  useEffect(() => {
    // if unit types and both units are filled out, set the conversion factor
    if (unitType !== '' && unit1 !== '' && unit2 !== '') {
      let multiple = 0
      if (unit1 === unit2) {
        multiple = 1
      } else {
        let unitCombo = unit1 + '_' + unit2
        let combo = conversionFactors.find(item => item.units === unitCombo)
        multiple = combo.factor
      }
      // based on val1 and the conversion factor, set val2
      setValues({ ...values, val2: +parseFloat(values.val1 * multiple).toFixed(9) })
      setConversionFactor(+parseFloat(multiple).toFixed(9))
    }
    // call on each value change
  }, [values, unitType, unit1, unit2])

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