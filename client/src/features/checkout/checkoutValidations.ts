/**
 * React hook form -> SchemaValidation with yup
 */
import * as yup from 'yup'

export const validationSchemas = [
  //schema for address form
  yup.object({
    //field names strictly match
    fullName: yup.string().required('Full name is required'),
    address1: yup.string().required('Address line 1 is required'),
    address2: yup.string().required('Address line 2 is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    postcode: yup.string().required('Postcode is required'),
    country: yup.string().required('country is required'),
  }),
  //schema for review form
  yup.object({}),
  //schema for payment form
  yup.object({
    nameOnCard: yup.string().required('This field is required'),
  }),
]
