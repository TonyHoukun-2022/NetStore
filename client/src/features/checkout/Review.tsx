import { Grid, Typography } from '@mui/material';
import BasketSummary from '../basket/BasketSummary';
import BasketTable from '../basket/BasketTable';
import { useAppSelector } from '../../app/store/configureStore';

export default function Review() {
  const { basket, status } = useAppSelector(state => state.basket)
  const items = basket?.items

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>

      {basket && <BasketTable
        items={items}
        status={status}
        isBasket={false}
      />
      }

      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary />
        </Grid>
      </Grid>
    </>
  );
}

