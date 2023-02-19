import * as yup from 'yup'

export const productValidationSchema = yup.object({
  name: yup.string().required(),
  brand: yup.string().required(),
  type: yup.string().required(),
  price: yup.number().required().moreThan(100),
  quantityInStock: yup.number().required().min(0),
  description: yup.string().required(),
  pictureFile: yup.mixed().when('pictureUrl', {
    //when pictureUrl of upload img is empty
    is: (value: string) => !value,
    //then incur error
    then: (schema) => schema.required('Please provide an image'),
  }),
})
