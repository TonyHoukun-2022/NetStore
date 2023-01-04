import { Grid } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
}

export default function ProductList({ products }: Props) {
  return (
    //default theme => spacing = 4*8 =32px
    <Grid container spacing={4}>
      {products.map(product => (
        //sm=600px md=900px
        //each item has auto-layout size when >=xs andn <= xs
        //each line has 3 items >= sm & <= md
        //each line has 4 items >= md
        <Grid item xs sm={4} md={3} key={product.id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  )
}