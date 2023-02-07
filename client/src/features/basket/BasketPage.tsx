import { Button, Grid, Typography } from '@mui/material'
// import { useStoreContext } from '../../app/context/StoreContext'
import BasketSummary from './BasketSummary'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../app/store/configureStore'
import BasketTable from './BasketTable'

const BasketPage = () => {
  //use context
  // const { basket, setBasket, removeItem } = useStoreContext()

  //use redux
  const { basket, status } = useAppSelector(state => state.basket)

  const basketItems = basket?.items

  if (basketItems?.length === 0 || basketItems === undefined) return <Typography variant='h3'>Your basket is empty</Typography>


  return (
    <>
      <BasketTable
        items={basketItems}
        status={status}
      />
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary />
          <Button
            component={Link}
            to='/checkout'
            variant='contained'
            size='large'
            fullWidth
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </>

  )
}

export default BasketPage