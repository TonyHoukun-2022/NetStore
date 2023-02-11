import { Box, Button, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchemas } from "./checkoutValidations";
import requestAgent from "../../app/api/agent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { clearBasket } from "../basket/BasketSlice";
import { LoadingButton } from "@mui/lab";
import { StripeElementType } from "@stripe/stripe-js";
import { CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";

const steps = ['Shipping address', 'Review your order', 'Payment details'];

export type CardState = {
  elementError: {
    [key in StripeElementType]?: string
  }
}

export type CardCompleteState = {
  //following props from StripeElementType
  cardNumber: boolean,
  cardExpiry: boolean,
  cardCvc: boolean,
}

export default function CheckoutPage() {
  const dispatch = useAppDispatch()
  const { basket } = useAppSelector(state => state.basket)

  const [activeStep, setActiveStep] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0)
  const [loading, setLoading] = useState(false)
  const [paymentMsg, setPaymentMsg] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const stripe = useStripe()
  const elements = useElements()

  const methods = useForm({
    mode: 'all',
    //apply yup validation -> validate each form inside FormProvider
    resolver: yupResolver(
      validationSchemas[activeStep]
    )
  })

  //pre-populate user address info if user saveAddress for the last checkout
  useEffect(() => {
    requestAgent.Account.getAddress()
      .then(data => {
        if (data) {
          methods.reset({
            ...methods.getValues(),
            ...data,
            saveAddress: false
          })
        }
      })
  }, [methods])

  const submitOrder = async (data: FieldValues) => {
    setLoading(true)
    //data covers all field values from 3 forms
    const { nameOnCard, saveAddress, ...shippingAddress } = data
    // Stripe.js has not yet loaded.
    // Make sure to disable order submission until Stripe.js has loaded.
    if (!stripe || !elements) return
    try {
      //get the card info
      const cardEl = elements.getElement(CardNumberElement)

      const paymentResult = await stripe.confirmCardPayment(basket?.clientSecret!, {
        payment_method: {
          card: cardEl!,
          billing_details: {
            name: nameOnCard
          }
        }
      })

      // console.log(paymentResult)

      if (paymentResult.paymentIntent?.status === 'succeeded') {
        const orderNumber = await requestAgent.Orders.create({ saveAddress, shippingAddress })
        setPaymentSuccess(true)
        setPaymentMsg('Thank you - we have received your payment')
        setOrderNumber(orderNumber)
        setActiveStep(activeStep + 1)
        dispatch(clearBasket())
        setLoading(false)
      } else {
        setPaymentMsg(paymentResult.error?.message!)
        setPaymentSuccess(false)
        setLoading(false)
        setActiveStep(activeStep + 1)
      }

    } catch (error) {
      console.log(error)
      setLoading(false)
    }

  }

  const handleNext = async (data: FieldValues) => {
    //payment form
    if (activeStep === steps.length - 1) {
      await submitOrder(data)
    } else {
      setActiveStep(activeStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  //return type boolean
  const submitBtnDisabled = (): boolean => {
    //payment form
    if (activeStep === steps.length - 1) {
      return !cardComplete.cardCvc
        || !cardComplete.cardExpiry
        || !cardComplete.cardNumber
        || !methods.formState.isValid
    } else {
      return !methods.formState.isValid
    }

  }

  //valid schemas with stripe for paymentForm card payment
  const [cardState, setCardState] = useState<CardState>({ elementError: {} })

  const [cardComplete, setCardComplete] = useState<CardCompleteState>({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false
  })

  const onCardInputChange = (event: any) => {
    setCardState({
      ...cardState,
      elementError: {
        ...cardState.elementError,
        [event.elementType]: event.error?.message
      }
    })
    setCardComplete({
      ...cardComplete,
      [event.elementType]: event.complete
    })
  }

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <AddressForm />;
      case 1:
        return <Review />;
      case 2:
        return <PaymentForm cardState={cardState} onCardInputChange={onCardInputChange} />;
      default:
        throw new Error('Unknown step');
    }
  }

  return (
    //react hook form -> useFormContext
    <FormProvider
      {...methods}
    >
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h4" align="center">
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <>
          {/* final review step  */}
          {activeStep === steps.length ? (
            <>
              <Typography variant="h5" gutterBottom>
                {paymentMsg}
              </Typography>
              {paymentSuccess ? (
                <Typography variant="subtitle1">
                  You have successfully placed your order, and your order number is #{orderNumber}.
                </Typography>
              ) : (
                <Button variant="contained" onClick={handleBack}>
                  Go back and try again
                </Button>
              )}

            </>
          ) : (
            <Box component="form" onSubmit={methods.handleSubmit(handleNext)}>

              {/* display step content  */}
              {getStepContent(activeStep)}

              {/* forward and back btns  */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <LoadingButton
                  loading={loading}
                  disabled={submitBtnDisabled()}
                  variant="contained"
                  type="submit"
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                </LoadingButton>
              </Box>
            </Box>
          )}
        </>
      </Paper>
    </FormProvider>
  );
}
