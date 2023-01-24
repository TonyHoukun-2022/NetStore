import { FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material'

interface Props {
  options: any[];
  onChange: (event: any) => void
  selectedVal: string
}

const RadioButtonGroup = ({ options, onChange, selectedVal }: Props) => {
  return (
    <FormControl>
      <RadioGroup onChange={onChange} value={selectedVal}>
        {options.map(({ value, label }) => (
          <FormControlLabel value={value} control={<Radio />} label={label} key={value} />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

export default RadioButtonGroup