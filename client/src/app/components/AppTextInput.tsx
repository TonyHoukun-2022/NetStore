import { TextField } from '@mui/material'
import { UseControllerProps, useController } from 'react-hook-form'

interface Props extends UseControllerProps {
  label: string
  multiline?: boolean
  rows?: number
  type?: string
}

const AppTextInput = (props: Props) => {
  const { fieldState, field } = useController({
    ...props,
    defaultValue: ''
  })

  return (
    <TextField
      {...props}
      {...field}
      //set if is textarea
      multiline={props.multiline}
      rows={props.rows}
      type={props.type}
      fullWidth
      variant='outlined'
      //!! convert non-bool to bool
      //if has error, fieldState.error is an obj, which convert to true in bool
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  )
}

export default AppTextInput