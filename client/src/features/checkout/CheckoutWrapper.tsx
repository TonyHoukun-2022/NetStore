import { Elements } from '@stripe/react-stripe-js'
import CheckoutPage from './CheckoutPage'
import { loadStripe } from '@stripe/stripe-js'
import { useAppDispatch } from '../../app/store/configureStore'
import { useEffect, useState } from 'react'
import requestAgent from '../../app/api/agent'
import { setBasket } from '../basket/BasketSlice'
import LoadingComponent from '../../app/layout/LoadingComponent'

//load with public key
const stripePromise = loadStripe('pk_test_51MYqZpB8GgttUliNyEmfMbKIiCBO9Qo09nzn7PuGrYxCxDThqDdyFz20QutWBm0bdUGsiYZOieSGl29LS5b3skQo00Kj9jH4Cq')

const CheckoutWrapper = () => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    requestAgent.Payment.createPaymentIntent()
      .then(basket => {
        dispatch(setBasket(basket))
        setLoading(false)
      })
      .catch(error => console.log(error))
      .finally(() => setLoading(false))
  }, [dispatch])

  if (loading) return <LoadingComponent message='Loading checkout ...' />

  return (
    //provide stripe wrapper for checkoutpage,  
    // can use stripe element like CardNumberElement from stripe
    //so let stripe to handle card secret input fields
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  )
}

export default CheckoutWrapper