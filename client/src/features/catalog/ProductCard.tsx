import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
// import { useStoreContext } from "../../app/context/StoreContext";
import { currencyFormat } from "../../app/utils/util";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync } from "../basket/BasketSlice";


interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { status } = useAppSelector(state => state.basket)
  //use context
  // const { setBasket } = useStoreContext()

  //use redux
  const dispatch = useAppDispatch()


  return (
    //Media Card sample
    <Card>
      <CardHeader
        //avatar 
        avatar={
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            {product.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={product.name}
        titleTypographyProps={{
          sx: { fontWeight: 'bold', color: 'primary.main' }
        }}
      />
      <CardMedia
        sx={{ height: 140, backgroundSize: 'contain', bgcolor: 'primary.light' }}
        image={product.pictureUrl}
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom color='secondary.dark' variant="h5">
          {currencyFormat(product.price)}
        </Typography>
        <Typography variant="body2" component='p' color="text.secondary">
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton
          loading={status === `pendingAddItem${product.id}`}
          onClick={() => dispatch(addBasketItemAsync({ productId: product.id }))}
          size="small"
        >
          Add to cart
        </LoadingButton>
        <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
      </CardActions>
    </Card>
  )
}