import { Typography, Grid, Paper, Box, Button } from '@mui/material'
import { FieldValues, useForm } from 'react-hook-form'
import AppTextInput from '../../app/components/AppTextInput'
import { Product } from '../../app/models/product'
import { useEffect } from 'react'
import useProducts from '../../app/hooks/useProducts'
import AppSelectList from '../../app/components/AppSelectList'
import AppDropZone from '../../app/components/AppDropZone'
import { yupResolver } from '@hookform/resolvers/yup'
import { productValidationSchema } from './productValidation'
import requestAgent from '../../app/api/agent'
import { useAppDispatch } from '../../app/store/configureStore'
import { setProduct } from '../catalog/CatalogSlice'
import { LoadingButton } from '@mui/lab'

interface Props {
  product?: Product
  cancelEdit: () => void
}

export default function ProductForm({ product, cancelEdit }: Props) {
  const dispatch = useAppDispatch()
  const { control, reset, handleSubmit, watch, formState: { isDirty, isSubmitting } } = useForm({
    resolver: yupResolver(productValidationSchema)
  })

  const { brands, types } = useProducts()
  const watchFile = watch('pictureFile', null)

  useEffect(() => {
    //if product passed in, and pictureFile field is empty, reset the form state with product props
    if (product && !watchFile && !isDirty) reset(product)

    //clean up when comp destroyed
    return () => {
      //remove the existed watchFile
      if (watchFile) URL.revokeObjectURL(watchFile.preview)
    }
  }, [product, reset, watchFile, isDirty])

  const handleSubmitData = async (data: FieldValues) => {
    try {
      let res: Product
      console.log(data)

      if (!product) {
        res = await requestAgent.Admin.createProduct(data)
      } else {
        res = await requestAgent.Admin.updateProduct(data)
      }
      dispatch(setProduct(res))
      //leave form
      cancelEdit()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant='h4' gutterBottom sx={{ mb: 4 }}>
        Product Details
      </Typography>
      <Box component='form' onSubmit={handleSubmit(handleSubmitData)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppTextInput control={control} name='name' label='Product name' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppSelectList control={control} items={brands} name='brand' label='Brand' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppSelectList control={control} items={types} name='type' label='Type' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput type='number' control={control} name='price' label='Price' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput type='number' control={control} name='quantityInStock' label='Quantity in Stock' />
          </Grid>
          <Grid item xs={12}>
            <AppTextInput
              multiline={true}
              rows={4}
              control={control}
              name='description'
              label='Description'
            />
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <AppDropZone control={control} name='pictureFile' />
              {watchFile ? (
                <img src={watchFile.preview} alt="preview" style={{ maxHeight: 200 }} />
              ) : (
                <img src={product?.pictureUrl} alt={product?.name} style={{ maxHeight: 200 }} />
              )}
            </Box>
          </Grid>
        </Grid>
        <Box display='flex' justifyContent='space-between' sx={{ mt: 3 }}>
          <Button onClick={cancelEdit} variant='contained' color='inherit'>
            Cancel
          </Button>
          <LoadingButton loading={isSubmitting} type='submit' variant='contained' color='success'>
            Submit
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  )
}
