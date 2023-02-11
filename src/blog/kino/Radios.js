import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function ControlledRadioButtonsGroup({ value, handleChange }) {
  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value="Week" control={<Radio />} label="Week" />
        <FormControlLabel value="Month" control={<Radio />} label="Month" />
        <FormControlLabel value="Year" control={<Radio />} label="Year" />
      </RadioGroup>
    </FormControl>
  );
}
