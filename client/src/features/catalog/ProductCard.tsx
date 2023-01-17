import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import { useState } from "react";
import requestAgent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext";
import { currencyFormat } from "../../app/utils/util";


interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const [loading, setLoading] = useState(false)
  const { setBasket } = useStoreContext()

  const handleAddItem = (productId: number) => {
    setLoading(true)
    requestAgent.Basket.addItem(productId)
      .then(basket => setBasket(basket))
      .catch(error => console.log(error))
      .finally(() => setLoading(false))
  }

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
          loading={loading}
          onClick={() => handleAddItem(product.id)}
          size="small"
        >
          Add to cart
        </LoadingButton>
        <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
      </CardActions>
    </Card>
  )
}