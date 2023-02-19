import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material'
import { UseControllerProps, useController } from 'react-hook-form'

interface Props extends UseControllerProps {
  label: string
  items: string[]
}

const AppSelectList = (props: Props) => {
  const { fieldState, field } = useController({ ...props, defaultValue: '' })

  return (
    //if fieldState.error obj exist, then true
    <FormControl fullWidth error={!!fieldState.error}>
      <InputLabel>{props.label}</InputLabel>
      <Select
        //input val
        value={field.value}
        label={props.label}
        //send val to hook form
        onChange={field.onChange}
      >
        {props.items.map((item, index) => (
          <MenuItem key={index} value={item}>{item}</MenuItem>
        ))}
      </Select>
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  )
}

export default AppSelectList