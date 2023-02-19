import { UploadFile } from '@mui/icons-material'
import { FormControl, FormHelperText, Typography } from '@mui/material'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UseControllerProps, useController } from 'react-hook-form'

interface Props extends UseControllerProps { }

export default function AppDropZone(props: Props) {
  const { fieldState, field } = useController({ ...props, defaultValue: null })

  const styles = {
    display: 'flex',
    border: 'dashed 3px #eee',
    borderColor: '#eee',
    borderRadius: '5px',
    paddingTop: '30px',
    alginItems: 'center',
    height: 200,
    width: 500,
  }

  const activeStyles = {
    borderColor: 'green'
  }

  const onDrop = useCallback((acceptedFiles: any) => {
    //add prop preview into acceptedFiles[0] obj
    //preview => create url for image obj
    acceptedFiles[0] = Object.assign(acceptedFiles[0],
      { preview: URL.createObjectURL(acceptedFiles[0]) })
    //only allow 1 file for 1 drop
    field.onChange(acceptedFiles[0])
  }, [field])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()}>
      <FormControl style={isDragActive ? { ...styles, ...activeStyles } : styles} error={!!fieldState.error}>
        <input {...getInputProps()} />
        <UploadFile sx={{ fontSize: '100px', textAlign: 'center', margin: '0 auto' }} />
        <Typography variant='h4' textAlign='center'>Drop image here</Typography>
        <FormHelperText sx={{ textAlign: 'center' }}>{fieldState.error?.message}</FormHelperText>
      </FormControl>
    </div>
  )
}